import { cn } from '@/lib/utils';
import { useRotatingWord } from '../../hooks';

type RotatingWordUiProps = {
  words: string[];
};

const RotatingWordUi = ({ words }: RotatingWordUiProps) => {
  const { word, isOut } = useRotatingWord(words);

  return (
    <span className={cn('inline-block text-text-3 transition-all duration-[420ms]', isOut && 'translate-y-[0.12em] opacity-0')}>
      {word}
    </span>
  );
};

export default RotatingWordUi;
