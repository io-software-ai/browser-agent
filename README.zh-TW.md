<div align="center">

<img src="docs/logo.svg" width="72" alt="Browser Agent 標誌">

# Browser Agent

**把 AI agent 放進你的瀏覽器，直接操作你正在看的網站：讀頁面、點擊、輸入、在頁面之間移動都交給它；一頁不夠時，它也會跨網站做研究，給你附來源的答案。**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · 繁體中文 · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="選取一段文字後用 /explain 解釋；把筆電價格整理成 CSV；agent 要按「Place order」前先跳出確認卡，使用者按拒絕">

</div>

## 為什麼

- **直接在你正在看的頁面上做事。** 用平常說話的方式交代：摘要這頁、把價格整理成表格、幫我填這張表、找到取消訂閱的設定。它讀懂頁面、直接動手——不用把內容複製貼到另一個聊天分頁。
- **它看到的是網站真正的結構。** 模型拿到的是頁面文字和編號過的按鈕、連結、欄位清單，直接點 `ref: 12`，不是看截圖猜位置。選一段文字就只問那段；PDF 也行。
- **也能做研究，附上來源。** 答案不在這一頁時，它會用你自己的瀏覽器搜尋、讀幾個頁面、互相比較，回答裡的 `[n]` 引用都連回出處。
- **高風險動作會等你點頭。** 看起來不可逆的點擊與表單送出，還有 agent 自己組出來的網址，都要你在側邊欄按「允許」才會執行。這道檢查寫在擴充功能的程式碼裡，不是靠提示詞拜託模型。
- **免費開始，也可以用自己的金鑰。** 裝好就能用 Browser Agent Cloud，每月有免費點數，不用註冊。想用自己的供應商？在設定裡改用自己的 API Key，請求就從你的瀏覽器直接送到該供應商。

## 功能

**操作頁面**
- 工具：讀取頁面、點擊、輸入（包含 `<select>` 下拉選單）、捲動、開啟網址。模型拿到的是編號過的可互動元素清單，直接點 `ref: 12`，不用猜 CSS selector。
- 在頁面上選取文字，只針對那段發問；附上的是你選的內容，不是整頁。
- PDF：用 pdf.js 抽出文字。內建檢視器讓你像在一般網頁一樣選取 PDF 的文字。掃描檔（沒有文字層）在你確認費用後，可以整份交給 Claude 讀。
- 首頁：依你目前頁面產生的建議。

**跨網站研究**
- 在你自己瀏覽器的背景分頁搜尋與閱讀；登入後才看得到的頁面也行，你目前的分頁不會被動到。
- 每一頁依你的問題濃縮重點；來源有編號，`[n]` 引用可以點，來源會跟對話一起存下來，匯出時也會附上。
- 會順著讀過頁面裡的連結繼續讀，GitHub、npm 這類研究用網站可以直接讀；其他網址會先問你。

**對話裡**
- 串流顯示的 Markdown 回覆，支援表格與程式碼區塊，還有可展開的思考摘要。
- 選擇題卡片（`ask_user`）：模型需要你做決定時，用可點的選項問你，不亂猜。
- 檔案卡片：結果可以下載成 `csv`、`json`、`md`、`txt`、`tsv`、`xml`、`yaml`、`ics` 或 `vcf`，可以複製和預覽。

