import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PLAYGROUND_SCENARIOS } from '@/mock/playground';
import type { PlaygroundScenario, PlaygroundStep } from '@/types/passport';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/(app)/playground')({
  validateSearch: z.object({ idea: z.string().optional() }),
  component: Playground,
});

const TYPED: PlaygroundStep['kind'][] = ['prompt', 'cmd'];
const TYPE_MS = 22;
const PAUSE_MS = 650;

function Playground() {
  const { idea } = Route.useSearch();
  const navigate = useNavigate();
  const scenario = PLAYGROUND_SCENARIOS.find((s) => s.id === idea) ?? PLAYGROUND_SCENARIOS[0];

  return (
    <>
      <PageHeader title='Playground' description='Watch an agent work under a Signet session, one terminal line at a time.' />
      <div className='mb-5 flex flex-wrap gap-2'>
        {PLAYGROUND_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type='button'
            onClick={() => navigate({ to: '/playground', search: { idea: s.id }, replace: true })}
            className={cn('h-8 rounded-md border px-3 text-body transition-colors', s.id === scenario.id ? 'border-foreground bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')}
          >
            {s.title}
          </button>
        ))}
      </div>
      <Replay key={scenario.id} scenario={scenario} />
    </>
  );
}

function Replay({ scenario }: { scenario: PlaygroundScenario }) {
  const { steps } = scenario;
  const [pos, setPos] = useState({ i: 0, c: 0 });
  const [playing, setPlaying] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const finished = pos.i >= steps.length;

  useEffect(() => {
    if (!playing || finished) return;
    const step = steps[pos.i];
    const typed = TYPED.includes(step.kind);
    const t = setTimeout(
      () => setPos((p) => (typed && p.c < step.text.length ? { i: p.i, c: p.c + 1 } : { i: p.i + 1, c: 0 })),
      typed && pos.c < step.text.length ? TYPE_MS : PAUSE_MS,
    );
    return () => clearTimeout(t);
  }, [pos, playing, finished, steps]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [pos.i]);

  const shown = steps.slice(0, Math.min(pos.i + 1, steps.length));
  const done = steps.slice(0, pos.i);
  const spent = done.reduce((n, s) => (s.kind === 'pay' ? n + (s.amount ?? 0) : n), 0);
  const notes = done.filter((s) => s.note).concat(!finished && steps[pos.i].note ? [steps[pos.i]] : []);

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
      <div className='overflow-hidden rounded-md border bg-[#16140f] text-[#ece7dc]'>
        <div className='flex items-center justify-between border-b border-white/10 px-4 py-2.5'>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-white/20' />
            <span className='size-2.5 rounded-full bg-white/20' />
            <span className='size-2.5 rounded-full bg-white/20' />
            <span className='ml-3 font-mono text-small text-white/50'>claude · ~/work</span>
          </div>
          <div className='flex items-center gap-1'>
            <ControlButton label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>{playing ? <Pause className='size-3.5' /> : <Play className='size-3.5' />}</ControlButton>
            <ControlButton label='Skip to end' onClick={() => setPos({ i: steps.length, c: 0 })}><SkipForward className='size-3.5' /></ControlButton>
            <ControlButton label='Replay' onClick={() => { setPos({ i: 0, c: 0 }); setPlaying(true); }}><RotateCcw className='size-3.5' /></ControlButton>
          </div>
        </div>
        <div className='h-[440px] space-y-2 overflow-y-auto p-5 font-mono text-[12.5px] leading-[1.6]'>
          {shown.map((s, i) => (
            <Line key={i} step={s} text={i === pos.i && TYPED.includes(s.kind) ? s.text.slice(0, pos.c) : s.text} typing={i === pos.i && !finished && playing && TYPED.includes(s.kind)} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <aside className='space-y-6'>
        <div>
          <p className='text-body text-muted-foreground'>Session limit</p>
          <p className='mt-1 font-serif text-figure leading-none font-light'>{money(spent)}<span className='text-lead text-muted-foreground'> / {money(scenario.limit)}</span></p>
          <div className='mt-3 h-1 overflow-hidden rounded-full bg-border'>
            <div className='h-full bg-brand transition-[width] duration-500' style={{ width: `${Math.min(100, (spent / scenario.limit) * 100)}%` }} />
          </div>
        </div>
        <div>
          <p className='text-body text-muted-foreground'>What is happening</p>
          {notes.length === 0 ? (
            <p className='mt-2 text-body text-muted-foreground'>{scenario.summary}</p>
          ) : (
            <ol className='mt-2 space-y-3'>
              {notes.map((s, i) => (
                <li key={s.text} className={cn('text-body leading-[1.5]', i === notes.length - 1 ? 'text-foreground' : 'text-muted-foreground')}>{s.note}</li>
              ))}
            </ol>
          )}
        </div>
        <Button asChild className='w-full'>
          <Link to='/create-session' search={{ task: scenario.task }}>Start this as a session</Link>
        </Button>
      </aside>
    </div>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type='button' aria-label={label} title={label} onClick={onClick} className='flex size-7 items-center justify-center rounded text-white/60 hover:bg-white/10 hover:text-white'>
      {children}
    </button>
  );
}

function Line({ step, text, typing }: { step: PlaygroundStep; text: string; typing: boolean }) {
  const caret = typing ? <span className='ml-px inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-current' /> : null;
  switch (step.kind) {
    case 'prompt':
      return <p><span className='text-[#f0a37c]'>you&nbsp;&gt; </span>{text}{caret}</p>;
    case 'agent':
      return <p className='text-white/70'><span className='text-[#8fb0e6]'>agent&nbsp;&gt; </span>{text}</p>;
    case 'cmd':
      return <p className='text-[#cfe3c4]'><span className='text-white/40'>$ </span>{text}{caret}</p>;
    case 'pay':
      return <p className='text-[#cfe3c4]'>→ {step.text} · {money(step.amount ?? 0)}</p>;
    case 'stop':
      return <p className='text-[#f08a7a]'>{step.text}</p>;
    case 'done':
      return <p className='border-t border-white/10 pt-2 text-white/50'>{step.text}</p>;
    default:
      return <p className='whitespace-pre-wrap text-white/55'>{text}</p>;
  }
}
