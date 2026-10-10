// 專案同步用的 GitHub App：授權（launchWebAuthFlow＋PKCE＋state）、token 更新、repo 檢查、讀樹與寫入。
// 規格：.claude/notes/projects.md 的 P3；每個 API 行為的出處：.claude/notes/github-sync-research.md。
// client secret 內建（2026-10-10 使用者決定）：GitHub 對公開客戶端的立場是 secret 不算機密，而授權碼只會送到 <擴充功能 ID>.chromiumapp.org。
// token 權限只到使用者安裝 App 時選的那一個 repo（Contents 讀寫＋Metadata 唯讀）。agent 沒有任何工具碰得到這裡。
import type { Shas } from "./github-sync";

declare const BA_GITHUB_CLIENT_ID: string; // esbuild define（scripts/build.mjs）；空字串＝這個 build 沒設定 GitHub App，同步功能不出現
declare const BA_GITHUB_CLIENT_SECRET: string;
declare const BA_GITHUB_APP: string; // App 的 slug：安裝頁網址用
declare const BA_GITHUB_WEB: string; // e2e 換成本機的假 GitHub
declare const BA_GITHUB_API: string;
const def = (v: string | undefined, d: string) => (v === undefined ? d : v);
export const GH = {
  clientId: def(typeof BA_GITHUB_CLIENT_ID !== "undefined" ? BA_GITHUB_CLIENT_ID : undefined, ""),
  secret: def(typeof BA_GITHUB_CLIENT_SECRET !== "undefined" ? BA_GITHUB_CLIENT_SECRET : undefined, ""),
  app: def(typeof BA_GITHUB_APP !== "undefined" ? BA_GITHUB_APP : undefined, ""),
  web: def(typeof BA_GITHUB_WEB !== "undefined" ? BA_GITHUB_WEB : undefined, "https://github.com").replace(/\/+$/, ""),
  api: def(typeof BA_GITHUB_API !== "undefined" ? BA_GITHUB_API : undefined, "https://api.github.com").replace(/\/+$/, ""),
};
export const githubConfigured = () => !!(GH.clientId && GH.secret && GH.app);

export type GhTokens = { access: string; accessExp: number; refresh: string; refreshExp: number };
export type GhRepo = { owner: string; repo: string; branch: string; installationId: number };
export class GhError extends Error {
  constructor(public code: "auth" | "repo" | "public" | "collaborators" | "push" | "conflict" | "rate" | "network" | "http", message: string, public status?: number) { super(message); }
}

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const random = (n: number) => b64url(crypto.getRandomValues(new Uint8Array(n)));

// ---------- token：access 放 storage.session（關瀏覽器就沒了），refresh 放 storage.local ----------

async function loadTokens(): Promise<GhTokens | null> {
  const [{ ghAccess }, { ghRefresh }] = (await Promise.all([chrome.storage.session.get("ghAccess"), chrome.storage.local.get("ghRefresh")])) as Record<string, { token: string; exp: number } | undefined>[];
  if (!ghRefresh) return null;
  return { access: ghAccess?.token ?? "", accessExp: ghAccess?.exp ?? 0, refresh: ghRefresh.token, refreshExp: ghRefresh.exp };
}
async function saveTokens(t: GhTokens) {
  await chrome.storage.session.set({ ghAccess: { token: t.access, exp: t.accessExp } });
  await chrome.storage.local.set({ ghRefresh: { token: t.refresh, exp: t.refreshExp } });
}
export async function clearTokens() {
  await chrome.storage.session.remove("ghAccess");
  await chrome.storage.local.remove(["ghRefresh", "ghRepo", "ghSync"]);
}

type TokenResponse = { access_token?: string; expires_in?: number; refresh_token?: string; refresh_token_expires_in?: number; error?: string; error_description?: string };
async function tokenRequest(body: Record<string, string>): Promise<GhTokens> {
  let res: Response;
  try {
    res = await fetch(`${GH.web}/login/oauth/access_token`, { method: "POST", credentials: "omit", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ client_id: GH.clientId, client_secret: GH.secret, ...body }) });
  } catch {
    throw new GhError("network", "連不到 GitHub");
  }
  // GitHub 的錯誤也回 200，內容帶 error：一律看內容
  const j = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || j.error || !j.access_token || !j.refresh_token) throw new GhError("auth", j.error_description || j.error || `GitHub 授權失敗（HTTP ${res.status}）`, res.status);
  const now = Date.now();
  return { access: j.access_token, accessExp: now + (j.expires_in ?? 28800) * 1000, refresh: j.refresh_token, refreshExp: now + (j.refresh_token_expires_in ?? 15897600) * 1000 };
}

