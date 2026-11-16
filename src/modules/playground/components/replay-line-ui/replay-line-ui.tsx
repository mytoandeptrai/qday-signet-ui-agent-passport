import type { PlaygroundStep } from '@/types/passport';

type ReplayLineUiProps = {
  step: PlaygroundStep;
  text: string;
  typing: boolean;
};

const ReplayLineUi = ({ step, text, typing }: ReplayLineUiProps) => {
  if (step.kind === 'you')
    return (
      <p>
        <span className='text-[#8ecaed]'>you&nbsp;&gt; </span>
        {text}
        {typing && <span className='ml-px inline-block h-[1em] w-1.75 translate-y-0.5 animate-pulse bg-current motion-reduce:animate-none' />}
      </p>
    );
  return (
    <p className='text-white/70'>
      <span className='text-[#60f2ff]'>agent&nbsp;&gt; </span>
      {text}
    </p>
  );
};

export default ReplayLineUi;
