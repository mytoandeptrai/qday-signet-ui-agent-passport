import { OverviewIdeasUi } from '../../components';
import { useOverviewContainer } from '../../hooks';
import { IDEA_IDS } from '../../utils';
import GetStartedContainer from '../get-started-container';
import OverviewBalanceContainer from '../overview-balance-container';
import PendingEscalationsContainer from '../pending-escalations-container';

const OverviewContainer = () => {
  const { step, open, onSelectStep, onToggleOpen } = useOverviewContainer();
  return (
    <>
      <PendingEscalationsContainer />
      <OverviewBalanceContainer />
      <GetStartedContainer step={step} open={open} onSelectStep={onSelectStep} onToggleOpen={onToggleOpen} />
      <OverviewIdeasUi ideas={IDEA_IDS} />
    </>
  );
};

export default OverviewContainer;
