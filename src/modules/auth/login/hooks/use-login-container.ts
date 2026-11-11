import { useRequestLoginCodeMutation, useVerifyLoginCodeMutation } from '@/apis/auth';
import { useTranslation } from '@/integrations/i18n';
import { safeRedirect } from '@/lib/format';
import { MOCK_OTP, MockApiError } from '@/mock/api';
import { usePassportStore } from '@/stores/passport-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  type CodeFormData,
  codeFormSchema,
  type EmailFormData,
  emailFormSchema,
  initialCodeFormData,
  initialEmailFormData,
  type LoginStep,
} from './schema';

const RESEND_SECONDS = 30;
const route = getRouteApi('/login');

export const useLoginContainer = () => {
  const { t } = useTranslation('login-page');
  const { redirect, mode = 'login' } = route.useSearch();
  const navigate = useNavigate();
  const signIn = usePassportStore((s) => s.signIn);

  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema(t)),
    defaultValues: initialEmailFormData,
    mode: 'onChange',
  });
  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeFormSchema(t)),
    defaultValues: initialCodeFormData,
    mode: 'onChange',
  });

  const requestCode = useRequestLoginCodeMutation();
  const verifyCode = useVerifyLoginCodeMutation();
  const isLoading = requestCode.isPending || verifyCode.isPending;
  const isSignup = mode === 'signup';

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const goNext = () => navigate({ to: safeRedirect(redirect) });

  const sendCode = async (value: string) => {
    try {
      await requestCode.mutateAsync({ email: value });
      setEmail(value);
      setStep('code');
      setCooldown(RESEND_SECONDS);
      toast.success(t('toasts.code-sent', { email: value }), { description: t('toasts.mock-code', { code: MOCK_OTP }) });
    } catch (e) {
      if (e instanceof MockApiError && e.field === 'email') emailForm.setError('email', { message: e.message });
      else toast.error(t('toasts.code-failed'));
    }
  };

  const onSubmitEmail = ({ email: value }: EmailFormData) => sendCode(value);

  const onSubmitCode = async ({ code }: CodeFormData) => {
    try {
      signIn(await verifyCode.mutateAsync({ email, code }));
      goNext();
    } catch (e) {
      codeForm.setError('code', { message: e instanceof MockApiError ? e.message : t('errors.generic') });
    }
  };

  const onResend = () => sendCode(email);

  const onUseAnotherEmail = () => {
    codeForm.reset();
    setStep('email');
  };

  return {
    t,
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
  };
};
