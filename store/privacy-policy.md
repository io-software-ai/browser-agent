# Browser Agent Privacy Policy

Last updated: [DATE]

Browser Agent is an open-source Chrome extension (MIT license): an AI agent in your browser that works on the web pages you're looking at and can research across the web. It can run in two ways, and what we receive depends on which one you use:

- **Browser Agent Cloud** (the default): your requests go through our server, which forwards them to an AI model provider and counts your credits.
- **Your own API key** (Settings → *Use your own API key (advanced)*): requests go straight from your browser to the provider you choose. We receive nothing from your tasks.

## What is stored on your computer

Stored only in your browser, in `chrome.storage.local`:

- **Your conversations** (the last 30 of each project, up to 100 in total), including page text that was part of them, the titles and addresses of research sources, and files the assistant created
- **Memories**: short facts you asked it to remember
- **Projects**: each project's name, instructions, memories and skill choice, and the files you upload to it (stored as their extracted text)
- **Skills** (including the text files bundled with skills you import or install) **and settings** (model, language, theme, etc.)
- **Your API key(s)** and endpoint addresses, if you use your own key
- **A device token**: a random code that identifies this installation to Browser Agent Cloud

You can delete conversations, memories, project files and projects in the extension at any time. Removing the extension deletes all of it from your computer.

## What a request to the AI model contains

In either mode, a request can contain:

- Your messages and the conversation so far
- Content of the current tab that the assistant reads to carry out your request (text, the list of buttons and fields on it, the page title and address)
- Text you selected on the page, if you asked about a selection instead of the whole tab
- The content of a PDF you asked it to read. A scanned PDF with no text layer is sent as images to **Anthropic (Claude)** specifically, and only after you click "Allow" on a confirmation card that tells you it will cost more than reading text
- When researching: search results (titles, addresses and snippets) and summaries or text of the pages it read (see *Research* below)
- Your saved memories and the names and descriptions of your skills
- If the chat is in a project: the project's name, instructions and memories, and the names of its files. The text of a project file is sent only when the assistant opens that file for your request

Page content is read and sent only when you ask the assistant to do something, except for home suggestions (below).

## Browser Agent Cloud (default mode)

**When you install the extension**, it registers an anonymous installation with our server. It sends your browser language and the extension version; our server also sees your IP address. We store a random user ID, a hash of your device token, your language and the region code in it (for example `TW` from `zh-TW`), and a hash of your IP address (used only to limit how many installations one network can create). The extension then opens a welcome page on our website with that user ID. This happens when the extension is installed, before the first-run notice below, and does not include any page content. If the device token later stops working, the extension registers a new anonymous installation the same way.

**While you use it**, the extension asks our server for your plan and remaining credits (sending your device token) when it starts, when you open Settings and after each task. Each request to the AI model is sent to our server together with your device token, the reading-length setting and usage counters for the task (pages read, actions taken, characters read, searches). Our server forwards the request to the AI model provider through our API gateway and streams the reply back to you.

**What our servers keep:**

- Your installation record: user ID, the hashes above, language, region, plan, and the referral it came from (if any)
- Usage records for each task and each model call: time, model, thinking depth, reading length, token counts, response time, cost, credits used, the counters above, whether the call succeeded, and why it stopped
- If the model provider returns an error, the error message (our API gateway keeps up to the first 500 characters), which can occasionally quote part of the request

**What our servers do not keep:** your messages, page content, research summaries or the model's replies. They pass through our servers only to reach the model provider and to bring the reply back.

**Referral links.** If you open a referral link on our website (`/ref/…`), our website counts the click and sets a cookie (`ba_ref`, kept for 60 days) on our website only. When the extension opens the welcome page after installing, the page reads that cookie to credit the referral to your installation.

**Paid plans.** Upgrades are bought on our website through **Paddle**, which acts as our reseller and merchant of record: the upgrade page loads Paddle's checkout script, and Paddle collects and processes your payment details — we never see your card or bank information. Paddle sends us the subscription details, and we store your Paddle customer and subscription IDs, plan, billing interval, subscription status and dates, your email address (fetched from Paddle, used to contact you about your subscription) and the records of those subscription events. Paddle handles your data under its own privacy policy.

**Who else receives it:** the request content is processed by **Anthropic**, the model provider, under its commercial terms and privacy policy; **Paddle** receives what you enter at checkout if you buy a plan; our hosting providers process the data above on our behalf. We don't sell your data or share it with anyone else.

We keep installation, usage and subscription records while we operate the service, to count credits and for accounting. To have the records tied to your installation deleted, contact us at [CONTACT EMAIL].

## Your own API key

