import { Platform } from '../types/game';

export const PLATFORM_NAMES: Record<Platform, string> = {
  dos: 'DOS / PC',
  spectrum: 'ZX Spectrum',
  msx: 'MSX',
  amiga: 'Amiga',
};

export const PLATFORM_CORES: Record<Platform, string> = {
  dos: 'dosbox',
  spectrum: 'fuse',
  msx: 'fmsx',
  amiga: 'puae',
};

export const PLATFORM_ACCENT_COLORS: Record<Platform, string> = {
  dos: '#00ff41',
  spectrum: '#ff0000',
  msx: '#4fc3f7',
  amiga: '#ff6600',
};

export const PLATFORM_BG_COLORS: Record<Platform, string> = {
  dos: '#000000',
  spectrum: '#000000',
  msx: '#1a1a2e',
  amiga: '#2a2d6b',
};

export const PLATFORM_REQUIRES_BIOS: Record<Platform, boolean> = {
  dos: false,
  spectrum: false,
  msx: true,
  amiga: true,
};

export const PLATFORM_BIOS_LABELS: Record<Platform, string> = {
  dos: '',
  spectrum: '',
  msx: 'BIOS MSX (.zip con Databases/ y Machines/)',
  amiga: 'Kickstart ROM (.rom)',
};

// File extension → platform auto-detection
export const EXTENSION_TO_PLATFORM: Record<string, Platform> = {
  '.tap': 'spectrum',
  '.tzx': 'spectrum',
  '.z80': 'spectrum',
  '.sna': 'spectrum',
  '.szx': 'spectrum',
  '.rom': 'msx',
  '.adf': 'amiga',
  '.adz': 'amiga',
  '.dms': 'amiga',
  '.exe': 'dos',
  '.com': 'dos',
};

// Accepted extensions per platform (for file picker)
export const PLATFORM_EXTENSIONS: Record<Platform, string[]> = {
  dos: ['.zip', '.exe', '.com'],
  spectrum: ['.tap', '.tzx', '.z80', '.sna', '.szx'],
  msx: ['.rom', '.dsk', '.zip'],
  amiga: ['.adf', '.adz', '.dms', '.zip'],
};

export const ALL_GAME_EXTENSIONS = [
  ...PLATFORM_EXTENSIONS.dos,
  ...PLATFORM_EXTENSIONS.spectrum,
  ...PLATFORM_EXTENSIONS.msx,
  ...PLATFORM_EXTENSIONS.amiga,
].filter((v, i, a) => a.indexOf(v) === i);

export const PLATFORM_DESCRIPTIONS: Record<Platform, string> = {
  dos: 'Doom, Monkey Island, Commander Keen, Prince of Persia',
  spectrum: 'Manic Miner, Head Over Heels, Jet Set Willy',
  msx: 'Metal Gear, Nemesis, Knightmare, F1 Spirit',
  amiga: 'Lemmings, Sensible Soccer, Shadow of the Beast',
};

export const PLATFORM_YEAR_RANGE: Record<Platform, string> = {
  dos: '1981 – 2000',
  spectrum: '1982 – 1995',
  msx: '1983 – 1995',
  amiga: '1985 – 1996',
};

export const PLATFORMS: Platform[] = ['dos', 'spectrum', 'msx', 'amiga'];
