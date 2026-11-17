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

export const GET_STARTED_STEPS = ['learn', 'funds', 'signetpass', 'move', 'agent', 'install', 'connect', 'session'] as const;

export type GetStartedStepId = (typeof GET_STARTED_STEPS)[number];

/** How to install the agents Signet works with. Not Signet commands: users run these before installing the Signet CLI. */
export const AGENT_INSTALLS = [
  { name: 'Claude Code', command: 'npm install -g @anthropic-ai/claude-code' },
  { name: 'Codex', command: 'npm install -g @openai/codex' },
] as const;

export const VISIBLE_SESSIONS = 4;
export const VISIBLE_ACTIVITY = 5;
