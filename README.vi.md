<div align="center">

<img src="docs/logo.svg" width="72" alt="Logo Browser Agent">

# Browser Agent

**Một AI agent ngay trong trình duyệt, làm việc trực tiếp trên trang web bạn đang xem. Nó đọc trang, bấm, nhập và chuyển giữa các trang thay bạn — và khi một trang chưa đủ, nó nghiên cứu trên toàn web rồi trả lời kèm nguồn.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · Tiếng Việt · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Chọn một đoạn văn và dùng /explain để giải thích, so sánh giá laptop vào một file CSV, sau đó tác nhân hỏi trước khi nhấn Đặt hàng và người dùng từ chối">

</div>

## Vì sao nên dùng

- **Làm việc ngay trên trang bạn đang xem.** Cứ nhờ bằng lời thường: tóm tắt trang này, gom giá vào một bảng, điền giúp biểu mẫu này, tìm giúp mục hủy đăng ký. Nó đọc trang rồi thao tác trực tiếp — không cần sao chép sang một tab chat khác.
- **Nó nhìn trang theo đúng cấu trúc mà trang web được xây dựng.** Mô hình nhận văn bản của trang cùng danh sách đánh số các nút, liên kết và ô nhập, rồi bấm `ref: 12` thay vì đoán vị trí từ ảnh chụp màn hình. Chọn một đoạn văn để chỉ hỏi về đoạn đó; PDF cũng dùng được.
- **Nó có thể nghiên cứu và dẫn nguồn.** Khi câu trả lời không nằm trên trang này, nó tìm kiếm bằng chính trình duyệt của bạn, đọc một số trang, so sánh rồi trả lời kèm trích dẫn `[n]` liên kết về từng nguồn.
- **Hành động rủi ro sẽ chờ bạn.** Các cú bấm và thao tác gửi biểu mẫu có vẻ không thể hoàn tác, cùng những trang có địa chỉ do chính agent tự ghép ra, sẽ dừng lại cho đến khi bạn bấm **Cho phép**. Việc kiểm tra này do mã của tiện ích thực thi, không phải nhờ vả mô hình một cách lịch sự.
- **Bắt đầu miễn phí, hoặc dùng khóa của riêng bạn.** Ngay sau khi cài, tiện ích chạy trên Browser Agent Cloud với tín dụng miễn phí mỗi tháng và không cần đăng ký. Muốn dùng nhà cung cấp của riêng mình? Chuyển sang khóa API của bạn trong Cài đặt, khi đó yêu cầu đi thẳng từ trình duyệt đến nhà cung cấp đó.

## Tính năng

**Làm việc trên trang**
- Công cụ: đọc trang, bấm, nhập (kể cả danh sách thả xuống `<select>`), cuộn, mở URL. Mô hình nhận danh sách đánh số các phần tử có thể tương tác và bấm `ref: 12` thay vì đoán bộ chọn CSS.
- Chọn văn bản trên trang để chỉ hỏi về đúng phần đó; phần được chọn được đính kèm vào tin nhắn thay vì cả tab.
- Đính kèm tệp vào tin nhắn: thả, dán hoặc chọn tệp văn bản, mã hoặc PDF, và văn bản của chúng được gửi đi cùng với những gì bạn gõ.
- PDF: văn bản được trích xuất bằng pdf.js. Trình xem tích hợp cho phép bạn chọn văn bản trong PDF như trên mọi trang web. PDF dạng ảnh quét (không có lớp văn bản) có thể gửi cho Claude dưới dạng tài liệu, sau khi bạn xác nhận chi phí.
- Màn hình chính: gợi ý dựa trên trang bạn đang xem.

**Nghiên cứu trên toàn web**
- Tìm kiếm và đọc trang trong các tab nền của chính trình duyệt bạn; trang bạn đã đăng nhập cũng đọc được, và tab hiện tại của bạn không bị đụng đến.
- Mỗi trang được cô đọng lại thành những điều liên quan đến câu hỏi của bạn; các nguồn được đánh số, trích dẫn `[n]` bấm được, nguồn được lưu cùng cuộc trò chuyện và đi kèm khi bạn xuất ra.
- Nó lần theo các liên kết trong những trang đã đọc mà không cần hỏi bạn. Khi chưa đọc gì, nó cũng có thể vào thẳng các trang nghiên cứu như GitHub và npm; địa chỉ khác thì sẽ hỏi bạn trước.

