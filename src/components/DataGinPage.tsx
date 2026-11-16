import { useEffect, useMemo, useRef, useState } from 'react';
import { useGins } from '../hooks/useGins';
import { RankedBarChart } from './RankedBarChart';
import { SortArrowIcon } from './icons';
import {
  applyGinFilters,
  botanicalsCountRange,
  distinctCountries,
  distinctTypes,
  distributionByType,
  mostCommonBotanical,
  oldestGin,
  sortGins,
  topBotanicals,
  topCountriesByGinCount,
  topGinsByBotanicalsCount,
  totalCountries,
  totalGins,
  type GinFilters,
  type GinSortField,
  type SortDirection,
} from '../lib/stats';
import type { Gin } from '../types';

function formatBotanicalCount(count: number): string {
  return `${count} botanic${count === 1 ? 'a' : 'he'}`;
}

function formatGinCount(count: number): string {
  return `${count} gin`;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
};

function formatPrice(gin: Gin): string {
  if (typeof gin.price !== 'number' || !Number.isFinite(gin.price)) return '—';
  const symbol = CURRENCY_SYMBOLS[gin.currency] ?? `${gin.currency ?? ''} `;
  return `${symbol} ${gin.price}`;
}

function formatYear(gin: Gin): string {
  return typeof gin.productionYear === 'number' && gin.productionYear > 0 ? String(gin.productionYear) : '—';
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

interface Column {
  field: GinSortField;
  label: string;
}

const COLUMNS: Column[] = [
  { field: 'name', label: 'Nome' },
  { field: 'country', label: 'Nazione' },
  { field: 'type', label: 'Tipologia' },
  { field: 'productionYear', label: 'Anno' },
  { field: 'botanicalsCount', label: 'Botaniche' },
  { field: 'price', label: 'Prezzo' },
];

export function DataGinPage() {
  const { gins, status, error } = useGins();

  const countryOptions = useMemo(() => distinctCountries(gins), [gins]);
  const typeOptions = useMemo(() => distinctTypes(gins), [gins]);
  const datasetRange = useMemo(() => botanicalsCountRange(gins), [gins]);

  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [botanicalsRange, setBotanicalsRange] = useState<[number, number]>(datasetRange);

  // Il range di botaniche va inizializzato ai valori reali del dataset non
  // appena questo viene caricato (all'avvio l'array è vuoto, quindi [0, 0]).
  // Il flag evita di "risistemare" un range già scelto dall'utente se il
  // riferimento a `gins` dovesse cambiare di nuovo in seguito.
  const rangeInitialized = useRef(false);
  useEffect(() => {
    if (!rangeInitialized.current && gins.length > 0) {
      setBotanicalsRange(botanicalsCountRange(gins));
      rangeInitialized.current = true;
    }
  }, [gins]);

  const [sortField, setSortField] = useState<GinSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  function handleSort(field: GinSortField) {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function handleReset() {
    setCountryCode(null);
    setType(null);
    setBotanicalsRange(botanicalsCountRange(gins));
  }

  const isFilterActive =
    countryCode !== null ||
    type !== null ||
    botanicalsRange[0] !== datasetRange[0] ||
    botanicalsRange[1] !== datasetRange[1];

  const filters: GinFilters = useMemo(
    () => ({ countryCode, type, botanicalsRange }),
    [countryCode, type, botanicalsRange],
  );
  const filteredGins = useMemo(() => applyGinFilters(gins, filters), [gins, filters]);

  const oldest = useMemo(() => oldestGin(filteredGins), [filteredGins]);
  const commonBotanical = useMemo(() => mostCommonBotanical(filteredGins), [filteredGins]);
  const ginsByBotanicals = useMemo(() => topGinsByBotanicalsCount(filteredGins), [filteredGins]);
  const countriesByGinCount = useMemo(() => topCountriesByGinCount(filteredGins), [filteredGins]);
  const types = useMemo(() => distributionByType(filteredGins), [filteredGins]);
  const botanicals = useMemo(() => topBotanicals(filteredGins), [filteredGins]);
  const sortedGins = useMemo(
    () => sortGins(filteredGins, sortField, sortDirection),
    [filteredGins, sortField, sortDirection],
  );

  function handleMinChange(raw: string) {
    const v = clamp(Number(raw), datasetRange[0], botanicalsRange[1]);
    setBotanicalsRange([v, botanicalsRange[1]]);
  }

  function handleMaxChange(raw: string) {
    const v = clamp(Number(raw), botanicalsRange[0], datasetRange[1]);
    setBotanicalsRange([botanicalsRange[0], v]);
  }

  return (
    <div className="datagin-page">
      {status === 'loading' && (
        <div className="datagin-page__status">L'atlante si sta dispiegando&hellip;</div>
      )}

      {status === 'error' && (
        <div className="datagin-page__status">
          Non è stato possibile caricare l'atlante ({error}).
        </div>
      )}

      {status === 'ready' && gins.length === 0 && (
        <div className="datagin-page__status">
          L'atlante è ancora vuoto: nessun gin è stato ancora catalogato, quindi non c'è ancora
          nulla da mostrare qui.
        </div>
      )}

      {status === 'ready' && gins.length > 0 && (
        <>
          <section className="datagin-filters">
            <div className="datagin-filters__field">
              <label htmlFor="datagin-filter-country">Nazione</label>
              <select
                id="datagin-filter-country"
                className="datagin-filters__select"
                value={countryCode ?? ''}
                onChange={(e) => setCountryCode(e.target.value || null)}
              >
                <option value="">Tutte le nazioni</option>
                {countryOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="datagin-filters__field">
              <label htmlFor="datagin-filter-type">Tipologia</label>
              <select
                id="datagin-filter-type"
                className="datagin-filters__select"
                value={type ?? ''}
                onChange={(e) => setType(e.target.value || null)}
              >
                <option value="">Tutte le tipologie</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="datagin-filters__field datagin-filters__field--range">
              <label htmlFor="datagin-filter-min">
                Botaniche: da {botanicalsRange[0]} a {botanicalsRange[1]}
              </label>
              <div className="datagin-filters__range-inputs">
                <input
                  id="datagin-filter-min"
                  type="number"
                  min={datasetRange[0]}
                  max={datasetRange[1]}
                  value={botanicalsRange[0]}
                  onChange={(e) => handleMinChange(e.target.value)}
                  aria-label="Numero minimo di botaniche"
                />
                <span className="datagin-filters__range-sep">&ndash;</span>
                <input
                  id="datagin-filter-max"
                  type="number"
                  min={datasetRange[0]}
                  max={datasetRange[1]}
                  value={botanicalsRange[1]}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  aria-label="Numero massimo di botaniche"
                />
              </div>
            </div>

            {isFilterActive && (
              <button type="button" className="back-link datagin-filters__reset" onClick={handleReset}>
                Azzera filtri
              </button>
            )}
          </section>

          {filteredGins.length === 0 ? (
            <div className="datagin-page__status">
              Nessun gin corrisponde a questi filtri: prova ad allargare la selezione.
            </div>
          ) : (
            <>
              <section className="stat-tiles">
                <div className="stat-tile">
                  <div className="display stat-tile__value">{totalGins(filteredGins)}</div>
                  <div className="stat-tile__label">Gin catalogati</div>
                </div>

                <div className="stat-tile">
                  <div className="display stat-tile__value">{totalCountries(filteredGins)}</div>
                  <div className="stat-tile__label">Nazioni rappresentate</div>
                </div>

                <div className="stat-tile">
                  <div className="display stat-tile__value">{oldest ? oldest.year : '—'}</div>
                  <div className="stat-tile__label">Gin più antico</div>
                  {oldest && <div className="stat-tile__sub">{oldest.gin.name}</div>}
                </div>

                <div className="stat-tile">
                  <div className="display stat-tile__value">
                    {commonBotanical ? commonBotanical.count : '—'}
                  </div>
                  <div className="stat-tile__label">Botanica più diffusa</div>
                  {commonBotanical && (
                    <div className="stat-tile__sub">
                      {commonBotanical.name} &mdash; in {commonBotanical.count} gin
                    </div>
                  )}
                </div>
              </section>

              <section className="section-block datagin-page__charts">
                <RankedBarChart
                  title="Top 10 gin per numero di botaniche"
                  items={ginsByBotanicals}
                  valueFormatter={formatBotanicalCount}
                  emptyMessage="Nessun dato sulle botaniche disponibile."
                />

                <RankedBarChart
                  title="Top 10 nazioni per numero di gin"
                  items={countriesByGinCount}
                  valueFormatter={formatGinCount}
                  emptyMessage="Nessuna nazione disponibile."
                />

                <RankedBarChart
                  title="Distribuzione per tipologia"
                  items={types}
                  valueFormatter={formatGinCount}
                  emptyMessage="Nessuna tipologia disponibile."
                />

                <RankedBarChart
                  title="Top 10 botaniche più utilizzate"
                  items={botanicals}
                  valueFormatter={formatGinCount}
                  emptyMessage="Nessuna botanica disponibile."
                />
              </section>

              <section className="section-block">
                <div className="display datagin-page__section-title">Indice dei gin</div>
                <div className="datagin-table-wrap">
                  <table className="datagin-table">
                    <thead>
                      <tr>
                        {COLUMNS.map((column) => {
                          const isSorted = column.field === sortField;
                          return (
                            <th
                              key={column.field}
                              className={isSorted ? 'is-sorted' : undefined}
                              aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                            >
                              <button type="button" onClick={() => handleSort(column.field)}>
                                {column.label}
                                {isSorted && (
                                  <span className="datagin-table__sort-icon">
                                    <SortArrowIcon direction={sortDirection} />
                                  </span>
                                )}
                              </button>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedGins.map((gin) => (
                        <tr key={gin.id}>
                          <td className="datagin-table__name">{gin.name}</td>
                          <td>{gin.country || '—'}</td>
                          <td>{gin.type || '—'}</td>
                          <td className="datagin-table__num">{formatYear(gin)}</td>
                          <td className="datagin-table__num">
                            {typeof gin.botanicalsCount === 'number' ? gin.botanicalsCount : '—'}
                          </td>
                          <td className="datagin-table__num">{formatPrice(gin)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
