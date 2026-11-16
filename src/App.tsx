import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MapPage } from './components/MapPage';
import { DataGinPage } from './components/DataGinPage';
import { GinStylesPage } from './components/GinStylesPage';
import { GinTonicPage } from './components/GinTonicPage';
import { OpenDataPage } from './components/OpenDataPage';
import { ContributePage } from './components/ContributePage';

// Le pagine di contenuto scorrono: cambiando pagina si riparte dall'alto.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/datagin" element={<DataGinPage />} />
          <Route path="/tipologie" element={<GinStylesPage />} />
          <Route path="/gin-tonic" element={<GinTonicPage />} />
          <Route path="/open-data" element={<OpenDataPage />} />
          <Route path="/contribuisci" element={<ContributePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
