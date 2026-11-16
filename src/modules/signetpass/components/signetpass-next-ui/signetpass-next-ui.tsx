import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

interface SignetpassNextUiProps {
  canCreateSession: boolean;
  onCreateSession: () => void;
}

const SignetpassNextUi = ({ canCreateSession, onCreateSession }: SignetpassNextUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <section className='mt-8'>
      <h2 className='text-body font-medium'>{t('details.next.title')}</h2>
      <div className='mt-3 flex flex-wrap gap-2'>
        <Button onClick={onCreateSession} disabled={!canCreateSession}>{t('details.next.create-session')}</Button>
        <Button variant='outline' asChild>
          <Link to={ROUTES.SESSIONS}>{t('details.next.sessions')}</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link to={ROUTES.AGENTS}>{t('details.next.agents')}</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link to={ROUTES.ACTIVITY}>{t('details.next.activity')}</Link>
        </Button>
      </div>
    </section>
  );
};

export default SignetpassNextUi;
