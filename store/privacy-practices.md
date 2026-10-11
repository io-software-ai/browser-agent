# Privacy practices 分頁填寫稿

欄位依 [Fill out the privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)（2026-09-19 查）。後台是英文欄位，下面英文是可直接貼上的答案，中文是給你看的說明。

## 1. Single purpose description

> Browser Agent is an AI agent in Chrome's side panel that reads and acts on the web page the user is viewing at their request (summarize, extract data, fill in forms, click, navigate), and, when needed, researches across the web by searching and reading pages in background tabs to answer with cited sources. It uses Browser Agent Cloud by default, or an AI model provider the user configures with their own key.

中文：側邊欄的 AI agent：依使用者要求讀取並操作他正在看的網頁（摘要、抽資料、填表、點擊、換頁）；需要時也會在背景分頁搜尋、讀網頁，給出附來源的答案。預設用 Browser Agent Cloud，也可以改用使用者自己設定的 AI 供應商。

## 2. Permission justification（manifest 目前的每個權限）

| 權限 | 貼上的理由 |
|---|---|
| `sidePanel` | The whole user interface (chat, settings, history) lives in Chrome's side panel, which opens when the user clicks the toolbar icon. |
| `storage` | Saves settings, conversation history (with research sources), memories, skills, projects (their instructions, memories and the text of files the user uploads), the anonymous Browser Agent Cloud device token, if the user uses their own key, their API key, and, if the user links a project to their GitHub repo, the GitHub refresh token (chrome.storage.local) and short-lived access token (chrome.storage.session, cleared when the browser closes). Nothing in storage is synced to any server. |
| `unlimitedStorage` | Projects can hold text files the user uploads (up to 20 MB per project) and conversations are kept per project. Without this permission chrome.storage.local is capped at 10 MB and saving them would fail. Everything stays on the user's computer. |
| `identity` | Opens the Google or GitHub sign-in page in Chrome's sign-in window (chrome.identity.launchWebAuthFlow) in two cases, both started by the user: when they choose to sign in to Browser Agent Cloud, and when they link a project to their own GitHub repo (authorizing the Browser Agent GitHub App). It receives the sign-in or authorization result. It is not used for anything else. |
| `scripting` | Injects a small function into the active tab, only when the assistant needs it for a user's request, to read the page text and list of interactive elements, and to click, type or scroll on the user's behalf. |
| `tabs` | Reads the active tab's URL and title so the assistant knows which page it is working on, navigates the tab when the user asks it to open a page, waits for the page to finish loading, and switches to a tab when the user clicks a page card in the chat. For research, it opens search results and pages in inactive background tabs, waits for them to load, and closes them after reading. |
| `webRequest` | Observes only the server IP address of the main document loaded in the assistant's own background research tabs, so it can refuse to read pages served from the user's local network or localhost (protection against DNS rebinding). It does not block, modify or record any request, and the address is not stored or sent anywhere. |
| Host permission `<all_urls>` | The user can ask the assistant to work on whatever site they are viewing, and research reads whichever pages the search finds, so page access cannot be limited to a fixed list of domains. It is also needed to send requests to Browser Agent Cloud and to the AI provider the user chooses, including custom or self-hosted OpenAI-compatible endpoints (for example Ollama on localhost), whose addresses are not known in advance, and to download skills the user chooses to install from a link (GitHub, ClawHub, or an https address the user enters). Pages are only read or changed in response to the user's request, except home suggestions, which read the current page's title, address and first ~800 characters and can be turned off. |

審查提醒（我的判斷，非官方文字）：`<all_urls>`＋`scripting` 是最容易被要求補說明或延長審查的組合。替代方案是改用 `activeTab`（使用者點圖示時才授權該分頁）＋`optional_host_permissions`（自訂端點時再向使用者要），但 side panel 開著切換分頁時 `activeTab` 不一定持續有效，要實測才知道——這是程式改動，不在這次範圍。

## 3. Remote code

選 **No, I am not using remote code.**
理由（若需要填）：All JavaScript is bundled in the package. The extension only exchanges JSON data with the AI provider's API; it never loads or evaluates code from the network.

## 4. Data usage — 第一組：收集哪些資料（建議勾選）

官方說「只在本機處理也要揭露」，而且頁面內容會送到使用者選的第三方供應商，所以依實際資料流勾：

| 類別（對照 dashboard 實際名稱） | 勾？ | 原因 |
|---|---|---|
| Website content（網站內容：文字、圖片、連結） | **勾** | 讀取頁面文字與元素清單，送給模型供應商 |
| Personal communications（個人通訊） | **勾** | 使用者跟助理的對話內容；若使用者在信箱／聊天網頁上使用，頁面上的郵件與訊息也會被讀取 |
| Authentication information（驗證資訊） | **勾** | 儲存使用者的 API 金鑰；使用者要求填登入表單時會處理密碼欄位 |
| Web history（瀏覽紀錄） | **勾** | 送出目前分頁的網址與標題（含首頁建議功能自動送出的那一次）；研究時讀過的網址與標題會送給模型、存在本機歷史 |
| User activity（使用者活動：點擊、輸入等） | **勾** | 代使用者點擊與輸入；使用者在表單中輸入的內容會被讀取 |
| Personally identifiable information | **勾（保守）** | 記憶功能會存使用者自己說的個人事實（例如住在哪裡）；頁面上的個資也可能被讀取 |
| Financial and payment information | 保守建議**勾** | 使用者請它處理結帳頁時，頁面上的付款資訊會被讀取並送給供應商 |
| Health information | 不勾（除非你想最保守） | 產品不以此為目的；只在使用者自己打開健康相關網頁時會被動讀到 |
| Location | **勾（保守）** | Cloud 模式註冊裝置時伺服器看得到 IP（只存單向雜湊），並存從瀏覽器語言取的地區代碼（例如 TW）；不讀 GPS |

