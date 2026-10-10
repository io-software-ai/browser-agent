// 專案的介面：頂列的切換器、專案清單頁、專案頁（指示、檔案、記憶、技能、對話）。規格：.claude/notes/projects.md
import { useEffect, useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { S, showToast } from "./store";
import { resetChat, openChat } from "./agent";
import { t, currentLang } from "./i18n";
import { Page, RowMenu, MemoryEditor, type Nav, type MenuItem } from "./pages";
import { IconBookmark, IconChevron, IconChevronDown, IconErr, IconFile, IconFolder, IconHistory } from "./icons";
import { openPdf, pdfText, isScanned, MAX_SCAN_BYTES } from "./pdf";
import {
  MAX_PROJECTS, MAX_FILES, MAX_FILE_BYTES, MAX_PROJECT_BYTES, MAX_INSTRUCTIONS, MAX_PROJECT_NAME,
  newProject, cleanProjectName, currentProject, saveProjects, updateProject, setCurrentProject, addProjectFiles, removeProjectFile, deleteProject,
  decodeText, fileText, type Project, type ProjectFile,
} from "./projects";

// 切專案＝在那個專案開新對話（畫面上的對話已經存在歷史裡）。任務進行中不能切：系統提示詞已經照舊專案組好
export async function switchProject(id: string | null) {
  if (S.busy || id === S.projectId) return;
  await setCurrentProject(id);
  resetChat();
}

export function ProjectSwitch({ nav }: { nav: Nav }) {
  const p = currentProject();
  const inner = (
    <>
      <IconFolder />
      <span>{p?.name ?? t("projects.title")}</span>
      {S.projects.length > 0 && <IconChevronDown />}
    </>
  );
  // 還沒有任何專案：直接到專案頁建立，不要開一個只有「不使用專案」的選單
  if (!S.projects.length) {
    return <button type="button" className="project-switch" id="project-switch" data-none="" title={t("projects.new")} aria-label={t("projects.new")} disabled={S.busy} onClick={() => nav.push({ name: "projects" })}>{inner}</button>;
  }
  const recent = [...S.projects].sort((a, b) => b.updated - a.updated);
  const items: MenuItem[] = [
    { label: t("projects.none"), checked: !p, run: () => switchProject(null) },
    ...recent.map((x, i) => ({ label: x.name, checked: x.id === p?.id, divider: i === 0, run: () => switchProject(x.id) })),
    { label: t("projects.manage"), divider: true, run: () => nav.push({ name: "projects" }) },
  ];
  return (
    <div className="project-switch-wrap" data-none={p ? undefined : ""}>
      <RowMenu label={p ? t("projects.switchLabel", { name: p.name }) : t("projects.title")} items={items} btnClass="project-switch" btnId="project-switch" disabled={S.busy} align="left">{inner}</RowMenu>
    </div>
  );
}

// ---------- 專案清單 ----------

export function ProjectsPage({ nav }: { nav: Nav }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const create = async (e: FormEvent) => {
    e.preventDefault();
    const n = cleanProjectName(name);
    if (!n) return;
    if (S.projects.length >= MAX_PROJECTS) { setErr(t("projects.errLimit", { max: MAX_PROJECTS })); return; }
    const p = newProject(n);
    try {
      await saveProjects([p, ...S.projects]);
    } catch {
      setErr(t("projects.errStorage"));
      return;
    }
    setName("");
    setErr("");
    nav.push({ name: "project", id: p.id });
  };
  const list = [...S.projects].sort((a, b) => b.updated - a.updated);
  return (
    <Page id="projects" title={t("projects.title")} onBack={nav.pop}>
      <div className="card add-card">
        <div className="add-head">
          <strong>{t("projects.new")}</strong>
          <small>{t("projects.intro")}</small>
        </div>
        <form className="input-group" id="project-create" onSubmit={create}>
          <IconFolder />
          <input id="project-new-name" placeholder={t("projects.namePlaceholder")} aria-label={t("projects.namePlaceholder")} autoComplete="off" maxLength={MAX_PROJECT_NAME} value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn btn-primary" type="submit" disabled={!cleanProjectName(name)}>{t("projects.create")}</button>
        </form>
        <div className="form-error" id="project-create-error">{err}</div>
      </div>
      {!!list.length && (
        <div className="list-group" id="project-list">
          {list.map((p) => <ProjectRow key={p.id} p={p} onOpen={() => nav.push({ name: "project", id: p.id })} />)}
        </div>
      )}
    </Page>
  );
}

// 數量用圖示＋數字：15 種語言不用各自處理單複數
function Count({ icon, label, n }: { icon: ReactNode; label: string; n: number }) {
  return <span title={label}>{icon}{n}<span className="sr-only"> {label}</span></span>;
}

function ProjectMeta({ p }: { p: Project }) {
  return (
    <span className="project-meta">
      <Count icon={<IconFile />} label={t("project.files")} n={p.files.length} />
      <Count icon={<IconBookmark />} label={t("project.memory")} n={p.memories.length} />
      <Count icon={<IconHistory />} label={t("project.chats")} n={S.chats.filter((c) => c.projectId === p.id).length} />
    </span>
  );
}

function ProjectRow({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <button type="button" className="list-row nav-row project-row" onClick={onOpen}>
      <span className="project-icon"><IconFolder /></span>
      <span className="row-text">
        <strong>{p.name}{p.id === S.projectId && <span className="badge">{t("projects.inUse")}</span>}</strong>
        <ProjectMeta p={p} />
      </span>
      <IconChevron />
    </button>
  );
}

// 首頁（還沒開始對話）的專案卡：告訴使用者這個對話會帶著哪個專案，點了去專案頁
export function ProjectBanner({ nav }: { nav: Nav }) {
  const p = currentProject();
  if (!p) return null;
  const empty = !p.instructions.trim() && !p.files.length;
  return (
    <button type="button" className="project-banner" id="empty-project" onClick={() => nav.push({ name: "project", id: p.id })}>
      <span className="project-icon"><IconFolder /></span>
      <span className="row-text">
        <strong>{p.name}</strong>
        {empty ? <small>{t("projects.setupHint")}</small> : <ProjectMeta p={p} />}
      </span>
      <IconChevron />
    </button>
  );
}

// ---------- 專案頁 ----------

const PDF_RE = /\.pdf$/i;
export const FILE_ACCEPT = ".txt,.md,.markdown,.csv,.tsv,.json,.jsonl,.yaml,.yml,.xml,.html,.htm,.css,.js,.jsx,.ts,.tsx,.py,.rb,.go,.rs,.java,.kt,.swift,.c,.h,.cpp,.cs,.php,.sh,.sql,.toml,.ini,.log,.tex,.srt,.vtt,.pdf,text/*,application/pdf";

// 上傳的檔案轉成文字：純文字類照 UTF-8（或 UTF-16、介面語言常見的舊編碼）解碼，解不開＝二進位檔；PDF 抽文字層（掃描檔沒有文字，拒收）。
// 讀不到的檔（拖進資料夾、檔案已被移走）也回錯誤，不丟例外
export async function fileToText(f: File): Promise<{ name: string; text: string } | { err: string }> {
  const pdf = PDF_RE.test(f.name) || f.type === "application/pdf";
  if (f.size > (pdf ? MAX_SCAN_BYTES : MAX_FILE_BYTES)) return { err: t("project.errFileTooBig", { name: f.name }) };
  let text: string | null;
  try {
    const buf = await f.arrayBuffer();
    if (pdf) {
      const doc = await openPdf(buf);
      text = await pdfText(doc);
      if (isScanned(text, doc.numPages)) return { err: t("project.errScanned", { name: f.name }) };
    } else {
      text = decodeText(buf, currentLang());
      if (text == null) return { err: t("project.errBinary", { name: f.name }) };
    }
  } catch {
    return { err: t(pdf ? "project.errPdf" : "project.errBinary", { name: f.name }) };
  }
  if (new Blob([text]).size > MAX_FILE_BYTES) return { err: t("project.errFileTooBig", { name: f.name }) };
  return { name: f.name, text };
}

// 一個一個轉成文字再一起存；上限由 addProjectFiles 照存的當下的專案判斷，放不下的列出名字
async function upload(id: string, files: File[]): Promise<string[]> {
  const errs: string[] = [];
  const ok: { name: string; text: string }[] = [];
  for (const f of files) {
    const r = await fileToText(f);
    if ("err" in r) errs.push(r.err);
    else ok.push(r);
  }
  if (!ok.length) return errs;
  try {
    const { over } = await addProjectFiles(id, ok);
    if (over.length) errs.push(t("project.errFull", { max: MAX_FILES, names: over.join(", ") }));
  } catch {
    errs.push(t("project.errStorage"));
  }
  return errs;
}

export function ProjectPage({ id, nav }: { id: string; nav: Nav }) {
  const p = S.projects.find((x) => x.id === id);
  if (!p) {
    return (
      <Page id="project" title={t("projects.title")} onBack={nav.pop}>
        <div className="empty-state"><span>{t("project.gone")}</span></div>
      </Page>
    );
  }
  return (
    <Page id="project" title={p.name} onBack={nav.pop}>
      <button className="btn btn-primary wide" type="button" id="project-start" disabled={S.busy} onClick={async () => {
        await setCurrentProject(id);
        resetChat();
        nav.closeAll("input");
      }}>{t("project.start")}</button>
      <ProjectDetails p={p} />
      <ProjectFiles p={p} />
      <section className="skill-group" aria-labelledby="project-memory-title">
        <div className="group-head"><h2 className="group-title" id="project-memory-title">{t("project.memory")}<span className="group-count">{p.memories.length}</span></h2></div>
        <div className="hint">{t("project.memoryHint")}</div>
        {!S.memoryOn && <div className="notice" id="project-memory-off">{t("project.memoryOff")}</div>}
        <MemoryEditor id="project-memory" get={() => S.projects.find((x) => x.id === id)?.memories ?? []} save={(list) => updateProject(id, { memories: list })} placeholder={t("project.memoryPlaceholder")} />
      </section>
      <ProjectSkills p={p} />
      <ProjectChats p={p} nav={nav} />
      <DeleteProject p={p} nav={nav} />
    </Page>
  );
}

// 名稱與指示：邊打邊存（停 0.5 秒），離開欄位或關掉頁面時立刻存
function ProjectDetails({ p }: { p: Project }) {
  const [name, setName] = useState(p.name);
  const [instr, setInstr] = useState(p.instructions);
  const pending = useRef<{ name?: string; instructions?: string }>({});
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const flush = () => {
    clearTimeout(timer.current);
    const patch = pending.current;
    pending.current = {};
    if (patch.name !== undefined && !patch.name) delete patch.name; // 名稱清空不存：離開欄位時還原
    if (Object.keys(patch).length) updateProject(p.id, patch);
  };
  const later = (patch: { name?: string; instructions?: string }) => {
    Object.assign(pending.current, patch);
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 500);
  };
  useEffect(() => flush, []);
  return (
    <section className="skill-group" aria-labelledby="project-instr-title">
      <label className="row">
        <span className="group-title">{t("project.name")}</span>
        <input className="input" id="project-name" maxLength={MAX_PROJECT_NAME} autoComplete="off" value={name}
          onChange={(e) => { setName(e.target.value); later({ name: cleanProjectName(e.target.value) }); }}
          onBlur={() => { flush(); if (!cleanProjectName(name)) setName(p.name); }} />
      </label>
      <div className="row">
        <div className="group-head">
          <h2 className="group-title" id="project-instr-title"><label htmlFor="project-instructions">{t("project.instructions")}</label></h2>
          <small className="char-count" aria-live="polite">{instr.length.toLocaleString(currentLang())} / {MAX_INSTRUCTIONS.toLocaleString(currentLang())}</small>
        </div>
        <textarea className="input project-instructions" id="project-instructions" maxLength={MAX_INSTRUCTIONS} placeholder={t("project.instructionsPlaceholder")} value={instr}
          onChange={(e) => { setInstr(e.target.value); later({ instructions: e.target.value }); }} onBlur={flush} />
        <div className="hint">{t("project.instructionsHint")}</div>
      </div>
    </section>
  );
}

