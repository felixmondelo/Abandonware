import { useEffect, useRef, useState } from 'react';
import { Game } from '../types/game';
import { PLATFORM_ACCENT_COLORS, PLATFORM_CORES } from '../constants/platforms';

const EJS_DATA_PATH = 'https://cdn.emulatorjs.org/stable/data/';
const EJS_LOADER_ID = 'ejs-loader-script';

interface Props {
  game: Game;
  gameUrl: string;
  biosUrl?: string;
}

type LoadState = 'loading' | 'ready' | 'error';

export function EmulatorPlayer({ game, gameUrl, biosUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const accent = PLATFORM_ACCENT_COLORS[game.platform];

  useEffect(() => {
    setLoadState('loading');

    // Clean up any previous EJS instance
    const existing = document.getElementById(EJS_LOADER_ID);
    if (existing) existing.remove();

    // Clear all previous EJS globals
    const ejsKeys = Object.keys(window).filter((k) => k.startsWith('EJS_'));
    for (const key of ejsKeys) {
      try {
        delete (window as unknown as Record<string, unknown>)[key];
      } catch {
        // Some globals may not be deletable
      }
    }

    // Set EmulatorJS configuration globals
    window.EJS_player = '#ejs-container';
    window.EJS_pathtodata = EJS_DATA_PATH;
    window.EJS_core = PLATFORM_CORES[game.platform];
    window.EJS_gameUrl = gameUrl;
    window.EJS_startOnLoaded = true;
    window.EJS_color = accent;
    window.EJS_volume = 0.7;

    if (biosUrl) {
      window.EJS_biosUrl = biosUrl;
    }

    // Inject the loader script
    const script = document.createElement('script');
    script.id = EJS_LOADER_ID;
    script.src = EJS_DATA_PATH + 'loader.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => setLoadState('ready');
    script.onerror = () => setLoadState('error');
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount or game change
      document.getElementById(EJS_LOADER_ID)?.remove();

      // Revoke blob URLs to free memory
      if (gameUrl.startsWith('blob:')) URL.revokeObjectURL(gameUrl);
      if (biosUrl?.startsWith('blob:')) URL.revokeObjectURL(biosUrl);

      // Clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Clear EJS globals
      const keys = Object.keys(window).filter((k) => k.startsWith('EJS_'));
      for (const key of keys) {
        try {
          delete (window as unknown as Record<string, unknown>)[key];
        } catch {
          // ignore
        }
      }
    };
  }, [game.id, gameUrl, biosUrl, accent, game.platform]);

  return (
    <div className="relative w-full h-full flex flex-col" style={{ backgroundColor: '#000' }}>
      {/* Loading overlay */}
      {loadState === 'loading' && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
          style={{ backgroundColor: '#000' }}
        >
          <BootScreen game={game} accent={accent} />
        </div>
      )}

      {/* Error overlay */}
      {loadState === 'error' && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: '#000' }}
        >
          <p className="font-pixel text-xs text-red-500">ERROR DE CARGA</p>
          <p className="font-mono text-sm text-gray-500 text-center max-w-sm px-4">
            No se pudo cargar el emulador. Comprueba tu conexión a internet (el emulador se carga desde CDN).
          </p>
          <p className="font-mono text-xs text-gray-700 mt-2">
            CDN: cdn.emulatorjs.org
          </p>
        </div>
      )}

      {/* Emulator container */}
      <div
        id="ejs-container"
        ref={containerRef}
        className="w-full flex-1"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}

function BootScreen({ game, accent }: { game: Game; accent: string }) {
  const lines = [
    `ABANDONWARE EMULATOR v1.0`,
    ``,
    `Platform : ${game.platform.toUpperCase()}`,
    `Core     : ${PLATFORM_CORES[game.platform].toUpperCase()}`,
    `ROM      : ${game.fileName}`,
    ``,
    `Loading emulator from CDN...`,
    `Please wait`,
  ];

  return (
    <div className="font-mono text-xs" style={{ color: accent, maxWidth: '400px', width: '100%', padding: '0 16px' }}>
      {lines.map((line, i) => (
        <div key={i} className="mb-1" style={{ opacity: line === '' ? 1 : 0.9 }}>
          {line}
          {i === lines.length - 1 && (
            <span className="animate-blink ml-1">█</span>
          )}
        </div>
      ))}
      <div className="mt-4 h-1 w-full" style={{ backgroundColor: `${accent}20` }}>
        <div
          className="h-full animate-pulse"
          style={{ backgroundColor: accent, width: '60%' }}
        />
      </div>
    </div>
  );
}
