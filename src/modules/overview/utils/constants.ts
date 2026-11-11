export const IDEA_IDS = ['learn', 'purchases', 'cloud', 'apartments', 'candidates', 'onboarding'] as const;

export type IdeaId = (typeof IDEA_IDS)[number];

export const GET_STARTED_STEPS = ['connect', 'passkey', 'allowance', 'funds', 'learn'] as const;

export type GetStartedStepId = (typeof GET_STARTED_STEPS)[number];

export const ALLOWANCE_STEP_INDEX = GET_STARTED_STEPS.indexOf('allowance');
export const VISIBLE_SESSIONS = 4;
export const VISIBLE_ACTIVITY = 5;