function ProjectFiles({ p }: { p: Project }) {
  const [errs, setErrs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  // 多批（又拖一批、或解析大 PDF 時再選檔）排成一條：一批存完才開始下一批
  const queue = useRef(Promise.resolve());
  const add = (files: File[]) => {
    if (!files.length) return;
    queue.current = queue.current.then(async () => {
      setBusy(true);
      try {
        setErrs(await upload(p.id, files));
      } finally {
        setBusy(false);
      }
    });
  };
  const remove = async (f: ProjectFile) => {
    const text = await fileText(f).catch(() => null);
    await removeProjectFile(p.id, f.id);
    if (text != null) showToast(t("project.fileDeleted"), () => { addProjectFiles(p.id, [{ name: f.name, text }]); });
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    add([...e.dataTransfer.files]);
  };
  return (
    <section className="skill-group" aria-labelledby="project-files-title" onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrag(false); }} onDrop={onDrop}>
      <div className="group-head">
        <h2 className="group-title" id="project-files-title">{t("project.files")}<span className="group-count">{p.files.length}</span></h2>
        {!!p.files.length && <button type="button" className="text-btn" id="project-upload" disabled={busy} onClick={() => input.current?.click()}>{t("project.upload")}</button>}
      </div>
      <input type="file" ref={input} id="project-file-input" multiple accept={FILE_ACCEPT} hidden onChange={(e) => { add([...(e.target.files ?? [])]); e.target.value = ""; }} />
      {p.files.length ? (
        <ul className="item-list file-list" id="project-files" role="list" data-drag={drag ? "" : undefined}>
          {p.files.map((f) => (
            <li className="file-row" key={f.id}>
              <IconFile />
              <span className="row-text"><span className="file-name">{f.name}</span><small>{t("project.fileChars", { n: f.chars.toLocaleString(currentLang()) })}</small></span>
              <button type="button" className="icon-btn" title={t("common.delete")} aria-label={`${t("common.delete")}: ${f.name}`} onClick={() => remove(f)}><IconErr /></button>
            </li>
          ))}
        </ul>
      ) : (
        <button type="button" className="drop-zone" id="project-drop" data-drag={drag ? "" : undefined} disabled={busy} onClick={() => input.current?.click()}>
          <IconFile />
          <strong>{t("project.drop")}</strong>
          <small>{t("project.fileTypes")}</small>
        </button>
      )}
      {busy && <div className="hint" aria-live="polite">{t("project.reading")}</div>}
      {errs.map((e, i) => <div className="form-error" key={i}>{e}</div>)}
      <div className="hint">{t("project.filesHint")}</div>
    </section>
  );
}

