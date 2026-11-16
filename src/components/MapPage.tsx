import { useMemo, useRef, useState } from 'react';
import { SearchBar } from './SearchBar';
import { DetailPanel } from './DetailPanel';
import { Footer } from './Footer';
import { GlobeView, type GlobeHandle } from './GlobeView';
import { useGins } from '../hooks/useGins';
import { buildRegionMarkers } from '../lib/aggregate';
import type { Gin, RegionMarker } from '../types';

function regionKeyFor(gin: Gin): string {
  return `${gin.countryCode}::${gin.region}`;
}

/**
 * L'esperienza principale del sito: globo 3D, ricerca e scheda di dettaglio.
 * Pensata a schermo fisso (niente scroll): per questo vive dentro
 * `.map-page`, l'unico wrapper dell'app che porta `position:fixed;inset:0;
 * overflow:hidden` — vedi index.css. Le altre pagine (es. /datagin) restano
 * pagine di contenuto normali, che scorrono come qualunque documento.
 */
export function MapPage() {
  const { gins, status, error } = useGins();
  const markers = useMemo(() => buildRegionMarkers(gins), [gins]);
  const globeRef = useRef<GlobeHandle>(null);

  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(null);
  const [selectedGinId, setSelectedGinId] = useState<string | null>(null);

  const selectedMarker: RegionMarker | null =
    markers.find((m) => m.key === selectedMarkerKey) ?? null;

  function openMarker(marker: RegionMarker, focusGinId?: string) {
    setSelectedMarkerKey(marker.key);
    setSelectedGinId(focusGinId ?? (marker.gins.length === 1 ? marker.gins[0].id : null));
    globeRef.current?.flyTo(marker.lat, marker.lng);
  }

  function handleMarkerClick(marker: RegionMarker) {
    openMarker(marker);
  }

  function handleSearchSelect(gin: Gin) {
    const key = regionKeyFor(gin);
    const marker = markers.find((m) => m.key === key);
    if (marker) {
      openMarker(marker, gin.id);
    } else {
      globeRef.current?.flyTo(gin.coordinates.lat, gin.coordinates.lng);
    }
  }

  function handleClose() {
    setSelectedMarkerKey(null);
    setSelectedGinId(null);
  }

  return (
    <div className="map-page">
      <div className="app-corner app-corner--tl" />
      <div className="app-corner app-corner--tr" />
      <div className="app-corner app-corner--bl" />
      <div className="app-corner app-corner--br" />

      <div className="stage-vignette stage-vignette--top" />
      <div className="stage-vignette stage-vignette--bottom" />

      {status === 'loading' && (
        <div className="status-message">L'atlante si sta dispiegando&hellip;</div>
      )}

      {status === 'error' && (
        <div className="status-message">
          Non è stato possibile caricare l'atlante ({error}). Verifica che public/data/gins.json
          sia presente e riprova.
        </div>
      )}

      {status === 'ready' && gins.length === 0 && (
        <div className="status-message">
          L'atlante è ancora vuoto: nessun gin è stato ancora catalogato.
        </div>
      )}

      {status === 'ready' && gins.length > 0 && (
        <>
          <div className={`globe-stage${selectedMarker ? ' has-panel' : ''}`}>
            <GlobeView
              ref={globeRef}
              markers={markers}
              selectedKey={selectedMarkerKey}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          <SearchBar gins={gins} onSelect={handleSearchSelect} />

          <DetailPanel
            marker={selectedMarker}
            selectedGinId={selectedGinId}
            onClose={handleClose}
            onSelectGin={(gin) => setSelectedGinId(gin.id)}
            onBackToList={() => setSelectedGinId(null)}
          />
        </>
      )}

      <Footer overlay />
    </div>
  );
}
