import type { PlaygroundScenario } from '@/types/passport';
import { useEffect, useRef, useState } from 'react';
import { PAUSE_MS, prefersReducedMotion, TYPE_MS, TYPED_KINDS } from '../utils';

/** Drives the replay: types what you say, pauses between steps, and tallies what the Trellis Wallet paid. */
export const useReplayContainer = (scenario: PlaygroundScenario) => {
  const { steps } = scenario;
  const [pos, setPos] = useState({ i: 0, c: 0 });
  const [playing, setPlaying] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const finished = pos.i >= steps.length;
  const instant = prefersReducedMotion();

  useEffect(() => {
    if (!playing || finished) return;
    const step = steps[pos.i];
    const typing = !instant && TYPED_KINDS.includes(step.kind) && pos.c < step.text.length;
    const timer = setTimeout(() => setPos((p) => (typing ? { i: p.i, c: p.c + 1 } : { i: p.i + 1, c: 0 })), typing ? TYPE_MS : PAUSE_MS);
    return () => clearTimeout(timer);
  }, [pos, playing, finished, steps, instant]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [pos.i]);

  const shown = steps.slice(0, Math.min(pos.i + 1, steps.length));
  const lines = shown.flatMap((step, i) => {
    if (step.kind === 'event') return [];
    const isCurrent = i === pos.i && !instant && TYPED_KINDS.includes(step.kind);
    return [{ step, text: isCurrent ? step.text.slice(0, pos.c) : step.text, typing: isCurrent && !finished && playing }];
  });
  const events = shown.flatMap((step, i) => (step.kind === 'event' ? [{ step, active: i === pos.i && !finished }] : []));
  const spent = shown.reduce((n, s) => (s.tone === 'payment' ? n + (s.amount ?? 0) : n), 0);

  const onTogglePlay = () => setPlaying((p) => !p);
  const onSkip = () => setPos({ i: steps.length, c: 0 });
  const onReplay = () => {
    setPos({ i: 0, c: 0 });
    setPlaying(true);
  };

  return { endRef, playing, lines, events, spent, onTogglePlay, onSkip, onReplay };
};
