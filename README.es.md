<div align="center">

<img src="docs/logo.svg" width="72" alt="Logotipo de Browser Agent">

# Browser Agent

**Un agente de IA en tu navegador que trabaja directamente sobre el sitio que estás viendo. Lee la página, hace clic, escribe y se mueve entre páginas por ti — y cuando una página no basta, investiga por toda la web y responde con fuentes.**

[![CI](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/io-software-ai/browser-agent/actions/workflows/ci.yml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iebcachfohpddakkmnopkpfnjibdlhai?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)
[![Release](https://img.shields.io/github/v/release/io-software-ai/browser-agent)](https://github.com/io-software-ai/browser-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Chrome 122+](https://img.shields.io/badge/Chrome-122%2B-4285F4?logo=googlechrome&logoColor=white)

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · Español · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Italiano](README.it.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md) · [Bahasa Indonesia](README.id.md) · [ไทย](README.th.md) · [Türkçe](README.tr.md)

<img src="docs/demo.gif" width="900" alt="Selecciona un párrafo y usa /explain para explicarlo, compara precios de portátiles en un CSV; luego el agente pregunta antes de hacer clic en Place order y el usuario lo rechaza">

</div>

## Por qué

- **Trabaja sobre la página en la que ya estás.** Pídelo con tus palabras: resume esto, pasa los precios a una tabla, rellena este formulario, encuentra el ajuste para cancelar. Lee la página y actúa sobre ella, sin copiar y pegar en otra pestaña de chat.
- **Ve la página tal como la construyó el sitio.** El modelo recibe el texto de la página y una lista numerada de botones, enlaces y campos, y hace clic en `ref: 12` en lugar de adivinar a partir de una captura de pantalla. Selecciona un párrafo para preguntar solo por él; los PDF también funcionan.
- **Puede investigar, con fuentes.** Cuando la respuesta no está en esta página, busca con tu propio navegador, lee unas cuantas páginas, las compara y responde con citas `[n]` que enlazan a cada fuente.
- **Las acciones arriesgadas esperan tu visto bueno.** Los clics y envíos de formulario que parecen irreversibles, y las páginas cuya dirección se ha inventado el propio agente, se detienen hasta que pulsas *Permitir*. Esa comprobación la impone el código de la extensión, no un ruego al modelo.
- **Empieza gratis o trae tu propia clave.** De fábrica funciona con Browser Agent Cloud, con créditos mensuales gratuitos y sin registro. ¿Prefieres tu propio proveedor? Cambia a tu propia clave de API en Ajustes y las peticiones irán directamente de tu navegador a ese proveedor.

## Funciones

**Actuar sobre la página**
- Herramientas: leer la página, hacer clic, escribir (incluidos los desplegables `<select>`), desplazarse, abrir una URL. El modelo recibe una lista numerada de elementos interactivos y hace clic en `ref: 12` en lugar de adivinar selectores CSS.
- Selecciona texto en la página y pregunta solo por eso; la selección se adjunta a tu mensaje en lugar de toda la pestaña.
- PDF: el texto se extrae con pdf.js. Un visor integrado te permite seleccionar texto en un PDF como en cualquier página. Los PDF escaneados (sin capa de texto) se pueden enviar a Claude como documento, después de que confirmes el coste.
- Pantalla de inicio: sugerencias basadas en la página en la que estás.

**Investigar por toda la web**
- Busca y lee páginas en pestañas en segundo plano de tu propio navegador; las páginas en las que has iniciado sesión también funcionan, y tu pestaña actual no se toca.
- Cada página se condensa en lo que importa para tu pregunta; las fuentes están numeradas, las citas `[n]` se pueden pulsar, y las fuentes se guardan con la conversación y se incluyen al exportarla.
- Sigue los enlaces de las páginas que ha leído y va directamente a sitios de investigación como GitHub y npm; para otras direcciones pregunta primero.

**En la conversación**
- Respuestas en Markdown en streaming, con tablas y bloques de código, y resúmenes de razonamiento desplegables.
- Tarjetas de preguntas (`ask_user`): cuando el modelo necesita una decisión, pregunta con opciones en las que puedes hacer clic en lugar de adivinar.
- Tarjetas de archivo: resultados como archivos descargables `csv`, `json`, `md`, `txt`, `tsv`, `xml`, `yaml`, `ics` o `vcf`, con copiar y vista previa.

**Tuyo para conservar**
- Memoria: di "recuerda …" y guarda datos breves sobre ti entre chats. Consúltala, edítala o desactívala en Ajustes.
- Historial: las últimas 30 conversaciones, agrupadas por fecha. Reabre una y sigue, o expórtala como Markdown.
- 12 habilidades integradas y comandos `/`; escribe las tuyas o instala [Agent Skills](https://agentskills.io/specification) (`SKILL.md`, el formato que usa Claude Code) desde GitHub, skills.sh o ClawHub.
- Interfaz en 15 idiomas; el tema claro u oscuro sigue el de tu sistema.

<table>
  <tr>
    <td width="33%"><img src="docs/providers.png" alt="Selector de proveedor: Anthropic, OpenAI, Google Gemini, OpenRouter, Personalizado (compatible con OpenAI)"></td>
    <td width="33%"><img src="docs/skills.png" alt="Al escribir / se abre el menú de habilidades"></td>
    <td width="33%"><img src="docs/ask-user.png" alt="Una tarjeta de pregunta con tres opciones, una de ellas recomendada"></td>
  </tr>
  <tr>
    <td align="center">O usa tu propio proveedor</td>
    <td align="center">Escribe <code>/</code> para ver las habilidades</td>
    <td align="center">Pregunta en lugar de adivinar</td>
  </tr>
</table>

<img src="docs/pdf-viewer.png" alt="Visor de PDF integrado con una frase seleccionada, y el panel lateral explicándola">

## Cómo funciona la investigación

Pregunta algo que la página actual no pueda responder ("¿qué librería de estado de React debería usar en 2026?") y el agente lo investiga:

1. **Buscar.** Abre una búsqueda en una pestaña en segundo plano (Google; si Google te pide verificar que eres humano, cambia a Bing), lee los títulos, enlaces y fragmentos, y cierra la pestaña. Solo si ambos piden verificación, la pestaña de búsqueda pasa a primer plano para que la resuelvas; después la investigación continúa sola.
2. **Leer.** Abre los resultados más relevantes en pestañas en segundo plano (hasta cuatro a la vez) y extrae el texto principal. Tu pestaña actual nunca se toca.
3. **Condensar.** Un modelo pequeño y rápido (Claude Haiku) reduce cada página a los puntos, citas y fechas que importan para tu pregunta, de modo que veinte páginas no inunden la conversación ni tu factura.
4. **Responder.** Recibes primero la conclusión, luego una tabla comparativa, una recomendación con sus motivos y lo que las fuentes no resolvieron. Los resultados de búsqueda y las páginas leídas están numerados: `[n]` en la respuesta es un enlace, y las fuentes citadas se listan debajo de la respuesta.

Puedes ver cada paso en el panel lateral y detenerlo en cualquier momento. Una tarea hace como máximo 40 pasos y lee como máximo 30 páginas.

## Primeros pasos

Requiere Chrome 122 o superior.

1. Instala **[Browser Agent desde la Chrome Web Store](https://chromewebstore.google.com/detail/browser-agent/iebcachfohpddakkmnopkpfnjibdlhai)** y haz clic en **Añadir a Chrome**. Se actualiza sola.
2. Haz clic en el icono de la barra de herramientas para abrir el panel lateral (¿no lo ves? Fíjalo desde el menú del icono de piezas de puzle) y acepta el breve aviso sobre datos.
3. Pregunta por la página en la que estás o pídele que investigue algo. No hace falta clave ni cuenta.

### Instalar desde un zip de Release

Los Release pueden ir por delante de la tienda mientras una versión nueva espera revisión. No hace falta Node.js ni compilar nada.

1. Descarga `browser-agent-<versión>.zip` desde la [última versión](https://github.com/io-software-ai/browser-agent/releases/latest) y descomprímelo.
2. Abre `chrome://extensions` y activa el **Modo de desarrollador** (arriba a la derecha).
3. Haz clic en **Cargar descomprimida** y elige la carpeta descomprimida; luego continúa desde el paso 2 de arriba.

Para actualizar, descarga el nuevo zip, sustituye el contenido de la misma carpeta y haz clic en el icono de recarga en la tarjeta de la extensión. Tus ajustes, chats y recuerdos se conservan. Cargarla desde una carpeta distinta instala una copia aparte que empieza vacía, y la versión de la tienda también.

### Compilar desde el código fuente

Necesitas Node.js 22 o superior.

```bash
git clone https://github.com/io-software-ai/browser-agent.git
cd browser-agent
npm ci
npm run build
```

Luego carga la carpeta `extension/` con **Cargar descomprimida** como en el paso 3. Una compilación desde el código fuente se comunica con un servidor de Browser Agent Cloud en `http://localhost:4410` salvo que definas `BA_BACKEND` al compilar, así que usa tu propia clave de API (más abajo) o apúntala a un backend que ejecutes tú.

## Dos formas de usarlo

| | Browser Agent Cloud (por defecto) | Tu propia clave de API |
|---|---|---|
| Configuración | Ninguna: funciona nada más instalar | **Ajustes → Usar tu propia clave de API (avanzado)**, y pega una clave o un endpoint local |
| Cuenta | Ninguna; al instalar se crea un ID de dispositivo anónimo | Ninguna |
| Modelos | Claude Sonnet, Opus y Haiku (5.5) | Los que ofrezca tu proveedor |
| Coste | Créditos mensuales gratuitos; planes de pago para más (pago a través de Paddle) | Lo factura tu proveedor; la extensión es gratuita |
| A dónde van las peticiones | A través del servidor de Browser Agent Cloud hasta el proveedor del modelo | Directamente de tu navegador a tu proveedor |

**Créditos.** En modo Cloud, cada tarea (un mensaje que envías, hasta que el agente se detiene) consume un número fijo de créditos que depende del modelo, la profundidad de razonamiento y cuánto lee de cada página. El panel lateral muestra la estimación antes de enviar y los créditos restantes tras cada tarea. Cuando se agotan, las tareas se pausan hasta el mes siguiente o hasta que mejores el plan.

**Tu propia clave.** Estos proveedores funcionan; elige un modelo que admita llamadas a herramientas (tool calling), o el agente no podrá actuar sobre la página.

| Proveedor | Qué necesitas | Notas |
|---|---|---|
| Anthropic | [Clave de API](https://console.anthropic.com/settings/keys) | Sonnet 5.5, Opus 5.5, Haiku 5.5; profundidad de razonamiento; resúmenes de razonamiento; PDF escaneados; resúmenes de investigación por página |
| OpenAI | [Clave de API](https://platform.openai.com/api-keys) | La lista de modelos se obtiene del proveedor |
| Google Gemini | [Clave de API](https://aistudio.google.com/apikey) | Usa el endpoint de Gemini compatible con OpenAI |
| OpenRouter | [Clave de API](https://openrouter.ai/keys) | Cualquier modelo de OpenRouter con soporte de herramientas |
| Personalizado (compatible con OpenAI) | URL base, clave opcional | Ollama, LM Studio, vLLM, llama.cpp: cualquiera con `/chat/completions` |

Con proveedores distintos de Anthropic, la investigación lee cada página como texto sin procesar en lugar de un resumen de Haiku, lo que consume más tokens.

Los servidores locales bloquean las extensiones de navegador por defecto:

- **Ollama:** define `OLLAMA_ORIGINS=chrome-extension://*` y reinicia Ollama (macOS: `launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"`). URL base `http://localhost:11434/v1`.
- **LM Studio:** inicia el servidor con CORS activado, `lms server start --cors`. URL base `http://localhost:1234/v1`.

## Habilidades

Escribe `/` en el compositor para elegir una, o deja que el modelo cargue una cuando encaje.

| Comando | Qué hace |
|---|---|
| `/summarize` | Conclusión de una línea, puntos clave y acciones a realizar sobre la página actual |
| `/translate` | Traduce la página a tu idioma, conservando títulos y párrafos |
| `/extract` | Vuelca los datos de la página en una tabla Markdown; un archivo CSV o JSON cuando hay mucho contenido |
| `/compare` | Crea una tabla comparativa de precios, planes o especificaciones y resalta las diferencias |
| `/explain` | Explica la página, un término o un fragmento de código en palabras sencillas |
| `/thread` | Resume un hilo de comentarios: argumentos principales, cada postura, consenso, comentarios que vale la pena leer |
| `/reply` | Redacta una respuesta al correo o mensaje de la página; puede rellenar el cuadro de respuesta, pero nunca lo envía |
| `/fill-form` | Rellena el formulario con tus datos; pregunta por lo que falte y se detiene antes de enviarlo |
| `/review-pr` | Revisa un pull request de GitHub y enumera los problemas por gravedad, con archivo y línea |
| `/checklist` | Convierte un tutorial en una lista de comprobación de pasos |
| `/decide` | Expone las opciones, pregunta por tus necesidades una a una y luego recomienda una |
| `/grill-me` | Pon a prueba tu plan (o la propuesta de la página) con una pregunta de opción múltiple a la vez |

`/clear` empieza una conversación nueva. La investigación no necesita ningún comando: basta con preguntar.

### Escribe las tuyas

Una habilidad es un archivo Markdown con frontmatter `name` y `description`, seguido de instrucciones:

```markdown
---
name: meeting-notes
description: Turn a meeting page into decisions, action items and owners
---

1. Read the whole page with read_page.
2. List decisions, then a table of action items with owner and due date.
```

Gestiona las habilidades en **Ajustes → Habilidades**: crea, edita, exporta, importa un archivo `.md`, `.zip`/`.skill` o una carpeta de habilidad completa, o instala desde un enlace: `owner/repo/skill`, un enlace a una carpeta de GitHub, una página de skills.sh o su comando `npx skills add …`, una página de ClawHub, o cualquier enlace https a un `SKILL.md` o a un zip. Las habilidades siguen el estándar [Agent Skills](https://agentskills.io/specification), el mismo formato `SKILL.md` que usan Claude Code y otros agentes. Los archivos incluidos con una habilidad (por ejemplo `references/forms.md`) se guardan y el modelo solo los lee cuando las instrucciones los mencionan; los scripts incluidos se conservan como texto y nunca se ejecutan. Una línea opcional `model:` (por ejemplo `model: haiku`) ejecuta esa habilidad en un modelo Claude más económico; `disable-model-invocation: true` y `user-invocable: false` funcionan igual que en Claude Code, y `$ARGUMENTS` se sustituye por lo que escribas después de `/name`.

Solo los nombres y descripciones entran en el system prompt; el modelo llama a `use_skill` para cargar las instrucciones completas cuando las necesita, y escribir `/nombre` las adjunta directamente. Las habilidades son prompts: léela antes de importarla.

## Seguridad y privacidad

**Flujo de datos.** Una petición al modelo contiene tus mensajes, el contenido de la página que leyó el agente (o solo tu selección, o el PDF), los resúmenes de las páginas que investigó, tus recuerdos guardados y los nombres de tus habilidades.

- *Modo Cloud* envía esa petición al servidor de Browser Agent Cloud, que la reenvía al proveedor del modelo y devuelve la respuesta en streaming. El servidor conserva registros de uso (qué modelo, cuántos tokens, páginas, búsquedas y créditos usó una tarea) para contar los créditos. No guarda tus mensajes, el contenido de las páginas ni las respuestas del modelo; si el proveedor del modelo devuelve un error, ese mensaje de error puede conservarse junto al registro de uso para depuración.
- *Tu propia clave* envía las peticiones directamente de tu navegador a tu proveedor. Nada sobre tus tareas llega a los servidores de Browser Agent; el único contacto es el registro anónimo que se hizo al instalar la extensión.

Tus conversaciones, recuerdos, habilidades, ajustes y cualquier clave de API se guardan solo en `chrome.storage.local`. Sin analítica, sin anuncios. No se envía nada a ningún modelo antes de que aceptes el aviso de datos del primer uso. Detalles completos: [política de privacidad](store/privacy-policy.md).

**La investigación usa tu navegador.** Las pestañas en segundo plano cargan las páginas con tus cookies y sesiones iniciadas, exactamente como si las hubieras abierto tú; los PDF los descarga directamente la extensión, también con tus cookies. Las búsquedas son búsquedas normales de Google (o Bing) desde tu navegador, así que si has iniciado sesión pueden guardarse en el historial de búsquedas de esa cuenta. Las palabras clave de búsqueda las redacta el modelo a partir de tu pregunta.

**Qué necesita tu *Permitir*.** Estas acciones muestran una tarjeta en el panel lateral y no se ejecutan hasta que pulsas *Permitir*. La tarjeta vive en la propia página de la extensión, que un sitio web no puede pulsar por ti:

- clics y envíos de formulario que parecen irreversibles: el texto visible del botón, `aria-label`, title o value suena a pagar, comprar, pedir, eliminar, enviar, publicar, autorizar, guardar, compartir, instalar y similares (en los 15 idiomas de la interfaz); un formulario con varios campos o un campo de contraseña; un botón solo con icono dentro de un formulario; pulsar Intro en un campo que no está dentro de un formulario (cuadros de chat). Si el texto visible de un botón y su `aria-label` no coinciden, la tarjeta te avisa;
- ir a otro sitio en tu pestaña, ya sea navegando o haciendo clic en un enlace, salvo que sea el sitio donde empezó la tarea, uno que hayas nombrado en tu mensaje, o uno que ya hayas permitido en esta tarea;
- leer en segundo plano una página cuya dirección ha construido el propio agente. Sin preguntar, solo lee direcciones exactas de resultados de búsqueda, enlaces de páginas que ya leyó, direcciones de tu mensaje y sitios de investigación (GitHub, npm). Las páginas en `localhost` o en tu red local no se leen salvo que hayas escrito tú la dirección; en las páginas abiertas en una pestaña en segundo plano esto cubre también los dominios públicos que resuelven a una dirección local (en los PDF solo se comprueba la dirección en sí);
- guardar un recuerdo una vez que la conversación contiene contenido web (una página leída, un PDF, una selección).

Las tarjetas que implican una dirección la muestran con su cadena de consulta, porque una dirección puede sacar datos; las direcciones muy largas se acortan, conservando el dominio y el comienzo de la cadena de consulta.

Hacer clic en una sugerencia la envía al instante. Las sugerencias generadas a partir de la página se escriben tras leer su contenido, así que una página puede influir en ellas: los sitios que mencionan no cuentan como sitios que tú nombraste, y lo que desencadenen sigue pasando por las mismas tarjetas. Los enlaces en las respuestas muestran su dominio real junto al texto; la lista de fuentes muestra el dominio de cada fuente.

**Salida y archivos.** Las respuestas del modelo se procesan con DOMPurify. Se eliminan imágenes, medios, SVG, iframes, formularios y estilos en línea, así que una página no puede hacer que el modelo filtre tu conversación a través de la URL de una imagen. Los archivos generados son solo formatos de texto plano (`csv`, `json`, `md`, …), y las celdas de CSV/TSV que empiezan como una fórmula de hoja de cálculo se neutralizan.

### Limitaciones conocidas

- **La inyección de prompts no está resuelta.** El agente lee muchas páginas no confiables con tu sesión iniciada. Una página maliciosa puede intentar llevarlo a enviar tu conversación, tus recuerdos o datos de otros sitios a algún lugar, o a hacer cosas en tu nombre. Las tarjetas cubren las acciones de alto riesgo descritas arriba; no son una protección completa. Pequeñas cantidades de datos aún pueden filtrarse por los enlaces que el agente decida seguir o por lo que busque.
- No investigues ni ejecutes tareas en páginas no confiables mientras tengas abiertas pestañas de tu banco, correo o administración de empresa, y vigílalo mientras una tarea está en marcha.
- Detectar clics arriesgados es una heurística de palabras clave y forma del formulario. Se le escaparán algunos botones.
- Escribir en un campo del mismo sitio no pregunta. Una página maliciosa puede leer lo que escribe el agente (por ejemplo con un listener de `input`) y enviarlo a su propio servidor.
- Las habilidades importadas e instaladas son instrucciones de terceros. Mientras una esté en tu lista de habilidades (o la llames con `/name`), toda tarea se considera no fiable: guardar un recuerdo, abrir un enlace que construyó el agente o escribir texto que no diste tú pregunta antes. Estas habilidades muestran una etiqueta *De terceros* en la lista. Las habilidades que escribes tú son de confianza. Las habilidades añadidas antes de esta versión no tienen un origen registrado, así que también se tratan como de terceros; si escribiste una tú mismo, ábrela y elige **Lo escribí yo**. Instala solo habilidades de fuentes en las que confíes.
- Los recuerdos y conversaciones se guardan sin cifrar en tu navegador y se envían con cada petición al modelo (a través de Browser Agent Cloud, o a tu propio proveedor).

## Idiomas

English, 繁體中文, 简体中文, 日本語, 한국어, Español, Français, Deutsch, Português (Brasil), Italiano, Русский, Tiếng Việt, Bahasa Indonesia, ไทย, Türkçe. El idioma predeterminado sigue al de tu navegador; cámbialo en **Ajustes → Idioma**. El modelo responde en el idioma de tu interfaz, a menos que escribas en otro.

## Desarrollo

```bash
npm run watch      # rebuild on save; then click reload on the extension card
npm run typecheck  # tsc --noEmit
npm run check      # unit self-checks: skills, memory, history, files, providers, security, i18n
npm run test:e2e   # builds into dist/e2e-ext and runs it in Playwright against mocked model, backend, search and websites
```

El panel lateral es React + TypeScript empaquetado con esbuild en `extension/`. `src/agent.ts` ejecuta el bucle del agente en el panel lateral: en modo Cloud llama a la API de Browser Agent Cloud (compatible con Anthropic, con la dirección fijada por `BA_BACKEND` en tiempo de compilación) mediante el SDK oficial; con tu propia clave llama a Anthropic directamente o a cualquier API compatible con OpenAI mediante `src/providers.ts`. Las herramientas de `src/tools.ts` se ejecutan en la pestaña activa o en pestañas en segundo plano con `chrome.scripting`; `src/elements.ts` genera la lista numerada de elementos y la comprobación de acciones irreversibles. La suite e2e no necesita clave de API, no gasta nada y no hace peticiones al internet real.

El propósito de cada archivo se describe en la tabla de [Development](README.md#development) de la versión en inglés.

Para añadir una herramienta: agrega su esquema a `tools` en `src/shared.ts` y un `case` en `runTool` en `src/tools.ts`.

### Traducción

Copia `src/i18n/locales/en.ts` como, por ejemplo, `nl.ts`, decláralo como `const nl: Dict = { … }`, traduce los valores (conserva cada `{placeholder}`) y añádelo a `LANGS` y a los cargadores en `src/i18n/index.ts`. `npm run typecheck` falla si falta o sobra alguna clave; `npm run check` falla si un placeholder no coincide. Los prompts y las descripciones de herramientas que se envían al modelo se mantienen en un solo idioma a propósito. Para el nombre y la descripción en la Chrome Web Store, añade `extension/_locales/<code>/messages.json` (Chrome usa guiones bajos, por ejemplo `pt_BR`).

## Contribuir

Se aceptan issues y PR; consulta [CONTRIBUTING.md](CONTRIBUTING.md). Mantén los PR pequeños, ejecuta las tres comprobaciones de arriba y explica cómo probaste lo que no cubren.

## Licencia

La extensión es [MIT](LICENSE). Browser Agent Cloud, el servicio alojado opcional detrás del modo por defecto, se opera por separado y no forma parte de este repositorio. Browser Agent es un proyecto independiente, sin afiliación con Anthropic, OpenAI ni Google.

---

<p align="center"><a href="https://iosoftware.ai"><img src="docs/supported-by-iosoftware.svg" alt="Supported by io Software" height="32"></a></p>
