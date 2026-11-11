import { SignetLockup } from '@/components/brand/signet-mark';
import { FormWrapper } from '@/components/ui/form';
import { LoginAsideUi, LoginCodeFormUi, LoginEmailFormUi } from '../../components';
import { useLoginContainer } from '../../hooks';

const LoginContainer = () => {
  const {
    step,
    email,
    redirect,
    isSignup,
    isLoading,
    cooldown,
    emailForm,
    codeForm,
    onSubmitEmail,
    onSubmitCode,
    onResend,
    onUseAnotherEmail,
  } = useLoginContainer();

  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      <div className='flex flex-col px-6 py-6 md:px-12'>
        <SignetLockup />
        <div className='m-auto w-full max-w-[380px] py-12'>
          {step === 'email' && (
            <FormWrapper form={emailForm} onSubmit={onSubmitEmail}>
              <LoginEmailFormUi isSignup={isSignup} isLoading={isLoading} redirect={redirect} />
            </FormWrapper>
          )}
          {step === 'code' && (
            <FormWrapper form={codeForm} onSubmit={onSubmitCode}>
              <LoginCodeFormUi
                email={email}
                cooldown={cooldown}
                isLoading={isLoading}
                onResend={onResend}
                onUseAnotherEmail={onUseAnotherEmail}
              />
            </FormWrapper>
          )}
        </div>
      </div>
      <LoginAsideUi />
    </div>
  );
};

export default LoginContainer;
