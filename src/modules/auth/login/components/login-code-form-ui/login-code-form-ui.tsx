import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import type { CodeFormData } from '../../hooks';

type LoginCodeFormUiProps = {
  email: string;
  cooldown: number;
  isLoading?: boolean;
  onResend: () => void;
  onUseAnotherEmail: () => void;
};

const LoginCodeFormUi = ({ email, cooldown, isLoading = false, onResend, onUseAnotherEmail }: LoginCodeFormUiProps) => {
  const { control } = useFormContext<CodeFormData>();
  const { t } = useTranslation('login-page');
  return (
    <div className='space-y-4'>
      <div className='mb-4'>
        <h1 className='font-display text-title font-semibold'>{t('code.title')}</h1>
        <p className='mt-3 text-muted-foreground text-small'>
          {t('code.description')} <b className='font-medium text-foreground'>{email}</b>
        </p>
      </div>
      <FormInput
        control={control}
        name='code'
        disabled={isLoading}
        inputClassName='font-mono tracking-[0.4em]'
        label={t('fields.code.label')}
        placeholder={t('fields.code.placeholder')}
      />
      <Button type='submit' disabled={isLoading} className='w-full'>
        <Show when={isLoading}>
          <Spinner />
        </Show>
        {t('labels.verify')}
      </Button>
      <div className='flex justify-between text-small'>
        <button type='button' className='text-muted-foreground hover:text-foreground' onClick={onUseAnotherEmail}>
          {t('labels.use-another-email')}
        </button>
        <button
          type='button'
          disabled={cooldown > 0 || isLoading}
          className='text-muted-foreground hover:text-foreground disabled:opacity-50'
          onClick={onResend}
        >
          {cooldown > 0 ? t('labels.resend-in', { seconds: cooldown }) : t('labels.resend-code')}
        </button>
      </div>
    </div>
  );
};

export default LoginCodeFormUi;
