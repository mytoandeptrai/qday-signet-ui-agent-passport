import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { PlaygroundScenario } from '@/types/passport';
import { Link } from '@tanstack/react-router';
import { ReplayEventsUi, ReplayMeterUi, ReplayTerminalUi } from '../../components';
import { useReplayContainer } from '../../hooks';

type ReplayContainerProps = {
  scenario: PlaygroundScenario;
};

const ReplayContainer = ({ scenario }: ReplayContainerProps) => {
  const { t } = useTranslation('playground-page');
  const { endRef, playing, lines, events, spent, onTogglePlay, onSkip, onReplay } = useReplayContainer(scenario);
  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
      <ReplayTerminalUi lines={lines} playing={playing} endRef={endRef} onTogglePlay={onTogglePlay} onSkip={onSkip} onReplay={onReplay} />
      <aside className='space-y-6'>
        {scenario.limit > 0 && <ReplayMeterUi spent={spent} limit={scenario.limit} />}
        <ReplayEventsUi events={events} summary={scenario.summary} />
        {scenario.session && (
          <Button asChild className='w-full'>
            <Link to='/playground' search={(prev) => ({ ...prev, dialog: 'create-session', task: scenario.task })}>
              {t('labels.start-session')}
            </Link>
          </Button>
        )}
      </aside>
    </div>
  );
};

export default ReplayContainer;
