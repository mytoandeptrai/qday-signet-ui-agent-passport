import { money } from '@/lib/format';
import type { PlaygroundStep } from '@/types/passport';

type ReplayLineUiProps = {
  step: PlaygroundStep;
  text: string;
  typing: boolean;
};

const ReplayLineUi = ({ step, text, typing }: ReplayLineUiProps) => {
  const caret = typing ? <span className='ml-px inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-current' /> : null;
  switch (step.kind) {
    case 'prompt':
      return (
        <p>
          <span className='text-[#8ecaed]'>you&nbsp;&gt; </span>
          {text}
          {caret}
        </p>
      );
    case 'agent':
      return (
        <p className='text-white/70'>
          <span className='text-[#60f2ff]'>agent&nbsp;&gt; </span>
          {text}
        </p>
      );
    case 'cmd':
      return (
        <p className='text-[#9dd0a6]'>
          <span className='text-white/40'>$ </span>
          {text}
          {caret}
        </p>
      );
    case 'pay':
      return (
        <p className='text-[#9dd0a6]'>
          → {step.text} · {money(step.amount ?? 0)}
        </p>
      );
    case 'stop':
      return <p className='text-[#f0ada7]'>{step.text}</p>;
    case 'done':
      return <p className='border-t border-white/10 pt-2 text-white/50'>{step.text}</p>;
    default:
      return <p className='whitespace-pre-wrap text-white/55'>{text}</p>;
  }
};

export default ReplayLineUi;
