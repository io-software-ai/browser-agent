// 設定、歷史對話、技能編輯：佔滿側邊欄的整頁畫面（左上返回），由 App 用一個堆疊管理（設定 → 子頁 → 技能編輯）
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { S, emit, setMemories, showToast } from "./store";
import { persist, send, showView, openChat, deleteChat, resetChat, scheduleSuggestions, refreshMe, setMode, COMMANDS } from "./agent";
import { addMemory, MAX_MEMORY_CHARS, MAX_MEMORIES } from "./memory";
import { parseSkill, serializeSkill, cleanName, LEGACY_SOURCE, type Skill } from "./skills";
import { bundleSkills, fetchSkills, folderEntries, unzip, isZip, InstallError } from "./skill-install";
import { toMarkdown, groupChats, MAX_CHATS, type Chat } from "./history";
import { t, LANGS, langPref, setLangPref, currentLang, type Key } from "./i18n";
import { IconBack, IconChevron, IconErr, IconFile, IconFolder, IconGitHub, IconGlobe, IconGoogle, IconLink, IconMore, IconPlus, IconSearch, IconShield, IconUser } from "./icons";
import { Select, type Opt } from "./select";
import { ANTHROPIC_MODELS, PROVIDERS, PROVIDER_IDS, activeProvider, providerName, cleanBaseURL, baseURL, conf, currentModel, listModels, ready, type ProviderId } from "./providers";
import { BACKEND, BackendError, signIn, signOut, type Me, type Provider } from "./backend";
import { cloudModels, cloudReadLevels } from "./cloud-models";

export type Route =
  | { name: "history" }
  | { name: "settings" }
  | { name: "memory" }
  | { name: "skills" }
  | { name: "skill"; skill: Skill | null }; // skill 為 null＝新增

export type Nav = { push: (r: Route) => void; pop: () => void; closeAll: (focusId?: string) => void };

// 把 t() 字串裡的 {name} 換成 React 元素（例如 <code>/</code>）
export function rich(s: string, parts: Record<string, ReactNode>) {
  return s.split(/(\{\w+\})/).map((seg, i) => {
    const m = seg.match(/^\{(\w+)\}$/);
    return m && m[1] in parts ? <Fragment key={i}>{parts[m[1]]}</Fragment> : seg;
  });
}

function download(filename: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function SkillItem({ cls, skill, ...rest }: { cls: string; skill: { name: string; description: string } } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cls} {...rest}>
      <strong>/{skill.name}</strong>
      <small>{skill.description || t("slash.noDescription")}</small>
    </button>
  );
}

// 整頁外殼：固定的頂列（返回＋標題）＋可捲動的內容。Esc＝返回（選單等子元件處理過 Esc 會 preventDefault）
function Page({ id, title, onBack, children }: { id: string; title: string; onBack: () => void; children: ReactNode }) {
  const back = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => { back.current?.focus(); }, [id]);
  return (
    <section className="page" id={id} aria-labelledby={`${id}-title`} onKeyDown={(e) => {
      if (e.key !== "Escape" || e.defaultPrevented || e.nativeEvent.isComposing) return;
      e.preventDefault();
      onBack();
    }}>
      <div className="page-head">
        <button className="icon-btn" type="button" id="page-back" ref={back} aria-label={t("common.back")} title={t("common.back")} onClick={onBack}><IconBack /></button>
        <h1 id={`${id}-title`}>{title}</h1>
      </div>
      <div className="page-body">{children}</div>
    </section>
  );
}

// 底部「已刪除 · 復原」：5 秒後消失，換頁也留著
export function Toast() {
  const toast = S.toast;
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => { if (S.toast === toast) { S.toast = null; emit(); } }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span>{toast.text}</span>
          <button type="button" className="toast-undo" id="toast-undo" onClick={() => { S.toast = null; emit(); toast.undo(); }}>{t("common.undo")}</button>
        </div>
      )}
    </div>
  );
}

