// 介面用的線條圖示（16×16）
import type { ReactNode } from "react";

// cap／join：原本的圖示各自有沒有圓角端點／轉角
const Svg = ({ children, sw = 1.4, cap = true, join = false }: { children: ReactNode; sw?: number; cap?: boolean; join?: boolean }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap={cap ? "round" : undefined} strokeLinejoin={join ? "round" : undefined}>{children}</svg>
);

// 品牌 logo（候選 C：對話框＋游標，紫藍漸層），同一份圖也用在 manifest icons／商店素材（store/render.mjs）
export const IconLogo = () => (
  <svg viewBox="0 0 96 96">
    <defs><linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A855F7" /><stop offset="1" stopColor="#4F46E5" /></linearGradient></defs>
    <path d="M26 8H70a20 20 0 0 1 20 20V56a20 20 0 0 1-20 20H42L20 92 23 76A20 20 0 0 1 6 56V28A20 20 0 0 1 26 8Z" fill="url(#logo-g)" />
    <path transform="translate(37 21) scale(1.45)" d="M0 0V26L6.5 19.5 11 29 16 26.8 11.6 17.5H20Z" fill="#fff" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);
export const IconHistory = () => <Svg><circle cx="8" cy="8" r="5.8" /><path d="M8 4.8V8l2.2 1.4" /></Svg>;
export const IconPlus = () => <Svg sw={1.5}><path d="M8 3.5v9M3.5 8h9" /></Svg>;
export const IconGear = () => (
  <Svg><circle cx="8" cy="8" r="2" /><path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1" /></Svg>
);
export const IconClose = () => <Svg sw={1.5}><path d="M4 4l8 8M12 4l-8 8" /></Svg>;
export const IconChevron = () => <Svg sw={1.6} join><path d="M6 3.5L10.5 8 6 12.5" /></Svg>;
export const IconChevronDown = () => <Svg sw={1.6} join><path d="M4 6l4 4 4-4" /></Svg>;
export const IconSend = () => <svg className="i-send" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" /></svg>;
export const IconStop = () => <svg className="i-stop" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="4" width="8" height="8" rx="1.5" /></svg>;
export const IconCopy = () => (
  <Svg cap={false}><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" /><path d="M10.5 5.5V4a1.5 1.5 0 00-1.5-1.5H4A1.5 1.5 0 002.5 4v5A1.5 1.5 0 004 10.5h1.5" /></Svg>
);
export const IconOk = () => <Svg sw={2} join><path d="M3.5 8.5l3 3 6-7" /></Svg>;
export const IconLock = () => <Svg sw={1.4} join><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" /><path d="M5.5 7V5.2a2.5 2.5 0 015 0V7" /></Svg>;
export const IconErr = () => <Svg sw={2}><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></Svg>;
export const IconDownload = () => <Svg sw={1.5} join><path d="M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10" /></Svg>;
export const IconTrash = () => <Svg sw={1.5}><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" /></Svg>;
export const IconSpark = () => <Svg join><path d="M8 2l1.3 3.7L13 7l-3.7 1.3L8 12l-1.3-3.7L3 7l3.7-1.3z" /></Svg>;
export const IconLines = () => <Svg join><path d="M3 4h10M3 8h10M3 12h6" /></Svg>;
export const IconTranslate = () => <Svg join><path d="M2.5 4h7M6 2.5V4M4 4c.5 2.5 2.5 4.5 5 5.5M8 4c-.5 2.5-2.5 4.5-5 5.5M9 13.5l2.5-6 2.5 6M10 11.5h3" /></Svg>;
export const IconTable = () => <Svg join><rect x="2.5" y="2.5" width="11" height="11" rx="2" /><path d="M2.5 6.5h11M6.5 6.5v7" /></Svg>;
export const IconBack = () => <Svg sw={1.6} join><path d="M10 3.5L5.5 8 10 12.5" /></Svg>;
export const IconMore = () => <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3.5" cy="8" r="1.3" /><circle cx="8" cy="8" r="1.3" /><circle cx="12.5" cy="8" r="1.3" /></svg>;
export const IconSearch = () => <Svg sw={1.5}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L13.5 13.5" /></Svg>;
export const IconFolder = () => <Svg join><path d="M2 4.5a1 1 0 011-1h3l1.5 1.5H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1z" /></Svg>;
export const IconLink = () => <Svg join><path d="M6.8 9.2a2.6 2.6 0 003.7 0l2-2a2.6 2.6 0 00-3.7-3.7l-.9.9" /><path d="M9.2 6.8a2.6 2.6 0 00-3.7 0l-2 2a2.6 2.6 0 003.7 3.7l.9-.9" /></Svg>;
export const IconFile = () => <Svg join><path d="M4 1.8h5l3 3v9.4H4z" /><path d="M9 1.8v3h3" /></Svg>;
export const IconClip = () => <Svg join><path d="M13.2 7.6l-5.4 5.4a3.4 3.4 0 01-4.8-4.8l5.8-5.8a2.25 2.25 0 013.2 3.2L6.3 11.3a1.1 1.1 0 01-1.6-1.6l5.1-5.1" /></Svg>;
export const IconShield = () => <Svg join><path d="M8 1.8l5 2v4c0 3-2.2 5.2-5 6.4-2.8-1.2-5-3.4-5-6.4v-4z" /><path d="M8 5.5v3M8 10.8v.2" /></Svg>;
export const IconBookmark = () => <Svg join><path d="M4.5 2h7v12L8 11.2 4.5 14z" /></Svg>;
export const IconGlobe = () => <Svg><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c1.7 1.8 2.5 3.8 2.5 6S9.7 12.2 8 14c-1.7-1.8-2.5-3.8-2.5-6S6.3 3.8 8 2z" /></Svg>;
export const IconUser = () => <Svg><circle cx="8" cy="5.6" r="2.6" /><path d="M2.8 13.8c.8-2.5 2.8-3.8 5.2-3.8s4.4 1.3 5.2 3.8" /></Svg>;
// 登入按鈕的品牌標誌：Google 的 G 依官方規範只能用原色、不能改色；GitHub 標誌跟著文字色
export const IconGoogle = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);
export const IconGitHub = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
  </svg>
);
export const IconQuestion = () =><Svg><circle cx="8" cy="8" r="6" /><path d="M6.2 6.2a1.9 1.9 0 013.6.7c0 1.3-1.8 1.6-1.8 2.8M8 11.6v.1" /></Svg>;
