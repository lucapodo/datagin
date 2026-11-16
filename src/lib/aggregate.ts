import type { Gin, RegionMarker } from '../types';

/**
 * Raggruppa i gin per combinazione nazione+regione e calcola, per ciascun
 * gruppo, la posizione media delle coordinate (o l'unica disponibile).
 * Non esiste un file derivato: l'aggregazione è sempre ricalcolata a runtime
 * a partire da data/gins.json.
 */
export function buildRegionMarkers(gins: Gin[]): RegionMarker[] {
  const groups = new Map<string, Gin[]>();

  for (const gin of gins) {
    const key = `${gin.countryCode}::${gin.region}`;
    const list = groups.get(key);
    if (list) {
      list.push(gin);
    } else {
      groups.set(key, [gin]);
    }
  }

  return Array.from(groups.entries()).map(([key, groupGins]) => {
    const lat = groupGins.reduce((sum, g) => sum + g.coordinates.lat, 0) / groupGins.length;
    const lng = groupGins.reduce((sum, g) => sum + g.coordinates.lng, 0) / groupGins.length;
    const first = groupGins[0];
    return {
      key,
      country: first.country,
      countryCode: first.countryCode,
      region: first.region,
      lat,
      lng,
      gins: groupGins,
    };
  });
}

/** Filtra i gin su nome / nazione / regione / botaniche, case-insensitive. */
export function searchGins(gins: Gin[], query: string): Gin[] {
  const q = query.trim().toLocaleLowerCase('it');
  if (!q) return [];
  return gins.filter((gin) => {
    const haystack = [gin.name, gin.country, gin.region, ...gin.botanicals]
      .join(' ')
      .toLocaleLowerCase('it');
    return haystack.includes(q);
  });
}
