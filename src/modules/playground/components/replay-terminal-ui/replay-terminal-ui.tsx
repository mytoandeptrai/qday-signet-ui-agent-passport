import { useTranslation } from '@/integrations/i18n';
import type { PlaygroundStep } from '@/types/passport';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import type { RefObject } from 'react';
import ReplayControlButtonUi from '../replay-control-button-ui';
import ReplayLineUi from '../replay-line-ui';

type ReplayTerminalUiProps = {
  lines: { step: PlaygroundStep; text: string; typing: boolean }[];
  playing: boolean;
  endRef: RefObject<HTMLDivElement | null>;
  onTogglePlay: () => void;
  onSkip: () => void;
  onReplay: () => void;
};

const ReplayTerminalUi = ({ lines, playing, endRef, onTogglePlay, onSkip, onReplay }: ReplayTerminalUiProps) => {
  const { t } = useTranslation('playground-page');
  return (
    <div className='overflow-hidden rounded-md border bg-[#021417] text-[#e7eced]'>
      <div className='flex items-center justify-between border-b border-white/10 px-4 py-2.5'>
        <div className='flex items-center gap-1.5'>
          <span className='size-2.5 rounded-full bg-white/20' />
          <span className='size-2.5 rounded-full bg-white/20' />
          <span className='size-2.5 rounded-full bg-white/20' />
          <span className='ml-3 font-mono text-small text-white/50'>{t('terminal.title')}</span>
        </div>
        <div className='flex items-center gap-1'>
          <ReplayControlButtonUi label={playing ? t('controls.pause') : t('controls.play')} onClick={onTogglePlay}>
            {playing ? <Pause className='size-3.5' /> : <Play className='size-3.5' />}
          </ReplayControlButtonUi>
          <ReplayControlButtonUi label={t('controls.skip')} onClick={onSkip}>
            <SkipForward className='size-3.5' />
          </ReplayControlButtonUi>
          <ReplayControlButtonUi label={t('controls.replay')} onClick={onReplay}>
            <RotateCcw className='size-3.5' />
          </ReplayControlButtonUi>
        </div>
      </div>
      <div className='h-[440px] space-y-2 overflow-y-auto p-5 font-mono text-[12.5px] leading-[1.6]'>
        {lines.map((l, i) => (
          <ReplayLineUi key={`${i}-${l.step.kind}`} step={l.step} text={l.text} typing={l.typing} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ReplayTerminalUi;
