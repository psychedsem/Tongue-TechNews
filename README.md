# Tongue // Tech News

[![CI/CD](https://github.com/psychedsem/Tongue-TechNews/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/psychedsem/Tongue-TechNews/actions/workflows/ci.yml)

Web app sviluppata in JavaScript ES6+ per il brand editoriale ipotetico **Tongue**. La homepage recupera progressivamente le ultime notizie tech tramite Hacker News API; il sito include inoltre le sezioni **Chi siamo** ed **Eventi** per rappresentare anche la dimensione editoriale e community descritta nel brief.

Il progetto è stato successivamente esteso con un ciclo DevOps completo: containerizzazione, pipeline CI/CD con GitHub Actions, deploy automatico su GitHub Pages, gestione delle variabili d'ambiente e monitoraggio con UptimeRobot e Sentry.

> **Versione applicativa:** `1.0.0`

> **Produzione DevOps:** [psychedsem.github.io/Tongue-TechNews](https://psychedsem.github.io/Tongue-TechNews/)

> **Demo originale JS:** [tongue-technews.netlify.app](https://tongue-technews.netlify.app)

> **Repository:** [github.com/psychedsem/Tongue-TechNews](https://github.com/psychedsem/Tongue-TechNews)

## Funzionamento del feed

1. All'avvio l'app recupera una sola volta la lista degli ID da `newstories`.
2. Seleziona i primi 10 ID.
3. Recupera in parallelo il dettaglio delle 10 news tramite gli endpoint `item/{id}`.
4. Normalizza i dati con `NewsFactory` e li visualizza nell'interfaccia.
5. Il pulsante **Load more** usa un batch configurabile: 10, 20, 50 oppure un valore personalizzato fino a 50.
6. Il limite massimo di **50 elementi per batch** è indicato direttamente nell'interfaccia.
7. Se una singola richiesta di dettaglio fallisce, le altre news disponibili vengono comunque mostrate.
8. Quando vengono raggiunti tutti gli ID disponibili, il caricamento progressivo termina senza richiedere elementi oltre la lista restituita da Hacker News.

## Sezioni

- **Home / Tech News** - feed Hacker News con 10 news iniziali e caricamento progressivo a batch configurabile.
- **Chi siamo** - presentazione del progetto editoriale Tongue e rimando alla community Instagram.
- **Eventi** - introduzione alle iniziative live, focus sugli Swap Party e 15 eventi demo ambientati in città reali dell'UE e del Regno Unito. Ne vengono mostrati 5 all'avvio, poi il caricamento usa lo stesso selettore batch delle news.

La navbar è sticky, evidenzia la sezione attiva e mostra il logo Tongue durante lo scroll. Il logo Instagram utilizza un link dimostrativo alla homepage di Instagram.

## Architettura applicativa

Il frontend usa ES Modules e mantiene una struttura volutamente semplice:

- `src/js/api.js` - richieste a Hacker News tramite Axios e gestione dei batch paralleli.
- `src/js/factory.js` - **Factory Pattern** per trasformare gli item API in oggetti coerenti e pronti per la UI.
- `src/js/news.js` - caricamento, stato, paginazione e rendering del feed news.
- `src/js/events.js` - dati, stato e gestione degli eventi demo.
- `src/js/utils.js` - funzioni riutilizzabili per date, URL, batch e paginazione.
- `src/js/main.js` - avvio dell'app, gestione della navbar, toast demo e inizializzazione di Sentry.
- `tests/` - test automatici con Vitest.
- `backend/` - piccolo backend Express dedicato all'ambiente Docker locale, con proxy verso Hacker News e endpoint `/health`.

La gestione dei dettagli delle news usa `Promise.allSettled()` per eseguire le richieste in parallelo senza perdere l'intero batch quando una singola richiesta fallisce.

Il backend Express incluso in questo repository serve esclusivamente a completare l'architettura locale multi-container del progetto DevOps. Non viene distribuito su GitHub Pages: in produzione il frontend continua a interrogare direttamente Hacker News.

## Architettura DevOps

Il flusso principale è:

```text
Sviluppo su devops
        ↓
Push / Pull Request
        ↓
GitHub Actions
        ↓
Lint → Test → Build → Docker validation/build
        ↓
Push su main
        ↓
Build GitHub Pages → Artifact → Deploy
        ↓
Produzione
        ↓
UptimeRobot + Sentry
```

In locale, Docker Compose coordina invece i due servizi:

```text
Browser
   ↓
Frontend Nginx :8081
   ↓ /api
Backend Express :3000
   ↓
Hacker News API
```

## Ambienti

| Ambiente | Scopo | Configurazione |
| --- | --- | --- |
| **Development** | Sviluppo e test locali | Branch `devops`, Vite, Node.js; accesso diretto a Hacker News oppure stack Docker locale |
| **Staging** | Validazione production-like prima della produzione | Build locale/containerizzata e pipeline GitHub Actions sul branch `devops`; non è previsto un ambiente staging pubblico persistente |
| **Production** | Versione pubblica per gli utenti | Branch `main`, build e deploy automatici su GitHub Pages |

La separazione tra gli ambienti permette di validare il codice prima del rilascio pubblico e di mantenere il deploy in produzione legato esclusivamente a `main`.

## Scelta della piattaforma CI/CD

È stato scelto **GitHub Actions** al posto di GitLab CI/CD perché il repository è già ospitato su GitHub e la piattaforma consente di integrare nello stesso progetto:

- trigger su push e pull request;
- lint, test e build automatici;
- build delle immagini Docker;
- artifact di GitHub Pages;
- deploy automatico su GitHub Pages;
- storico dei run e dei relativi log.

Questa soluzione riduce la configurazione esterna e mantiene repository, automazione e deploy nello stesso ecosistema.

## Tecnologie

### Applicazione

- JavaScript ES6+
- Vite
- Axios
- Vitest
- ESLint
- Hacker News API
- HTML5 / CSS3
- Google Fonts: Quantico, Turret Road, Science Gothic

### DevOps

- Git e GitHub
- GitHub Actions
- Docker
- Docker Compose
- Nginx
- Node.js / Express
- GitHub Pages
- UptimeRobot
- Sentry

## Requisiti

Per lavorare sul progetto sono consigliati:

- Node.js 24
- npm
- Git
- Docker con Docker Compose

## Avvio locale

Clona il repository e installa le dipendenze:

```bash
git clone https://github.com/psychedsem/Tongue-TechNews.git
cd Tongue-TechNews
npm ci
```

Avvia il frontend con Vite:

```bash
npm run dev
```

Se `VITE_API_BASE_URL` non è configurata, il frontend usa direttamente:

```text
https://hacker-news.firebaseio.com/v0
```

## Variabili d'ambiente

Il file `.env.example` documenta le variabili disponibili:

```env
# Optional local API proxy
VITE_API_BASE_URL=

# Sentry error monitoring
VITE_SENTRY_DSN=
```

Per una configurazione locale è possibile creare un file `.env` partendo dall'esempio.

Il file `.env` reale non viene versionato. `.gitignore` esclude `.env` e gli altri file `.env.*`, mantenendo tracciato solo `.env.example`.

### `VITE_API_BASE_URL`

È opzionale.

Se resta vuota, il frontend interroga direttamente Hacker News. Nell'ambiente Docker viene impostata automaticamente a `/api`, così le richieste passano attraverso il backend Express.

### `VITE_SENTRY_DSN`

Configura il progetto Sentry.

In locale può essere inserita nel file `.env`. Nel deploy GitHub Pages viene fornita alla build tramite una **GitHub Actions Repository Variable**.

Il DSN del Browser SDK di Sentry è un identificatore client destinato a essere usato nel frontend e non viene trattato come una credenziale privata. Eventuali token, password o chiavi realmente sensibili devono invece essere configurati tramite **GitHub Secrets** e non devono essere inseriti nel repository o stampati nei log della pipeline.

## Docker e Docker Compose

Il progetto contiene due Dockerfile:

- `Dockerfile` nella root per il frontend;
- `backend/Dockerfile` per il backend Express.

Il frontend usa una build multi-stage:

```text
Node.js → npm ci → Vite build → Nginx
```

Nginx serve i file statici e inoltra le richieste `/api/` al servizio `backend`.

Avvia l'intero stack:

```bash
docker compose up --build
```

L'applicazione containerizzata è disponibile su:

```text
http://localhost:8081
```

Arresta i container:

```bash
docker compose down
```

Per validare la configurazione Compose senza avviare i servizi:

```bash
docker compose config
```

Per costruire soltanto le immagini:

```bash
docker compose build
```

Il backend espone la porta `3000` solo all'interno della rete Docker Compose e include:

```text
GET /health
GET /api/newstories.json
GET /api/item/:id.json
```

## Qualità, lint e test

Il progetto include **6 file di test e 19 test automatici**.

Le descrizioni dei test sono scritte in inglese e verificano i comportamenti principali relativi a:

- configurazione della base URL API;
- gestione e validazione del batch;
- formattazione delle date;
- comunicazione con Hacker News API;
- normalizzazione tramite `NewsFactory`;
- paginazione e gestione degli elementi rimanenti.

Esegui il lint:

```bash
npm run lint
```

Esegui tutti i test:

```bash
npm run test:run
```

Esegui la build:

```bash
npm run build
```

Per test e build in sequenza:

```bash
npm run check
```

Stato verificato:

```text
Test Files  6 passed (6)
Tests       19 passed (19)
Lint        OK
Build       OK
```

## Pipeline CI/CD

Il workflow è definito in:

```text
.github/workflows/ci.yml
```

La pipeline si attiva:

- a ogni push su `devops`;
- a ogni push su `main`;
- sulle pull request verso `main`.

### Continuous Integration

Il job `ci` esegue in sequenza:

```text
Checkout
→ Setup Node.js 24
→ npm ci
→ Lint
→ Test
→ Build frontend
→ docker compose config
→ docker compose build
```

Se uno step fallisce, il job si interrompe e la pipeline viene segnalata come fallita.

### Continuous Deployment

Su un push a `main`, e solo dopo il completamento positivo della CI:

1. `pages-build` ricostruisce il frontend con base path `/Tongue-TechNews/`;
2. la directory `dist` viene caricata come **GitHub Pages artifact**;
3. il job `deploy` distribuisce quell'artifact su GitHub Pages.

Il deploy in produzione è quindi automatico e dipende dal superamento della pipeline.

## Deploy

La versione pubblica è disponibile qui:

**[https://psychedsem.github.io/Tongue-TechNews/](https://psychedsem.github.io/Tongue-TechNews/)**

Ogni push valido su `main` attiva automaticamente:

```text
CI → Pages build → Deploy
```

Non è necessario un deploy manuale.

### Deployment originale su Netlify

La versione sviluppata originariamente per il progetto **JavaScript Advanced** era stata pubblicata su Netlify:

**[https://tongue-technews.netlify.app](https://tongue-technews.netlify.app)**

Questo deployment non viene più aggiornato ed è mantenuto come riferimento della versione precedente all'estensione DevOps.

La produzione attuale del progetto DevOps è invece distribuita automaticamente tramite GitHub Actions su GitHub Pages.

## Monitoraggio

Il monitoraggio copre due aspetti distinti: disponibilità esterna del sito ed errori applicativi nel browser.

### UptimeRobot

La produzione è monitorata dall'esterno con **UptimeRobot** tramite un monitor HTTP(S):

```text
Nome: Tongue TechNews Production
URL: https://psychedsem.github.io/Tongue-TechNews/
Intervallo: 5 minuti
Alert: email
```

UptimeRobot verifica periodicamente che il sito sia raggiungibile e registra eventuali downtime e incidenti.

### Sentry

Gli errori JavaScript del frontend vengono tracciati con **Sentry** tramite `@sentry/browser`.

L'SDK viene inizializzato in `src/js/main.js` usando:

```text
VITE_SENTRY_DSN
```

e distingue l'ambiente tramite `import.meta.env.MODE`.

L'integrazione è stata verificata anche sulla versione pubblica generando un errore di test controllato:

```text
Tongue production Sentry test
```

L'evento è stato registrato da Sentry con ambiente `production` e URL `https://psychedsem.github.io/Tongue-TechNews/`.

In caso di errore, la sezione **Issues** di Sentry permette di controllare stack trace, browser, sistema operativo, URL e numero di occorrenze.

## Design

L'interfaccia usa una direzione cyber-editoriale ispirata alla palette *Matrix Code Green*: Vampire Black `#0D0208`, Dark Green `#003B00`, Islam Green `#008F11`, Erin `#00FF41`; con l'aggiunta di Neon Purple `#B026FF` e Deep Purple `#2A0042` per alcuni dettagli decorativi.

Sono stati usati i font Science Gothic e Turret Road per i titoli primari e secondari e Quantico per il corpo testo.

Le card di news ed eventi usano `#002101` come base e si accendono verso il Dark Green in hover/focus. Le CTA `READ ↗` e `REGISTRATI ↗` usano il viola scuro `#1A0626`.

Card e controlli restano volutamente squadrati, con accenti neon concentrati su stroke, stati attivi e micro-elementi.

## Batch configurabile

Il selettore accanto a `Load more` propone 10, 20 e 50 elementi.

Il limite **MAX 50** è sempre visibile nel controllo batch, così l'utente conosce immediatamente il numero massimo di elementi caricabili in una singola operazione.

Con `CUSTOM` si può inserire un valore da 1 a 50. La validazione impedisce di superare il limite massimo o scendere sotto il valore minimo consentito.

Se restano meno elementi del batch richiesto, l'app mostra soltanto quelli ancora disponibili. Il caricamento termina correttamente quando vengono raggiunti tutti gli ID restituiti da Hacker News.

## Note demo

- Gli eventi e le relative registrazioni sono fittizi e servono esclusivamente a rappresentare il brief.
- I luoghi indicati negli eventi sono città e regioni reali dell'UE o del Regno Unito.
- Il link Instagram è dimostrativo e non rappresenta una pagina reale di Tongue.
- Il backend Express incluso nel repository è un componente locale del progetto DevOps e non è distribuito su GitHub Pages.

## Contatti

Per informazioni sul progetto o per entrare in contatto con me:

- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)
