import { useCallback, useRef, useState } from 'react';
import { Game, Platform } from '../types/game';
import {
  ALL_GAME_EXTENSIONS,
  EXTENSION_TO_PLATFORM,
  PLATFORM_BIOS_LABELS,
  PLATFORM_EXTENSIONS,
  PLATFORM_NAMES,
  PLATFORM_REQUIRES_BIOS,
  PLATFORMS,
} from '../constants/platforms';
import { PLATFORM_ACCENT_COLORS, PLATFORM_BG_COLORS } from '../constants/platforms';
import { useGames } from '../context/GamesContext';
import { PlatformBadge } from './PlatformBadge';

interface Props {
  onClose: () => void;
}

type Step = 'select' | 'confirm' | 'bios' | 'done';

function detectPlatform(filename: string): Platform | null {
  const lower = filename.toLowerCase();
  const ext = '.' + lower.split('.').pop();
  return EXTENSION_TO_PLATFORM[ext] ?? null;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function FileUploader({ onClose }: Props) {
  const { addGame, saveBiosForPlatform } = useGames();
  const [step, setStep] = useState<Step>('select');
  const [isDragging, setIsDragging] = useState(false);
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [biosFile, setBiosFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [gameName, setGameName] = useState('');
  const [manualPlatform, setManualPlatform] = useState<Platform>('dos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const biosInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const detected = detectPlatform(file.name);
    const nameNoExt = file.name.replace(/\.[^.]+$/, '');
    setGameFile(file);
    setPlatform(detected);
    setManualPlatform(detected ?? 'dos');
    setGameName(nameNoExt);
    setStep('confirm');
    setError('');
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const effectivePlatform = platform ?? manualPlatform;
  const needsBios = PLATFORM_REQUIRES_BIOS[effectivePlatform];
  const accent = PLATFORM_ACCENT_COLORS[effectivePlatform];

  async function handleConfirm() {
    if (!gameFile) return;
    if (needsBios && !biosFile) {
      setStep('bios');
      return;
    }
    await save();
  }

  async function save() {
    if (!gameFile || !gameName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const id = generateId();
      const game: Game = {
        id,
        name: gameName.trim(),
        platform: effectivePlatform,
        fileName: gameFile.name,
        fileSize: gameFile.size,
        addedAt: Date.now(),
        isFavorite: false,
        biosFileName: biosFile?.name,
      };
      await addGame(game, gameFile);
      if (biosFile) {
        await saveBiosForPlatform(effectivePlatform, biosFile);
      }
      setStep('done');
    } catch (e) {
      setError(`Error al guardar: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
      <div
        className="w-full max-w-lg screen-boot"
        style={{
          backgroundColor: '#0d0d0d',
          border: `2px solid ${accent}`,
          boxShadow: `0 0 24px ${accent}40`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${accent}40` }}
        >
          <span className="font-pixel text-[10px]" style={{ color: accent }}>
            {step === 'select' && 'INSERTAR ROM'}
            {step === 'confirm' && 'CONFIRMAR JUEGO'}
            {step === 'bios' && 'BIOS REQUERIDA'}
            {step === 'done' && 'JUEGO AÑADIDO'}
          </span>
          <button
            onClick={onClose}
            className="font-mono text-gray-600 hover:text-gray-300 text-sm"
          >
            [✕]
          </button>
        </div>

        <div className="p-4">
          {/* STEP: SELECT */}
          {step === 'select' && (
            <div
              className={`flex flex-col items-center justify-center gap-4 py-10 border-2 border-dashed transition-colors cursor-pointer ${
                isDragging ? 'border-dos-text' : 'border-gray-700'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="font-mono text-4xl text-gray-700 select-none">
                {isDragging ? '▼' : '▲'}
              </div>
              <div className="text-center">
                <p className="font-pixel text-[10px] text-gray-400">
                  {isDragging ? 'SUELTA EL ARCHIVO' : 'ARRASTRA TU ROM AQUÍ'}
                </p>
                <p className="font-mono text-xs text-gray-600 mt-2">
                  o haz clic para seleccionar
                </p>
              </div>
              <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                {ALL_GAME_EXTENSIONS.map((ext) => (
                  <span key={ext} className="font-mono text-[9px] text-gray-700">
                    {ext}
                  </span>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={ALL_GAME_EXTENSIONS.join(',')}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          )}

          {/* STEP: CONFIRM */}
          {step === 'confirm' && gameFile && (
            <div className="flex flex-col gap-4">
              {/* Detected platform */}
              <div className="flex items-center gap-3 p-3" style={{ backgroundColor: PLATFORM_BG_COLORS[effectivePlatform], border: `1px solid ${accent}40` }}>
                <PlatformBadge platform={effectivePlatform} size="md" />
                <span className="font-mono text-xs text-gray-400">{gameFile.name}</span>
              </div>

              {!platform && (
                <div>
                  <label className="font-pixel text-[9px] text-gray-500 block mb-2">
                    PLATAFORMA (no detectada):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setManualPlatform(p)}
                        className="font-pixel text-[9px] px-2 py-1 retro-btn"
                        style={{
                          backgroundColor: manualPlatform === p ? PLATFORM_ACCENT_COLORS[p] : 'transparent',
                          color: manualPlatform === p ? '#000' : PLATFORM_ACCENT_COLORS[p],
                          border: `1px solid ${PLATFORM_ACCENT_COLORS[p]}`,
                        }}
                      >
                        {PLATFORM_NAMES[p]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-pixel text-[9px] text-gray-500 block mb-1">
                  NOMBRE DEL JUEGO:
                </label>
                <input
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full bg-transparent font-mono text-sm px-2 py-2 outline-none"
                  style={{
                    color: accent,
                    border: `1px solid ${accent}60`,
                    caretColor: accent,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = `${accent}60`)}
                />
              </div>

              {error && (
                <p className="font-mono text-xs text-red-500">{error}</p>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setStep('select')}
                  className="font-pixel text-[9px] px-3 py-2 retro-btn text-gray-500 border border-gray-700"
                >
                  ← ATRÁS
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!gameName.trim() || loading}
                  className="font-pixel text-[9px] px-3 py-2 retro-btn disabled:opacity-40"
                  style={{
                    color: accent,
                    border: `2px solid ${accent}`,
                    boxShadow: `0 0 8px ${accent}40`,
                  }}
                >
                  {loading ? 'GUARDANDO...' : needsBios ? 'SIGUIENTE →' : '✓ AÑADIR'}
                </button>
              </div>
            </div>
          )}

          {/* STEP: BIOS */}
          {step === 'bios' && (
            <div className="flex flex-col gap-4">
              <div className="p-3 border border-yellow-800 bg-yellow-900 bg-opacity-20">
                <p className="font-pixel text-[9px] text-yellow-500 mb-2">⚠ BIOS NECESARIA</p>
                <p className="font-mono text-xs text-yellow-700">
                  {effectivePlatform === 'amiga'
                    ? 'Amiga requiere la ROM de Kickstart para funcionar. Esta ROM es copyright de Cloanto/Amiga Inc. y debes poseer una copia legal.'
                    : 'MSX requiere archivos de BIOS (Databases/ y Machines/) en formato ZIP.'}
                </p>
              </div>

              <div>
                <label className="font-pixel text-[9px] text-gray-500 block mb-2">
                  {PLATFORM_BIOS_LABELS[effectivePlatform]}:
                </label>
                <button
                  onClick={() => biosInputRef.current?.click()}
                  className="w-full py-3 font-pixel text-[9px] retro-btn"
                  style={{
                    color: accent,
                    border: `1px dashed ${accent}60`,
                    backgroundColor: 'transparent',
                  }}
                >
                  {biosFile ? `✓ ${biosFile.name}` : 'SELECCIONAR BIOS →'}
                </button>
                <input
                  ref={biosInputRef}
                  type="file"
                  className="hidden"
                  accept={effectivePlatform === 'amiga' ? '.rom,.bin' : '.zip'}
                  onChange={(e) => setBiosFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {error && <p className="font-mono text-xs text-red-500">{error}</p>}

              <div className="flex gap-3 justify-between">
                <button
                  onClick={() => save()}
                  className="font-pixel text-[9px] px-3 py-2 retro-btn text-gray-600 border border-gray-800"
                >
                  OMITIR BIOS
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('confirm')}
                    className="font-pixel text-[9px] px-3 py-2 retro-btn text-gray-500 border border-gray-700"
                  >
                    ← ATRÁS
                  </button>
                  <button
                    onClick={save}
                    disabled={!biosFile || loading}
                    className="font-pixel text-[9px] px-3 py-2 retro-btn disabled:opacity-40"
                    style={{
                      color: accent,
                      border: `2px solid ${accent}`,
                    }}
                  >
                    {loading ? 'GUARDANDO...' : '✓ AÑADIR'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP: DONE */}
          {step === 'done' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div
                className="font-pixel text-2xl"
                style={{ color: accent, textShadow: `0 0 16px ${accent}` }}
              >
                ✓
              </div>
              <p className="font-pixel text-[10px]" style={{ color: accent }}>
                ¡JUEGO AÑADIDO!
              </p>
              <p className="font-mono text-xs text-gray-500">
                {gameName} está en tu biblioteca.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('select');
                    setGameFile(null);
                    setBiosFile(null);
                    setPlatform(null);
                    setGameName('');
                  }}
                  className="font-pixel text-[9px] px-3 py-2 retro-btn text-gray-500 border border-gray-700"
                >
                  + OTRO JUEGO
                </button>
                <button
                  onClick={onClose}
                  className="font-pixel text-[9px] px-3 py-2 retro-btn"
                  style={{
                    color: accent,
                    border: `2px solid ${accent}`,
                  }}
                >
                  VER BIBLIOTECA →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Re-export for convenience
export { PLATFORM_EXTENSIONS };