// 授權視窗：PKCE（S256）＋state；回傳 token 並存起來
export async function authorize(): Promise<void> {
  const verifier = random(32);
  const challenge = b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  const state = random(16);
  const redirect = chrome.identity.getRedirectURL();
  const url = `${GH.web}/login/oauth/authorize?${new URLSearchParams({ client_id: GH.clientId, redirect_uri: redirect, state, code_challenge: challenge, code_challenge_method: "S256" })}`;
  let back: string | undefined;
  try {
    back = await chrome.identity.launchWebAuthFlow({ url, interactive: true });
  } catch {
    throw new GhError("auth", "授權視窗被關掉了");
  }
  const params = new URL(back ?? "").searchParams;
  if (params.get("state") !== state) throw new GhError("auth", "授權回應對不上這次的請求");
  const code = params.get("code");
  if (!code) throw new GhError("auth", params.get("error_description") || "GitHub 沒有給授權碼");
  await saveTokens(await tokenRequest({ code, redirect_uri: redirect, code_verifier: verifier }));
}

// 取得能用的 access token：快過期就用 refresh token 換。refresh token 只能用一次，
// 多個視窗的側邊欄同時換會互相作廢，所以用 Web Locks 單飛，拿到鎖之後再讀一次（可能別的視窗剛換好）
let inflight: Promise<string> | null = null;
export function accessToken(): Promise<string> {
  inflight ??= navigator.locks.request("ba-github-token", async () => {
    const t = await loadTokens();
    if (!t) throw new GhError("auth", "還沒連結 GitHub");
    if (t.access && t.accessExp > Date.now() + 60_000) return t.access;
    if (t.refreshExp <= Date.now()) throw new GhError("auth", "GitHub 授權過期了，請重新連結");
    const fresh = await tokenRequest({ grant_type: "refresh_token", refresh_token: t.refresh });
    await saveTokens(fresh);
    return fresh.access;
  }).finally(() => { inflight = null; });
  return inflight;
}

// 斷開：撤銷 token（不帶 Authorization 的 credentials/revoke；失敗不擋斷開），清掉本機的 token 與同步狀態
export async function revoke(): Promise<void> {
  const t = await loadTokens();
  if (t) {
    for (const credential of [t.access, t.refresh].filter(Boolean)) {
      try { await fetch(`${GH.api}/credentials/revoke`, { method: "POST", credentials: "omit", headers: { "Content-Type": "application/json", Accept: "application/vnd.github+json" }, body: JSON.stringify({ credential }) }); } catch { /* 撤銷失敗也要斷開 */ }
    }
  }
  await clearTokens();
}

