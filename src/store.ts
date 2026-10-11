// 全域狀態：一個可變物件 S＋版本號。改完 S 呼叫 emit()，React 元件用 useStore() 訂閱後直接讀 S。
// ponytail: 整棵樹一起重繪，串流時每幀最多一次（emitSoon）；對話很長變慢再改成分區訂閱
import { useSyncExternalStore } from "react";
import type { Skill } from "./skills";
import type { Project } from "./projects";
import type { DiffLine } from "./repo";
import type { ChatMeta, Message } from "./history";
import type { ProviderId, ProviderConf } from "./providers";
import type { Me } from "./backend";
import type { Mode } from "./mode";
import type { Source } from "./shared";

export type UserItem = { id: number; kind: "user"; text: string; selection?: string; files?: { name: string; chars: number }[] }; // selection：這則附帶的頁面選取內容；files：附加的檔案
export type NoteItem = { id: number; kind: "error" | "note"; text: string };
export type StatsItem = { id: number; kind: "stats"; text: string; title: string };
export type MdItem = { id: number; kind: "md"; text: string; done: boolean };
export type ThinkingItem = { id: number; kind: "thinking"; text: string; state: "running" | "done" | "interrupted"; seconds: number };
export type ToolItem = { id: number; kind: "tool"; name: string; input: unknown; state: "running" | "ok" | "error"; error?: string };
export type PendingItem = { id: number; kind: "pending" };
// 對話裡的卡片。reply／decide 只在等待使用者時存在（React 元件呼叫它們把答案交回 tools.ts）
export type AskOption = { label: string; description?: string; recommended?: boolean };
export type AskInput = { question: string; options: AskOption[]; multiSelect?: boolean };
export type AskItem = { id: number; kind: "ask"; input: AskInput; state: "waiting" | "answered" | "cancelled"; answer?: string; picked?: string[]; reply?: (text: string, picked: string[]) => void };
export type FileItem = { id: number; kind: "file"; filename: string; content: string; description?: string };
// text：不是點擊／送出的確認（例如掃描 PDF 要整份送出），直接給卡片內文
// diff／stats／warn：寫進 GitHub repo 的確認卡（改了哪幾行、增刪行數、警告的 i18n key）
export type ConfirmItem = { id: number; kind: "confirm"; label: string; submitting: boolean; host: string; text?: string; aria?: string; mismatch?: boolean; detail?: string; diff?: (DiffLine | null)[]; stats?: { added: number; removed: number }; warn?: string[]; state: "waiting" | "allowed" | "denied"; decide?: (ok: boolean) => void };
export type CommitItem = { id: number; kind: "commit"; repo: string; path: string; url: string; added: number; removed: number }; // 已經 commit 到 GitHub 的檔案
export type MemoryItem = { id: number; kind: "memory"; op: "remember" | "forget"; text: string; undone?: boolean; projectId?: string; repo?: string }; // projectId：記在專案記憶；repo：記在 GitHub repo 的記憶檔（已經 commit，沒有復原）
export type PageItem = { id: number; kind: "page"; title: string; url: string; tabId: number };
// 額度用完（402 quota_exceeded）或方案不含所選模型（402 model_not_in_plan，why: "model"）：對話裡顯示說明與升級按鈕
export type QuotaItem = { id: number; kind: "quota"; why?: "model" };
export type Item = QuotaItem | UserItem | NoteItem | StatsItem | MdItem | ThinkingItem | ToolItem | PendingItem | AskItem | FileItem | ConfirmItem | MemoryItem | PageItem | CommitItem;

export type Suggestion = { title: string; subtitle: string; prompt: string };

