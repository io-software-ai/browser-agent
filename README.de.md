<div align="center">

<img src="docs/logo.svg" width="72" alt="Browser-Agent-Logo">

# Browser Agent

**Ein KI-Agent in Ihrem Browser, der direkt auf der Website arbeitet, die Sie gerade ansehen. Er liest die Seite, klickt, tippt und wechselt für Sie zwischen Seiten – und wenn eine Seite nicht reicht, recherchiert er im ganzen Web und antwortet mit Quellen.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · Deutsch · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Ein Absatz wird ausgewählt und mit /explain erklärt, Laptop-Preise werden in einer CSV verglichen, dann fragt der Agent vor dem Klick auf Place order nach und der Nutzer lehnt ab">

</div>

## Warum

- **Er arbeitet auf der Seite, auf der Sie ohnehin gerade sind.** Fragen Sie in normalen Worten: Fasse das zusammen, übertrage die Preise in eine Tabelle, fülle dieses Formular aus, finde die Einstellung zum Kündigen. Er liest die Seite und handelt darauf, ohne Copy-and-paste in einen Chat-Tab.
- **Er sieht die Seite so, wie die Website sie gebaut hat.** Das Modell bekommt den Seitentext und eine nummerierte Liste von Schaltflächen, Links und Feldern und klickt `ref: 12`, statt anhand eines Screenshots zu raten. Markieren Sie einen Absatz, um nur danach zu fragen; PDFs funktionieren ebenfalls.
- **Er kann recherchieren, mit Quellen.** Steht die Antwort nicht auf dieser Seite, sucht er mit Ihrem eigenen Browser, liest eine Handvoll Seiten, vergleicht sie und antwortet mit `[n]`-Zitaten, die zu den einzelnen Quellen verlinken.
- **Riskante Aktionen warten auf Sie.** Klicks und Formularabsendungen, die unumkehrbar wirken, sowie Seiten unter Adressen, die der Agent sich selbst ausgedacht hat, halten an, bis Sie *Erlauben* drücken. Diese Prüfung wird vom Code der Erweiterung durchgesetzt, nicht dadurch, dass man das Modell höflich bittet.
- **Kostenlos starten oder den eigenen Schlüssel mitbringen.** Von Haus aus läuft er über Browser Agent Cloud, mit kostenlosen Guthaben pro Monat und ohne Registrierung. Lieber den eigenen Anbieter? Wechseln Sie in den Einstellungen zu Ihrem eigenen API-Schlüssel, dann gehen die Anfragen direkt von Ihrem Browser an diesen Anbieter.

## Funktionen

**Auf der Seite handeln**
- Werkzeuge: Seite lesen, klicken, tippen (auch `<select>`-Dropdowns), scrollen, eine URL öffnen. Das Modell bekommt eine nummerierte Liste interaktiver Elemente und klickt `ref: 12`, statt CSS-Selektoren zu erraten.
- Markieren Sie Text auf der Seite und fragen Sie nur danach; die Markierung wird Ihrer Nachricht statt des ganzen Tabs angehängt.
- Dateien an eine Nachricht anhängen: Textdateien, Code oder PDFs per Drag-and-drop hineinziehen, einfügen oder auswählen; ihr Text wird zusammen mit dem gesendet, was Sie tippen.
- PDFs: Der Text wird mit pdf.js extrahiert. Ein integrierter Viewer erlaubt es, Text in einem PDF wie auf jeder Seite zu markieren. Gescannte PDFs (ohne Textebene) können als Dokument an Claude geschickt werden, nachdem Sie die Kosten bestätigt haben.
- Startbildschirm: Vorschläge passend zur aktuellen Seite.

**Recherche im ganzen Web**
- Sucht und liest Seiten in Hintergrund-Tabs Ihres eigenen Browsers; Seiten, bei denen Sie angemeldet sind, funktionieren ebenfalls, und Ihr aktueller Tab bleibt unberührt.
- Jede Seite wird auf das verdichtet, was für Ihre Frage zählt; Quellen sind nummeriert, `[n]`-Zitate sind anklickbar, und die Quellen werden mit der Unterhaltung gespeichert und beim Export mitgegeben.
- Folgt Links aus den gelesenen Seiten ohne Nachfrage und geht, solange noch nichts gelesen wurde, auch direkt zu Recherche-Seiten wie GitHub und npm; bei anderen Adressen wird zuerst gefragt.

