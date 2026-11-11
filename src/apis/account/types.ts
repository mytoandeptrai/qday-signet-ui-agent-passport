import type { AppSettings, Balance, User } from '@/types/passport';

export type { AppSettings, Balance, User };

export interface Onboarding {
  connected: boolean;
  allowance: boolean;
}

export type OnboardingStep = keyof Onboarding;

export interface AddPasskeyParams {
  label: string;
}

export interface RemovePasskeyParams {
  id: string;
}
