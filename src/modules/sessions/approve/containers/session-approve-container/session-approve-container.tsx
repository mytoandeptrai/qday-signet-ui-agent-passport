import { SessionApproveCardUi } from '../../components';
import { useSessionApproveContainer } from '../../hooks';

const SessionApproveContainer = () => {
  const { request, available, isShort, onApprove, onDecline } = useSessionApproveContainer();
  return (
    <SessionApproveCardUi
      task={request.task}
      agent={request.agent}
      limit={request.limit}
      perCall={request.perCall}
      hours={request.hours}
      available={available}
      isShort={isShort}
      onApprove={onApprove}
      onDecline={onDecline}
    />
  );
};

export default SessionApproveContainer;
