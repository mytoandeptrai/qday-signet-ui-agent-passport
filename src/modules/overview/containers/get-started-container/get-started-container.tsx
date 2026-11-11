import { FormWrapper } from '@/components/ui/form';
import {
  GetStartedAllowanceUi,
  GetStartedFundsUi,
  GetStartedHeaderUi,
  GetStartedInstallUi,
  GetStartedPasskeyUi,
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
  const { stepId, done, prompt, windows, passkeyCount, available, allowanceForm, onCopyPrompt, onToggleWindows, onAddPasskey, onSaveAllowance } =
    useGetStartedContainer({ step });

  return (
    <div className='mt-10 border-t pt-8'>
      <GetStartedHeaderUi stepId={stepId} open={open} onToggleOpen={onToggleOpen} />
      {open && (
        <div className='mt-4 grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]'>
          <GetStartedStepsUi stepId={stepId} done={done} onSelectStep={onSelectStep} />
          <div>
            {stepId === 'connect' && <GetStartedInstallUi prompt={prompt} windows={windows} onCopy={onCopyPrompt} onToggleWindows={onToggleWindows} />}
            {stepId === 'passkey' && <GetStartedPasskeyUi passkeyCount={passkeyCount} onAddPasskey={onAddPasskey} />}
            {stepId === 'allowance' && (
              <FormWrapper form={allowanceForm} onSubmit={onSaveAllowance}>
                <GetStartedAllowanceUi />
              </FormWrapper>
            )}
            {stepId === 'funds' && <GetStartedFundsUi available={available} />}
            {stepId === 'learn' && <GetStartedTipsUi />}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStartedContainer;
