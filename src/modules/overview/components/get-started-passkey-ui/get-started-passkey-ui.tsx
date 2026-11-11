import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type GetStartedPasskeyUiProps = {
  passkeyCount: number;
  onAddPasskey: () => void;
};

const GetStartedPasskeyUi = ({ passkeyCount, onAddPasskey }: GetStartedPasskeyUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-md text-body text-muted-foreground'>
      <p>{passkeyCount > 0 ? t('passkey.have', { count: passkeyCount }) : t('passkey.none')}</p>
      <Button className='mt-4' variant='outline' onClick={onAddPasskey}>
        {t('passkey.add')}
      </Button>
    </div>
  );
};

export default GetStartedPasskeyUi;
