import { cn } from '@/lib/utils';
import type { PlaygroundScenario } from '@/types/passport';

type PlaygroundChipsUiProps = {
  scenarios: PlaygroundScenario[];
  activeId: string;
  onSelect: (id: string) => void;
};

const PlaygroundChipsUi = ({ scenarios, activeId, onSelect }: PlaygroundChipsUiProps) => (
  <div className='mb-5 flex flex-wrap gap-2'>
    {scenarios.map((s) => (
      <button
        key={s.id}
        type='button'
        onClick={() => onSelect(s.id)}
        className={cn(
          'h-8 rounded-md border px-3 text-body transition-colors',
          s.id === activeId ? 'border-foreground bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {s.title}
      </button>
    ))}
  </div>
);

export default PlaygroundChipsUi;