function ProjectSkills({ p }: { p: Project }) {
  const pick = !!p.skills;
  const shown = S.skills.filter((s) => !s.hidden);
  const toggle = (name: string, on: boolean) => updateProject(p.id, { skills: on ? [...p.skills!, name] : p.skills!.filter((x) => x !== name) });
  return (
    <section className="skill-group" aria-labelledby="project-skills-title">
      <div className="group-head"><h2 className="group-title" id="project-skills-title">{t("project.skills")}</h2></div>
      <div className="list-group" id="project-skills">
        <label className="list-row">
          <span className="row-text">{t("project.skillsPick")}<small>{t(pick ? "project.skillsPickOn" : "project.skillsPickOff")}</small></span>
          {/* 打開時先全選：開關本身不改變任何行為，取消勾選才少 */}
          <input type="checkbox" className="switch" id="project-skills-pick" checked={pick} onChange={(e) => updateProject(p.id, { skills: e.target.checked ? S.skills.map((s) => s.name) : undefined })} />
        </label>
        {pick && shown.map((s) => (
          <label className="list-row skill-pick" key={s.name}>
            <input type="checkbox" checked={p.skills!.includes(s.name)} onChange={(e) => toggle(s.name, e.target.checked)} />
            <span className="row-text"><strong>/{s.name}</strong><small>{s.description || t("slash.noDescription")}</small></span>
          </label>
        ))}
      </div>
    </section>
  );
}