**In der Unterhaltung**
- Antworten in Markdown als Stream, mit Tabellen und Codeblöcken sowie ausklappbaren Denk-Zusammenfassungen.
- Fragekarten (`ask_user`): Braucht das Modell eine Entscheidung, fragt es mit anklickbaren Optionen, statt zu raten.
- Dateikarten: Ergebnisse als herunterladbare `csv`-, `json`-, `md`-, `txt`-, `tsv`-, `xml`-, `yaml`-, `ics`- oder `vcf`-Dateien, mit Kopieren und Vorschau.

**Bleibt bei Ihnen**
- Projekte: Geben Sie einem Projekt eigene Anweisungen, Dateien und ein eigenes Gedächtnis und legen Sie fest, welche Skills es verwendet. Jeder Chat im Projekt beginnt mit dessen Anweisungen; der Agent öffnet Projektdateien nur, wenn er sie braucht.
- Verknüpfen Sie ein Projekt mit einem GitHub-Repository, und es funktioniert wie Claude Code: Der Agent liest die Dateien des Repositorys und committet Dateien, die Sie genehmigen, Änderung für Änderung. Er richtet sich nach den Konventionen in der `CLAUDE.md` oder `AGENTS.md` des Repositorys, und das Gedächtnis des Projekts wird im Repository gespeichert.
- Gedächtnis: Sagen Sie „merke dir …“, und er behält kurze Fakten über Sie über Chats hinweg. Ansehen, bearbeiten oder abschalten können Sie es in den Einstellungen.
- Verlauf: die letzten 30 Unterhaltungen jedes Projekts, nach Datum gruppiert. Öffnen Sie eine erneut und machen Sie weiter, oder exportieren Sie sie als Markdown.
- 12 integrierte Skills und `/`-Befehle; schreiben Sie eigene oder installieren Sie [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, das Format von Claude Code) von GitHub, skills.sh oder ClawHub.
- Oberfläche in 15 Sprachen; helles und dunkles Design folgen Ihrem System.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Anbieterauswahl: Anthropic, OpenAI, Google Gemini, OpenRouter, Benutzerdefiniert (OpenAI-kompatibel)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Die Eingabe von / öffnet das Skill-Menü"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Eine Fragekarte mit drei Optionen, eine davon empfohlen"></td>
  </tr>
  <tr>
    <td align="center">Oder nutzen Sie Ihren eigenen Anbieter</td>
    <td align="center">Mit <code>/</code> Skills aufrufen</td>
    <td align="center">Er fragt, statt zu raten</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Integrierter PDF-Viewer mit einem ausgewählten Satz, und die Seitenleiste erklärt ihn">

## So funktioniert die Recherche

