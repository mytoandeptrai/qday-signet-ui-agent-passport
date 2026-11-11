import { PageHeader } from '@/components/ui/page-header';
import { AgentsConnectUi, AgentsListUi, AgentsRevokeDialogUi } from '../../components';
import { useAgentsContainer } from '../../hooks';

const AgentsContainer = () => {
  const { t, prompt, pending, registered, target, isRevoking, onApprove, onRevoke, onCloseRevoke, onConfirmRevoke } =
    useAgentsContainer();
  return (
    <div className='max-w-3xl'>
      <PageHeader title={t('title')} description={t('description')} />
      <AgentsConnectUi prompt={prompt} />
      <AgentsListUi title={t('pending.title')} empty={t('pending.empty')} agents={pending} onApprove={onApprove} />
      <AgentsListUi title={t('registered.title')} empty={t('registered.empty')} agents={registered} onRevoke={onRevoke} />
      <AgentsRevokeDialogUi agent={target} isLoading={isRevoking} onClose={onCloseRevoke} onConfirm={onConfirmRevoke} />
    </div>
  );
};

export default AgentsContainer;