Requests go directly from your browser to **the provider you choose** (for example Anthropic, OpenAI, Google Gemini or OpenRouter) or to **an endpoint you configure yourself** (for example a model running on your own computer), together with your API key, which the provider uses to authenticate you. Nothing about your tasks is sent to our servers, and no credits are counted; the only contact with our server is the anonymous registration made when the extension was installed. What the provider does with the data is governed by **that provider's own privacy policy and terms**. If you use a self-hosted endpoint, the data stays wherever that endpoint runs.

## Research

When answering needs pages other than the one you're on, the assistant uses your own browser:

- **Searches** are opened as Google searches in background tabs (or Bing, if Google asks to verify you're human). The search engine receives the search keywords — written by the AI model from your question — together with what your browser normally sends, such as your IP address and cookies. If you are signed in, these searches may be saved in that account's activity, under the search engine's privacy policy.
- **Reading pages**: the pages it reads are opened in background tabs with your cookies and signed-in sessions, exactly as if you had opened them yourself, so those websites receive what a normal visit sends. The tabs are closed after reading. Before opening a page, the extension may send a quick request (HEAD, with your cookies) to check whether the address is a PDF; PDFs are downloaded directly by the extension, also with your cookies, instead of being opened in a tab.
- **Page summaries**: the text of each page it reads is condensed by a small Claude model (Haiku) before the main model sees it. In Cloud mode this goes through our servers to Anthropic like any other request; with your own Anthropic key it goes straight to Anthropic. With other providers there is no summary step, and the page text goes to your provider with the next request.
- To avoid reading pages on your local network unless you typed their address, the extension checks the address of each page and, for pages opened in a background tab, the server address the page actually came from. That server address is used only for this check and is not stored or sent anywhere.

## Installing skills

When you install a skill from a link in Settings → Skills, the extension downloads it directly from your browser: from GitHub (`api.github.com` and `raw.githubusercontent.com`) for GitHub and skills.sh links, from `clawhub.ai` for ClawHub links, or from the https address you entered. Those sites receive a normal download request, including your IP address, but no cookies and nothing from your conversations, memories or other skills. Nothing is downloaded until you click Install, and each skill's name, source and description are shown to you before it is added. Skills you import from your own files are read locally and not sent anywhere. Scripts bundled with a skill are stored as text and never run.

## Home suggestions

While the side panel shows the start screen of a new conversation, it can suggest three things to ask about the page you're on. To make them, each time you open the panel, switch tabs or a page finishes loading, the current page's title, address and first ~800 characters are sent to the AI model — through our servers in Cloud mode, or to your provider with your own key. This is on by default in Cloud mode and for people who used an API key with an early version of Browser Agent, and off otherwise; you can switch it in Settings.

## Before you start

The first time you open Browser Agent, it shows a short screen summarizing what's above (what's sent and where, what stays on your computer, that irreversible actions are confirmed first) and asks you to click "Agree and start". Nothing is sent to an AI model — including home suggestions — until you agree.

## What we do not do

- No advertising, no ad tracking, and no third-party analytics or crash reporting
- We don't sell your data, and we don't use your conversations or page content to train AI models
- No sign-in: Browser Agent Cloud identifies your installation with an anonymous device token
- No remote code: all of the extension's code ships inside the package

## Limited Use

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Changes

When this policy changes, we update the date at the top.

## Contact

Privacy requests: [CONTACT EMAIL]. Other questions: https://github.com/io-software-ai/browser-agent/issues

---

# Browser Agent 隱私權政策

最後更新：[日期]

Browser Agent 是開放原始碼（MIT 授權）的 Chrome 擴充功能：放進你瀏覽器裡的 AI agent，能直接操作你正在看的網頁，也能跨網站做研究。它有兩種用法，我們會收到什麼取決於你用哪一種：

- **Browser Agent Cloud**（預設）：你的請求會經過我們的伺服器，由它轉給 AI 模型供應商，並計算你的點數。
- **自己的 API Key**（設定 →「使用自己的 API Key（進階）」）：請求從你的瀏覽器直接送到你選的供應商，我們不會收到你任務的任何內容。

## 存在你電腦上的資料

以下資料只存在你電腦上的瀏覽器裡（`chrome.storage.local`）：

- **你的對話**（每個專案最近 30 則，全部最多 100 則），包含對話中出現的網頁文字、研究來源的標題與網址，以及助理幫你產生的檔案
- **記憶**：你要它記住的簡短事實
- **專案**：每個專案的名稱、指示、記憶、技能選擇，以及你上傳的檔案（存成抽出來的文字）
- **技能**（包含你匯入或安裝的技能附帶的文字檔）與設定（模型、語言、主題等）
- **你的 API 金鑰**與端點網址（如果你用自己的金鑰）
- **裝置代碼**：一組隨機代碼，讓 Browser Agent Cloud 認得這個安裝