**留在你手上**
- 記憶：說「記住……」，它會在不同對話之間記得關於你的簡短事實。可以在設定裡查看、編輯或關閉。
- 歷史：最近 30 則對話，依日期分組。可以打開接著聊，或匯出成 Markdown。
- 12 個內建技能與 `/` 指令；可以自己寫，也能從 GitHub、skills.sh 或 ClawHub 安裝 [Agent Skills](https://agentskills.io/specification)（Claude Code 使用的 `SKILL.md` 格式）。
- 介面有 15 種語言；淺色、深色主題跟著系統。

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="供應商選單：Anthropic、OpenAI、Google Gemini、OpenRouter、自訂（OpenAI 相容）"></td>
    <td width="33%"><img src="docs/skills.png" alt="輸入 / 開啟技能選單"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="有三個選項、其中一個標為建議的選擇題卡片"></td>
  </tr>
  <tr>
    <td align="center">或用你自己的供應商</td>
    <td align="center">打 <code>/</code> 叫出技能</td>
    <td align="center">不確定就問你，不亂猜</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="內建 PDF 檢視器裡選取了一句話，側邊欄正在解釋它">

## 研究怎麼進行

問一個目前頁面回答不了的問題——例如「2026 年 React 狀態管理該用哪個？」——agent 就會去研究：

1. **搜尋。** 在背景分頁開搜尋（Google；Google 要求驗證時改用 Bing），讀標題、網址和摘要，讀完就關掉分頁。兩個都要求驗證時，搜尋分頁才會切到前景讓你處理，完成後研究會自動繼續。
2. **閱讀。** 在背景分頁打開最相關的結果，一次最多四個，抽出主要內容。你目前的分頁完全不會被動到。
3. **濃縮。** 每一頁先交給一個小而快的模型（Claude Haiku），依你的問題整理出重點、原文引句和日期，二十頁的全文不會塞滿對話，也不會讓費用暴增。
4. **回答。** 先給結論，再給比較表、推薦與理由，以及資料不足的地方。搜尋結果和讀過的頁面都有編號：回答裡的 `[n]` 可以點，回答下方會列出有引用到的來源。

每一步都會顯示在側邊欄，隨時可以按停止。一個任務最多 40 步、最多讀 30 頁。

## 快速開始

需要 Chrome 122 以上。

1. 安裝 **[Chrome 線上應用程式商店上的 Browser Agent](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)**，按 **加到 Chrome**。之後會自動更新。
2. 點工具列圖示打開側邊欄（找不到的話，從拼圖圖示的選單把它釘選出來），同意簡短的資料使用說明。
3. 針對你正在看的頁面發問，或請它研究某件事。不用金鑰、不用帳號。

### 從 Release 的 zip 安裝

新版本等商店審核時，Release 可能比商店新。不需要 Node.js，也不用 build。

1. 從 [最新 Release](https://github.com/io-software-ai/browser-agent/releases/latest) 下載 `browser-agent-<版本>.zip` 並解壓縮。
2. 打開 `chrome://extensions`，開啟右上角的 **開發人員模式**。
3. 按 **載入未封裝項目**，選剛剛解壓縮的資料夾，再從上面第 2 步繼續。

更新時，下載新的 zip，覆蓋同一個資料夾的內容，再按擴充功能卡片上的重新載入圖示。設定、對話和記憶都會保留。從別的資料夾載入會變成另一份從空白開始的副本，商店版也是一樣。

### 從原始碼 build

需要 Node.js 22 以上。

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

然後照第 3 步用 **載入未封裝項目** 載入 `extension/` 資料夾。自己 build 的版本會連到 `http://localhost:4410` 的 Browser Agent Cloud 伺服器（build 時可以用 `BA_BACKEND` 換掉），所以請改用自己的 API Key（見下方），或指到你自己架的後端。

## 兩種用法

| | Browser Agent Cloud（預設） | 自己的 API Key |
|---|---|---|
| 設定 | 不用，裝好就能用 | **設定 → 使用自己的 API Key（進階）**，貼上金鑰或本機端點 |
| 帳號 | 不用；安裝時會建立一個匿名的裝置 ID | 不用 |
| 模型 | Claude Sonnet、Opus、Haiku（5.5） | 看你的供應商有什麼 |
| 費用 | 每月免費點數；付費方案有更多點數（由 Paddle 處理結帳） | 由你的供應商計費；擴充功能本身免費 |
| 請求送到哪裡 | 經過 Browser Agent Cloud 伺服器轉給模型供應商 | 從你的瀏覽器直接送到你的供應商 |

**點數。** Cloud 模式下，每個任務（你送出一則訊息，到 agent 停下來為止）扣固定的點數，依模型、思考深度和每頁讀多少字決定。送出前側邊欄會顯示預估，每個任務結束後會顯示剩下的點數。點數用完時，要等下個月或升級才能繼續送出新任務。

**自己的金鑰。** 以下供應商都可以用；請選支援工具呼叫（tool calling）的模型，不然 agent 沒辦法操作頁面。

| 供應商 | 需要什麼 | 備註 |
|---|---|---|
| Anthropic | [API 金鑰](https://console.anthropic.com/settings/keys) | Sonnet 5.5、Opus 5.5、Haiku 5.5；思考深度；思考摘要；掃描 PDF；研究時逐頁整理 |
| OpenAI | [API 金鑰](https://platform.openai.com/api-keys) | 模型清單從供應商抓 |
| Google Gemini | [API 金鑰](https://aistudio.google.com/apikey) | 走 Gemini 的 OpenAI 相容端點 |
| OpenRouter | [API 金鑰](https://openrouter.ai/keys) | OpenRouter 上任何支援工具呼叫的模型 |
| 自訂（OpenAI 相容） | Base URL，金鑰可省略 | Ollama、LM Studio、vLLM、llama.cpp——任何有 `/chat/completions` 的服務 |

用 Anthropic 以外的供應商時，研究讀到的每一頁會以原文交給模型，不經過 Haiku 整理，token 用量會比較多。

本機伺服器預設會擋瀏覽器擴充功能：

- **Ollama：** 設定 `OLLAMA_ORIGINS=chrome-extension://*` 後重新啟動 Ollama（macOS：`launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`）。Base URL 填 `http://localhost:11434/v1`。
- **LM Studio：** 用開啟 CORS 的方式啟動伺服器：`lms server start --cors`。Base URL 填 `http://localhost:1234/v1`。

## 技能

在輸入框打 `/` 挑一個，或讓模型在適合時自己載入。

| 指令 | 用途 |
|---|---|
| `/summarize` | 把目前頁面整理成一句話結論＋重點＋可行動事項 |
| `/translate` | 把頁面翻成你的語言，保留標題與段落結構 |
| `/extract` | 把頁面資料抽成 Markdown 表格；資料多時另給 CSV 或 JSON 檔 |
| `/compare` | 把價格、方案或規格做成比較表，標出關鍵差異 |
| `/explain` | 用白話解釋這一頁，或頁面上的某個術語、某段程式碼 |
| `/thread` | 整理留言串：主要論點、正反方、共識、值得看的留言 |
| `/reply` | 讀懂頁面上的信件或訊息並草擬回覆；可以填進回覆框，絕不替你送出 |
| `/fill-form` | 用你的資料填表；缺的先問你，送出前一定停下來 |
| `/review-pr` | 審查 GitHub PR，依嚴重度列出問題並指出檔案與行號 |
| `/checklist` | 把教學文件轉成可以逐項打勾的步驟清單 |
| `/decide` | 列出選項，一題一題問你的條件，最後給建議與理由 |
| `/grill-me` | 用一次一題的選擇題拷問你的計畫（或頁面上的提案） |

`/clear` 開始新對話。研究不需要指令，直接問就好。

### 自己寫技能

技能就是一份 Markdown：開頭是 `name` 與 `description` 的 frontmatter，後面寫指示：

```markdown
---
name: meeting-notes
description: 把會議頁面整理成決議、待辦事項與負責人
---

1. 用 read_page 讀完整頁。
2. 列出決議，再用表格列出待辦事項、負責人與期限。
```

在 **設定 → 技能** 管理：新增、編輯、匯出、匯入 `.md`、`.zip`／`.skill` 檔或整個技能資料夾，也能從連結安裝——`owner/repo/skill`、GitHub 資料夾連結、skills.sh 頁面或它的 `npx skills add …` 指令、ClawHub 頁面，或任何指向 `SKILL.md` 或 zip 的 https 連結。技能遵循 [Agent Skills](https://agentskills.io/specification) 標準，也就是 Claude Code 與其他 agent 使用的同一種 `SKILL.md` 格式。隨技能附帶的檔案（例如 `references/forms.md`）會被儲存，模型只在指示提到它們時才會讀取；附帶的腳本只會當成文字保存，絕不會執行。可選的 `model:`（例如 `model: haiku`）讓這個技能改用較便宜的 Claude 模型；`disable-model-invocation: true` 與 `user-invocable: false` 的作用跟 Claude Code 一樣，`$ARGUMENTS` 會換成你在 `/name` 後面輸入的內容。

系統提示詞裡只放名稱與說明；模型需要時呼叫 `use_skill` 載入完整指示，你打 `/名稱` 則直接附上。技能就是提示詞——匯入前先讀過。

## 安全與隱私

**資料流向。** 送給模型的一次請求包含：你的訊息、agent 讀到的頁面內容（或只有你選取的文字、PDF）、研究時各頁的整理、你存的記憶，以及技能名稱。

- *Cloud 模式*：請求送到 Browser Agent Cloud 伺服器，由它轉給模型供應商，再把回覆串流回來。伺服器會記錄用量——用了哪個模型、多少 token、讀了幾頁、搜尋幾次、扣了幾點——用來計算點數。它不保存你的訊息、頁面內容或模型的回覆；如果模型供應商回傳錯誤，那則錯誤訊息可能會跟用量紀錄一起留著，供除錯用。
- *自己的金鑰*：請求從你的瀏覽器直接送到你的供應商，你任務的任何內容都不會經過 Browser Agent 的伺服器；唯一的接觸是安裝時那一次匿名登記。

對話、記憶、技能、設定和 API 金鑰只存在 `chrome.storage.local`。沒有分析、沒有廣告。你同意第一次開啟時的資料使用說明之前，不會有任何內容送給模型。完整說明見 [隱私權政策](store/privacy-policy.md)。

**研究用的是你的瀏覽器。** 背景分頁會帶著你的 cookie 和登入狀態載入網頁，就跟你自己打開一樣；PDF 由擴充功能直接下載，一樣帶著你的 cookie。搜尋就是從你的瀏覽器做一般的 Google（或 Bing）搜尋，所以如果你有登入，這些搜尋可能會存進該帳號的搜尋紀錄。搜尋關鍵字是模型依你的問題寫的。

**哪些動作要你按「允許」。** 下面這些動作會在側邊欄跳出卡片，你按「允許」之前不會執行。卡片在擴充功能自己的頁面裡，網站沒辦法替你按：

- 看起來不可逆的點擊與表單送出：按鈕的可見文字、`aria-label`、title 或 value 像是付款、購買、下單、刪除、送出、發送、發布、授權、儲存、分享、安裝等等（15 種介面語言都比對）；有好幾個欄位或有密碼欄的表單；表單裡只有圖示的按鈕；在不屬於表單的欄位按 Enter（聊天框）。按鈕的可見文字跟 `aria-label` 對不上時，卡片會提醒你；
- 讓你的分頁前往別的網站（導航或點連結），除非是任務開始時的網站、你訊息裡提到的網站，或這次任務裡你已經允許過的網站；
- 在背景讀一個 agent 自己組出來的網址。不問就能讀的只有：跟搜尋結果、讀過頁面裡的連結、你訊息裡的網址完全相同的網址，以及研究用網站（GitHub、npm）。`localhost` 或區域網路裡的頁面，除非網址是你自己打的，否則不讀；在背景分頁打開的頁面，連 DNS 指到區域網路的公開網域也擋得到（PDF 只檢查網址本身）；
- 對話裡已經有網頁內容（讀過的頁面、PDF、選取文字）之後，要寫入記憶。

牽涉到網址的卡片會顯示網址與查詢字串，因為網址本身就能把資料帶出去；太長的網址會截短，但一定保留網域與查詢字串的開頭。

點建議會直接送出。依頁面產生的建議是讀過頁面內容後寫的，頁面能影響它：建議裡提到的網站不算你指定的網站，觸發的動作一樣要經過上面的卡片。回覆裡的連結會在文字旁標出真正的網域；來源清單也會列出每個來源的網域。

**輸出與檔案。** 模型的回覆經過 DOMPurify 處理，圖片、影音、SVG、iframe、表單和行內樣式都會被拿掉，網頁沒辦法誘導模型用圖片網址把你的對話帶出去。產生的檔案只限純文字格式（`csv`、`json`、`md`……），CSV／TSV 裡開頭像試算表公式的儲存格會被中和。

### 已知限制

- **提示詞注入沒有被解決。** agent 會帶著你的登入狀態讀很多不可信的網頁。惡意網頁可以試著誘導它把你的對話、記憶或其他網站的資料送到別處，或替你做事。上面的確認卡涵蓋高風險動作，但不是完整的防護。agent 選哪個連結讀、搜尋什麼，仍可能帶出少量資料。
- 開著網路銀行、信箱或公司後台的分頁時，不要在不可信的頁面上做研究或執行任務；任務進行中請留意它在做什麼。
- 判斷高風險點擊用的是關鍵字與表單形狀的規則，一定會漏掉一些按鈕。
- 在同一個網站裡輸入文字不會問你。惡意網頁可以讀到 agent 輸入的內容（例如用 `input` 事件），再送到自己的伺服器。
- 匯入與安裝的技能是第三方的指示。只要其中一個在你的技能清單裡（或你用 `/name` 呼叫它），每個任務都會被視為不可信：儲存記憶、開啟 agent 自己組出來的連結、輸入不是你給的文字，都會先詢問你。這些技能在清單中會顯示「第三方」標籤。你自己寫的技能視為可信。在這個版本之前加入的技能沒有來源紀錄，所以同樣視為第三方；如果是你自己寫的，請打開它並選擇**這是我自己寫的**。只安裝來自你信任來源的技能。
- 記憶和對話以未加密的形式存在你的瀏覽器裡，每次請求都會連同送給模型（經過 Browser Agent Cloud，或送到你自己的供應商）。

## 介面語言

English、繁體中文、简体中文、日本語、한국어、Español、Français、Deutsch、Português (Brasil)、Italiano、Русский、Tiếng Việt、Bahasa Indonesia、ไทย、Türkçe。預設跟著瀏覽器；可以在 **設定 → 語言** 更改。模型會用你的介面語言回答，除非你用別的語言發問。

## 開發

```bash
npm run watch      # 存檔自動重新打包；之後在擴充功能卡片按重新載入
npm run typecheck  # tsc --noEmit
npm run check      # 單元自我檢查：技能、記憶、歷史、檔案、供應商、安全、i18n
npm run test:e2e   # 打包到 dist/e2e-ext，用 Playwright 跑；模型、後端、搜尋和網站都是假的
```

側邊欄是 React + TypeScript，由 esbuild 打包進 `extension/`。`src/agent.ts` 在側邊欄裡跑 agent 迴圈：Cloud 模式用官方 SDK 呼叫 Browser Agent Cloud 的 API（Anthropic 相容，位址在 build 時由 `BA_BACKEND` 決定）；用自己的金鑰時直接呼叫 Anthropic，或透過 `src/providers.ts` 呼叫任何 OpenAI 相容 API。`src/tools.ts` 的工具透過 `chrome.scripting` 在目前分頁或背景分頁執行；`src/elements.ts` 產生元素編號清單與不可逆動作判斷。E2E 測試不需要金鑰、不花錢，也不會連到真的網路。

各檔案的用途見英文版 [Development](README.md#development) 的表格。新增工具：在 `src/shared.ts` 的 `tools` 加 schema，並在 `src/tools.ts` 的 `runTool` 加一個 `case`。

### 翻譯

把 `src/i18n/locales/en.ts` 複製成例如 `nl.ts`，宣告成 `const nl: Dict = { … }`，翻譯字串值（每個 `{placeholder}` 都要保留），再加進 `src/i18n/index.ts` 的 `LANGS` 與載入表。少 key 或多 key 時 `npm run typecheck` 會失敗；placeholder 對不上時 `npm run check` 會失敗。送給模型的提示詞與工具說明刻意維持單一語言。商店的名稱與說明放在 `extension/_locales/<code>/messages.json`（Chrome 用底線，例如 `pt_BR`）。

## 參與貢獻

歡迎開 issue 與 PR，請見 [CONTRIBUTING.md](CONTRIBUTING.md)。PR 盡量小，跑過上面三項檢查，測試沒涵蓋的部分請寫你怎麼手動測的。

## 授權

擴充功能採用 [MIT](LICENSE) 授權。Browser Agent Cloud 是預設模式背後的選用雲端服務，另外營運，不在這個 repo 裡。Browser Agent 是獨立專案，與 Anthropic、OpenAI、Google 無隸屬或背書關係。

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
