<div align="center">

<img src="docs/logo.svg" width="72" alt="Browser Agent 로고">

# Browser Agent

**AI 에이전트를 브라우저 안에. 지금 보고 있는 사이트에서 직접 일합니다. 페이지를 읽고, 클릭하고, 입력하고, 페이지 사이를 이동합니다. 한 페이지로 부족하면 웹 전반을 조사해 출처와 함께 답합니다.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · 한국어 · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="문단을 선택해 /explain으로 설명을 요청하고, 노트북 가격을 CSV로 정리한 뒤, 에이전트가 'Place order'를 클릭하기 전에 확인 카드를 띄우자 사용자가 거부하는 모습">

</div>

## 왜 쓰나요

- **지금 보고 있는 페이지에서 바로 일합니다.** 평소 말하듯 맡기면 됩니다. 이 페이지 요약해 줘, 가격을 표로 정리해 줘, 이 양식 채워 줘, 구독 해지 설정 찾아 줘. 페이지를 읽고 그대로 실행하니, 채팅용 탭에 복사해 붙여 넣을 필요가 없습니다.
- **사이트가 만든 그대로의 구조로 페이지를 봅니다.** 모델은 페이지 텍스트와 번호가 매겨진 버튼·링크·입력란 목록을 받고, 스크린샷을 보고 위치를 짐작하는 대신 `ref: 12`를 클릭합니다. 문단을 선택하면 그 부분만 물어볼 수 있고, PDF도 지원합니다.
- **출처를 달아 조사도 합니다.** 답이 이 페이지에 없으면 내 브라우저로 검색하고, 몇 개의 페이지를 읽고 비교한 뒤, 각 출처로 연결되는 `[n]` 인용과 함께 답합니다.
- **위험한 작업은 여러분의 허락을 기다립니다.** 되돌릴 수 없어 보이는 클릭과 폼 제출, 그리고 에이전트가 직접 만들어 낸 주소의 페이지는 **허용**을 누를 때까지 멈춥니다. 이 확인은 모델에게 부탁하는 방식이 아니라 확장 프로그램의 코드가 강제합니다.
- **무료로 시작하고, 내 키를 써도 됩니다.** 설치하면 가입 없이 매달 무료 크레딧이 주어지는 Browser Agent Cloud로 바로 쓸 수 있습니다. 원하는 제공업체가 따로 있다면 설정에서 내 API 키로 바꾸세요. 그러면 요청이 브라우저에서 해당 제공업체로 곧바로 전송됩니다.

## 기능

**페이지에서 작업하기**
- 도구: 페이지 읽기, 클릭, 입력(`<select>` 드롭다운 포함), 스크롤, URL 열기. 모델은 번호가 매겨진 상호작용 요소 목록을 받아, CSS 선택자를 짐작하는 대신 `ref: 12`를 클릭합니다.
- 페이지에서 텍스트를 선택해 그 부분만 질문할 수 있습니다. 메시지에는 탭 전체가 아니라 선택한 부분이 첨부됩니다.
- 파일 첨부: 텍스트 파일, 코드, PDF를 메시지에 끌어다 놓거나 붙여넣거나 선택해 첨부하면, 그 텍스트가 내가 입력한 내용과 함께 전송됩니다.
- PDF: pdf.js로 텍스트를 추출합니다. 내장 뷰어에서는 일반 페이지처럼 PDF 안의 텍스트를 선택할 수 있습니다. 스캔한 PDF(텍스트 레이어 없음)는 비용을 확인한 뒤 문서로 Claude에 보낼 수 있습니다.
- 홈 화면: 지금 보고 있는 페이지에 맞춘 추천을 보여 줍니다.

**웹 전반을 조사하기**
- 내 브라우저의 백그라운드 탭에서 검색하고 페이지를 읽습니다. 로그인해야 보이는 페이지도 읽을 수 있고, 지금 보고 있는 탭은 건드리지 않습니다.
- 각 페이지는 질문과 관련된 핵심만 압축됩니다. 출처에는 번호가 붙고, `[n]` 인용은 클릭할 수 있으며, 출처는 대화와 함께 저장되어 내보낼 때도 포함됩니다.
- 읽은 페이지 안의 링크를 따라가고, GitHub·npm 같은 조사용 사이트는 바로 접속합니다. 그 밖의 주소는 먼저 물어봅니다.

