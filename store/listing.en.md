# Store listing — English

## Name (max 75)

Browser Agent

## Summary (max 132, plain text — also the manifest `description`)

An AI agent in your browser that works on the page you're viewing: reads, clicks, fills forms and researches the web with sources.

## Description

Browser Agent puts an AI agent in your browser that works directly on the site you're looking at. Ask in plain words — summarize this page, pull the prices into a table, fill in this form, find the cancellation setting — and it reads the page and does it, showing each step as it goes. When one page isn't enough, it researches across the web and answers with sources.

WORKS ON THE PAGE YOU'RE ON
It reads the current tab, clicks, types (including dropdowns), scrolls and moves between pages for you. The model sees the page's real structure — its text and a numbered list of buttons, links and fields — instead of guessing from a screenshot. Select a paragraph to ask about just that; PDFs work too.

RESEARCH WITH SOURCES
Ask something the page can't answer, like "Which React state library should I use in 2026?" It searches with your own browser in background tabs, reads the most relevant pages (including ones you're signed in to), condenses each to what matters for your question, and answers with a conclusion, a comparison table and a recommendation. Every [n] in the answer links to the page it came from, and the sources it cited are listed below the reply. Your current tab is never touched.

YOU STAY IN CONTROL
Before anything that looks irreversible (paying, placing an order, deleting, submitting a form), the extension itself stops and asks you to click "Allow". It also asks before reading an address the agent put together itself, and it doesn't read pages on your local network unless you typed the address. A web page can't talk the model out of asking. You can watch every step and stop at any time; each task stops after 40 steps.

FREE TO START, OR USE YOUR OWN KEY
It works right after install on Browser Agent Cloud, with free monthly credits and no sign-in. Each task uses a few credits depending on the model, thinking depth and how much it reads; the side panel shows the estimate before you send. Paid plans add more credits. Prefer your own provider? Switch to your own API key for Claude (Anthropic), OpenAI, Google Gemini or OpenRouter, or any OpenAI-compatible endpoint including models you run yourself (Ollama, LM Studio, vLLM). Requests then go straight from your browser to that provider and no credits are used.

FEATURES
• Page tools: read the page, click, type (including dropdowns), scroll, open pages
• Research: search and read in background tabs of your browser, per-page summaries focused on your question, numbered sources with clickable [n] citations
• Selected text: select something on the page and ask about just that
• Attach files to a message: drop, paste or pick text files, code or PDFs
• Projects: give each project its own instructions, files and memory, and choose which skills it uses. Every chat in the project starts with its instructions, and the agent opens project files only when it needs them
• PDF reading, including scanned PDFs with no text layer (sent to Claude as images, only after you allow it — see Privacy below)
• 12 built-in skills. Type / to pick one: /summarize, /translate, /extract, /compare, /explain, /thread, /reply, /fill-form, /review-pr, /checklist, /decide, /grill-me
• Write your own skills in Markdown, or install them from GitHub, skills.sh or ClawHub (Agent Skills standard: SKILL.md, skill folders, .zip). Installed skills are marked third-party and treated as untrusted; scripts bundled with a skill never run
• Question cards: when a choice is needed, it asks you with clickable options
• File downloads: get results as CSV, Markdown, JSON and other plain-text files
• Memory: say "remember…" and it keeps short facts about you. View, edit or turn it off in Settings
• History: the last 30 conversations of each project, with their sources, are saved on your computer. Reopen one, keep going, or export it as Markdown
• Home screen with suggestions based on the page you're on
• Light and dark themes; interface in 15 languages

PRIVACY
Your conversations, memories, projects (with their files), skills and settings are stored only in your browser (chrome.storage.local). In Cloud mode, requests pass through our server to the AI model provider; we keep usage records (model, tokens, credits) to count credits — not your messages, page content or the model's replies. With your own key, requests go straight to your provider and nothing goes to us. Research uses your own browser: searches are Google (or Bing) searches from your browser, and pages load with your signed-in sessions. Paid plans are bought through Paddle, which handles payment details. No ads, no third-party analytics. Before you start, the extension shows a short notice and asks you to agree. Full privacy policy: https://github.com/io-software-ai/browser-agent/blob/main/store/privacy-policy.md

OPEN SOURCE
The extension is MIT licensed. Source code: https://github.com/io-software-ai/browser-agent

Browser Agent is an independent project, not affiliated with or endorsed by Anthropic, OpenAI or Google.

## FAQ

**Do I need to pay for anything?**
No. Browser Agent Cloud includes free monthly credits. Each task (one message you send, until the agent stops) uses a fixed number of credits set by the model, the thinking depth and how much of each page it reads, and the side panel shows the estimate before you send. Paid plans add more credits. If you use your own API key instead, the extension is free and you pay your model provider for what you use — or nothing at all if you run a model locally.

**What does it send, and to whom?**
When you ask for something, your messages and the relevant page content (or the text you selected, or the PDF you're reading) go to the AI model: through Browser Agent Cloud to the model provider by default, or straight to your own provider if you use your own key. Browser Agent Cloud keeps usage records to count credits, not the content. When researching, searches go to Google (or Bing) from your browser and the pages it reads load in background tabs with your cookies, as if you opened them. In a project, the project's instructions and memory go with each request; files you attach to a message, and project files the agent opens, are sent too. A scanned PDF with no text layer is only sent — as images, to Claude — after you click "Allow" on a confirmation card. While the side panel shows the start screen of a new chat, home suggestions send the current page's title, address and first ~800 characters to the AI model each time you open the panel, switch tabs or a page finishes loading; this is on by default in Cloud mode and can be turned off in Settings.

**Can it buy things or delete things on its own?**
Not without asking you first. These wait for you to click "Allow" in the side panel, and the card shows what will happen: clicks that look irreversible (pay, buy, delete, submit, authorize, send, post, share and similar words in 15 languages, checked against the button's visible text, accessibility label, title and value — with a warning when the visible text and the label disagree); text-less icon buttons in forms or on pages with a password field; pressing Enter to send outside a form (chat and comment boxes); forms with several fields or a password; opening a page on a site other than the one you started on or one you named in your message; reading a page whose address the agent put together itself (cards with an address show it with its query string, since an address can carry data out; very long ones are shortened); and, once a chat contains web content or files (pages, PDFs, project files, attachments): opening any address the agent put together itself, even on the site you started on or one you named, typing text that isn't from your message, and saving or deleting a memory. Clicking a home suggestion sends it as your message, and what it triggers still goes through these cards.

Limits: this is a set of rules, not a guarantee. It types your own words into fields without asking, and a malicious page could read what it types there; a malicious page can also try to talk the model into things that don't match these rules. Keep an eye on what it's doing on sensitive sites.
