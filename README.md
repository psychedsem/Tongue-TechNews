# Tongue // Tech News

Web app sviluppata in JavaScript ES6+ per il brand editoriale ipotetico **Tongue**. La homepage recupera progressivamente le ultime notizie tech tramite Hacker News API; il sito include inoltre le sezioni **Chi siamo** ed **Eventi** per rappresentare anche la dimensione editoriale e community descritta nel brief.

> **Live demo:** [tongue-technews.netlify.app](https://tongue-technews.netlify.app)

## Funzionamento del feed

1. All'avvio l'app recupera una sola volta la lista degli ID da `newstories`.
2. Seleziona i primi 10 ID.
3. Recupera in parallelo il dettaglio delle 10 news tramite gli endpoint `item/{id}`.
4. Normalizza i dati con `NewsFactory` e li visualizza nell'interfaccia.
5. Il pulsante **Load more** usa un batch configurabile: 10, 20, 50 oppure un valore personalizzato fino a 50.
6. Se una singola richiesta di dettaglio fallisce, le altre news disponibili vengono comunque mostrate.

## Sezioni

- **Home / Tech News** - feed Hacker News con 10 news iniziali e caricamento progressivo a batch configurabile.
- **Chi siamo** - presentazione del progetto editoriale Tongue e rimando alla community Instagram.
- **Eventi** - introduzione alle iniziative live, focus sugli Swap Party e 15 eventi demo ambientati in città reali dell'UE e del Regno Unito. Ne vengono mostrati 5 all'avvio, poi il caricamento usa lo stesso selettore batch delle news.

La navbar è sticky, evidenzia la sezione attiva e mostra il logo Tongue durante lo scroll. Il logo Instagram utilizza un link dimostrativo alla homepage di Instagram.

## Architettura

Il progetto usa ES Modules, ma mantiene una struttura volutamente semplice:

- `src/js/api.js` - richieste a Hacker News tramite Axios.
- `src/js/factory.js` - **Factory Pattern** per trasformare gli item API in oggetti pronti per la UI.
- `src/js/news.js` - caricamento, stato e rendering del feed news.
- `src/js/events.js` - dati e gestione degli eventi demo.
- `src/js/utils.js` - funzioni riutilizzabili per date, URL, batch e paginazione.
- `src/js/main.js` - avvio dell'app, navbar e toast demo.
- `tests/` - test automatici con Vitest.

La gestione dei dettagli delle news usa `Promise.allSettled()` per eseguire le richieste in parallelo senza perdere l'intero batch quando una singola richiesta fallisce.

## Tecnologie

- JavaScript ES6+
- Vite
- Axios
- Vitest
- Hacker News API
- HTML5 / CSS3
- Google Fonts: Quantico, Turret Road, Science Gothic

## Avvio locale

```bash
npm install
npm run dev
```

## Test

```bash
npm run test:run
```

## Build di produzione

```bash
npm run build
npm run preview
```

Per eseguire test e build in un solo comando:

```bash
npm run check
```

## Design

L'interfaccia usa una direzione cyber-editoriale ispirata alla palette *Matrix Code Green*: Vampire Black `#0D0208`, Dark Green `#003B00`, Islam Green `#008F11`, Erin `#00FF41`; con l'aggiunta di Neon Purple `#B026FF` e Deep Purple `#2A0042` per alcuni dettagli decorativi. Sono stati usati i font Science Gothic e Turret Road per i titoli primari e secondari e Quantico per il corpo testo. Le card di news ed eventi usano `#002101` come base e si accendono verso il Dark Green in hover/focus. Le CTA `READ ↗` e `REGISTRATI ↗` usano il viola scuro `#1A0626`. Card e controlli restano volutamente squadrati, con accenti neon concentrati su stroke, stati attivi e micro-elementi.

## Batch configurabile

Il selettore accanto a `Load more` propone 10, 20 e 50 elementi. Con `CUSTOM` si può inserire un valore da 1 a 50. Se restano meno elementi del batch richiesto, l'app mostra soltanto quelli ancora disponibili.

## Note demo

- Gli eventi e le relative registrazioni sono fittizi e servono esclusivamente a rappresentare il brief.
- I luoghi indicati negli eventi sono città e regioni reali dell'UE o del Regno Unito.
- Il link Instagram è dimostrativo e non rappresenta una pagina reale di Tongue.
