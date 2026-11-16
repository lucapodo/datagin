import { useMemo, useState, type KeyboardEvent } from 'react';
import type { Gin } from '../types';
import { searchGins } from '../lib/aggregate';
import { SearchIcon } from './icons';

interface Props {
  gins: Gin[];
  onSelect: (gin: Gin) => void;
}

export function SearchBar({ gins, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => searchGins(gins, query), [gins, query]);
  const showDropdown = isFocused && query.trim().length > 0;

  function handleSelect(gin: Gin) {
    setQuery(gin.name);
    setIsFocused(false);
    onSelect(gin);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && results.length >= 1) {
      handleSelect(results[0]);
    } else if (event.key === 'Escape') {
      setIsFocused(false);
      event.currentTarget.blur();
    }
  }

  return (
    <div className="search-dock">
      <div className="search-bar">
        <SearchIcon />
        <input
          className="search-bar__input"
          type="text"
          placeholder="Cerca gin, nazione o botanica…"
          aria-label="Cerca gin, nazione o botanica"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={handleKeyDown}
        />
        <div className="search-bar__divider" />
        <div className="search-bar__label">CERCA</div>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="search-suggestions">
          {results.slice(0, 8).map((gin) => (
            <button
              key={gin.id}
              type="button"
              className="search-suggestions__item"
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(gin);
              }}
            >
              <span className="search-suggestions__item-name">{gin.name}</span>
              <span className="search-suggestions__item-meta">
                {gin.region}, {gin.country}
              </span>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && (
        <div className="search-empty">Nessuna voce dell'atlante corrisponde a questa ricerca.</div>
      )}
    </div>
  );
}
