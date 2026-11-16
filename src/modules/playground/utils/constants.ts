import type { PlaygroundStep } from '@/types/passport';

/** Steps the terminal types out character by character; the rest appear whole. */
export const TYPED_KINDS: PlaygroundStep['kind'][] = ['you'];
export const TYPE_MS = 22;
export const PAUSE_MS = 650;

/** People who ask for less motion see each line whole instead of typed out. */
export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
