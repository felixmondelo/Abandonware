import { useState } from 'react';
import { Game, Platform } from '../types/game';
import { GameCard } from './GameCard';
import { PLATFORM_ACCENT_COLORS, PLATFORM_NAMES, PLATFORMS } from '../constants/platforms';

interface Props {
  games: Game[];
  onAddGame: () => void;
}

type FilterTab = 'all' | 'favorites' | Platform;

export function GameGrid({ games, onAddGame }: Props) {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const filtered = games.filter((g) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'favorites' && g.isFavorite) ||
      g.platform === filter;
    const matchesSearch = g.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const tabs: { id: FilterTab; label: string; color?: string }[] = [
    { id: 'all', label: 'TODOS' },
    { id: 'favorites', label: '★ FAV' },
    ...PLATFORMS.map((p) => ({
      id: p as FilterTab,
      label: PLATFORM_NAMES[p].toUpperCase(),
      color: PLATFORM_ACCENT_COLORS[p],
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="font-pixel text-[9px] px-2 py-1 retro-btn transition-colors"
              style={{
                backgroundColor: isActive ? (tab.color ?? '#00ff41') : 'transparent',
                color: isActive ? '#000' : (tab.color ?? '#555'),
                border: `1px solid ${tab.color ?? (isActive ? '#00ff41' : '#333')}`,
                boxShadow: isActive ? `0 0 8px ${tab.color ?? '#00ff41'}60` : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-gray-600 font-mono text-xs hidden sm:block">BUSCAR:</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="nombre del juego..."
            className="bg-transparent border border-gray-700 text-gray-300 font-mono text-xs px-2 py-1 outline-none focus:border-dos-text w-40 sm:w-52"
            style={{ caretColor: '#00ff41' }}
          />
        </div>
      </div>

      {/* Games grid */}
      {filtered.length === 0 ? (
        <EmptyState
          hasGames={games.length > 0}
          onAddGame={onAddGame}
          filter={filter}
          search={search}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="font-mono text-xs text-gray-700">
          {filtered.length} juego{filtered.length !== 1 ? 's' : ''}
          {filter !== 'all' ? ` en ${filter === 'favorites' ? 'favoritos' : PLATFORM_NAMES[filter as Platform]}` : ''}
        </p>
      )}
    </div>
  );
}

function EmptyState({
  hasGames,
  onAddGame,
  filter,
  search,
}: {
  hasGames: boolean;
  onAddGame: () => void;
  filter: FilterTab;
  search: string;
}) {
  if (search) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="font-pixel text-xs">SIN RESULTADOS</p>
        <p className="font-mono text-sm mt-2">No hay juegos que coincidan con "{search}"</p>
      </div>
    );
  }

  if (hasGames && filter !== 'all') {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="font-pixel text-xs">SIN JUEGOS</p>
        <p className="font-mono text-sm mt-2">
          {filter === 'favorites'
            ? 'Aún no tienes favoritos'
            : `No hay juegos de ${PLATFORM_NAMES[filter as Platform]}`}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-20 flex flex-col items-center gap-6">
      <div className="font-mono text-dos-text text-opacity-50" style={{ fontSize: '48px', lineHeight: 1 }}>
        █
      </div>
      <div>
        <p className="font-pixel text-xs text-gray-500 mb-2">
          INSERT COIN
        </p>
        <p className="font-mono text-sm text-gray-600">
          Tu biblioteca está vacía. Añade tus ROMs para empezar.
        </p>
      </div>
      <button
        onClick={onAddGame}
        className="font-pixel text-[10px] px-4 py-2 retro-btn"
        style={{
          color: '#00ff41',
          border: '2px solid #00ff41',
          backgroundColor: 'transparent',
          boxShadow: '0 0 12px #00ff4140',
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
        + AÑADIR JUEGO
      </button>
    </div>
  );
}
