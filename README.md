# Tongue // Tech News

Web app sviluppata in JavaScript ES6+ per il brand editoriale ipotetico **Tongue**. La homepage recupera progressivamente le ultime notizie tech tramite Hacker News API; il sito include inoltre le sezioni **Chi siamo** ed **Eventi** per rappresentare anche la dimensione editoriale e community descritta nel brief.

> **Versione:** `1.0.0`  
> **Live demo:** [tongue-technews.netlify.app](https://tongue-technews.netlify.app)

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

## Architettura

Il progetto usa ES Modules e mantiene una struttura volutamente semplice, composta da sei moduli JavaScript principali:

- `src/js/api.js` - richieste a Hacker News tramite Axios e gestione dei batch paralleli.
- `src/js/factory.js` - **Factory Pattern** per trasformare gli item API in oggetti coerenti e pronti per la UI.
- `src/js/news.js` - caricamento, stato, paginazione e rendering del feed news.
- `src/js/events.js` - dati, stato e gestione degli eventi demo.
- `src/js/utils.js` - funzioni riutilizzabili per date, URL, batch e paginazione.
- `src/js/main.js` - avvio dell'app, gestione della navbar e toast demo.
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

Il progetto include **5 file di test e 18 test automatici**. Le descrizioni dei test sono scritte in inglese e verificano i comportamenti principali relativi a:

- gestione e validazione del batch;
- formattazione delle date;
- comunicazione con Hacker News API;
- normalizzazione tramite `NewsFactory`;
- paginazione e gestione degli elementi rimanenti.

Per eseguire i test:

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

La versione `1.0.0` è stata verificata con:

```text
Test Files  5 passed (5)
Tests       18 passed (18)
Build       OK
```

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

## Contatti

Per informazioni sul progetto o per entrare in contatto con me:

- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)

<<<<<<< HEAD
- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)
=======
- LinkedIn: [Simone "Sem"](https://www.linkedin.com/in/simone-sem/)
>>>>>>> f4e3b9c (Apply final review improvements)
