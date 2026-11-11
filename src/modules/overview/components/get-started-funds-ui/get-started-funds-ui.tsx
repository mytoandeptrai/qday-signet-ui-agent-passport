import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

type GetStartedFundsUiProps = {
  available: number;
  onAddFunds: () => void;
};

const GetStartedFundsUi = ({ available, onAddFunds }: GetStartedFundsUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-md text-body text-muted-foreground'>
      <p>{t('funds.balance', { amount: money(available) })}</p>
      <Button className='mt-4' variant='outline' onClick={onAddFunds}>
        {t('labels.add-funds')}
      </Button>
    </div>
  );
};

export default GetStartedFundsUi;
