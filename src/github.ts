// 專案綁 GitHub repo 用的 GitHub App：授權（launchWebAuthFlow＋PKCE＋state）、token 更新、列出 repo、repo 是不是私人的、讀檔、寫檔。
// 規格：.claude/notes/projects.md 的 P3；每個 API 行為的出處：.claude/notes/github-sync-research.md。
// client secret 內建（2026-10-10 使用者決定）：GitHub 對公開客戶端的立場是 secret 不算機密，而授權碼只會送到 <擴充功能 ID>.chromiumapp.org。
// token 權限只到使用者安裝 App 時選的 repo（Contents 讀寫＋Metadata 唯讀；不申請 Workflows，GitHub 本身會擋寫 .github/workflows）。
// agent 只能透過 tools.ts 的 list／read／write_repo_file 間接用到這裡，每次寫入都要使用者確認。

declare const BA_GITHUB_CLIENT_ID: string; // esbuild define（scripts/build.mjs）；空字串＝這個 build 沒設定 GitHub App，相關入口不出現
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
export type RepoLink = { owner: string; name: string; branch: string }; // 專案綁的 repo 與分支
export type Visibility = "private" | "public" | "internal"; // internal＝企業內部（整個企業都看得到）
export type GhRepo = { owner: string; name: string; visibility: Visibility; defaultBranch: string; push: boolean };
const visibilityOf = (r: { private?: boolean; visibility?: string }): Visibility => (r.visibility === "public" || r.visibility === "internal" || r.visibility === "private" ? r.visibility : r.private ? "private" : "public");
export type GhErrorCode = "auth" | "conflict" | "forbidden" | "notfound" | "type" | "rate" | "network" | "http";
export class GhError extends Error {
  constructor(public code: GhErrorCode, message: string, public status?: number) { super(message); }
}

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const random = (n: number) => b64url(crypto.getRandomValues(new Uint8Array(n)));
// 大檔一次展開會超過函式參數上限：分段轉
const b64 = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};

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
  await chrome.storage.local.remove(["ghRefresh", "ghLogin"]);
  login = null;
  infoCache.clear();
}
export const hasTokens = async () => !!(await loadTokens());

type TokenResponse = { access_token?: string; expires_in?: number; refresh_token?: string; refresh_token_expires_in?: number; error?: string; error_description?: string };
async function tokenRequest(body: Record<string, string>): Promise<GhTokens> {
  let res: Response;
  try {
    res = await fetch(`${GH.web}/login/oauth/access_token`, { method: "POST", credentials: "omit", signal: AbortSignal.timeout(30_000), headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ client_id: GH.clientId, client_secret: GH.secret, ...body }) });
  } catch {
    throw new GhError("network", "連不到 GitHub");
  }
  // GitHub 的錯誤也回 200，內容帶 error：一律看內容。只有 GitHub 明確回了 OAuth 錯誤（bad_refresh_token…）才算授權失效（呼叫端會清掉 token）；
  // 回應不是 JSON（被公共 Wi-Fi 的登入頁、proxy 攔下）、5xx、429 都是暫時的，不清（第二輪 6）
  const j = (await res.json().catch(() => null)) as TokenResponse | null;
  if (!j) throw new GhError("network", `GitHub 的回應不是預期的格式（HTTP ${res.status}），可能是網路被攔下了`, res.status);
  if (j.error) throw new GhError(res.status >= 500 || res.status === 429 ? "http" : "auth", j.error_description || j.error, res.status);
  if (!res.ok || !j.access_token || !j.refresh_token) throw new GhError("http", `GitHub 授權失敗（HTTP ${res.status}）`, res.status);
  const now = Date.now();
  return { access: j.access_token, accessExp: now + (j.expires_in ?? 28800) * 1000, refresh: j.refresh_token, refreshExp: now + (j.refresh_token_expires_in ?? 15897600) * 1000 };
}

