export const HERO_PIN_LENGTH = 1100;
export const DAY_BUDGET = 50;

export const CARD_SHADOW = 'shadow-[0_1px_2px_rgba(27,30,36,.04),0_12px_40px_rgba(27,30,36,.10)]';

export const DAY_LATTICE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M0 48L48 0M-12 12L12-12M36 60L60 36' stroke='white' stroke-opacity='.07' stroke-width='1'/></svg>"
)}")`;

export const formatUsd = (n: number) => `$${n.toFixed(2)}`;

export const TERMINAL_TONES = ['dim', 'ok', 'ok', 'ok', 'stop', 'stop'] as const;
