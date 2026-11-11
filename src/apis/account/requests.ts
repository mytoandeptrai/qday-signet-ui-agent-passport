import { mockRequest } from '../mock-transport';
import type { AddPasskeyParams, AppSettings, OnboardingStep, RemovePasskeyParams } from './types';

export const getProfile = () => mockRequest((s) => s.user);
export const getBalance = () => mockRequest((s) => s.balance);
export const getSettings = () => mockRequest((s) => s.settings);
export const getOnboarding = () => mockRequest((s) => s.onboarding);

export const updateSettings = (patch: Partial<AppSettings>) => mockRequest((s) => s.updateSettings(patch));
export const completeOnboarding = (step: OnboardingStep) => mockRequest((s) => s.completeOnboarding(step));
export const addPasskey = ({ label }: AddPasskeyParams) => mockRequest((s) => s.addPasskey(label));
export const removePasskey = ({ id }: RemovePasskeyParams) => mockRequest((s) => s.removePasskey(id));
export const resetDemoData = () => mockRequest((s) => s.reset());
