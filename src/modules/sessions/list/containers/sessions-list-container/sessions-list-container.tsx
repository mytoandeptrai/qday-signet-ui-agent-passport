import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { SessionsListUi, SessionsRevokeDialogUi } from '../../components';
import { useSessionsListContainer } from '../../hooks';

const SessionsListContainer = () => {
  const { t, sessions, target, isRevoking, onNew, onRevoke, onCloseRevoke, onConfirmRevoke } = useSessionsListContainer();
  return (
    <div className='max-w-4xl'>
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={
          <Button onClick={onNew}>
            <PlusIcon /> {t('new')}
          </Button>
        }
      />
      <SessionsListUi sessions={sessions} onRevoke={onRevoke} />
      <SessionsRevokeDialogUi session={target} isLoading={isRevoking} onClose={onCloseRevoke} onConfirm={onConfirmRevoke} />
    </div>
  );
};

export default SessionsListContainer;
