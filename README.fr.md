<div align="center">

<img src="docs/logo.svg" width="72" alt="Logo de Browser Agent">

# Browser Agent

**Un agent IA dans votre navigateur qui travaille directement sur le site que vous consultez. Il lit la page, clique, saisit et passe d'une page à l'autre à votre place — et quand une page ne suffit pas, il fait des recherches sur le web et répond avec des sources.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · Français · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Sélection d'un paragraphe puis /explain pour l'expliquer, comparaison de prix d'ordinateurs portables dans un CSV, puis l'agent demande confirmation avant de cliquer sur Place order et l'utilisateur refuse">

</div>

## Pourquoi

- **Il travaille sur la page où vous êtes déjà.** Demandez avec vos mots : résume ceci, mets les prix dans un tableau, remplis ce formulaire, trouve le réglage d'annulation. Il lit la page et agit dessus, sans copier-coller dans un onglet de discussion.
- **Il voit la page telle que le site l'a construite.** Le modèle reçoit le texte de la page et une liste numérotée de boutons, de liens et de champs, et clique sur `ref: 12` au lieu de deviner à partir d'une capture d'écran. Sélectionnez un paragraphe pour ne poser de question que sur lui ; les PDF fonctionnent aussi.
- **Il sait faire des recherches, avec des sources.** Quand la réponse n'est pas sur cette page, il cherche avec votre propre navigateur, lit quelques pages, les compare et répond avec des citations `[n]` qui renvoient à chaque source.
- **Les actions risquées attendent votre feu vert.** Les clics et envois de formulaire qui semblent irréversibles, ainsi que les pages dont l'adresse a été inventée par l'agent lui-même, restent bloqués jusqu'à ce que vous appuyiez sur *Autoriser*. Cette vérification est appliquée par le code de l'extension, pas en demandant gentiment au modèle.
- **Démarrez gratuitement, ou apportez votre propre clé.** Dès l'installation, il fonctionne avec Browser Agent Cloud, avec des crédits mensuels gratuits et sans inscription. Vous préférez votre propre fournisseur ? Passez à votre propre clé API dans les Paramètres et les requêtes partent directement de votre navigateur vers ce fournisseur.

## Fonctionnalités

**Agir sur la page**
- Outils : lire la page, cliquer, saisir (y compris les listes déroulantes `<select>`), faire défiler, ouvrir une URL. Le modèle reçoit une liste numérotée d'éléments interactifs et clique sur `ref: 12` au lieu de deviner des sélecteurs CSS.
- Sélectionnez du texte sur la page et ne posez de question que sur cela ; la sélection est jointe à votre message à la place de tout l'onglet.
- Joindre des fichiers à un message : déposez, collez ou choisissez des fichiers texte, du code ou des PDF, et leur texte part avec ce que vous saisissez.
- PDF : le texte est extrait avec pdf.js. Une visionneuse intégrée vous permet de sélectionner du texte dans un PDF comme sur n'importe quelle page. Les PDF numérisés (sans couche de texte) peuvent être envoyés à Claude comme document, après que vous avez confirmé le coût.
- Écran d'accueil : des suggestions basées sur la page où vous êtes.

**Rechercher sur le web**
- Cherche et lit des pages dans des onglets en arrière-plan de votre propre navigateur ; les pages où vous êtes connecté fonctionnent aussi, et votre onglet actuel n'est pas touché.
- Chaque page est condensée en ce qui compte pour votre question ; les sources sont numérotées, les citations `[n]` sont cliquables, et les sources sont enregistrées avec la conversation et incluses lorsque vous l'exportez.
- Suit les liens des pages qu'il a lues et va directement sur des sites de recherche comme GitHub et npm ; pour les autres adresses, il demande d'abord.

**Dans la conversation**
- Réponses en Markdown en streaming, avec tableaux et blocs de code, ainsi que des résumés de réflexion repliables.
- Cartes de questions (`ask_user`) : quand le modèle a besoin d'une décision, il la demande avec des options cliquables au lieu de deviner.
- Cartes de fichiers : les résultats sous forme de fichiers téléchargeables `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics` ou `vcf`, avec copie et aperçu.

