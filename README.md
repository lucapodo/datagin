# L'Atlante del Gin — frontend

Sito statico (Vite + React + TypeScript) con un globo 3D interattivo per
esplorare un atlante di gin nel mondo. Nessun backend: tutti i dati vengono
letti a runtime da un file JSON statico.

## Avvio rapido

```bash
npm install
npm run dev
```

Apri l'indirizzo stampato in console (di norma `http://localhost:5173`).

Per una build di produzione:

```bash
npm run build
npm run preview   # per verificare localmente la build generata in dist/
```

## Struttura delle cartelle

```
frontend/
├── scripts/
│   └── sync-data.mjs      # copia ../data/gins.json -> public/data/gins.json
├── public/
│   ├── favicon.svg
│   └── data/
│       └── gins.json      # generato automaticamente, non versionato (vedi sotto)
├── src/
│   ├── main.tsx           # entry point React
│   ├── App.tsx             # composizione dell'app e stato principale
│   ├── index.css           # variabili di palette, font, layout, responsive
│   ├── types.ts             # tipi Gin / RegionMarker (rispecchiano SCHEMA.md)
│   ├── hooks/
│   │   └── useGins.ts       # fetch('/data/gins.json') a runtime
│   ├── lib/
│   │   ├── aggregate.ts     # raggruppamento gin per nazione+regione, ricerca
│   │   ├── geo.ts           # terre, coste e confini (world-atlas + topojson-client)
│   │   └── globeTexture.ts  # texture pergamena del globo disegnata su canvas (d3-geo)
│   └── components/
│       ├── Header.tsx
│       ├── SearchBar.tsx
│       ├── GlobeView.tsx    # wrapper react-globe.gl (globo 3D)
│       ├── DetailPanel.tsx  # pannello laterale / bottom sheet
│       ├── RegionList.tsx   # elenco gin quando una regione ne ha più di uno
│       ├── GinDetail.tsx    # scheda completa di un singolo gin
│       ├── BottleIllustration.tsx  # illustrazione segnaposto quando image è null
│       └── icons.tsx        # icone SVG (lente, chiusura, rombo, frecce)
└── README.md
```

## Sincronizzazione dati (`../data/gins.json`)

`data/gins.json` (nella cartella `Gin/`, un livello sopra `frontend/`) è la
**fonte di verità unica** dei contenuti, gestita da un altro team in
parallelo a questo lavoro. Per non dover mai copiare/incollare quel file a
mano:

1. `scripts/sync-data.mjs` copia `../data/gins.json` dentro
   `public/data/gins.json`, con una validazione minima (deve essere un array
   JSON valido).
2. Questo script gira automaticamente come hook npm **`predev`** e
   **`prebuild`** (vedi `package.json`): ogni `npm run dev` o `npm run build`
   riprende quindi sempre l'ultima versione dei dati, senza intervento
   manuale. Si può anche lanciare a mano con `npm run sync-data`.
3. `public/data/gins.json` è generato e **non è versionato** (vedi
   `.gitignore`): non va mai modificato a mano, verrebbe sovrascritto al
   prossimo `dev`/`build`.
4. Il frontend legge i dati con `fetch('/data/gins.json')` a runtime (non un
   import statico), quindi anche in produzione basta rigenerare
   `public/data/gins.json` (o rifare il build) per aggiornare i contenuti.
5. L'aggregazione per nazione/regione (quanti gin per marker, posizione media)
   viene calcolata lato client in `src/lib/aggregate.ts` a partire
   dall'array grezzo — non esiste un file derivato separato, così lo schema
   resta l'unica cosa da tenere sincronizzata con il secondo team.

## Il globo 3D: approccio scelto e perché

Il globo usa `react-globe.gl` (wrapper React di `globe.gl`/`three-globe`),
trascinabile, zoomabile, con una lenta auto-rotazione quando è a riposo
(gestita tramite `controls().autoRotate` di `OrbitControls`).

### Mappa disegnata in una texture, non in geometria 3D