**Trong cuộc trò chuyện**
- Câu trả lời Markdown hiển thị theo luồng, có bảng và khối mã, cùng phần tóm tắt suy nghĩ có thể thu gọn.
- Thẻ câu hỏi (`ask_user`): khi mô hình cần bạn quyết định, nó hỏi bằng các lựa chọn bấm được thay vì đoán.
- Thẻ tệp: kết quả dưới dạng tệp `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics` hoặc `vcf` có thể tải về, kèm sao chép và xem trước.

**Thuộc về bạn**
- Dự án: cho mỗi dự án hướng dẫn, tệp và bộ nhớ riêng, rồi chọn kỹ năng nào nó dùng. Mọi cuộc trò chuyện trong dự án đều bắt đầu bằng hướng dẫn của dự án; agent chỉ mở tệp của dự án khi cần.
- Liên kết một dự án với repo GitHub và nó hoạt động như Claude Code: agent đọc các tệp của repo và commit những tệp bạn cho phép, mỗi lần một thay đổi. Agent làm theo quy ước trong `CLAUDE.md` hoặc `AGENTS.md` của repo, còn bộ nhớ của dự án được lưu trong repo.
- Bộ nhớ: nói "hãy nhớ …" và nó sẽ giữ những thông tin ngắn về bạn qua các cuộc trò chuyện. Xem, sửa hoặc tắt trong Cài đặt.
- Lịch sử: 30 cuộc trò chuyện gần nhất của mỗi dự án, nhóm theo ngày. Mở lại một cuộc để tiếp tục, hoặc xuất ra Markdown.
- 12 kỹ năng tích hợp và lệnh `/`; bạn có thể tự viết, hoặc cài [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, định dạng Claude Code dùng) từ GitHub, skills.sh hoặc ClawHub.
- Giao diện có 15 ngôn ngữ; giao diện sáng và tối theo hệ thống của bạn.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Bộ chọn nhà cung cấp: Anthropic, OpenAI, Google Gemini, OpenRouter, Tùy chỉnh (tương thích OpenAI)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Gõ / để mở menu kỹ năng"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Một thẻ câu hỏi có ba lựa chọn, trong đó một lựa chọn được đề xuất"></td>
  </tr>
  <tr>
    <td align="center">Hoặc dùng nhà cung cấp của riêng bạn</td>
    <td align="center">Gõ <code>/</code> để gọi kỹ năng</td>
    <td align="center">Nó hỏi chứ không đoán</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Trình xem PDF tích hợp với một câu được chọn, và bảng bên đang giải thích câu đó">

## Nghiên cứu hoạt động thế nào

Hãy hỏi một điều mà trang hiện tại không trả lời được — ví dụ "năm 2026 nên dùng thư viện quản lý state nào cho React?" — và agent sẽ đi nghiên cứu:

1. **Tìm kiếm.** Nó mở một lượt tìm kiếm trong tab nền (Google; nếu Google yêu cầu xác minh bạn là người thật, nó chuyển sang Bing), đọc tiêu đề, liên kết và đoạn trích, rồi đóng tab. Chỉ khi cả hai đều yêu cầu xác minh thì tab tìm kiếm mới được đưa lên trước để bạn xử lý; sau đó việc nghiên cứu tự tiếp tục.
2. **Đọc.** Nó mở các kết quả liên quan nhất trong tab nền — tối đa bốn trang cùng lúc — và trích xuất phần nội dung chính. Tab hiện tại của bạn không bao giờ bị đụng đến.
3. **Cô đọng.** Mỗi trang được một mô hình nhỏ, nhanh (Claude Haiku) rút gọn thành các ý, trích dẫn và ngày tháng liên quan đến câu hỏi của bạn, nhờ vậy hai mươi trang không làm ngập cuộc trò chuyện hay hóa đơn của bạn.
4. **Trả lời.** Bạn nhận kết luận trước, rồi đến bảng so sánh, một đề xuất kèm lý do, và những điều các nguồn chưa giải quyết được. Kết quả tìm kiếm và các trang đã đọc đều được đánh số: `[n]` trong câu trả lời là một liên kết, và các nguồn đã được trích dẫn được liệt kê bên dưới câu trả lời.

Bạn có thể theo dõi từng bước trong bảng bên và bấm dừng bất cứ lúc nào. Một tác vụ thực hiện tối đa 40 bước và đọc tối đa 30 trang.

## Bắt đầu nhanh

Yêu cầu Chrome 122+.

