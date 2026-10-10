// GitHub 同步的純邏輯（網路與授權另外寫）：專案 ↔ repo 路徑、三方合併的決策、記憶逐行合併、git blob sha。
// 規格：.claude/notes/projects.md 的 P3。repo 結構：
//   projects/<專案 id>/project.json      { id, name, skills }
//   projects/<專案 id>/INSTRUCTIONS.md
//   projects/<專案 id>/MEMORY.md          一行一條「- …」
//   projects/<專案 id>/files/<檔名>       只收這一層（更深的子資料夾略過）
import type { Project } from "./projects";

export const ROOT = "projects/";
export type Shas = Map<string, string>; // repo 路徑 → blob sha（或任何代表內容的雜湊：只拿來比相不相同）

export const projectDir = (id: string) => `${ROOT}${id}/`;

// 路徑屬於哪個專案、是哪一種檔；不是我們管的路徑回 null（README、別的資料夾、files/ 底下的子資料夾）
export function parsePath(path: string): { id: string; kind: "meta" | "instructions" | "memory" | "file"; name?: string } | null {
  if (!path.startsWith(ROOT)) return null;
  const [id, ...rest] = path.slice(ROOT.length).split("/");
  if (!/^[0-9a-f-]{36}$/.test(id) || !rest.length) return null;
  if (rest.length === 1) {
    if (rest[0] === "project.json") return { id, kind: "meta" };
    if (rest[0] === "INSTRUCTIONS.md") return { id, kind: "instructions" };
    if (rest[0] === "MEMORY.md") return { id, kind: "memory" };
    return null;
  }
  if (rest.length === 2 && rest[0] === "files" && rest[1]) return { id, kind: "file", name: rest[1] };
  return null;
}

export const metaJson = (p: Pick<Project, "id" | "name" | "skills">) => `${JSON.stringify({ id: p.id, name: p.name, skills: p.skills ?? null }, null, 2)}\n`;
export const memoryMd = (memories: string[]) => memories.map((m) => `- ${m}`).join("\n") + (memories.length ? "\n" : "");
export const parseMemoryMd = (text: string) => text.split("\n").map((l) => l.match(/^- (.+)$/)?.[1]?.trim()).filter((x): x is string => !!x);

// 記憶逐行合併：遠端的順序為主；任一邊刪掉的就刪，任一邊新增的都留
export function mergeMemories(base: string[], local: string[], remote: string[]): string[] {
  const dropped = new Set([...base.filter((m) => !local.includes(m)), ...base.filter((m) => !remote.includes(m))]);
  const out = remote.filter((m) => !dropped.has(m));
  for (const m of local) if (!out.includes(m) && !dropped.has(m)) out.push(m);
  return out;
}

// 單一路徑的三方合併決策（只比雜湊；要內容才能決定的回 "merge"／"conflict"／"fork"，由呼叫端抓內容處理）
//   same：兩邊一樣，不用動；local：用本機的（要推）；remote：用遠端的（要拉）；
//   merge：記憶兩邊都改，逐行合併；conflict：指示或 project.json 兩邊都改，先用遠端、本機留成衝突副本；
//   fork：同一個檔名兩邊內容不同，遠端留在原名、本機的改名另存（不會有人的內容被蓋掉）
export type Decision = "same" | "local" | "remote" | "merge" | "conflict" | "fork";
export function decide(path: string, base?: string, local?: string, remote?: string): Decision {
  if (local === remote) return "same";
  if (local === base) return "remote";
  if (remote === base) return "local";
  const kind = parsePath(path)?.kind;
  if (kind === "memory") return "merge";
  if (kind === "file") {
    if (local === undefined) return "remote"; // 一邊刪、一邊改：留著改過的那份，資料不會不見
    if (remote === undefined) return "local";
    return "fork";
  }
  return "conflict";
}

const byProject = (shas: Shas) => {
  const out = new Map<string, Shas>();
  for (const [path, sha] of shas) {
    const p = parsePath(path);
    if (!p) continue;
    if (!out.has(p.id)) out.set(p.id, new Map());
    out.get(p.id)!.set(path, sha);
  }
  return out;
};
const sameShas = (a?: Shas, b?: Shas) => !!a && !!b && a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);

// 整個專案的去留（逐路徑合併之前先決定）：一邊刪掉整個專案、另一邊沒動＝刪；另一邊改過＝整個留下（刪除不會吃掉別人的修改）
export type ProjectFate = "merge" | "delete" | "keepLocal" | "keepRemote";
export function projectFates(base: Shas, local: Shas, remote: Shas): Map<string, ProjectFate> {
  const [B, L, R] = [byProject(base), byProject(local), byProject(remote)];
  const out = new Map<string, ProjectFate>();
  for (const id of new Set([...B.keys(), ...L.keys(), ...R.keys()])) {
    const [b, l, r] = [B.get(id), L.get(id), R.get(id)];
    if (l && r) out.set(id, "merge");
    else if (l) out.set(id, !b ? "keepLocal" : sameShas(l, b) ? "delete" : "keepLocal"); // 遠端沒有：新建的推上去；遠端刪掉的看本機有沒有改
    else if (r) out.set(id, !b ? "keepRemote" : sameShas(r, b) ? "delete" : "keepRemote");
    // 兩邊都沒有：已經刪乾淨
  }
  return out;
}

// git 的 blob sha：sha1("blob <位元組長度>" + NUL + 內容)，跟 GitHub 樹裡的 sha 一樣，本機不用上傳就知道內容有沒有變
export async function blobSha(content: string): Promise<string> {
  const body = new TextEncoder().encode(content);
  const head = new TextEncoder().encode(`blob ${body.length}${String.fromCharCode(0)}`);
  const all = new Uint8Array(head.length + body.length);
  all.set(head);
  all.set(body, head.length);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-1", all))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
