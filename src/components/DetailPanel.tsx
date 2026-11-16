import { useState } from 'react';
import type { Gin, RegionMarker } from '../types';
import { CloseIcon } from './icons';
import { RegionList } from './RegionList';
import { GinDetail } from './GinDetail';

interface Props {
  marker: RegionMarker | null;
  selectedGinId: string | null;
  onClose: () => void;
  onSelectGin: (gin: Gin) => void;
  onBackToList: () => void;
}

export function DetailPanel({ marker, selectedGinId, onClose, onSelectGin, onBackToList }: Props) {
  // Manteniamo in cache l'ultimo contenuto mostrato così, durante
  // l'animazione di chiusura (slide-out), il pannello non appare vuoto
  // mentre scivola fuori dallo schermo. Aggiorniamo la cache durante il
  // render stesso (pattern "adjusting state while rendering" di React),
  // non in un effect, perché è una derivazione pura dalle prop correnti.
  const [cachedMarker, setCachedMarker] = useState<RegionMarker | null>(null);
  const [cachedGinId, setCachedGinId] = useState<string | null>(null);
  const [syncedKey, setSyncedKey] = useState<string | null>(null);

  const currentKey = marker ? `${marker.key}::${selectedGinId ?? ''}` : null;
  if (marker && currentKey !== syncedKey) {
    setSyncedKey(currentKey);
    setCachedMarker(marker);
    setCachedGinId(selectedGinId);
  }

  const isOpen = marker !== null;
  const displayMarker = marker ?? cachedMarker;
  const displayGinId = marker ? selectedGinId : cachedGinId;
  const gin = displayMarker?.gins.find((g) => g.id === displayGinId) ?? null;

  return (
    <div className={`detail-panel${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="detail-panel__drag-handle" />
      <button type="button" className="detail-panel__close" onClick={onClose} aria-label="Chiudi scheda">
        <CloseIcon />
      </button>

      {displayMarker && !gin && <RegionList marker={displayMarker} onSelectGin={onSelectGin} />}
      {displayMarker && gin && (
        <GinDetail gin={gin} showBack={displayMarker.gins.length > 1} onBack={onBackToList} />
      )}
    </div>
  );
}
