import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/ui/custom-link';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { Fingerprint } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { EmailFormData } from '../../hooks';

type LoginEmailFormUiProps = {
  isSignup?: boolean;
  isLoading?: boolean;
  redirect?: string;
  onPasskeySignIn: () => void;
};

const LoginEmailFormUi = ({ isSignup = false, isLoading = false, redirect, onPasskeySignIn }: LoginEmailFormUiProps) => {
  const { control } = useFormContext<EmailFormData>();
  const { t } = useTranslation('login-page');
  return (
    <div className='space-y-4'>
      <div className='mb-4'>
        <h1 className='font-display text-title font-semibold'>{isSignup ? t('email.title-signup') : t('email.title')}</h1>
        <p className='mt-3 text-muted-foreground text-small'>{t('email.description')}</p>
      </div>
      <FormInput
        control={control}
        name='email'
        type='email'
        disabled={isLoading}
        label={t('fields.email.label')}
        placeholder={t('fields.email.placeholder')}
      />
      <Button type='submit' disabled={isLoading} className='w-full'>
        <Show when={isLoading}>
          <Spinner />
        </Show>
        {t('labels.continue')}
      </Button>
      <div className='flex items-center gap-3 text-caption text-muted-foreground'>
        <span className='h-px flex-1 bg-border' />
        {t('labels.or')}
        <span className='h-px flex-1 bg-border' />
      </div>
      <Button type='button' variant='outline' disabled={isLoading} onClick={onPasskeySignIn} className='w-full'>
        <Fingerprint />
        {t('labels.continue-with-passkey')}
      </Button>
      <p className='flex justify-center gap-1 pt-4 text-muted-foreground text-small'>
        {isSignup ? t('email.have-account') : t('email.new-here')}
        <CustomLink
          to={ROUTES.LOGIN}
          search={{ redirect, mode: isSignup ? 'login' : 'signup' }}
          className='text-foreground underline underline-offset-4'
        >
          {isSignup ? t('labels.sign-in') : t('labels.create-one')}
        </CustomLink>
      </p>
    </div>
  );
};

export default LoginEmailFormUi;
