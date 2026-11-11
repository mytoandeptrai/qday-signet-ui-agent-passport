import { OverviewPendingBannerUi } from '../../components';
import { usePendingEscalationsContainer } from '../../hooks';

const PendingEscalationsContainer = () => {
  const { pending } = usePendingEscalationsContainer();
  return (
    <>
      {pending.map((e) => (
        <OverviewPendingBannerUi key={e.id} escalation={e} />
      ))}
    </>
  );
};

export default PendingEscalationsContainer;
