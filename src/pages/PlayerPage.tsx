import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmulatorPlayer } from '../components/EmulatorPlayer';
import { useGames } from '../context/GamesContext';
import { PLATFORM_ACCENT_COLORS, PLATFORM_NAMES, PLATFORM_REQUIRES_BIOS } from '../constants/platforms';

export function PlayerPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { games, getRomBlob, getBiosBlob, updateLastPlayed } = useGames();

  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [biosUrl, setBiosUrl] = useState<string | null>(undefined as unknown as null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>();

  const game = games.find((g) => g.id === gameId);
  const accent = game ? PLATFORM_ACCENT_COLORS[game.platform] : '#00ff41';

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const show = () => {
      setShowControls(true);
      clearTimeout(hideControlsTimer.current);
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', show);
    window.addEventListener('keydown', show);
    show();
    return () => {
      window.removeEventListener('mousemove', show);
      window.removeEventListener('keydown', show);
      clearTimeout(hideControlsTimer.current);
    };
  }, []);

  // Load ROM and BIOS blobs
  useEffect(() => {
    if (!game) return;

    async function load() {
      try {
        const blob = await getRomBlob(game!.id);
        if (!blob) throw new Error('ROM no encontrada en la base de datos local');
        setGameUrl(URL.createObjectURL(blob));

        if (PLATFORM_REQUIRES_BIOS[game!.platform]) {
          const bios = await getBiosBlob(game!.platform);
          if (bios) setBiosUrl(URL.createObjectURL(bios));
        }

        updateLastPlayed(game!.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [game?.id]);

  // Fullscreen API
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="font-pixel text-xs text-red-500">JUEGO NO ENCONTRADO</p>
        <button
          onClick={() => navigate('/library')}
          className="font-pixel text-[9px] text-gray-500 border border-gray-700 px-3 py-2"
        >
          ← VOLVER A BIBLIOTECA
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="font-mono text-xs animate-pulse" style={{ color: accent }}>
          Cargando {game.name}...
        </p>
      </div>
    );
  }

  if (error || !gameUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="font-pixel text-xs text-red-500">ERROR</p>
        <p className="font-mono text-sm text-gray-500 text-center max-w-sm px-4">{error}</p>
        <button
          onClick={() => navigate('/library')}
          className="font-pixel text-[9px] text-gray-500 border border-gray-700 px-3 py-2"
        >
          ← VOLVER A BIBLIOTECA
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col"
      style={{
        height: 'calc(100vh - 49px)',
        backgroundColor: '#000',
      }}
    >
      {/* Top bar (auto-hides) */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderBottom: `1px solid ${accent}30`,
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/library')}
            className="font-pixel text-[8px] text-gray-500 hover:text-gray-300 retro-btn px-2 py-1 border border-gray-800"
          >
            ← EXIT
          </button>
          <div>
            <span
              className="font-pixel text-[9px]"
              style={{ color: accent }}
            >
              {game.name}
            </span>
            <span className="font-mono text-[9px] text-gray-600 ml-2">
              {PLATFORM_NAMES[game.platform]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="font-pixel text-[8px] px-2 py-1 retro-btn"
            style={{
              color: accent,
              border: `1px solid ${accent}60`,
            }}
            title="Pantalla completa (F11)"
          >
            {isFullscreen ? '⊡' : '⊞'} FULLSCREEN
          </button>
        </div>
      </div>

      {/* Emulator */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <EmulatorPlayer
          game={game}
          gameUrl={gameUrl}
          biosUrl={biosUrl ?? undefined}
        />
      </div>

      {/* Keyboard hint (auto-hides) */}
      <div
        className="absolute bottom-2 right-2 z-20 transition-opacity duration-300"
        style={{ opacity: showControls ? 0.6 : 0 }}
      >
        <p className="font-mono text-[9px] text-gray-700">
          Mueve el ratón para mostrar controles
        </p>
      </div>
    </div>
  );
}
