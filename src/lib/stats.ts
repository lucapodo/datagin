import type { Gin } from '../types';

/**
 * Aggregazioni per la pagina DataGin. Tutto viene ricalcolato a runtime a
 * partire dall'array corrente di gin (mai valori hardcoded): il dataset
 * cresce nel tempo man mano che vengono aggiunte nuove nazioni, quindi ogni
 * funzione qui deve restare corretta anche con pochissimi elementi (o zero)
 * e tollerare campi mancanti/malformati senza andare in crash.
 */

export interface RankedItem {
  key: string;
  label: string;
  value: number;
  sublabel?: string;
}

function safeBotanicals(gin: Gin): string[] {
  return Array.isArray(gin.botanicals) ? gin.botanicals.filter((b) => typeof b === 'string' && b.trim().length > 0) : [];
}

function safeYear(gin: Gin): number | null {
  const year = gin.productionYear;
  return typeof year === 'number' && Number.isFinite(year) && year > 0 ? year : null;
}

/** Numero di botaniche di un gin: usa il campo dedicato se valido, altrimenti
 * ricade sulla lunghezza dell'elenco `botanicals`. */
function safeBotanicalsCount(gin: Gin): number {
  const count = gin.botanicalsCount;
  if (typeof count === 'number' && Number.isFinite(count) && count >= 0) return count;
  return safeBotanicals(gin).length;
}

function safePrice(gin: Gin): number | null {
  const price = gin.price;
  return typeof price === 'number' && Number.isFinite(price) ? price : null;
}

/** Numero totale di gin catalogati. */
export function totalGins(gins: Gin[]): number {
  return gins.length;
}

/** Numero di nazioni distinte rappresentate nell'atlante. */
export function totalCountries(gins: Gin[]): number {
  const codes = new Set(gins.map((g) => g.countryCode).filter(Boolean));
  return codes.size;
}

/** Il gin con l'anno di produzione più basso (il "più antico"), se noto. */
export function oldestGin(gins: Gin[]): { gin: Gin; year: number } | null {
  let best: { gin: Gin; year: number } | null = null;
  for (const gin of gins) {
    const year = safeYear(gin);
    if (year === null) continue;
    if (!best || year < best.year) best = { gin, year };
  }
  return best;
}

