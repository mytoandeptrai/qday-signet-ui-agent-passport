import { cn } from '@/lib/utils';
import { memo } from 'react';

interface RisoPlateProps {
  /** 0 = sun on the horizon, 1 = high in the sky. */
  sun?: number;
  variant?: 'day' | 'night';
  /** Your own artwork. When set it replaces the drawn print (the sun no longer moves). */
  src?: string;
  className?: string;
  label?: string;
}

const PALETTE = {
  day: { skyTop: '#d9d8d6', skyBottom: '#f2b287', seaTop: '#3f5f9a', seaBottom: '#33548a', sun: '#f28c5b', paper: '#efe3d2', r: 13 },
  night: { skyTop: '#18264a', skyBottom: '#3a4c80', seaTop: '#26406c', seaBottom: '#1a2a4c', sun: '#f4f1ea', paper: '#1a2a4c', r: 8 },
};

const HORIZON = 62;
const STARS = [[12, 14], [26, 30], [70, 12], [84, 26], [60, 36], [38, 10], [92, 8], [48, 22]];

/** Printed once by the browser, then reused: no per-frame filter work while scrolling. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 -.3'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

/**
 * A riso-style print: sky, sun, sea and a grain layer.
 * Only the sun moves, by transform, so scrolling stays on the compositor.
 */
export const RisoPlate = memo(function RisoPlate({ sun = 0.5, variant = 'day', src, className, label }: RisoPlateProps) {
  const c = PALETTE[variant];
  const sunCenter = HORIZON - 6 - sun * 42;

  if (src) {
    return <img src={src} alt={label ?? ''} className={cn('block size-full object-cover', className)} draggable={false} />;
  }

  return (
    <div role='img' aria-label={label} className={cn('relative size-full overflow-hidden [container-type:size]', className)} style={{ background: c.paper, ['--sun' as string]: sun }}>
      <div className='absolute inset-x-0 top-0 overflow-hidden' style={{ height: `${HORIZON}%`, background: `linear-gradient(${c.skyTop}, ${c.skyBottom})` }}>
        {variant === 'night' && STARS.map(([x, y]) => <i key={`${x}-${y}`} className='absolute size-[2px] rounded-full bg-[#f4f1ea]' style={{ left: `${x}%`, top: `${y}%` }} />)}
        <i
          className='absolute top-0 left-1/2 block rounded-full will-change-transform'
          style={{ width: `${c.r * 2}cqw`, aspectRatio: '1', background: c.sun, opacity: 0.95, transform: `translate3d(-50%, calc(${sunCenter}cqh - ${c.r}cqw), 0)` }}
        />
      </div>
      <div className='absolute inset-x-0 bottom-0' style={{ height: `${100 - HORIZON}%`, background: `linear-gradient(${c.seaTop}, ${c.seaBottom})` }}>
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className='absolute left-1/2 block -translate-x-1/2' style={{ top: `${(2 + i * 4.2) / (100 - HORIZON) * 100}%`, width: `${70 - i * 5}%`, height: `${0.7 + i * 0.12}cqh`, background: c.sun, opacity: Math.max(0.08, 0.5 - i * 0.05) * 0.8 }} />
        ))}
      </div>
      <i className='pointer-events-none absolute inset-0 block opacity-40 mix-blend-multiply' style={{ backgroundImage: GRAIN }} />
    </div>
  );
});
