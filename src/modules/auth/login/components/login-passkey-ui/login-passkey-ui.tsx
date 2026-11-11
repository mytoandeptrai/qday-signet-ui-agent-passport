import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/integrations/i18n';
import { Fingerprint } from 'lucide-react';

type LoginPasskeyUiProps = {
  isLoading?: boolean;
  onCreatePasskey: () => void;
  onSkip: () => void;
};

const LoginPasskeyUi = ({ isLoading = false, onCreatePasskey, onSkip }: LoginPasskeyUiProps) => {
  const { t } = useTranslation('login-page');
  return (
    <div className='space-y-4'>
      <div className='mb-4'>
        <h1 className='font-display text-title font-semibold'>{t('passkey.title')}</h1>
        <p className='mt-3 text-muted-foreground text-small'>{t('passkey.description')}</p>
      </div>
      <Button type='button' disabled={isLoading} onClick={onCreatePasskey} className='w-full'>
        {isLoading ? <Spinner /> : <Fingerprint />}
        {t('labels.create-passkey')}
      </Button>
      <Button type='button' variant='ghost' disabled={isLoading} onClick={onSkip} className='w-full'>
        {t('labels.skip')}
      </Button>
    </div>
  );
};

export default LoginPasskeyUi;
