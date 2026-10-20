# Tongue // Tech News

![Tongue // Tech News](Tongue%20%28cover%29.png)

[![CI/CD](https://github.com/psychedsem/Tongue-TechNews/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/psychedsem/Tongue-TechNews/actions/workflows/ci.yml)

## 🇬🇧 English

JavaScript ES6+ web app created for the fictional editorial brand **Tongue**. The homepage progressively loads the latest tech news from the Hacker News API, while the **About** and **Events** sections extend the project into an editorial and community-oriented experience.

The project was later expanded into a complete DevOps workflow with containerization, CI/CD through GitHub Actions, automated deployment to GitHub Pages, environment configuration, and production monitoring with UptimeRobot and Sentry.

> **Application version:** `1.0.0`  
> **Production:** [psychedsem.github.io/Tongue-TechNews](https://psychedsem.github.io/Tongue-TechNews/)  
> **Repository:** [github.com/psychedsem/Tongue-TechNews](https://github.com/psychedsem/Tongue-TechNews)

### News feed

1. On startup, the app fetches the `newstories` ID list once.
2. It loads the first 10 IDs and retrieves their details in parallel through `item/{id}`.
3. `NewsFactory` normalizes the API data before rendering it in the UI.
4. **Load more** supports batches of 10, 20, 50, or a custom value up to 50.
5. If a single detail request fails, the remaining available stories are still displayed.
6. Loading stops cleanly when all IDs returned by Hacker News have been reached.

The **MAX 50** limit is always visible in the batch selector. If fewer items remain than requested, only the remaining items are loaded.

### Sections

- **Home / Tech News** — Hacker News feed with 10 initial stories and progressive batch loading.
- **About** — overview of the Tongue editorial concept and a demo link to the Instagram community.
- **Events** — introduction to live initiatives, including Swap Parties and 15 demo events set in real cities across the EU and UK. Five are shown initially, with the same batch selector used by the news feed.

The sticky navbar highlights the active section and displays the Tongue logo while scrolling.

### Application architecture

The frontend uses ES Modules and keeps the structure intentionally simple:

- `src/js/api.js` — Hacker News requests via Axios and parallel batch handling.
- `src/js/factory.js` — **Factory Pattern** used to normalize API items for the UI.
- `src/js/news.js` — news loading, state, pagination, and rendering.
- `src/js/events.js` — demo event data and state management.
- `src/js/utils.js` — reusable helpers for dates, URLs, batches, and pagination.
- `src/js/main.js` — app bootstrap, navbar logic, demo toasts, and Sentry initialization.
- `tests/` — automated tests with Vitest.
- `backend/` — lightweight Express backend used only by the local Docker environment, with a Hacker News proxy and `/health` endpoint.

News details are loaded with `Promise.allSettled()`, allowing a batch to continue even when one request fails.

The Express backend exists only for the local multi-container DevOps architecture. It is not deployed to GitHub Pages: production continues to call Hacker News directly from the frontend.

### DevOps architecture

Main delivery flow:

```text
Development on devops
        ↓
Push / Pull Request
        ↓
GitHub Actions
        ↓
Lint → Test → Build → Docker validation/build
        ↓
Push to main
        ↓
GitHub Pages build → Artifact → Deploy
        ↓
Production
        ↓
UptimeRobot + Sentry
```

Local Docker Compose architecture:

```text
Browser
   ↓
Frontend Nginx :8081
   ↓ /api
Backend Express :3000
   ↓
Hacker News API
```

The backend also exposes `/health` inside the local Compose environment.

### Environments

| Environment | Purpose | Configuration |
| --- | --- | --- |
| **Development** | Local development and testing | `devops` branch, Vite, Node.js; direct Hacker News access or local Docker stack |
| **Staging** | Production-like validation before release | Local/containerized builds and GitHub Actions on `devops`; no persistent public staging environment |
| **Production** | Public user-facing version | `main` branch, automated build and deployment to GitHub Pages |

This separation keeps production releases tied exclusively to `main` and ensures the code is validated before deployment.

### Why GitHub Actions

**GitHub Actions** was selected because the repository already lives on GitHub, allowing the project to keep the entire CI/CD workflow in one ecosystem:

- push and pull request triggers;
- automated lint, tests, and builds;
- Docker image builds;
- GitHub Pages artifacts;
- automated deployment;
- run history and logs.

This avoids unnecessary external CI/CD infrastructure while keeping repository, automation, and deployment tightly integrated.

### Technologies

#### Application

- JavaScript ES6+
- Vite
- Axios
- Vitest
- ESLint
- Hacker News API
- HTML5 / CSS3
- Google Fonts: Quantico, Turret Road, Science Gothic

#### DevOps

- Git and GitHub
- GitHub Actions
- Docker
- Docker Compose
- Nginx
- Node.js / Express
- GitHub Pages
- UptimeRobot
- Sentry

### Requirements

Recommended local tools:

- Node.js 24
- npm
- Git
- Docker with Docker Compose

### Local development

Clone the repository and install dependencies:

```bash
git clone https://github.com/psychedsem/Tongue-TechNews.git
cd Tongue-TechNews
npm ci
```

Start the frontend with Vite:

```bash
npm run dev
```

If `VITE_API_BASE_URL` is not configured, the frontend uses the Hacker News API directly:

```text
https://hacker-news.firebaseio.com/v0
```

### Environment variables

`.env.example` documents the available variables:

```env
# Optional local API proxy
VITE_API_BASE_URL=

# Sentry error monitoring
VITE_SENTRY_DSN=
```

For local configuration, create a `.env` file from the example. Real `.env` files are excluded by `.gitignore`; only `.env.example` is tracked.

#### `VITE_API_BASE_URL`

Optional. If left empty, the frontend calls Hacker News directly. In Docker it is automatically set to `/api`, routing requests through the Express backend.

#### `VITE_SENTRY_DSN`

Configures the Sentry project.

Locally it can be set in `.env`. For GitHub Pages, it is passed to the build through a **GitHub Actions Repository Variable**.

The Sentry Browser SDK DSN is client-side configuration, not a private credential. Real secrets such as passwords, tokens, or private keys must use **GitHub Secrets** and must never be committed or printed in pipeline logs.

### Docker and Docker Compose

The project includes two Dockerfiles:

- root `Dockerfile` for the frontend;
- `backend/Dockerfile` for the Express backend.

Frontend multi-stage build:

```text
Node.js → npm ci → Vite build → Nginx
```

Nginx serves the static frontend and proxies `/api/` requests to the `backend` service.

Start the complete stack:

```bash
docker compose up --build
```

Open:

```text
http://localhost:8081
```

Stop the containers:

```bash
docker compose down
```

Validate Compose configuration without starting services:

```bash
docker compose config
```

Build the images only:

```bash
docker compose build
```

The backend exposes port `3000` only inside the Docker Compose network and provides:

```text
GET /health
GET /api/newstories.json
GET /api/item/:id.json
```

### Quality, lint, and tests

The project includes **6 test files and 19 automated tests** covering:

- API base URL configuration;
- batch validation and handling;
- date formatting;
- Hacker News API communication;
- `NewsFactory` normalization;
- pagination and remaining-item logic.

Run lint:

```bash
npm run lint
```

Run all tests:

```bash
npm run test:run
```

Build the application:

```bash
npm run build
```

Run tests and build in sequence:

```bash
npm run check
```

Verified status:

```text
Test Files  6 passed (6)
Tests       19 passed (19)
Lint        OK
Build       OK
```

### CI/CD pipeline

The workflow is defined in:

```text
.github/workflows/ci.yml
```

It runs on:

- every push to `devops`;
- every push to `main`;
- pull requests targeting `main`.

#### Continuous Integration

The `ci` job runs:

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

If any step fails, the job stops and the pipeline is marked as failed.

#### Continuous Deployment

On pushes to `main`, and only after CI succeeds:

1. `pages-build` rebuilds the frontend with base path `/Tongue-TechNews/`;
2. `dist` is uploaded as a **GitHub Pages artifact**;
3. `deploy` publishes that artifact to GitHub Pages.

Production deployment is fully automated and depends on a successful pipeline.

### Deployment

Production is available at:

**[https://psychedsem.github.io/Tongue-TechNews/](https://psychedsem.github.io/Tongue-TechNews/)**

Every valid push to `main` triggers:

```text
CI → Pages build → Deploy
```

No manual deployment is required.

### Monitoring

Monitoring covers two separate layers: external availability and client-side application errors.

#### UptimeRobot

Production is monitored externally through an HTTP(S) monitor:

```text
Name: Tongue TechNews Production
URL: https://psychedsem.github.io/Tongue-TechNews/
Interval: 5 minutes
Alert: email
```

UptimeRobot continuously checks availability and records downtime or incidents.

#### Sentry

Frontend JavaScript errors are tracked with **Sentry** through `@sentry/browser`.

The SDK is initialized in `src/js/main.js` using:

```text
VITE_SENTRY_DSN
```

and identifies the environment through `import.meta.env.MODE`.

The integration was verified in production with the controlled test event:

```text
Tongue production Sentry test
```

Sentry recorded the event with `environment: production` and the correct GitHub Pages URL. Its **Issues** view provides stack trace, browser, operating system, URL, environment, and occurrence details.

### Design

The interface follows a cyber-editorial direction inspired by *Matrix Code Green*:

- Vampire Black `#0D0208`
- Dark Green `#003B00`
- Islam Green `#008F11`
- Erin `#00FF41`
- Neon Purple `#B026FF`
- Deep Purple `#2A0042`

Science Gothic and Turret Road are used for primary and secondary headings, while Quantico is used for body text.

News and event cards use `#002101` as their base and shift toward Dark Green on hover/focus. CTA elements use dark purple `#1A0626`, while neon accents are concentrated on strokes, active states, and small interface details.

### Demo notes

- Events and registrations are fictional and exist only to represent the original project brief.
- Event locations use real cities and regions across the EU and UK.
- The Instagram link is demonstrative and does not represent a real Tongue page.
- The Express backend is a local DevOps component and is not deployed to GitHub Pages.

### Contact

For project information or to get in touch:

- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)

---

## 🇮🇹 Italiano

Web app sviluppata in JavaScript ES6+ per il brand editoriale ipotetico **Tongue**. La homepage carica progressivamente le ultime notizie tech tramite Hacker News API, mentre le sezioni **Chi siamo** ed **Eventi** ampliano il progetto verso una dimensione editoriale e community.

Il progetto è stato successivamente esteso con un ciclo DevOps completo: containerizzazione, CI/CD con GitHub Actions, deploy automatico su GitHub Pages, gestione delle variabili d'ambiente e monitoraggio della produzione con UptimeRobot e Sentry.

> **Versione applicativa:** `1.0.0`  
> **Produzione:** [psychedsem.github.io/Tongue-TechNews](https://psychedsem.github.io/Tongue-TechNews/)  
> **Repository:** [github.com/psychedsem/Tongue-TechNews](https://github.com/psychedsem/Tongue-TechNews)

### Feed delle news

1. All'avvio l'app recupera una sola volta la lista degli ID da `newstories`.
2. Carica i primi 10 ID e ne recupera i dettagli in parallelo tramite `item/{id}`.
3. `NewsFactory` normalizza i dati API prima del rendering nell'interfaccia.
4. **Load more** supporta batch da 10, 20, 50 oppure un valore personalizzato fino a 50.
5. Se una singola richiesta di dettaglio fallisce, le altre news disponibili vengono comunque mostrate.
6. Il caricamento termina correttamente quando vengono raggiunti tutti gli ID restituiti da Hacker News.

Il limite **MAX 50** è sempre visibile nel selettore batch. Se restano meno elementi di quelli richiesti, vengono caricati solo quelli ancora disponibili.

### Sezioni

- **Home / Tech News** — feed Hacker News con 10 news iniziali e caricamento progressivo a batch.
- **Chi siamo** — panoramica del concept editoriale Tongue e link dimostrativo alla community Instagram.
- **Eventi** — introduzione alle iniziative live, inclusi gli Swap Party e 15 eventi demo ambientati in città reali dell'UE e del Regno Unito. Ne vengono mostrati 5 inizialmente, usando poi lo stesso selettore batch delle news.

La navbar sticky evidenzia la sezione attiva e mostra il logo Tongue durante lo scroll.

### Architettura applicativa

Il frontend usa ES Modules e mantiene una struttura volutamente semplice:

- `src/js/api.js` — richieste a Hacker News tramite Axios e gestione dei batch paralleli.
- `src/js/factory.js` — **Factory Pattern** per normalizzare gli item API destinati alla UI.
- `src/js/news.js` — caricamento, stato, paginazione e rendering delle news.
- `src/js/events.js` — dati demo e gestione dello stato degli eventi.
- `src/js/utils.js` — utility riutilizzabili per date, URL, batch e paginazione.
- `src/js/main.js` — avvio dell'app, navbar, toast demo e inizializzazione di Sentry.
- `tests/` — test automatici con Vitest.
- `backend/` — backend Express leggero usato solo nell'ambiente Docker locale, con proxy verso Hacker News ed endpoint `/health`.

I dettagli delle news vengono caricati con `Promise.allSettled()`, così un singolo errore non interrompe l'intero batch.

Il backend Express serve esclusivamente all'architettura DevOps locale multi-container. Non viene distribuito su GitHub Pages: in produzione il frontend continua a interrogare direttamente Hacker News.

### Architettura DevOps

Flusso principale:

```text
Sviluppo su devops
        ↓
Push / Pull Request
        ↓
GitHub Actions
        ↓
Lint → Test → Build → validazione/build Docker
        ↓
Push su main
        ↓
Build GitHub Pages → Artifact → Deploy
        ↓
Produzione
        ↓
UptimeRobot + Sentry
```

Architettura locale Docker Compose:

```text
Browser
   ↓
Frontend Nginx :8081
   ↓ /api
Backend Express :3000
   ↓
Hacker News API
```

Il backend espone anche `/health` all'interno dell'ambiente Compose locale.

### Ambienti

| Ambiente | Scopo | Configurazione |
| --- | --- | --- |
| **Development** | Sviluppo e test locali | Branch `devops`, Vite, Node.js; accesso diretto a Hacker News oppure stack Docker locale |
| **Staging** | Validazione production-like prima del rilascio | Build locali/containerizzate e GitHub Actions su `devops`; nessun ambiente staging pubblico persistente |
| **Production** | Versione pubblica per gli utenti | Branch `main`, build e deploy automatici su GitHub Pages |

Questa separazione mantiene il rilascio in produzione legato esclusivamente a `main` e permette di validare il codice prima del deploy.

### Perché GitHub Actions

È stato scelto **GitHub Actions** perché il repository è già ospitato su GitHub e consente di mantenere l'intero flusso CI/CD nello stesso ecosistema:

- trigger su push e pull request;
- lint, test e build automatici;
- build delle immagini Docker;
- artifact di GitHub Pages;
- deploy automatico;
- storico dei run e relativi log.

La soluzione evita infrastrutture CI/CD esterne non necessarie e mantiene repository, automazione e deploy strettamente integrati.

### Tecnologie

#### Applicazione

- JavaScript ES6+
- Vite
- Axios
- Vitest
- ESLint
- Hacker News API
- HTML5 / CSS3
- Google Fonts: Quantico, Turret Road, Science Gothic

#### DevOps

- Git e GitHub
- GitHub Actions
- Docker
- Docker Compose
- Nginx
- Node.js / Express
- GitHub Pages
- UptimeRobot
- Sentry

### Requisiti

Strumenti consigliati in locale:

- Node.js 24
- npm
- Git
- Docker con Docker Compose

### Avvio locale

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

Se `VITE_API_BASE_URL` non è configurata, il frontend usa direttamente Hacker News:

```text
https://hacker-news.firebaseio.com/v0
```

### Variabili d'ambiente

`.env.example` documenta le variabili disponibili:

```env
# Optional local API proxy
VITE_API_BASE_URL=

# Sentry error monitoring
VITE_SENTRY_DSN=
```

Per la configurazione locale è possibile creare `.env` partendo dall'esempio. I file `.env` reali sono esclusi da `.gitignore`; viene tracciato solo `.env.example`.

#### `VITE_API_BASE_URL`

È opzionale. Se resta vuota, il frontend interroga direttamente Hacker News. In Docker viene impostata automaticamente a `/api`, facendo passare le richieste attraverso il backend Express.

#### `VITE_SENTRY_DSN`

Configura il progetto Sentry.

In locale può essere impostata in `.env`. Su GitHub Pages viene fornita alla build tramite una **GitHub Actions Repository Variable**.

Il DSN del Browser SDK di Sentry è una configurazione client, non una credenziale privata. Segreti reali come password, token o chiavi private devono usare **GitHub Secrets** e non devono essere committati o stampati nei log della pipeline.

### Docker e Docker Compose

Il progetto include due Dockerfile:

- `Dockerfile` nella root per il frontend;
- `backend/Dockerfile` per il backend Express.

Build multi-stage del frontend:

```text
Node.js → npm ci → Vite build → Nginx
```

Nginx serve il frontend statico e inoltra le richieste `/api/` al servizio `backend`.

Avvia l'intero stack:

```bash
docker compose up --build
```

Apri:

```text
http://localhost:8081
```

Arresta i container:

```bash
docker compose down
```

Valida la configurazione Compose senza avviare i servizi:

```bash
docker compose config
```

Costruisci soltanto le immagini:

```bash
docker compose build
```

Il backend espone la porta `3000` solo nella rete Docker Compose e fornisce:

```text
GET /health
GET /api/newstories.json
GET /api/item/:id.json
```

### Qualità, lint e test

Il progetto include **6 file di test e 19 test automatici** che coprono:

- configurazione della base URL API;
- validazione e gestione del batch;
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

Esegui test e build in sequenza:

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

### Pipeline CI/CD

Il workflow è definito in:

```text
.github/workflows/ci.yml
```

Si attiva:

- a ogni push su `devops`;
- a ogni push su `main`;
- sulle pull request verso `main`.

#### Continuous Integration

Il job `ci` esegue:

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

#### Continuous Deployment

Sui push a `main`, e solo dopo una CI riuscita:

1. `pages-build` ricostruisce il frontend con base path `/Tongue-TechNews/`;
2. `dist` viene caricato come **GitHub Pages artifact**;
3. `deploy` pubblica l'artifact su GitHub Pages.

Il deploy in produzione è completamente automatico e dipende dal superamento della pipeline.

### Deploy

La produzione è disponibile qui:

**[https://psychedsem.github.io/Tongue-TechNews/](https://psychedsem.github.io/Tongue-TechNews/)**

Ogni push valido su `main` attiva:

```text
CI → Pages build → Deploy
```

Non è richiesto alcun deploy manuale.

### Monitoraggio

Il monitoraggio copre due livelli distinti: disponibilità esterna ed errori applicativi lato client.

#### UptimeRobot

La produzione è monitorata esternamente tramite un monitor HTTP(S):

```text
Nome: Tongue TechNews Production
URL: https://psychedsem.github.io/Tongue-TechNews/
Intervallo: 5 minuti
Alert: email
```

UptimeRobot verifica continuamente la disponibilità e registra eventuali downtime o incidenti.

#### Sentry

Gli errori JavaScript del frontend vengono tracciati con **Sentry** tramite `@sentry/browser`.

L'SDK viene inizializzato in `src/js/main.js` usando:

```text
VITE_SENTRY_DSN
```

e identifica l'ambiente tramite `import.meta.env.MODE`.

L'integrazione è stata verificata in produzione con l'evento di test controllato:

```text
Tongue production Sentry test
```

Sentry ha registrato l'evento con `environment: production` e l'URL GitHub Pages corretto. La sezione **Issues** mostra stack trace, browser, sistema operativo, URL, ambiente e numero di occorrenze.

### Design

L'interfaccia segue una direzione cyber-editoriale ispirata alla palette *Matrix Code Green*:

- Vampire Black `#0D0208`
- Dark Green `#003B00`
- Islam Green `#008F11`
- Erin `#00FF41`
- Neon Purple `#B026FF`
- Deep Purple `#2A0042`

Science Gothic e Turret Road sono usati per i titoli primari e secondari, mentre Quantico viene usato per il corpo testo.

Le card di news ed eventi usano `#002101` come base e si spostano verso Dark Green in hover/focus. Le CTA usano il viola scuro `#1A0626`, mentre gli accenti neon restano concentrati su stroke, stati attivi e piccoli dettagli dell'interfaccia.

### Note demo

- Gli eventi e le registrazioni sono fittizi e servono esclusivamente a rappresentare il brief originale.
- Le location degli eventi usano città e regioni reali dell'UE e del Regno Unito.
- Il link Instagram è dimostrativo e non rappresenta una pagina reale di Tongue.
- Il backend Express è un componente DevOps locale e non viene distribuito su GitHub Pages.

### Contatti

Per informazioni sul progetto o per entrare in contatto con me:

- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)
