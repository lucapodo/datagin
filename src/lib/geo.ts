// Confini reali dei continenti per la texture "terra" del globo, bundlati a
// build-time da un pacchetto npm locale (world-atlas) — nessun fetch a CDN
// esterni a runtime. Vedi README ("Il globo 3D") per la scelta dell'approccio.
//
// Usiamo countries-110m perché, oltre al riempimento delle terre emerse, ci
// servono separatamente le linee di costa (archi condivisi da una sola
// nazione) e i confini politici interni (archi condivisi da due nazioni):
// topojson `mesh()` li estrae direttamente dalla topologia, senza doppioni.
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import countriesTopology from 'world-atlas/countries-110m.json';

type CountriesTopology = Topology<{ countries: GeometryCollection }>;

const topology = countriesTopology as unknown as CountriesTopology;
const countries = topology.objects.countries;

/** Tutte le nazioni come FeatureCollection (riempimento delle terre emerse). */
export const landCollection = feature(topology, countries);

/** Linee di costa: archi che appartengono a una sola nazione. */
export const coastlines = mesh(topology, countries, (a, b) => a === b);

/** Confini politici interni: archi condivisi da due nazioni diverse. */
export const borders = mesh(topology, countries, (a, b) => a !== b);
