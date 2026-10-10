// npm run build（--watch 持續重建）：側邊欄與 PDF 檢視頁兩個 entry；pdf.js 只在碰到 PDF 時動態 import，
// 被 esbuild 切成 extension/chunks/ 裡的獨立檔案，平常不載入。worker、CMap、標準字型照原樣複製到 extension/pdfjs/。
import * as esbuild from "esbuild";
import { cpSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const pdfjs = `${root}node_modules/pdfjs-dist/`;
// BA_OUTDIR：e2e 把建置輸出到 dist/e2e-ext（它先自己複製靜態檔），不碰使用者平常載入的 extension/；沒設＝照舊 extension/
const ghFile = (() => { try { return JSON.parse(readFileSync(`${root}.claude/github-app.json`, "utf8")); } catch { return {}; } })();
const gh = (env, key) => process.env[env] ?? ghFile[key] ?? "";
const ext = process.env.BA_OUTDIR ? `${resolve(process.env.BA_OUTDIR)}/` : `${root}extension/`;

rmSync(`${ext}chunks`, { recursive: true, force: true }); // 舊 hash 的 chunk 不留
cpSync(`${pdfjs}build/pdf.worker.min.mjs`, `${ext}pdfjs/pdf.worker.min.mjs`);
cpSync(`${pdfjs}cmaps`, `${ext}pdfjs/cmaps`, { recursive: true }); // 中日韓字型的 CMap：沒有它抽出來的中文會是亂碼
cpSync(`${pdfjs}standard_fonts`, `${ext}pdfjs/standard_fonts`, { recursive: true });
// ponytail: wasm（JPEG2000／JBIG2 影像解碼）沒複製，檢視頁遇到這類掃描圖會畫不出來；要支援再複製 wasm/ 並設 wasmUrl

const watch = process.argv.includes("--watch");
const opts = {
  entryPoints: [`${root}src/sidepanel.tsx`, `${root}src/viewer.ts`],
  // chrome122：pdfjs-dist 6 的非 legacy build 在模組頂層用了全域 Iterator（Iterator helpers，
  // Chrome 122 才有，見 https://v8.dev/features/iterator-helpers），沒有 try/catch，舊版直接 ReferenceError。
  // 也對得上 manifest 的 minimum_chrome_version。
  bundle: true, splitting: true, format: "esm", target: "chrome122",
  outdir: ext, chunkNames: "chunks/[name]-[hash]",
  // 後端位址：build 時用環境變數 BA_BACKEND 覆寫（上架版指向正式後端），預設是本機開發用的 4410
  define: { "process.env.NODE_ENV": '"production"', BA_BACKEND: JSON.stringify(process.env.BA_BACKEND ?? "http://localhost:4410"),
    // 研究功能的搜尋網址（後面直接接關鍵字）：e2e 用 BA_SEARCH 換成本機的假結果頁
    BA_SEARCH: JSON.stringify(process.env.BA_SEARCH ?? "https://www.google.com/search?q="),
    BA_SEARCH_FALLBACK: JSON.stringify(process.env.BA_SEARCH_FALLBACK ?? "https://www.bing.com/search?q="),
    BA_TEST_PUBLIC_IP: JSON.stringify(process.env.BA_TEST_PUBLIC_IP ?? ""),
    // GitHub App（專案同步）：環境變數優先，沒有就讀 .claude/github-app.json（.claude/ 在 gitignore 裡：client secret 不准進 git）。
    // 都沒有＝這個 build 沒有同步功能。BA_GITHUB_WEB／API 給 e2e 換成本機的假 GitHub
    BA_GITHUB_CLIENT_ID: JSON.stringify(gh("BA_GITHUB_CLIENT_ID", "clientId")),
    BA_GITHUB_CLIENT_SECRET: JSON.stringify(gh("BA_GITHUB_CLIENT_SECRET", "clientSecret")),
    BA_GITHUB_APP: JSON.stringify(gh("BA_GITHUB_APP", "app")),
    BA_GITHUB_WEB: JSON.stringify(process.env.BA_GITHUB_WEB ?? "https://github.com"),
    BA_GITHUB_API: JSON.stringify(process.env.BA_GITHUB_API ?? "https://api.github.com") },
  logLevel: "warning",
  minify: !watch, // watch 模式不 minify，rebuild 快；上架用的 build／package 都會 minify
};
// 背景 service worker 另外打包（不切 chunk，manifest 不需要 type: module）：onInstalled 要註冊裝置、開歡迎頁
const bg = { ...opts, entryPoints: [`${root}src/background.ts`], splitting: false, chunkNames: undefined };
if (watch) for (const o of [opts, bg]) await (await esbuild.context(o)).watch();
else { await esbuild.build(opts); await esbuild.build(bg); }
