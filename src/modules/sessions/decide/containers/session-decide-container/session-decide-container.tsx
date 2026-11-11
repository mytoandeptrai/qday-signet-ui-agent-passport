import { SessionDecideCardUi, SessionDecideMissingUi } from '../../components';
import { useSessionDecideContainer } from '../../hooks';

const SessionDecideContainer = () => {
  const { escalation, isDone, onApprove, onDecline } = useSessionDecideContainer();
  if (!escalation) return <SessionDecideMissingUi />;
  return <SessionDecideCardUi escalation={escalation} isDone={isDone} onApprove={onApprove} onDecline={onDecline} />;
};

export default SessionDecideContainer;
