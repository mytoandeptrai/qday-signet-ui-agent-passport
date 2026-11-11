import { mockRequest } from '../mock-transport';
import type { AppSettings, OnboardingStep } from './types';

export const getProfile = () => mockRequest((s) => s.user);
export const getBalance = () => mockRequest((s) => s.balance);
export const getSettings = () => mockRequest((s) => s.settings);
export const getOnboarding = () => mockRequest((s) => s.onboarding);

export const updateSettings = (patch: Partial<AppSettings>) => mockRequest((s) => s.updateSettings(patch));
export const completeOnboarding = (step: OnboardingStep) => mockRequest((s) => s.completeOnboarding(step));
export const resetDemoData = () => mockRequest((s) => s.reset());
