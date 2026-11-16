import type { RankedItem } from '../lib/stats';

interface Props {
  title: string;
  items: RankedItem[];
  emptyMessage?: string;
  valueFormatter?: (value: number) => string;
}

function defaultFormatter(value: number): string {
  return String(value);
}

/**
 * Classifica orizzontale a barre, in linea con l'estetica da atlante: niente
 * palette multicolore (è sempre una singola serie ordinata per grandezza),
 * niente librerie di grafici — solo divs. La barra al primo posto è in
 * --accent per attirare l'occhio, tutte le altre in --ink; il "binario"
 * vuoto è un tono chiaro derivato dallo stesso hue via color-mix, mai un
 * colore nuovo.
 */
export function RankedBarChart({ title, items, emptyMessage, valueFormatter = defaultFormatter }: Props) {
  const max = items.reduce((m, item) => Math.max(m, item.value), 0) || 1;

  return (
    <div className="ranked-chart">
      <div className="display ranked-chart__title">{title}</div>

      {items.length === 0 ? (
        <div className="ranked-chart__empty">{emptyMessage ?? 'Dati non ancora disponibili.'}</div>
      ) : (
        <div className="ranked-chart__rows">
          {items.map((item, index) => {
            const pct = Math.max(2, Math.round((item.value / max) * 100));
            return (
              <div className="ranked-chart__row" key={item.key}>
                <div className="ranked-chart__row-head">
                  <span className="ranked-chart__label">
                    {item.label}
                    {item.sublabel && <span className="ranked-chart__sublabel"> — {item.sublabel}</span>}
                  </span>
                  <span className="ranked-chart__value">{valueFormatter(item.value)}</span>
                </div>
                <div className="ranked-chart__track">
                  <div
                    className={`ranked-chart__bar${index === 0 ? ' is-top' : ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
