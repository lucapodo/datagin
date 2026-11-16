import { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { DiamondRule } from './icons';

const NAV_ITEMS = [
  { to: '/', label: 'Mappa' },
  { to: '/datagin', label: 'DataGin' },
  { to: '/tipologie', label: 'Tipologie' },
  { to: '/gin-tonic', label: 'Gin Tonic' },
];

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return `site-header__nav-link${isActive ? ' is-active' : ''}`;
}

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="display site-header__logo">
        L'ATLANTE DEL GIN
      </Link>
      <div className="site-header__tagline">Un viaggio botanico intorno al mondo</div>
      <DiamondRule />
      <nav className="site-header__nav">
        {NAV_ITEMS.map((item, i) => (
          <Fragment key={item.to}>
            {i > 0 && (
              <span className="site-header__nav-sep" aria-hidden="true">
                &middot;
              </span>
            )}
            <NavLink to={item.to} end={item.to === '/'} className={navLinkClassName}>
              {item.label}
            </NavLink>
          </Fragment>
        ))}
      </nav>
    </header>
  );
}
