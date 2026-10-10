<div align="center">

<img src="docs/logo.svg" width="72" alt="Browser Agent logosu">

# Browser Agent

**Tarayıcınızda, baktığınız siteyle doğrudan çalışan bir AI ajanı. Sayfayı okur, tıklar, yazar ve sizin yerinize sayfalar arasında gezinir — tek sayfa yetmediğinde ise web genelinde araştırma yapıp kaynaklarıyla yanıt verir.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · Türkçe

<img src="docs/demo.gif" width="900" alt="Bir paragraf seçip /explain komutu çalıştırma, laptop fiyatlarını bir CSV'de karşılaştırma, ardından ajanın Place order'a tıklamadan önce sorması ve kullanıcının bunu reddetmesi">

</div>

## Neden

- **Zaten üzerinde olduğunuz sayfada çalışır.** Düz bir dille isteyin: bunu özetle, fiyatları bir tabloya çıkar, bu formu doldur, iptal ayarını bul. Sayfayı okur ve üzerinde işlem yapar — bir sohbet sekmesine kopyala-yapıştır yapmadan.
- **Sayfayı sitenin kurduğu haliyle görür.** Model, sayfa metnini ve numaralandırılmış bir düğme, bağlantı ve alan listesini alır; ekran görüntüsünden tahmin etmek yerine `ref: 12` şeklinde tıklar. Yalnızca o hakkında soru sormak için bir paragraf seçin; PDF'ler de çalışır.
- **Kaynaklarıyla araştırma yapabilir.** Yanıt bu sayfada olmadığında kendi tarayıcınızla arama yapar, birkaç sayfa okur, karşılaştırır ve her kaynağa geri bağlanan `[n]` atıflarıyla yanıt verir.
- **Riskli işlemler sizi bekler.** Geri alınamaz görünen tıklamalar ve form gönderimleri ile ajanın kendi uydurduğu adreslerdeki sayfalar, siz *İzin ver*'e basana kadar durur. Bu kontrol modele nazikçe rica ederek değil, eklentinin kodu tarafından zorunlu kılınır.
- **Ücretsiz başlayın ya da kendi anahtarınızı getirin.** Kurulumdan hemen sonra, aylık ücretsiz kredilerle ve kayıt gerektirmeden Browser Agent Cloud üzerinde çalışır. Kendi sağlayıcınızı mı tercih edersiniz? Ayarlar'da kendi API anahtarınıza geçin; istekler doğrudan tarayıcınızdan o sağlayıcıya gider.

## Özellikler

**Sayfa üzerinde işlem yapma**
- Araçlar: sayfayı okuma, tıklama, yazma (`<select>` açılır menüleri dahil), kaydırma, bir URL açma. Modele numaralandırılmış etkileşimli öğeler listesi verilir ve CSS seçicisi tahmin etmek yerine `ref: 12` şeklinde tıklar.
- Sayfada metin seçip sadece onunla ilgili soru sorun; seçim, tüm sekme yerine mesajınıza eklenir.
- PDF'ler: metin pdf.js ile çıkarılır. Yerleşik görüntüleyici, bir PDF'de tıpkı normal bir sayfada olduğu gibi metin seçmenizi sağlar. Taranmış PDF'ler (metin katmanı olmayan) maliyeti onayladıktan sonra bir belge olarak Claude'a gönderilebilir.
- Ana ekran: bulunduğunuz sayfaya göre öneriler.

**Web genelinde araştırma**
- Kendi tarayıcınızın arka plan sekmelerinde arama yapar ve sayfa okur; oturum açtığınız sayfalar da çalışır ve mevcut sekmenize dokunulmaz.
- Her sayfa, sorunuz için önemli olana göre özetlenir; kaynaklar numaralandırılır, `[n]` atıfları tıklanabilir, kaynaklar konuşmayla birlikte kaydedilir ve dışa aktardığınızda dahil edilir.
- Okuduğu sayfalardaki bağlantıları izler ve GitHub ile npm gibi araştırma sitelerine doğrudan gider; diğer adresler önce sorar.

**Sohbet içinde**
- Tablolar ve kod bloklarıyla akan Markdown yanıtları, ayrıca daraltılabilir düşünme özetleri.
- Soru kartları (`ask_user`): model bir karar vermeye ihtiyaç duyduğunda, tahmin etmek yerine tıklanabilir seçeneklerle sorar.
- Dosya kartları: sonuçlar indirilebilir `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics` veya `vcf` dosyaları olarak, kopyalama ve önizlemeyle birlikte.

