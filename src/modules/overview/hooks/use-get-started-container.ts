import { useGetOnboarding } from '@/apis/account';
import { useGetSessionList } from '@/apis/sessions';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { useNavigate } from '@tanstack/react-router';
import { GET_STARTED_STEPS, type GetStartedStepId } from '../utils';

type UseGetStartedContainerParams = {
  step: number;
};

export const useGetStartedContainer = ({ step }: UseGetStartedContainerParams) => {
  const { t } = useTranslation('overview-page');
  const navigate = useNavigate();
  const { data: wallet } = useGetMainWallet();
  const { data: onboarding } = useGetOnboarding();
  const { data: signetPasses } = useGetSignetPasses();
  const { data: sessions = [] } = useGetSessionList();
  const { open } = useAppDialog();

  const passes = signetPasses?.passes ?? [];
  const selected = signetPasses?.selected;
  const hasSignetPass = passes.length > 0;
  const needsActivation = !!selected && selected.status !== 'active';
  const balance = wallet?.balance ?? 0;
  const token = NETWORKS[wallet?.network ?? 'base'].token.symbol;

  const done: Record<GetStartedStepId, boolean> = {
    learn: true,
    funds: balance > 0,
    signetpass: hasSignetPass,
    move: passes.some((p) => p.balance.available + p.balance.held > 0),
    install: onboarding?.connected ?? false,
    connect: onboarding?.connected ?? false,
    session: sessions.length > 0,
  };

  const onCreateSignetPass = () => open('create-signetpass');
  const onAddFunds = () => open('add-funds');
  const onActivateSignetPass = () => open('activate-signetpass');
  // Funds go into an active SignetPass, so this starts by creating or activating one.
  const onMoveFunds = () => open(!hasSignetPass ? 'create-signetpass' : needsActivation ? 'activate-signetpass' : 'move-funds');
  const onInstallCli = () => {
    if (!selected) return open('create-signetpass');
    navigate({ to: '/signetpass/$passId', params: { passId: selected.id }, hash: 'install' });
  };
  const onCreateSession = () => open('create-session');

  return {
    t,
    stepId: GET_STARTED_STEPS[step],
    done,
    signetPassCreated: hasSignetPass,
    signetPassNeedsActivation: needsActivation,
    balanceLabel: `${money(balance)} ${token}`,
    onCreateSignetPass,
    onActivateSignetPass,
    onAddFunds,
    onMoveFunds,
    onInstallCli,
    onCreateSession,
  };
};