// 授權視窗：PKCE（S256）＋state；拿到 token 就存起來
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
    // refresh token 過期或被撤銷就清掉本機的 token：專案頁、設定頁才會出現「重新連結」（實作審查 C3）；連不到 GitHub 不清
    const fail = async (e: unknown) => { if (e instanceof GhError && e.code === "auth") await clearTokens(); throw e; };
    if (t.refreshExp <= Date.now()) return fail(new GhError("auth", "GitHub 授權過期了，請到專案頁重新連結"));
    const fresh = await tokenRequest({ grant_type: "refresh_token", refresh_token: t.refresh }).catch(fail);
    await saveTokens(fresh);
    return fresh.access;
  }).finally(() => { inflight = null; });
  return inflight;
}

// 斷開：清掉本機的 token，再撤銷 GitHub 那邊的（POST /credentials/revoke：body 是 {"credentials":[…]}、成功回 202、
// 帶 Authorization 會被拒（403）；2026-10-10 查過官方文件）。跟換 token 用同一把鎖：換到一半按斷開，新換到的那組也會被撤銷。
// 回傳 GitHub 那邊有沒有撤銷成功（失敗也照樣斷開，讓設定頁告訴使用者去 GitHub 撤銷）
export function revoke(): Promise<boolean> {
  return navigator.locks.request("ba-github-token", async () => {
    const t = await loadTokens();
    await clearTokens();
    if (!t) return true;
    try {
      const res = await fetch(`${GH.api}/credentials/revoke`, { method: "POST", credentials: "omit", signal: AbortSignal.timeout(30_000), headers: { "Content-Type": "application/json", Accept: "application/vnd.github+json" }, body: JSON.stringify({ credentials: [t.access, t.refresh].filter(Boolean) }) });
      return res.status === 202;
    } catch {
      return false;
    }
  });
}

// ---------- API ----------

async function request(path: string, init: RequestInit = {}, accept = "application/vnd.github+json", retry = true): Promise<Response> {
  const token = await accessToken();
  let res: Response;
  try {
    // 30 秒沒回應就放棄：repo 工具不會讓任務一直卡住（第二輪 6）
    res = await fetch(`${GH.api}${path}`, { ...init, credentials: "omit", signal: AbortSignal.timeout(30_000), headers: { Accept: accept, "X-GitHub-Api-Version": "2022-11-28", Authorization: `Bearer ${token}`, ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers } });
  } catch {
    throw new GhError("network", "連不到 GitHub（或超過 30 秒沒有回應）");
  }
  if (res.ok) return res;
  const msg = ((await res.json().catch(() => ({}))) as { message?: string }).message ?? "";
  if (res.status === 401) {
    // access token 被撤銷或過期：丟掉它重換一次；還是 401 就清掉全部 token，讓使用者重新連結（實作審查 C3）
    // 好幾個請求同時 401 時，只丟掉「這次用的那個」token（拿換 token 的鎖再看）：不然晚到的會把別人剛換好的新 token 也丟掉
    if (retry) {
      await navigator.locks.request("ba-github-token", async () => {
        const { ghAccess } = (await chrome.storage.session.get("ghAccess")) as { ghAccess?: { token: string } };
        if (ghAccess?.token === token) await chrome.storage.session.remove("ghAccess");
      });
      return request(path, init, accept, false);
    }
    await clearTokens();
    throw new GhError("auth", "GitHub 授權失效了，請到專案頁重新連結", 401);
  }
  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") throw new GhError("rate", "GitHub 的使用次數暫時用完了，等一下再試", 403);
  // 409＝檔案或分支在這期間被改過；422 且訊息提到 sha 也是同一件事（帶的舊 sha 對不上）
  if (res.status === 409 || (res.status === 422 && /sha/i.test(msg))) throw new GhError("conflict", "GitHub 上的這個檔案剛被改過，請重新讀取再寫", res.status);
  if (res.status === 403 || res.status === 422) throw new GhError("forbidden", `GitHub 拒絕了這次操作${msg ? `：${msg}` : ""}`, res.status); // 例如分支有保護規則
  if (res.status === 404) throw new GhError("notfound", "GitHub 上找不到，或 App 沒有這個 repo 的權限", 404);
  throw new GhError("http", `GitHub 回應 HTTP ${res.status}${msg ? `：${msg}` : ""}`, res.status);
}
export const api = async <T = any>(path: string, init: RequestInit = {}): Promise<T> => {
  const res = await request(path, init);
  return res.status === 204 ? (undefined as T) : res.json();
};

