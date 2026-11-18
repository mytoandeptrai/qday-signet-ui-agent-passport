import { cn } from '@/lib/utils';
import { memo, type ReactNode } from 'react';
import { BLUE, css, DEEP, GRAIN } from './signet-plate.constants';
import Install from './scenes/install-scene';
import Job from './scenes/job-scene';
import Lattice from './scenes/lattice-scene';
import Ledger from './scenes/ledger-scene';
import Limits from './scenes/limits-scene';
import Orbit from './scenes/orbit-scene';

export type PlateScene = 'lattice' | 'install' | 'limits' | 'job' | 'ledger' | 'orbit';

interface SignetPlateProps {
  scene: PlateScene;
  progress?: number;
  aspect?: number;
  src?: string;
  className?: string;
  label?: string;
}

const SCENES: Record<PlateScene, (props: { w: number }) => ReactNode> = {
  lattice: () => <Lattice />,
  install: () => <Install />,
  limits: () => <Limits />,
  job: () => <Job />,
  ledger: Ledger,
  orbit: Orbit,
};
const CENTERED: PlateScene[] = ['lattice', 'install', 'limits', 'job'];

export const SignetPlate = memo(function SignetPlate({ scene, progress = 0.5, aspect = 1, src, className, label }: SignetPlateProps) {
  if (src) return <img src={src} alt={label ?? ''} className={cn('block size-full rounded-3xl object-cover', className)} draggable={false} />;
  const Scene = SCENES[scene];
  const w = 100 * aspect;
  return (
    <div role='img' aria-label={label} className={cn('relative size-full overflow-hidden rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.16)]', className)} style={{ ...css({ '--p': progress }), background: scene === 'orbit' ? DEEP : BLUE }}>
      <i className='pointer-events-none absolute inset-0 block opacity-14 mix-blend-overlay' style={{ backgroundImage: GRAIN }} />
      <svg viewBox={`0 0 ${w} 100`} preserveAspectRatio='xMidYMid slice' fill='none' aria-hidden='true' className='absolute inset-0 size-full'>
        <g transform={CENTERED.includes(scene) ? `translate(${(w - 100) / 2} 0)` : undefined}><Scene w={w} /></g>
      </svg>
    </div>
  );
});
