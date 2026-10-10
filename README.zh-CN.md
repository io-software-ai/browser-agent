<div align="center">

<img src="docs/logo.svg" width="72" alt="Browser Agent 图标">

# Browser Agent

**把 AI agent 放进你的浏览器，直接操作你正在看的网站：读页面、点击、输入、在页面之间跳转都交给它；一页不够时，它还能跨网站做研究，给你附带来源的答案。**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · 简体中文 · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="选中一段文字后用 /explain 解释；把笔记本电脑价格整理成 CSV；agent 在点击「Place order」前弹出确认卡片，用户拒绝了这次操作">

</div>

## 为什么用它

- **直接在你正在看的页面上做事。** 用平时说话的方式交代：总结这一页、把价格整理成表格、帮我填这张表、找到取消订阅的设置。它读懂页面、直接动手——不用把内容复制粘贴到另一个聊天标签页。
- **它看到的是网站真正的结构。** 模型拿到的是页面文字，以及编号过的按钮、链接和输入框清单，直接点 `ref: 12`，而不是对着截图猜位置。选中一段文字就只问那一段；PDF 也可以。
- **也能做研究，并附上来源。** 答案不在这一页时，它会用你自己的浏览器搜索、读几个页面、互相比较，回答里的 `[n]` 引用都会链接回出处。
- **高风险操作会等你点头。** 看起来不可逆的点击和表单提交，以及 agent 自己拼出来的网址，都要你按下“允许”才会执行。这道检查写在扩展程序的代码里，不是靠提示词拜托模型。
- **免费开始，也可以用自己的密钥。** 装好就能使用 Browser Agent Cloud，每月有免费点数，不用注册。想用自己的服务商？在设置里改用自己的 API Key，请求就从你的浏览器直接发往该服务商。

## 功能

**操作页面**
- 工具：读取页面、点击、输入（包括 `<select>` 下拉菜单）、滚动、打开网址。模型拿到的是编号过的可交互元素清单，直接点 `ref: 12`，不用猜 CSS 选择器。
- 在页面上选中文字，只针对这一段提问；附上的是你选中的内容，而不是整个标签页。
- 在消息里附加文件：把文本文件、代码或 PDF 拖进来、粘贴或选取，内容会跟你输入的文字一起发送。
- PDF：用 pdf.js 提取文字。内置查看器让你像在普通网页上一样选中 PDF 里的文字。扫描件（没有文字层）在你确认费用后，可以整份交给 Claude 阅读。
- 主页：根据你当前所在页面给出建议。

**跨网站研究**
- 在你自己浏览器的后台标签页里搜索和阅读；需要登录才能看的页面也可以，你当前的标签页不会被动到。
- 每个页面都会按你的问题浓缩成重点；来源有编号，`[n]` 引用可以点击，来源会随对话一起保存，导出时也会附上。
- 会顺着读过的页面里的链接继续读，GitHub、npm 这类研究网站可以直接访问；其他网址会先问你。

**对话中**
- 流式输出的 Markdown 回复，支持表格和代码块，还有可展开的思考摘要。
- 选择题卡片（`ask_user`）：模型需要你做决定时，会用可点击的选项来问你，而不是乱猜。
- 文件卡片：结果可以下载为 `csv`、`json`、`md`、`txt`、`tsv`、`xml`、`yaml`、`ics` 或 `vcf` 文件，可以复制和预览。

