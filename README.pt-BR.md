<div align="center">

<img src="docs/logo.svg" width="72" alt="Logotipo do Browser Agent">

# Browser Agent

**Um agente de IA no seu navegador que trabalha direto no site que você está vendo. Ele lê a página, clica, digita e navega entre páginas por você — e, quando uma página não basta, pesquisa pela web e responde com fontes.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · Português (Brasil) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Seleciona um parágrafo e usa /explain para explicá-lo, compara preços de notebooks em um CSV, depois o agente pergunta antes de clicar em Place order e o usuário nega">

</div>

## Por que

- **Funciona na página em que você já está.** Peça com suas próprias palavras: resuma isto, coloque os preços em uma tabela, preencha este formulário, encontre a configuração de cancelamento. Ele lê a página e age sobre ela — sem copiar e colar em outra aba de chat.
- **Ele vê a página como o site a construiu.** O modelo recebe o texto da página e uma lista numerada de botões, links e campos, e clica em `ref: 12` em vez de adivinhar a partir de uma captura de tela. Selecione um parágrafo para perguntar só sobre ele; PDFs também funcionam.
- **Ele pesquisa, com fontes.** Quando a resposta não está nesta página, ele busca com o seu próprio navegador, lê algumas páginas, compara e responde com citações `[n]` que levam de volta a cada fonte.
- **Ações arriscadas esperam por você.** Cliques e envios de formulário que parecem irreversíveis, e páginas em endereços que o próprio agente inventou, ficam parados até você clicar em *Permitir*. Essa verificação é imposta pelo código da extensão, não pedida educadamente ao modelo.
- **Comece de graça, ou traga sua própria chave.** Logo após a instalação, ele roda no Browser Agent Cloud, com créditos mensais gratuitos e sem cadastro. Prefere o seu próprio provedor? Troque para a sua chave de API nas Configurações e as requisições vão direto do seu navegador para esse provedor.

## Funcionalidades

**Agindo na página**
- Ferramentas: ler a página, clicar, digitar (incluindo menus suspensos `<select>`), rolar, abrir uma URL. O modelo recebe uma lista numerada de elementos interativos e clica em `ref: 12` em vez de adivinhar seletores CSS.
- Selecione um texto na página e pergunte só sobre ele; a seleção é anexada à sua mensagem em vez da aba inteira.
- Anexar arquivos a uma mensagem: solte, cole ou escolha arquivos de texto, código ou PDFs, e o texto deles vai junto com o que você digita.
- PDF: o texto é extraído com pdf.js. Um visualizador integrado permite selecionar texto em um PDF como em qualquer página. PDFs escaneados (sem camada de texto) podem ser enviados ao Claude como documento, depois que você confirmar o custo.
- Tela inicial: sugestões com base na página em que você está.

**Pesquisa pela web**
- Busca e lê páginas em abas em segundo plano do seu próprio navegador; páginas em que você está logado também funcionam, e a sua aba atual não é tocada.
- Cada página é condensada no que importa para a sua pergunta; as fontes são numeradas, as citações `[n]` são clicáveis, e as fontes são salvas com a conversa e incluídas quando você a exporta.
- Segue links das páginas que leu e vai direto a sites de pesquisa como GitHub e npm; outros endereços perguntam antes.

**Na conversa**
- Respostas em Markdown em streaming, com tabelas e blocos de código, além de resumos de raciocínio recolhíveis.
- Cartões de pergunta (`ask_user`): quando o modelo precisa de uma decisão, ele pergunta com opções clicáveis em vez de adivinhar.
- Cartões de arquivo: resultados como arquivos `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics` ou `vcf` para baixar, com cópia e pré-visualização.

**Fica com você**
- Projetos: dê a um projeto suas próprias instruções, arquivos e memória, e escolha quais skills ele usa. Toda conversa do projeto começa com as instruções dele; o agente só abre os arquivos do projeto quando precisa deles.
- Memória: diga "lembre-se de …" e ela guarda fatos curtos sobre você entre conversas. Veja, edite ou desligue em Configurações.
- Histórico: as últimas 30 conversas de cada projeto, agrupadas por data. Reabra uma e continue, ou exporte como Markdown.
- 12 skills integradas e comandos `/`; escreva as suas ou instale [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, o formato que o Claude Code usa) do GitHub, skills.sh ou ClawHub.
- Interface em 15 idiomas; os temas claro e escuro seguem o do seu sistema.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Seletor de provedor: Anthropic, OpenAI, Google Gemini, OpenRouter, Personalizado (compatível com OpenAI)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Digitar / abre o menu de skills"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Um cartão de pergunta com três opções, uma delas recomendada"></td>
  </tr>
  <tr>
    <td align="center">Ou use o seu próprio provedor</td>
    <td align="center">Digite <code>/</code> para skills</td>
    <td align="center">Ele pergunta em vez de adivinhar</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Visualizador de PDF integrado com uma frase selecionada, e o painel lateral explicando-a">

