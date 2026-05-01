import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Game, Platform } from '../types/game';
import {
  deleteRom,
  getBios,
  getRom,
  saveBios,
  saveRom,
} from '../db/romStorage';

interface GamesContextType {
  games: Game[];
  addGame: (game: Game, blob: Blob) => Promise<void>;
  removeGame: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => void;
  updateLastPlayed: (id: string) => void;
  saveBiosForPlatform: (platform: Platform, blob: Blob) => Promise<void>;
  getRomBlob: (id: string) => Promise<Blob | null>;
  getBiosBlob: (platform: Platform) => Promise<Blob | null>;
}

const STORAGE_KEY = 'abandonware-games-v1';

const GamesContext = createContext<GamesContextType | null>(null);

function loadGamesFromStorage(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Game[]) : [];
  } catch {
    return [];
  }
}

export function GamesProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Game[]>(loadGamesFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  }, [games]);

  const addGame = useCallback(async (game: Game, blob: Blob) => {
    await saveRom(game.id, blob);
    setGames((prev) => [...prev, game]);
  }, []);

  const removeGame = useCallback(async (id: string) => {
    await deleteRom(id);
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, isFavorite: !g.isFavorite } : g
      )
    );
  }, []);

  const updateLastPlayed = useCallback((id: string) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, lastPlayedAt: Date.now() } : g
      )
    );
  }, []);

  const saveBiosForPlatform = useCallback(
    async (platform: Platform, blob: Blob) => {
      await saveBios(platform, blob);
    },
    []
  );

  const getRomBlob = useCallback(async (id: string) => {
    return getRom(id);
  }, []);

  const getBiosBlob = useCallback(async (platform: Platform) => {
    return getBios(platform);
  }, []);

  return (
    <GamesContext.Provider
      value={{
        games,
        addGame,
        removeGame,
        toggleFavorite,
        updateLastPlayed,
        saveBiosForPlatform,
        getRomBlob,
        getBiosBlob,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames(): GamesContextType {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error('useGames must be used within GamesProvider');
  return ctx;
}
