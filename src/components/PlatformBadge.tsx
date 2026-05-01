import { Platform } from '../types/game';
import { PLATFORM_NAMES, PLATFORM_ACCENT_COLORS, PLATFORM_BG_COLORS } from '../constants/platforms';

interface Props {
  platform: Platform;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, size = 'sm' }: Props) {
  const accent = PLATFORM_ACCENT_COLORS[platform];
  const bg = PLATFORM_BG_COLORS[platform];
  const name = PLATFORM_NAMES[platform];

  const sizeClasses = size === 'sm'
    ? 'text-[8px] px-1.5 py-0.5'
    : 'text-[10px] px-2 py-1';

  return (
    <span
      className={`font-pixel inline-block uppercase tracking-wider ${sizeClasses}`}
      style={{
        backgroundColor: bg,
        color: accent,
        border: `1px solid ${accent}`,
        boxShadow: `0 0 4px ${accent}40`,
      }}
    >
      {name}
    </span>
  );
}
