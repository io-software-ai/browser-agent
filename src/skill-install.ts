// 把市面上的技能（Agent Skills 開放標準：一個資料夾＝SKILL.md＋references/、scripts/、assets/…）裝進來。
// 來源：本機資料夾、zip／.skill、GitHub（owner/repo[/技能]、tree／blob 網址）、skills.sh（網址或 npx skills add 指令）、
// ClawHub 頁面網址、直接指到 SKILL.md 或 zip 的網址。
// 附帶的文字檔存起來給模型按需讀（use_skill 帶 file）；scripts 也只存成文字，擴充功能沒有地方執行。
// 這裡沒有 chrome API，npm run check 直接 import 測。
import { parseSkill, type Skill } from "./skills";
import type { Key } from "./i18n";

// 跟 skills.sh 的 CLI 差不多的上限；chrome.storage.local 總共 10 MB，單一技能限 1 MB
export const LIMITS = { files: 100, fileBytes: 256 * 1024, skillBytes: 1024 * 1024, download: 10 * 1024 * 1024, unzipped: 25 * 1024 * 1024 };

export class InstallError extends Error {
  constructor(public key: Key, public params: Record<string, string | number> = {}) { super(key); }
}

// read 回 null＝不讀（太大、加密、不支援的壓縮）
export type Entry = { path: string; size: number; read: () => Promise<Uint8Array | null> };

const base = (p: string) => p.slice(p.lastIndexOf("/") + 1);
const dir = (p: string) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "");
const isSkillMd = (p: string) => base(p).toLowerCase() === "skill.md";
// 技能根目錄＝每個 SKILL.md 所在的資料夾（"" 是最外層）
export const skillRoots = (paths: string[]) => paths.filter(isSkillMd).map(dir);

// ---------- zip（.skill 也是 zip）----------

// 邊讀邊數，超過 cap 就停（解壓時宣告的大小可以造假；下載時 content-length 可以不給）
async function readCapped(stream: ReadableStream<Uint8Array>, cap: number): Promise<Uint8Array | null> {
  const reader = stream.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > cap) { await reader.cancel(); return null; }
    parts.push(value);
  }
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

// 只讀中央目錄，檔案內容等 read() 才解壓（bundle 用不到的檔不會解）
export function unzip(buf: ArrayBuffer): Entry[] {
  const v = new DataView(buf);
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 22 - 0xffff); i--) if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new InstallError("skills.errZip");
  const count = v.getUint16(eocd + 10, true);
  if (count > LIMITS.files * 10) throw new InstallError("skills.errTooBig");
  let p = v.getUint32(eocd + 16, true);
  let budget = LIMITS.unzipped;
  const out: Entry[] = [];
  for (let n = 0; n < count; n++) {
    if (p + 46 > buf.byteLength || v.getUint32(p, true) !== 0x02014b50 || p + 46 + v.getUint16(p + 28, true) > buf.byteLength) throw new InstallError("skills.errZip");
    const flags = v.getUint16(p + 8, true), method = v.getUint16(p + 10, true);
    const csize = v.getUint32(p + 20, true), size = v.getUint32(p + 24, true);
    const nlen = v.getUint16(p + 28, true), local = v.getUint32(p + 42, true);
    const path = new TextDecoder().decode(new Uint8Array(buf, p + 46, nlen));
    p += 46 + nlen + v.getUint16(p + 30, true) + v.getUint16(p + 32, true);
    if (path.endsWith("/")) continue; // 資料夾
    const ok = !(flags & 1) && (method === 0 || method === 8) && size <= LIMITS.fileBytes && local + 30 <= buf.byteLength; // 加密、zip64、其他壓縮法都不讀
    out.push({ path, size, read: async () => {
      if (!ok) return null;
      const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      if (start + csize > buf.byteLength) throw new InstallError("skills.errZip");
      const raw = new Uint8Array(buf, start, csize);
      const data = method === 0 ? raw.slice(0, LIMITS.fileBytes + 1) : await readCapped(new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw")), Math.min(LIMITS.fileBytes, budget));
      if (!data || data.length > LIMITS.fileBytes) return null;
      budget -= data.length;
      return data;
    } });
  }
  return out;
}

export const isZip = (b: Uint8Array) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;

// ---------- 檔案 → 技能 ----------

// 只收 UTF-8 文字檔（圖片、字型這類 assets 給不了模型）
function text(data: Uint8Array | null): string | null {
  if (!data || data.includes(0)) return null;
  try { return new TextDecoder("utf-8", { fatal: true }).decode(data); } catch { return null; }
}

