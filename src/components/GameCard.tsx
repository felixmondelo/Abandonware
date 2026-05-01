import { useNavigate } from 'react-router-dom';
import { Game } from '../types/game';
import { PLATFORM_ACCENT_COLORS, PLATFORM_BG_COLORS, PLATFORM_NAMES } from '../constants/platforms';
import { PlatformBadge } from './PlatformBadge';
import { useGames } from '../context/GamesContext';

interface Props {
  game: Game;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

// Platform-specific pixel art placeholders using CSS
function PlatformArt({ platform }: { platform: Game['platform'] }) {
  const icons: Record<Game['platform'], string> = {
    dos: '█▄█\n▀█▀\n█▄█',
    spectrum: '▚▞▚\n▞▚▞\n▚▞▚',
    msx: '┌─┐\n│M│\n└─┘',
    amiga: '◆◇◆\n◇▣◇\n◆◇◆',
  };

  const accent = PLATFORM_ACCENT_COLORS[platform];

  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ backgroundColor: PLATFORM_BG_COLORS[platform] }}
    >
      <pre
        className="font-mono text-xs leading-tight select-none"
        style={{ color: accent, textShadow: `0 0 8px ${accent}` }}
      >
        {icons[platform]}
      </pre>
    </div>
  );
}

export function GameCard({ game }: Props) {
  const navigate = useNavigate();
  const { toggleFavorite, removeGame } = useGames();
  const accent = PLATFORM_ACCENT_COLORS[game.platform];

  return (
    <div
      className="group relative flex flex-col cursor-pointer platform-card-hover"
      style={{
        backgroundColor: PLATFORM_BG_COLORS[game.platform],
        border: `1px solid ${accent}40`,
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accent;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 12px ${accent}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
      onClick={() => navigate(`/play/${game.id}`)}
    >
      {/* Thumbnail */}
      <div className="h-24 w-full overflow-hidden">
        <PlatformArt platform={game.platform} />
      </div>

      {/* Info */}
      <div className="p-2 flex-1 flex flex-col gap-1">
        <PlatformBadge platform={game.platform} />
        <p
          className="font-pixel text-[9px] leading-tight mt-1 truncate"
          style={{ color: accent }}
          title={game.name}
        >
          {game.name}
        </p>
        <p className="font-mono text-[10px] text-gray-600 mt-auto">
          {formatSize(game.fileSize)}
        </p>
        {game.lastPlayedAt && (
          <p className="font-mono text-[9px] text-gray-700">
            Jugado: {formatDate(game.lastPlayedAt)}
          </p>
        )}
      </div>

      {/* Hover actions */}
      <div
        className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="w-6 h-6 flex items-center justify-center text-xs"
          style={{
            backgroundColor: '#000',
            color: game.isFavorite ? '#ffcc00' : '#555',
            border: `1px solid ${game.isFavorite ? '#ffcc00' : '#333'}`,
          }}
          onClick={() => toggleFavorite(game.id)}
          title={game.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          ★
        </button>
        <button
          className="w-6 h-6 flex items-center justify-center text-xs"
          style={{
            backgroundColor: '#000',
            color: '#ff4444',
            border: '1px solid #440000',
          }}
          onClick={() => {
            if (confirm(`¿Eliminar "${game.name}"?`)) removeGame(game.id);
          }}
          title="Eliminar juego"
        >
          ✕
        </button>
      </div>

      {/* Play overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ backgroundColor: `${PLATFORM_BG_COLORS[game.platform]}cc` }}
      >
        <span
          className="font-pixel text-xs px-3 py-2"
          style={{
            color: accent,
            border: `2px solid ${accent}`,
            textShadow: `0 0 8px ${accent}`,
            boxShadow: `0 0 12px ${accent}40`,
          }}
        >
          ▶ PLAY
        </span>
      </div>

      {/* Favorite indicator */}
      {game.isFavorite && (
        <div
          className="absolute top-0 left-0 w-0 h-0"
          style={{
            borderTop: '16px solid #ffcc00',
            borderRight: '16px solid transparent',
          }}
        />
      )}

      {/* Platform label for screen readers */}
      <span className="sr-only">{PLATFORM_NAMES[game.platform]}: {game.name}</span>
    </div>
  );
}
