import { SignetLockup } from '@/components/brand/signet-mark';
import { RisoPlate } from '@/components/landing/riso-plate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { safeRedirect } from '@/lib/format';
import { MOCK_OTP, MockApiError, requestLoginCode, verifyLoginCode } from '@/mock/api';
import { SEED_USER } from '@/mock/seed';
import { usePassportStore } from '@/stores/passport-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Fingerprint, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(['login', 'signup']).optional().catch(undefined),
});

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  component: LoginPage,
});

const emailSchema = z.object({ email: z.string().trim().min(1, 'Enter your email').pipe(z.email('Enter a valid email address')) });
const codeSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code') });
type Step = 'email' | 'code' | 'passkey';

function LoginPage() {
  const { redirect, mode = 'login' } = Route.useSearch();
  const navigate = useNavigate();
  const signIn = usePassportStore((s) => s.signIn);
  const addPasskey = usePassportStore((s) => s.addPasskey);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';
  const goNext = () => navigate({ to: safeRedirect(redirect) });

  const emailForm = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: '' } });
  const codeForm = useForm({ resolver: zodResolver(codeSchema), defaultValues: { code: '' } });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const sendCode = async (value: string) => {
    setBusy(true);
    try {
      await requestLoginCode(value);
      setEmail(value);
      setStep('code');
      setCooldown(30);
      toast.success(`Code sent to ${value}`, { description: `Mock code: ${MOCK_OTP}` });
    } catch (e) {
      if (e instanceof MockApiError && e.field === 'email') emailForm.setError('email', { message: e.message });
      else toast.error('Could not send the code. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async ({ code }: { code: string }) => {
    setBusy(true);
    try {
      signIn(await verifyLoginCode(email, code));
      if (signup) setStep('passkey');
      else goNext();
    } catch (e) {
      codeForm.setError('code', { message: e instanceof MockApiError ? e.message : 'Something went wrong.' });
    } finally {
      setBusy(false);
    }
  };

  const passkeySignIn = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    signIn({ ...SEED_USER, email: 'alex@example.com' });
    toast.success('Signed in with your passkey');
    goNext();
  };

  const createPasskey = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    addPasskey('This device');
    toast.success('Passkey created');
    goNext();
  };

  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      <div className='flex flex-col px-6 py-6 md:px-12'>
        <SignetLockup />
        <div className='m-auto w-full max-w-[380px] py-12'>
          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(({ email }) => sendCode(email))} noValidate>
              <h1 className='font-serif text-[34px] leading-[1.15] font-light'>{signup ? 'Create your Signet' : 'Sign in to Signet'}</h1>
              <p className='mt-3 text-sm text-muted-foreground'>We will email you a one-time code. No password.</p>
              <Label htmlFor='email' className='mt-8 mb-2'>Email</Label>
              <Input id='email' type='email' autoComplete='email' autoFocus placeholder='you@company.com' aria-invalid={Boolean(emailForm.formState.errors.email)} {...emailForm.register('email')} />
              {emailForm.formState.errors.email && <p role='alert' className='mt-2 text-sm text-danger'>{emailForm.formState.errors.email.message}</p>}
              <Button type='submit' disabled={busy} className='mt-5 w-full rounded-none'>
                {busy && <Loader2 className='animate-spin' />} Continue
              </Button>
              <div className='my-5 flex items-center gap-3 text-xs text-text-3'><span className='h-px flex-1 bg-border' />or<span className='h-px flex-1 bg-border' /></div>
              <Button type='button' variant='outline' disabled={busy} onClick={passkeySignIn} className='w-full rounded-none'>
                <Fingerprint /> Continue with a passkey
              </Button>
              <p className='mt-8 text-center text-sm text-muted-foreground'>
                {signup ? 'Already have a Signet?' : 'New to Signet?'}{' '}
                <Link to='/login' search={{ redirect, mode: signup ? 'login' : 'signup' }} className='text-foreground underline underline-offset-4'>
                  {signup ? 'Sign in' : 'Create one'}
                </Link>
              </p>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={codeForm.handleSubmit(verify)} noValidate>
              <h1 className='font-serif text-[34px] leading-[1.15] font-light'>Check your email</h1>
              <p className='mt-3 text-sm text-muted-foreground'>Enter the 6-digit code we sent to <b className='font-medium text-foreground'>{email}</b>.</p>
              <Label htmlFor='code' className='mt-8 mb-2'>Code</Label>
              <Input id='code' inputMode='numeric' autoComplete='one-time-code' maxLength={6} autoFocus placeholder='123456' className='font-mono tracking-[0.4em]' aria-invalid={Boolean(codeForm.formState.errors.code)} {...codeForm.register('code')} />
              {codeForm.formState.errors.code && <p role='alert' className='mt-2 text-sm text-danger'>{codeForm.formState.errors.code.message}</p>}
              <Button type='submit' disabled={busy} className='mt-5 w-full rounded-none'>
                {busy && <Loader2 className='animate-spin' />} Verify
              </Button>
              <div className='mt-5 flex justify-between text-sm'>
                <button type='button' className='text-muted-foreground hover:text-foreground' onClick={() => { codeForm.reset(); setStep('email'); }}>Use another email</button>
                <button type='button' disabled={cooldown > 0 || busy} className='text-muted-foreground hover:text-foreground disabled:opacity-50' onClick={() => sendCode(email)}>
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {step === 'passkey' && (
            <div>
              <h1 className='font-serif text-[34px] leading-[1.15] font-light'>Add a passkey</h1>
              <p className='mt-3 text-sm text-muted-foreground'>Sign in and approve spending with your fingerprint or face instead of email codes.</p>
              <Button type='button' disabled={busy} onClick={createPasskey} className='mt-8 w-full rounded-none'>
                {busy ? <Loader2 className='animate-spin' /> : <Fingerprint />} Create passkey
              </Button>
              <Button type='button' variant='ghost' disabled={busy} onClick={goNext} className='mt-2 w-full rounded-none'>Skip for now</Button>
            </div>
          )}
        </div>
      </div>
      <div className='relative hidden lg:block'>
        <RisoPlate sun={0.6} label='A riso print of the sun over the sea' />
      </div>
    </div>
  );
}
