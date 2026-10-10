<div align="center">

<img src="docs/logo.svg" width="72" alt="Logo di Browser Agent">

# Browser Agent

**Un agente IA nel tuo browser che lavora direttamente sul sito che stai guardando. Legge la pagina, clicca, digita e passa da una pagina all'altra per te — e quando una pagina non basta, fa ricerche su tutto il web e risponde con le fonti.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · Italiano · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Seleziona un paragrafo e usa /explain per spiegarlo, confronta i prezzi di alcuni laptop in un CSV, poi l'agente chiede conferma prima di cliccare Effettua ordine e l'utente nega">

</div>

## Perché

- **Lavora sulla pagina in cui ti trovi già.** Chiedi con parole tue: riassumi questa pagina, metti i prezzi in una tabella, compila questo modulo, trova l'impostazione per disdire. Legge la pagina e agisce su di essa, senza copiare e incollare in una scheda di chat.
- **Vede la pagina come l'ha costruita il sito.** Il modello riceve il testo della pagina e un elenco numerato di pulsanti, link e campi, e clicca su `ref: 12` invece di indovinare da uno screenshot. Seleziona un paragrafo per chiedere solo di quello; funzionano anche i PDF.
- **Sa fare ricerche, con le fonti.** Quando la risposta non è in questa pagina, cerca con il tuo browser, legge una manciata di pagine, le confronta e risponde con citazioni `[n]` che rimandano a ogni fonte.
- **Le azioni rischiose aspettano te.** I clic e gli invii di moduli che sembrano irreversibili, e le pagine con indirizzi che l'agente si è inventato da solo, si fermano finché non premi *Consenti*. Questo controllo è imposto dal codice dell'estensione, non chiedendo gentilmente al modello.
- **Parti gratis, oppure porta la tua chiave.** Appena installata funziona con Browser Agent Cloud, con crediti mensili gratuiti e senza registrazione. Preferisci il tuo provider? Passa alla tua chiave API nelle Impostazioni e le richieste andranno direttamente dal tuo browser a quel provider.

## Funzionalità

**Agire sulla pagina**
- Strumenti: leggere la pagina, cliccare, digitare (inclusi i menu a tendina `<select>`), scorrere, aprire un URL. Il modello riceve un elenco numerato di elementi interattivi e clicca su `ref: 12` invece di indovinare selettori CSS.
- Seleziona il testo nella pagina e chiedi solo di quello; la selezione viene allegata al tuo messaggio al posto dell'intera scheda.
- Allega file a un messaggio: trascina, incolla o scegli file di testo, codice o PDF, e il loro testo viene inviato insieme a ciò che digiti.
- PDF: il testo viene estratto con pdf.js. Un visualizzatore integrato permette di selezionare il testo in un PDF come in qualsiasi pagina. I PDF scansionati (senza livello di testo) possono essere inviati a Claude come documento, dopo che hai confermato il costo.
- Schermata iniziale: suggerimenti basati sulla pagina in cui ti trovi.

**Ricerca su tutto il web**
- Cerca e legge pagine in schede in background del tuo browser; funzionano anche le pagine a cui hai effettuato l'accesso, e la tua scheda attuale non viene toccata.
- Ogni pagina viene condensata in ciò che conta per la tua domanda; le fonti sono numerate, le citazioni `[n]` sono cliccabili, e le fonti vengono salvate con la conversazione e incluse quando la esporti.
- Segue i link delle pagine che ha letto e va direttamente a siti di ricerca come GitHub e npm; per gli altri indirizzi chiede prima.

**Nella conversazione**
- Risposte in Markdown in streaming con tabelle e blocchi di codice, più riepiloghi del ragionamento comprimibili.
- Schede di domanda (`ask_user`): quando il modello ha bisogno di una decisione, la chiede con opzioni cliccabili invece di indovinare.
- Schede file: risultati come file scaricabili `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics` o `vcf`, con copia e anteprima.