La sfera non usa nessuna texture fotorealistica "pianeta Terra": usa una
**texture pergamena generata a runtime** (`src/lib/globeTexture.ts`).
All'avvio, una sola volta per sessione (~25 ms), un `<canvas>` 4096×2048
viene disegnato con **`d3-geo`** in proiezione equirettangolare (che è
esattamente la mappatura UV della sfera di three-globe):

- mare in `--parchment`, reticolo 10° in inchiostro trasparente;
- terre emerse (`world-atlas/countries-110m.json` convertito con
  **`topojson-client`**, bundlato via import statico, nessun fetch a CDN) in
  `--parchment-dark`;
- confini politici in inchiostro leggero e linee di costa in `--ink` pieno
  (estratti con `topojson.mesh()`, quindi senza linee doppie).

Il canvas diventa una `THREE.CanvasTexture` (sRGB, mipmap, filtro
anisotropico) applicata come `map` di un `MeshPhongMaterial` opaco (specular
nero, shininess minima: aspetto carta) passato con la prop `globeMaterial`.
`d3-geo` gestisce correttamente antimeridiano e poli (Russia, Fiji,
Antartide).

**Perché**: la versione precedente usava `polygonsData` (≈177 mesh di
nazioni con cap, lati e contorni) + `showGraticules`. Era la causa dello
sfarfallio:

1. *z-fighting*: i reticoli di three-globe sono `LineSegments` posati
   esattamente sul raggio della sfera, e i contorni dei poligoni sono linee
   alla stessa altitudine delle cap → durante la rotazione meridiani e coste
   "tratteggiavano" e lampeggiavano;
2. le linee WebGL (`GL_LINES`) non hanno antialiasing affidabile → coste
   seghettate che scintillano in movimento;
3. la triangolazione delle cap di poligoni grandi/concavi (Groenlandia,
   Antartide) era instabile;
4. gli accessor inline (`polygonCapColor={() => …}`) cambiavano a ogni
   render e facevano ri-digerire il layer dei poligoni.

Con tutto in una texture non c'è più geometria sovrapposta alla sfera
(nessun z-fighting possibile), le linee sono antialiasate dal canvas e
filtrate da mipmap/anisotropia, e la mappa è una sola draw call invece di
centinaia di mesh. La sfera usa inoltre `globeCurvatureResolution={2}` per
una silhouette più tonda. `atmosphereColor` resta `--ink-soft`.

### Marker

I marker (uno per combinazione nazione+regione, sulla media delle coordinate
dei gin del gruppo) restano elementi DOM reali (`htmlElementsData`, via
`CSS2DObject`), così riusano le stesse classi CSS/hover del sito. Per
eliminarne il lampeggio:

- i dati del layer dipendono **solo** da `markers` (non dalla selezione) e
  gli accessor sono a livello di modulo: cliccare un marker non fa più
  distruggere e ricreare tutti gli elementi; lo stato attivo viene applicato
  in place (`classList.toggle('is-active')`) su una mappa chiave → elemento;
- all'orizzonte three-globe di default spegne i marker con `display:none`
  (scatto on/off): con `htmlElementVisibilityModifier` impostiamo invece la
  classe `.is-behind`, che li fa sfumare in 0,25 s e disabilita il click.

### Movimento

`OrbitControls` con damping; l'auto-rotazione si ferma quando l'utente
trascina/zooma, durante il fly-to di `pointOfView()` (altrimenti rotazione e
tween della camera si contendono la camera, con scatti e deriva finale) e
mentre una scheda è aperta; riparte dopo ~4 s di inattività. Il pixel ratio
è già limitato a 2 e l'antialias è attivo di default in globe.gl.

### Librerie valutate

- **globe.gl/react-globe.gl con texture (scelta)**: cambiamento minimo,
  mantiene look, marker cliccabili, fly-to, zoom e supporto mobile.