**Size ait, saklanır**
- Hafıza: "şunu hatırla …" deyin, sohbetler arasında sizinle ilgili kısa bilgileri saklar. Ayarlar'da görüntüleyin, düzenleyin veya kapatın.
- Geçmiş: son 30 konuşma, tarihe göre gruplanmış. Birini yeniden açıp devam edin veya Markdown olarak dışa aktarın.
- 12 yerleşik beceri ve `/` komutları; kendinizinkini yazın ya da GitHub, skills.sh veya ClawHub'dan [Agent Skills](https://agentskills.io/specification) (Claude Code'un kullandığı `SKILL.md` formatı) yükleyin.
- 15 dilde arayüz; açık ve koyu tema sisteminizi takip eder.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Sağlayıcı seçici: Anthropic, OpenAI, Google Gemini, OpenRouter, Özel (OpenAI uyumlu)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Yazarken / beceri menüsünü açar"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Biri önerilen üç seçenekli bir soru kartı"></td>
  </tr>
  <tr>
    <td align="center">Ya da kendi sağlayıcınızı kullanın</td>
    <td align="center">Beceriler için <code>/</code> yazın</td>
    <td align="center">Tahmin etmek yerine sorar</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Seçili bir cümleyle yerleşik PDF görüntüleyici, ve onu açıklayan yan panel">

## Araştırma nasıl çalışır

Mevcut sayfanın yanıtlayamayacağı bir şey sorun — "2026'da hangi React durum kütüphanesini kullanmalıyım?" — ve ajan araştırır:

1. **Arama.** Arka plan sekmesinde bir arama açar (Google; Google insan olduğunuzu doğrulamanızı isterse Bing'e geçer), başlıkları, bağlantıları ve özetleri okur, sonra sekmeyi kapatır. Arama sekmesi ancak ikisi de doğrulama isterse öne gelir, böylece siz çözebilirsiniz; ardından araştırma kendiliğinden devam eder.
2. **Okuma.** En ilgili sonuçları arka plan sekmelerinde açar — aynı anda en fazla dört — ve ana metni çıkarır. Mevcut sekmenize hiçbir zaman dokunulmaz.
3. **Özetleme.** Her sayfa, küçük ve hızlı bir model (Claude Haiku) tarafından sorunuz için önemli olan noktalara, alıntılara ve tarihlere indirilir; böylece yirmi sayfa ne konuşmayı ne de faturanızı şişirir.
4. **Yanıt.** Önce sonucu, ardından bir karşılaştırma tablosunu, gerekçeli bir öneriyi ve kaynakların çözmediği noktaları alırsınız. Arama sonuçları ve okunan sayfalar numaralandırılır: yanıttaki `[n]` bir bağlantıdır ve atıf yapılan kaynaklar yanıtın altında listelenir.

Her adımı yan panelde izleyebilir ve istediğiniz an durdurabilirsiniz. Bir görev en fazla 40 adım atar ve en fazla 30 sayfa okur.

## Hızlı başlangıç

Chrome 122+ gerektirir.

1. **[Browser Agent'ı Chrome Web Store'dan yükleyin](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — **Chrome'a ekle**'ye tıklayın. Kendini otomatik günceller.
2. Yan paneli açmak için araç çubuğu simgesine tıklayın (görünmüyor mu? bulmaca parçası simgesindeki menüden sabitleyin) ve kısa veri bildirimini kabul edin.
3. Üzerinde olduğunuz sayfa hakkında soru sorun — ya da bir şeyi araştırmasını isteyin. Anahtar ya da hesap gerekmez.

### Release zip'inden yükleme

Yeni bir sürüm incelemeyi beklerken Release'ler mağazadaki sürümün önünde olabilir. Node.js veya build adımına gerek yok.

1. [En son sürümden](https://github.com/io-software-ai/browser-agent/releases/latest) `browser-agent-<version>.zip` dosyasını indirin ve açın.
2. `chrome://extensions` sayfasını açın ve **Geliştirici modu**nu (sağ üstte) etkinleştirin.
3. **Paketlenmemiş öğe yükle**'ye tıklayın ve açtığınız klasörü seçin, ardından yukarıdaki 2. adımdan devam edin.

Güncellemek için yeni zip dosyasını indirin, aynı klasörün içeriğini değiştirin ve eklenti kartındaki yeniden yükle simgesine tıklayın. Ayarlarınız, sohbetleriniz ve hafızalarınız korunur. Farklı bir klasörden yüklemek, boş başlayan ayrı bir kopya kurar — mağaza sürümü de öyle.

### Kaynaktan build alma

Node.js 22+ gerekir.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Ardından `extension/` klasörünü 3. adımdaki gibi **Paketlenmemiş öğe yükle** ile yükleyin. Build sırasında `BA_BACKEND` ayarlamazsanız, kaynaktan build edilen sürüm `http://localhost:4410` adresindeki bir Browser Agent Cloud sunucusuyla konuşur; bu yüzden kendi API anahtarınızı kullanın (aşağıda) ya da kendi çalıştırdığınız bir arka uca yönlendirin.

## Çalıştırmanın iki yolu

| | Browser Agent Cloud (varsayılan) | Kendi API anahtarınız |
|---|---|---|
| Kurulum | Yok — kurulumdan hemen sonra çalışır | **Ayarlar → Kendi API anahtarınızı kullanın (gelişmiş)**, ardından bir anahtar veya yerel bir endpoint yapıştırın |
| Hesap | Yok; kurulumda anonim bir cihaz kimliği oluşturulur | Yok |
| Modeller | Claude Sonnet, Opus ve Haiku (5.5) | Sağlayıcınızın sunduğu her şey |
| Maliyet | Aylık ücretsiz krediler; daha fazlası için ücretli planlar (ödeme Paddle ile) | Sağlayıcınız tarafından faturalandırılır; eklenti ücretsizdir |
| İstekler nereye gider | Browser Agent Cloud sunucusu üzerinden model sağlayıcısına | Tarayıcınızdan doğrudan sağlayıcınıza |

**Krediler.** Cloud modunda her görev (gönderdiğiniz bir mesaj, ajan duruncaya kadar) modele, düşünme derinliğine ve her sayfanın ne kadarını okuduğuna göre belirlenen sabit sayıda kredi harcar. Yan panel, göndermeden önce tahmini, her görevden sonra da kalan kredileri gösterir. Krediler bittiğinde görevler bir sonraki aya kadar ya da yükseltme yapana kadar duraklar.

**Kendi anahtarınız.** Bu sağlayıcılar çalışır; araç çağırmayı destekleyen bir model seçin, yoksa ajan sayfa üzerinde işlem yapamaz.

| Sağlayıcı | İhtiyacınız olan | Notlar |
|---|---|---|
| Anthropic | [API anahtarı](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; düşünme derinliği; düşünme özetleri; taranmış PDF'ler; araştırmada sayfa başına özet |
| OpenAI | [API anahtarı](https://platform.openai.com/api-keys) | Model listesi sağlayıcıdan çekilir |
| Google Gemini | [API anahtarı](https://aistudio.google.com/apikey) | Gemini'nin OpenAI uyumlu endpoint'ini kullanır |
| OpenRouter | [API anahtarı](https://openrouter.ai/keys) | OpenRouter'daki araç kullanabilen herhangi bir model |
| Özel (OpenAI uyumlu) | Base URL, anahtar isteğe bağlı | Ollama, LM Studio, vLLM, llama.cpp — `/chat/completions` olan her şey |

Anthropic dışındaki sağlayıcılarda araştırma, her sayfayı Haiku özeti yerine ham metin olarak okur; bu da daha fazla token harcar.

Yerel sunucular varsayılan olarak tarayıcı eklentilerini engeller:

- **Ollama:** `OLLAMA_ORIGINS=chrome-extension://*` ayarlayın ve Ollama'yı yeniden başlatın (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). Base URL: `http://localhost:11434/v1`.
- **LM Studio:** sunucuyu CORS açık olarak başlatın, `lms server start --cors`. Base URL: `http://localhost:1234/v1`.

## Beceriler

Bir tanesini seçmek için mesaj kutusuna `/` yazın, ya da uygun olduğunda modelin kendisinin yüklemesine izin verin.

| Komut | Ne yapar |
|---|---|
| `/summarize` | Mevcut sayfa için tek satırlık özet, ana noktalar ve yapılacaklar |
| `/translate` | Sayfayı başlıkları ve paragrafları koruyarak kendi dilinize çevirir |
| `/extract` | Sayfadaki verileri bir Markdown tablosuna çeker; çok fazla veri varsa bir CSV veya JSON dosyası olarak |
| `/compare` | Fiyatların, planların veya özelliklerin karşılaştırma tablosunu oluşturur ve farkları vurgular |
| `/explain` | Sayfayı, bir terimi veya bir kod parçasını sade bir dille açıklar |
| `/thread` | Bir yorum başlığını özetler: ana argümanlar, her bir taraf, fikir birliği, okumaya değer yorumlar |
| `/reply` | Sayfadaki e-posta veya mesaja bir yanıt taslağı hazırlar; yanıt kutusunu doldurabilir, asla göndermez |
| `/fill-form` | Formu bilgilerinizle doldurur; eksik olan her şeyi sorar, göndermeden önce durur |
| `/review-pr` | Bir GitHub pull request'ini inceler ve sorunları önem derecesine göre, dosya ve satırıyla listeler |
| `/checklist` | Bir eğitimi adım adım bir kontrol listesine dönüştürür |
| `/decide` | Seçenekleri ortaya koyar, ihtiyaçlarınızı birer birer sorar, sonra birini önerir |
| `/grill-me` | Planınızı (veya sayfadaki teklifi) her seferinde bir çoktan seçmeli soruyla test eder |

`/clear` yeni bir konuşma başlatır. Araştırma için komut gerekmez — sadece isteyin.

### Kendi becerinizi yazın

Bir beceri, `name` ve `description` frontmatter'ına sahip, ardından talimatlar içeren bir Markdown dosyasıdır:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Becerileri **Ayarlar → Beceriler**'de yönetin: oluşturun, düzenleyin, dışa aktarın, bir `.md`, `.zip`/`.skill` dosyasını veya bütün bir beceri klasörünü içe aktarın ya da bir bağlantıdan yükleyin — `owner/repo/skill`, bir GitHub klasör bağlantısı, bir skills.sh sayfası veya onun `npx skills add …` komutu, bir ClawHub sayfası ya da bir `SKILL.md` veya zip dosyasına giden herhangi bir https bağlantısı. Beceriler [Agent Skills](https://agentskills.io/specification) standardını izler; bu, Claude Code ve diğer ajanların kullandığı `SKILL.md` biçimidir. Bir beceriyle birlikte gelen dosyalar (örneğin `references/forms.md`) saklanır ve model onları yalnızca talimatlar işaret ettiğinde okur; birlikte gelen betikler metin olarak tutulur ve asla çalıştırılmaz. İsteğe bağlı bir `model:` satırı (örneğin `model: haiku`), o beceriyi daha ucuz bir Claude modelinde çalıştırır; `disable-model-invocation: true` ve `user-invocable: false` Claude Code'daki gibi çalışır, `$ARGUMENTS` ise `/name` sonrasında yazdığınız metinle değiştirilir.

Sistem prompt'una yalnızca isimler ve açıklamalar girer; model, ihtiyaç duyduğunda tam talimatları yüklemek için `use_skill`'i çağırır, `/isim` yazmak ise onları doğrudan ekler. Beceriler birer prompt'tur — içe aktarmadan önce okuyun.

## Güvenlik ve gizlilik

**Veri akışı.** Modele giden bir istek; mesajlarınızı, ajanın okuduğu sayfa içeriğini (veya sadece seçiminizi, ya da PDF'i), araştırdığı sayfaların özetlerini, kayıtlı hafızalarınızı ve beceri adlarınızı içerir.

- *Cloud modu* bu isteği Browser Agent Cloud sunucusuna gönderir; sunucu onu model sağlayıcısına iletir ve yanıtı akış olarak geri verir. Sunucu, kredileri saymak için kullanım kayıtları tutar — bir görevin hangi modeli, kaç token, sayfa, arama ve krediyi kullandığı. Mesajlarınızı, sayfa içeriğini veya modelin yanıtlarını saklamaz; model sağlayıcısı bir hata döndürürse, o hata mesajı hata ayıklama için kullanım kaydıyla birlikte tutulabilir.
- *Kendi anahtarınız* istekleri doğrudan tarayıcınızdan sağlayıcınıza gönderir. Görevlerinizle ilgili hiçbir şey Browser Agent'ın sunucularına gitmez; tek temas, eklenti kurulduğunda yapılan anonim kayıttır.

Konuşmalarınız, hafızalarınız, becerileriniz, ayarlarınız ve her türlü API anahtarı yalnızca `chrome.storage.local`'da saklanır. Analitik yok, reklam yok. İlk çalıştırma veri bildirimini kabul etmeden bir modele hiçbir şey gönderilmez. Tam ayrıntılar: [gizlilik politikası](store/privacy-policy.md).

**Araştırma tarayıcınızı kullanır.** Arka plan sekmeleri sayfaları sizin çerezlerinizle ve oturumlarınızla yükler, tıpkı kendiniz açmışsınız gibi; PDF'leri eklentinin kendisi doğrudan indirir, yine çerezlerinizle. Aramalar tarayıcınızdan yapılan sıradan Google (veya Bing) aramalarıdır; bu yüzden oturum açtıysanız o hesabın arama geçmişine kaydedilebilirler. Arama anahtar kelimelerini model, sorunuzdan yazar.

***İzin ver*'inizi gerektiren şeyler.** Bu işlemler yan panelde bir kart gösterir ve siz *İzin ver*'e basana kadar çalışmaz. Kart, bir web sitesinin sizin adınıza tıklayamayacağı, eklentinin kendi sayfasında bulunur:

- geri alınamaz görünen tıklamalar ve form gönderimleri: düğmenin görünür metni, `aria-label`'ı, title'ı veya value'su öde, satın al, sipariş ver, sil, gönder, yayınla, yetkilendir, kaydet, paylaş, yükle ve benzerleri gibi okunuyorsa (15 arayüz dilinin tümünde); birden fazla alanı veya bir şifre alanı olan bir form; bir form içindeki yalnızca simgeli bir düğme; bir form içinde olmayan bir alanda (sohbet kutuları) Enter'a basmak. Bir düğmenin görünür metni ile `aria-label`'ı uyuşmuyorsa, kart sizi uyarır;
- görevin başladığı site, mesajınızda belirttiğiniz bir site veya bu görevde zaten izin verdiğiniz bir site olmadıkça, sekmenizde gezinerek veya bir bağlantıya tıklayarak başka bir siteye gitmek;
- adresini ajanın kendisinin oluşturduğu bir sayfayı arka planda okumak. Sormadan yalnızca arama sonuçlarındaki, daha önce okuduğu sayfalardaki bağlantıların, mesajınızdaki adreslerin ve araştırma sitelerinin (GitHub, npm) birebir aynı adreslerini okur. `localhost` veya yerel ağınızdaki sayfalar, adresi siz yazmadıkça okunmaz; arka plan sekmesinde açılan sayfalar için bu, yerel bir adrese çözümlenen genel alan adlarını da kapsar (PDF'lerde yalnızca adresin kendisi denetlenir);
- konuşma web içeriği içerdiğinde (okuduğu bir sayfa, bir PDF, bir seçim) bir hafıza kaydetmek.

Bir adres içeren kartlar onu sorgu dizesiyle birlikte gösterir, çünkü bir adres veriyi dışarı taşıyabilir; çok uzun adresler kısaltılır, alan adı ve sorgu dizesinin başı korunur.

Bir öneriye tıklamak onu hemen gönderir. Sayfadan üretilen öneriler sayfa içeriği okunduktan sonra yazılır, dolayısıyla bir sayfa bunları etkileyebilir: bahsettikleri siteler sizin belirttiğiniz siteler sayılmaz ve tetikledikleri şey yine aynı kartlardan geçer. Yanıtlardaki bağlantılar metnin yanında gerçek alan adlarını gösterir; kaynak listesi her kaynağın alan adını gösterir.

**Çıktı ve dosyalar.** Model yanıtları DOMPurify ile render edilir. Görseller, medya, SVG, iframe'ler, formlar ve satır içi stiller çıkarılır, böylece bir sayfa modeli bir görsel URL'si üzerinden konuşmanızı sızdırmaya zorlayamaz. Üretilen dosyalar yalnızca düz metin formatlarıdır (`csv`, `json`, `md`, …) ve bir e-tablo formülü gibi başlayan CSV/TSV hücreleri etkisiz hale getirilir.

### Bilinen sınırlamalar

- **Prompt injection çözülmüş değildir.** Ajan, oturum açtığınız hesabınızla güvenilmeyen birçok sayfayı okur. Kötü niyetli bir sayfa, konuşmanızı, hafızalarınızı veya diğer sitelerden gelen verileri bir yere göndermesi ya da sizin adınıza bir şeyler yapması için onu yönlendirmeye çalışabilir. Kartlar yukarıdaki yüksek riskli işlemleri kapsar; tam bir koruma değildir. Ajanın hangi bağlantıları izlemeyi seçtiği veya neyi aradığı üzerinden yine de az miktarda veri sızabilir.
- Bankanız, e-postanız veya şirket yönetici panelinizle ilgili sekmeler açıkken güvenilmeyen sayfalarda araştırma yapmayın ya da görev çalıştırmayın ve bir görev çalışırken ajanı izleyin.
- Riskli tıklamaları tespit etmek anahtar kelime ve form şekli sezgisine dayanır. Bazı düğmeleri kaçıracaktır.
- Aynı sitedeki bir alana yazmak sormaz. Kötü niyetli bir sayfa, ajanın yazdıklarını okuyabilir (örneğin bir `input` dinleyicisiyle) ve kendi sunucusuna gönderebilir.
- İçe aktarılan ve yüklenen beceriler üçüncü tarafların talimatlarıdır. Biri beceri listenizdeyken (veya onu `/name` ile çağırdığınızda) her görev güvenilmez sayılır: bir anı kaydetmek, ajanın oluşturduğu bir bağlantıyı açmak ya da sizin vermediğiniz bir metni yazmak önce sizden onay ister. Bu beceriler listede *Üçüncü taraf* etiketi taşır. Kendi yazdığınız beceriler güvenilir sayılır. Bu sürümden önce eklenen becerilerin kayıtlı bir kaynağı yoktur, bu yüzden onlar da üçüncü taraf sayılır; birini kendiniz yazdıysanız açın ve **Bunu kendim yazdım** seçeneğini seçin. Yalnızca güvendiğiniz kaynaklardan beceri yükleyin.
- Hafızalar ve konuşmalar tarayıcınızda şifrelenmeden saklanır ve her istekle birlikte modele gönderilir (Browser Agent Cloud üzerinden veya kendi sağlayıcınıza).

## Diller

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. Varsayılan, tarayıcınızı takip eder; **Ayarlar → Dil**'den değiştirin. Model, siz başka bir dilde yazmadıkça arayüz dilinizde yanıt verir.

## Geliştirme

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

Yan panel, esbuild tarafından `extension/` içine paketlenen React + TypeScript'tir. `src/agent.ts`, ajan döngüsünü yan panelde çalıştırır: Cloud modunda resmi SDK ile Browser Agent Cloud API'sini (Anthropic uyumlu, adresi build sırasında `BA_BACKEND` belirler) çağırır; kendi anahtarınızla Anthropic'i doğrudan veya `src/providers.ts` aracılığıyla OpenAI uyumlu herhangi bir API'yi çağırır. `src/tools.ts` içindeki araçlar, `chrome.scripting` ile aktif sekmede veya arka plan sekmelerinde çalışır; `src/elements.ts`, numaralandırılmış öğe listesini ve geri alınamaz işlem kontrolünü oluşturur. e2e test paketi bir API anahtarına ihtiyaç duymaz, hiçbir şey harcamaz ve gerçek internete istek yapmaz.

Her dosyanın ne işe yaradığı için İngilizce sürümdeki [Development](README.md#development) bölümündeki tabloya bakın. Bir araç eklemek için: şemasını `src/shared.ts` içindeki `tools`'a ve `src/tools.ts` içindeki `runTool`'a bir `case` ekleyin.

### Çeviri yapmak

`src/i18n/locales/en.ts` dosyasını örneğin `nl.ts` olarak kopyalayın, `const nl: Dict = { … }` şeklinde tanımlayın, değerleri çevirin (her `{placeholder}`'ı koruyun) ve `src/i18n/index.ts` içindeki `LANGS`'a ve yükleyicilere ekleyin. `npm run typecheck`, eksik veya fazla bir anahtar olduğunda başarısız olur; `npm run check`, eşleşmeyen bir placeholder olduğunda başarısız olur. Modele gönderilen prompt'lar ve araç açıklamaları kasıtlı olarak tek bir dilde kalır. Chrome Web Store adı ve açıklaması için `extension/_locales/<code>/messages.json` ekleyin (Chrome alt çizgi kullanır, örneğin `pt_BR`).

## Katkıda bulunma

Issue'lar ve PR'lar memnuniyetle karşılanır — bkz. [CONTRIBUTING.md](CONTRIBUTING.md). PR'ları küçük tutun, yukarıdaki üç kontrolü çalıştırın ve bunların kapsamadığı şeyleri nasıl test ettiğinizi belirtin.

## Lisans

Eklenti [MIT](LICENSE) lisanslıdır. Varsayılan modun arkasındaki isteğe bağlı barındırılan hizmet olan Browser Agent Cloud ayrıca işletilir ve bu deponun parçası değildir. Browser Agent bağımsız bir projedir, Anthropic, OpenAI veya Google ile bağlantılı değildir.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="io Software desteğiyle" height="32"></a></p>