**Resta tuo**
- Progetti: dai a un progetto le sue istruzioni, i suoi file e la sua memoria, e scegli quali skill usa. Ogni chat del progetto parte con le sue istruzioni; l'agente apre i file del progetto solo quando gli servono.
- Memoria: di' "ricorda …" e conserva brevi fatti su di te tra una chat e l'altra. Puoi vederla, modificarla o disattivarla nelle Impostazioni.
- Cronologia: le ultime 30 conversazioni di ogni progetto, raggruppate per data. Riaprine una e continua, oppure esportala in Markdown.
- 12 skill integrate e comandi `/`; scrivi le tue, oppure installa [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, il formato usato da Claude Code) da GitHub, skills.sh o ClawHub.
- Interfaccia in 15 lingue; il tema chiaro e scuro segue quello del sistema.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Selettore del provider: Anthropic, OpenAI, Google Gemini, OpenRouter, Personalizzato (compatibile con OpenAI)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Digitando / si apre il menu delle skill"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Una scheda di domanda con tre opzioni, una consigliata"></td>
  </tr>
  <tr>
    <td align="center">Oppure usa il tuo provider</td>
    <td align="center">Digita <code>/</code> per le skill</td>
    <td align="center">Chiede invece di indovinare</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Visualizzatore PDF integrato con una frase selezionata, e il pannello laterale che la spiega">

## Come funziona la ricerca

Fai una domanda a cui la pagina attuale non sa rispondere ("quale libreria di stato React dovrei usare nel 2026?") e l'agente fa una ricerca:

1. **Cercare.** Apre una ricerca in una scheda in background (Google; se Google chiede di verificare che sei una persona, passa a Bing), legge titoli, link e snippet, poi chiude la scheda. Solo se entrambi chiedono una verifica la scheda di ricerca passa in primo piano perché tu la risolva; poi la ricerca prosegue da sola.
2. **Leggere.** Apre i risultati più rilevanti in schede in background (fino a quattro alla volta) ed estrae il testo principale. La tua scheda attuale non viene mai toccata.
3. **Condensare.** Ogni pagina viene ridotta da un modello piccolo e veloce (Claude Haiku) ai punti, alle citazioni e alle date che contano per la tua domanda, così venti pagine non inondano né la conversazione né il tuo conto.
4. **Rispondere.** Ricevi prima la conclusione, poi una tabella di confronto, una raccomandazione con le motivazioni e ciò che le fonti non hanno chiarito. I risultati di ricerca e le pagine lette sono numerati: `[n]` nella risposta è un link, e le fonti citate sono elencate sotto la risposta.

Puoi vedere ogni passaggio nel pannello laterale e fermarti in qualsiasi momento. Un'attività fa al massimo 40 passaggi e legge al massimo 30 pagine.

## Avvio rapido

Richiede Chrome 122+.

1. Installa **[Browser Agent dal Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — clicca su **Aggiungi**. Si aggiorna da solo.
2. Clicca l'icona nella barra degli strumenti per aprire il pannello laterale (non la vedi? aggiungila dal menu dell'icona del puzzle) e accetta il breve avviso sui dati.
3. Fai una domanda sulla pagina in cui ti trovi, oppure chiedi di cercare qualcosa. Non servono chiavi né account.

### Installare da uno zip di Release

Le Release possono essere più avanti dello store mentre una nuova versione attende la revisione. Non serve Node.js né una fase di build.

1. Scarica `browser-agent-<version>.zip` dall'[ultima release](https://github.com/io-software-ai/browser-agent/releases/latest) ed estrailo.
2. Apri `chrome://extensions` e attiva **Modalità sviluppatore** (in alto a destra).
3. Clicca **Carica non pacchettizzata** e scegli la cartella estratta, poi continua dal passaggio 2 sopra.

Per aggiornare, scarica il nuovo zip, sostituisci il contenuto della stessa cartella e clicca l'icona di ricarica sulla scheda dell'estensione. Impostazioni, chat e ricordi vengono conservati. Caricarla da una cartella diversa installa una copia separata che parte vuota, e lo stesso vale per la versione dello store.

### Compilare dai sorgenti

