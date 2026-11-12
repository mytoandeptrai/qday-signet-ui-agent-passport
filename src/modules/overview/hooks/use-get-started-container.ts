import { useCompleteOnboardingMutation, useGetBalance, useGetOnboarding, useGetSettings, useUpdateSettingsMutation } from '@/apis/account';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { INSTALL_PROMPT } from '@/mock/landing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { GET_STARTED_STEPS, type GetStartedStepId } from '../utils';
import { type AllowanceFormData, allowanceFormSchema } from './schema';

const WINDOWS_PROMPT = INSTALL_PROMPT.replace('curl -fsSL https://signet.example/install.sh | bash', 'irm https://signet.example/install.ps1 | iex');

type UseGetStartedContainerParams = {
  step: number;
};

export const useGetStartedContainer = ({ step }: UseGetStartedContainerParams) => {
  const { t } = useTranslation('overview-page');
  const { data: balance } = useGetBalance();
  const { data: settings } = useGetSettings();
  const { data: onboarding } = useGetOnboarding();
  const completeOnboarding = useCompleteOnboardingMutation();
  const updateSettings = useUpdateSettingsMutation();
  const { data: signetPasses } = useGetSignetPasses();
  const hasSignetPass = (signetPasses?.passes.length ?? 0) > 0;
  const { open } = useAppDialog();
  const [windows, setWindows] = useState(false);

  const available = balance?.available ?? 0;

  const allowanceForm = useForm<AllowanceFormData>({
    resolver: zodResolver(allowanceFormSchema(t)),
    values: settings ? { limit: settings.defaultLimit, perCall: settings.defaultPerCallLimit } : undefined,
    mode: 'onChange',
  });

  const done: Record<GetStartedStepId, boolean> = {
    connect: onboarding?.connected ?? false,
    signetpass: hasSignetPass,
    allowance: onboarding?.allowance ?? false,
    funds: available > 0,
    learn: true,
  };

  const prompt = windows ? WINDOWS_PROMPT : INSTALL_PROMPT;

  const onCopyPrompt = () => {
    navigator.clipboard?.writeText(prompt).catch(() => undefined);
    completeOnboarding.mutate('connected');
    toast.success(t('toasts.prompt-copied'));
  };

  const onToggleWindows = () => setWindows((w) => !w);

  const onCreateSignetPass = () => open('create-signetpass');
  const onAddFunds = () => open('add-funds');

  const onSaveAllowance = async ({ limit, perCall }: AllowanceFormData) => {
    await updateSettings.mutateAsync({ defaultLimit: limit, defaultPerCallLimit: perCall });
    await completeOnboarding.mutateAsync('allowance');
    toast.success(t('toasts.allowance-saved'));
  };

  return {
    stepId: GET_STARTED_STEPS[step],
    done,
    prompt,
    windows,
    signetPassCreated: hasSignetPass,
    available,
    allowanceForm,
    onCopyPrompt,
    onToggleWindows,
    onCreateSignetPass,
    onAddFunds,
    onSaveAllowance,
  };
};