**À vous de garder**
- Projets : donnez à un projet ses propres instructions, fichiers et mémoire, et choisissez les compétences qu'il utilise. Chaque conversation du projet commence avec ses instructions ; l'agent n'ouvre les fichiers du projet que lorsqu'il en a besoin.
- Mémoire : dites « souviens-toi … » et il retient de courts faits sur vous d'une discussion à l'autre. Consultez-la, modifiez-la ou désactivez-la dans les Paramètres.
- Historique : les 30 dernières conversations de chaque projet, regroupées par date. Rouvrez-en une et continuez, ou exportez-la en Markdown.
- 12 compétences intégrées et commandes `/` ; écrivez les vôtres ou installez des [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, le format utilisé par Claude Code) depuis GitHub, skills.sh ou ClawHub.
- Interface en 15 langues ; le thème clair ou sombre suit celui de votre système.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Sélecteur de fournisseur : Anthropic, OpenAI, Google Gemini, OpenRouter, Personnalisé (compatible OpenAI)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Taper / ouvre le menu des compétences"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Une carte de question avec trois options, dont une recommandée"></td>
  </tr>
  <tr>
    <td align="center">Ou utilisez votre propre fournisseur</td>
    <td align="center">Tapez <code>/</code> pour les compétences</td>
    <td align="center">Il demande au lieu de deviner</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Visionneuse PDF intégrée avec une phrase sélectionnée, et le panneau latéral qui l'explique">

## Comment fonctionne la recherche

