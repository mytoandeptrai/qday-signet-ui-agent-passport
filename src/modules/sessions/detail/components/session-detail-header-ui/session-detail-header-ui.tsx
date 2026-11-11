import { PageHeader } from '@/components/app/page-header';
import { useTranslation } from '@/integrations/i18n';
import { timeAgo } from '@/lib/format';
import type { SpendingSession } from '@/types/passport';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type SessionDetailHeaderUiProps = {
  session: SpendingSession;
  action?: ReactNode;
};

const SessionDetailHeaderUi = ({ session, action }: SessionDetailHeaderUiProps) => {
  const { t } = useTranslation('session-detail-page');
  const state = session.status === 'active' ? t('header.expires', { when: timeAgo(session.expiresAt) }) : session.status;
  return (
    <>
      <Link to='/overview' className='mb-6 inline-block text-small text-muted-foreground hover:text-foreground'>
        {t('back')}
      </Link>
      <PageHeader
        title={session.task}
        description={t('header.description', { agent: session.agent, started: timeAgo(session.createdAt), state })}
        action={action}
      />
    </>
  );
};

export default SessionDetailHeaderUi;
