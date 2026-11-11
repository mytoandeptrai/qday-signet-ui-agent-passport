import type { PlaygroundScenario } from '@/types/passport';
import { useEffect, useRef, useState } from 'react';
import { PAUSE_MS, TYPE_MS, TYPED_KINDS } from '../utils';

/** Drives the terminal replay: types prompts and commands, pauses between steps, tallies what was paid. */
export const useReplayContainer = (scenario: PlaygroundScenario) => {
  const { steps } = scenario;
  const [pos, setPos] = useState({ i: 0, c: 0 });
  const [playing, setPlaying] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const finished = pos.i >= steps.length;

  useEffect(() => {
    if (!playing || finished) return;
    const step = steps[pos.i];
    const typed = TYPED_KINDS.includes(step.kind);
    const timer = setTimeout(
      () => setPos((p) => (typed && p.c < step.text.length ? { i: p.i, c: p.c + 1 } : { i: p.i + 1, c: 0 })),
      typed && pos.c < step.text.length ? TYPE_MS : PAUSE_MS
    );
    return () => clearTimeout(timer);
  }, [pos, playing, finished, steps]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [pos.i]);

  const done = steps.slice(0, pos.i);
  const lines = steps.slice(0, Math.min(pos.i + 1, steps.length)).map((step, i) => {
    const isCurrent = i === pos.i && TYPED_KINDS.includes(step.kind);
    return { step, text: isCurrent ? step.text.slice(0, pos.c) : step.text, typing: isCurrent && !finished && playing };
  });
  const spent = done.reduce((n, s) => (s.kind === 'pay' ? n + (s.amount ?? 0) : n), 0);
  const notes = done.filter((s) => s.note).concat(!finished && steps[pos.i].note ? [steps[pos.i]] : []);

  const onTogglePlay = () => setPlaying((p) => !p);
  const onSkip = () => setPos({ i: steps.length, c: 0 });
  const onReplay = () => {
    setPos({ i: 0, c: 0 });
    setPlaying(true);
  };

  return { endRef, playing, lines, spent, notes, onTogglePlay, onSkip, onReplay };
};