Posez une question à laquelle la page actuelle ne peut pas répondre (« quelle bibliothèque d'état React utiliser en 2026 ? ») et l'agent mène l'enquête :

1. **Chercher.** Il ouvre une recherche dans un onglet en arrière-plan (Google ; si Google demande de prouver que vous êtes humain, il passe à Bing), lit les titres, liens et extraits, puis ferme l'onglet. Ce n'est que si les deux demandent une vérification que l'onglet de recherche passe au premier plan pour que vous la résolviez ; la recherche reprend ensuite d'elle-même.
2. **Lire.** Il ouvre les résultats les plus pertinents dans des onglets en arrière-plan (jusqu'à quatre à la fois) et en extrait le texte principal. Votre onglet actuel n'est jamais touché.
3. **Condenser.** Chaque page est réduite par un petit modèle rapide (Claude Haiku) aux points, citations et dates qui comptent pour votre question, pour que vingt pages n'inondent ni la conversation ni votre facture.
4. **Répondre.** Vous obtenez d'abord la conclusion, puis un tableau comparatif, une recommandation argumentée et ce que les sources n'ont pas tranché. Les résultats de recherche et les pages lues sont numérotés : `[n]` dans la réponse est un lien, et les sources citées sont listées sous la réponse.

Vous pouvez suivre chaque étape dans le panneau latéral et arrêter à tout moment. Une tâche fait au maximum 40 étapes et lit au maximum 30 pages.

## Démarrage rapide

Nécessite Chrome 122+.

1. Installez **[Browser Agent depuis le Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — cliquez sur **Ajouter à Google Chrome**. La mise à jour se fait automatiquement.
2. Cliquez sur l'icône dans la barre d'outils pour ouvrir le panneau latéral (introuvable ? épinglez-le depuis le menu de l'icône puzzle) et acceptez le court avis sur les données.
3. Posez une question sur la page où vous êtes, ou demandez-lui de rechercher quelque chose. Aucune clé ni aucun compte nécessaire.

### Installer depuis un zip de Release

Les Release peuvent avoir de l'avance sur le store pendant qu'une nouvelle version attend sa validation. Pas besoin de Node.js ni d'étape de build.

1. Téléchargez `browser-agent-<version>.zip` depuis la [dernière version](https://github.com/io-software-ai/browser-agent/releases/latest) et décompressez-la.
2. Ouvrez `chrome://extensions` et activez le **Mode développeur** (en haut à droite).
3. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez le dossier décompressé, puis reprenez à partir de l'étape 2 ci-dessus.

Pour mettre à jour, téléchargez le nouveau zip, remplacez le contenu du même dossier et cliquez sur l'icône de rechargement sur la carte de l'extension. Vos paramètres, discussions et souvenirs sont conservés. La charger depuis un autre dossier installe une copie distincte qui démarre vide, et la version du store aussi.

### Compiler depuis les sources

Il vous faut Node.js 22+.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Chargez ensuite le dossier `extension/` avec **Charger l'extension non empaquetée** comme à l'étape 3. Une version compilée depuis les sources communique avec un serveur Browser Agent Cloud à l'adresse `http://localhost:4410`, sauf si vous définissez `BA_BACKEND` à la compilation ; utilisez donc votre propre clé API (ci-dessous) ou pointez-la vers un backend que vous exploitez.

## Deux façons de l'utiliser

| | Browser Agent Cloud (par défaut) | Votre propre clé API |
|---|---|---|
| Configuration | Aucune : fonctionne dès l'installation | **Paramètres → Utiliser votre propre clé API (avancé)**, puis collez une clé ou un point de terminaison local |
| Compte | Aucun ; un identifiant d'appareil anonyme est créé à l'installation | Aucun |
| Modèles | Claude Sonnet, Opus et Haiku (5.5) | Ce que propose votre fournisseur |
| Coût | Crédits mensuels gratuits ; formules payantes pour en avoir plus (paiement via Paddle) | Facturé par votre fournisseur ; l'extension est gratuite |
| Où vont les requêtes | Via le serveur Browser Agent Cloud jusqu'au fournisseur du modèle | Directement de votre navigateur à votre fournisseur |

**Crédits.** En mode Cloud, chaque tâche (un message que vous envoyez, jusqu'à ce que l'agent s'arrête) consomme un nombre fixe de crédits déterminé par le modèle, la profondeur de réflexion et la quantité lue sur chaque page. Le panneau latéral affiche l'estimation avant l'envoi et les crédits restants après chaque tâche. Quand ils sont épuisés, les tâches sont suspendues jusqu'au mois suivant ou jusqu'à ce que vous passiez à une formule supérieure.

**Votre propre clé.** Ces fournisseurs fonctionnent ; choisissez un modèle qui gère l'appel d'outils (tool calling), sinon l'agent ne peut pas agir sur la page.

| Fournisseur | Ce qu'il vous faut | Remarques |
|---|---|---|
| Anthropic | [Clé API](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5 ; profondeur de réflexion ; résumés de réflexion ; PDF numérisés ; résumés de recherche page par page |
| OpenAI | [Clé API](https://platform.openai.com/api-keys) | La liste des modèles est récupérée auprès du fournisseur |
| Google Gemini | [Clé API](https://aistudio.google.com/apikey) | Utilise le point de terminaison de Gemini compatible OpenAI |
| OpenRouter | [Clé API](https://openrouter.ai/keys) | N'importe quel modèle d'OpenRouter gérant les outils |
| Personnalisé (compatible OpenAI) | URL de base, clé facultative | Ollama, LM Studio, vLLM, llama.cpp — tout ce qui expose `/chat/completions` |

Avec les fournisseurs autres qu'Anthropic, la recherche lit chaque page en texte brut au lieu d'un résumé Haiku, ce qui consomme plus de tokens.

Les serveurs locaux bloquent les extensions de navigateur par défaut :

- **Ollama :** définissez `OLLAMA_ORIGINS=chrome-extension://*` et redémarrez Ollama (macOS : `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). URL de base `http://localhost:11434/v1`.
- **LM Studio :** démarrez le serveur avec CORS activé, `lms server start --cors`. URL de base `http://localhost:1234/v1`.

## Compétences

Tapez `/` dans la zone de saisie pour en choisir une, ou laissez le modèle en charger une quand elle convient.

| Commande | Ce qu'elle fait |
|---|---|
| `/summarize` | L'essentiel en une ligne, les points clés et les actions à mener pour la page actuelle |
| `/translate` | Traduit la page dans votre langue en conservant titres et paragraphes |
| `/extract` | Extrait les données de la page dans un tableau Markdown ; un fichier CSV ou JSON quand il y en a beaucoup |
| `/compare` | Construit un tableau comparatif de prix, de formules ou de caractéristiques et met en évidence les différences |
| `/explain` | Explique la page, un terme ou un morceau de code avec des mots simples |
| `/thread` | Résume un fil de commentaires : principaux arguments, chaque camp, consensus, commentaires à lire |
| `/reply` | Rédige une réponse à l'e-mail ou au message de la page ; peut remplir la zone de réponse, sans jamais l'envoyer |
| `/fill-form` | Remplit le formulaire avec vos informations ; demande ce qui manque et s'arrête avant l'envoi |
| `/review-pr` | Relit une pull request GitHub et liste les problèmes par gravité, avec fichier et ligne |
| `/checklist` | Transforme un tutoriel en liste de contrôle d'étapes |
| `/decide` | Présente les options, pose une question à la fois sur vos besoins, puis en recommande une |
| `/grill-me` | Met votre plan (ou la proposition de la page) à l'épreuve avec une question à choix multiples à la fois |

`/clear` démarre une nouvelle conversation. La recherche n'a pas besoin de commande : demandez simplement.

### Écrire les vôtres

Une compétence est un fichier Markdown avec un frontmatter `name` et `description`, suivi d'instructions :

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Gérez les compétences dans **Paramètres → Compétences** : créer, modifier, exporter, importer un fichier `.md`, `.zip`/`.skill` ou un dossier de compétence entier, ou installer depuis un lien — `owner/repo/skill`, un lien de dossier GitHub, une page skills.sh ou sa commande `npx skills add …`, une page ClawHub, ou tout lien https vers un `SKILL.md` ou un zip. Les compétences suivent le standard [Agent Skills](https://agentskills.io/specification), le même format `SKILL.md` que Claude Code et d'autres agents. Les fichiers fournis avec une compétence (par exemple `references/forms.md`) sont stockés et lus par le modèle uniquement lorsque les instructions y renvoient ; les scripts fournis sont conservés sous forme de texte et ne sont jamais exécutés. Une ligne facultative `model:` (par exemple `model: haiku`) exécute cette compétence sur un modèle Claude moins cher ; `disable-model-invocation: true` et `user-invocable: false` fonctionnent comme dans Claude Code, et `$ARGUMENTS` est remplacé par ce que vous saisissez après `/name`.

Seuls les noms et descriptions entrent dans le system prompt ; le modèle appelle `use_skill` pour charger les instructions complètes quand il en a besoin, et taper `/nom` les joint directement. Les compétences sont des prompts : lisez-en une avant de l'importer.

## Sécurité et confidentialité

**Flux de données.** Une requête au modèle contient vos messages, le contenu de la page lue par l'agent (ou seulement votre sélection, ou le PDF), les résumés des pages qu'il a recherchées, vos souvenirs enregistrés et les noms de vos compétences. Dans un projet, elle contient aussi les instructions et la mémoire du projet ; les fichiers que vous joignez à un message et les fichiers du projet que l'agent ouvre sont envoyés eux aussi.

- *Le mode Cloud* envoie cette requête au serveur Browser Agent Cloud, qui la transmet au fournisseur du modèle et renvoie la réponse en streaming. Le serveur conserve des enregistrements d'utilisation (quel modèle, combien de tokens, de pages, de recherches et de crédits une tâche a utilisés) pour compter les crédits. Il ne stocke ni vos messages, ni le contenu des pages, ni les réponses du modèle ; si le fournisseur du modèle renvoie une erreur, ce message d'erreur peut être conservé avec l'enregistrement d'utilisation à des fins de débogage.
- *Votre propre clé* envoie les requêtes directement de votre navigateur à votre fournisseur. Rien sur vos tâches n'arrive aux serveurs de Browser Agent ; le seul contact est l'inscription anonyme faite à l'installation de l'extension.

Vos conversations, souvenirs, compétences, paramètres et toute clé API sont stockés uniquement dans `chrome.storage.local`. Pas d'analytique, pas de publicité. Rien n'est envoyé à un modèle avant que vous acceptiez l'avis sur les données du premier lancement. Détails complets : [politique de confidentialité](store/privacy-policy.md).

**La recherche utilise votre navigateur.** Les onglets en arrière-plan chargent les pages avec vos cookies et vos sessions connectées, exactement comme si vous les aviez ouvertes ; les PDF sont téléchargés directement par l'extension, également avec vos cookies. Les recherches sont de simples recherches Google (ou Bing) depuis votre navigateur ; si vous êtes connecté, elles peuvent donc être enregistrées dans l'historique de recherche de ce compte. Les mots-clés de recherche sont rédigés par le modèle à partir de votre question.

**Ce qui nécessite votre *Autoriser*.** Ces actions affichent une carte dans le panneau latéral et ne s'exécutent pas tant que vous n'avez pas appuyé sur *Autoriser*. La carte vit dans la page propre à l'extension, qu'un site web ne peut pas cliquer à votre place :

- les clics et envois de formulaire qui semblent irréversibles : le texte visible du bouton, son `aria-label`, son title ou sa value évoque payer, acheter, commander, supprimer, envoyer, publier, autoriser, enregistrer, partager, installer et similaires (dans les 15 langues de l'interface) ; un formulaire à plusieurs champs ou avec un champ de mot de passe ; un bouton à icône seule dans un formulaire ; appuyer sur Entrée dans un champ qui n'est pas dans un formulaire (zones de chat). Si le texte visible d'un bouton et son `aria-label` ne concordent pas, la carte vous prévient ;
- aller vers un autre site dans votre onglet, en naviguant ou en cliquant sur un lien, sauf s'il s'agit du site où la tâche a commencé, d'un site que vous avez nommé dans votre message ou d'un site déjà autorisé dans cette tâche. Dès que la conversation contient du contenu web ou des fichiers, il demande aussi avant d'aller vers toute adresse qu'il a lui-même composée, même sur ces sites ; seules les adresses exactes issues de votre message, des résultats de recherche ou des pages qu'il a lues passent sans qu'il vous demande ;
- lire en arrière-plan une page dont l'agent a lui-même composé l'adresse. Sans demander, il ne lit que les adresses exactes issues des résultats de recherche, les liens des pages qu'il a déjà lues, les adresses de votre message et les sites de recherche (GitHub, npm). Les pages sur `localhost` ou sur votre réseau local ne sont pas lues sauf si vous avez saisi l'adresse ; pour les pages ouvertes dans un onglet en arrière-plan, cela couvre aussi les domaines publics qui pointent vers une adresse locale (pour les PDF, seule l'adresse elle-même est vérifiée) ;
- saisir dans une page un texte qui ne vient pas de votre message, une fois que la conversation contient du contenu web ou des fichiers (une page peut lire ce qui est saisi dans ses champs sans que rien ne soit envoyé) ;
- enregistrer ou supprimer un souvenir une fois que la conversation contient du contenu web ou des fichiers (une page lue, un PDF, une sélection, un fichier du projet ou une pièce jointe).

**Les fichiers comptent comme du contenu web.** Les fichiers que vous importez dans un projet ou joignez à un message viennent souvent du web ; leurs noms et leur contenu sont donc traités comme non fiables : dès que l'agent en lit un, les cartes ci-dessus s'appliquent pour le reste de la tâche, et les instructions contenues dans un fichier ne sont pas suivies comme les vôtres. Les noms de fichiers ne sont pas placés dans les instructions du modèle.

Les cartes qui concernent une adresse l'affichent avec sa chaîne de requête, car une adresse peut transporter des données ; les adresses très longues sont raccourcies, en conservant le domaine et le début de la chaîne de requête.

Cliquer sur une suggestion l'envoie immédiatement. Les suggestions générées à partir de la page sont rédigées après lecture de son contenu, donc une page peut les influencer : les sites qu'elles mentionnent ne comptent pas comme des sites que vous avez nommés, et ce qu'elles déclenchent passe toujours par les mêmes cartes. Les liens dans les réponses affichent leur vrai domaine à côté du texte ; la liste des sources affiche le domaine de chaque source.

**Sortie et fichiers.** Les réponses du modèle sont rendues avec DOMPurify. Les images, médias, SVG, iframes, formulaires et styles en ligne sont supprimés, si bien qu'une page ne peut pas amener le modèle à divulguer votre conversation via l'URL d'une image. Les fichiers générés sont uniquement des formats texte brut (`csv`, `json`, `md`, …), et les cellules CSV/TSV qui commencent comme une formule de tableur sont neutralisées.

### Limites connues

- **L'injection de prompt n'est pas résolue.** L'agent lit de nombreuses pages non fiables avec votre session connectée. Une page malveillante peut tenter de l'amener à envoyer votre conversation, vos souvenirs ou des données d'autres sites quelque part, ou à faire des choses à votre place. Les cartes couvrent les actions à haut risque ci-dessus ; elles ne constituent pas une protection complète. De petites quantités de données peuvent encore fuiter par les liens que l'agent choisit de suivre ou par ce qu'il recherche.
- Ne lancez pas de recherches ni de tâches sur des pages non fiables pendant que des onglets de votre banque, de votre messagerie ou de l'administration de votre entreprise sont ouverts, et surveillez-le pendant l'exécution d'une tâche.
- La détection des clics risqués est une heuristique fondée sur des mots-clés et la forme du formulaire. Elle laissera passer certains boutons.
- Saisir vos propres mots (ceux de votre message) dans un champ ne demande rien. Une page malveillante peut lire ce que l'agent saisit (par exemple avec un écouteur `input`) et l'envoyer à son propre serveur.
- Les compétences importées et installées sont des instructions tierces. Tant que l'une d'elles figure dans votre liste de compétences (ou que vous l'appelez avec `/name`), toute tâche est considérée comme non fiable : enregistrer un souvenir, ouvrir un lien construit par l'agent ou saisir un texte que vous n'avez pas fourni demande d'abord votre accord. Ces compétences affichent une étiquette *Tiers* dans la liste. Les compétences que vous écrivez vous-même sont fiables. Les compétences ajoutées avant cette version n'ont pas de source enregistrée et sont donc aussi traitées comme tierces ; si vous en avez écrit une vous-même, ouvrez-la et choisissez **Je l'ai écrite moi-même**. N'installez que des compétences provenant de sources de confiance.
- Les souvenirs, les projets (fichiers compris) et les conversations sont stockés non chiffrés dans votre navigateur. Les souvenirs et les instructions des projets sont envoyés avec chaque requête au modèle (via Browser Agent Cloud, ou à votre propre fournisseur).

## Langues

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. La langue par défaut suit celle de votre navigateur ; changez-la dans **Paramètres → Langue**. Le modèle répond dans la langue de votre interface, sauf si vous écrivez dans une autre.

## Développement

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

Le panneau latéral est en React + TypeScript, empaqueté par esbuild dans `extension/`. `src/agent.ts` exécute la boucle de l'agent dans le panneau latéral : en mode Cloud, il appelle l'API Browser Agent Cloud (compatible Anthropic, adresse définie par `BA_BACKEND` à la compilation) avec le SDK officiel ; avec votre propre clé, il appelle Anthropic directement ou toute API compatible OpenAI via `src/providers.ts`. Les outils de `src/tools.ts` s'exécutent dans l'onglet actif ou dans des onglets en arrière-plan avec `chrome.scripting` ; `src/elements.ts` construit la liste numérotée des éléments et la vérification des actions irréversibles. La suite e2e n'a besoin d'aucune clé API, ne coûte rien et n'envoie aucune requête vers le vrai internet.

Le rôle de chaque fichier est décrit dans le tableau de [Development](README.md#development) de la version anglaise.

Pour ajouter un outil : ajoutez son schéma à `tools` dans `src/shared.ts` et un `case` dans `runTool` dans `src/tools.ts`.

### Traduction

Copiez `src/i18n/locales/en.ts` vers, par exemple, `nl.ts`, déclarez-le comme `const nl: Dict = { … }`, traduisez les valeurs (conservez chaque `{placeholder}`) et ajoutez-le à `LANGS` et aux chargeurs dans `src/i18n/index.ts`. `npm run typecheck` échoue s'il manque une clé ou s'il y en a une en trop ; `npm run check` échoue si un placeholder ne correspond pas. Les prompts et descriptions d'outils envoyés au modèle restent volontairement dans une seule langue. Pour le nom et la description dans le Chrome Web Store, ajoutez `extension/_locales/<code>/messages.json` (Chrome utilise des tirets bas, par ex. `pt_BR`).

## Contribuer

Issues et PR sont les bienvenues — voir [CONTRIBUTING.md](CONTRIBUTING.md). Gardez les PR petites, lancez les trois vérifications ci-dessus et indiquez comment vous avez testé ce qu'elles ne couvrent pas.

## Licence

L'extension est sous licence [MIT](LICENSE). Browser Agent Cloud, le service hébergé facultatif derrière le mode par défaut, est exploité séparément et ne fait pas partie de ce dépôt. Browser Agent est un projet indépendant, non affilié à Anthropic, OpenAI ou Google.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