Serve Node.js 22+.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Poi carica la cartella `extension/` con **Carica non pacchettizzata** come al passaggio 3. Una build dai sorgenti comunica con un server Browser Agent Cloud su `http://localhost:4410`, a meno che tu non imposti `BA_BACKEND` durante la build; quindi usa la tua chiave API (sotto) oppure punta a un backend che gestisci tu.

## Due modi per usarlo

| | Browser Agent Cloud (predefinito) | La tua chiave API |
|---|---|---|
| Configurazione | Nessuna: funziona subito dopo l'installazione | **Impostazioni → Usa la tua chiave API (avanzato)**, poi incolla una chiave o un endpoint locale |
| Account | Nessuno; all'installazione viene creato un ID dispositivo anonimo | Nessuno |
| Modelli | Claude Sonnet, Opus e Haiku (5.5) | Quelli offerti dal tuo provider |
| Costo | Crediti mensili gratuiti; piani a pagamento per averne di più (pagamento tramite Paddle) | Fatturato dal tuo provider; l'estensione è gratuita |
| Dove vanno le richieste | Attraverso il server Browser Agent Cloud fino al provider del modello | Direttamente dal tuo browser al tuo provider |

**Crediti.** In modalità Cloud ogni attività (un messaggio che invii, finché l'agente non si ferma) usa un numero fisso di crediti determinato dal modello, dalla profondità di ragionamento e da quanto legge di ogni pagina. Il pannello laterale mostra la stima prima dell'invio e i crediti rimasti dopo ogni attività. Quando finiscono, le attività restano in pausa fino al mese successivo o finché non passi a un piano superiore.

**La tua chiave.** Questi provider funzionano; scegli un modello che supporti le chiamate a strumenti (tool calling), altrimenti l'agente non può agire sulla pagina.

| Provider | Cosa ti serve | Note |
|---|---|---|
| Anthropic | [Chiave API](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; profondità di ragionamento; riepiloghi del ragionamento; PDF scansionati; riepiloghi di ricerca per pagina |
| OpenAI | [Chiave API](https://platform.openai.com/api-keys) | L'elenco dei modelli viene recuperato dal provider |
| Google Gemini | [Chiave API](https://aistudio.google.com/apikey) | Usa l'endpoint di Gemini compatibile con OpenAI |
| OpenRouter | [Chiave API](https://openrouter.ai/keys) | Qualsiasi modello di OpenRouter con supporto agli strumenti |
| Personalizzato (compatibile con OpenAI) | URL base, chiave facoltativa | Ollama, LM Studio, vLLM, llama.cpp — qualsiasi cosa con `/chat/completions` |

Con provider diversi da Anthropic, la ricerca legge ogni pagina come testo grezzo invece che come riepilogo di Haiku, il che consuma più token.

I server locali bloccano per impostazione predefinita le estensioni del browser:

- **Ollama:** imposta `OLLAMA_ORIGINS=chrome-extension://*` e riavvia Ollama (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). URL base `http://localhost:11434/v1`.
- **LM Studio:** avvia il server con CORS attivo, `lms server start --cors`. URL base `http://localhost:1234/v1`.

## Skill

Digita `/` nella casella di scrittura per sceglierne una, oppure lascia che sia il modello a caricarne una quando serve.

| Comando | Cosa fa |
|---|---|
| `/summarize` | Sintesi in una riga, punti chiave e azioni da fare per la pagina attuale |
| `/translate` | Traduce la pagina nella tua lingua, mantenendo titoli e paragrafi |
| `/extract` | Estrae i dati della pagina in una tabella Markdown; un file CSV o JSON quando sono molti |
| `/compare` | Costruisce una tabella di confronto di prezzi, piani o specifiche ed evidenzia le differenze |
| `/explain` | Spiega la pagina, un termine o un frammento di codice con parole semplici |
| `/thread` | Riassume una discussione di commenti: argomenti principali, ciascuna parte, consenso, commenti che vale la pena leggere |
| `/reply` | Scrive una bozza di risposta all'email o al messaggio nella pagina; può compilare la casella di risposta, ma non invia mai |
| `/fill-form` | Compila il modulo con i tuoi dati; chiede ciò che manca e si ferma prima dell'invio |
| `/review-pr` | Rivede una pull request di GitHub ed elenca i problemi per gravità, con file e riga |
| `/checklist` | Trasforma un tutorial in una checklist di passaggi |
| `/decide` | Espone le opzioni, chiede delle tue esigenze una alla volta, poi ne consiglia una |
| `/grill-me` | Mette alla prova il tuo piano (o la proposta nella pagina) con una domanda a scelta multipla alla volta |

`/clear` avvia una nuova conversazione. La ricerca non ha bisogno di un comando: chiedi e basta.

### Scrivi le tue

Una skill è un file Markdown con frontmatter `name` e `description`, seguito dalle istruzioni:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Gestisci le skill in **Impostazioni → Skill**: crea, modifica, esporta, importa un file `.md`, `.zip`/`.skill` o un'intera cartella di skill, oppure installa da un link — `owner/repo/skill`, un link a una cartella GitHub, una pagina di skills.sh o il suo comando `npx skills add …`, una pagina di ClawHub, o qualsiasi link https a un `SKILL.md` o a uno zip. Le skill seguono lo standard [Agent Skills](https://agentskills.io/specification), lo stesso formato `SKILL.md` usato da Claude Code e da altri agenti. I file inclusi in una skill (per esempio `references/forms.md`) vengono salvati e il modello li legge solo quando le istruzioni li richiamano; gli script inclusi sono conservati come testo e non vengono mai eseguiti. Una riga facoltativa `model:` (per esempio `model: haiku`) esegue quella skill su un modello Claude più economico; `disable-model-invocation: true` e `user-invocable: false` funzionano come in Claude Code, e `$ARGUMENTS` viene sostituito da ciò che digiti dopo `/name`.

Solo nomi e descrizioni finiscono nel system prompt; il modello chiama `use_skill` per caricare le istruzioni complete quando servono, e digitare `/nome` le allega direttamente. Le skill sono prompt: leggila prima di importarla.

## Sicurezza e privacy

**Flusso dei dati.** Una richiesta al modello contiene i tuoi messaggi, il contenuto della pagina letta dall'agente (o solo la tua selezione, o il PDF), i riepiloghi delle pagine cercate, i tuoi ricordi salvati e i nomi delle tue skill. In un progetto contiene anche le istruzioni e la memoria del progetto; vengono inviati anche i file che alleghi a un messaggio e i file del progetto che l'agente apre.

- La *modalità Cloud* invia quella richiesta al server Browser Agent Cloud, che la inoltra al provider del modello e restituisce la risposta in streaming. Il server conserva registri di utilizzo — quale modello, quanti token, pagine, ricerche e crediti ha usato un'attività — per contare i crediti. Non memorizza i tuoi messaggi, il contenuto delle pagine né le risposte del modello; se il provider del modello restituisce un errore, quel messaggio di errore può essere conservato insieme al registro di utilizzo per il debug.
- *La tua chiave* invia le richieste direttamente dal tuo browser al tuo provider. Nulla sulle tue attività arriva ai server di Browser Agent; l'unico contatto è la registrazione anonima fatta quando l'estensione è stata installata.

Le tue conversazioni, i ricordi, le skill, le impostazioni e qualsiasi chiave API sono memorizzati solo in `chrome.storage.local`. Nessuna analisi, nessuna pubblicità. Non viene inviato nulla a un modello prima che tu accetti l'avviso sui dati del primo avvio. Dettagli completi: [informativa sulla privacy](store/privacy-policy.md).

**La ricerca usa il tuo browser.** Le schede in background caricano le pagine con i tuoi cookie e le tue sessioni con accesso effettuato, esattamente come se le avessi aperte tu; i PDF vengono scaricati direttamente dall'estensione, anch'essi con i tuoi cookie. Le ricerche sono normali ricerche su Google (o Bing) dal tuo browser, quindi se hai effettuato l'accesso possono essere salvate nella cronologia di ricerca di quell'account. Le parole chiave di ricerca sono scritte dal modello a partire dalla tua domanda.

**Cosa richiede il tuo *Consenti*.** Queste azioni mostrano una scheda nel pannello laterale e non vengono eseguite finché non premi *Consenti*. La scheda vive nella pagina dell'estensione stessa, che un sito web non può cliccare al posto tuo:

- clic e invii di moduli che sembrano irreversibili: il testo visibile del pulsante, `aria-label`, title o value suona come pagare, comprare, ordinare, eliminare, inviare, pubblicare, autorizzare, salvare, condividere, installare e simili (in tutte le 15 lingue dell'interfaccia); un modulo con più campi o con un campo password; un pulsante solo icona dentro un modulo; premere Invio in un campo che non fa parte di un modulo (caselle di chat). Se il testo visibile di un pulsante e il suo `aria-label` non coincidono, la scheda ti avvisa;
- andare su un altro sito nella tua scheda, navigando o cliccando un link, a meno che non sia il sito da cui è iniziata l'attività, uno che hai nominato nel messaggio o uno che hai già consentito in questa attività. Quando la conversazione contiene contenuto web o file, chiede anche prima di andare a qualsiasi indirizzo che ha costruito lui stesso, anche su quei siti; senza chiedere passano solo gli indirizzi esatti presenti nel tuo messaggio, nei risultati di ricerca o nelle pagine che ha letto;
- leggere in background una pagina il cui indirizzo è stato costruito dall'agente stesso. Senza chiedere, legge solo indirizzi esatti dai risultati di ricerca, link nelle pagine che ha già letto, indirizzi presenti nel tuo messaggio e siti di ricerca (GitHub, npm). Le pagine su `localhost` o sulla tua rete locale non vengono lette a meno che tu non abbia digitato l'indirizzo; per le pagine aperte in una scheda in background questo copre anche i domini pubblici che si risolvono in un indirizzo locale (per i PDF viene controllato solo l'indirizzo stesso);
- digitare in una pagina un testo che non proviene dal tuo messaggio, quando la conversazione contiene contenuto web o file (una pagina può leggere ciò che viene digitato nei suoi campi anche senza che venga inviato nulla);
- salvare o eliminare un ricordo quando la conversazione contiene contenuto web o file (una pagina letta, un PDF, una selezione, un file del progetto o un allegato).

**I file contano come contenuto web.** I file che carichi in un progetto o alleghi a un messaggio spesso vengono dal web, quindi i loro nomi e contenuti sono trattati come non attendibili: una volta che l'agente ne legge uno, le schede qui sopra valgono per il resto dell'attività, e le istruzioni dentro un file non vengono seguite come se fossero tue. I nomi dei file non vengono inseriti nelle istruzioni del modello.

Le schede che riguardano un indirizzo lo mostrano con la sua query string, perché un indirizzo può portare dati all'esterno; gli indirizzi molto lunghi vengono accorciati, mantenendo il dominio e l'inizio della query string.

Cliccare un suggerimento lo invia subito. I suggerimenti generati dalla pagina vengono scritti dopo aver letto il suo contenuto, quindi una pagina può influenzarli: i siti che menzionano non contano come siti che hai nominato tu, e ciò che innescano passa comunque dalle stesse schede. I link nelle risposte mostrano il loro dominio reale accanto al testo; l'elenco delle fonti mostra il dominio di ciascuna fonte.

**Output e file.** Le risposte del modello vengono rese con DOMPurify. Immagini, media, SVG, iframe, moduli e stili inline vengono rimossi, così una pagina non può indurre il modello a far trapelare la tua conversazione tramite l'URL di un'immagine. I file generati sono solo formati di testo semplice (`csv`, `json`, `md`, …), e le celle CSV/TSV che iniziano come una formula di foglio di calcolo vengono neutralizzate.

### Limiti noti

- **La prompt injection non è risolta.** L'agente legge molte pagine non attendibili con la tua sessione con accesso effettuato. Una pagina malevola può cercare di indurlo a inviare da qualche parte la tua conversazione, i tuoi ricordi o dati di altri siti, oppure a fare cose al posto tuo. Le schede coprono le azioni ad alto rischio descritte sopra; non sono una protezione completa. Piccole quantità di dati possono comunque trapelare attraverso i link che l'agente sceglie di seguire o ciò che cerca.
- Non fare ricerche né eseguire attività su pagine non attendibili mentre sono aperte schede della tua banca, della posta o dell'amministrazione aziendale, e tienilo d'occhio mentre un'attività è in corso.
- Il rilevamento dei clic rischiosi è un'euristica basata su parole chiave e forma del modulo. Gli sfuggirà qualche pulsante.
- Digitare le tue parole (quelle del tuo messaggio) in un campo non chiede conferma. Una pagina malevola può leggere ciò che l'agente digita (per esempio con un listener `input`) e inviarlo al proprio server.
- Le skill importate e installate sono istruzioni di terze parti. Finché una è nella tua lista di skill (o la richiami con `/name`), ogni attività è considerata non attendibile: salvare un ricordo, aprire un link costruito dall'agente o digitare un testo che non hai fornito tu chiede prima conferma. Queste skill mostrano l'etichetta *Di terze parti* nell'elenco. Le skill che scrivi tu sono attendibili. Le skill aggiunte prima di questa versione non hanno un'origine registrata, quindi sono trattate anch'esse come di terze parti; se ne hai scritta una tu, aprila e scegli **L'ho scritta io**. Installa solo skill da fonti di cui ti fidi.
- Ricordi, progetti (inclusi i loro file) e conversazioni sono memorizzati non cifrati nel tuo browser. I ricordi e le istruzioni dei progetti vengono inviati al modello a ogni richiesta (tramite Browser Agent Cloud, o al tuo provider).

## Lingue

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. La lingua predefinita segue il tuo browser; cambiala in **Impostazioni → Lingua**. Il modello risponde nella lingua della tua interfaccia, a meno che tu non scriva in un'altra.

## Sviluppo

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

Il pannello laterale è React + TypeScript impacchettato da esbuild in `extension/`. `src/agent.ts` esegue il ciclo dell'agente nel pannello laterale: in modalità Cloud chiama l'API di Browser Agent Cloud (compatibile con Anthropic, indirizzo impostato da `BA_BACKEND` in fase di build) con l'SDK ufficiale; con la tua chiave chiama Anthropic direttamente o qualsiasi API compatibile con OpenAI tramite `src/providers.ts`. Gli strumenti in `src/tools.ts` vengono eseguiti nella scheda attiva o in schede in background con `chrome.scripting`; `src/elements.ts` costruisce l'elenco numerato degli elementi e il controllo delle azioni irreversibili. La suite e2e non richiede chiavi API, non costa nulla e non fa richieste al vero internet.

A cosa serve ciascun file è descritto nella tabella di [Development](README.md#development) della versione inglese.

Per aggiungere uno strumento: aggiungi il suo schema a `tools` in `src/shared.ts` e un `case` in `runTool` in `src/tools.ts`.

### Tradurre

Copia `src/i18n/locales/en.ts` in, per esempio, `nl.ts`, dichiaralo come `const nl: Dict = { … }`, traduci i valori (mantieni ogni `{placeholder}`) e aggiungilo a `LANGS` e ai loader in `src/i18n/index.ts`. `npm run typecheck` fallisce se manca o c'è una chiave in più; `npm run check` fallisce se un placeholder non corrisponde. I prompt e le descrizioni degli strumenti inviati al modello restano volutamente in una sola lingua. Per nome e descrizione nel Chrome Web Store, aggiungi `extension/_locales/<code>/messages.json` (Chrome usa i trattini bassi, per esempio `pt_BR`).

## Contribuire

Issue e PR sono benvenute — vedi [CONTRIBUTING.md](CONTRIBUTING.md). Tieni le PR piccole, esegui i tre controlli sopra e spiega come hai testato ciò che non coprono.

## Licenza

L'estensione è con licenza [MIT](LICENSE). Browser Agent Cloud, il servizio ospitato facoltativo dietro la modalità predefinita, è gestito separatamente e non fa parte di questo repository. Browser Agent è un progetto indipendente, non affiliato ad Anthropic, OpenAI o Google.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