export const S = {
  view: "consent" as "chat" | "onboard" | "consent",
  consent: false, // 醒目揭露同意（Chrome Web Store User Data 政策）：同意前不進 chat／onboard，也不送任何模型請求
  // cloud＝預設，免登入、走自家後端、扣點數；byok＝使用者自己的 API Key，直連供應商，完全不碰我們的後端（見 mode.ts）
  mode: "cloud" as Mode,
  provider: "anthropic" as ProviderId, // byok 用的供應商（cloud 固定是 Anthropic，見 providers.ts 的 activeProvider）
  providers: {} as Partial<Record<ProviderId, ProviderConf>>, // 各供應商的金鑰、base URL、模型；見 providers.ts
  me: null as Me | null, // GET /v1/me（只有 cloud）：方案與本月點數；null＝還沒抓到（或抓失敗）
  meError: false,
  loginPrompt: false, // 按了「升級」但還沒登入：要求側邊欄打開設定頁（一次性，App 讀到就清掉）
  accountBusy: false, // 登入／登出進行中
  accountMsg: "" as string, // 帳號區的錯誤或提示（i18n key）；空字串＝沒有
  effort: "medium",
  pageChars: 8000, // 讀頁一次最多回傳的字數。中文約 1 字 1 token：整頁維基 5.5 萬字＝5 萬 token，一次摘要就要好幾塊台幣
  suggestOn: false,
  memoryOn: true,
  summarizePages: true, // read_url 讀到的頁面先用 Haiku 依問題整理；A/B 量成本時在 devtools 跑 chrome.storage.local.set({ summarizePages: false })（側邊欄重開生效）
  memories: [] as string[],
  skills: [] as Skill[],
  projects: [] as Project[], // 見 projects.ts；檔案內容不在這裡（一檔一個 storage key）
  projectId: null as string | null, // 目前專案：新對話開在它底下，系統提示詞帶它的指示、檔案清單與記憶。任務進行中不能切
  chats: [] as ChatMeta[], // 對話歷史的索引（內容另存在 chat:<id>），見 history.ts
  chatId: null as string | null, // 目前這段對話在 chats 裡的 id；新對話在第一次存檔時才建立
  messages: [] as Message[], // 目前對話，送給 API 的格式
  sources: [] as Source[], // 目前對話的研究來源，[n]＝第 n 個（存進歷史；回答裡的 [n] 照它變成連結）
  log: [] as Item[], // 畫面上的對話紀錄
  busy: false,
  // 首頁建議：list 為 null＝顯示固定建議；sub 為 null＝預設副標
  suggest: { list: null as Suggestion[] | null, sub: null as string | null, loading: false },
  stickForce: false, // 下一次重繪強制捲到底（使用者送出訊息、還原歷史時）
  toast: null as { id: number; text: string; undo: () => void } | null, // 底部「已刪除 · 復原」，5 秒後消失
  asking: null as AskItem | null, // ask_user 等待回答中：這時在輸入框送出的文字就是答案
  selection: null as string | null, // 目前分頁上選取的文字（輸入框上方的標籤），見 selection.ts
  attachments: [] as { id: number; name: string; text: string; saved?: boolean }[], // 聊天框附加、還沒送出的檔案（已經轉成文字），見 attachments.ts；saved：已經存進目前的專案
  attachError: "", // 附加檔案失敗的說明（顯示在輸入框下面；下次附加或送出時清掉）
  pdfTab: null as string | null, // 目前分頁是 Chrome 內建檢視器開的 PDF：顯示「在檢視器開啟」
  chatModel: "", // 這段對話最後用的模型名稱，存進歷史給匯出用
};

let version = 0;
const subs = new Set<() => void>();
export function emit() {
  version++;
  subs.forEach((f) => f());
}
let queued = false;
// 串流的文字增量：每幀最多重繪一次
export function emitSoon() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; emit(); });
}
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const useStore = () => useSyncExternalStore(subscribe, () => version);

let seq = 0;
type NoId<T> = T extends unknown ? Omit<T, "id"> : never;
export function addItem<T extends Item>(data: NoId<T>): T {
  const item = { ...data, id: ++seq } as T;
  S.log.push(item);
  if (item.kind === "user") S.stickForce = true;
  emit();
  return item;
}
export function removeItem(item: Item) {
  S.log = S.log.filter((x) => x !== item);
  emit();
}

export async function setMemories(list: string[]) {
  S.memories = list;
  emit();
  await chrome.storage.local.set({ memories: list });
}

let toastSeq = 0;
export function showToast(text: string, undo: () => void) {
  S.toast = { id: ++toastSeq, text, undo };
  emit();
}
