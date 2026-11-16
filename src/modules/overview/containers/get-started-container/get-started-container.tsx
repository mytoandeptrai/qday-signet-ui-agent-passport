import {
  GetStartedActionUi,
  GetStartedFundsUi,
  GetStartedHeaderUi,
  GetStartedSignetpassUi,
  GetStartedStepsUi,
  GetStartedTipsUi,
} from '../../components';
import { useGetStartedContainer } from '../../hooks';

type GetStartedContainerProps = {
  step: number;
  open: boolean;
  onSelectStep: (index: number) => void;
  onToggleOpen: () => void;
};

const GetStartedContainer = ({ step, open, onSelectStep, onToggleOpen }: GetStartedContainerProps) => {
  const {
    t,
    stepId,
    done,
    signetPassCreated,
    signetPassNeedsActivation,
    balanceLabel,
    onCreateSignetPass,
    onActivateSignetPass,
    onAddFunds,
    onMoveFunds,
    onInstallCli,
    onCreateSession,
  } = useGetStartedContainer({ step });

  return (
    <div className='mt-10'>
      <GetStartedHeaderUi open={open} onToggleOpen={onToggleOpen} />
      {open && (
        <>
          <GetStartedStepsUi stepId={stepId} done={done} onSelectStep={onSelectStep} />
          <div className='mt-6 max-w-2xl border-l-2 border-brand pl-5'>
            <p className='mb-3 text-body text-foreground'>{t(`get-started.hints.${stepId}`)}</p>
            {stepId === 'learn' && <GetStartedTipsUi />}
            {stepId === 'funds' && <GetStartedFundsUi balance={balanceLabel} onAddFunds={onAddFunds} />}
            {stepId === 'signetpass' && <GetStartedSignetpassUi created={signetPassCreated} needsActivation={signetPassNeedsActivation} onCreate={onCreateSignetPass} onActivate={onActivateSignetPass} />}
            {stepId === 'move' && <GetStartedActionUi text={t('get-started.text.move')} actionLabel={t('get-started.actions.move')} onAction={onMoveFunds} />}
            {stepId === 'install' && <GetStartedActionUi text={t('get-started.text.install')} actionLabel={t('get-started.actions.install')} onAction={onInstallCli} />}
            {stepId === 'connect' && <GetStartedActionUi text={t('get-started.text.connect')} actionLabel={t('get-started.actions.install')} onAction={onInstallCli} />}
            {stepId === 'session' && <GetStartedActionUi text={t('get-started.text.session')} actionLabel={t('get-started.actions.session')} onAction={onCreateSession} />}
          </div>
        </>
      )}
    </div>
  );
};

export default GetStartedContainer;
