export type Platform = 'dos' | 'spectrum' | 'msx' | 'amiga';

export interface Game {
  id: string;
  name: string;
  platform: Platform;
  fileName: string;
  fileSize: number;
  addedAt: number;
  lastPlayedAt?: number;
  isFavorite: boolean;
  biosFileName?: string;
}

declare global {
  interface Window {
    EJS_player: string;
    EJS_pathtodata: string;
    EJS_core: string;
    EJS_gameUrl: string;
    EJS_startOnLoaded: boolean;
    EJS_color: string;
    EJS_biosUrl?: string;
    EJS_volume?: number;
    EJS_fullscreenOnLoaded?: boolean;
    EJS_defaultOptions?: Record<string, string | boolean | number>;
    EJS_Buttons?: Record<string, boolean>;
  }
}