const enc = encodeURIComponent;
const encPath = (p: string) => p.split("/").map(enc).join("/");
const repoPath = (l: { owner: string; name: string }) => `/repos/${enc(l.owner)}/${enc(l.name)}`;

let login: string | null = null;
export async function me(): Promise<string> {
  if (login) return login;
  login = (await api<{ login: string }>("/user")).login;
  await chrome.storage.local.set({ ghLogin: login }); // 設定頁顯示「已連結 @帳號」
  return login;
}

// 分頁的清單：一頁 100 筆，最多 10 頁（實作審查 C5）
async function pages<T>(path: string, pick: (j: any) => T[]): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= 10; page++) {
    const items = pick(await api(`${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`));
    out.push(...items);
    if (items.length < 100) break;
  }
  return out;
}

// App 看得到的 repo：使用者安裝 App 時選的那些（可能跨好幾個帳號、組織）
export async function listRepos(): Promise<GhRepo[]> {
  const inst = await pages<{ id: number }>("/user/installations", (j) => j.installations);
  const lists = await Promise.all(inst.map((i) => pages<any>(`/user/installations/${i.id}/repositories`, (j) => j.repositories)));
  return lists.flat().map((r) => ({ owner: r.owner.login, name: r.name, visibility: visibilityOf(r), defaultBranch: r.default_branch, push: !!r.permissions?.push }));
}

export async function listBranches(l: { owner: string; name: string }): Promise<string[]> {
  return (await pages<{ name: string }>(`${repoPath(l)}/branches`, (j) => j)).map((b) => b.name);
}

// 這個 repo 是不是私人的、有沒有開 Pages：確認卡的警告用（實作審查 S10：企業的 internal 不算私人；私人 repo 開了 Pages，網站還是公開的）。
// 任務開始時查，快取 5 分鐘；查不到回 {}（卡片改成「查不到是不是私人的」），不快取
// （CLAUDE.md 等等不再看這裡決定可不可信：實作審查 S3 之後一律當參考資料）
export type RepoInfo = { visibility?: Visibility; pages?: boolean };
const infoCache = new Map<string, Required<RepoInfo> & { at: number }>();
export async function repoInfo(l: { owner: string; name: string }): Promise<RepoInfo> {
  const key = `${l.owner}/${l.name}`.toLowerCase();
  const hit = infoCache.get(key);
  if (hit && Date.now() - hit.at < 300_000) return { visibility: hit.visibility, pages: hit.pages };
  try {
    const j = await api<{ private?: boolean; visibility?: string; has_pages?: boolean }>(repoPath(l));
    const out = { visibility: visibilityOf(j), pages: !!j.has_pages };
    infoCache.set(key, { at: Date.now(), ...out });
    return out;
  } catch {
    return {};
  }
}

// repo 有沒有 GitHub Actions 的 workflow：有的話 commit 可能馬上觸發 CI、執行改到的檔（實作審查 S5）。查不到回 undefined
export async function hasWorkflows(l: RepoLink): Promise<boolean | undefined> {
  try {
    return (await listDir(l, ".github/workflows")).some((x) => x.type === "file");
  } catch (e) {
    return e instanceof GhError && (e.code === "notfound" || e.code === "type") ? false : undefined;
  }
}

