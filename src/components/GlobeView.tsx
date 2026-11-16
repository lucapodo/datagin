import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import GlobeGL, { type GlobeMethods } from 'react-globe.gl';
import type { RegionMarker } from '../types';
import { getAtlasGlobeMaterial, PALETTE } from '../lib/globeTexture';

export interface GlobeHandle {
  flyTo: (lat: number, lng: number) => void;
}

interface Props {
  markers: RegionMarker[];
  selectedKey: string | null;
  onMarkerClick: (marker: RegionMarker) => void;
}

type MarkerDatum = RegionMarker & { dotSize: number };

const FLY_DURATION_MS = 1400;
const AUTO_ROTATE_SPEED = 0.35;
/** Dopo un'interazione dell'utente, l'auto-rotazione riparte dopo questo intervallo. */
const AUTO_ROTATE_RESUME_MS = 4000;

// Accessor e config a livello di modulo: identità stabile tra i render, così
// react-globe.gl non vede mai "prop cambiate" e non ri-digerisce i layer.
const markerLat = (d: object) => (d as MarkerDatum).lat;
const markerLng = (d: object) => (d as MarkerDatum).lng;

/**
 * I marker sul lato nascosto del globo non vengono più spenti di colpo
 * (display:none, il comportamento di default di three-globe, che li faceva
 * "lampeggiare" all'orizzonte) ma sfumano via CSS tramite una classe.
 */
function markerVisibility(el: HTMLElement, isVisible: boolean) {
  el.classList.toggle('is-behind', !isVisible);
}

function markerScale(count: number): number {
  // Diametro del pallino leggermente proporzionale al numero di gin nella regione.
  return Math.min(20, 9 + Math.sqrt(count) * 4.5);
}

export const GlobeView = forwardRef<GlobeHandle, Props>(function GlobeView(
  { markers, selectedKey, onMarkerClick },
  ref,
) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  const selectedKeyRef = useRef(selectedKey);
  /** Elementi DOM dei marker, per chiave: la selezione li aggiorna in place. */
  const markerElsRef = useRef(new Map<string, HTMLElement>());
  const resumeTimerRef = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const globeMaterial = useMemo(() => getAtlasGlobeMaterial(), []);

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  const [size, setSize] = useState({ width: 900, height: 900 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // Arrotondiamo per evitare resize (e re-render) per frazioni di pixel.
      const width = Math.max(220, Math.round(entry.contentRect.width));
      const height = Math.max(220, Math.round(entry.contentRect.height));
      // Il canvas riempie tutto il rettangolo disponibile (l'intero schermo):
      // un ritaglio quadrato taglierebbe l'alone dell'atmosfera ai bordi.
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * L'auto-rotazione resta attiva solo quando il globo è "a riposo": nessuna
   * scheda aperta e nessuna animazione/interazione in corso. Durante il
   * fly-to di pointOfView() la rotazione automatica combatterebbe con il
   * tween della camera producendo scatti e una deriva finale.
   */
  const scheduleAutoRotate = useCallback((delay: number) => {
    window.clearTimeout(resumeTimerRef.current);
    const controls = globeRef.current?.controls();
    if (!controls) return;
    controls.autoRotate = false;
    if (selectedKeyRef.current) return; // con una scheda aperta resta fermo
    resumeTimerRef.current = window.setTimeout(() => {
      if (!selectedKeyRef.current && globeRef.current) {
        globeRef.current.controls().autoRotate = true;
      }
    }, delay);
  }, []);

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  useImperativeHandle(
    ref,
    () => ({
      flyTo(lat: number, lng: number) {
        globeRef.current?.pointOfView({ lat, lng, altitude: 1.5 }, FLY_DURATION_MS);
        scheduleAutoRotate(FLY_DURATION_MS + AUTO_ROTATE_RESUME_MS);
      },
    }),
    [scheduleAutoRotate],
  );

  // Selezione: aggiorna solo la classe dei marker esistenti, senza ricrearli
  // (ricrearli tutti faceva sparire/riapparire ogni pallino a ogni click).
  useEffect(() => {
    selectedKeyRef.current = selectedKey;
    markerElsRef.current.forEach((el, key) => {
      el.classList.toggle('is-active', key === selectedKey);
    });
    if (ready) scheduleAutoRotate(AUTO_ROTATE_RESUME_MS);
  }, [selectedKey, ready, scheduleAutoRotate]);

  const handleGlobeReady = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;

    g.pointOfView({ lat: 24, lng: 12, altitude: 2.3 }, 0);

    const controls = g.controls();
    controls.autoRotate = !selectedKeyRef.current;
    controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 140;
    controls.maxDistance = 520;
    // L'utente prende il controllo: fermiamo la rotazione e la riprendiamo
    // dopo qualche secondo di inattività.
    controls.addEventListener('start', () => {
      window.clearTimeout(resumeTimerRef.current);
      controls.autoRotate = false;
    });
    controls.addEventListener('end', () => scheduleAutoRotate(AUTO_ROTATE_RESUME_MS));

    setReady(true);
  }, [scheduleAutoRotate]);

  // Dipende solo da `markers`: la selezione non cambia i dati del layer, così
  // three-globe non distrugge e ricrea gli elementi DOM.
  // Se i dati cambiano, htmlElement() sovrascrive le voci per chiave.
  const markerData: MarkerDatum[] = useMemo(
    () => markers.map((m) => ({ ...m, dotSize: markerScale(m.gins.length) })),
    [markers],
  );

  const htmlElement = useCallback((d: object) => {
    const m = d as MarkerDatum;
    const wrapperSize = m.dotSize + 24;

    const el = document.createElement('div');
    el.className = `globe-marker${m.key === selectedKeyRef.current ? ' is-active' : ''}`;
    el.style.width = `${wrapperSize}px`;
    el.style.height = `${wrapperSize}px`;
    el.style.setProperty('--dot-size', `${m.dotSize}px`);
    const count = m.gins.length;
    el.title = `${m.region}, ${m.country} — ${count} gin in atlante`;

    const ring = document.createElement('span');
    ring.className = 'globe-marker__ring';
    const dot = document.createElement('span');
    dot.className = 'globe-marker__dot';
    el.appendChild(ring);
    el.appendChild(dot);

    el.addEventListener('click', (event) => {
      event.stopPropagation();
      onMarkerClickRef.current(m);
    });

    markerElsRef.current.set(m.key, el);
    return el;
  }, []);

  return (
    <div ref={containerRef} className="globe-stage-inner">
      <GlobeGL
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        // Terre, coste, confini e reticolo sono tutti in un'unica texture
        // (vedi lib/globeTexture.ts): nessun polygonsData / showGraticules,
        // quindi nessuna geometria sovrapposta alla sfera che possa
        // sfarfallare per z-fighting.
        globeMaterial={globeMaterial}
        globeCurvatureResolution={2}
        showGlobe
        showGraticules={false}
        showAtmosphere
        atmosphereColor={PALETTE.inkSoft}
        atmosphereAltitude={0.18}
        onGlobeReady={handleGlobeReady}
        htmlElementsData={markerData}
        htmlLat={markerLat}
        htmlLng={markerLng}
        htmlAltitude={0.01}
        htmlElement={htmlElement}
        htmlElementVisibilityModifier={markerVisibility}
        htmlTransitionDuration={0}
      />
    </div>
  );
});
