import { Link, useLocation } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer del sito. Nelle pagine di contenuto è un normale blocco a fine
 * documento. La mappa (schermo fisso, senza scroll) lo monta invece da sé con
 * `overlay`, dentro `.map-page`: così resta sotto la scheda di dettaglio.
 */
export function Footer({ overlay = false }: { overlay?: boolean }) {
  const { pathname } = useLocation();
  if (pathname === '/' && !overlay) return null;
  const isMap = overlay;

  return (
    <footer className={`site-footer${isMap ? ' site-footer--overlay' : ''}`}>
      <span>&copy; {CURRENT_YEAR} L'Atlante del Gin</span>
      <span className="site-footer__sep" aria-hidden="true">
        &middot;
      </span>
      <Link to="/open-data">Open data</Link>
      <span className="site-footer__sep" aria-hidden="true">
        &middot;
      </span>
      <a href="/data/gins.json" download="atlante-del-gin.json">
        Scarica JSON
      </a>
      <span className="site-footer__sep" aria-hidden="true">
        &middot;
      </span>
      <Link to="/contribuisci">Segnala o proponi un gin</Link>
      {!isMap && (
        <p className="site-footer__note">
          Progetto editoriale indipendente. I marchi citati appartengono ai rispettivi titolari.
        </p>
      )}
    </footer>
  );
}