## Como a pesquisa funciona

Pergunte algo que a página atual não responde — "qual biblioteca de estado do React devo usar em 2026?" — e o agente pesquisa:

1. **Buscar.** Ele abre uma busca em uma aba em segundo plano (Google; se o Google pedir para verificar que você é humano, ele troca para o Bing), lê os títulos, links e trechos, e fecha a aba. Só se os dois pedirem verificação a aba de busca vem para a frente para você resolvê-la; a pesquisa então continua sozinha.
2. **Ler.** Ele abre os resultados mais relevantes em abas em segundo plano — até quatro por vez — e extrai o texto principal. A sua aba atual nunca é tocada.
3. **Condensar.** Cada página é resumida por um modelo pequeno e rápido (Claude Haiku) nos pontos, citações e datas que importam para a sua pergunta, para que vinte páginas não inundem a conversa nem a sua fatura.
4. **Responder.** Você recebe primeiro a conclusão, depois uma tabela comparativa, uma recomendação com os motivos e o que as fontes não resolveram. Os resultados de busca e as páginas lidas são numerados: `[n]` na resposta é um link, e as fontes citadas aparecem listadas abaixo da resposta.

Você acompanha cada etapa no painel lateral e pode parar a qualquer momento. Uma tarefa faz no máximo 40 etapas e lê no máximo 30 páginas.

## Começando

Requer Chrome 122+.