**대화 중에**
- 스트리밍으로 표시되는 Markdown 답변. 표와 코드 블록을 지원하고, 접을 수 있는 생각 요약도 있습니다.
- 질문 카드(`ask_user`): 모델이 결정을 필요로 할 때 짐작하지 않고 클릭할 수 있는 선택지로 물어봅니다.
- 파일 카드: 결과를 `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics`, `vcf` 파일로 내려받을 수 있고, 복사와 미리보기도 됩니다.

**내가 간직하는 것들**
- 프로젝트: 프로젝트마다 고유한 지침, 파일, 메모리를 두고 사용할 스킬을 고를 수 있습니다. 프로젝트의 모든 대화는 그 지침으로 시작하며, 에이전트는 프로젝트 파일을 필요할 때만 엽니다.
- 메모리: "기억해 줘……"라고 하면 대화가 바뀌어도 나에 관한 짧은 정보를 기억합니다. 설정에서 확인·편집하거나 끌 수 있습니다.
- 기록: 각 프로젝트의 최근 대화 30개를 날짜별로 묶어 보여 줍니다. 다시 열어 이어서 하거나 Markdown으로 내보낼 수 있습니다.
- 내장 스킬 12개와 `/` 명령. 직접 만들거나, GitHub·skills.sh·ClawHub에서 [Agent Skills](https://agentskills.io/specification)(Claude Code가 쓰는 `SKILL.md` 형식)를 설치할 수 있습니다.
- 15개 언어를 지원하는 인터페이스. 라이트·다크 테마는 시스템 설정을 따릅니다.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="제공업체 선택: Anthropic, OpenAI, Google Gemini, OpenRouter, 사용자 지정(OpenAI 호환)"></td>
    <td width="33%"><img src="docs/skills.png" alt="/를 입력하면 스킬 메뉴가 열림"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="선택지 세 개 중 하나가 추천으로 표시된 질문 카드"></td>
  </tr>
  <tr>
    <td align="center">원하는 제공업체를 쓸 수도 있습니다</td>
    <td align="center"><code>/</code>를 입력하면 스킬이 나옵니다</td>
    <td align="center">짐작하지 않고 물어봅니다</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="내장 PDF 뷰어에서 한 문장을 선택하자 사이드 패널이 그 문장을 설명하는 모습">

## 조사는 이렇게 진행됩니다

지금 페이지로는 답할 수 없는 질문을 해 보세요. 예를 들어 "2026년에 어떤 React 상태 관리 라이브러리를 써야 할까?" 같은 질문입니다. 그러면 에이전트가 이렇게 조사합니다.

1. **검색.** 백그라운드 탭에서 검색을 엽니다(Google. Google이 사람인지 확인을 요구하면 Bing으로 전환합니다). 제목, 링크, 스니펫을 읽은 뒤 탭을 닫습니다. 두 곳 모두 확인을 요구할 때만 검색 탭이 앞으로 나와 여러분이 직접 확인을 마칠 수 있고, 이후 조사는 알아서 이어집니다.
2. **읽기.** 가장 관련 있는 결과를 백그라운드 탭에서 한 번에 최대 4개까지 열고 본문을 추출합니다. 지금 보고 있는 탭은 절대 건드리지 않습니다.
3. **압축.** 각 페이지는 작고 빠른 모델(Claude Haiku)이 질문과 관련된 핵심 내용, 인용문, 날짜만 남기고 줄여 줍니다. 그래서 20개 페이지의 전문이 대화를 가득 채우거나 요금이 불어나지 않습니다.
4. **답변.** 결론을 먼저 알려 주고, 이어서 비교표, 이유를 곁들인 추천, 출처만으로는 결론이 나지 않은 부분을 보여 줍니다. 검색 결과와 읽은 페이지에는 번호가 붙습니다. 답변 속 `[n]`은 링크이며, 인용된 출처는 답변 아래에 목록으로 나옵니다.

모든 단계를 사이드 패널에서 볼 수 있고, 언제든 중지를 누를 수 있습니다. 작업 하나는 최대 40단계까지 진행하고 최대 30페이지까지 읽습니다.

## 빠른 시작

Chrome 122 이상이 필요합니다.

1. **[Chrome 웹 스토어에서 Browser Agent 설치하기](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — **Chrome에 추가**를 클릭하세요. 이후 자동으로 업데이트됩니다.
2. 툴바 아이콘을 클릭해 사이드 패널을 열고(보이지 않으면 퍼즐 아이콘 메뉴에서 고정하세요), 간단한 데이터 안내에 동의합니다.
3. 지금 보고 있는 페이지에 대해 물어보거나, 무언가를 조사해 달라고 하세요. 키도 계정도 필요 없습니다.

### Release의 zip으로 설치하기

새 버전이 심사를 기다리는 동안 Release가 스토어보다 앞설 수 있습니다. Node.js도, 빌드 과정도 필요 없습니다.

1. [최신 릴리스](https://github.com/io-software-ai/browser-agent/releases/latest)에서 `browser-agent-<버전>.zip`을 내려받아 압축을 풉니다.
2. `chrome://extensions`를 열고 오른쪽 위의 **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다**를 클릭하고 방금 압축을 푼 폴더를 선택한 다음, 위의 2단계부터 이어서 진행하세요.

업데이트하려면 새 zip을 내려받아 같은 폴더의 내용을 바꾸고, 확장 프로그램 카드의 새로고침 아이콘을 클릭하세요. 설정, 대화, 메모리는 그대로 유지됩니다. 다른 폴더에서 로드하면 비어 있는 별도 사본이 설치되며, 스토어 버전도 마찬가지입니다.

### 소스에서 빌드하기

Node.js 22 이상이 필요합니다.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

그런 다음 3단계와 같이 **압축해제된 확장 프로그램을 로드합니다**로 `extension/` 폴더를 로드하세요. 소스에서 빌드한 버전은 빌드할 때 `BA_BACKEND`를 지정하지 않으면 `http://localhost:4410`의 Browser Agent Cloud 서버에 접속하므로, 내 API 키(아래 참고)를 쓰거나 직접 운영하는 백엔드를 지정하세요.

## 두 가지 사용 방식

| | Browser Agent Cloud(기본) | 내 API 키 |
|---|---|---|
| 설정 | 필요 없음 — 설치 직후 바로 사용 | **설정 → 내 API 키 사용(고급)**에서 키 또는 로컬 엔드포인트를 붙여넣기 |
| 계정 | 없음. 설치할 때 익명 기기 ID가 만들어짐 | 없음 |
| 모델 | Claude Sonnet, Opus, Haiku(5.5) | 제공업체가 제공하는 모델 |
| 비용 | 매달 무료 크레딧. 더 쓰려면 유료 요금제(결제는 Paddle) | 제공업체에서 청구. 확장 프로그램 자체는 무료 |
| 요청이 가는 곳 | Browser Agent Cloud 서버를 거쳐 모델 제공업체로 | 브라우저에서 제공업체로 곧바로 |

**크레딧.** Cloud 모드에서는 작업 하나(내가 보낸 메시지 하나부터 에이전트가 멈출 때까지)마다 모델, 생각의 깊이, 페이지를 얼마나 읽는지에 따라 정해진 크레딧이 사용됩니다. 보내기 전에 사이드 패널에 예상치가 표시되고, 작업이 끝날 때마다 남은 크레딧이 표시됩니다. 크레딧이 떨어지면 다음 달이 되거나 업그레이드할 때까지 작업이 일시 중지됩니다.

**내 키.** 다음 제공업체를 쓸 수 있습니다. 도구 호출을 지원하는 모델을 고르세요. 그렇지 않으면 에이전트가 페이지에서 작업할 수 없습니다.

| 제공업체 | 필요한 것 | 비고 |
|---|---|---|
| Anthropic | [API 키](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5. 생각의 깊이, 생각 요약, 스캔한 PDF, 페이지별 조사 요약 지원 |
| OpenAI | [API 키](https://platform.openai.com/api-keys) | 모델 목록은 제공업체에서 가져옴 |
| Google Gemini | [API 키](https://aistudio.google.com/apikey) | Gemini의 OpenAI 호환 엔드포인트 사용 |
| OpenRouter | [API 키](https://openrouter.ai/keys) | OpenRouter에서 도구를 지원하는 모든 모델 |
| 사용자 지정(OpenAI 호환) | Base URL(키는 선택) | Ollama, LM Studio, vLLM, llama.cpp 등 `/chat/completions`가 있는 모든 서비스 |

Anthropic이 아닌 제공업체에서는 조사 중 읽은 각 페이지가 Haiku 요약 대신 원문 텍스트 그대로 전달되므로 토큰을 더 많이 씁니다.

로컬 서버는 기본적으로 브라우저 확장 프로그램을 차단합니다.

- **Ollama:** `OLLAMA_ORIGINS=chrome-extension://*`를 설정하고 Ollama를 다시 시작하세요(macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). Base URL은 `http://localhost:11434/v1`.
- **LM Studio:** CORS를 켠 채로 서버를 시작하세요: `lms server start --cors`. Base URL은 `http://localhost:1234/v1`.

## 스킬

입력창에 `/`를 입력해 고르거나, 상황에 맞게 모델이 직접 불러오도록 둘 수 있습니다.

| 명령 | 기능 |
|---|---|
| `/summarize` | 현재 페이지의 핵심을 한 줄로, 이어서 요점과 할 일을 정리 |
| `/translate` | 페이지를 내 언어로 번역하고 제목과 문단 구조를 유지 |
| `/extract` | 페이지의 데이터를 Markdown 표로 추출. 양이 많으면 CSV나 JSON 파일로 제공 |
| `/compare` | 가격, 요금제, 사양을 비교표로 만들고 차이점을 강조 |
| `/explain` | 페이지나 용어, 코드 일부를 쉬운 말로 설명 |
| `/thread` | 댓글 스레드 요약: 주요 논점, 각 입장, 합의된 내용, 읽어 볼 만한 댓글 |
| `/reply` | 페이지의 이메일이나 메시지에 대한 답장 초안 작성. 답장 입력란에 채워 줄 수는 있지만 절대 보내지는 않음 |
| `/fill-form` | 내 정보로 양식을 채움. 빠진 정보는 물어보고, 제출하기 직전에 멈춤 |
| `/review-pr` | GitHub 풀 리퀘스트를 검토해 문제를 심각도순으로, 파일과 줄 번호와 함께 나열 |
| `/checklist` | 튜토리얼을 단계별 체크리스트로 변환 |
| `/decide` | 선택지를 정리하고 내 상황을 한 번에 하나씩 물은 다음 하나를 추천 |
| `/grill-me` | 한 번에 하나씩 객관식 질문으로 내 계획(또는 페이지의 제안)을 집요하게 검증 |

`/clear`는 새 대화를 시작합니다. 조사에는 명령이 필요 없으니, 그냥 부탁하면 됩니다.

### 직접 만들기

스킬은 `name`과 `description` frontmatter 뒤에 지시 사항을 적은 Markdown 파일입니다.

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

스킬은 **설정 → 스킬**에서 관리합니다: 만들기, 편집, 내보내기, `.md`·`.zip`/`.skill` 파일 또는 스킬 폴더 통째로 가져오기, 그리고 링크로 설치하기 — `owner/repo/skill`, GitHub 폴더 링크, skills.sh 페이지 또는 그 `npx skills add …` 명령, ClawHub 페이지, `SKILL.md`나 zip을 가리키는 모든 https 링크. 스킬은 [Agent Skills](https://agentskills.io/specification) 표준을 따르며, Claude Code와 다른 에이전트가 쓰는 것과 같은 `SKILL.md` 형식입니다. 스킬에 포함된 파일(예: `references/forms.md`)은 저장되며, 지침에서 가리킬 때만 모델이 읽습니다. 포함된 스크립트는 텍스트로만 보관되고 절대 실행되지 않습니다. 선택 사항인 `model:` 줄(예: `model: haiku`)을 넣으면 해당 스킬을 더 저렴한 Claude 모델로 실행합니다. `disable-model-invocation: true`와 `user-invocable: false`는 Claude Code와 같게 동작하고, `$ARGUMENTS`는 `/name` 뒤에 입력한 내용으로 바뀝니다.

시스템 프롬프트에는 이름과 설명만 들어갑니다. 모델은 필요할 때 `use_skill`을 호출해 전체 지시 사항을 불러오고, `/이름`을 입력하면 곧바로 첨부됩니다. 스킬은 곧 프롬프트이므로, 가져오기 전에 내용을 읽어 보세요.

## 보안 및 개인정보

**데이터 흐름.** 모델에 보내는 요청 한 건에는 내 메시지, 에이전트가 읽은 페이지 내용(또는 선택한 부분이나 PDF만), 조사한 페이지의 요약, 저장된 메모리, 스킬 이름이 들어 있습니다. 프로젝트 안에서는 그 프로젝트의 지침과 메모리도 들어가며, 메시지에 첨부한 파일과 에이전트가 연 프로젝트 파일도 함께 전송됩니다.

- *Cloud 모드*는 이 요청을 Browser Agent Cloud 서버로 보내고, 서버가 모델 제공업체에 전달한 뒤 답변을 스트리밍으로 돌려줍니다. 서버는 크레딧을 계산하기 위해 사용 기록을 보관합니다. 작업에 사용된 모델, 토큰 수, 페이지 수, 검색 횟수, 크레딧 같은 정보입니다. 내 메시지, 페이지 내용, 모델의 답변은 저장하지 않습니다. 다만 모델 제공업체가 오류를 반환하면, 디버깅을 위해 그 오류 메시지가 사용 기록과 함께 남을 수 있습니다.
- *내 키*를 쓰면 요청이 브라우저에서 제공업체로 곧바로 전송됩니다. 작업에 관한 어떤 내용도 Browser Agent의 서버로 가지 않으며, 유일한 접촉은 확장 프로그램을 설치할 때 이루어진 익명 등록뿐입니다.

대화, 메모리, 스킬, 설정, API 키는 `chrome.storage.local`에만 저장됩니다. 분석 도구도 광고도 없습니다. 처음 실행할 때 나오는 데이터 안내에 동의하기 전에는 모델에 아무것도 전송되지 않습니다. 자세한 내용은 [개인정보 처리방침](store/privacy-policy.md)을 참고하세요.

**조사에는 내 브라우저를 씁니다.** 백그라운드 탭은 내가 직접 연 것과 똑같이 내 쿠키와 로그인 세션으로 페이지를 불러옵니다. PDF는 확장 프로그램이 직접 내려받으며, 이때도 쿠키가 쓰입니다. 검색은 내 브라우저에서 하는 평범한 Google(또는 Bing) 검색이므로, 로그인한 상태라면 해당 계정의 검색 기록에 남을 수 있습니다. 검색 키워드는 내 질문을 바탕으로 모델이 작성합니다.

**어떤 작업에 *허용*이 필요한가요.** 다음 작업들은 사이드 패널에 카드를 띄우며, **허용**을 누르기 전에는 실행되지 않습니다. 카드는 확장 프로그램 자체의 페이지 안에 있으므로, 웹사이트가 대신 클릭할 수 없습니다.

- 되돌릴 수 없어 보이는 클릭과 폼 제출: 버튼의 표시 텍스트, `aria-label`, title, value가 결제, 구매, 주문, 삭제, 제출, 전송, 게시, 승인, 저장, 공유, 설치 등으로 읽히는 경우(15개 인터페이스 언어 모두에서 판별). 입력란이 여러 개이거나 비밀번호 입력란이 있는 폼. 폼 안에 있는, 아이콘만 있는 버튼. 폼에 속하지 않은 입력란(채팅창)에서 Enter 누르기. 버튼의 표시 텍스트와 `aria-label`이 서로 다르면 카드가 경고합니다.
- 탭을 다른 사이트로 이동시키는 것(주소 이동이든 링크 클릭이든). 다만 작업을 시작한 사이트, 내가 메시지에서 언급한 사이트, 이번 작업에서 이미 허용한 사이트는 제외입니다. 대화에 웹 콘텐츠나 파일이 들어 있는 상태에서는 그런 사이트에서도 에이전트가 직접 조합한 주소로 이동하기 전에 먼저 묻습니다. 묻지 않고 이동하는 것은 내 메시지, 검색 결과, 읽은 페이지에 있는 주소와 정확히 같은 주소뿐입니다.
- 에이전트가 직접 조합한 주소의 페이지를 백그라운드에서 읽는 것. 묻지 않고 읽는 것은 검색 결과에 있는 주소, 이미 읽은 페이지 안의 링크, 내 메시지에 들어 있는 주소와 정확히 같은 주소, 그리고 조사용 사이트(GitHub, npm)뿐입니다. `localhost`나 로컬 네트워크의 페이지는 내가 직접 입력한 주소가 아니면 읽지 않습니다. 백그라운드 탭에서 여는 페이지의 경우, 로컬 주소로 연결되는 공개 도메인도 여기에 포함됩니다(PDF는 주소 자체만 검사).
- 대화에 웹 콘텐츠나 파일이 들어 있는 상태에서, 내 메시지에 없는 텍스트를 페이지에 입력하는 것(페이지는 제출하지 않아도 입력란에 입력된 내용을 읽을 수 있습니다).
- 대화에 웹 콘텐츠나 파일(읽은 페이지, PDF, 선택한 텍스트, 프로젝트 파일, 첨부 파일)이 들어 있는 상태에서 메모리를 저장하거나 삭제하는 것.

**파일도 웹 콘텐츠로 취급합니다.** 프로젝트에 업로드하거나 메시지에 첨부하는 파일은 웹에서 받은 것인 경우가 많으므로, 파일 이름과 내용은 신뢰할 수 없는 것으로 취급합니다. 에이전트가 파일을 읽고 나면 그 작업이 끝날 때까지 위의 카드가 적용되며, 파일 안에 적힌 지시는 내 지시로 따르지 않습니다. 파일 이름은 모델에 전달하는 지시 사항에 넣지 않습니다.

주소가 걸린 카드는 쿼리 문자열까지 포함해 주소를 보여 줍니다. 주소를 통해 데이터가 밖으로 나갈 수 있기 때문입니다. 아주 긴 주소는 줄여서 보여 주되, 도메인과 쿼리 문자열의 앞부분은 남깁니다.

추천 항목을 클릭하면 바로 전송됩니다. 페이지를 바탕으로 생성되는 추천은 페이지 내용을 읽은 뒤에 작성되므로 페이지가 영향을 줄 수 있습니다. 추천에 언급된 사이트는 내가 지정한 사이트로 간주되지 않으며, 추천이 일으키는 작업도 같은 카드를 거칩니다. 답변 속 링크에는 텍스트 옆에 실제 도메인이 표시되고, 출처 목록에는 각 출처의 도메인이 표시됩니다.

**출력과 파일.** 모델의 답변은 DOMPurify로 렌더링됩니다. 이미지, 미디어, SVG, iframe, 폼, 인라인 스타일은 제거되므로, 페이지가 모델을 유도해 이미지 URL로 내 대화를 유출하게 만들 수 없습니다. 생성되는 파일은 일반 텍스트 형식(`csv`, `json`, `md` 등)뿐이며, 스프레드시트 수식처럼 시작하는 CSV/TSV 셀은 무력화됩니다.

### 알려진 한계

- **프롬프트 인젝션은 해결되지 않았습니다.** 에이전트는 로그인된 세션으로 신뢰할 수 없는 페이지를 많이 읽습니다. 악의적인 페이지가 대화, 메모리, 다른 사이트의 데이터를 어딘가로 보내게 하거나 나를 대신해 무언가를 하도록 유도할 수 있습니다. 위의 카드는 위험도가 높은 작업을 다루지만 완전한 보호는 아닙니다. 에이전트가 어떤 링크를 따라가는지, 무엇을 검색하는지를 통해 소량의 데이터는 여전히 새어 나갈 수 있습니다.
- 인터넷 뱅킹, 이메일, 회사 관리자 페이지가 열린 탭이 있는 동안에는 신뢰할 수 없는 페이지에서 조사나 작업을 하지 마세요. 작업이 진행되는 동안에는 지켜보세요.
- 위험한 클릭의 감지는 키워드와 폼 형태에 기반한 휴리스틱입니다. 놓치는 버튼이 있습니다.
- 내가 메시지에 쓴 내용을 입력란에 입력하는 것은 묻지 않습니다. 악의적인 페이지는 에이전트가 입력하는 내용을(예를 들어 `input` 리스너로) 읽어 자기 서버로 보낼 수 있습니다.
- 가져오거나 설치한 스킬은 제3자의 지시 사항입니다. 스킬 목록에 있는 동안(또는 `/name`으로 호출하는 동안)에는 모든 작업이 신뢰할 수 없는 것으로 취급됩니다. 메모리 저장, 에이전트가 만든 링크 열기, 직접 주지 않은 텍스트 입력은 먼저 확인을 요청합니다. 이런 스킬은 목록에 '서드파티' 라벨이 표시됩니다. 직접 작성한 스킬은 신뢰하는 것으로 취급됩니다. 이 버전 이전에 추가한 스킬은 출처 기록이 없으므로 마찬가지로 서드파티로 취급됩니다. 직접 작성한 스킬이라면 열어서 **직접 작성했습니다**를 선택하세요. 신뢰하는 출처의 스킬만 설치하세요.
- 메모리, 프로젝트(파일 포함), 대화는 암호화되지 않은 채 브라우저에 저장됩니다. 메모리와 프로젝트 지침은 요청할 때마다 모델로 함께 전송됩니다(Browser Agent Cloud를 거치거나 내 제공업체로).

## 지원 언어

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. 기본값은 브라우저 언어를 따르며, **설정 → 언어**에서 바꿀 수 있습니다. 다른 언어로 쓰지 않는 한 모델은 인터페이스 언어로 답합니다.

## 개발

```bash
npm run watch      # 저장할 때마다 다시 빌드; 이후 확장 프로그램 카드에서 새로고침 클릭
npm run typecheck  # tsc --noEmit
npm run check      # 단위 자체 검사: 스킬, 메모리, 기록, 파일, 제공업체, 보안, i18n
npm run test:e2e   # dist/e2e-ext로 빌드한 뒤, 모의 모델·백엔드·검색·웹사이트를 상대로 Playwright에서 실행
```

사이드 패널은 React + TypeScript이며 esbuild가 `extension/`으로 번들합니다. `src/agent.ts`가 사이드 패널 안에서 에이전트 루프를 실행합니다. Cloud 모드에서는 공식 SDK로 Browser Agent Cloud API(Anthropic 호환, 주소는 빌드할 때 `BA_BACKEND`로 지정)를 호출하고, 내 키를 쓸 때는 Anthropic을 직접 호출하거나 `src/providers.ts`를 통해 OpenAI 호환 API를 호출합니다. `src/tools.ts`의 도구는 `chrome.scripting`으로 활성 탭이나 백그라운드 탭에서 실행되고, `src/elements.ts`는 번호가 매겨진 요소 목록과 되돌릴 수 없는 작업 판별을 만듭니다. e2e 테스트는 API 키가 필요 없고, 비용이 들지 않으며, 실제 인터넷에 요청을 보내지도 않습니다.

각 파일의 역할은 영어판 [Development](README.md#development)의 표를 참고하세요. 도구를 추가하려면 `src/shared.ts`의 `tools`에 스키마를 추가하고, `src/tools.ts`의 `runTool`에 `case`를 추가하면 됩니다.

### 번역하기

`src/i18n/locales/en.ts`를 예를 들어 `nl.ts`로 복사하고, `const nl: Dict = { … }`로 선언한 뒤 값을 번역합니다(모든 `{placeholder}`는 그대로 유지). 그런 다음 `src/i18n/index.ts`의 `LANGS`와 로더에 추가합니다. 키가 빠지거나 남으면 `npm run typecheck`가 실패하고, placeholder가 맞지 않으면 `npm run check`가 실패합니다. 모델에 전달되는 프롬프트와 도구 설명은 의도적으로 한 가지 언어로 유지됩니다. Chrome 웹 스토어에 표시할 이름과 설명은 `extension/_locales/<code>/messages.json`에 추가하세요(Chrome은 밑줄을 사용합니다. 예: `pt_BR`).

## 기여하기

이슈와 PR을 환영합니다. [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요. PR은 작게 유지하고, 위의 세 가지 검사를 실행하고, 그 검사가 다루지 않는 부분은 어떻게 테스트했는지 적어 주세요.

## 라이선스

확장 프로그램은 [MIT](LICENSE) 라이선스입니다. 기본 모드 뒤에서 동작하는 선택형 호스팅 서비스인 Browser Agent Cloud는 별도로 운영되며 이 저장소에 포함되지 않습니다. Browser Agent는 독립 프로젝트로, Anthropic, OpenAI, Google과 제휴 관계가 없습니다.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
