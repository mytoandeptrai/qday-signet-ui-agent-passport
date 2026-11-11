import {
  SessionDetailActivityUi,
  SessionDetailHeaderUi,
  SessionDetailRevokeUi,
  SessionDetailServicesUi,
  SessionDetailSpendUi,
} from '../../components';
import { useSessionDetailContainer } from '../../hooks';

const SessionDetailContainer = () => {
  const { session, activity, refund, onRevoke } = useSessionDetailContainer();
  if (!session) return null;

  return (
    <>
      <SessionDetailHeaderUi
        session={session}
        action={session.status === 'active' && <SessionDetailRevokeUi refund={refund} onRevoke={onRevoke} />}
      />
      <div className='grid gap-6 md:grid-cols-[1fr_320px]'>
        <SessionDetailActivityUi items={activity} />
        <aside className='space-y-6'>
          <SessionDetailSpendUi session={session} />
          <SessionDetailServicesUi services={session.allowedServices} />
        </aside>
      </div>
    </>
  );
};

export default SessionDetailContainer;
