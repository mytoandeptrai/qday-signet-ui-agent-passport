import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

const SignetpassNotFoundUi = () => {
  const { t } = useTranslation('signetpass-page');
  return (
    <div className='flex max-w-md flex-col items-start gap-3'>
      <h1 className='font-display text-title leading-tight font-semibold tracking-tight'>{t('details.not-found.title')}</h1>
      <p className='text-body text-muted-foreground'>{t('details.not-found.description')}</p>
      <Button asChild>
        <Link to={ROUTES.WALLET}>{t('details.not-found.action')}</Link>
      </Button>
    </div>
  );
};

export default SignetpassNotFoundUi;
