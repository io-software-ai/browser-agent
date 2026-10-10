<div align="center">

<img src="docs/logo.svg" width="72" alt="Logo Browser Agent">

# Browser Agent

**Agen AI di browser Anda yang bekerja langsung di situs yang sedang Anda lihat. Ia membaca halaman, mengklik, mengetik, dan berpindah antarhalaman untuk Anda — dan saat satu halaman tidak cukup, ia meriset di seluruh web lalu menjawab lengkap dengan sumber.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · Bahasa Indonesia · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Memilih satu paragraf dan menjalankan /explain, membandingkan harga laptop ke dalam CSV, lalu agen bertanya sebelum mengklik Place order dan pengguna menolaknya">

</div>

## Kenapa

- **Bekerja langsung di halaman yang sedang Anda buka.** Minta dengan kata-kata biasa: ringkas ini, tarik harganya ke tabel, isi formulir ini, cari pengaturan pembatalan. Ia membaca halaman dan bertindak di atasnya — tanpa perlu copy-paste ke tab chat.
- **Ia melihat halaman sebagaimana situs membangunnya.** Model mendapat teks halaman dan daftar bernomor berisi tombol, tautan, dan kolom isian, lalu mengeklik `ref: 12` alih-alih menebak dari screenshot. Pilih satu paragraf untuk bertanya hanya tentang itu; PDF juga bisa.
- **Ia bisa meneliti, lengkap dengan sumber.** Saat jawabannya tidak ada di halaman ini, ia mencari memakai browser Anda sendiri, membaca beberapa halaman, membandingkannya, lalu menjawab dengan kutipan `[n]` yang tertaut ke masing-masing sumber.
- **Aksi berisiko menunggu Anda.** Klik dan pengiriman formulir yang terlihat tak bisa dibatalkan, serta halaman di alamat yang dibuat sendiri oleh agen, akan berhenti sampai Anda menekan *Izinkan*. Pemeriksaan itu dijalankan oleh kode ekstensi, bukan sekadar meminta model dengan baik-baik.
- **Mulai gratis, atau bawa kunci sendiri.** Begitu terpasang, ia langsung berjalan di Browser Agent Cloud dengan kredit bulanan gratis dan tanpa daftar. Lebih suka penyedia sendiri? Beralih ke kunci API Anda sendiri di Pengaturan, dan permintaan langsung dikirim dari browser Anda ke penyedia itu.

## Fitur

**Beraksi di halaman**
- Alat: membaca halaman, mengklik, mengetik (termasuk dropdown `<select>`), menggulir, membuka URL. Model mendapat daftar bernomor elemen interaktif dan mengklik `ref: 12`, bukan menebak-nebak CSS selector.
- Pilih teks di halaman dan tanyakan hanya tentang itu; seleksi tersebut dilampirkan ke pesan Anda, bukan seluruh tab.
- PDF: teks diekstrak dengan pdf.js. Penampil bawaan memungkinkan Anda memilih teks dalam PDF seperti di halaman biasa. PDF hasil pindai (tanpa lapisan teks) dapat dikirim ke Claude sebagai dokumen, setelah Anda mengonfirmasi biayanya.
- Layar utama: saran berdasarkan halaman yang sedang Anda buka.

**Meneliti di seluruh web**
- Mencari dan membaca halaman di tab latar belakang browser Anda sendiri; halaman yang memerlukan login juga bisa, dan tab Anda saat ini tidak disentuh.
- Setiap halaman diringkas menjadi hal yang penting bagi pertanyaan Anda; sumber diberi nomor, kutipan `[n]` bisa diklik, dan sumber disimpan bersama percakapan serta ikut disertakan saat Anda mengekspornya.
- Mengikuti tautan dari halaman yang sudah dibaca dan langsung menuju situs riset seperti GitHub dan npm; alamat lain akan bertanya dulu.

**Dalam percakapan**
- Balasan Markdown secara streaming dengan tabel dan blok kode, plus ringkasan pemikiran yang dapat dilipat.
- Kartu pertanyaan (`ask_user`): saat model perlu membuat keputusan, ia bertanya dengan opsi yang bisa diklik, bukan menebak.
- Kartu file: hasil sebagai file `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics`, atau `vcf` yang bisa diunduh, dengan opsi salin dan pratinjau.

