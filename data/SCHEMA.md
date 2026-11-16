# Schema dati — L'Atlante del Gin

File canonico: `data/gins.json` — un array JSON di oggetti "gin", ognuno con questa forma:

```json
{
  "id": "selva-dargento",
  "name": "Selva d'Argento",
  "country": "Italia",
  "countryCode": "IT",
  "region": "Trentino-Alto Adige",
  "coordinates": { "lat": 46.3, "lng": 11.5 },
  "type": "London Dry Gin",
  "price": 38,
  "currency": "EUR",
  "botanicalsCount": 11,
  "botanicals": ["ginepro alpino", "genziana", "pigna cembro", "scorza di limone", "coriandolo", "angelica", "iris", "cardamomo", "arancia amara", "liquirizia", "timo alpino"],
  "productionYear": 2016,
  "producedIn": "Val di Fiemme (TN)",
  "image": null,
  "characteristics": "Breve descrizione originale di profilo aromatico/gusto, scritta con parole proprie (non copiata dal sito ufficiale).",
  "anecdote": "Un aneddoto o una curiosità particolare su questo gin o distilleria.",
  "link": "https://esempio-produttore.it"
}
```

Regole:
- `id`: slug univoco, kebab-case.
- `productionYear`: anno di lancio del gin; `null` se non è stato possibile verificarlo (il frontend mostra "—").
- `coordinates`: posizione approssimativa della distilleria/regione (serve a piazzare il marker sul globo).
- `type`: es. "London Dry Gin", "Old Tom Gin", "Plymouth Gin", "Navy Strength Gin", "Sottovuoto (Vacuum Distilled)", "Contemporary/New Western Dry Gin", "Genever" ecc.
- `image`: `null` se non si dispone di un'immagine con diritti d'uso chiari. Non inserire URL a immagini trovate online senza licenza: il frontend mostra un'illustrazione vettoriale segnaposto quando `image` è `null`.
- `link`: solo URL reali e verificati del produttore/distilleria. Se non si è certi dell'URL esatto, usare `null` invece di inventarlo.
- `characteristics` e `anecdote`: testo originale, non copiato/incollato da siti ufficiali o altre fonti.
- Nessun campo è obbligatoriamente lungo: meglio un dato corretto e conciso che uno gonfiato.

Questo file è la fonte di verità unica. Il frontend calcola autonomamente conteggi per nazione/regione aggregando questo array — non serve un file derivato separato.
