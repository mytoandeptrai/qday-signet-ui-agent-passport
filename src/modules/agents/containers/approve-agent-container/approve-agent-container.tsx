import { ApproveAgentUi } from '../../components';
import { useApproveAgentContainer } from '../../hooks';

const ApproveAgentContainer = () => {
  const { agent, status, isLoading, onApprove, onCancel } = useApproveAgentContainer();
  return <ApproveAgentUi agent={agent} status={status} isLoading={isLoading} onApprove={onApprove} onCancel={onCancel} />;
};

export default ApproveAgentContainer;