**Milik Anda untuk disimpan**
- Memori: katakan "ingat …" dan ia akan menyimpan fakta singkat tentang Anda lintas percakapan. Lihat, edit, atau matikan di Pengaturan.
- Riwayat: 30 percakapan terakhir, dikelompokkan berdasarkan tanggal. Buka kembali dan lanjutkan, atau ekspor sebagai Markdown.
- 12 skill bawaan dan perintah `/`; tulis skill Anda sendiri, atau instal [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, format yang dipakai Claude Code) dari GitHub, skills.sh, atau ClawHub.
- Antarmuka dalam 15 bahasa; tema terang dan gelap mengikuti sistem Anda.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Pemilih penyedia: Anthropic, OpenAI, Google Gemini, OpenRouter, Kustom (kompatibel OpenAI)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Mengetik / membuka menu skill"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Kartu pertanyaan dengan tiga opsi, satu direkomendasikan"></td>
  </tr>
  <tr>
    <td align="center">Atau pakai penyedia Anda sendiri</td>
    <td align="center">Ketik <code>/</code> untuk skill</td>
    <td align="center">Ia bertanya, bukan menebak</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Penampil PDF bawaan dengan satu kalimat terpilih, dan side panel menjelaskannya">

## Cara kerja riset

Tanyakan sesuatu yang tidak bisa dijawab halaman saat ini — "library state React mana yang sebaiknya saya pakai di 2026?" — dan agen akan meriset:

1. **Cari.** Ia membuka pencarian di tab latar belakang (Google; jika Google meminta verifikasi bahwa Anda manusia, ia beralih ke Bing), membaca judul, tautan, dan cuplikannya, lalu menutup tab. Hanya jika keduanya meminta verifikasi, tab pencarian dibawa ke depan agar Anda bisa menyelesaikannya; riset kemudian berlanjut sendiri.
2. **Baca.** Ia membuka hasil yang paling relevan di tab latar belakang — hingga empat sekaligus — dan mengekstrak teks utamanya. Tab Anda saat ini tidak pernah disentuh.
3. **Ringkas.** Setiap halaman diringkas oleh model kecil yang cepat (Claude Haiku) menjadi poin, kutipan, dan tanggal yang penting bagi pertanyaan Anda, sehingga dua puluh halaman tidak membanjiri percakapan maupun tagihan Anda.
4. **Jawab.** Anda mendapat kesimpulan lebih dulu, lalu tabel perbandingan, rekomendasi beserta alasannya, dan hal yang tidak terjawab oleh sumber. Hasil pencarian dan halaman yang dibaca diberi nomor: `[n]` di dalam jawaban adalah tautan, dan sumber yang dikutip dicantumkan di bawah balasan.

Anda bisa melihat setiap langkah di side panel dan menekan berhenti kapan saja. Satu tugas paling banyak menjalankan 40 langkah dan membaca 30 halaman.

## Mulai cepat

Membutuhkan Chrome 122+.

