import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { Link } from '@tanstack/react-router';

type GetStartedFundsUiProps = {
  available: number;
};

const GetStartedFundsUi = ({ available }: GetStartedFundsUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-md text-body text-muted-foreground'>
      <p>{t('funds.balance', { amount: money(available) })}</p>
      <Button asChild className='mt-4' variant='outline'>
        <Link to='/deposit'>{t('labels.add-funds')}</Link>
      </Button>
    </div>
  );
};

export default GetStartedFundsUi;