// 每個 SKILL.md 一個技能，底下的檔案歸給最近的那個 SKILL.md。
// fallbackName：frontmatter 沒寫 name、SKILL.md 又在最外層時用（zip 檔名、ClawHub 的 slug）
export async function bundleSkills(entries: Entry[], source: (root: string) => string, fallbackName = ""): Promise<{ skills: Skill[]; skipped: string[] }> {
  const clean = entries
    .map((e) => ({ ...e, path: e.path.replace(/\\/g, "/").replace(/^\.?\//, "") }))
    .filter((e) => !e.path.split("/").some((s) => s === "__MACOSX" || s === ".." || s === "") && !base(e.path).startsWith("."));
  const roots = [...new Set(skillRoots(clean.map((e) => e.path)))].sort((a, b) => b.length - a.length); // 深的先比對
  const owner = (p: string) => roots.find((r) => r === "" || p.startsWith(r + "/"));
  const skills: Skill[] = [];
  const skipped: string[] = [];
  for (const root of roots) {
    const mine = clean.filter((e) => owner(e.path) === root);
    const md = mine.find((e) => isSkillMd(e.path) && dir(e.path) === root)!;
    const raw = text(await md.read());
    const skill = raw == null ? null : parseSkill(raw, base(root) || fallbackName);
    if (!skill?.name || !skill.body) { skipped.push(md.path); continue; }
    const files: Record<string, string> = {};
    let bytes = raw!.length;
    for (const e of mine) {
      if (e === md) continue;
      const rel = root ? e.path.slice(root.length + 1) : e.path;
      const body = Object.keys(files).length < LIMITS.files && bytes + e.size <= LIMITS.skillBytes ? text(await e.read()) : null;
      if (body == null || bytes + body.length > LIMITS.skillBytes) { skipped.push(e.path); continue; }
      files[rel] = body;
      bytes += body.length;
    }
    skills.push({ ...skill, description: skill.description.slice(0, 1024), source: source(root), ...(Object.keys(files).length ? { files } : {}) });
  }
  return { skills, skipped };
}

// ---------- 來源字串 → 要去哪裡抓 ----------

type Target =
  | { kind: "github"; owner: string; repo: string; ref?: string; path?: string; skill?: string }
  | { kind: "clawhub"; owner: string; slug: string }
  | { kind: "url"; url: string };

const SEG = /^[\w.-]+$/;

export function parseSource(input: string): Target | null {
  // skills.sh 頁面上給的是指令：npx skills add <來源> --skill <名稱>
  let s = input.trim().replace(/^npx\s+(?:-y\s+)?skills(?:@\S+)?\s+add\s+/, "");
  let skill: string | undefined;
  s = s.replace(/\s+(?:--skill|-s)\s+(\S+)/, (_, n) => { skill = n; return ""; }).trim();
  if (skill && !SEG.test(skill)) return null;
  const short = s.match(/^([\w.-]+)\/([\w.-]+)(?:\/([\w.-]+))?$/); // owner/repo[/技能]
  if (short && !s.includes("..")) return { kind: "github", owner: short[1], repo: short[2].replace(/\.git$/, ""), skill: short[3] ?? skill };
  let u: URL;
  try { u = new URL(s); } catch { return null; }
  if (u.protocol !== "https:") return null;
  const parts = u.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (!parts.every((x) => x !== ".." && x !== ".")) return null;
  const host = u.hostname.replace(/^www\./, "");
  if (host === "github.com" && parts.length >= 2 && SEG.test(parts[0]) && SEG.test(parts[1])) {
    const [owner, repo, kind, ref, ...rest] = parts;
    const t: Target = { kind: "github", owner, repo: repo.replace(/\.git$/, ""), skill };
    if ((kind === "tree" || kind === "blob") && ref) {
      t.ref = ref; // ponytail: 分支名稱有斜線（feature/x）會被切錯，要支援再去查 refs API
      const path = rest.join("/");
      t.path = kind === "blob" && isSkillMd(path) ? dir(path) : path;
    }
    return t;
  }
  // 每段都要驗：%2F 解碼後會變成 /，拼進 API 網址就抓到別的 repo，跟記下來的來源對不上
  if (host === "skills.sh" && parts.length >= 2 && parts.length <= 3 && parts.every((x) => SEG.test(x))) return { kind: "github", owner: parts[0], repo: parts[1], skill: parts[2] ?? skill };
  if (host === "clawhub.ai" && parts.length === 3 && parts[1] === "skills" && SEG.test(parts[0]) && SEG.test(parts[2])) return { kind: "clawhub", owner: parts[0], slug: parts[2] };
  if (["github.com", "skills.sh", "clawhub.ai"].includes(host)) return null; // 認得的網站但格式不對：不要當成直接網址抓它的 HTML
  return { kind: "url", url: u.href };
}

// ---------- 下載 ----------

async function get(url: string, signal?: AbortSignal): Promise<Uint8Array> {
  const res = await fetch(url, { signal, credentials: "omit", redirect: "follow" });
  if (!res.ok) throw new InstallError("skills.errHttp", { status: res.status });
  if (new URL(res.url).protocol !== "https:") throw new InstallError("skills.errSource"); // 轉址到 http 不跟
  const buf = res.body ? await readCapped(res.body, LIMITS.download) : new Uint8Array();
  if (!buf) throw new InstallError("skills.errTooBig");
  return buf;
}

const lastSeg = (url: string) => base(new URL(url).pathname).replace(/\.(zip|skill|md)$/i, "");

export async function fetchSkills(input: string, signal?: AbortSignal): Promise<{ skills: Skill[]; skipped: string[] }> {
  const t = parseSource(input);
  if (!t) throw new InstallError("skills.errSource");
  if (t.kind === "url" || t.kind === "clawhub") {
    const url = t.kind === "url" ? t.url : `https://clawhub.ai/api/v1/download?slug=${encodeURIComponent(t.slug)}&ownerHandle=${encodeURIComponent(t.owner)}`;
    const page = t.kind === "url" ? t.url : `https://clawhub.ai/${t.owner}/skills/${t.slug}`;
    const buf = await get(url, signal);
    // 直接網址：不是 zip 就要是有 frontmatter 的 SKILL.md（不然一般網頁的 HTML 也會被當成技能）
    if (!isZip(buf) && !/^\uFEFF?---\r?\n/.test(new TextDecoder().decode(buf.subarray(0, 8)))) throw new InstallError("skills.errNotFound");
    const entries = isZip(buf) ? unzip(buf.buffer as ArrayBuffer) : [{ path: "SKILL.md", size: buf.length, read: async () => buf }];
    const out = await bundleSkills(entries, () => page, t.kind === "url" ? lastSeg(t.url) : t.slug);
    if (!out.skills.length) throw new InstallError("skills.errNotFound");
    return out;
  }
  // GitHub：一次拿整棵樹找 SKILL.md（匿名 API 每小時 60 次），檔案從 raw 抓（不吃 API 額度）
  const ref = t.ref ?? "HEAD";
  const res = await fetch(`https://api.github.com/repos/${t.owner}/${t.repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`, { signal, credentials: "omit" });
  if (!res.ok) throw new InstallError("skills.errHttp", { status: res.status });
  const blobs = ((await res.json()).tree as { path: string; type: string; size?: number }[]).filter((x) => x.type === "blob");
  const roots = skillRoots(blobs.map((b) => b.path))
    .filter((r) => !t.path || r === t.path || r.startsWith(t.path + "/"))
    .filter((r) => !t.skill || (base(r) || t.repo) === t.skill); // 放在 repo 最外層的技能用 repo 名稱指定
  if (!roots.length) throw new InstallError("skills.errNotFound");
  if (roots.length > 1) throw new InstallError("skills.errMany", { names: roots.map((r) => base(r) || t.repo).join(", ") });
  const root = roots[0];
  const raw = (p: string) => `https://raw.githubusercontent.com/${t.owner}/${t.repo}/${encodeURIComponent(ref)}/${p.split("/").map(encodeURIComponent).join("/")}`;
  const entries: Entry[] = blobs
    .filter((b) => !root || b.path.startsWith(root + "/"))
    .map((b) => ({ path: b.path, size: b.size ?? 0, read: () => ((b.size ?? 0) > LIMITS.fileBytes ? Promise.resolve(null) : get(raw(b.path), signal)) }));
  const src = (r: string) => `https://github.com/${t.owner}/${t.repo}/tree/${ref}${r ? `/${r}` : ""}`;
  const out = await bundleSkills(entries, src, t.repo);
  out.skills = out.skills.filter((s) => s.source === src(root)); // 技能資料夾裡又包了別的技能：只裝指定的那個
  return out;
}

// 本機選的資料夾（<input webkitdirectory>）：路徑用 webkitRelativePath
export const folderEntries = (files: File[]): Entry[] =>
  files.map((f) => ({ path: f.webkitRelativePath || f.name, size: f.size, read: async () => (f.size > LIMITS.fileBytes ? null : new Uint8Array(await f.arrayBuffer())) }));