function ProjectChats({ p, nav }: { p: Project; nav: Nav }) {
  const chats = S.chats.filter((c) => c.projectId === p.id);
  return (
    <section className="skill-group" aria-labelledby="project-chats-title">
      <div className="group-head"><h2 className="group-title" id="project-chats-title">{t("project.chats")}<span className="group-count">{chats.length}</span></h2></div>
      {!chats.length ? <div className="skill-empty">{t("project.chatsEmpty")}</div> : (
        <ul className="item-list" id="project-chats" role="list">
          {chats.map((c) => (
            <li className="chat-row" key={c.id} aria-current={c.id === S.chatId ? "true" : undefined}>
              <button type="button" className="chat-open" disabled={S.busy} onClick={async () => { await openChat(c); nav.closeAll("input"); }}>
                <span className="chat-title">{c.title}</span>
                <time dateTime={new Date(c.updated).toISOString()}>{new Date(c.updated).toLocaleDateString(currentLang(), { month: "numeric", day: "numeric" })}</time>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// 刪除用頁面內確認，不用原生 confirm()：檔案與專案記憶一起刪，對話留在歷史裡
function DeleteProject({ p, nav }: { p: Project; nav: Nav }) {
  const [asking, setAsking] = useState(false);
  return (
    <div className="page-foot">
      {asking ? (
        <div className="card confirm-inline" id="project-delete-confirm" role="alertdialog" aria-labelledby="project-delete-text">
          <span id="project-delete-text">{t("project.deleteConfirm", { name: p.name })}</span>
          <div className="actions">
            <button className="btn btn-danger" type="button" id="project-delete-yes" disabled={S.busy} onClick={async () => { await deleteProject(p.id); nav.pop(); }}>{t("common.delete")}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setAsking(false)}>{t("common.cancel")}</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-ghost danger wide" type="button" id="project-delete" disabled={S.busy} onClick={() => setAsking(true)}>{t("project.delete")}</button>
      )}
    </div>
  );
}
