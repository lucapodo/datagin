import { Link } from 'react-router-dom';
import type { Gin } from '../types';
import { BottleIllustration } from './BottleIllustration';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

interface Props {
  gin: Gin;
  showBack: boolean;
  onBack: () => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
};

function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol} ${price}`;
}

export function GinDetail({ gin, showBack, onBack }: Props) {
  return (
    <div>
      {showBack && (
        <button type="button" className="back-link" onClick={onBack}>
          <ArrowLeftIcon />
          Torna alla regione
        </button>
      )}

      <div className="gin-detail__illustration">
        {gin.image ? (
          <img
            src={gin.image}
            alt={gin.name}
            style={{ maxWidth: '160px', maxHeight: '220px', objectFit: 'contain' }}
          />
        ) : (
          <BottleIllustration id={gin.id} name={gin.name} type={gin.type} year={gin.productionYear} />
        )}
      </div>

      <div className="display gin-detail__title">{gin.name}</div>
      <div className="gin-detail__badge-row">
        <div className="chip">{gin.type.toUpperCase()}</div>
      </div>

      <div className="fact-grid">
        <div>
          <div className="fact-label">Prezzo</div>
          <div className="fact-value">{formatPrice(gin.price, gin.currency)}</div>
        </div>
        <div>
          <div className="fact-label">Dal</div>
          <div className="fact-value">{gin.productionYear ?? '—'}</div>
        </div>
        <div className="fact-grid--span">
          <div className="fact-label">Origine</div>
          <div className="fact-value">
            {gin.producedIn}, {gin.region} &mdash; {gin.country}
          </div>
        </div>
      </div>

      <div className="section-block">
        <div className="fact-label">
          {gin.botanicalsCount} botanic{gin.botanicalsCount === 1 ? 'a' : 'he'}
        </div>
        <div className="botanicals-chips">
          {gin.botanicals.map((botanical) => (
            <div key={botanical} className="chip">
              {botanical}
            </div>
          ))}
        </div>
      </div>

      <div className="section-block">
        <div className="fact-label">Caratteristiche</div>
        <div className="characteristics-text">{gin.characteristics}</div>
      </div>

      <div className="section-block">
        <div className="fact-label">Aneddoto</div>
        <div className="anecdote-text">{gin.anecdote}</div>
      </div>

      <div className="panel-footer">
        {gin.link && (
          <a className="producer-link" href={gin.link} target="_blank" rel="noreferrer noopener">
            Visita il produttore
            <ArrowRightIcon />
          </a>
        )}
        <Link className="report-link" to={`/contribuisci?gin=${encodeURIComponent(gin.id)}`}>
          Segnala un errore su questo gin
        </Link>
      </div>
    </div>
  );
}
