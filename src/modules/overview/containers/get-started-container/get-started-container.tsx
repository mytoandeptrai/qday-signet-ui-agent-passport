import {
  GetStartedActionUi,
  GetStartedAgentUi,
  GetStartedFundsUi,
  GetStartedHeaderUi,
  GetStartedInstallUi,
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
    install,
    onCopyInstall,
    onCreateSession,
  } = useGetStartedContainer({ step });

  return (
    <div className='mt-10'>
      <GetStartedHeaderUi open={open} onToggleOpen={onToggleOpen} />
      {open && (
        <div className='mt-4 md:grid md:grid-cols-[18rem_1fr] md:gap-10'>
          <GetStartedStepsUi stepId={stepId} done={done} onSelectStep={onSelectStep} />
          <div className='mt-6 border-l-2 border-brand pl-5 md:mt-0 md:border-border md:pl-8'>
            <p className='mb-3 text-body text-foreground'>{t(`get-started.hints.${stepId}`)}</p>
            {stepId === 'learn' && <GetStartedTipsUi />}
            {stepId === 'funds' && <GetStartedFundsUi balance={balanceLabel} onAddFunds={onAddFunds} />}
            {stepId === 'signetpass' && <GetStartedSignetpassUi created={signetPassCreated} needsActivation={signetPassNeedsActivation} onCreate={onCreateSignetPass} onActivate={onActivateSignetPass} />}
            {stepId === 'move' && <GetStartedActionUi text={t('get-started.text.move')} actionLabel={t('get-started.actions.move')} onAction={onMoveFunds} />}
            {stepId === 'agent' && <GetStartedAgentUi text={t('get-started.text.agent')} />}
            {stepId === 'install' && <GetStartedInstallUi text={t('get-started.text.install')} prompt={install.prompt} windows={install.windows} hasCode={install.hasCode} canGetCode={install.canGetCode} isGettingCode={install.isGettingCode} onGetCode={install.onGetCode} onCopy={onCopyInstall} onToggleWindows={install.onToggleWindows} />}
            {stepId === 'connect' && <GetStartedInstallUi text={t('get-started.text.connect')} prompt={install.prompt} windows={install.windows} hasCode={install.hasCode} canGetCode={install.canGetCode} isGettingCode={install.isGettingCode} onGetCode={install.onGetCode} onCopy={onCopyInstall} onToggleWindows={install.onToggleWindows} />}
            {stepId === 'session' && <GetStartedActionUi text={t('get-started.text.session')} actionLabel={t('get-started.actions.session')} onAction={onCreateSession} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStartedContainer;
