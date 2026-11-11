import { OverviewIdeasUi } from '../../components';
import { useOverviewContainer } from '../../hooks';
import { IDEA_IDS } from '../../utils';
import GetStartedContainer from '../get-started-container';
import OverviewActivityContainer from '../overview-activity-container';
import OverviewBalanceContainer from '../overview-balance-container';
import OverviewSessionsContainer from '../overview-sessions-container';
import PendingEscalationsContainer from '../pending-escalations-container';

const OverviewContainer = () => {
  const { step, open, onSelectStep, onToggleOpen, onEditAllowance } = useOverviewContainer();
  return (
    <>
      <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14'>
        <div className='min-w-0'>
          <PendingEscalationsContainer />
          <OverviewIdeasUi ideas={IDEA_IDS} />
          <GetStartedContainer step={step} open={open} onSelectStep={onSelectStep} onToggleOpen={onToggleOpen} />
        </div>
        <OverviewBalanceContainer onEditAllowance={onEditAllowance} />
      </div>
      <OverviewSessionsContainer />
      <OverviewActivityContainer />
    </>
  );
};

export default OverviewContainer;
