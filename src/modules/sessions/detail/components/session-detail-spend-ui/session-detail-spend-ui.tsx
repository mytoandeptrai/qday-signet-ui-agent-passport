import { SpendBar } from '@/components/ui/spend-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { useTranslation } from '@/integrations/i18n';
import type { SpendingSession } from '@/types/passport';

type SessionDetailSpendUiProps = {
  session: SpendingSession;
};

const SessionDetailSpendUi = ({ session }: SessionDetailSpendUiProps) => {
  const { t } = useTranslation('session-detail-page');
  return (
    <div className='rounded-md border p-5'>
      <div className='mb-4 flex items-center justify-between'>
        <span className='text-body font-medium'>{t('spend.title')}</span>
        <StatusBadge status={session.status} />
      </div>
      <SpendBar spent={session.spent} limit={session.limit} perCall={session.perCallLimit} />
    </div>
  );
};

export default SessionDetailSpendUi;
