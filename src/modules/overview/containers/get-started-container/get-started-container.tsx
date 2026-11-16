import {
  GetStartedActionUi,
  GetStartedFundsUi,
  GetStartedHeaderUi,
  GetStartedInstallUi,
  GetStartedSignetpassUi,
  GetStartedStepsUi,
  GetStartedTipsUi,
} from '../../components';
import { useGetStartedContainer } from '../../hooks';
import { GET_STARTED_STEPS } from '../../utils';

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
    prompt,
    windows,
    signetPassCreated,
    balanceLabel,
    onCopyPrompt,
    onToggleWindows,
    onCreateSignetPass,
    onAddFunds,
    onCreateSession,
  } = useGetStartedContainer({ step });

  return (
    <div className='mt-10 border-t pt-8'>
      <GetStartedHeaderUi stepId={stepId} open={open} onToggleOpen={onToggleOpen} />
      {open && (
        <div className='mt-4 grid gap-8 md:grid-cols-[280px_minmax(0,1fr)]'>
          <GetStartedStepsUi stepId={stepId} done={done} onSelectStep={onSelectStep} />
          <div>
            {stepId === 'learn' && <GetStartedTipsUi />}
            {stepId === 'funds' && <GetStartedFundsUi balance={balanceLabel} onAddFunds={onAddFunds} />}
            {stepId === 'signetpass' && <GetStartedSignetpassUi created={signetPassCreated} onCreate={onCreateSignetPass} />}
            {stepId === 'move' && (
              <GetStartedActionUi
                text={t('get-started.text.move')}
                actionLabel={t('get-started.actions.move')}
                onAction={signetPassCreated ? onAddFunds : onCreateSignetPass}
              />
            )}
            {stepId === 'install' &&
              (signetPassCreated ? (
                <GetStartedActionUi text={t('get-started.text.install')}>
                  <GetStartedInstallUi prompt={prompt} windows={windows} onCopy={onCopyPrompt} onToggleWindows={onToggleWindows} />
                </GetStartedActionUi>
              ) : (
                <GetStartedActionUi text={t('get-started.text.install')} actionLabel={t('get-started.actions.install')} onAction={onCreateSignetPass} />
              ))}
            {stepId === 'connect' && (
              <GetStartedActionUi
                text={t('get-started.text.connect')}
                actionLabel={t('get-started.actions.install')}
                onAction={() => onSelectStep(GET_STARTED_STEPS.indexOf('install'))}
              />
            )}
            {stepId === 'session' && (
              <GetStartedActionUi text={t('get-started.text.session')} actionLabel={t('get-started.actions.session')} onAction={onCreateSession} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStartedContainer;