你隨時可以在擴充功能裡刪除對話、記憶、專案檔案與專案；移除擴充功能就會把這些資料從你的電腦上全部刪除。

## 送給 AI 模型的請求包含什麼

不論哪一種用法，一次請求可能包含：

- 你的訊息與目前為止的對話
- 助理為了完成你的要求而讀取的目前分頁內容（文字、頁面上的按鈕與欄位清單、頁面標題與網址）
- 你選取的文字（如果你是針對選取內容發問，而不是整頁）
- 你要求它讀取的 PDF 內容。沒有文字層的掃描 PDF 會以圖片送給 **Anthropic（Claude）**，而且一定要等你在確認卡片按下「允許」之後才會送——卡片會先告訴你這比讀文字貴
- 研究時：搜尋結果（標題、網址、摘要），以及讀過頁面的整理或原文（見下方「研究」）
- 你存的記憶，以及技能的名稱與說明
- 對話在專案裡時：專案的名稱、指示、記憶，以及檔案的名稱。專案檔案的內容只有在助理為了你的要求打開那個檔案時才會送出

除了首頁建議（見下方），只有在你要求助理做事時，才會讀取並送出頁面內容。

## Browser Agent Cloud（預設）

**安裝擴充功能時**，它會向我們的伺服器登記一個匿名的安裝，送出你的瀏覽器語言與擴充功能版本；我們的伺服器也會看到你的 IP 位址。我們儲存的是：一組隨機的使用者 ID、裝置代碼的雜湊、你的語言與其中的地區代碼（例如從 `zh-TW` 取 `TW`），以及 IP 位址的雜湊（只用來限制同一個網路能建立的安裝數量）。接著擴充功能會打開我們網站上的歡迎頁並帶上這個使用者 ID。這一步發生在安裝時，在下面說的第一次使用說明之前，不包含任何頁面內容。之後如果裝置代碼失效，擴充功能會用同樣的方式重新登記一個匿名安裝。

**使用期間**，擴充功能在啟動時、打開設定時、每個任務結束後，會帶著裝置代碼向我們的伺服器查詢你的方案與剩餘點數。每次送給 AI 模型的請求，會連同你的裝置代碼、讀頁字數設定和這個任務的用量計數（讀了幾頁、做了幾個動作、讀了多少字、搜尋幾次）送到我們的伺服器。伺服器透過我們的 API 閘道把請求轉給 AI 模型供應商，再把回覆串流回來給你。

**我們的伺服器會留下：**

- 安裝紀錄：使用者 ID、上面提到的雜湊、語言、地區、方案，以及來自哪個推薦連結（如果有）
- 每個任務與每次模型呼叫的用量紀錄：時間、模型、思考深度、讀頁字數、token 數、回應時間、成本、扣的點數、上面的用量計數、呼叫是否成功、停止的原因
- 如果模型供應商回傳錯誤，那則錯誤訊息（我們的 API 閘道最多保留前 500 字）；錯誤訊息偶爾會引用到部分請求內容

**我們的伺服器不會留下：** 你的訊息、頁面內容、研究整理和模型的回覆。這些只是經過我們的伺服器，送到模型供應商、再把回覆帶回來。

**推薦連結。** 如果你打開我們網站上的推薦連結（`/ref/…`），網站會記一次點擊，並在我們的網站上設定一個 cookie（`ba_ref`，保留 60 天）。安裝後擴充功能打開歡迎頁時，頁面會讀這個 cookie，把推薦記到你的安裝上。

**付費方案。** 升級是在我們的網站上透過 **Paddle** 購買，Paddle 是我們的經銷商（merchant of record）：升級頁會載入 Paddle 的結帳程式，你的付款資料由 Paddle 收集與處理——我們看不到你的卡號或銀行資料。Paddle 會把訂閱資訊傳給我們，我們會儲存你的 Paddle 客戶 ID 與訂閱 ID、方案、計費週期、訂閱狀態與日期、你的 email（向 Paddle 取得，用來聯絡你訂閱相關的事）以及這些訂閱事件的紀錄。Paddle 依它自己的隱私權政策處理你的資料。

**還有誰會收到：** 請求內容由模型供應商 **Anthropic** 處理，適用它的商業條款與隱私權政策；如果你購買方案，**Paddle** 會收到你在結帳時填的資料；我們的主機服務商會代我們處理上述資料。我們不會出售你的資料，也不會分享給其他人。

在我們營運這項服務期間，會保留安裝、用量與訂閱紀錄，用來計算點數與記帳。如果你要刪除跟你的安裝有關的紀錄，請寫信到 [聯絡信箱]。