說明（2026-10-08 起有 Cloud 模式，這段跟著改）：
- **Cloud 模式（預設）**：上面這些內容會**經過開發者的伺服器**轉給模型供應商（Anthropic）。伺服器只保留用量紀錄（模型、token、點數、讀了幾頁、搜尋幾次）和供應商回傳的錯誤訊息，不保留訊息、頁面內容或模型回覆。安裝紀錄：匿名使用者 ID、裝置代碼雜湊、語言／地區、IP 雜湊、推薦來源。
- **自己的金鑰**：只存在本機或送到使用者自己選的供應商，不經過開發者（只有安裝時那一次匿名登記）。
- **付費方案**：在開發者網站透過 Paddle（merchant of record）結帳，開發者會存 email、Paddle 客戶／訂閱 ID 與訂閱狀態——這是網站上的資料流，不是擴充功能本身收集的，但隱私權政策已一併揭露。
- **IP 雜湊目前是不加鹽的 SHA-256**：IPv4 很容易被窮舉還原，建議後端改成加上伺服器密鑰的 HMAC（隱私權政策因此只寫「雜湊」，不寫「單向」）。
- 若後台的分類名稱跟上表不同，照「原因」欄對應。

## 5. Data usage — 第二組：三項聲明（全部勾）

- I do not sell or transfer user data to third parties, outside of the approved use cases.（送到 AI 模型供應商——Cloud 模式是 Anthropic、自己的金鑰是使用者自選的供應商——是提供單一用途所必需，屬核准用途）
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

（這三句是我記得的後台文字，官方文件頁沒有列出原文；以後台實際顯示為準。）

## 6. Privacy policy URL

必填。填 https://github.com/io-software-ai/browser-agent/blob/main/store/privacy-policy.md（repo 裡的隱私權政策，推上 GitHub 後即可公開存取；商店說明也已經用這個網址）。

## 7. 審查前要處理（不是表單欄位，但會影響上架）

- ~~醒目揭露~~（2026-09-20 已解決）：官方 User Data FAQ 第 10 題要求在產品介面內、使用前揭露資料用途並取得明確同意，只寫在隱私權政策不算。現在第一次打開（含已有金鑰的舊使用者）都會先看到一個同意畫面，列出「頁面內容／選取文字／PDF 會送到你選的供應商」「金鑰與歷史只存本機」「不可逆動作先問過你」，按「同意並開始」才能繼續；同意前 `runApi()` 會擋下所有送給模型的請求（含首頁建議），見 `src/agent.ts` 的 `showView()`／`runApi()` 與 `src/sidepanel.tsx` 的 `Consent`。
- **「不可逆動作先問過你」的實際範圍**（2026-09-20）：同意畫面這句話是規則式的防護，不是保證。會跳確認卡的：關鍵字（15 種語言，比對可見文字／aria-label／title／value）判定的點擊、表單或有密碼欄頁面上的純圖示按鈕、不在表單裡按 Enter 送出、多欄位或含密碼的表單、前往任務開始時的網站與使用者訊息提到的網站以外的網址（顯示完整網址）、讀過網頁內容後寫入記憶、每一次寫進連結的 GitHub repo（含 repo 裡的記憶，不管讀過什麼）、讀過內容後前往或點進 GitHub 上能直接改 repo 的頁面（新增／編輯／刪除／上傳檔案、github.dev、vscode.dev）；首頁建議只填進輸入框。已知限制：同一網域內的輸入不問（惡意網頁可以用 oninput 讀走輸入的內容），關鍵字判斷可能被沒列到的措辭繞過。審查或使用者問到時照這個範圍說，不要寫成「絕不會」。
- **首頁建議預設值**（2026-10-08 改）：Cloud 模式預設開啟（`src/mode.ts` 的 `defaultSuggestOn`），用自己金鑰的新使用者預設關閉。同意畫面之前不會送；隱私權政策與商店說明都已寫明。

- **安裝時就註冊裝置（2026-10-08 發現，待決定）**：`src/background.ts` 在 `onInstalled` 就打 `POST /v1/devices`（送語言與版本，伺服器看到 IP）並開歡迎頁，這發生在同意畫面之前。不含頁面內容，隱私權政策已照實揭露；但 User Data 政策要求「收集個人資料前取得同意」，IP 雜湊與裝置 ID 可能被認定屬於這類。最保險的改法是把註冊延後到使用者按「同意並開始」之後（KOL 歸因的歡迎頁也一起延後），這是程式改動，要你決定。

以下仍待你自己處理，不是這次能一起解決的：

- `<all_urls>`＋`scripting` 的審查風險（見第 2 節審查提醒）：改用 `activeTab`＋`optional_host_permissions` 是程式改動，這次沒有做，之後審查若被要求補說明可以再考慮。
