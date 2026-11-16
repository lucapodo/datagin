export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="search-bar__icon" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <line x1="12" y1="12" x2="17" y2="17" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
      <line x1="1" y1="1" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" />
      <line x1="14" y1="1" x2="1" y2="14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function DiamondRule() {
  return (
    <div className="site-header__rule">
      <div className="site-header__rule-line" />
      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
        <path
          d="M6.5,0 L13,6.5 L6.5,13 L0,6.5 Z"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1"
        />
      </svg>
      <div className="site-header__rule-line" />
    </div>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" aria-hidden="true">
      <line x1="0" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7,1 L11,5 L7,9" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" aria-hidden="true">
      <line x1="2" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6,1 L2,5 L6,9" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Freccina d'ordinamento per le intestazioni di tabella: punta in su per
 * l'ordine crescente, in giù per il decrescente — stesso tratto sottile a
 * mano libera delle altre icone della pagina. */
export function SortArrowIcon({ direction }: { direction: 'asc' | 'desc' }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      aria-hidden="true"
      style={{ transform: direction === 'desc' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M4.5,8.2 L4.5,0.8 M1.2,4 L4.5,0.6 L7.8,4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
