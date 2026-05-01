import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { GamesProvider } from './context/GamesContext';
import { NavBar } from './components/NavBar';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { PlayerPage } from './pages/PlayerPage';

function AppRoutes() {
  const { pathname } = useLocation();
  const isPlayerPage = pathname.startsWith('/play/');

  return (
    <div className="flex flex-col min-h-screen crt-scanlines">
      {!isPlayerPage && <NavBar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/play/:gameId" element={<PlayerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <GamesProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GamesProvider>
  );
}
