import { useEffect, useState } from 'react';
import type { Gin } from '../types';

interface GinsState {
  gins: Gin[];
  status: 'loading' | 'ready' | 'error';
  error: string | null;
}

/**
 * Carica data/gins.json a runtime via fetch (non un import statico), così in
 * produzione basta rigenerare public/data/gins.json per aggiornare i
 * contenuti senza ricompilare il sorgente.
 */
export function useGins(): GinsState {
  const [state, setState] = useState<GinsState>({ gins: [], status: 'loading', error: null });

  useEffect(() => {
    let cancelled = false;

    fetch('/data/gins.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Gin[]) => {
        if (!cancelled) setState({ gins: data, status: 'ready', error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            gins: [],
            status: 'error',
            error: err instanceof Error ? err.message : 'Errore sconosciuto',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
