import { SessionDecideCardUi, SessionDecideMissingUi } from '../../components';
import { useSessionDecideContainer } from '../../hooks';

const SessionDecideContainer = () => {
  const { escalation, isDone, status, summary, isLoading, onApprove, onDecline } = useSessionDecideContainer();
  if (!escalation) return <SessionDecideMissingUi />;
  return (
    <SessionDecideCardUi
      escalation={escalation}
      isDone={isDone}
      status={status}
      summary={summary}
      isLoading={isLoading}
      onApprove={onApprove}
      onDecline={onDecline}
    />
  );
};

export default SessionDecideContainer;
