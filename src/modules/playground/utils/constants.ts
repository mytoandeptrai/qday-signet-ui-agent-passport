import type { PlaygroundStep } from '@/types/passport';

export const TYPED_KINDS: PlaygroundStep['kind'][] = ['you'];
export const TYPE_MS = 22;
export const PAUSE_MS = 650;

export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
