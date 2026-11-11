import type { PlaygroundStep } from '@/types/passport';

/** Steps the terminal types out character by character; the rest appear whole. */
export const TYPED_KINDS: PlaygroundStep['kind'][] = ['prompt', 'cmd'];
export const TYPE_MS = 22;
export const PAUSE_MS = 650;