/** La botanica più diffusa nel dataset e in quanti gin compare. */
export function mostCommonBotanical(gins: Gin[]): { name: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const gin of gins) {
    for (const botanical of safeBotanicals(gin)) {
      const key = botanical.trim().toLocaleLowerCase('it');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  let best: { name: string; count: number } | null = null;
  for (const [name, count] of counts) {
    if (!best || count > best.count) best = { name, count };
  }
  return best;
}

/** Top N gin per numero di botaniche impiegate. */
export function topGinsByBotanicalsCount(gins: Gin[], limit = 10): RankedItem[] {
  return gins
    .map((gin) => ({
      key: gin.id,
      label: gin.name,
      value: safeBotanicals(gin).length,
      sublabel: gin.country,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/** Top N nazioni per numero di gin catalogati. */
export function topCountriesByGinCount(gins: Gin[], limit = 10): RankedItem[] {
  const counts = new Map<string, { label: string; value: number }>();
  for (const gin of gins) {
    if (!gin.countryCode) continue;
    const existing = counts.get(gin.countryCode);
    if (existing) {
      existing.value += 1;
    } else {
      counts.set(gin.countryCode, { label: gin.country || gin.countryCode, value: 1 });
    }
  }
  return Array.from(counts.entries())
    .map(([key, { label, value }]) => ({ key, label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/** Distribuzione dei gin per tipologia (`type`). */
export function distributionByType(gins: Gin[]): RankedItem[] {
  const counts = new Map<string, number>();
  for (const gin of gins) {
    const type = gin.type?.trim();
    if (!type) continue;
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([type, value]) => ({ key: type, label: type, value }))
    .sort((a, b) => b.value - a.value);
}

/** Top N botaniche più utilizzate nell'intero dataset. */
export function topBotanicals(gins: Gin[], limit = 10): RankedItem[] {
  const counts = new Map<string, { label: string; value: number }>();
  for (const gin of gins) {
    for (const botanical of safeBotanicals(gin)) {
      const key = botanical.trim().toLocaleLowerCase('it');
      const existing = counts.get(key);
      if (existing) {
        existing.value += 1;
      } else {
        counts.set(key, { label: botanical.trim(), value: 1 });
      }
    }
  }
  return Array.from(counts.entries())
    .map(([key, { label, value }]) => ({ key, label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Filtri e ordinamento per la vista interattiva DataGin               */
/* ------------------------------------------------------------------ */

export interface CountryOption {
  code: string;
  label: string;
}

/** Nazioni distinte presenti nel dataset corrente, ordinate alfabeticamente. */
export function distinctCountries(gins: Gin[]): CountryOption[] {
  const byCode = new Map<string, string>();
  for (const gin of gins) {
    if (!gin.countryCode) continue;
    if (!byCode.has(gin.countryCode)) byCode.set(gin.countryCode, gin.country || gin.countryCode);
  }
  return Array.from(byCode, ([code, label]) => ({ code, label })).sort((a, b) =>
    a.label.localeCompare(b.label, 'it'),
  );
}

/** Tipologie distinte presenti nel dataset corrente, ordinate alfabeticamente. */
export function distinctTypes(gins: Gin[]): string[] {
  const types = new Set<string>();
  for (const gin of gins) {
    const type = gin.type?.trim();
    if (type) types.add(type);
  }
  return Array.from(types).sort((a, b) => a.localeCompare(b, 'it'));
}

/**
 * Range [min, max] del numero di botaniche nel dataset corrente. Calcolato
 * sempre a runtime (mai hardcoded) perché il dataset cresce nel tempo.
 * Ritorna [0, 0] su dataset vuoto, senza mai andare in crash.
 */
export function botanicalsCountRange(gins: Gin[]): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const gin of gins) {
    const count = safeBotanicalsCount(gin);
    if (count < min) min = count;
    if (count > max) max = count;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 0];
  return [min, max];
}

export interface GinFilters {
  /** countryCode selezionato, o null per "tutte le nazioni". */
  countryCode: string | null;
  /** tipologia selezionata, o null per "tutte le tipologie". */
  type: string | null;
  /** range inclusivo [min, max] sul numero di botaniche. */
  botanicalsRange: [number, number];
}

/** Applica i filtri correnti a un array di gin, restituendone il sottoinsieme. */
export function applyGinFilters(gins: Gin[], filters: GinFilters): Gin[] {
  const [min, max] = filters.botanicalsRange;
  return gins.filter((gin) => {
    if (filters.countryCode && gin.countryCode !== filters.countryCode) return false;
    if (filters.type && gin.type?.trim() !== filters.type) return false;
    const count = safeBotanicalsCount(gin);
    if (count < min || count > max) return false;
    return true;
  });
}

export type GinSortField = 'name' | 'country' | 'type' | 'productionYear' | 'botanicalsCount' | 'price';
export type SortDirection = 'asc' | 'desc';

function ginSortValue(gin: Gin, field: GinSortField): string | number | null {
  switch (field) {
    case 'name':
      return gin.name?.trim() || null;
    case 'country':
      return gin.country?.trim() || null;
    case 'type':
      return gin.type?.trim() || null;
    case 'productionYear':
      return safeYear(gin);
    case 'botanicalsCount':
      return safeBotanicalsCount(gin);
    case 'price':
      return safePrice(gin);
    default:
      return null;
  }
}

/**
 * Comparator per ordinare due gin secondo un campo e una direzione. I valori
 * mancanti/non validi finiscono sempre in fondo, qualunque sia la direzione.
 */
export function compareGins(a: Gin, b: Gin, field: GinSortField, direction: SortDirection): number {
  const va = ginSortValue(a, field);
  const vb = ginSortValue(b, field);
  if (va === null && vb === null) return 0;
  if (va === null) return 1;
  if (vb === null) return -1;

  const cmp =
    typeof va === 'string' && typeof vb === 'string' ? va.localeCompare(vb, 'it') : (va as number) - (vb as number);
  return direction === 'asc' ? cmp : -cmp;
}

/** Restituisce una copia ordinata dell'array di gin secondo campo e direzione. */
export function sortGins(gins: Gin[], field: GinSortField, direction: SortDirection): Gin[] {
  return [...gins].sort((a, b) => compareGins(a, b, field, direction));
}
