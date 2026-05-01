import { useNavigate } from 'react-router-dom';
import {
  PLATFORM_ACCENT_COLORS,
  PLATFORM_BG_COLORS,
  PLATFORM_DESCRIPTIONS,
  PLATFORM_EXTENSIONS,
  PLATFORM_NAMES,
  PLATFORM_YEAR_RANGE,
  PLATFORMS,
} from '../constants/platforms';
import { Platform } from '../types/game';
import { useGames } from '../context/GamesContext';

const PLATFORM_ASCII: Record<Platform, string[]> = {
  dos: [
    'C:\\>_',
    '',
    'A:\\>dir',
    'DOOM.EXE',
    'MONKEY.EXE',
  ],
  spectrum: [
    '█████',
    '█   █',
    '█ S █',
    '█   █',
    '█████',
  ],
  msx: [
    ' MSX ',
    '─────',
    'Ok',
    '> _',
    '',
  ],
  amiga: [
    '┌─────┐',
    '│Wrkbch│',
    '├──────┤',
    '│ ■ ■ │',
    '└──────┘',
  ],
};

function PlatformCard({ platform, gameCount }: { platform: Platform; gameCount: number }) {
  const navigate = useNavigate();
  const accent = PLATFORM_ACCENT_COLORS[platform];
  const bg = PLATFORM_BG_COLORS[platform];
  const ascii = PLATFORM_ASCII[platform];

  return (
    <div
      className="flex flex-col cursor-pointer platform-card-hover"
      style={{
        backgroundColor: bg,
        border: `2px solid ${accent}40`,
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = accent;
        el.style.boxShadow = `0 0 20px ${accent}40, inset 0 0 20px ${accent}10`;
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = `${accent}40`;
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
      onClick={() => navigate('/library')}
    >
      {/* ASCII art area */}
      <div
        className="flex items-center justify-center py-8 px-4"
        style={{ backgroundColor: `${bg}` }}
      >
        <pre
          className="font-mono text-xs leading-relaxed text-center select-none"
          style={{ color: accent, textShadow: `0 0 8px ${accent}` }}
        >
          {ascii.join('\n')}
        </pre>
      </div>

      {/* Platform info */}
      <div
        className="p-4 flex flex-col gap-2"
        style={{ borderTop: `1px solid ${accent}30` }}
      >
        <h3
          className="font-pixel text-[11px]"
          style={{ color: accent, textShadow: `0 0 6px ${accent}80` }}
        >
          {PLATFORM_NAMES[platform]}
        </h3>
        <p className="font-mono text-[10px] text-gray-500">
          {PLATFORM_YEAR_RANGE[platform]}
        </p>
        <p className="font-mono text-xs text-gray-600 leading-relaxed">
          {PLATFORM_DESCRIPTIONS[platform]}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {PLATFORM_EXTENSIONS[platform].map((ext) => (
            <span
              key={ext}
              className="font-mono text-[9px] px-1"
              style={{ color: `${accent}80`, border: `1px solid ${accent}30` }}
            >
              {ext}
            </span>
          ))}
        </div>
        {gameCount > 0 && (
          <p
            className="font-pixel text-[8px] mt-1"
            style={{ color: accent }}
          >
            {gameCount} juego{gameCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { games } = useGames();

  const gamesByPlatform = (p: Platform) =>
    games.filter((g) => g.platform === p).length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden"
        style={{ backgroundColor: '#050505' }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div>
            <h1
              className="font-pixel text-xl sm:text-3xl text-glow-dos"
              style={{ color: '#00ff41', lineHeight: 1.4 }}
            >
              ABANDONWARE
            </h1>
            <div className="spectrum-rainbow mt-3" />
            <p className="font-mono text-sm text-gray-500 mt-3">
              Tu archivo personal de juegos retro
            </p>
          </div>

          <div className="font-mono text-xs text-gray-700 flex flex-col items-center gap-1">
            <span>MSX · ZX SPECTRUM · AMIGA · DOS/PC</span>
            <span className="text-gray-800">1982 — 2000</span>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => navigate('/library')}
              className="font-pixel text-[10px] px-4 py-3 retro-btn"
              style={{
                color: '#00ff41',
                border: '2px solid #00ff41',
                backgroundColor: 'transparent',
                boxShadow: '0 0 16px #00ff4140',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00ff41';
                (e.currentTarget as HTMLButtonElement).style.color = '#000';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#00ff41';
              }}
            >
              {games.length > 0 ? `▶ MI BIBLIOTECA (${games.length})` : '+ AÑADIR JUEGOS'}
            </button>
          </div>

          {games.length > 0 && (
            <div className="flex gap-6 font-mono text-xs text-gray-600">
              {PLATFORMS.map((p) => {
                const count = gamesByPlatform(p);
                return count > 0 ? (
                  <span key={p} style={{ color: PLATFORM_ACCENT_COLORS[p] }}>
                    {PLATFORM_NAMES[p]}: {count}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Platform cards */}
      <div className="flex-1 px-4 py-10 max-w-6xl mx-auto w-full">
        <h2 className="font-pixel text-xs text-gray-600 mb-6 flex items-center gap-3">
          <span>PLATAFORMAS SOPORTADAS</span>
          <span className="flex-1 border-t border-gray-800" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORMS.map((p) => (
            <PlatformCard key={p} platform={p} gameCount={gamesByPlatform(p)} />
          ))}
        </div>
      </div>

      {/* Info footer */}
      <div className="border-t border-gray-900 px-4 py-6 text-center">
        <p className="font-mono text-xs text-gray-700 max-w-xl mx-auto">
          Sube tus propias ROMs desde tu PC. Los juegos se guardan localmente en tu navegador.
          El emulador requiere conexión a internet (EmulatorJS CDN).
        </p>
      </div>
    </div>
  );
}