// 讀一個檔（不存在回 null）。資料夾、symlink、submodule 一律拒絕；1 MB 以上的檔 Contents API 不給內容，改用 raw 讀。
// symlink 指向一般檔案時，Contents API 直接回目標檔的內容、type 是 file（官方文件）：回應的 path 跟要的不同就當 symlink 拒絕（實作審查 S4）
export type RepoFile = { sha: string; size: number; bytes: Uint8Array };
export async function getFile(l: RepoLink, path: string): Promise<RepoFile | null> {
  let j: any;
  try {
    j = await api(`${repoPath(l)}/contents/${encPath(path)}?ref=${enc(l.branch)}`);
  } catch (e) {
    if (e instanceof GhError && e.status === 404) return null;
    throw e;
  }
  if (Array.isArray(j)) throw new GhError("type", `「${path}」是資料夾，不是檔案`);
  if (j.type !== "file") throw new GhError("type", `「${path}」不是一般檔案（${j.type}），不能讀寫`);
  if (j.path !== path) throw new GhError("type", `「${path}」是捷徑（symlink），不能讀寫`);
  const bytes = j.encoding === "base64" && j.content
    ? Uint8Array.from(atob(String(j.content).replace(/\n/g, "")), (c) => c.charCodeAt(0))
    : new Uint8Array(await (await request(`${repoPath(l)}/contents/${encPath(path)}?ref=${enc(l.branch)}`, {}, "application/vnd.github.raw+json")).arrayBuffer());
  return { sha: j.sha, size: j.size, bytes };
}

// 一層資料夾的內容
export async function listDir(l: RepoLink, path: string): Promise<{ path: string; type: string; size: number }[]> {
  const j = await api(`${repoPath(l)}/contents/${encPath(path)}?ref=${enc(l.branch)}`);
  if (!Array.isArray(j)) throw new GhError("type", `「${path}」是檔案，不是資料夾`);
  return j.map((x: any) => ({ path: x.path, type: x.type, size: x.size ?? 0 }));
}

// 整棵樹（只列檔案）。很大的 repo GitHub 會截斷：truncated 時呼叫端改用 listDir 一層一層看
// symlink（mode 120000）也是 blob：標出來，讀寫會被 getFile 擋
export async function listTree(l: RepoLink): Promise<{ files: { path: string; size: number; link: boolean }[]; truncated: boolean }> {
  const t = await api<{ tree: { path: string; type: string; mode: string; size?: number }[]; truncated: boolean }>(`${repoPath(l)}/git/trees/${enc(l.branch)}?recursive=1`);
  return { files: t.tree.filter((x) => x.type === "blob").map((x) => ({ path: x.path, size: x.size ?? 0, link: x.mode === "120000" })), truncated: !!t.truncated };
}

// 寫一個檔＝一個 commit（Contents API）。更新要帶讀到的舊 sha：這期間被別人改過就 409（conflict）
export async function putFile(l: RepoLink, path: string, text: string, message: string, sha?: string): Promise<{ commitSha: string; commitUrl: string }> {
  const body = { message, content: b64(new TextEncoder().encode(text)), branch: l.branch, ...(sha ? { sha } : {}) };
  const r = await api<{ commit: { sha: string; html_url: string } }>(`${repoPath(l)}/contents/${encPath(path)}`, { method: "PUT", body: JSON.stringify(body) });
  return { commitSha: r.commit.sha, commitUrl: r.commit.html_url };
}

export const repoUrl = (l: RepoLink) => `${GH.web}/${enc(l.owner)}/${enc(l.name)}/tree/${encPath(l.branch)}`;
export const fileUrl = (l: RepoLink, path: string, edit = false) => `${GH.web}/${enc(l.owner)}/${enc(l.name)}/${edit ? "edit" : "blob"}/${encPath(l.branch)}/${encPath(path)}`;
export const installUrl = () => `${GH.web}/apps/${enc(GH.app)}/installations/new`;