Stellen Sie eine Frage, die die aktuelle Seite nicht beantworten kann („Welche React-State-Bibliothek sollte ich 2026 verwenden?"), und der Agent recherchiert:

1. **Suchen.** Er öffnet eine Suche in einem Hintergrund-Tab (Google; verlangt Google den Nachweis, dass Sie ein Mensch sind, wechselt er zu Bing), liest Titel, Links und Textauszüge und schließt den Tab wieder. Nur wenn beide eine Überprüfung verlangen, kommt der Such-Tab in den Vordergrund, damit Sie sie lösen können; danach läuft die Recherche von selbst weiter.
2. **Lesen.** Er öffnet die relevantesten Ergebnisse in Hintergrund-Tabs – bis zu vier gleichzeitig – und extrahiert den Haupttext. Ihr aktueller Tab wird nie angerührt.
3. **Verdichten.** Jede Seite wird von einem kleinen, schnellen Modell (Claude Haiku) auf die Punkte, Zitate und Daten reduziert, die für Ihre Frage zählen, damit zwanzig Seiten weder die Unterhaltung noch Ihre Rechnung fluten.
4. **Antworten.** Sie bekommen zuerst das Fazit, dann eine Vergleichstabelle, eine begründete Empfehlung und das, was die Quellen offenließen. Suchergebnisse und gelesene Seiten sind nummeriert: `[n]` in der Antwort ist ein Link, und die zitierten Quellen stehen unter der Antwort.

Jeden Schritt sehen Sie in der Seitenleiste und können jederzeit auf Stopp drücken. Eine Aufgabe macht höchstens 40 Schritte und liest höchstens 30 Seiten.

## Schnellstart

Erfordert Chrome 122+.

1. Installieren Sie **[Browser Agent aus dem Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — klicken Sie auf **Hinzufügen**. Es aktualisiert sich von selbst.
2. Klicken Sie auf das Symbol in der Symbolleiste, um die Seitenleiste zu öffnen (nicht zu sehen? Über das Puzzleteil-Symbol anheften), und stimmen Sie dem kurzen Datenhinweis zu.
3. Fragen Sie zur Seite, auf der Sie gerade sind – oder bitten Sie um eine Recherche. Kein Schlüssel und kein Konto nötig.

### Aus einem Release-Zip installieren

Releases können der Store-Version voraus sein, während eine neue Version auf ihre Überprüfung wartet. Kein Node.js oder Build-Schritt nötig.

1. Laden Sie `browser-agent-<version>.zip` vom [neuesten Release](https://github.com/io-software-ai/browser-agent/releases/latest) herunter und entpacken Sie es.
2. Öffnen Sie `chrome://extensions` und aktivieren Sie oben rechts den **Entwicklermodus**.
3. Klicken Sie auf **Entpackte Erweiterung laden** und wählen Sie den entpackten Ordner, und fahren Sie dann bei Schritt 2 oben fort.

Zum Aktualisieren laden Sie das neue Zip herunter, ersetzen den Inhalt desselben Ordners und klicken auf das Neuladen-Symbol auf der Erweiterungskarte. Ihre Einstellungen, Chats und Erinnerungen bleiben erhalten. Wird die Erweiterung aus einem anderen Ordner geladen, entsteht eine separate Kopie, die leer startet – ebenso bei der Store-Version.

### Aus dem Quellcode bauen

Sie brauchen Node.js 22+.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Laden Sie anschließend den Ordner `extension/` wie in Schritt 3 mit **Entpackte Erweiterung laden**. Ein aus dem Quellcode gebauter Stand spricht mit einem Browser-Agent-Cloud-Server unter `http://localhost:4410`, sofern Sie beim Bauen nicht `BA_BACKEND` setzen. Verwenden Sie also Ihren eigenen API-Schlüssel (siehe unten) oder zeigen Sie auf ein Backend, das Sie selbst betreiben.

## Zwei Arten, ihn zu nutzen

| | Browser Agent Cloud (Standard) | Eigener API-Schlüssel |
|---|---|---|
| Einrichtung | Keine – funktioniert direkt nach der Installation | **Einstellungen → Eigenen API-Schlüssel verwenden (erweitert)**, dann Schlüssel oder lokalen Endpunkt einfügen |
| Konto | Keines; bei der Installation wird eine anonyme Geräte-ID erzeugt | Keines |
| Modelle | Claude Sonnet, Opus und Haiku (5.5) | Was Ihr Anbieter bietet |
| Kosten | Kostenlose Guthaben pro Monat; kostenpflichtige Tarife für mehr (Bezahlung über Paddle) | Abrechnung durch Ihren Anbieter; die Erweiterung ist kostenlos |
| Wohin die Anfragen gehen | Über den Browser-Agent-Cloud-Server zum Modellanbieter | Direkt von Ihrem Browser zu Ihrem Anbieter |

**Guthaben.** Im Cloud-Modus verbraucht jede Aufgabe (eine von Ihnen gesendete Nachricht, bis der Agent anhält) eine feste Zahl an Guthaben, die vom Modell, der Denktiefe und davon abhängt, wie viel jeder Seite gelesen wird. Die Seitenleiste zeigt die Schätzung vor dem Senden und das verbleibende Guthaben nach jeder Aufgabe. Ist es aufgebraucht, pausieren Aufgaben bis zum nächsten Monat oder bis Sie upgraden.

**Eigener Schlüssel.** Diese Anbieter funktionieren; wählen Sie ein Modell mit Tool-Calling-Unterstützung, sonst kann der Agent nicht auf der Seite handeln.

| Anbieter | Was Sie brauchen | Hinweise |
|---|---|---|
| Anthropic | [API-Schlüssel](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; Denktiefe; Denk-Zusammenfassungen; gescannte PDFs; Recherche-Zusammenfassungen pro Seite |
| OpenAI | [API-Schlüssel](https://platform.openai.com/api-keys) | Die Modellliste wird beim Anbieter abgerufen |
| Google Gemini | [API-Schlüssel](https://aistudio.google.com/apikey) | Nutzt Geminis OpenAI-kompatiblen Endpunkt |
| OpenRouter | [API-Schlüssel](https://openrouter.ai/keys) | Jedes Modell auf OpenRouter mit Tool-Unterstützung |
| Benutzerdefiniert (OpenAI-kompatibel) | Basis-URL, Schlüssel optional | Ollama, LM Studio, vLLM, llama.cpp – alles mit `/chat/completions` |

Bei anderen Anbietern als Anthropic liest die Recherche jede Seite als Rohtext statt als Haiku-Zusammenfassung, was mehr Tokens verbraucht.

Lokale Server blockieren Browser-Erweiterungen standardmäßig:

- **Ollama:** Setzen Sie `OLLAMA_ORIGINS=chrome-extension://*` und starten Sie Ollama neu (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). Basis-URL `http://localhost:11434/v1`.
- **LM Studio:** Starten Sie den Server mit aktiviertem CORS, `lms server start --cors`. Basis-URL `http://localhost:1234/v1`.

## Skills

Tippen Sie `/` ins Eingabefeld, um einen auszuwählen, oder lassen Sie das Modell einen laden, wenn er passt.

| Befehl | Was er tut |
|---|---|
| `/summarize` | Kernaussage in einer Zeile, Kernpunkte und To-dos für die aktuelle Seite |
| `/translate` | Übersetzt die Seite in Ihre Sprache und behält Überschriften und Absätze bei |
| `/extract` | Zieht die Daten der Seite in eine Markdown-Tabelle; bei vielen Daten eine CSV- oder JSON-Datei |
| `/compare` | Erstellt eine Vergleichstabelle für Preise, Tarife oder Spezifikationen und hebt die Unterschiede hervor |
| `/explain` | Erklärt die Seite, einen Begriff oder ein Stück Code in einfachen Worten |
| `/thread` | Fasst einen Kommentarverlauf zusammen: Hauptargumente, jede Seite, Konsens, lesenswerte Kommentare |
| `/reply` | Entwirft eine Antwort auf die E-Mail oder Nachricht auf der Seite; kann das Antwortfeld ausfüllen, sendet aber nie |
| `/fill-form` | Füllt das Formular mit Ihren Angaben aus; fragt nach Fehlendem und hält vor dem Absenden an |
| `/review-pr` | Prüft einen GitHub-Pull-Request und listet Probleme nach Schweregrad mit Datei und Zeile auf |
| `/checklist` | Macht aus einem Tutorial eine Checkliste mit Schritten |
| `/decide` | Legt die Optionen dar, fragt nacheinander nach Ihren Anforderungen und empfiehlt dann eine |
| `/grill-me` | Stellt Ihren Plan (oder den Vorschlag auf der Seite) auf die Probe, mit jeweils einer Multiple-Choice-Frage |

`/clear` startet eine neue Unterhaltung. Für Recherche braucht es keinen Befehl – fragen Sie einfach.

### Eigene schreiben

Ein Skill ist eine Markdown-Datei mit Frontmatter `name` und `description`, gefolgt von Anweisungen:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Skills verwalten Sie unter **Einstellungen → Skills**: erstellen, bearbeiten, exportieren, eine `.md`-, `.zip`-/`.skill`-Datei oder einen ganzen Skill-Ordner importieren oder per Link installieren — `owner/repo/skill`, ein GitHub-Ordnerlink, eine skills.sh-Seite oder deren Befehl `npx skills add …`, eine ClawHub-Seite oder ein beliebiger https-Link auf eine `SKILL.md` oder ein Zip. Skills folgen dem Standard [Agent Skills](https://agentskills.io/specification), demselben `SKILL.md`-Format, das Claude Code und andere Agenten verwenden. Dateien, die einem Skill beiliegen (zum Beispiel `references/forms.md`), werden gespeichert und vom Modell nur gelesen, wenn die Anweisungen darauf verweisen; beigelegte Skripte werden als Text aufbewahrt und nie ausgeführt. Eine optionale Zeile `model:` (zum Beispiel `model: haiku`) führt diesen Skill mit einem günstigeren Claude-Modell aus; `disable-model-invocation: true` und `user-invocable: false` funktionieren wie in Claude Code, und `$ARGUMENTS` wird durch das ersetzt, was Sie nach `/name` eintippen.

Nur Namen und Beschreibungen gelangen in den System-Prompt; das Modell ruft `use_skill` auf, um die vollständigen Anweisungen bei Bedarf zu laden, und die Eingabe von `/name` hängt sie direkt an. Skills sind Prompts – lesen Sie einen, bevor Sie ihn importieren.

## Sicherheit & Datenschutz

**Datenfluss.** Eine Anfrage an das Modell enthält Ihre Nachrichten, den Seiteninhalt, den der Agent gelesen hat (oder nur Ihre Markierung oder das PDF), Zusammenfassungen der recherchierten Seiten, Ihre gespeicherten Erinnerungen und Ihre Skill-Namen. In einem Projekt enthält sie außerdem die Anweisungen und das Gedächtnis des Projekts; Dateien, die Sie an eine Nachricht anhängen, und Projektdateien, die der Agent öffnet, werden ebenfalls gesendet. In einem Projekt, das mit einem GitHub-Repository verknüpft ist, werden außerdem die `CLAUDE.md`, die `AGENTS.md` und die Gedächtnisdatei des Repositorys sowie die Repository-Dateien, die der Agent liest, mit der Anfrage gesendet (im Cloud-Modus über den Browser-Agent-Cloud-Server, mit Ihrem eigenen Schlüssel direkt an Ihren Anbieter); die Verbindung zu GitHub selbst läuft nie über die Server von Browser Agent.

- Der *Cloud-Modus* sendet diese Anfrage an den Browser-Agent-Cloud-Server, der sie an den Modellanbieter weiterleitet und die Antwort zurückstreamt. Der Server führt Nutzungsprotokolle – welches Modell, wie viele Tokens, Seiten, Suchen und Guthaben eine Aufgabe verbraucht hat –, um Guthaben zu zählen. Er speichert weder Ihre Nachrichten noch Seiteninhalte oder Antworten des Modells; gibt der Modellanbieter einen Fehler zurück, kann diese Fehlermeldung zur Fehlersuche zusammen mit dem Nutzungsprotokoll aufbewahrt werden.
- *Ihr eigener Schlüssel* sendet Anfragen direkt von Ihrem Browser an Ihren Anbieter. Nichts über Ihre Aufgaben gelangt zu den Servern von Browser Agent; der einzige Kontakt ist die anonyme Registrierung bei der Installation der Erweiterung.

Ihre Unterhaltungen, Erinnerungen, Skills, Einstellungen und jeder API-Schlüssel werden nur in `chrome.storage.local` gespeichert. Keine Analyse, keine Werbung. Bevor Sie dem Datenhinweis beim ersten Start zustimmen, wird nichts an ein Modell gesendet. Alle Details: [Datenschutzerklärung](store/privacy-policy.md).

**Die Recherche nutzt Ihren Browser.** Hintergrund-Tabs laden Seiten mit Ihren Cookies und angemeldeten Sitzungen, genau als hätten Sie sie selbst geöffnet; PDFs lädt die Erweiterung direkt herunter, ebenfalls mit Ihren Cookies. Suchen sind gewöhnliche Google- (oder Bing-)Suchen aus Ihrem Browser; sind Sie angemeldet, können sie daher im Suchverlauf dieses Kontos gespeichert werden. Die Suchbegriffe formuliert das Modell aus Ihrer Frage.

**Was Ihr *Erlauben* braucht.** Diese Aktionen zeigen eine Karte in der Seitenleiste und laufen erst, wenn Sie *Erlauben* drücken. Die Karte befindet sich auf der eigenen Seite der Erweiterung, die eine Website nicht für Sie anklicken kann:

- Klicks und Formularabsendungen, die unumkehrbar wirken: Der sichtbare Text der Schaltfläche, `aria-label`, title oder value klingt nach bezahlen, kaufen, bestellen, löschen, absenden, senden, veröffentlichen, autorisieren, speichern, teilen, installieren, commit, propose, pull request und Ähnlichem (in allen 15 Oberflächensprachen); ein Formular mit mehreren Feldern oder einem Passwortfeld; eine reine Symbol-Schaltfläche in einem Formular; Enter in einem Feld, das nicht in einem Formular liegt (Chat-Eingaben). Stimmen der sichtbare Text einer Schaltfläche und ihr `aria-label` nicht überein, warnt die Karte;
- der Wechsel zu einer anderen Website in Ihrem Tab, per Navigation oder Klick auf einen Link, es sei denn, es ist die Website, auf der die Aufgabe begann, eine, die Sie in Ihrer Nachricht genannt haben, oder eine, die Sie in dieser Aufgabe bereits erlaubt haben. Sobald die Unterhaltung Webinhalt oder Dateien enthält, wird außerdem nachgefragt, bevor der Agent zu jeder Adresse geht, die er selbst zusammengesetzt hat, auch auf diesen Websites; ohne Nachfrage gehen nur exakte Adressen aus Ihrer Nachricht, aus Suchergebnissen oder aus gelesenen Seiten durch, mit einer Ausnahme: GitHub-Seiten, auf denen sich ein Repository direkt ändern lässt (Seiten zum Anlegen, Bearbeiten, Löschen und Hochladen von Dateien, github.dev, vscode.dev). Vor dem Aufrufen oder Anklicken einer solchen Seite wird immer nachgefragt, auch wenn die Adresse ein Link auf einer gelesenen Seite ist;
- das Lesen einer Seite im Hintergrund, deren Adresse der Agent selbst zusammengesetzt hat. Ohne Nachfrage liest er nur exakte Adressen aus Suchergebnissen, Links auf bereits gelesenen Seiten und Adressen aus Ihrer Nachricht, dazu Recherche-Seiten (GitHub, npm), bis die Unterhaltung Webinhalt oder Dateien enthält. Seiten auf `localhost` oder in Ihrem lokalen Netzwerk werden nicht gelesen, außer Sie haben die Adresse getippt; bei Seiten in einem Hintergrund-Tab gilt das auch für öffentliche Domains, die auf eine lokale Adresse auflösen (bei PDFs wird nur die Adresse selbst geprüft);
- das Eintippen von Text, der nicht aus Ihrer Nachricht stammt, in eine Seite, sobald die Unterhaltung Webinhalt oder Dateien enthält (eine Seite kann mitlesen, was in ihre Felder getippt wird, auch ohne dass etwas abgeschickt wird);
- das Speichern oder Löschen einer Erinnerung, sobald die Unterhaltung Webinhalt oder Dateien enthält (eine gelesene Seite, ein PDF, eine Markierung, eine Projektdatei, eine Datei aus einem verknüpften Repository oder ein Anhang). Liegt das Gedächtnis des Projekts in einem verknüpften Repository, wird bei jedem Speichern oder Löschen gefragt, unabhängig davon, was die Unterhaltung enthält, weil jedes davon ein Commit ist;
- jeder Schreibvorgang in ein verknüpftes GitHub-Repository, unabhängig davon, was die Unterhaltung enthält. Die Karte zeigt den Dateipfad, den Diff (mit Zeilennummern; unter dem Feld steht, wie viele Zeilen Sie noch nicht durchgescrollt haben) und die Commit-Nachricht. Sie warnt, wenn das Repository nicht privat ist oder sich nicht prüfen lässt, ob es privat ist, wenn es privat ist, aber GitHub Pages eingeschaltet hat, wenn das Repository GitHub Actions nutzt (ein Commit kann sofort Workflows starten), wenn die Datei bei Installation, Build oder Test ausgeführt wird (`package.json`, Abhängigkeits- und Lock-Dateien, Git-Hooks, CI-Konfigurationen, `*.config.js`, `scripts/`, `Dockerfile`, …) und wenn der Pfad Zeichen enthält, die nicht zum englischen Alphabet gehören, oder der Inhalt unsichtbare Zeichen enthält. Unsichtbare Zeichen erscheinen im Diff als ⟦U+…⟧ (die, die Emoji selbst verwenden, zählen nicht) und werden aus Commit-Nachrichten entfernt. Ein einzelner Schreibvorgang kann höchstens 1.000 Zeilen oder 100.000 Zeichen (Hinzugefügtes und Entferntes zusammen) ändern.

**Dateien zählen als Webinhalt.** Dateien, die Sie in ein Projekt hochladen oder an eine Nachricht anhängen, stammen oft aus dem Web; deshalb gelten ihre Namen und Inhalte als nicht vertrauenswürdig: Sobald der Agent eine gelesen hat, gelten die Karten oben für den Rest der Aufgabe, und Anweisungen in einer Datei werden nicht als Ihre befolgt. Dateinamen werden nicht in die Anweisungen an das Modell aufgenommen. Dateien in einem verknüpften GitHub-Repository werden genauso behandelt. `CLAUDE.md`, `AGENTS.md` und die Gedächtnisdatei (`.browser-agent/memory.md`) des Repositorys werden dem Agenten zu Beginn jeder Aufgabe übergeben, und er richtet sich nach den Konventionen darin. Aber sie zählen ebenfalls als Webinhalt, egal wer sie geschrieben hat: Sie können nichts an Ihrer Stelle genehmigen, und sobald eine davon geladen wird oder das Repository zu Beginn einer Aufgabe nicht gelesen werden kann (Autorisierung abgelaufen, Zeitüberschreitung), gelten die Karten oben von Beginn der Aufgabe an. Ob das Repository privat ist oder wer sonst darin schreiben darf, macht keinen Unterschied.

**Schreiben in ein verknüpftes Repository.** Der Agent kann keine Dateien schreiben, die KI-Agenten anweisen (`CLAUDE.md`, `AGENTS.md`, `AGENT.md`, `GEMINI.md`, `opencode.json` und Ähnliches, auf jeder Ebene). Von den Dateien und Ordnern, deren Name mit einem Punkt beginnt (auf jeder Ebene), darf er nur eine kurze Positivliste gängiger schreiben, etwa `.gitignore`, `.editorconfig`, Lint- und Formatierer-Einstellungen, `.nvmrc`, `.env.example`, `.changeset/`, `.vitepress/` und `.storybook/`. Alles andere ist tabu, darunter `.github/`, `.npmrc`, `.husky/`, `.devcontainer.json` und die Einstellungen von KI-Agenten und Editoren, weil ständig neue Werkzeuge auftauchen und viele dieser Dateien ein Werkzeug Befehle ausführen lassen können. Diese ändern Sie selbst auf GitHub. Das Gedächtnis des Projekts im Repository ändert der Agent nur über die Gedächtnisfunktion: Jedes Speichern oder Löschen ist ein eigener Commit mit der festen Nachricht `Browser Agent: update memory` (der Gedächtnistext erscheint also nie in der Commit-Liste), der nur diese eine Zeile hinzufügt oder entfernt und den Rest der Datei unverändert lässt. Inhalt mit bidirektionalen Steuerzeichen, einem einzelnen Wagenrücklauf (CR) oder anderen ungewöhnlichen Zeilenumbruch- oder Steuerzeichen (Tabs und normale Zeilenumbrüche sind in Ordnung) wird abgelehnt, weil die Karte dann etwas anderes zeigen könnte, als committet wird. Eine bestehende Datei wird nur geändert, wenn sie UTF-8-Text ist; BOM und CRLF-Zeilenenden bleiben erhalten, und eine Datei mit gemischten Zeilenenden lässt sich nicht als Ganzes neu schreiben. Symlinks können weder gelesen noch geschrieben werden.

**GitHub-Zugriff.** *Trennen* unter **Einstellungen → GitHub** löscht die GitHub-Token der Erweiterung von Ihrem Computer und widerruft sie bei GitHub. Bestätigt GitHub den Widerruf nicht, werden Sie darauf hingewiesen und können die App selbst in den GitHub-Einstellungen widerrufen. Läuft die Autorisierung ab oder wird sie widerrufen, bieten die Projektseite und die Einstellungen an, die Verbindung neu herzustellen.

Karten, die eine Adresse betreffen, zeigen sie mit ihrer Query-String, weil eine Adresse Daten nach außen tragen kann; sehr lange Adressen werden gekürzt, wobei die Domain und der Anfang der Query-String erhalten bleiben.

Ein Klick auf einen Vorschlag sendet ihn sofort. Aus der Seite erzeugte Vorschläge werden nach dem Lesen des Seiteninhalts verfasst, eine Seite kann sie also beeinflussen: Die dort genannten Websites zählen nicht als von Ihnen genannte Websites, und was sie auslösen, läuft weiterhin über dieselben Karten. Links in Antworten zeigen neben dem Text ihre echte Domain; die Quellenliste zeigt die Domain jeder Quelle.

**Ausgabe und Dateien.** Antworten des Modells werden mit DOMPurify gerendert. Bilder, Medien, SVG, iframes, Formulare und Inline-Styles werden entfernt, damit eine Seite das Modell nicht dazu bringen kann, Ihre Unterhaltung über eine Bild-URL preiszugeben. Erzeugte Dateien sind ausschließlich Klartextformate (`csv`, `json`, `md`, …), und CSV/TSV-Zellen, die wie eine Tabellenkalkulationsformel beginnen, werden entschärft.

### Bekannte Einschränkungen

- **Prompt-Injection ist nicht gelöst.** Der Agent liest viele nicht vertrauenswürdige Seiten mit Ihrer angemeldeten Sitzung. Eine bösartige Seite kann versuchen, ihn dazu zu bringen, Ihre Unterhaltung, Ihre Erinnerungen oder Daten anderer Websites irgendwohin zu senden oder Dinge in Ihrem Namen zu tun. Die Karten decken die oben genannten Aktionen mit hohem Risiko ab; sie sind kein vollständiger Schutz. Kleine Datenmengen können weiterhin darüber abfließen, welchen Links der Agent folgt oder wonach er sucht.
- Recherchieren Sie nicht und führen Sie keine Aufgaben auf nicht vertrauenswürdigen Seiten aus, solange Tabs mit Ihrer Bank, Ihrem E-Mail-Postfach oder der Firmenverwaltung geöffnet sind, und behalten Sie ihn im Auge, solange eine Aufgabe läuft.
- Die Erkennung riskanter Klicks ist eine Heuristik aus Schlüsselwörtern und Formularform. Manche Schaltflächen entgehen ihr.
- Das Tippen Ihrer eigenen Worte (aus Ihrer Nachricht) in ein Feld löst keine Nachfrage aus. Eine bösartige Seite kann mitlesen, was der Agent tippt (zum Beispiel mit einem `input`-Listener), und es an ihren eigenen Server senden.
- Importierte und installierte Skills sind Anweisungen von Dritten. Solange einer in Ihrer Skill-Liste steht (oder Sie ihn mit `/name` aufrufen), gilt jede Aufgabe als nicht vertrauenswürdig: Eine Erinnerung zu speichern, einen vom Agenten zusammengebauten Link zu öffnen oder Text einzutippen, den Sie nicht vorgegeben haben, fragt zuerst nach. Diese Skills tragen in der Liste das Label *Drittanbieter*. Selbst geschriebene Skills sind vertrauenswürdig. Skills, die vor dieser Version hinzugefügt wurden, haben keine gespeicherte Quelle und gelten daher ebenfalls als Drittanbieter; wenn Sie einen selbst geschrieben haben, öffnen Sie ihn und wählen Sie **Das habe ich selbst geschrieben**. Installieren Sie nur Skills aus Quellen, denen Sie vertrauen.
- Erinnerungen, Projekte (einschließlich ihrer Dateien) und Unterhaltungen werden unverschlüsselt in Ihrem Browser gespeichert. Erinnerungen und Projektanweisungen werden mit jeder Anfrage an das Modell gesendet (über Browser Agent Cloud oder an Ihren eigenen Anbieter).

## Sprachen

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. Die Standardsprache folgt Ihrem Browser; ändern Sie sie unter **Einstellungen → Sprache**. Das Modell antwortet in der Sprache Ihrer Oberfläche, es sei denn, Sie schreiben in einer anderen.

## Entwicklung

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

Die Seitenleiste ist React + TypeScript, von esbuild nach `extension/` gebündelt. `src/agent.ts` führt die Agentenschleife in der Seitenleiste aus: Im Cloud-Modus ruft sie mit dem offiziellen SDK die Browser-Agent-Cloud-API auf (Anthropic-kompatibel, Adresse beim Build über `BA_BACKEND` gesetzt); mit Ihrem eigenen Schlüssel ruft sie Anthropic direkt oder jede OpenAI-kompatible API über `src/providers.ts` auf. Die Werkzeuge in `src/tools.ts` laufen mit `chrome.scripting` im aktiven Tab oder in Hintergrund-Tabs; `src/elements.ts` erstellt die nummerierte Elementliste und die Prüfung auf unumkehrbare Aktionen. Die e2e-Suite braucht keinen API-Schlüssel, kostet nichts und sendet keine Anfragen ins echte Internet.

Wofür die einzelnen Dateien da sind, steht in der Tabelle unter [Development](README.md#development) in der englischen Fassung.

Um ein Werkzeug hinzuzufügen: Ergänzen Sie sein Schema in `tools` in `src/shared.ts` und einen `case` in `runTool` in `src/tools.ts`.

### Übersetzen

Kopieren Sie `src/i18n/locales/en.ts` z. B. nach `nl.ts`, deklarieren Sie es als `const nl: Dict = { … }`, übersetzen Sie die Werte (jeden `{placeholder}` beibehalten) und fügen Sie es zu `LANGS` und den Loadern in `src/i18n/index.ts` hinzu. `npm run typecheck` schlägt bei einem fehlenden oder zusätzlichen Schlüssel fehl; `npm run check` schlägt bei einem nicht übereinstimmenden Platzhalter fehl. Prompts und Werkzeugbeschreibungen, die an das Modell gesendet werden, bleiben absichtlich in einer Sprache. Für Name und Beschreibung im Chrome Web Store fügen Sie `extension/_locales/<code>/messages.json` hinzu (Chrome nutzt Unterstriche, z. B. `pt_BR`).

## Mitwirken

Issues und PRs sind willkommen – siehe [CONTRIBUTING.md](CONTRIBUTING.md). Halten Sie PRs klein, führen Sie die drei Prüfungen oben aus und schreiben Sie dazu, wie Sie alles getestet haben, was diese nicht abdecken.

## Lizenz

Die Erweiterung steht unter der [MIT](LICENSE)-Lizenz. Browser Agent Cloud, der optionale gehostete Dienst hinter dem Standardmodus, wird separat betrieben und ist nicht Teil dieses Repositorys. Browser Agent ist ein unabhängiges Projekt und nicht mit Anthropic, OpenAI oder Google verbunden.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