1. Instale o **[Browser Agent pela Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** — clique em **Usar no Chrome**. Ele se atualiza sozinho.
2. Clique no ícone na barra de ferramentas para abrir o painel lateral (não encontrou? fixe-o pelo menu do ícone de quebra-cabeça) e concorde com o breve aviso de dados.
3. Pergunte sobre a página em que você está — ou peça que ele pesquise algo. Não precisa de chave nem de conta.

### Instalar a partir de um zip de Release

As Releases podem estar à frente da loja enquanto uma nova versão aguarda revisão. Não precisa de Node.js nem de etapa de build.

1. Baixe `browser-agent-<versão>.zip` da [última release](https://github.com/io-software-ai/browser-agent/releases/latest) e descompacte.
2. Abra `chrome://extensions` e ative o **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação** e selecione a pasta descompactada, depois continue a partir do passo 2 acima.

Para atualizar, baixe o novo zip, substitua o conteúdo da mesma pasta e clique no ícone de recarregar no cartão da extensão. Suas configurações, conversas e memórias são mantidas. Carregá-la de uma pasta diferente instala uma cópia separada que começa vazia — a versão da loja também.

### Compilar a partir do código-fonte

Você precisa do Node.js 22+.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Depois carregue a pasta `extension/` com **Carregar sem compactação** como no passo 3. Uma versão compilada por você fala com um servidor do Browser Agent Cloud em `http://localhost:4410`, a menos que você defina `BA_BACKEND` ao compilar; por isso use a sua própria chave de API (abaixo) ou aponte para um backend que você mesmo rode.

## Duas formas de usar

| | Browser Agent Cloud (padrão) | Sua própria chave de API |
|---|---|---|
| Configuração | Nenhuma — funciona logo após a instalação | **Configurações → Usar sua própria chave de API (avançado)**, depois cole uma chave ou um endpoint local |
| Conta | Nenhuma; um ID de dispositivo anônimo é criado na instalação | Nenhuma |
| Modelos | Claude Sonnet, Opus e Haiku (5.5) | O que o seu provedor oferecer |
| Custo | Créditos mensais gratuitos; planos pagos para ter mais (pagamento via Paddle) | Cobrado pelo seu provedor; a extensão é gratuita |
| Para onde vão as requisições | Passam pelo servidor do Browser Agent Cloud até o provedor do modelo | Direto do seu navegador para o seu provedor |

**Créditos.** No modo Cloud, cada tarefa (uma mensagem que você envia, até o agente parar) usa um número fixo de créditos, definido pelo modelo, pela profundidade de raciocínio e por quanto de cada página ele lê. O painel lateral mostra a estimativa antes de você enviar e os créditos restantes depois de cada tarefa. Quando acabam, as tarefas ficam em pausa até o mês seguinte ou até você fazer upgrade.

**Sua própria chave.** Estes provedores funcionam; escolha um modelo com suporte a tool calling, ou o agente não consegue agir na página.

| Provedor | O que você precisa | Notas |
|---|---|---|
| Anthropic | [Chave de API](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; profundidade de raciocínio; resumos de raciocínio; PDFs escaneados; resumo de cada página na pesquisa |
| OpenAI | [Chave de API](https://platform.openai.com/api-keys) | A lista de modelos é obtida do provedor |
| Google Gemini | [Chave de API](https://aistudio.google.com/apikey) | Usa o endpoint do Gemini compatível com OpenAI |
| OpenRouter | [Chave de API](https://openrouter.ai/keys) | Qualquer modelo com suporte a ferramentas no OpenRouter |
| Personalizado (compatível com OpenAI) | URL base, chave opcional | Ollama, LM Studio, vLLM, llama.cpp — qualquer um com `/chat/completions` |

Com provedores que não sejam a Anthropic, a pesquisa lê cada página como texto bruto em vez de um resumo do Haiku, o que usa mais tokens.

Servidores locais bloqueiam extensões de navegador por padrão:

- **Ollama:** defina `OLLAMA_ORIGINS=chrome-extension://*` e reinicie o Ollama (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). URL base `http://localhost:11434/v1`.
- **LM Studio:** inicie o servidor com CORS ativado, `lms server start --cors`. URL base `http://localhost:1234/v1`.

## Skills

Digite `/` no campo de mensagem para escolher uma, ou deixe o modelo carregar uma quando fizer sentido.

| Comando | O que faz |
|---|---|
| `/summarize` | Conclusão em uma linha, pontos-chave e itens de ação para a página atual |
| `/translate` | Traduz a página para o seu idioma, mantendo títulos e parágrafos |
| `/extract` | Extrai os dados da página em uma tabela Markdown; um arquivo CSV ou JSON quando há muito conteúdo |
| `/compare` | Monta uma tabela comparativa de preços, planos ou especificações e destaca as diferenças |
| `/explain` | Explica a página, um termo ou um trecho de código em palavras simples |
| `/thread` | Resume uma thread de comentários: principais argumentos, cada lado, consenso, comentários que valem a leitura |
| `/reply` | Redige uma resposta ao e-mail ou mensagem da página; pode preencher a caixa de resposta, mas nunca envia |
| `/fill-form` | Preenche o formulário com seus dados; pergunta o que faltar e para antes de enviar |
| `/review-pr` | Revisa um pull request do GitHub e lista os problemas por gravidade, com arquivo e linha |
| `/checklist` | Transforma um tutorial em uma checklist de passos |
| `/decide` | Apresenta as opções, pergunta suas necessidades uma de cada vez e depois recomenda uma |
| `/grill-me` | Põe seu plano (ou a proposta na página) à prova com uma pergunta de múltipla escolha por vez |

`/clear` inicia uma nova conversa. A pesquisa não precisa de comando — é só pedir.

### Escreva as suas

Uma skill é um arquivo Markdown com frontmatter `name` e `description`, seguido de instruções:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Gerencie as skills em **Configurações → Skills**: criar, editar, exportar, importar um arquivo `.md`, `.zip`/`.skill` ou uma pasta de skill inteira, ou instalar a partir de um link — `owner/repo/skill`, um link de pasta do GitHub, uma página do skills.sh ou o comando `npx skills add …` dela, uma página do ClawHub, ou qualquer link https para um `SKILL.md` ou zip. As skills seguem o padrão [Agent Skills](https://agentskills.io/specification), o mesmo formato `SKILL.md` usado pelo Claude Code e por outros agentes. Os arquivos incluídos em uma skill (por exemplo `references/forms.md`) são armazenados e o modelo só os lê quando as instruções apontam para eles; scripts incluídos são mantidos como texto e nunca executados. Uma linha opcional `model:` (por exemplo `model: haiku`) executa essa skill em um modelo Claude mais barato; `disable-model-invocation: true` e `user-invocable: false` funcionam como no Claude Code, e `$ARGUMENTS` é substituído pelo que você digitar depois de `/name`.

Só nomes e descrições entram no system prompt; o modelo chama `use_skill` para carregar as instruções completas quando precisa, e digitar `/nome` as anexa diretamente. Skills são prompts — leia uma antes de importá-la.

## Segurança e privacidade

**Fluxo de dados.** Uma requisição ao modelo contém suas mensagens, o conteúdo da página que o agente leu (ou só a sua seleção, ou o PDF), os resumos das páginas pesquisadas, suas memórias salvas e os nomes das suas skills. Em um projeto, ela também contém as instruções e a memória do projeto; os arquivos que você anexa a uma mensagem e os arquivos do projeto que o agente abre também são enviados.

- *Modo Cloud* envia essa requisição ao servidor do Browser Agent Cloud, que a encaminha ao provedor do modelo e devolve a resposta em streaming. O servidor mantém registros de uso — qual modelo, quantos tokens, páginas, buscas e créditos uma tarefa usou — para contar os créditos. Ele não armazena suas mensagens, o conteúdo das páginas nem as respostas do modelo; se o provedor do modelo devolver um erro, essa mensagem de erro pode ser guardada junto com o registro de uso para depuração.
- *Sua própria chave* envia as requisições direto do seu navegador para o seu provedor. Nada sobre as suas tarefas vai para os servidores do Browser Agent; o único contato é o registro anônimo feito quando a extensão foi instalada.

Suas conversas, memórias, skills, configurações e qualquer chave de API ficam armazenadas somente em `chrome.storage.local`. Sem analytics, sem anúncios. Nada é enviado a um modelo antes de você concordar com o aviso de dados da primeira execução. Detalhes completos: [política de privacidade](store/privacy-policy.md).

**A pesquisa usa o seu navegador.** Abas em segundo plano carregam páginas com os seus cookies e sessões logadas, exatamente como se você as tivesse aberto; os PDFs são baixados diretamente pela extensão, também com os seus cookies. As buscas são buscas comuns do Google (ou do Bing) feitas pelo seu navegador, então, se você estiver logado, elas podem ser salvas no histórico de pesquisa dessa conta. As palavras-chave da busca são escritas pelo modelo a partir da sua pergunta.

**O que precisa do seu *Permitir*.** Estas ações mostram um cartão no painel lateral e não são executadas até você clicar em *Permitir*. O cartão vive na própria página da extensão, que um site não consegue clicar por você:

- cliques e envios de formulário que parecem irreversíveis: o texto visível do botão, `aria-label`, title ou value soa como pagar, comprar, pedir, excluir, enviar, publicar, autorizar, salvar, compartilhar, instalar e similares (nos 15 idiomas da interface); um formulário com vários campos ou um campo de senha; um botão só com ícone dentro de um formulário; apertar Enter em um campo que não está em um formulário (caixas de chat). Se o texto visível de um botão e seu `aria-label` não baterem, o cartão avisa;
- ir para outro site na sua aba, navegando ou clicando em um link, a menos que seja o site onde a tarefa começou, um site que você nomeou na sua mensagem ou um que você já permitiu nesta tarefa. Depois que a conversa passa a ter conteúdo web ou arquivos, ele também pergunta antes de ir para qualquer endereço que ele mesmo montou, mesmo nesses sites; só passam sem perguntar endereços exatos vindos da sua mensagem, de resultados de busca ou de páginas que leu;
- ler em segundo plano uma página cujo endereço o próprio agente montou. Sem perguntar, ele só lê endereços exatos vindos de resultados de busca, de links em páginas que já leu, de endereços na sua mensagem e de sites de pesquisa (GitHub, npm). Páginas em `localhost` ou na sua rede local não são lidas, a menos que você tenha digitado o endereço; para páginas abertas em uma aba em segundo plano, isso vale também para domínios públicos que resolvem para um endereço local (nos PDFs, só o endereço em si é verificado);
- digitar em uma página um texto que não vem da sua mensagem, depois que a conversa passa a ter conteúdo web ou arquivos (uma página consegue ler o que é digitado nos seus campos mesmo sem que nada seja enviado);
- salvar ou excluir uma memória depois que a conversa passa a ter conteúdo web ou arquivos (uma página lida, um PDF, uma seleção, um arquivo do projeto ou um anexo).

**Arquivos contam como conteúdo web.** Arquivos que você envia para um projeto ou anexa a uma mensagem muitas vezes vêm da web, então os nomes e o conteúdo deles são tratados como não confiáveis: depois que o agente lê um, os cartões acima valem pelo resto da tarefa, e instruções dentro de um arquivo não são seguidas como se fossem suas. Os nomes dos arquivos não entram nas instruções do modelo.

Os cartões que envolvem um endereço o mostram com a query string, porque um endereço pode levar dados para fora; endereços muito longos são encurtados, mantendo o domínio e o início da query string.

Clicar em uma sugestão a envia na hora. Sugestões geradas a partir da página são escritas depois de ler o conteúdo da página, então uma página pode influenciá-las: sites que elas mencionam não contam como sites nomeados por você, e o que elas disparam passa pelos mesmos cartões. Links nas respostas mostram o domínio real ao lado do texto; a lista de fontes mostra o domínio de cada fonte.

**Saída e arquivos.** As respostas do modelo são renderizadas com DOMPurify. Imagens, mídia, SVG, iframes, formulários e estilos inline são removidos, então uma página não consegue fazer o modelo vazar sua conversa por meio da URL de uma imagem. Os arquivos gerados são só formatos de texto simples (`csv`, `json`, `md`, …), e células de CSV/TSV que começam como uma fórmula de planilha são neutralizadas.

### Limitações conhecidas

- **Prompt injection não está resolvido.** O agente lê muitas páginas não confiáveis com a sua sessão logada. Uma página maliciosa pode tentar levá-lo a enviar sua conversa, memórias ou dados de outros sites para algum lugar, ou a fazer coisas em seu nome. Os cartões cobrem as ações de alto risco acima; não são uma proteção completa. Pequenas quantidades de dados ainda podem vazar pelos links que o agente escolhe seguir ou pelo que ele pesquisa.
- Não pesquise nem execute tarefas em páginas não confiáveis enquanto houver abas do seu banco, e-mail ou administração da empresa abertas, e acompanhe o agente enquanto uma tarefa está em execução.
- Detectar cliques arriscados é uma heurística de palavras-chave e formato de formulário. Ela vai deixar passar alguns botões.
- Digitar as suas próprias palavras (as da sua mensagem) em um campo não pergunta. Uma página maliciosa pode ler o que o agente digita (por exemplo, com um listener de `input`) e enviar para o próprio servidor.
- Skills importadas e instaladas são instruções de terceiros. Enquanto uma estiver na sua lista de skills (ou você a chamar com `/name`), toda tarefa conta como não confiável: salvar uma memória, abrir um link que o agente montou ou digitar um texto que você não forneceu pergunta antes. Essas skills mostram o rótulo *De terceiros* na lista. Skills que você mesmo escreve são confiáveis. Skills adicionadas antes desta versão não têm origem registrada, então também são tratadas como de terceiros; se você mesmo escreveu uma, abra-a e escolha **Eu mesmo escrevi**. Instale apenas skills de fontes em que você confia.
- Memórias, projetos (incluindo os arquivos deles) e conversas são armazenados sem criptografia no seu navegador. Memórias e instruções de projeto são enviadas ao modelo a cada requisição (pelo Browser Agent Cloud ou para o seu próprio provedor).

## Idiomas

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. O padrão segue o do seu navegador; mude em **Configurações → Idioma**. O modelo responde no idioma da sua interface, a menos que você escreva em outro.

## Desenvolvimento

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

O painel lateral é React + TypeScript empacotado pelo esbuild em `extension/`. `src/agent.ts` roda o loop do agente no painel lateral: no modo Cloud, ele chama a API do Browser Agent Cloud (compatível com a Anthropic, com o endereço definido por `BA_BACKEND` na compilação) com o SDK oficial; com a sua própria chave, chama a Anthropic diretamente ou qualquer API compatível com OpenAI por `src/providers.ts`. As ferramentas em `src/tools.ts` rodam na aba ativa ou em abas em segundo plano com `chrome.scripting`; `src/elements.ts` monta a lista numerada de elementos e a verificação de ações irreversíveis. A suíte e2e não precisa de chave de API, não gasta nada e não faz requisições à internet de verdade.

Para o que cada arquivo faz, veja a tabela em [Development](README.md#development) na versão em inglês. Para adicionar uma ferramenta: adicione o schema dela a `tools` em `src/shared.ts` e um `case` em `runTool` em `src/tools.ts`.

### Traduzindo

Copie `src/i18n/locales/en.ts` para, por exemplo, `nl.ts`, declare como `const nl: Dict = { … }`, traduza os valores (mantendo cada `{placeholder}`) e adicione a `LANGS` e aos loaders em `src/i18n/index.ts`. `npm run typecheck` falha se faltar ou sobrar alguma chave; `npm run check` falha se um placeholder não bater. Prompts e descrições de ferramentas enviados ao modelo permanecem em um único idioma de propósito. Para o nome e a descrição na Chrome Web Store, adicione `extension/_locales/<code>/messages.json` (o Chrome usa underscore, por exemplo `pt_BR`).

## Contribuindo

Issues e PRs são bem-vindos — veja [CONTRIBUTING.md](CONTRIBUTING.md). Mantenha os PRs pequenos, rode as três verificações acima e diga como você testou o que elas não cobrem.

## Licença

A extensão é [MIT](LICENSE). O Browser Agent Cloud, o serviço hospedado opcional por trás do modo padrão, é operado separadamente e não faz parte deste repositório. Browser Agent é um projeto independente, sem afiliação com Anthropic, OpenAI ou Google.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
