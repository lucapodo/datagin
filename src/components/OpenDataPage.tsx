import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGins } from '../hooks/useGins';
import { totalCountries, totalGins } from '../lib/stats';

const FIELDS: { name: string; type: string; description: string }[] = [
  { name: 'id', type: 'string', description: 'Identificativo univoco in kebab-case.' },
  { name: 'name', type: 'string', description: 'Nome commerciale del gin.' },
  { name: 'country', type: 'string', description: 'Nazione di produzione (in italiano).' },
  { name: 'countryCode', type: 'string', description: 'Codice ISO 3166-1 alpha-2 della nazione.' },
  { name: 'region', type: 'string', description: 'Regione o area di produzione.' },
  { name: 'coordinates', type: '{ lat, lng }', description: 'Posizione della distilleria in gradi decimali (WGS84).' },
  { name: 'type', type: 'string', description: 'Tipologia: London Dry, Old Tom, Genever, Contemporary…' },
  { name: 'price', type: 'number | null', description: 'Prezzo indicativo di una bottiglia.' },
  { name: 'currency', type: 'string', description: 'Valuta del prezzo (codice ISO 4217).' },
  { name: 'botanicalsCount', type: 'number', description: 'Numero di botaniche dichiarate.' },
  { name: 'botanicals', type: 'string[]', description: 'Elenco delle botaniche principali.' },
  { name: 'productionYear', type: 'number | null', description: 'Anno di lancio del gin.' },
  { name: 'producedIn', type: 'string', description: 'Località della distilleria.' },
  { name: 'image', type: 'string | null', description: 'Immagine con diritti d’uso chiari, altrimenti null.' },
  { name: 'characteristics', type: 'string', description: 'Profilo aromatico, testo originale.' },
  { name: 'anecdote', type: 'string', description: 'Curiosità sul gin o sulla distilleria, testo originale.' },
  { name: 'link', type: 'string | null', description: 'Sito ufficiale del produttore, se verificato.' },
];

export function OpenDataPage() {
  const { gins, status } = useGins();
  const ginCount = useMemo(() => totalGins(gins), [gins]);
  const countryCount = useMemo(() => totalCountries(gins), [gins]);

  return (
    <article className="article-page">
      <p className="article-page__eyebrow">Open data</p>
      <h1 className="display article-page__title">I dati dell'atlante</h1>
      <p className="article-page__lead">
        Tutto quello che vedi sul globo viene da un unico file JSON, aperto e scaricabile. Puoi
        usarlo per analisi, visualizzazioni o progetti tuoi, citando la fonte.
      </p>

      <div className="opendata-download">
        <div>
          <div className="opendata-download__file">gins.json</div>
          <div className="opendata-download__meta">
            {status === 'ready'
              ? `${ginCount} gin · ${countryCount} nazioni · JSON, UTF-8`
              : 'JSON, UTF-8'}
          </div>
        </div>
        <a className="opendata-download__button" href="/data/gins.json" download="atlante-del-gin.json">
          Scarica il dataset
        </a>
      </div>

      <h2 className="display article-page__h2">Licenza</h2>
      <p>
        Il dataset è rilasciato con licenza{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/deed.it" target="_blank" rel="noreferrer">
          Creative Commons Attribuzione 4.0 (CC BY 4.0)
        </a>
        : puoi copiarlo, modificarlo e ridistribuirlo, anche per scopi commerciali, a patto di
        citare «L'Atlante del Gin» come fonte. I nomi dei gin e dei produttori sono marchi dei
        rispettivi titolari e sono citati solo a scopo descrittivo.
      </p>

      <h2 className="display article-page__h2">Struttura</h2>
      <p>
        Il file è un array di oggetti, uno per gin. L'indirizzo è stabile:{' '}
        <code>/data/gins.json</code>, quindi puoi anche leggerlo direttamente da codice.
      </p>
      <div className="article-table-wrap">
        <table className="article-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Tipo</th>
              <th>Descrizione</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f) => (
              <tr key={f.name}>
                <td>
                  <code>{f.name}</code>
                </td>
                <td className="article-table__muted">{f.type}</td>
                <td>{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="display article-page__h2">Come sono raccolti i dati</h2>
      <p>
        Luogo di produzione, tipologia, anno e botaniche vengono da fonti pubbliche: siti dei
        produttori e stampa di settore. La posizione indica la distilleria dove il gin viene
        effettivamente prodotto, che non sempre coincide con la sede del marchio. Descrizioni e
        aneddoti sono scritti dalla redazione. Hai trovato un errore?{' '}
        <Link to="/contribuisci">Segnalacelo</Link> e lo correggiamo.
      </p>
    </article>
  );
}
