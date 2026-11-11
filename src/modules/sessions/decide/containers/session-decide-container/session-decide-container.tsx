import { SessionDecideCardUi, SessionDecideMissingUi } from '../../components';
import { useSessionDecideContainer } from '../../hooks';

const SessionDecideContainer = () => {
  const { escalation, isDone, status, isLoading, onApprove, onDecline } = useSessionDecideContainer();
  if (!escalation) return <SessionDecideMissingUi />;
  return (
    <SessionDecideCardUi
      escalation={escalation}
      isDone={isDone}
      status={status}
      isLoading={isLoading}
      onApprove={onApprove}
      onDecline={onDecline}
    />
  );
};

export default SessionDecideContainer;
