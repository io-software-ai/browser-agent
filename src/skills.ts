// 技能＝SKILL.md：開頭 --- 包住的 name / description，後面是給模型的完整指示。
// 格式與 Claude Code 的 SKILL.md 相容，可以直接互相匯入匯出。選填的 model（例如 haiku）指定用 /名稱 叫出時用哪個模型。
import { HAIKU, SONNET, OPUS, migrateModel } from "./models";

export type Skill = {
  name: string; description: string; body: string; model?: string;
  // 匯入／安裝的技能從哪來（網址或檔名）。有 source＝第三方內容：用到之後這次任務算不可信（見 untrustedSkill）
  source?: string;
  // 技能資料夾裡 SKILL.md 以外的文字檔（相對技能根目錄的路徑 → 內容），模型用 use_skill 帶 file 讀
  files?: Record<string, string>;
  manual?: true; // disable-model-invocation: true：只能 /名稱 叫出，不列給模型
  hidden?: true; // user-invocable: false：不出現在 / 選單，只給模型用
};

// 名稱只留字母、數字、_ . -：引號會跳出 <skill name="…"> 標籤（洗掉第三方標記），零寬字元能做出看起來同名的技能
export const cleanName = (s: string) => s.normalize("NFC").trim().replace(/[^\p{L}\p{N}_.-]+/gu, "-").replace(/^-+|-+$/g, "");

export function parseSkill(md: string, fallbackName = ""): Skill {
  const text = md.replace(/^﻿/, "");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) {
    const lines = m[1].split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const kv = lines[i].match(/^([\w-]+):\s*(.*)$/);
      if (!kv) continue;
      let value = kv[2].trim();
      // YAML 多行字串（description: > 或 |）：收集後面縮排的行
      if (/^[>|][+-]?$/.test(value)) {
        const block: string[] = [];
        while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || lines[i + 1].trim() === "")) block.push(lines[++i].trim());
        value = block.join(value.startsWith(">") ? " " : "\n").trim();
      }
      meta[kv[1]] = value.replace(/^(["'])(.*)\1$/, "$2");
    }
  }
  return {
    name: cleanName(meta.name || fallbackName),
    description: meta.description || "",
    body: (m ? m[2] : text).trim(),
    ...(meta.model ? { model: meta.model } : {}),
    ...(meta["disable-model-invocation"] === "true" ? { manual: true as const } : {}),
    ...(meta["user-invocable"] === "false" ? { hidden: true as const } : {}),
  };
}

export const serializeSkill = (s: Skill) =>
  `---\nname: ${s.name}\ndescription: ${s.description.replace(/\n/g, " ")}\n${s.model ? `model: ${s.model}\n` : ""}${s.manual ? "disable-model-invocation: true\n" : ""}${s.hidden ? "user-invocable: false\n" : ""}---\n\n${s.body}\n`;

// 技能的 model 欄位（Claude Code 寫法：haiku／sonnet／opus 或模型 id）→ 這裡支援的 Anthropic 模型 id；
// 其他值（inherit、他家模型）回 null＝用目前選的
const MODEL_ALIASES: Record<string, string> = { haiku: HAIKU, sonnet: SONNET, opus: OPUS };
export function skillModel(model: string | undefined): string | null {
  const m = migrateModel((model ?? "").trim().toLowerCase()); // 舊 id（Sonnet 5／Opus 5／Haiku 4.5）照 5.5 解讀
  return MODEL_ALIASES[m] ?? (Object.values(MODEL_ALIASES).includes(m) ? m : null);
}

// 訊息開頭的 /名稱 對到哪個技能
export function slashSkill(text: string, skills: Skill[]) {
  const m = text.match(/^\/(\S+)/);
  return (m && skills.find((s) => s.name === m[1])) || null;
}

// 系統提示詞只放名稱與說明，完整指示等模型呼叫 use_skill 才載入
export function skillsPrompt(skills: Skill[]) {
  const listed = skills.filter((s) => !s.manual);
  if (!listed.length) return "";
  // 說明壓成一行、限長：第三方說明不能在系統提示詞裡偽造新段落
  return "\n\n## 可用技能\n需要時先呼叫 use_skill 載入完整指示再照做。使用者訊息開頭的「/名稱」代表指定用那個技能。\n"
    + listed.map((s) => `- ${s.name}：${s.description.replace(/\s+/g, " ").slice(0, 1024)}`).join("\n");
}

// 支援第三方標記之前存的技能分不出是匯入的還是自己寫的：一律先當第三方，使用者在編輯頁可以改回「自己寫的」
export const LEGACY_SOURCE = "legacy:unknown";

// 有列給模型的第三方技能＝它的說明每輪都在系統提示詞裡，每個任務一開始就算不可信
export const thirdPartyListed = (skills: Skill[]) => skills.some((s) => s.source && !s.manual);

// 技能內文外面包的標籤。第三方技能帶 source 屬性：對話裡出現它＝這次任務有不可信的指示（agent.ts 的 tainted 判斷）
const attr = (v: string) => v.replace(/"/g, "%22");
export const skillTag = (s: Skill, body: string) => `<skill name="${attr(s.name)}"${s.source ? ` source="${attr(s.source)}"` : ""}>\n${body}\n</skill>`;
export const untrustedSkill = (text: string) => /<skill name="[^"]*" source="/.test(text);

// 附帶檔案清單接在內文後面（附屬檔照開放標準按需讀；scripts 沒有地方跑）
function withFiles(s: Skill, body: string) {
  const files = Object.keys(s.files ?? {});
  return files.length ? `${body}\n\n---\n這個技能附帶的檔案（指示裡提到時用 use_skill 帶 file 讀；scripts／程式只能讀來參考，這裡不能執行）：\n${files.map((f) => `- ${f}`).join("\n")}` : body;
}

// use_skill 的回傳：沒給 file＝內文，給了＝那個附帶檔案
export function skillResult(s: Skill, file?: string) {
  if (!file) return skillTag(s, withFiles(s, s.body));
  const text = s.files?.[file.replace(/^\.?\//, "")];
  if (text == null) throw new Error(`技能「${s.name}」沒有檔案「${file}」，有的是：${Object.keys(s.files ?? {}).join("、") || "（無）"}`);
  return skillTag(s, text);
}

// 使用者手動指定 /名稱：直接把技能內文併進這則訊息，省一次工具呼叫
export function expandSlash(text: string, skills: Skill[]) {
  const m = text.match(/^\/(\S+)\s*([\s\S]*)$/);
  const skill = m && skills.find((s) => s.name === m[1]);
  if (!skill) return text;
  // $ARGUMENTS／$ARGUMENTS[N]（Claude Code 寫法，N 從 0 起）帶入 /名稱 後面打的字；後面照舊附原文（歷史紀錄靠它還原使用者打的那行）
  // ponytail: 不支援 $N 簡寫（內文裡「$5」這種金額會被誤換），真有技能需要再加
  const rest = m[2];
  const args = rest.split(/\s+/).filter(Boolean);
  const body = skill.body.replace(/\$ARGUMENTS(?:\[(\d+)\])?/g, (_, i) => (i == null ? rest.trim() : args[+i] ?? ""));
  return `使用技能「${skill.name}」，完整指示已附在下面（不用再呼叫 use_skill）：\n${skillTag(skill, withFiles(skill, body))}\n\n${rest || "（沒有補充說明，直接照技能指示做）"}`;
}
