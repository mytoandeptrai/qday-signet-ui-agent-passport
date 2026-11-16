import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type GetStartedFundsUiProps = {
  balance: string;
  onAddFunds: () => void;
};

const GetStartedFundsUi = ({ balance, onAddFunds }: GetStartedFundsUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-3xl text-body text-muted-foreground'>
      <p>{t('funds.balance', { amount: balance })}</p>
      <Button className='mt-4' variant='outline' onClick={onAddFunds}>
        {t('labels.add-funds')}
      </Button>
    </div>
  );
};

export default GetStartedFundsUi;
