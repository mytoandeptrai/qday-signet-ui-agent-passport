import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { PlaygroundScenario } from '@/types/passport';
import { Link } from '@tanstack/react-router';
import { ReplayMeterUi, ReplayNotesUi, ReplayTerminalUi } from '../../components';
import { useReplayContainer } from '../../hooks';

type ReplayContainerProps = {
  scenario: PlaygroundScenario;
};

const ReplayContainer = ({ scenario }: ReplayContainerProps) => {
  const { t } = useTranslation('playground-page');
  const { endRef, playing, lines, spent, notes, onTogglePlay, onSkip, onReplay } = useReplayContainer(scenario);
  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
      <ReplayTerminalUi lines={lines} playing={playing} endRef={endRef} onTogglePlay={onTogglePlay} onSkip={onSkip} onReplay={onReplay} />
      <aside className='space-y-6'>
        <ReplayMeterUi spent={spent} limit={scenario.limit} />
        <ReplayNotesUi notes={notes} summary={scenario.summary} />
        <Button asChild className='w-full'>
          <Link to='/create-session' search={{ task: scenario.task }}>
            {t('labels.start-session')}
          </Link>
        </Button>
      </aside>
    </div>
  );
};

export default ReplayContainer;
