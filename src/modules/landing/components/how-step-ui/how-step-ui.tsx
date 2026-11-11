import { SignetPlate, type PlateScene } from '@/components/brand/signet-plate';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';
import { CARD_SHADOW } from '../../utils';

type HowStepUiProps = {
  n: string;
  title: string;
  scene: PlateScene;
  level: number;
  plateSrc?: string;
};

const HowStepUi: FCC<HowStepUiProps> = ({ n, title, scene, level, plateSrc, children }) => {
  return (
    <>
      <div className='relative aspect-[4/5]'>
        <div className='absolute inset-0'>
          <SignetPlate scene={scene} aspect={0.8} progress={level} src={plateSrc} />
        </div>
        <div
          className={cn(
            'absolute inset-x-3 top-1/2 flex h-[104px] -translate-y-1/2 flex-col justify-center rounded-md border bg-card px-3.5',
            CARD_SHADOW
          )}
        >
          {children}
        </div>
      </div>
      <h3 className='mt-[22px] flex items-baseline gap-3.5 font-display text-[26px] leading-[1.2] font-semibold'>
        <span className='font-sans text-[13px] text-text-3'>{n}</span>
        {title}
      </h3>
    </>
  );
};

export default HowStepUi;