**留在你手里**
- 项目：每个项目有自己的指令、文件和记忆，也可以只用部分技能。项目里的每个对话都会先读它的指令；项目文件则是 agent 需要时才打开。
- 记忆：说“记住……”，它会在不同对话之间记住关于你的简短事实。可以在设置里查看、编辑或关闭。
- 历史：每个项目最近 30 个对话，按日期分组。可以打开后接着聊，或导出为 Markdown。
- 12 个内置技能和 `/` 命令；可以自己写，也可以从 GitHub、skills.sh 或 ClawHub 安装 [Agent Skills](https://agentskills.io/specification)（Claude Code 使用的 `SKILL.md` 格式）。
- 界面支持 15 种语言；浅色和深色主题跟随系统。

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="服务商选择：Anthropic、OpenAI、Google Gemini、OpenRouter、自定义（OpenAI 兼容）"></td>
    <td width="33%"><img src="docs/skills.png" alt="输入 / 打开技能菜单"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="一张有三个选项、其中一个标为推荐的选择题卡片"></td>
  </tr>
  <tr>
    <td align="center">或者用你自己的服务商</td>
    <td align="center">输入 <code>/</code> 调出技能</td>
    <td align="center">不确定就问你，不乱猜</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="内置 PDF 查看器里选中了一句话，侧边栏正在解释它">

## 研究是怎么进行的

问一个当前页面回答不了的问题——比如“2026 年该用哪个 React 状态管理库？”——agent 就会去做研究：

1. **搜索。** 在后台标签页里打开搜索（Google；如果 Google 要求验证你是真人，就改用 Bing），读取标题、链接和摘要，然后关掉这个标签页。只有两个都要求验证时，搜索标签页才会切到前台让你完成验证，之后研究会自动继续。
2. **阅读。** 在后台标签页里打开最相关的结果——一次最多 4 个——并提取正文。你当前的标签页完全不会被动到。
3. **浓缩。** 每个页面先交给一个小而快的模型（Claude Haiku），按你的问题提炼出要点、原文引句和日期，这样二十个页面的全文不会塞满对话，也不会让费用暴涨。
4. **回答。** 先给结论，再给对比表、带理由的推荐，以及来源没能说清的地方。搜索结果和读过的页面都有编号：回答里的 `[n]` 是链接，回复下方会列出引用到的来源。

每一步你都能在侧边栏里看到，随时可以按停止。一个任务最多执行 40 步、最多读 30 个页面。

## 快速开始

需要 Chrome 122 及以上版本。

1. 到 **[Chrome 网上应用店安装 Browser Agent](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)**，点击 **添加至 Chrome**。之后会自动更新。
2. 点击工具栏上的图标打开侧边栏（没看到的话，从拼图图标的菜单里把它固定出来），并同意简短的数据说明。
3. 针对你正在看的页面提问，或者让它研究某件事。不需要密钥，也不需要账号。

### 从 Release 的 zip 安装

新版本在等商店审核期间，Release 可能比商店更新。不需要 Node.js，也不用自己构建。

1. 从[最新 Release](https://github.com/io-software-ai/browser-agent/releases/latest) 下载 `browser-agent-<版本号>.zip` 并解压。
2. 打开 `chrome://extensions`，开启右上角的**开发者模式**。
3. 点击**加载已解压的扩展程序**，选中刚解压出来的文件夹，然后从上面第 2 步继续。

更新时，下载新的 zip，覆盖同一个文件夹里的内容，再点击扩展卡片上的重新加载图标。设置、对话和记忆都会保留。从别的文件夹加载会变成另一份从空白开始的副本，商店版也是一样。

### 从源码构建

需要 Node.js 22 及以上版本。

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

然后按第 3 步，用**加载已解压的扩展程序**加载 `extension/` 文件夹。自己构建的版本会连接到 `http://localhost:4410` 的 Browser Agent Cloud 服务器（构建时可以用 `BA_BACKEND` 改掉），所以请改用自己的 API Key（见下文），或者指向你自己搭建的后端。

## 两种使用方式

| | Browser Agent Cloud（默认） | 自己的 API Key |
|---|---|---|
| 设置 | 不用，装好就能用 | **设置 → 使用自己的 API Key（高级）**，粘贴密钥或本地端点 |
| 账号 | 不用；安装时会创建一个匿名的设备 ID | 不用 |
| 模型 | Claude Sonnet、Opus、Haiku（5.5） | 取决于你的服务商提供什么 |
| 费用 | 每月有免费点数；付费方案可获得更多（由 Paddle 处理结账） | 由你的服务商计费；扩展程序本身免费 |
| 请求发往哪里 | 经过 Browser Agent Cloud 服务器转给模型服务商 | 从你的浏览器直接发给你的服务商 |

**点数。** Cloud 模式下，每个任务（你发送的一条消息，直到 agent 停下来为止）会消耗固定数量的点数，具体由模型、思考深度，以及每个页面读取的篇幅决定。发送前侧边栏会显示预估，每个任务结束后会显示剩余点数。点数用完后，任务会暂停，要等到下个月或升级后才能继续。

**自己的密钥。** 以下服务商都可以使用；请选择支持工具调用（tool calling）的模型，否则 agent 无法操作页面。

| 服务商 | 需要什么 | 备注 |
|---|---|---|
| Anthropic | [API 密钥](https://console.anthropic.com/settings/keys) | Sonnet 5.5、Opus 5.5、Haiku 5.5；思考深度；思考摘要；扫描版 PDF；研究时逐页整理 |
| OpenAI | [API 密钥](https://platform.openai.com/api-keys) | 模型列表从服务商获取 |
| Google Gemini | [API 密钥](https://aistudio.google.com/apikey) | 使用 Gemini 的 OpenAI 兼容端点 |
| OpenRouter | [API 密钥](https://openrouter.ai/keys) | OpenRouter 上任何支持工具调用的模型 |
| 自定义（OpenAI 兼容） | Base URL，密钥可不填 | Ollama、LM Studio、vLLM、llama.cpp——任何提供 `/chat/completions` 的服务 |

使用 Anthropic 以外的服务商时，研究读到的每个页面会以原始文本交给模型，而不是经过 Haiku 整理，因此 token 用量会更多。

本地服务器默认会拦截浏览器扩展：

- **Ollama：** 设置 `OLLAMA_ORIGINS=chrome-extension://*` 后重启 Ollama（macOS：`launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`）。Base URL 填 `http://localhost:11434/v1`。
- **LM Studio：** 以开启 CORS 的方式启动服务器：`lms server start --cors`。Base URL 填 `http://localhost:1234/v1`。

## 技能

在输入框里输入 `/` 选一个，或者让模型在合适的时候自己加载。

| 命令 | 用途 |
|---|---|
| `/summarize` | 把当前页面整理成一句话结论、要点和待办事项 |
| `/translate` | 把页面翻译成你的语言，保留标题和段落结构 |
| `/extract` | 把页面上的数据提取成 Markdown 表格；数据多时另外给出 CSV 或 JSON 文件 |
| `/compare` | 把价格、方案或规格做成对比表，并标出差异 |
| `/explain` | 用大白话解释这一页，或页面上的某个术语、某段代码 |
| `/thread` | 梳理评论串：主要论点、各方观点、共识，以及值得一看的评论 |
| `/reply` | 读懂页面上的邮件或消息并起草回复；可以填进回复框，绝不会替你发送 |
| `/fill-form` | 用你的资料填写表单；缺的会先问你，提交前一定会停下来 |
| `/review-pr` | 审查 GitHub 拉取请求（PR），按严重程度列出问题，并指出文件和行号 |
| `/checklist` | 把教程转成可以逐项打勾的步骤清单 |
| `/decide` | 列出选项，一次一个问题地了解你的需求，最后推荐其中一个 |
| `/grill-me` | 用一次一道选择题的方式拷问你的计划（或页面上的提案） |

`/clear` 开始新对话。研究不需要命令——直接问就行。

### 自己写技能

技能就是一份 Markdown 文件：开头是包含 `name` 和 `description` 的 frontmatter，后面写指令：

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

在**设置 → 技能**里管理技能：新建、编辑、导出、导入 `.md`、`.zip`/`.skill` 文件或整个技能文件夹，也可以通过链接安装——`owner/repo/skill`、GitHub 文件夹链接、skills.sh 页面或其 `npx skills add …` 命令、ClawHub 页面，或任何指向 `SKILL.md` 或 zip 的 https 链接。技能遵循 [Agent Skills](https://agentskills.io/specification) 标准，即 Claude Code 和其他智能体使用的同一种 `SKILL.md` 格式。随技能附带的文件（例如 `references/forms.md`）会被保存，模型只在指令提到它们时才会读取；附带的脚本只会当作文本保存，绝不会被执行。可选的 `model:` 一行（例如 `model: haiku`）可以让这个技能改用更便宜的 Claude 模型运行；`disable-model-invocation: true` 和 `user-invocable: false` 的作用与 Claude Code 相同，`$ARGUMENTS` 会被替换成你在 `/name` 后面输入的内容。

系统提示词里只放名称和说明；模型需要时会调用 `use_skill` 加载完整指令，你输入 `/名称` 则会直接附上。技能就是提示词——导入前请先读一遍。

## 安全与隐私

**数据流向。** 发给模型的一次请求包含：你的消息、agent 读到的页面内容（或只有你选中的文字，或 PDF）、研究时各页面的摘要、你保存的记忆，以及技能名称。在项目里还会包含项目的指令和记忆；你附加在消息里的文件，以及 agent 打开的项目文件，也会一起发送。

- *Cloud 模式*会把这次请求发到 Browser Agent Cloud 服务器，由它转发给模型服务商，再把回复流式传回来。服务器会保存用量记录——一个任务用了哪个模型、多少 token、读了多少页面、搜索了几次、消耗了多少点数——用来计算点数。它不会保存你的消息、页面内容或模型的回复；如果模型服务商返回错误，那条错误信息可能会连同用量记录一起保留下来，用于排查问题。
- *自己的密钥*会把请求从你的浏览器直接发给你的服务商。你的任务内容不会经过 Browser Agent 的服务器；唯一的接触是安装扩展时那一次匿名注册。

你的对话、记忆、技能、设置和 API 密钥只保存在 `chrome.storage.local` 里。没有数据分析，没有广告。在你同意首次启动时的数据说明之前，不会有任何内容发给模型。完整说明见[隐私政策](store/privacy-policy.md)。

**研究用的是你的浏览器。** 后台标签页会带着你的 cookie 和登录状态加载页面，就和你自己打开一样；PDF 由扩展程序直接下载，同样带着你的 cookie。搜索就是从你的浏览器发出的普通 Google（或 Bing）搜索，所以如果你已登录，这些搜索可能会保存进该账号的搜索历史。搜索关键词是模型根据你的问题写的。

**哪些操作需要你按“允许”。** 下面这些操作会在侧边栏里弹出卡片，在你按下“允许”之前不会执行。卡片在扩展程序自己的页面里，网站没法替你点击：

- 看起来不可逆的点击和表单提交：按钮的可见文字、`aria-label`、title 或 value 读起来像付款、购买、下单、删除、提交、发送、发布、授权、保存、分享、安装等等（15 种界面语言都会比对）；有多个输入框或带密码框的表单；表单里只有图标的按钮；在不属于表单的输入框里按回车（聊天框）。如果按钮的可见文字和 `aria-label` 对不上，卡片会提醒你；
- 让你的标签页前往另一个网站（通过跳转或点击链接），除非它是任务开始时所在的网站、你在消息里提到的网站，或者在这次任务中你已经允许过的网站。对话里已经出现网页内容或文件之后，就算是这些网站，前往 agent 自己拼出来的网址也会先问；不用问就能去的只有与你消息里的网址、搜索结果、已读页面里的网址完全相同的网址；
- 在后台读取一个由 agent 自己拼出来的网址。不用问就能读的只有：与搜索结果、已读页面里的链接、你消息里的网址完全相同的网址，以及研究网站（GitHub、npm）。`localhost` 或局域网里的页面，除非网址是你自己输入的，否则不会读取；对于在后台标签页打开的页面，这一点还涵盖解析到本地地址的公网域名（PDF 只检查网址本身）；
- 对话里已经出现网页内容或文件之后，在页面上输入不是你消息里的文字（网页读得到输入框里打的字，不用提交）；
- 对话里已经出现网页内容或文件（读过的页面、PDF、选中的文字、项目文件、附件）之后，要保存或删除记忆。

**文件和网页一样。** 上传到项目或附加在消息里的文件常常是从网上下载的，所以文件名和内容都视为不可信：agent 读过之后，这个任务接下来都会按上面的规则先问你，文件里写的指令也不会被当成你的指令。文件名不会放进给模型的指令里。

涉及网址的卡片会连同查询字符串一起显示，因为网址本身就可以把数据带出去；过长的网址会被截短，但会保留域名和查询字符串的开头。

点击建议会直接发送。根据页面生成的建议是在读过页面内容之后写出来的，所以页面可能影响它：建议里提到的网站不算你指定的网站，它们触发的操作仍然要经过同样的卡片。回复里的链接会在文字旁边显示真实域名；来源列表会列出每个来源的域名。

**输出与文件。** 模型的回复经过 DOMPurify 渲染。图片、媒体、SVG、iframe、表单和内联样式都会被去掉，所以网页没法诱导模型通过图片网址泄露你的对话。生成的文件只限纯文本格式（`csv`、`json`、`md`……），CSV/TSV 里以电子表格公式开头的单元格会被中和。

### 已知限制

- **提示词注入并没有被解决。** agent 会带着你的登录状态读很多不可信的页面。恶意页面可能试图诱导它把你的对话、记忆或其他网站的数据发到别处，或者替你做事。上面的确认卡片涵盖了高风险操作，但并不是完整的防护。少量数据仍可能通过 agent 选择跟随哪些链接、搜索什么而泄露。
- 开着网银、邮箱或公司管理后台的标签页时，不要在不可信的页面上做研究或执行任务；任务进行期间请留意它在做什么。
- 识别高风险点击靠的是关键词和表单形态的启发式规则，一定会漏掉一些按钮。
- 输入你消息里给的文字不会询问。恶意页面可以读到 agent 输入的内容（例如通过 `input` 监听器），再发到它自己的服务器。
- 导入和安装的技能是第三方指令。只要其中一个在你的技能列表里（或你用 `/name` 调用它），每个任务都会被视为不可信：保存记忆、打开智能体自己拼出的链接、输入不是你给出的文字，都会先询问你。这些技能在列表中会显示「第三方」标签。你自己写的技能视为可信。在此版本之前添加的技能没有来源记录，所以同样视为第三方；如果是你自己写的，请打开它并选择**这是我自己写的**。只安装来自你信任来源的技能。
- 记忆、项目（包括它的文件）和对话以未加密的形式保存在你的浏览器里。记忆和项目指令每次请求都会发给模型（经过 Browser Agent Cloud，或发给你自己的服务商）。

## 界面语言

English、繁體中文、简体中文、日本語、한국어、Español、Français、Deutsch、Português (Brasil)、Italiano、Русский、Tiếng Việt、Bahasa Indonesia、ไทย、Türkçe。默认跟随浏览器；可以在**设置 → 语言**里更改。除非你用别的语言提问，否则模型会用你的界面语言回答。

## 开发

```bash
npm run watch      # 保存后自动重新构建；然后在扩展卡片上点击重新加载
npm run typecheck  # tsc --noEmit
npm run check      # 单元自检：技能、记忆、历史、文件、服务商、安全、i18n
npm run test:e2e   # 构建到 dist/e2e-ext，用 Playwright 运行；模型、后端、搜索和网站都是模拟的
```

侧边栏是 React + TypeScript，由 esbuild 打包进 `extension/`。`src/agent.ts` 在侧边栏里运行 agent 循环：Cloud 模式下用官方 SDK 调用 Browser Agent Cloud 的 API（兼容 Anthropic，地址在构建时由 `BA_BACKEND` 决定）；用自己的密钥时，直接调用 Anthropic，或通过 `src/providers.ts` 调用任何 OpenAI 兼容的 API。`src/tools.ts` 里的工具通过 `chrome.scripting` 在当前标签页或后台标签页里执行；`src/elements.ts` 生成编号元素清单和不可逆操作的判断。e2e 测试不需要 API 密钥、不花钱，也不会访问真实的互联网。

各文件的用途见英文版 [Development](README.md#development) 里的表格。新增工具：在 `src/shared.ts` 的 `tools` 里加上 schema，并在 `src/tools.ts` 的 `runTool` 里加一个 `case`。

### 翻译

把 `src/i18n/locales/en.ts` 复制成比如 `nl.ts`，声明成 `const nl: Dict = { … }`，翻译字符串的值（保留每一个 `{placeholder}`），再把它加进 `src/i18n/index.ts` 里的 `LANGS` 和加载表。缺少或多出 key 时 `npm run typecheck` 会失败；placeholder 对不上时 `npm run check` 会失败。发给模型的提示词和工具描述是故意只保留一种语言的。Chrome 网上应用店的名称和说明放在 `extension/_locales/<code>/messages.json`（Chrome 用下划线，比如 `pt_BR`）。

## 参与贡献

欢迎提交 issue 和 PR，请见 [CONTRIBUTING.md](CONTRIBUTING.md)。PR 尽量小，跑一遍上面三项检查，对于它们没覆盖到的部分，请说明你是怎么测试的。

## 许可证

扩展程序采用 [MIT](LICENSE) 许可证。Browser Agent Cloud 是默认模式背后的可选托管服务，单独运营，不属于这个仓库。Browser Agent 是独立项目，与 Anthropic、OpenAI、Google 没有隶属关系。

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