1. Instal **[Browser Agent dari Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — klik **Tambahkan ke Chrome**. Ekstensi akan memperbarui dirinya sendiri.
2. Klik ikon di toolbar untuk membuka side panel (tidak terlihat? sematkan dari menu ikon puzzle) dan setujui pemberitahuan data singkat.
3. Tanyakan sesuatu tentang halaman yang sedang Anda buka — atau minta ia meriset sesuatu. Tidak perlu kunci atau akun.

### Instal dari zip Release

Release bisa lebih baru daripada versi di store selagi versi baru menunggu peninjauan. Tidak perlu Node.js atau proses build.

1. Unduh `browser-agent-<version>.zip` dari [rilis terbaru](https://github.com/io-software-ai/browser-agent/releases/latest) dan ekstrak.
2. Buka `chrome://extensions` dan aktifkan **Mode pengembang** (di kanan atas).
3. Klik **Muat yang belum dikemas** dan pilih folder hasil ekstrak, lalu lanjutkan dari langkah 2 di atas.

Untuk memperbarui, unduh zip baru, ganti isi folder yang sama, lalu klik ikon reload pada kartu ekstensi. Pengaturan, percakapan, dan memori Anda tetap tersimpan. Memuatnya dari folder berbeda akan menginstal salinan terpisah yang mulai dari kosong — versi store juga begitu.

### Build dari sumber

Anda memerlukan Node.js 22+.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Lalu muat folder `extension/` dengan **Muat yang belum dikemas** seperti pada langkah 3. Hasil build dari sumber akan terhubung ke server Browser Agent Cloud di `http://localhost:4410` kecuali Anda mengatur `BA_BACKEND` saat build, jadi gunakan kunci API Anda sendiri (di bawah) atau arahkan ke backend yang Anda jalankan sendiri.

## Dua cara menjalankannya

| | Browser Agent Cloud (default) | Kunci API Anda sendiri |
|---|---|---|
| Penyiapan | Tidak ada — langsung berfungsi setelah instalasi | **Pengaturan → Pakai kunci API sendiri (lanjutan)**, lalu tempel kunci atau endpoint lokal |
| Akun | Tidak ada; ID perangkat anonim dibuat saat instalasi | Tidak ada |
| Model | Claude Sonnet, Opus, dan Haiku (5.5) | Apa pun yang ditawarkan penyedia Anda |
| Biaya | Kredit bulanan gratis; paket berbayar untuk lebih banyak (pembayaran lewat Paddle) | Ditagih oleh penyedia Anda; ekstensinya gratis |
| Ke mana permintaan dikirim | Lewat server Browser Agent Cloud ke penyedia model | Langsung dari browser Anda ke penyedia Anda |

**Kredit.** Dalam mode Cloud, setiap tugas (satu pesan yang Anda kirim, hingga agen berhenti) memakai sejumlah kredit tetap yang ditentukan oleh model, kedalaman berpikir, dan seberapa banyak isi tiap halaman yang dibaca. Side panel menampilkan perkiraan sebelum Anda mengirim dan sisa kredit setelah tiap tugas. Saat kredit habis, tugas dijeda sampai bulan depan atau sampai Anda upgrade.

**Kunci Anda sendiri.** Penyedia berikut dapat dipakai; pilih model yang mendukung tool calling, atau agen tidak bisa beraksi di halaman.

| Penyedia | Yang Anda perlukan | Catatan |
|---|---|---|
| Anthropic | [Kunci API](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; kedalaman berpikir; ringkasan pemikiran; PDF hasil pindai; ringkasan per halaman saat riset |
| OpenAI | [Kunci API](https://platform.openai.com/api-keys) | Daftar model diambil dari penyedia |
| Google Gemini | [Kunci API](https://aistudio.google.com/apikey) | Menggunakan endpoint Gemini yang kompatibel dengan OpenAI |
| OpenRouter | [Kunci API](https://openrouter.ai/keys) | Model apa pun di OpenRouter yang mendukung tool calling |
| Kustom (kompatibel OpenAI) | Base URL, kunci opsional | Ollama, LM Studio, vLLM, llama.cpp — apa pun dengan `/chat/completions` |

Dengan penyedia selain Anthropic, riset membaca setiap halaman sebagai teks mentah, bukan ringkasan Haiku, sehingga memakai lebih banyak token.

Server lokal memblokir ekstensi browser secara default:

- **Ollama:** atur `OLLAMA_ORIGINS=chrome-extension://*` dan mulai ulang Ollama (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). Base URL `http://localhost:11434/v1`.
- **LM Studio:** jalankan server dengan CORS aktif, `lms server start --cors`. Base URL `http://localhost:1234/v1`.

## Skill

Ketik `/` di kotak pesan untuk memilih salah satu, atau biarkan model memuatnya sendiri saat cocok.

| Perintah | Fungsinya |
|---|---|
| `/summarize` | Ringkasan satu baris, poin utama, dan hal yang perlu ditindaklanjuti dari halaman saat ini |
| `/translate` | Terjemahkan halaman ke bahasa Anda, mempertahankan judul dan paragraf |
| `/extract` | Tarik data di halaman ke tabel Markdown; jadi file CSV atau JSON jika datanya banyak |
| `/compare` | Buat tabel perbandingan harga, paket, atau spesifikasi dan soroti perbedaannya |
| `/explain` | Jelaskan halaman, istilah, atau potongan kode dengan bahasa sederhana |
| `/thread` | Rangkum utas komentar: argumen utama, masing-masing pihak, konsensus, komentar yang layak dibaca |
| `/reply` | Susun draf balasan untuk email atau pesan di halaman; bisa mengisi kotak balasan, tapi tidak pernah mengirim |
| `/fill-form` | Isi formulir dengan data Anda; menanyakan apa pun yang kurang, berhenti sebelum mengirim |
| `/review-pr` | Tinjau pull request GitHub dan daftar masalah berdasarkan tingkat keparahan, dengan file dan baris |
| `/checklist` | Ubah tutorial menjadi daftar periksa langkah-langkah |
| `/decide` | Uraikan pilihan yang ada, tanyakan kebutuhan Anda satu per satu, lalu rekomendasikan salah satu |
| `/grill-me` | Uji ketahanan rencana Anda (atau proposal di halaman) dengan satu pertanyaan pilihan ganda setiap kali |

`/clear` memulai percakapan baru. Riset tidak memerlukan perintah — cukup minta saja.

### Tulis sendiri

Skill adalah file Markdown dengan frontmatter `name` dan `description`, diikuti instruksi:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Kelola skill di **Pengaturan → Skill**: buat, edit, ekspor, impor file `.md`, `.zip`/`.skill` atau seluruh folder skill, atau instal dari tautan — `owner/repo/skill`, tautan folder GitHub, halaman skills.sh atau perintah `npx skills add …`-nya, halaman ClawHub, atau tautan https apa pun ke `SKILL.md` atau zip. Skill mengikuti standar [Agent Skills](https://agentskills.io/specification), format `SKILL.md` yang sama dengan yang dipakai Claude Code dan agen lain. File yang disertakan dalam skill (misalnya `references/forms.md`) disimpan dan hanya dibaca model bila instruksi menunjuk ke file tersebut; skrip yang disertakan disimpan sebagai teks dan tidak pernah dijalankan. Baris opsional `model:` (misalnya `model: haiku`) menjalankan skill tersebut dengan model Claude yang lebih murah; `disable-model-invocation: true` dan `user-invocable: false` bekerja seperti di Claude Code, dan `$ARGUMENTS` diganti dengan teks yang Anda ketik setelah `/name`.

Hanya nama dan deskripsi yang masuk ke system prompt; model memanggil `use_skill` untuk memuat instruksi lengkap saat diperlukan, dan mengetik `/nama` langsung melampirkannya. Skill adalah prompt — bacalah sebelum mengimpornya.

## Keamanan & privasi

**Alur data.** Sebuah permintaan ke model berisi pesan Anda, konten halaman yang dibaca agen (atau hanya seleksi Anda, atau PDF-nya), ringkasan halaman yang diriset, memori tersimpan Anda, dan nama skill Anda.

- *Mode Cloud* mengirim permintaan itu ke server Browser Agent Cloud, yang meneruskannya ke penyedia model dan mengalirkan balasannya kembali. Server menyimpan catatan penggunaan — model apa, berapa token, halaman, pencarian, dan kredit yang dipakai sebuah tugas — untuk menghitung kredit. Server tidak menyimpan pesan Anda, konten halaman, atau balasan model; jika penyedia model mengembalikan error, pesan error itu mungkin disimpan bersama catatan penggunaan untuk keperluan debugging.
- *Kunci Anda sendiri* mengirim permintaan langsung dari browser Anda ke penyedia Anda. Tidak ada apa pun tentang tugas Anda yang sampai ke server Browser Agent; satu-satunya kontak adalah pendaftaran anonim yang dilakukan saat ekstensi dipasang.

Percakapan, memori, skill, pengaturan, dan kunci API Anda hanya disimpan di `chrome.storage.local`. Tanpa analitik, tanpa iklan. Tidak ada yang dikirim ke model sebelum Anda menyetujui pemberitahuan data saat pertama kali dijalankan. Detail lengkap: [kebijakan privasi](store/privacy-policy.md).

**Riset memakai browser Anda.** Tab latar belakang memuat halaman dengan cookie dan sesi login Anda, persis seperti jika Anda membukanya sendiri; PDF diunduh langsung oleh ekstensi, juga dengan cookie Anda. Pencarian adalah pencarian Google (atau Bing) biasa dari browser Anda, jadi jika Anda sedang login, pencarian itu mungkin tersimpan di riwayat pencarian akun tersebut. Kata kunci pencarian ditulis oleh model berdasarkan pertanyaan Anda.

**Yang memerlukan *Izinkan* Anda.** Aksi berikut menampilkan kartu di side panel dan tidak berjalan sampai Anda menekan *Izinkan*. Kartu ini berada di halaman milik ekstensi sendiri, yang tidak bisa diklikkan oleh situs web untuk Anda:

- klik dan pengiriman formulir yang terlihat tak bisa dibatalkan: teks yang terlihat pada tombol, `aria-label`, title, atau value terbaca seperti bayar, beli, pesan, hapus, kirim, publikasikan, otorisasi, simpan, bagikan, instal, dan sejenisnya (dalam semua 15 bahasa antarmuka); formulir dengan beberapa kolom atau kolom kata sandi; tombol hanya-ikon di dalam formulir; menekan Enter di kolom yang bukan bagian formulir (kotak chat). Jika teks tombol yang terlihat dan `aria-label`-nya tidak sesuai, kartu akan memperingatkan Anda;
- pergi ke situs lain di tab Anda, baik dengan navigasi maupun mengeklik tautan, kecuali itu situs tempat tugas dimulai, situs yang Anda sebut dalam pesan Anda, atau yang sudah Anda izinkan dalam tugas ini;
- membaca di latar belakang halaman yang alamatnya disusun sendiri oleh agen. Tanpa bertanya, ia hanya membaca alamat persis dari hasil pencarian, tautan di halaman yang sudah dibacanya, alamat dalam pesan Anda, dan situs riset (GitHub, npm). Halaman di `localhost` atau jaringan lokal Anda tidak dibaca kecuali Anda sendiri yang mengetik alamatnya; untuk halaman yang dibuka di tab latar belakang, ini juga mencakup domain publik yang mengarah ke alamat lokal (untuk PDF hanya alamatnya sendiri yang diperiksa);
- menyimpan memori setelah percakapan berisi konten web (halaman yang dibaca, PDF, atau seleksi).

Kartu yang melibatkan alamat menampilkannya beserta query string-nya, karena alamat bisa membawa data keluar; alamat yang sangat panjang dipersingkat, dengan domain dan awal query string tetap dipertahankan.

Mengklik saran akan langsung mengirimkannya. Saran yang dihasilkan dari halaman ditulis setelah membaca konten halaman, jadi sebuah halaman bisa memengaruhinya: situs yang disebutkan di dalamnya tidak dianggap sebagai situs yang Anda sebut sendiri, dan apa pun yang dipicunya tetap melalui kartu yang sama. Tautan dalam balasan menampilkan domain aslinya di samping teksnya; daftar sumber menampilkan domain tiap sumber.

**Output dan file.** Balasan model dirender dengan DOMPurify. Gambar, media, SVG, iframe, formulir, dan inline style dihapus, sehingga sebuah halaman tidak bisa membuat model membocorkan percakapan Anda lewat URL gambar. File yang dihasilkan hanya format teks biasa (`csv`, `json`, `md`, …), dan sel CSV/TSV yang dimulai seperti rumus spreadsheet akan dinetralkan.

### Keterbatasan yang diketahui

- **Prompt injection belum terselesaikan.** Agen membaca banyak halaman yang tidak tepercaya dengan sesi login Anda. Halaman berbahaya bisa mencoba mengarahkannya untuk mengirim percakapan, memori, atau data dari situs lain ke suatu tempat, atau melakukan sesuatu atas nama Anda. Kartu-kartu itu menutupi aksi berisiko tinggi di atas; itu bukan perlindungan yang lengkap. Data dalam jumlah kecil masih bisa bocor lewat tautan mana yang dipilih agen untuk diikuti atau apa yang dicarinya.
- Jangan meriset atau menjalankan tugas di halaman yang tidak tepercaya saat tab bank, email, atau admin perusahaan Anda sedang terbuka, dan awasi agen saat tugas berjalan.
- Deteksi klik berisiko adalah heuristik kata kunci dan bentuk formulir. Ia akan melewatkan beberapa tombol.
- Mengetik di kolom pada situs yang sama tidak akan bertanya. Halaman berbahaya bisa membaca apa yang diketik agen (misalnya dengan listener `input`) dan mengirimkannya ke servernya sendiri.
- Skill yang diimpor dan diinstal adalah instruksi pihak ketiga. Selama salah satunya ada di daftar skill Anda (atau Anda memanggilnya dengan `/name`), setiap tugas dianggap tidak tepercaya: menyimpan memori, membuka tautan yang disusun agen, atau mengetik teks yang tidak Anda berikan akan bertanya dulu. Skill ini menampilkan label *Pihak ketiga* di daftar. Skill yang Anda tulis sendiri dianggap tepercaya. Skill yang ditambahkan sebelum versi ini tidak punya catatan sumber, jadi juga diperlakukan sebagai pihak ketiga; jika Anda menulisnya sendiri, buka skill itu dan pilih **Saya menulis ini sendiri**. Instal skill hanya dari sumber yang Anda percaya.
- Memori dan percakapan disimpan tanpa enkripsi di browser Anda dan dikirim ke model pada setiap permintaan (lewat Browser Agent Cloud, atau ke penyedia Anda sendiri).

## Bahasa

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. Bahasa default mengikuti browser Anda; ubah di **Pengaturan → Bahasa**. Model menjawab dalam bahasa antarmuka Anda kecuali Anda menulis dalam bahasa lain.

## Pengembangan

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

Side panel-nya adalah React + TypeScript yang dibundel oleh esbuild ke dalam `extension/`. `src/agent.ts` menjalankan loop agen di side panel: dalam mode Cloud, ia memanggil API Browser Agent Cloud (kompatibel dengan Anthropic, alamatnya diatur oleh `BA_BACKEND` saat build) dengan SDK resmi; dengan kunci Anda sendiri, ia memanggil Anthropic secara langsung atau API kompatibel OpenAI apa pun lewat `src/providers.ts`. Alat di `src/tools.ts` berjalan di tab aktif atau di tab latar belakang dengan `chrome.scripting`; `src/elements.ts` membangun daftar elemen bernomor dan pemeriksaan aksi tak-bisa-dibatalkan. Rangkaian tes e2e tidak memerlukan kunci API, tidak mengeluarkan biaya, dan tidak melakukan permintaan ke internet sungguhan.

Fungsi tiap file dapat dilihat di tabel pada bagian [Development](README.md#development) versi bahasa Inggris. Untuk menambah alat: tambahkan skemanya ke `tools` di `src/shared.ts` dan sebuah `case` di `runTool` pada `src/tools.ts`.

### Menerjemahkan

Salin `src/i18n/locales/en.ts` menjadi mis. `nl.ts`, deklarasikan sebagai `const nl: Dict = { … }`, terjemahkan nilainya (pertahankan setiap `{placeholder}`), lalu tambahkan ke `LANGS` dan loader di `src/i18n/index.ts`. `npm run typecheck` akan gagal jika ada key yang hilang atau berlebih; `npm run check` akan gagal jika ada placeholder yang tidak cocok. Prompt dan deskripsi alat yang dikirim ke model sengaja dibiarkan dalam satu bahasa. Untuk nama dan deskripsi di Chrome Web Store, tambahkan `extension/_locales/<code>/messages.json` (Chrome memakai garis bawah, misalnya `pt_BR`).

## Kontribusi

Issue dan PR sangat diterima — lihat [CONTRIBUTING.md](CONTRIBUTING.md). Buat PR sekecil mungkin, jalankan tiga pemeriksaan di atas, dan jelaskan bagaimana Anda menguji hal-hal yang tidak tercakup olehnya.

## Lisensi

Ekstensinya berlisensi [MIT](LICENSE). Browser Agent Cloud, layanan hosting opsional di balik mode default, dioperasikan secara terpisah dan bukan bagian dari repositori ini. Browser Agent adalah proyek independen, tidak berafiliasi dengan Anthropic, OpenAI, atau Google.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Didukung oleh io Software" height="32"></a></p>
