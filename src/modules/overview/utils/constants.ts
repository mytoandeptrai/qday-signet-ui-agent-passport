export const IDEA_IDS = [
  'install',
  'esim',
  'sound',
  'photos',
  'translate',
  'tickets',
  'shipping',
  'coworking',
  'amazon-item',
  'amazon-cart',
] as const;

export type IdeaId = (typeof IDEA_IDS)[number];

export const GET_STARTED_STEPS = ['learn', 'funds', 'signetpass', 'move', 'install', 'connect', 'session'] as const;

export type GetStartedStepId = (typeof GET_STARTED_STEPS)[number];

export const VISIBLE_SESSIONS = 4;
export const VISIBLE_ACTIVITY = 5;