1. Cài **[Browser Agent từ Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — nhấp **Thêm vào Chrome**. Tiện ích sẽ tự cập nhật.
2. Nhấp vào biểu tượng trên thanh công cụ để mở bảng bên (không thấy? ghim từ menu biểu tượng mảnh ghép) và đồng ý với thông báo dữ liệu ngắn gọn.
3. Hỏi về trang bạn đang xem — hoặc nhờ nó nghiên cứu một việc gì đó. Không cần khóa hay tài khoản.

### Cài đặt từ file zip của Release

Release có thể đi trước phiên bản trên cửa hàng trong lúc phiên bản mới chờ duyệt. Không cần Node.js hay bước build nào.

1. Tải `browser-agent-<version>.zip` từ [bản phát hành mới nhất](https://github.com/io-software-ai/browser-agent/releases/latest) và giải nén.
2. Mở `chrome://extensions` và bật **Chế độ dành cho nhà phát triển** (góc trên bên phải).
3. Nhấp **Tải tiện ích đã giải nén** và chọn thư mục vừa giải nén, sau đó tiếp tục từ bước 2 ở trên.

Để cập nhật, hãy tải file zip mới, thay nội dung của cùng thư mục đó, rồi bấm biểu tượng tải lại trên thẻ của tiện ích. Cài đặt, cuộc trò chuyện và bộ nhớ của bạn được giữ nguyên. Nạp từ một thư mục khác sẽ cài thành một bản riêng bắt đầu từ trống — bản trên cửa hàng cũng vậy.

### Build từ mã nguồn

Cần Node.js 22+.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Sau đó nạp thư mục `extension/` bằng **Tải tiện ích đã giải nén** như ở bước 3. Bản build từ mã nguồn sẽ kết nối với máy chủ Browser Agent Cloud tại `http://localhost:4410`, trừ khi bạn đặt `BA_BACKEND` khi build, vì vậy hãy dùng khóa API của riêng bạn (bên dưới) hoặc trỏ nó đến backend bạn tự chạy.

## Hai cách sử dụng

| | Browser Agent Cloud (mặc định) | Khóa API của riêng bạn |
|---|---|---|
| Thiết lập | Không cần — dùng được ngay sau khi cài | **Cài đặt → Dùng API key của riêng bạn (nâng cao)**, rồi dán khóa hoặc endpoint cục bộ |
| Tài khoản | Không; một ID thiết bị ẩn danh được tạo khi cài | Không |
| Mô hình | Claude Sonnet, Opus và Haiku (5.5) | Bất cứ mô hình nào nhà cung cấp của bạn có |
| Chi phí | Tín dụng miễn phí mỗi tháng; gói trả phí nếu cần thêm (thanh toán qua Paddle) | Nhà cung cấp của bạn tính phí; tiện ích miễn phí |
| Yêu cầu đi đâu | Qua máy chủ Browser Agent Cloud đến nhà cung cấp mô hình | Thẳng từ trình duyệt của bạn đến nhà cung cấp của bạn |

**Tín dụng.** Ở chế độ Cloud, mỗi tác vụ (một tin nhắn bạn gửi, cho đến khi agent dừng) dùng một lượng tín dụng cố định, do mô hình, độ sâu suy nghĩ và lượng nội dung đọc từ mỗi trang quyết định. Bảng bên hiển thị ước tính trước khi bạn gửi và số tín dụng còn lại sau mỗi tác vụ. Khi hết, các tác vụ sẽ tạm dừng cho đến tháng sau hoặc cho đến khi bạn nâng cấp.

**Khóa của riêng bạn.** Các nhà cung cấp sau đều dùng được; hãy chọn mô hình hỗ trợ gọi công cụ (tool calling), nếu không agent sẽ không thể thao tác trên trang.

| Nhà cung cấp | Bạn cần | Ghi chú |
|---|---|---|
| Anthropic | [Khóa API](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; độ sâu suy nghĩ; tóm tắt suy nghĩ; PDF quét; tóm tắt từng trang khi nghiên cứu |
| OpenAI | [Khóa API](https://platform.openai.com/api-keys) | Danh sách mô hình được lấy từ nhà cung cấp |
| Google Gemini | [Khóa API](https://aistudio.google.com/apikey) | Dùng endpoint tương thích OpenAI của Gemini |
| OpenRouter | [Khóa API](https://openrouter.ai/keys) | Bất kỳ mô hình nào trên OpenRouter hỗ trợ gọi công cụ |
| Tùy chỉnh (tương thích OpenAI) | Base URL, khóa là tùy chọn | Ollama, LM Studio, vLLM, llama.cpp — bất cứ thứ gì có `/chat/completions` |

Với các nhà cung cấp khác ngoài Anthropic, khi nghiên cứu, mỗi trang được đọc dưới dạng văn bản thô thay vì bản tóm tắt của Haiku, nên tốn nhiều token hơn.

Máy chủ cục bộ mặc định chặn tiện ích trình duyệt:

- **Ollama:** đặt `OLLAMA_ORIGINS=chrome-extension://*` rồi khởi động lại Ollama (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). Base URL là `http://localhost:11434/v1`.
- **LM Studio:** khởi động máy chủ với CORS bật: `lms server start --cors`. Base URL là `http://localhost:1234/v1`.

## Kỹ năng

Gõ `/` vào ô soạn thảo để chọn một kỹ năng, hoặc để mô hình tự nạp khi thấy phù hợp.

| Lệnh | Chức năng |
|---|---|
| `/summarize` | Ý chính một dòng, các điểm quan trọng và việc cần làm của trang hiện tại |
| `/translate` | Dịch trang sang ngôn ngữ của bạn, giữ nguyên tiêu đề và đoạn văn |
| `/extract` | Rút dữ liệu trên trang thành bảng Markdown; thành tệp CSV hoặc JSON khi dữ liệu nhiều |
| `/compare` | Lập bảng so sánh giá, gói hoặc thông số và làm nổi bật điểm khác biệt |
| `/explain` | Giải thích trang, một thuật ngữ hay một đoạn mã bằng lời dễ hiểu |
| `/thread` | Tóm tắt một chuỗi bình luận: các lập luận chính, từng phía, điểm đồng thuận, bình luận đáng đọc |
| `/reply` | Soạn nháp trả lời email hoặc tin nhắn trên trang; có thể điền vào ô trả lời, không bao giờ tự gửi |
| `/fill-form` | Điền biểu mẫu bằng thông tin của bạn; hỏi những gì còn thiếu, dừng lại trước khi gửi |
| `/review-pr` | Xem xét một pull request trên GitHub và liệt kê vấn đề theo mức độ nghiêm trọng, kèm tệp và dòng |
| `/checklist` | Biến một bài hướng dẫn thành danh sách việc cần làm theo từng bước |
| `/decide` | Liệt kê các lựa chọn, lần lượt hỏi từng nhu cầu của bạn, rồi đề xuất một lựa chọn |
| `/grill-me` | Thử thách kế hoạch của bạn (hoặc đề xuất trên trang) bằng từng câu hỏi trắc nghiệm một |

`/clear` bắt đầu một cuộc trò chuyện mới. Nghiên cứu không cần lệnh — cứ hỏi là được.

### Tự viết kỹ năng

Một kỹ năng là một tệp Markdown có phần frontmatter gồm `name` và `description`, theo sau là các chỉ dẫn:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Quản lý kỹ năng trong **Cài đặt → Kỹ năng**: tạo, sửa, xuất, nhập tệp `.md`, `.zip`/`.skill` hoặc cả thư mục kỹ năng, hoặc cài từ một liên kết — `owner/repo/skill`, liên kết thư mục GitHub, trang skills.sh hoặc lệnh `npx skills add …` của trang đó, trang ClawHub, hay bất kỳ liên kết https nào tới `SKILL.md` hoặc tệp zip. Kỹ năng tuân theo chuẩn [Agent Skills](https://agentskills.io/specification), cùng định dạng `SKILL.md` mà Claude Code và các agent khác dùng. Các tệp đi kèm kỹ năng (ví dụ `references/forms.md`) được lưu lại và mô hình chỉ đọc khi chỉ dẫn nhắc tới; các script đi kèm được giữ dưới dạng văn bản và không bao giờ được chạy. Một dòng `model:` tùy chọn (ví dụ `model: haiku`) sẽ chạy kỹ năng đó trên một mô hình Claude rẻ hơn; `disable-model-invocation: true` và `user-invocable: false` hoạt động như trong Claude Code, còn `$ARGUMENTS` được thay bằng nội dung bạn gõ sau `/name`.

Chỉ tên và mô tả được đưa vào system prompt; mô hình gọi `use_skill` để nạp đầy đủ chỉ dẫn khi cần, còn khi bạn gõ `/tên` thì chỉ dẫn được đính kèm trực tiếp. Kỹ năng chính là prompt — hãy đọc trước khi nhập.

## Bảo mật & quyền riêng tư

**Luồng dữ liệu.** Một yêu cầu gửi đến mô hình chứa tin nhắn của bạn, nội dung trang mà agent đã đọc (hoặc chỉ phần bạn chọn, hoặc PDF), bản tóm tắt các trang đã nghiên cứu, các bộ nhớ bạn đã lưu và tên các kỹ năng. Trong một dự án, yêu cầu còn chứa hướng dẫn và bộ nhớ của dự án; tệp bạn đính kèm vào tin nhắn và tệp của dự án mà agent mở cũng được gửi đi. Trong dự án liên kết với repo GitHub, `CLAUDE.md`, `AGENTS.md` và tệp bộ nhớ của repo, cùng các tệp repo mà agent đọc, cũng được gửi kèm yêu cầu (qua máy chủ Browser Agent Cloud ở chế độ Cloud, gửi thẳng tới nhà cung cấp của bạn khi dùng khóa riêng); bản thân kết nối tới GitHub không bao giờ đi qua máy chủ của Browser Agent.

- *Chế độ Cloud* gửi yêu cầu đó đến máy chủ Browser Agent Cloud, máy chủ chuyển tiếp cho nhà cung cấp mô hình và truyền câu trả lời về theo luồng. Máy chủ giữ bản ghi mức sử dụng — mô hình nào, bao nhiêu token, trang, lượt tìm kiếm và tín dụng mà một tác vụ đã dùng — để tính tín dụng. Nó không lưu tin nhắn, nội dung trang hay câu trả lời của mô hình; nếu nhà cung cấp mô hình trả về lỗi, thông báo lỗi đó có thể được giữ cùng bản ghi mức sử dụng để gỡ lỗi.
- *Khóa của riêng bạn* gửi yêu cầu thẳng từ trình duyệt đến nhà cung cấp của bạn. Không có thông tin nào về các tác vụ của bạn đến máy chủ của Browser Agent; lần liên hệ duy nhất là bước đăng ký ẩn danh khi cài tiện ích.

Cuộc trò chuyện, bộ nhớ, kỹ năng, cài đặt và khóa API của bạn chỉ được lưu trong `chrome.storage.local`. Không có phân tích, không có quảng cáo. Không có gì được gửi đến mô hình trước khi bạn đồng ý với thông báo dữ liệu ở lần chạy đầu tiên. Chi tiết đầy đủ: [chính sách quyền riêng tư](store/privacy-policy.md).

**Nghiên cứu dùng trình duyệt của bạn.** Các tab nền tải trang bằng cookie và phiên đăng nhập của bạn, y như khi bạn tự mở; PDF được tiện ích tải trực tiếp, cũng kèm cookie của bạn. Tìm kiếm là những lượt tìm Google (hoặc Bing) thông thường từ trình duyệt của bạn, nên nếu bạn đã đăng nhập, chúng có thể được lưu vào lịch sử tìm kiếm của tài khoản đó. Từ khóa tìm kiếm do mô hình viết dựa trên câu hỏi của bạn.

**Những gì cần bạn bấm *Cho phép*.** Các hành động sau hiện một thẻ trong bảng bên và không chạy cho đến khi bạn bấm **Cho phép**. Thẻ nằm trong trang riêng của tiện ích, nên trang web không thể bấm thay bạn:

- các cú bấm và thao tác gửi biểu mẫu có vẻ không thể hoàn tác: văn bản hiển thị, `aria-label`, title hoặc value của nút đọc lên giống thanh toán, mua, đặt hàng, xóa, gửi, phát hành, ủy quyền, lưu, chia sẻ, cài đặt, commit, propose, pull request và tương tự (trong cả 15 ngôn ngữ giao diện); biểu mẫu có nhiều ô nhập hoặc có ô mật khẩu; nút chỉ có biểu tượng bên trong biểu mẫu; nhấn Enter trong một ô nhập không thuộc biểu mẫu (khung chat). Nếu văn bản hiển thị của nút và `aria-label` của nó không khớp nhau, thẻ sẽ cảnh báo bạn;
- chuyển sang một trang web khác trong tab của bạn, dù bằng điều hướng hay bấm liên kết, trừ khi đó là trang mà tác vụ bắt đầu, trang bạn đã nêu trong tin nhắn, hoặc trang bạn đã cho phép trong tác vụ này. Khi cuộc trò chuyện đã chứa nội dung web hoặc tệp, agent còn hỏi trước khi đến bất kỳ địa chỉ nào do chính nó ghép ra, kể cả trên những trang đó; chỉ các địa chỉ đúng y hệt trong tin nhắn của bạn, kết quả tìm kiếm hoặc những trang nó đã đọc mới đi qua mà không hỏi, trừ các trang GitHub có thể sửa trực tiếp repo (trang tạo, sửa, xóa và tải tệp lên, github.dev, vscode.dev): việc đi tới hoặc bấm vào một trang như vậy luôn hỏi trước, kể cả khi địa chỉ là liên kết trong trang nó đã đọc;
- đọc ở nền một trang mà địa chỉ do chính agent ghép ra. Khi chưa hỏi, nó chỉ đọc đúng các địa chỉ có trong kết quả tìm kiếm, liên kết trong những trang nó đã đọc và địa chỉ trong tin nhắn của bạn, cộng với các trang nghiên cứu (GitHub, npm) cho đến khi cuộc trò chuyện chứa nội dung web hoặc tệp. Các trang trên `localhost` hoặc mạng nội bộ của bạn sẽ không được đọc trừ khi bạn tự gõ địa chỉ; với trang mở trong tab nền, điều này cũng bao gồm các tên miền công khai phân giải về địa chỉ nội bộ (với PDF chỉ kiểm tra chính địa chỉ);
- gõ vào trang một văn bản không phải từ tin nhắn của bạn, khi cuộc trò chuyện đã chứa nội dung web hoặc tệp (trang có thể đọc những gì được gõ vào ô của nó mà không cần gửi gì cả);
- lưu hoặc xóa một bộ nhớ khi cuộc trò chuyện đã chứa nội dung web hoặc tệp (trang đã đọc, PDF, phần văn bản được chọn, tệp dự án, tệp từ repo đã liên kết hoặc tệp đính kèm). Nếu bộ nhớ của dự án được lưu trong repo đã liên kết, mỗi lần lưu hoặc xóa đều hỏi, bất kể cuộc trò chuyện chứa gì, vì mỗi lần là một commit;
- mọi lần ghi vào repo GitHub đã liên kết, bất kể cuộc trò chuyện chứa gì. Thẻ hiển thị đường dẫn tệp, diff (có số dòng; bên dưới khung cho biết còn bao nhiêu dòng bạn chưa cuộn tới) và thông điệp commit. Thẻ cảnh báo khi repo không ở chế độ riêng tư hoặc không kiểm tra được repo có riêng tư hay không, khi repo riêng tư nhưng đã bật GitHub Pages, khi repo dùng GitHub Actions (một commit có thể chạy workflow ngay), khi tệp được chạy trong lúc cài đặt, build hoặc kiểm thử (`package.json`, tệp phụ thuộc và tệp lock, git hook, cấu hình CI, `*.config.js`, `scripts/`, `Dockerfile`, …), và khi đường dẫn có ký tự không phải tiếng Anh hoặc nội dung có ký tự không nhìn thấy. Ký tự không nhìn thấy được hiển thị trong diff dưới dạng ⟦U+…⟧ (những ký tự do chính emoji dùng thì không tính) và bị loại khỏi thông điệp commit. Một lần ghi chỉ có thể thay đổi tối đa 1.000 dòng hoặc 100.000 ký tự (phần thêm và phần xóa cộng lại).

**Tệp được coi như nội dung web.** Tệp bạn tải lên dự án hoặc đính kèm vào tin nhắn thường đến từ web, nên tên và nội dung của chúng được coi là không đáng tin: sau khi agent đọc một tệp, các thẻ ở trên áp dụng cho phần còn lại của tác vụ, và chỉ dẫn nằm trong tệp không được làm theo như thể là của bạn. Tên tệp không được đưa vào chỉ dẫn gửi cho mô hình. Các tệp trong repo GitHub đã liên kết cũng được đối xử như vậy. `CLAUDE.md`, `AGENTS.md` và tệp bộ nhớ (`.browser-agent/memory.md`) của repo được đưa cho agent ở đầu mỗi tác vụ, và agent làm theo quy ước trong đó. Nhưng chúng cũng được coi là nội dung web, dù ai viết đi nữa: chúng không thể thay bạn cho phép bất cứ điều gì, và nếu có bất kỳ tệp nào trong số đó được nạp, hoặc không đọc được repo ở đầu tác vụ (quyền truy cập hết hạn, quá thời gian chờ), các thẻ ở trên áp dụng ngay từ đầu tác vụ. Repo riêng tư hay không, hoặc ai khác có thể push vào đó, đều không thay đổi điều này.

**Ghi vào repo đã liên kết.** Agent không thể ghi các tệp chỉ dẫn cho agent AI (`CLAUDE.md`, `AGENTS.md`, `AGENT.md`, `GEMINI.md`, `opencode.json` và các tệp tương tự, ở bất kỳ cấp thư mục nào). Trong các tệp và thư mục có tên bắt đầu bằng dấu chấm (ở bất kỳ cấp nào), agent chỉ ghi được một danh sách cho phép ngắn gồm những thứ phổ biến, chẳng hạn `.gitignore`, `.editorconfig`, cấu hình lint và formatter, `.nvmrc`, `.env.example`, `.changeset/`, `.vitepress/` và `.storybook/`. Mọi thứ khác đều bị cấm, kể cả `.github/`, `.npmrc`, `.husky/`, `.devcontainer.json` và cấu hình của agent AI lẫn trình soạn thảo, vì công cụ mới liên tục xuất hiện và nhiều tệp loại này có thể khiến một công cụ chạy lệnh. Những thứ này bạn tự sửa trên GitHub. Agent chỉ thay đổi bộ nhớ của dự án trong repo thông qua tính năng bộ nhớ: mỗi lần lưu hoặc xóa là một commit riêng với thông điệp cố định `Browser Agent: update memory` (nên nội dung bộ nhớ không bao giờ xuất hiện trong danh sách commit), chỉ thêm hoặc xóa đúng một dòng đó và giữ nguyên phần còn lại của tệp. Nội dung có ký tự điều khiển hai chiều, một ký tự xuống dòng CR đứng riêng hoặc các ký tự ngắt dòng/điều khiển bất thường khác (tab và ngắt dòng thông thường thì không sao) sẽ bị từ chối, vì thẻ có thể hiển thị khác với những gì thật sự được commit. Tệp đã có chỉ được sửa nếu là văn bản UTF-8; BOM và kiểu xuống dòng CRLF được giữ nguyên, còn tệp trộn nhiều kiểu xuống dòng thì không thể ghi lại toàn bộ. Symlink không thể đọc hay ghi.

**Quyền truy cập GitHub.** Bấm **Ngắt kết nối** trong **Cài đặt → GitHub** sẽ xóa token GitHub của tiện ích khỏi máy tính của bạn và thu hồi chúng tại GitHub. Nếu GitHub không xác nhận việc thu hồi, bạn sẽ được báo và có thể tự thu hồi ứng dụng trong phần cài đặt của GitHub. Nếu quyền truy cập hết hạn hoặc bị thu hồi, trang dự án và Cài đặt sẽ cho phép kết nối lại.

Các thẻ liên quan đến địa chỉ hiển thị địa chỉ kèm chuỗi truy vấn, vì một địa chỉ có thể mang dữ liệu ra ngoài; địa chỉ quá dài sẽ được rút ngắn, nhưng vẫn giữ tên miền và phần đầu của chuỗi truy vấn.

Bấm vào một gợi ý sẽ gửi ngay. Các gợi ý được tạo từ trang được viết sau khi đọc nội dung trang, nên trang có thể ảnh hưởng đến chúng: những trang web được nhắc đến trong gợi ý không được tính là trang bạn đã nêu, và những gì chúng kích hoạt vẫn đi qua cùng các thẻ trên. Liên kết trong câu trả lời hiển thị tên miền thật bên cạnh văn bản; danh sách nguồn hiển thị tên miền của từng nguồn.

**Đầu ra và tệp.** Câu trả lời của mô hình được kết xuất bằng DOMPurify. Hình ảnh, media, SVG, iframe, biểu mẫu và style nội tuyến đều bị loại bỏ, nên một trang không thể khiến mô hình làm rò rỉ cuộc trò chuyện của bạn qua URL hình ảnh. Tệp được tạo chỉ ở các định dạng văn bản thuần (`csv`, `json`, `md`, …), và các ô CSV/TSV bắt đầu giống công thức bảng tính sẽ bị vô hiệu hóa.

### Hạn chế đã biết

- **Prompt injection chưa được giải quyết.** Agent đọc rất nhiều trang không đáng tin bằng phiên đăng nhập của bạn. Một trang độc hại có thể cố điều khiển nó gửi cuộc trò chuyện, bộ nhớ hoặc dữ liệu từ các trang khác đi nơi nào đó, hoặc làm những việc nhân danh bạn. Các thẻ xác nhận bao phủ những hành động rủi ro cao ở trên; chúng không phải là sự bảo vệ trọn vẹn. Một lượng nhỏ dữ liệu vẫn có thể rò rỉ qua việc agent chọn theo liên kết nào hoặc tìm kiếm điều gì.
- Đừng nghiên cứu hay chạy tác vụ trên các trang không đáng tin khi các tab ngân hàng, email hoặc trang quản trị công ty của bạn đang mở, và hãy theo dõi nó khi một tác vụ đang chạy.
- Việc phát hiện cú bấm rủi ro là một phương pháp heuristic dựa trên từ khóa và hình dạng biểu mẫu. Nó sẽ bỏ sót một số nút.
- Nhập chính những lời của bạn (lấy từ tin nhắn của bạn) vào một ô sẽ không hỏi. Một trang độc hại có thể đọc những gì agent nhập (ví dụ bằng trình lắng nghe `input`) và gửi về máy chủ của nó.
- Kỹ năng đã nhập và đã cài là chỉ dẫn của bên thứ ba. Khi một kỹ năng nằm trong danh sách kỹ năng của bạn (hoặc bạn gọi nó bằng `/name`), mọi tác vụ đều được coi là không đáng tin: lưu một ký ức, mở liên kết do agent tự dựng, hoặc gõ văn bản không phải do bạn đưa ra sẽ hỏi bạn trước. Những kỹ năng này hiện nhãn *Bên thứ ba* trong danh sách. Kỹ năng do chính bạn viết được coi là đáng tin. Kỹ năng được thêm trước phiên bản này không có nguồn được ghi lại, nên cũng được coi là của bên thứ ba; nếu bạn tự viết, hãy mở nó và chọn **Tôi tự viết**. Chỉ cài kỹ năng từ nguồn bạn tin cậy.
- Bộ nhớ, dự án (kể cả tệp của chúng) và cuộc trò chuyện được lưu không mã hóa trong trình duyệt của bạn. Bộ nhớ và hướng dẫn của dự án được gửi kèm mỗi yêu cầu đến mô hình (qua Browser Agent Cloud, hoặc đến nhà cung cấp của riêng bạn).

## Ngôn ngữ

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. Mặc định theo trình duyệt của bạn; đổi trong **Cài đặt → Ngôn ngữ**. Mô hình trả lời bằng ngôn ngữ giao diện của bạn, trừ khi bạn viết bằng ngôn ngữ khác.

## Phát triển

```bash
npm run watch      # build lại mỗi khi lưu; rồi bấm tải lại trên thẻ của tiện ích
npm run typecheck  # tsc --noEmit
npm run check      # tự kiểm tra đơn vị: kỹ năng, bộ nhớ, lịch sử, tệp, nhà cung cấp, bảo mật, i18n
npm run test:e2e   # build vào dist/e2e-ext và chạy trong Playwright với mô hình, backend, tìm kiếm và trang web giả lập
```

Bảng bên là React + TypeScript được esbuild đóng gói vào `extension/`. `src/agent.ts` chạy vòng lặp agent trong bảng bên: ở chế độ Cloud, nó gọi API của Browser Agent Cloud (tương thích Anthropic, địa chỉ do `BA_BACKEND` đặt lúc build) bằng SDK chính thức; với khóa của riêng bạn, nó gọi Anthropic trực tiếp hoặc bất kỳ API tương thích OpenAI nào qua `src/providers.ts`. Các công cụ trong `src/tools.ts` chạy trong tab đang hoạt động hoặc tab nền bằng `chrome.scripting`; `src/elements.ts` tạo danh sách phần tử đánh số và bước kiểm tra hành động không thể hoàn tác. Bộ e2e không cần khóa API, không tốn tiền và không gửi yêu cầu nào đến internet thật.

Vai trò của từng tệp xem bảng trong mục [Development](README.md#development) của bản tiếng Anh. Để thêm một công cụ: thêm schema của nó vào `tools` trong `src/shared.ts` và một `case` trong `runTool` ở `src/tools.ts`.

### Dịch thuật

Sao chép `src/i18n/locales/en.ts` thành ví dụ `nl.ts`, khai báo nó là `const nl: Dict = { … }`, dịch các giá trị (giữ nguyên mọi `{placeholder}`), rồi thêm nó vào `LANGS` và các loader trong `src/i18n/index.ts`. `npm run typecheck` sẽ báo lỗi nếu thiếu hoặc thừa key; `npm run check` sẽ báo lỗi nếu placeholder không khớp. Các prompt và mô tả công cụ gửi cho mô hình cố tình được giữ ở một ngôn ngữ duy nhất. Đối với tên và mô tả trên Chrome Web Store, hãy thêm `extension/_locales/<code>/messages.json` (Chrome dùng dấu gạch dưới, ví dụ `pt_BR`).

## Đóng góp

Chào đón issue và PR — xem [CONTRIBUTING.md](CONTRIBUTING.md). Giữ PR nhỏ, chạy ba bước kiểm tra ở trên, và nói rõ bạn đã kiểm thử bằng cách nào những phần chúng không bao phủ.

## Giấy phép

Tiện ích được cấp phép [MIT](LICENSE). Browser Agent Cloud, dịch vụ lưu trữ tùy chọn đứng sau chế độ mặc định, được vận hành riêng và không thuộc kho mã này. Browser Agent là một dự án độc lập, không có liên kết với Anthropic, OpenAI hay Google.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