## 自己的 API Key

請求連同你的 API 金鑰（供應商用它確認你的身分），從你的瀏覽器直接送到**你選擇的供應商**（例如 Anthropic、OpenAI、Google Gemini、OpenRouter），或**你自己設定的端點**（例如在你電腦上跑的模型）。你任務的任何內容都不會送到我們的伺服器，也不會計算點數；跟我們伺服器唯一的接觸，是安裝時那一次匿名登記。供應商如何處理這些資料，依**該供應商自己的隱私權政策與條款**。使用自架端點時，資料就留在那個端點所在的地方。

## 研究

回答需要讀你目前頁面以外的網頁時，助理用的是你自己的瀏覽器：

- **搜尋**：在背景分頁開 Google 搜尋（Google 要求驗證你不是機器人時改用 Bing）。搜尋引擎會收到搜尋關鍵字（由 AI 模型依你的問題寫成），以及你的瀏覽器平常會送出的資訊，例如 IP 位址與 cookie。如果你有登入，這些搜尋可能會存進該帳號的活動記錄，適用該搜尋引擎的隱私權政策。
- **閱讀網頁**：它讀的頁面會在背景分頁打開，帶著你的 cookie 和登入狀態，就跟你自己打開一樣，所以那些網站收到的就是一般造訪會送出的資訊。讀完分頁就會關掉。打開頁面前，擴充功能可能會先送一個簡短的請求（HEAD，帶著你的 cookie）確認網址是不是 PDF；PDF 由擴充功能直接下載（一樣帶著你的 cookie），不會開分頁。
- **頁面整理**：讀到的每一頁，會先由一個小型的 Claude 模型（Haiku）濃縮，主要模型看到的是整理後的內容。Cloud 模式下，這跟其他請求一樣經過我們的伺服器送到 Anthropic；用自己的 Anthropic 金鑰時直接送到 Anthropic。用其他供應商時沒有整理這一步，頁面文字會在下一次請求時送到你的供應商。
- 為了不讀取你區域網路裡的頁面（除非網址是你自己打的），擴充功能會檢查每個頁面的網址；在背景分頁打開的頁面，還會檢查它實際是從哪個伺服器位址載入的。這個伺服器位址只用來做這項檢查，不會儲存，也不會送到任何地方。

## 安裝技能

在 設定 → 技能 從連結安裝技能時，擴充功能會從你的瀏覽器直接下載：GitHub 與 skills.sh 的連結從 GitHub（`api.github.com` 與 `raw.githubusercontent.com`）下載，ClawHub 的連結從 `clawhub.ai` 下載，其他則從你輸入的 https 網址下載。這些網站收到的是一般的下載請求，包含你的 IP 位址，但不帶 cookie，也不包含你的對話、記憶或其他技能。你按下「安裝」之前不會下載任何東西，每個技能加入前都會先顯示名稱、來源與說明讓你確認。從你自己的檔案匯入的技能只在本機讀取，不會送到任何地方。技能附帶的程式只存成文字，永遠不會執行。

## 首頁建議

側邊欄停在新對話的首頁時，可以依你目前的頁面建議三件可以問的事。為了產生建議，每次打開側邊欄、切換分頁或頁面載入完成，目前頁面的標題、網址與開頭約 800 字會送給 AI 模型——Cloud 模式經過我們的伺服器，用自己的金鑰時送到你的供應商。Cloud 模式，以及在早期版本就用 API 金鑰的使用者，預設開啟；其他情況預設關閉。可以在設定裡切換。

## 開始之前

第一次打開 Browser Agent 時，會先看到一個畫面，摘要說明上面這些內容（會送出什麼、送到哪裡、什麼只留在你的電腦上、不可逆的動作會先問過你），並請你按「同意並開始」。同意之前，不會有任何內容送給 AI 模型，包括首頁建議。

## 我們不做的事

- 沒有廣告、廣告追蹤，也沒有第三方分析或當機回報
- 不會出售你的資料，也不會用你的對話或頁面內容訓練 AI 模型
- 不用登入：Browser Agent Cloud 用匿名的裝置代碼認得你的安裝
- 沒有遠端程式碼：擴充功能的程式全部包在安裝檔裡

## Limited Use（有限使用）

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.
（從 Google API 取得的資訊，其使用將遵守 Chrome 線上應用程式商店使用者資料政策，包括「有限使用」規定。）

## 變更

這份政策有變更時，會更新最上方的日期。

## 聯絡方式

隱私相關請求：[聯絡信箱]。其他問題：https://github.com/io-software-ai/browser-agent/issues
