import { PublicFooter } from '@/components/layouts';
import { ClosingSectionUi, LineSectionUi, LogoMarqueeUi } from '../../components';
import { useLandingContainer } from '../../hooks';
import DayContainer from '../day-container';
import HeroContainer from '../hero-container';
import HowContainer from '../how-container';
import SessionContainer from '../session-container';

const LandingContainer = () => {
  const { agentsLine, recordLine, servicesLine } = useLandingContainer();

  return (
    <main className='text-foreground'>
      <HeroContainer />
      <LogoMarqueeUi />
      <SessionContainer />
      <LineSectionUi {...agentsLine} />
      <HowContainer />
      <LineSectionUi {...recordLine} />
      <DayContainer />
      <LineSectionUi {...servicesLine} />
      <ClosingSectionUi />
      <PublicFooter />
    </main>
  );
};

export default LandingContainer;
