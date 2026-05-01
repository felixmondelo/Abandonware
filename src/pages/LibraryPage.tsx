import { useState } from 'react';
import { GameGrid } from '../components/GameGrid';
import { FileUploader } from '../components/FileUploader';
import { useGames } from '../context/GamesContext';

export function LibraryPage() {
  const { games } = useGames();
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-900">
        <div>
          <h1 className="font-pixel text-xs text-gray-300">MI BIBLIOTECA</h1>
          <p className="font-mono text-xs text-gray-700 mt-1">
            {games.length} juego{games.length !== 1 ? 's' : ''} en tu colección
          </p>
        </div>
        <button
          onClick={() => setShowUploader(true)}
          className="font-pixel text-[9px] px-3 py-2 retro-btn"
          style={{
            color: '#00ff41',
            border: '2px solid #00ff41',
            backgroundColor: 'transparent',
            boxShadow: '0 0 8px #00ff4130',
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
          + AÑADIR ROM
        </button>
      </div>

      {/* Library grid */}
      <div className="flex-1 px-4 py-6">
        <GameGrid games={games} onAddGame={() => setShowUploader(true)} />
      </div>

      {/* File uploader modal */}
      {showUploader && (
        <FileUploader onClose={() => setShowUploader(false)} />
      )}
    </div>
  );
}