// 「⋯」選單：Enter／空白鍵打開後焦點在第一項，↑↓ 移動、Esc 關閉並回到按鈕、焦點離開就關
function RowMenu({ label, items }: { label: string; items: { label: string; danger?: boolean; run: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!open) return;
    const m = menu.current!;
    setUp(btn.current!.getBoundingClientRect().bottom + m.offsetHeight + 8 > window.innerHeight); // 下面放不下就往上開
    (m.firstElementChild as HTMLElement | null)?.focus();
  }, [open]);
  const close = (refocus: boolean) => { setOpen(false); if (refocus) btn.current?.focus(); };
  const onKey = (e: KeyboardEvent) => {
    const list = [...menu.current!.querySelectorAll<HTMLElement>("[role=menuitem]")];
    const i = list.indexOf(document.activeElement as HTMLElement);
    const go = (j: number) => { e.preventDefault(); list[(j + list.length) % list.length]?.focus(); };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(-1);
    else if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "Tab") close(false);
    e.stopPropagation(); // 別讓歷史清單的 ↑↓ 也處理
  };
  return (
    <div className="menu-wrap" ref={wrap} data-open={open ? "" : undefined} onBlur={(e) => { if (open && !wrap.current!.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button type="button" className="icon-btn more-btn" ref={btn} aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open}
        onClick={() => setOpen(!open)}><IconMore /></button>
      {open && (
        <div className={up ? "menu up" : "menu"} role="menu" ref={menu} onKeyDown={onKey}>
          {items.map((it) => (
            <button key={it.label} type="button" role="menuitem" tabIndex={-1} className={it.danger ? "danger" : undefined}
              onClick={() => { close(false); it.run(); }}>{it.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- 歷史對話 ----------

const SEARCH_MIN = 8; // 超過這麼多段才出現搜尋框

function chatTime(chat: Chat, group: string) {
  const d = new Date(chat.updated);
  return group === "today" || group === "yesterday"
    ? d.toLocaleTimeString(currentLang(), { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString(currentLang(), { month: "numeric", day: "numeric" });
}

async function removeChat(chat: Chat) {
  const index = S.chats.indexOf(chat);
  const wasCurrent = chat.id === S.chatId;
  await deleteChat(chat);
  showToast(t("history.deleted"), async () => {
    if (S.chats.some((c) => c.id === chat.id)) return;
    const list = [...S.chats];
    list.splice(Math.min(index, list.length), 0, chat);
    S.chats = list.slice(0, MAX_CHATS);
    if (wasCurrent && S.chatId === null) S.chatId = chat.id; // 畫面上的還是那段對話：接著聊要更新同一筆
    emit();
    await persist({ chats: S.chats });
  });
}

export function HistoryPage({ nav }: { nav: Nav }) {
  const [q, setQ] = useState("");
  const query = S.chats.length > SEARCH_MIN ? q.trim().toLocaleLowerCase() : "";
  const shown = query ? S.chats.filter((c) => c.title.toLocaleLowerCase().includes(query)) : S.chats;
  // ↑↓ 在各段對話之間移動（選單打開時由選單自己處理）
  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const rows = [...e.currentTarget.querySelectorAll<HTMLElement>(".chat-open")];
    const i = rows.findIndex((r) => r.parentElement!.contains(document.activeElement));
    const next = rows[i === -1 ? 0 : Math.min(rows.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))];
    if (next) { e.preventDefault(); next.focus(); }
  };
  return (
    <Page id="history" title={t("history.title")} onBack={nav.pop}>
      {S.busy && <div className="notice" id="history-busy">{t("history.busy")}</div>}
      {S.chats.length > SEARCH_MIN && (
        <label className="search">
          <IconSearch />
          <input type="search" id="history-search" placeholder={t("history.search")} aria-label={t("history.search")} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      )}
      {!S.chats.length ? (
        <div className="empty-state">
          <strong>{t("history.empty")}</strong>
          <span>{t("history.emptyHint")}</span>
          <button className="btn btn-ghost" type="button" onClick={() => { resetChat(); nav.closeAll("input"); }}>{t("history.startNew")}</button>
        </div>
      ) : !shown.length ? (
        <div className="empty-state"><span>{t("history.noMatch")}</span></div>
      ) : (
        <div id="history-list" onKeyDown={onListKey}>
          {groupChats(shown).map(({ group, chats }) => (
            <section className="chat-group" key={group} aria-labelledby={`group-${group}`}>
              <h2 className="group-title" id={`group-${group}`}>{t(`history.${group}` as Key)}</h2>
              <ul role="list">
                {chats.map((chat) => {
                  const current = chat.id === S.chatId;
                  return (
                    <li className="chat-row" key={chat.id} aria-current={current ? "true" : undefined}>
                      <button type="button" className="chat-open" title={current ? t("history.current") : undefined} onClick={() => { openChat(chat); nav.closeAll("input"); }}>
                        <span className="chat-title">{chat.title}</span>
                        <time dateTime={new Date(chat.updated).toISOString()}>{chatTime(chat, group)}</time>
                      </button>
                      <RowMenu label={t("common.more")} items={[
                        { label: t("history.export"), run: () => download(`${chat.title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40)}.md`, toMarkdown(chat)) },
                        { label: t("common.delete"), danger: true, run: () => removeChat(chat) },
                      ]} />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
      <div className="hint page-note">{t("history.hint", { n: MAX_CHATS })}</div>
    </Page>
  );
}

// ---------- 設定首頁 ----------

const PAGE_CHARS: [number, Key?][] = [[3000, "settings.pageCharsMin"], [5000], [8000, "settings.pageCharsDefault"], [15000], [30000, "settings.pageCharsMax"]];

function NavRow({ id, title, value, onClick }: { id: string; title: string; value: string; onClick: () => void }) {
  return (
    <button type="button" className="list-row nav-row" id={id} onClick={onClick}>
      <span className="row-text">{title}<small>{value}</small></span>
      <IconChevron />
    </button>
  );
}

export function SettingsPage({ nav }: { nav: Nav }) {
  useEffect(() => { refreshMe(); }, []); // 每次打開設定都重抓：升級或換月後點數會變
  // 讀頁字數上限：cloud 只列後端 /v1/me 的檔位（每檔顯示字數，加點大於 0 才標「＋M 點／任務」）；byok 照舊是 PAGE_CHARS 的五個選項、不扣點
  const cloud = S.mode === "cloud";
  const read = cloudReadLevels(S.me, S.pageChars);
  const pageCharsOptions: Opt[] = cloud
    ? read.levels.map((l) => ({
      value: String(l.chars), label: t(l.chars_per_credit ? "settings.readFull" : "settings.readChars", { n: l.chars.toLocaleString(currentLang()) }),
      hint: [l.credits > 0 && t(l.credits === 1 ? "settings.readExtra" : "settings.readExtras", { n: l.credits }), l.chars_per_credit && t("settings.readPerCredit", { n: l.chars_per_credit.toLocaleString(currentLang()) })].filter(Boolean).join(" · ") || undefined,
    }))
    : PAGE_CHARS.map(([n, k]) => {
      const num = n.toLocaleString(currentLang());
      return { value: String(n), label: k ? t(k, { n: num }) : num };
    });
  return (
    <Page id="settings" title={t("settings.title")} onBack={nav.pop}>
      <AccountSection />
      <div className="list-group">
        <NavRow id="settings-memory" title={t("memory.title")} value={t(S.memoryOn ? "settings.memorySummaryOn" : "settings.memorySummaryOff", { n: S.memories.length })} onClick={() => nav.push({ name: "memory" })} />
        <NavRow id="settings-skills" title={t("skills.title")} value={t("settings.skillsSummary", { n: S.skills.length })} onClick={() => nav.push({ name: "skills" })} />
      </div>
      <div className="list-group">
        <div className="list-row">
          <label className="row-text" htmlFor="lang">{t("settings.language")}</label>
          <Select id="lang" variant="compact" label={t("settings.language")} value={langPref()}
            options={[{ value: "auto", label: t("settings.languageAuto") }, ...Object.entries(LANGS).map(([code, [name, en]]) => ({ value: code, label: name, hint: en }))]}
            onChange={(v) => {
              setLangPref(v);
              if (v === "auto") chrome.storage.local.remove("lang");
              else persist({ lang: v });
              emit();
              scheduleSuggestions();
            }} />
        </div>
        <div className="list-row">
          <label className="row-text" htmlFor="page-chars">{t("settings.pageChars")}<small>{t("settings.pageCharsHint")}</small></label>
          <Select id="page-chars" variant="compact" label={t("settings.pageChars")} value={String(cloud ? read.chars : S.pageChars)}
            options={pageCharsOptions}
            onChange={(v) => {
              S.pageChars = Number(v);
              emit();
              persist({ pageChars: S.pageChars });
            }} />
        </div>
        <label className="list-row">
          <span className="row-text">{t("settings.suggest")}<small>{activeProvider() === "anthropic" ? t("settings.suggestHint") : t("settings.suggestAnthropicOnly")}</small></span>
          <input type="checkbox" className="switch" id="suggest-on" checked={S.suggestOn} onChange={(e) => {
            S.suggestOn = e.target.checked;
            emit();
            persist({ suggestOn: S.suggestOn });
            scheduleSuggestions();
          }} />
        </label>
      </div>
      <ByokSection nav={nav} />
      <a className="supported-by" href="https://iosoftware.ai" target="_blank" rel="noopener noreferrer">
        <img src="icons/supported-by-iosoftware.svg" alt="Supported by io Software" />
      </a>
    </Page>
  );
}

// 升級網址帶後端的簽章：側邊欄開著很久時手上的 /v1/me 可能是舊的（例如後端換了簽章金鑰），每次都先重抓再開
// 付費前必須登入（契約 accounts.md）：還沒登入就改成請使用者先登入，設定頁會自動打開，登入成功後才開升級頁
let upgradeAfterLogin = false;
const openUpgradePage = () => chrome.tabs.create({ url: S.me?.upgrade_url ?? `${BACKEND}/upgrade` });
export const openUpgrade = async () => {
  await refreshMe();
  if (S.mode === "cloud" && S.me && !S.me.account) { upgradeAfterLogin = true; S.loginPrompt = true; S.accountMsg = "account.loginFirst"; emit(); return; }
  openUpgradePage();
};

const PROVIDER_NAME: Record<Provider, string> = { google: "Google", github: "GitHub" };
const ACCOUNT_ERRORS = ["account_conflict", "already_signed_in", "invalid_code", "provider_error"];
// 登入／登出：任務進行中、或另一個登入還沒結束時不動（中途換帳號會讓進行中的任務對不上）
async function accountAction(run: () => Promise<boolean | void>) {
  if (S.busy || S.accountBusy) return;
  S.accountBusy = true; S.accountMsg = ""; emit();
  let ok = false;
  try {
    ok = (await run()) !== false;
    if (ok) await refreshMe();
  } catch (e) {
    const code = e instanceof BackendError ? e.code : undefined;
    S.accountMsg = code && ACCOUNT_ERRORS.includes(code) ? `account.err.${code}` : "account.err.other";
  }
  S.accountBusy = false;
  const upgrade = upgradeAfterLogin && ok && !!S.me?.account;
  upgradeAfterLogin = false; // 登入失敗或取消：這次不開升級頁
  if (ok) S.accountMsg = "";
  emit();
  if (upgrade) openUpgradePage();
}
const login = (p: Provider) => accountAction(() => signIn(p));
const logout = () => accountAction(signOut);

// 帳號區第一列：你是誰。未登入＝兩個一樣大的登入按鈕（Google 規範：不能比其他登入方式不醒目）
function Identity({ me }: { me: Me }) {
  const off = S.busy || S.accountBusy;
  const a = me.account;
  return (
    <div className="list-row account-id">
      <div className="id-head">
        {a ? <span className="avatar avatar-letter" aria-hidden="true">{(a.email ?? PROVIDER_NAME[a.provider])[0].toUpperCase()}</span>
          : <span className="avatar" aria-hidden="true"><IconUser /></span>}
        <span className="row-text">
          <strong id="account-user">{a ? a.email ?? t("account.signedInNoEmail", { provider: PROVIDER_NAME[a.provider] }) : t("account.anon")}</strong>
          <small>{a ? t("account.signedIn", { provider: PROVIDER_NAME[a.provider] }) : t("account.signInHint")}</small>
        </span>
        {a && <button type="button" className="btn btn-ghost btn-sm" id="account-logout" disabled={off} onClick={logout}>{t("account.signOut")}</button>}
      </div>
      {!a && (
        <div className="sso">
          <button type="button" className="btn sso-btn" id="account-google" disabled={off} onClick={() => login("google")}><IconGoogle /><span>{t("account.google")}</span></button>
          <button type="button" className="btn sso-btn" id="account-github" disabled={off} onClick={() => login("github")}><IconGitHub /><span>{t("account.github")}</span></button>
        </div>
      )}
      {S.accountMsg && <div className="notice" id="account-msg" role="alert">{t(S.accountMsg as Key)}</div>}
    </div>
  );
}

function AccountSection() {
  // byok：用自己的 Key，不扣點數；這個模式下完全不碰我們的後端，所以沒有方案與點數可以顯示
  if (S.mode === "byok") {
    return (
      <section className="account" id="account" aria-labelledby="account-title">
        <h2 className="group-title" id="account-title">{t("account.title")}</h2>
        <div className="list-group">
          <div className="list-row account-row">
            <span className="row-text" id="account-byok">{t("account.byokNote")}</span>
            <button type="button" className="btn btn-ghost" id="account-use-cloud" onClick={() => setMode("cloud")}>{t("account.useCloud")}</button>
          </div>
        </div>
      </section>
    );
  }
  const me = S.me;
  const left = me ? Math.max(0, me.credits_limit - me.credits_used) : 0;
  return (
    <section className="account" id="account" aria-labelledby="account-title">
      <h2 className="group-title" id="account-title">{t("account.title")}</h2>
      <div className="list-group">
        {me && <Identity me={me} />}
        {/* 方案＋用量是一組：方案名稱、升級、用量條、重置日 */}
        <div className="list-row account-plan">
          <div className="plan-head">
            <strong id="account-plan">{me ? t(`plan.${me.plan}` as Key) : "…"}</strong>
            <button type="button" className="btn btn-primary btn-sm" id="account-upgrade" onClick={openUpgrade}>{t("account.upgrade")}</button>
          </div>
          {me ? (
            <>
              <progress className="meter" id="account-meter" max={me.credits_limit || 1} value={Math.min(me.credits_used, me.credits_limit)} aria-label={t("account.credits")} data-low={left === 0 ? "" : undefined} />
              <div className="plan-meta">
                <small id="account-credits">{t("account.creditsUsed", { used: me.credits_used, limit: me.credits_limit })}</small>
                <small id="account-period">{t("account.periodEnd", { date: new Date(`${me.period_end}T00:00:00`).toLocaleDateString(currentLang(), { month: "short", day: "numeric" }) })}</small>
              </div>
            </>
          ) : <small id="account-status">{S.meError ? t("account.loadFailed") : "…"}</small>}
        </div>
        {me?.kol_code && (
          <div className="list-row">
            <span className="row-text">{t("account.referral")}<small id="account-kol">{me.kol_code}</small></span>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- 模型供應商 ----------

export const persistProviders = () => persist({ provider: S.provider, providers: S.providers });

// OpenAI 相容供應商的模型清單：打開選單時才去抓 GET {base}/models；同一組（供應商＋位址＋金鑰）只抓一次，失敗下次打開再試
type ModelList = { list?: string[]; error?: string; loading?: boolean };
const modelLists = new Map<string, ModelList>();
const listKey = (p: ProviderId) => `${p} ${baseURL(p)} ${conf(p).key ?? ""}`;
function loadModels(p: ProviderId) {
  const k = listKey(p);
  const cur = modelLists.get(k);
  if (cur?.list || cur?.loading) return;
  modelLists.set(k, { loading: true });
  emit();
  listModels(p).then(
    (list) => { modelLists.set(k, { list }); emit(); },
    (e) => { modelLists.set(k, { error: e?.message ?? String(e) }); emit(); },
  );
}

// 模型選單：Anthropic 固定三個；其他動態列出，也能直接輸入模型名稱。p：輸入框下方的選單傳 activeProvider()（cloud 固定是 Anthropic），
// 設定頁進階區塊傳使用者選的供應商
export function ModelSelect({ id, variant, p }: { id: string; variant: "bar" | "field"; p: ProviderId }) {
  const value = currentModel(p);
  const set = (v: string) => { conf(p).model = v; emit(); persistProviders(); };
  if (p === "anthropic") {
    return <Select id={id} variant={variant} label={t("composer.model")} value={value} onChange={set}
      options={ANTHROPIC_MODELS.map((m) => ({ value: m.value, label: m.label, hint: t(m.hint) }))} />;
  }
  const state = modelLists.get(listKey(p)) ?? {};
  const options: Opt[] = (state.list ?? []).map((m) => ({ value: m, label: m }));
  if (value && !options.some((o) => o.value === value)) options.unshift({ value, label: value });
  return <Select id={id} variant={variant} label={t("composer.model")} value={value} onChange={set} options={options} allowCustom
    placeholder={t("model.choose")} onOpen={() => loadModels(p)}
    status={state.loading ? t("model.loading") : state.error ? t("model.loadFailed", { error: state.error }) : null} />;
}

// cloud 的模型選單：只列後端 /v1/me 給的模型（名稱、排序照後台）。說明＝tier 對應的既有字典＋「N 點／任務」（舊版後端沒有 credits 就不顯示）；
// 鎖住的（方案不夠）顯示鎖頭和「需升級方案」，點了開升級頁、不能選
export function CloudModelSelect({ id, variant }: { id: string; variant: "bar" | "field" }) {
  const { items, model } = cloudModels(S.me, conf("anthropic").model);
  const options: Opt[] = items.map((m) => {
    const n = m.effortCredits?.[S.effort as keyof NonNullable<typeof m.effortCredits>] ?? m.credits; // 目前選的深度那一檔；Haiku、舊版後端沒有就用 credits
    return {
    value: m.value, label: m.label,
    hint: [m.hint && t(m.hint), n != null && t(n === 1 ? "model.credit" : "model.credits", { n })].filter(Boolean).join(" · ") || undefined,
    ...(m.locked ? { locked: t("model.locked") } : {}),
  };});
  const set = (v: string) => {
    if (items.find((m) => m.value === v)?.locked) { openUpgrade(); return; }
    conf("anthropic").model = v; emit(); persistProviders();
  };
  return <Select id={id} variant={variant} label={t("composer.model")} value={model} onChange={set} options={options} />;
}

// 一個供應商的欄位；換供應商時整個重建（key={p}），輸入框不會殘留上一家的金鑰
function ProviderFields({ p, nav }: { p: ProviderId; nav: Nav }) {
  const c = conf(p);
  const custom = p === "custom";
  const [key, setKey] = useState(c.key ?? "");
  const [base, setBase] = useState(c.baseURL ?? "");
  const [showKey, setShowKey] = useState(false);
  const [err, setErr] = useState("");
  const latest = useRef({ key, base });
  latest.current = { key, base };
  const commit = () => {
    const k = latest.current.key.trim() || undefined;
    const b = latest.current.base.trim();
    const url = custom ? cleanBaseURL(b) : undefined;
    if (custom && b && !url) setErr(t("error.badBaseURL"));
    else setErr("");
    const next = { ...c, key: k, ...(custom && url ? { baseURL: url } : {}) };
    if (next.key === c.key && next.baseURL === c.baseURL) return;
    S.providers[p] = next;
    emit();
    persistProviders();
  };
  useEffect(() => commit, []); // 按 Esc／返回離開時輸入框不一定會先失焦
  const info = PROVIDERS[p];
  return (
    <>
      {custom && (
        <div className="row">
          <label className="field-label" htmlFor="base-url">{t("settings.baseURL")}</label>
          <input className="input" id="base-url" type="url" placeholder="http://localhost:11434/v1" autoComplete="off" spellCheck={false}
            value={base} onChange={(e) => setBase(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); }} />
          <div className="form-error" id="base-url-error">{err}</div>
        </div>
      )}
      <div className="row">
        <label className="field-label" htmlFor="key">{custom ? t("settings.keyOptional") : t("settings.key")}</label>
        <div className="key-row">
          <input className="input" id="key" type={showKey ? "text" : "password"} autoComplete="off" spellCheck={false} placeholder={info.keyPlaceholder ?? ""}
            value={key} onChange={(e) => setKey(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); }} />
          <button className="btn btn-ghost" type="button" id="toggle-key" onClick={() => setShowKey(!showKey)}>
            {showKey ? t("settings.hide") : t("settings.show")}
          </button>
        </div>
        {info.keyURL && !c.key && <a className="text-link" href={info.keyURL} target="_blank" rel="noopener">{t("onboard.getKeyFrom", { name: info.name })}</a>}
      </div>
      <div className="row">
        <label className="field-label" htmlFor="settings-model">{t("settings.model")}</label>
        <ModelSelect id="settings-model" variant="field" p={p} />
      </div>
      <div className="hint" id="provider">
        {custom ? <>{t("settings.providerCustom")} {t("settings.localHint")}</> : t("settings.providerDirect", { name: info.name })}
        {p === "anthropic" && <>{" "}<a className="text-link" href="https://console.anthropic.com/usage" target="_blank" rel="noopener">{t("settings.usageLink")}</a></>}
      </div>
      {(c.key || c.baseURL) && (
        <div className="page-foot">
          <button className="btn btn-ghost danger wide" type="button" id="logout" onClick={async () => {
            if (!confirm(t("settings.logoutConfirm"))) return;
            if (S.busy) send(""); // 執行中的任務沒有金鑰也跑不完：停掉，但畫面上的對話留著
            S.providers[p] = { model: c.model };
            latest.current = { key: "", base: "" };
            await persistProviders();
            if (p === "anthropic") await chrome.storage.local.remove("key"); // 舊版欄位，不移掉下次會被當成金鑰讀回來
            // byok 把自己的 Key 拿掉＝沒有東西可以用了：回首次設定頁（可以重新填，或改用 Cloud）；cloud 模式只是清掉欄位
            if (S.mode === "byok" && !ready()) { nav.closeAll(); showView(); }
            else { setKey(""); setBase(""); }
          }}>{t("settings.logout")}</button>
        </div>
      )}
    </>
  );
}

// 「使用自己的 API Key（進階）」：預設收合。裡面是供應商與金鑰設定，加一個切換模式的開關（cloud ⇄ byok）
export function ByokSection({ nav }: { nav: Nav }) {
  const model = currentModel();
  const name = providerName(S.provider) + (model ? ` · ${ANTHROPIC_MODELS.find((m) => m.value === model)?.label ?? model}` : "");
  const byok = S.mode === "byok";
  const canUse = byok || ready(); // 還沒填好供應商設定就不能打開
  return (
    <details className="advanced" id="byok-details">
      <summary className="list-row nav-row" id="byok-summary">
        <span className="row-text">{t("byok.title")}<small id="byok-state">{byok ? t("byok.on", { name }) : t("byok.off")}</small></span>
        <IconChevron />
      </summary>
      <div className="advanced-body">
        <label className="list-row byok-toggle">
          <span className="row-text">{t("byok.use")}<small>{canUse ? t("byok.useHint") : t("byok.needKey")}</small></span>
          <input type="checkbox" className="switch" id="byok-on" checked={byok} disabled={!canUse} onChange={(e) => setMode(e.target.checked ? "byok" : "cloud")} />
        </label>
        <div className="row">
          <label className="field-label" htmlFor="provider-select">{t("onboard.provider")}</label>
          <Select id="provider-select" variant="field" label={t("onboard.provider")} value={S.provider}
            options={PROVIDER_IDS.map((id) => ({ value: id, label: providerName(id) }))}
            onChange={(v) => { S.provider = v as ProviderId; emit(); persistProviders(); scheduleSuggestions(); }} />
        </div>
        <ProviderFields key={S.provider} p={S.provider} nav={nav} />
      </div>
    </details>
  );
}

// ---------- 記憶 ----------

function memoryError(r: ReturnType<typeof addMemory>) {
  if (r.code === "tooLong") return t("memory.errTooLong", { n: r.length!, max: MAX_MEMORY_CHARS });
  if (r.code === "duplicate") return t("memory.errDuplicate");
  if (r.code === "full") return t("memory.errFull", { max: MAX_MEMORIES });
  return t("memory.errEmpty");
}

export function MemoryPage({ nav }: { nav: Nav }) {
  const [mem, setMem] = useState("");
  const [memErr, setMemErr] = useState<ReturnType<typeof addMemory> | null>(null); // 存結果不存字串：換語言時跟著換
  const add = async (e: FormEvent) => {
    e.preventDefault();
    const r = addMemory(S.memories, mem);
    if (r.list === S.memories) { setMemErr(r); return; }
    setMemErr(null);
    await setMemories(r.list);
    setMem("");
  };
  const remove = async (m: string) => {
    const index = S.memories.indexOf(m);
    await setMemories(S.memories.filter((x) => x !== m));
    showToast(t("memory.deleted"), () => {
      if (S.memories.includes(m)) return;
      const list = [...S.memories];
      list.splice(Math.min(index, list.length), 0, m);
      setMemories(list.slice(0, MAX_MEMORIES));
    });
  };
  return (
    <Page id="memory" title={t("memory.title")} onBack={nav.pop}>
      <div className="list-group">
        <label className="list-row">
          <span className="row-text">{t("memory.enable")}</span>
          <input type="checkbox" className="switch" id="memory-on" checked={S.memoryOn} onChange={(e) => {
            S.memoryOn = e.target.checked;
            emit();
            persist({ memoryOn: S.memoryOn });
          }} />
        </label>
      </div>
      <div className="hint">{t("memory.hint")}</div>
      <div className="row">
        <form className="key-row" id="memory-add" onSubmit={add}>
          <input className="input" id="memory-input" placeholder={t("memory.placeholder")} aria-label={t("memory.placeholder")} autoComplete="off" maxLength={MAX_MEMORY_CHARS} value={mem} onChange={(e) => setMem(e.target.value)} />
          <button className="btn btn-ghost" type="submit">{t("memory.add")}</button>
        </form>
        <div className="form-error" id="memory-error">{memErr && memoryError(memErr)}</div>
      </div>
      {!S.memories.length ? <div className="skill-empty">{t("memory.empty")}</div> : (
        <ul className="item-list" id="memory-list" role="list">
          {S.memories.map((m) => (
            <li className="memory-row" key={m}>
              <span>{m}</span>
              <button type="button" className="icon-btn" title={t("common.delete")} aria-label={`${t("common.delete")}: ${m}`} onClick={() => remove(m)}><IconErr /></button>
            </li>
          ))}
        </ul>
      )}
      {!!S.memories.length && (
        <div className="page-foot">
          <button className="btn btn-ghost danger wide" type="button" id="memory-clear" onClick={async () => {
            if (confirm(t("memory.clearConfirm", { n: S.memories.length }))) await setMemories([]);
          }}>{t("memory.clear")}</button>
        </div>
      )}
    </Page>
  );
}

// ---------- 技能 ----------

// 技能合計的上限：chrome.storage.local 總共 10 MB，記憶與對話紀錄也存在裡面，不能被技能的附帶檔案擠掉
const SKILLS_BYTES = 4 * 1024 * 1024;
const bytesOf = (list: Skill[]) => new Blob([JSON.stringify(list)]).size;

async function saveSkills(list: Skill[]) {
  const before = S.skills;
  if (bytesOf(list) > SKILLS_BYTES && bytesOf(list) > bytesOf(before)) throw new InstallError("skills.errStorage"); // 變小（刪除、改短）永遠可以
  S.skills = list;
  emit();
  // 附帶檔案的技能可能很大：存不進去（chrome.storage.local 上限 10 MB）就退回，不要畫面上有、重開就不見
  try { await persist({ skills: list }); } catch { S.skills = before; emit(); throw new InstallError("skills.errStorage"); }
}

const failText = (e: unknown) => (e instanceof InstallError ? t(e.key, e.params) : String((e as Error)?.message ?? e));

const MAX_SKILLS = 100; // 說明每輪都進系統提示詞：一個 zip 塞上千個技能＝每次請求都很貴
type Found = { skills: Skill[]; skipped: string[] };

// 本機檔案 → 技能（還沒加進清單，先給使用者預覽）：.md 一個檔一個技能；.zip／.skill 與資料夾照技能資料夾的結構拆
async function readFiles(files: File[], folder: boolean): Promise<Found> {
  if (folder) return bundleSkills(folderEntries(files), (root) => root || files[0]?.webkitRelativePath.split("/")[0] || "folder");
  const found: Found = { skills: [], skipped: [] };
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (isZip(bytes)) {
      const out = await bundleSkills(unzip(bytes.buffer), (root) => (root ? `${file.name}/${root}` : file.name), file.name.replace(/\.(zip|skill)$/i, ""));
      found.skills.push(...out.skills); found.skipped.push(...out.skipped);
      if (!out.skills.length && !out.skipped.length) found.skipped.push(file.name);
      continue;
    }
    // Claude Code 的技能檔名一律是 SKILL.md，那種就只能靠 frontmatter 裡的 name
    const skill = parseSkill(new TextDecoder().decode(bytes), file.name.replace(/\.md$/i, "").replace(/^SKILL$/i, ""));
    if (!skill.name || !skill.body) { found.skipped.push(file.name); continue; }
    found.skills.push({ ...skill, description: skill.description.slice(0, 1024), source: file.name });
  }
  return found;
}

// 預覽卡確認過的技能加進清單：同名的取代（卡片上已標出），超過上限的不加
async function addSkills(picked: Skill[]) {
  let list = [...S.skills];
  const added: string[] = [];
  const over: string[] = [];
  for (const skill of picked) {
    const i = list.findIndex((s) => s.name === skill.name);
    if (i === -1 && list.length >= MAX_SKILLS) { over.push(`/${skill.name}`); continue; }
    list = i === -1 ? [...list, skill] : list.map((s, j) => (j === i ? skill : s));
    added.push(`/${skill.name}`);
  }
  await saveSkills(list);
  return { added, over };
}

const shortSource = (s: string) => s.replace(/^https?:\/\//, "").replace(/\/tree\/HEAD(?=\/|$)/, "");

// 次要的來源：文字按鈕。label 包 input：點得到、鍵盤 focus 在 label 上按 Enter 由瀏覽器開檔案選擇
function FileButton({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="text-btn" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.querySelector("input")!.click(); } }}>
      {icon}{label}{children}
    </label>
  );
}

type Preview = Found & { picked: boolean[] };

// 安裝前預覽：第三方內容先讓使用者看名稱、說明、來源、會不會取代現有的，勾選後才裝
function PreviewCard({ preview, setPreview, busy, onInstall }: { preview: Preview; setPreview: (p: Preview | null) => void; busy: boolean; onInstall: () => void }) {
  const many = preview.skills.length > 1;
  return (
    <section className="card preview-card" id="skill-preview" aria-labelledby="skill-preview-title">
      <div className="card-title" id="skill-preview-title"><IconShield />{t("skills.previewTitle")}</div>
      <div className="preview-list">
        {preview.skills.map((s, i) => {
          const files = Object.keys(s.files ?? {}).length;
          const Row = many ? "label" : "div";
          return (
            <Row key={i} className="preview-item">
              {many && <input type="checkbox" checked={preview.picked[i]} onChange={(e) => setPreview({ ...preview, picked: preview.picked.map((x, j) => (j === i ? e.target.checked : x)) })} />}
              <span className="row-text">
                <strong>/{s.name}{S.skills.some((x) => x.name === s.name) && <span className="badge warn">{t("skills.replaces")}</span>}</strong>
                <small>{s.description || t("slash.noDescription")}</small>
                <span className="preview-meta"><span className="preview-source">{shortSource(s.source!)}</span>{files > 0 && <span>{t("skills.filesCount", { n: files })}</span>}</span>
              </span>
            </Row>
          );
        })}
      </div>
      {!!preview.skipped.length && (
        <details className="preview-skipped"><summary>{t("skills.skipped", { n: preview.skipped.length })}</summary>{preview.skipped.join(t("common.listSep"))}</details>
      )}
      <p className="preview-warn">{t("skills.previewWarn")}</p>
      <div className="card-actions">
        <button className="btn btn-primary sm" type="button" id="skill-preview-install" disabled={busy || !preview.picked.some(Boolean)} onClick={onInstall}>{busy ? t("skills.installing") : t("skills.install")}</button>
        <button className="btn btn-ghost sm" type="button" id="skill-preview-cancel" disabled={busy} onClick={() => setPreview(null)}>{t("common.cancel")}</button>
      </div>
    </section>
  );
}

export function SkillsPage({ nav }: { nav: Nav }) {
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState<"" | "loading" | "saving">("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);

  // 抓／讀到的技能先進預覽卡；跟內建指令同名的直接列進「沒有匯入」
  const load = async (get: () => Promise<Found>) => {
    setBusy("loading"); setErr(""); setDone(""); setPreview(null);
    try {
      const { skills, skipped } = await get();
      const ok = skills.filter((s) => !COMMANDS.some((c) => c.name === s.name));
      if (!ok.length) throw new InstallError("skills.errNotFound");
      setPreview({ skills: ok, skipped: [...skipped, ...skills.filter((s) => !ok.includes(s)).map((s) => `/${s.name}`)], picked: ok.map(() => true) });
    } catch (e) {
      setErr(failText(e));
    } finally {
      setBusy("");
    }
  };
  const install = async () => {
    if (!preview) return;
    setBusy("saving"); setErr("");
    try {
      const { added, over } = await addSkills(preview.skills.filter((_, i) => preview.picked[i]));
      if (added.length) setDone(t("skills.installed", { names: added.join(t("common.listSep")) }));
      if (over.length) setErr(t("skills.errLimit", { names: over.join(t("common.listSep")) }));
      setPreview(null);
      setSrc("");
    } catch (e) {
      setErr(failText(e));
    } finally {
      setBusy("");
    }
  };
  const pick = (folder: boolean) => (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = [...(input.files ?? [])];
    input.value = "";
    if (files.length) load(() => readFiles(files, folder));
  };

  // 清單分兩組：裝來的（第三方）在上，內建與自己寫的在下（「自己寫一個」放在這組標題旁）；id 用在 S.skills 的位置
  const rows = S.skills.map((skill, i) => ({ skill, i }));
  const installed = rows.filter((r) => r.skill.source);
  const other = rows.filter((r) => !r.skill.source);
  const list = (items: typeof rows) => (
    <div className="list-group">
      {items.map(({ skill, i }) => (
        <button key={i} type="button" className="list-row nav-row skill-row" id={`skill-${i}`} onClick={() => nav.push({ name: "skill", skill })}>
          <span className="row-text"><strong>/{skill.name}{skill.source && <span className="badge">{t("skills.thirdParty")}</span>}</strong><small>{skill.description || t("slash.noDescription")}</small></span>
          <IconChevron />
        </button>
      ))}
    </div>
  );

  return (
    <Page id="skills" title={t("skills.title")} onBack={nav.pop}>
      <section className="card add-card" aria-labelledby="skill-add-title">
        <div className="add-head">
          <strong id="skill-add-title">{t("skills.addTitle")}</strong>
          <small>{t("skills.addHint")}</small>
        </div>
        <form className="input-group" id="skill-install-form" onSubmit={(e) => { e.preventDefault(); if (src.trim() && !busy) load(() => fetchSkills(src)); }}>
          <IconLink />
          <input id="skill-install" aria-label={t("skills.addTitle")} placeholder={t("skills.installPlaceholder")} autoComplete="off" spellCheck={false} value={src} onChange={(e) => { setSrc(e.target.value); setErr(""); }} />
          <button className="btn btn-primary" type="submit" id="skill-install-btn" disabled={!!busy || !src.trim()}>{busy === "loading" ? t("skills.fetching") : t("skills.install")}</button>
        </form>
        <div className="form-error" id="skill-install-error" role="alert">{err}</div>
        {done && <div className="notice" id="skill-installed" role="status">{done}</div>}
        <div className="source-links">
          <a className="text-btn" href="https://skills.sh" target="_blank" rel="noopener noreferrer"><IconGlobe />{t("skills.browse")}</a>
          <FileButton label={t("skills.import")} icon={<IconFile />}><input type="file" id="skill-import" accept=".md,.zip,.skill,text/markdown,application/zip" multiple hidden onChange={pick(false)} /></FileButton>
          {/* webkitdirectory 不在 React 的屬性型別裡 */}
          <FileButton label={t("skills.importFolder")} icon={<IconFolder />}><input type="file" id="skill-import-folder" hidden onChange={pick(true)} {...{ webkitdirectory: "" }} /></FileButton>
        </div>
      </section>
      {preview && <PreviewCard preview={preview} setPreview={setPreview} busy={busy === "saving"} onInstall={install} />}
      {!!installed.length && (
        <section className="skill-group" id="skill-group-installed">
          <div className="group-head"><h2 className="group-title">{t("skills.groupInstalled")}<span className="group-count">{installed.length}</span></h2></div>
          {list(installed)}
        </section>
      )}
      <section className="skill-group" id="skill-group-other">
        <div className="group-head">
          <h2 className="group-title">{t("skills.groupOther")}{!!other.length && <span className="group-count">{other.length}</span>}</h2>
          <button className="text-btn" type="button" id="skill-new" onClick={() => nav.push({ name: "skill", skill: null })}><IconPlus />{t("skills.new")}</button>
        </div>
        {other.length ? list(other) : !S.skills.length && <div className="skill-empty">{t("skills.empty")}</div>}
      </section>
      <div className="hint">{rich(t("skills.hint"), { slash: <code>/</code> })}</div>
    </Page>
  );
}

export function SkillEditorPage({ skill: editing, nav }: { skill: Skill | null; nav: Nav }) {
  const [name, setName] = useState(editing?.name ?? "");
  const [desc, setDesc] = useState(editing?.description ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [err, setErr] = useState("");
  const dirty = name !== (editing?.name ?? "") || desc !== (editing?.description ?? "") || body !== (editing?.body ?? "");
  const back = () => { if (!dirty || confirm(t("skillEditor.discardConfirm"))) nav.pop(); };

  // trust：來源不明的舊技能，使用者確認是自己寫的 → 拿掉來源（不再當第三方）
  const save = async (e: { preventDefault(): void }, trust = false) => {
    e.preventDefault();
    // 編輯器沒顯示的欄位要保留（model、來源、附帶檔案、disable-model-invocation 等）
    const skill: Skill = { ...editing, name: cleanName(name), description: desc.trim(), body: body.trim() };
    if (trust) delete skill.source;
    if (!skill.name || !skill.body) return setErr(t("skillEditor.errRequired"));
    if (COMMANDS.some((c) => c.name === skill.name)) return setErr(t("skillEditor.errReserved", { name: skill.name }));
    if (S.skills.some((s) => s.name === skill.name && s !== editing)) return setErr(t("skillEditor.errDuplicate", { name: skill.name }));
    try { await saveSkills(editing ? S.skills.map((s) => (s === editing ? skill : s)) : [...S.skills, skill]); } catch (err) { return setErr(failText(err)); }
    nav.pop();
  };

  return (
    <Page id="skill-editor" title={editing ? t("skillEditor.edit") : t("skillEditor.new")} onBack={back}>
      <form id="skill-form" onSubmit={save}>
        <div className="row">
          <label className="field-label" htmlFor="skill-name">{t("skillEditor.name")}</label>
          <input className="input" id="skill-name" required placeholder={t("skillEditor.namePlaceholder")} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="row">
          <label className="field-label" htmlFor="skill-desc">{t("skillEditor.desc")}</label>
          <textarea className="input skill-desc" id="skill-desc" rows={2} placeholder={t("skillEditor.descPlaceholder")} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="row">
          <label className="field-label" htmlFor="skill-body">{t("skillEditor.body")}</label>
          <textarea className="input skill-body" id="skill-body" required placeholder={t("skillEditor.bodyPlaceholder")} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        {editing?.source && <div className="hint" id="skill-source">{editing.source === LEGACY_SOURCE ? t("skillEditor.sourceLegacy") : t("skillEditor.source", { source: editing.source })}</div>}
        {editing?.files && <div className="hint" id="skill-files">{t("skillEditor.files", { files: Object.keys(editing.files).join(t("common.listSep")) })}</div>}
        <div className="form-error" id="skill-error">{err}</div>
        <div className="actions">
          <button className="btn btn-primary" type="submit">{t("skillEditor.save")}</button>
          {editing && <button className="btn btn-ghost" type="button" id="skill-export" onClick={() => download(`${editing.name}.md`, serializeSkill(editing))}>{t("skillEditor.export")}</button>}
          {/* 只給來源不明的舊技能：從網址／檔案裝的第三方技能不能一鍵洗成可信 */}
          {editing?.source === LEGACY_SOURCE && <button className="btn btn-ghost" type="button" id="skill-trust" onClick={(e) => { if (confirm(t("skillEditor.trustConfirm"))) save(e, true); }}>{t("skillEditor.trust")}</button>}
        </div>
      </form>
      {editing && (
        <div className="page-foot">
          <button className="btn btn-ghost danger wide" type="button" id="skill-delete" onClick={async () => {
            if (!confirm(t("skillEditor.deleteConfirm", { name: editing.name }))) return;
            await saveSkills(S.skills.filter((s) => s !== editing));
            nav.pop();
          }}>{t("common.delete")}</button>
        </div>
      )}
    </Page>
  );
}
