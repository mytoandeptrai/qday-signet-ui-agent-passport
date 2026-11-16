import { useCompleteOnboardingMutation, useGetBalance, useGetOnboarding } from '@/apis/account';
import { useGetSessionList } from '@/apis/sessions';
import { useGetSignetPasses } from '@/apis/signetpass';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { INSTALL_PROMPT } from '@/mock/landing';
import { useState } from 'react';
import { toast } from 'sonner';
import { GET_STARTED_STEPS, type GetStartedStepId } from '../utils';

const WINDOWS_PROMPT = INSTALL_PROMPT.replace('curl -fsSL https://signet.example/install.sh | bash', 'irm https://signet.example/install.ps1 | iex');

type UseGetStartedContainerParams = {
  step: number;
};

export const useGetStartedContainer = ({ step }: UseGetStartedContainerParams) => {
  const { t } = useTranslation('overview-page');
  const { data: balance } = useGetBalance();
  const { data: onboarding } = useGetOnboarding();
  const completeOnboarding = useCompleteOnboardingMutation();
  const { data: signetPasses } = useGetSignetPasses();
  const { data: sessions = [] } = useGetSessionList();
  const hasSignetPass = (signetPasses?.passes.length ?? 0) > 0;
  const { open } = useAppDialog();
  const [windows, setWindows] = useState(false);

  const available = balance?.available ?? 0;
  const token = NETWORKS[signetPasses?.selected?.network ?? 'base'].token.symbol;

  const done: Record<GetStartedStepId, boolean> = {
    learn: true,
    funds: available > 0,
    signetpass: hasSignetPass,
    // Until the main wallet and the SignetPass hold separate balances, funded + created is the closest signal.
    move: hasSignetPass && available > 0,
    install: onboarding?.connected ?? false,
    connect: onboarding?.connected ?? false,
    session: sessions.length > 0,
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
  const onCreateSession = () => open('create-session');

  return {
    t,
    stepId: GET_STARTED_STEPS[step],
    done,
    prompt,
    windows,
    signetPassCreated: hasSignetPass,
    available,
    balanceLabel: `${money(available)} ${token}`,
    onCopyPrompt,
    onToggleWindows,
    onCreateSignetPass,
    onAddFunds,
    onCreateSession,
  };
};
