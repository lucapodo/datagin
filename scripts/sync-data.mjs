#!/usr/bin/env node
// Copia data/gins.json (fonte di verità, gestita da un team separato) dentro
// public/data/gins.json in modo che il frontend possa leggerla via fetch a runtime,
// sia in sviluppo (npm run dev) sia in produzione (npm run build), senza mai
// doverla copiare o incollare a mano. Eseguito automaticamente da npm come
// hook "predev" / "prebuild" (vedi package.json).
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(__dirname, '../data/gins.json');
const DEST_DIR = resolve(__dirname, '../public/data');
const DEST = resolve(DEST_DIR, 'gins.json');

if (!existsSync(SOURCE)) {
  console.error(
    `[sync-data] File sorgente non trovato: ${SOURCE}\n` +
      '[sync-data] Assicurati che data/gins.json esista nella root della repo.'
  );
  process.exit(1);
}

// Validazione minima: deve essere un array JSON valido.
let parsed;
try {
  parsed = JSON.parse(readFileSync(SOURCE, 'utf-8'));
} catch (err) {
  console.error(`[sync-data] gins.json non è un JSON valido: ${err.message}`);
  process.exit(1);
}
if (!Array.isArray(parsed)) {
  console.error('[sync-data] gins.json deve contenere un array di gin.');
  process.exit(1);
}

mkdirSync(DEST_DIR, { recursive: true });
copyFileSync(SOURCE, DEST);
console.log(`[sync-data] Sincronizzati ${parsed.length} gin da data/gins.json -> public/data/gins.json`);
