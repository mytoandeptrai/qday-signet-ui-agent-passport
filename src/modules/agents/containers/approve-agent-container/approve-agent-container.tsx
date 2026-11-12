import { ApproveAgentUi } from '../../components';
import { useApproveAgentContainer } from '../../hooks';

const ApproveAgentContainer = () => {
  const { agent, status, summary, isLoading, onApprove, onCancel } = useApproveAgentContainer();
  return <ApproveAgentUi agent={agent} status={status} summary={summary} isLoading={isLoading} onApprove={onApprove} onCancel={onCancel} />;
};

export default ApproveAgentContainer;
