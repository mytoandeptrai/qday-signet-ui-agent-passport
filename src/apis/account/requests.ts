import { selectedPass } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type { AppSettings, OnboardingStep } from './types';

export const getProfile = () => mockRequest((s) => s.user);
export const getBalance = () => mockRequest((s) => selectedPass(s)?.balance ?? { available: 0, held: 0, currency: 'USD' as const });
export const getSettings = () => mockRequest((s) => s.settings);
export const getOnboarding = () => mockRequest((s) => s.onboarding);

export const updateSettings = (patch: Partial<AppSettings>) => mockRequest((s) => s.updateSettings(patch));
export const completeOnboarding = (step: OnboardingStep) => mockRequest((s) => s.completeOnboarding(step));
export const resetDemoData = () => mockRequest((s) => s.reset());
