import { FormWrapper } from '@/components/ui/form';
import {
  GetStartedAllowanceUi,
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
  const { stepId, done, prompt, windows, signetPassCreated, available, allowanceForm, onCopyPrompt, onToggleWindows, onCreateSignetPass, onAddFunds, onSaveAllowance } =
    useGetStartedContainer({ step });

  const onSubmitAllowance = async (values: Parameters<typeof onSaveAllowance>[0]) => {
    await onSaveAllowance(values);
    onToggleOpen();
  };

  return (
    <div className='mt-10 border-t pt-8'>
      <GetStartedHeaderUi stepId={stepId} open={open} onToggleOpen={onToggleOpen} />
      {open && (
        <div className='mt-4 grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]'>
          <GetStartedStepsUi stepId={stepId} done={done} onSelectStep={onSelectStep} />
          <div>
            {stepId === 'connect' && <GetStartedInstallUi prompt={prompt} windows={windows} onCopy={onCopyPrompt} onToggleWindows={onToggleWindows} />}
            {stepId === 'signetpass' && <GetStartedSignetpassUi created={signetPassCreated} onCreate={onCreateSignetPass} />}
            {stepId === 'allowance' && (
              <FormWrapper form={allowanceForm} onSubmit={onSubmitAllowance}>
                <GetStartedAllowanceUi />
              </FormWrapper>
            )}
            {stepId === 'funds' && <GetStartedFundsUi available={available} onAddFunds={onAddFunds} />}
            {stepId === 'learn' && <GetStartedTipsUi />}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStartedContainer;
