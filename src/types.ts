// Forma dei dati come definita in data/SCHEMA.md — fonte di verità unica.
export interface Gin {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  coordinates: { lat: number; lng: number };
  type: string;
  price: number;
  currency: string;
  botanicalsCount: number;
  botanicals: string[];
  productionYear: number | null;
  producedIn: string;
  image: string | null;
  characteristics: string;
  anecdote: string;
  link: string | null;
}

// Aggregazione calcolata lato client: un marker per ogni combinazione
// nazione + regione presente nei dati.
export interface RegionMarker {
  key: string; // `${countryCode}::${region}`
  country: string;
  countryCode: string;
  region: string;
  lat: number;
  lng: number;
  gins: Gin[];
}