// ---------- API ----------

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  let res: Response;
  try {
    res = await fetch(`${GH.api}${path}`, { ...init, credentials: "omit", headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", Authorization: `Bearer ${token}`, ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers } });
  } catch {
    throw new GhError("network", "連不到 GitHub");
  }
  if (res.status === 401) throw new GhError("auth", "GitHub 授權失效了，請重新連結", 401);
  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") throw new GhError("rate", "GitHub 的使用次數暫時用完了，等一下再同步", 403);
  if (res.status === 409 || res.status === 422) throw new GhError("conflict", "GitHub 上的內容剛被改過", res.status);
  if (!res.ok) throw new GhError("http", `GitHub 回應 HTTP ${res.status}`, res.status);
  return res.status === 204 ? (undefined as T) : res.json();
}

const enc = encodeURIComponent;

// 找到使用者安裝 App 時選的那一個 repo，並檢查：只選了一個、是私人的、可以寫、協作者只有本人
export async function findRepo(): Promise<GhRepo> {
  const inst = await api<{ installations: { id: number; repository_selection: string; app_slug?: string }[] }>("/user/installations");
  const mine = inst.installations.filter((i) => !i.app_slug || i.app_slug === GH.app);
  if (!mine.length) throw new GhError("repo", "還沒把 App 安裝到 repo");
  if (mine.some((i) => i.repository_selection !== "selected")) throw new GhError("repo", "安裝時要選「Only select repositories」，只給一個 repo");
  const repos = (await Promise.all(mine.map((i) => api<{ repositories: { name: string; owner: { login: string }; private: boolean; default_branch: string; permissions?: { push?: boolean } }[] }>(`/user/installations/${i.id}/repositories`).then((r) => r.repositories.map((x) => ({ ...x, installationId: i.id })))))).flat();
  if (repos.length !== 1) throw new GhError("repo", repos.length ? `App 能用的 repo 有 ${repos.length} 個，只能選一個` : "App 沒有選任何 repo");
  const r = repos[0];
  if (!r.private) throw new GhError("public", "同步的 repo 必須是私人的：公開 repo 會讓專案檔案變成公開資料");
  if (!r.permissions?.push) throw new GhError("push", "你對這個 repo 沒有寫入權限");
  const me = await api<{ login: string }>("/user");
  const collabs = await api<{ login: string }[]>(`/repos/${enc(r.owner.login)}/${enc(r.name)}/collaborators?per_page=100`);
  if (collabs.some((c) => c.login.toLowerCase() !== me.login.toLowerCase())) throw new GhError("collaborators", "這個 repo 除了你還有別人能寫：別人寫的指示會被當成你的指示，不能用來同步");
  return { owner: r.owner.login, repo: r.name, branch: r.default_branch, installationId: r.installationId };
}

const repoPath = (r: GhRepo) => `/repos/${enc(r.owner)}/${enc(r.repo)}`;

// 讀分支最新的 commit 與整棵樹（路徑 → blob sha）。樹被截斷就丟例外：拿不到完整的樹不能判斷「遠端刪掉了什麼」
export async function readTree(r: GhRepo): Promise<{ commit: string; tree: string; files: Shas } | null> {
  let ref: { object: { sha: string } };
  try {
    ref = await api(`${repoPath(r)}/git/ref/heads/${enc(r.branch)}`);
  } catch (e) {
    if (e instanceof GhError && (e.status === 404 || e.status === 409)) return null; // 空 repo：還沒有任何 commit
    throw e;
  }
  const commit = await api<{ tree: { sha: string } }>(`${repoPath(r)}/git/commits/${ref.object.sha}`);
  const tree = await api<{ tree: { path: string; type: string; sha: string }[]; truncated: boolean }>(`${repoPath(r)}/git/trees/${commit.tree.sha}?recursive=1`);
  if (tree.truncated) throw new GhError("http", "repo 裡的檔案太多，GitHub 沒有回傳完整的清單");
  return { commit: ref.object.sha, tree: commit.tree.sha, files: new Map(tree.tree.filter((x) => x.type === "blob").map((x) => [x.path, x.sha])) };
}

export async function readBlob(r: GhRepo, sha: string): Promise<string> {
  const b = await api<{ content: string; encoding: string }>(`${repoPath(r)}/git/blobs/${sha}`);
  if (b.encoding !== "base64") throw new GhError("http", "GitHub 回傳的檔案格式不對");
  const bin = atob(b.content.replace(/\n/g, ""));
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

// 空 repo 的 Git Data API 一律回 409：先用 Contents API 寫 README 建出第一個 commit
export const README = "# Browser Agent projects\n\nThis private repository is where the Browser Agent extension syncs your projects (instructions, memory and files).\nEach folder under `projects/` is one project. Edits you make here show up in the extension the next time it syncs.\nKeep this repository private, and don't add collaborators: anything written here is treated as your own instructions.\n";
export async function initRepo(r: GhRepo): Promise<void> {
  const bytes = new TextEncoder().encode(README);
  await api(`${repoPath(r)}/contents/README.md`, { method: "PUT", body: JSON.stringify({ message: "Set up Browser Agent project sync", content: btoa(String.fromCharCode(...bytes)), branch: r.branch }) });
}

// 一次 commit 多個改動（content: null＝刪除）。force: false：分支在這期間被別台推進就丟 conflict，由呼叫端重拉、重新合併
export async function commit(r: GhRepo, parent: { commit: string; tree: string }, changes: { path: string; content: string | null }[], message: string): Promise<string> {
  const tree = await api<{ sha: string }>(`${repoPath(r)}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: parent.tree, tree: changes.map((c) => ({ path: c.path, mode: "100644", type: "blob", ...(c.content === null ? { sha: null } : { content: c.content }) })) }) });
  const made = await api<{ sha: string }>(`${repoPath(r)}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: tree.sha, parents: [parent.commit] }) });
  await api(`${repoPath(r)}/git/refs/heads/${enc(r.branch)}`, { method: "PATCH", body: JSON.stringify({ sha: made.sha, force: false }) });
  return made.sha;
}

// 引導使用者自己建私人 repo、再把 App 安裝到那個 repo（第一版不讓 App 建 repo）
export const newRepoUrl = () => `${GH.web}/new?${new URLSearchParams({ name: "browser-agent-projects", visibility: "private", description: "Browser Agent project sync" })}`;
export const installUrl = () => `${GH.web}/apps/${enc(GH.app)}/installations/new`;