- *three-globe diretto* o *@react-three/fiber + drei*: stesso motore, molto
  più codice da scrivere (controlli, fly-to, marker HTML) senza vantaggi
  sulla fluidità, che dipendeva dai layer, non dal wrapper.
- *cobe*: leggerissimo e fluido, ma mappa a puntini e marker non
  cliccabili/personalizzabili: stravolgerebbe il design.
- *d3-geo ortografico su canvas 2D*: niente WebGL, ma ridisegnare tutte le
  path a ogni frame è più pesante su mobile e zoom/inerzia vanno riscritti.

## Verifica eseguita

- `npm install` — completato senza errori (inclusi `react-globe.gl`, `three`,
  `world-atlas`, `topojson-client` e i relativi `@types/*`).
- `npm run build` (`tsc -b && vite build`) — completa senza errori né
  warning di tipo/lint.
- `npm run lint` (`oxlint`) — nessun warning.
- `npm run dev` — il server si avvia, tutti i moduli sorgente vengono
  transpilati correttamente da Vite (verificato via richieste dirette ai
  singoli file) e `GET /data/gins.json` restituisce i 5 gin segnaposto
  correttamente sincronizzati da `../data/gins.json`.
- Verifica manuale della logica: aggregazione nazione+regione, ricerca
  (nome/nazione/regione/botaniche), apertura scheda su singolo gin vs. elenco
  multiplo, e formato di tutti i campi nella scheda di dettaglio.

- Texture del globo renderizzata offline in Node (stesso codice di
  `drawAtlas`, con `@napi-rs/canvas`) e controllata visivamente: coste,
  confini, reticolo, antimeridiano e Antartide corretti.

**Limitazione nota**: in questo ambiente sandbox non è stato possibile
ottenere uno screenshot reale del sito in un browser. Il download del
Chromium di Playwright è bloccato dalla policy di rete di default (nessuna
regola di allow per `cdn.playwright.dev` / `playwright.download.prss.microsoft.com`),
e il pacchetto `chromium-browser` disponibile via `apt` in questa immagine è
solo uno stub di transizione verso uno snap (non installabile/eseguibile
senza snapd funzionante). La verifica visiva di palette/font/layout è stata
quindi fatta per lettura del codice sorgente confrontato con i mockup in
`../design/*.dc.html`, non con uno screenshot renderizzato. Se l'utente vuole
uno screenshot reale, può eseguire `npm run dev` in locale e aprire il
browser, oppure autorizzare la policy di rete per il download di Playwright.

## Segnalazioni e proposte (`/contribuisci`)

La pagina `/contribuisci` ha due form: **segnala un errore** su un gin esistente
(gin scelto dall'elenco, motivazione di massimo 300 caratteri, email) e
**proponi un nuovo gin** (campi di `data/SCHEMA.md`, più fonte ed email). I form
chiamano `POST /api/contribute`, una Vercel Function (`api/contribute.ts`) che
valida i dati e li inoltra via email con [Resend](https://resend.com). Per le
proposte l'email contiene anche una bozza JSON pronta per `data/gins.json`
(da completare con `countryCode` e coordinate dopo la verifica).

Variabili d'ambiente da impostare su Vercel (Settings → Environment Variables):

| Variabile | Descrizione |
|---|---|
| `RESEND_API_KEY` | Chiave API di Resend |
| `CONTACT_TO_EMAIL` | Indirizzo che riceve segnalazioni e proposte |
| `CONTACT_FROM_EMAIL` | Mittente su un dominio verificato in Resend, es. `L'Atlante del Gin <segnalazioni@tuodominio.it>`. Senza, usa `onboarding@resend.dev`, che consegna solo all'email dell'account Resend |

Su Vercel il progetto va configurato con **Root Directory = `frontend`**
(lasciando attiva l'opzione che include i file fuori dalla root, necessaria
per leggere `../data/gins.json` in build). `vercel.json` rimanda tutte le
route del sito a `index.html`. In locale `npm run dev` non esegue le funzioni:
per provare l'invio usare `vercel dev`.
