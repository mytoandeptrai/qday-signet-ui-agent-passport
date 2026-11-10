import { cn } from '@/lib/utils';
import { memo, type CSSProperties, type ReactNode } from 'react';

export type PlateScene = 'lattice' | 'install' | 'limits' | 'job' | 'ledger' | 'orbit';

interface SignetPlateProps {
  scene: PlateScene;
  /** 0..1. Drives the scene through a CSS variable, so scrolling never re-renders the artwork. */
  progress?: number;
  /** Width over height of the box the plate fills; the scene is drawn for it, so wide plates are not zoomed. */
  aspect?: number;
  /** Your own artwork. When set it replaces the drawn scene. */
  src?: string;
  className?: string;
  label?: string;
}

const BLUE = [
  'radial-gradient(55% 50% at 14% 8%, rgba(142,202,237,.55), transparent 70%)',
  'radial-gradient(50% 55% at 92% 12%, rgba(77,139,255,.75), transparent 70%)',
  'radial-gradient(70% 55% at 72% 102%, rgba(2,121,169,.6), transparent 70%)',
  'radial-gradient(60% 60% at 0% 100%, rgba(31,102,255,.85), transparent 70%)',
  'linear-gradient(160deg, #0a3fd1, #071c63)',
].join(',');
const DEEP = 'radial-gradient(60% 80% at 50% 0%, rgba(31,102,255,.55), transparent 70%), radial-gradient(40% 60% at 100% 100%, rgba(2,121,169,.35), transparent 70%), linear-gradient(180deg, #0a1a4a, #050c26)';
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`;

const css = (vars: Record<string, string | number>): CSSProperties => vars as CSSProperties;
const SVG_BOX: CSSProperties = { transformBox: 'fill-box' };
const VIEW_BOX: CSSProperties = { transformBox: 'view-box', transformOrigin: '50px 50px' };
const ACCENT = '#8ecaed';

/** The Signet ring and mark, scaled to a 15-unit radius. */
function Mark() {
  return (
    <g>
      <circle cx='50' cy='50' r='15' fill='#fff' fillOpacity='.1' />
      <circle cx='50' cy='50' r='15' stroke='#fff' strokeWidth='1.6' strokeLinecap='round' strokeDasharray='94.3' style={{ ...VIEW_BOX, strokeDashoffset: 'calc((1 - var(--p)) * 94px)', transform: 'rotate(-90deg)' }} />
      <path d='M42.7 45.6 47.4 53.9H56.9L52.2 45.6Z' fill='#fff' style={{ ...VIEW_BOX, transform: 'scale(calc(0.7 + var(--p) * 0.3))' }} />
    </g>
  );
}

function Lattice() {
  const n = 9;
  const step = 12.5;
  const lit = (d: number) => `clamp(0.14, calc(var(--p) * 1.7 - ${d.toFixed(3)} * 0.7), 1)`;
  const items: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const d = (i + j) / 16;
      const x = i * step;
      const y = j * step;
      if (i < n - 1) items.push(<line key={`h${i}-${j}`} x1={x} y1={y} x2={x + step} y2={y} stroke='#fff' strokeWidth='.35' style={{ opacity: lit(d + 0.03) }} />);
      if (j < n - 1) items.push(<line key={`v${i}-${j}`} x1={x} y1={y} x2={x} y2={y + step} stroke='#fff' strokeWidth='.35' style={{ opacity: lit(d + 0.03) }} />);
      items.push(<circle key={`n${i}-${j}`} cx={x} cy={y} r='1.15' fill={(i + j) % 5 === 0 ? ACCENT : '#fff'} style={{ opacity: lit(d) }} />);
    }
  }
  return (
    <>
      <g transform='translate(50 50) rotate(45) scale(1.45) translate(-50 -50)'>{items}</g>
      <Mark />
    </>
  );
}

const CODE = [
  [['#8ecaed', 8], ['#fff', 22]],
  [['#fff', 14], ['#6ea1ff', 18], ['#fff', 10]],
  [['#fff', 6], ['#8ecaed', 26]],
  [['#6ea1ff', 12], ['#fff', 30]],
  [['#fff', 20], ['#8ecaed', 12]],
  [['#8ecaed', 16], ['#fff', 8], ['#6ea1ff', 14]],
  [['#fff', 28]],
  [['#6ea1ff', 10], ['#fff', 20], ['#8ecaed', 8]],
] as const;

function Install() {
  return (
    <>
      <rect x='12' y='10' width='76' height='80' rx='4' fill='#fff' fillOpacity='.09' stroke='#fff' strokeOpacity='.3' strokeWidth='.3' />
      <line x1='12' y1='19' x2='88' y2='19' stroke='#fff' strokeOpacity='.18' strokeWidth='.25' />
      {[0, 1, 2].map((k) => <circle key={k} cx={17 + k * 3.6} cy='14.5' r='.9' fill='#fff' fillOpacity='.55' />)}
      {CODE.map((segs, i) => {
        let x = 18;
        return (
          <g key={i} style={{ ...SVG_BOX, transformOrigin: 'left center', transform: `scaleX(clamp(0, calc(var(--p) * 9 - ${i}), 1))` }}>
            <text x='15' y={29.6 + i * 7.4} fontSize='1.8' fill='#fff' fillOpacity='.35' textAnchor='middle'>{i + 1}</text>
            {segs.map(([c, w], k) => {
              const r = <rect key={k} x={x} y={28 + i * 7.4} width={w} height='1.5' rx='.75' fill={c} fillOpacity={c === '#fff' ? 0.8 : 0.95} />;
              x += w + 2.2;
              return r;
            })}
          </g>
        );
      })}
      <rect className='signet-caret' x='18' y='83' width='1.3' height='2.6' rx='.4' fill='#fff' />
    </>
  );
}

function Limits() {
  const rows = [{ y: 20, k: 0.55, label: 'Per call' }, { y: 31, k: 0.85, label: 'Total budget' }, { y: 70, k: 0.4, label: 'Per day' }, { y: 81, k: 0.7, label: 'Expires' }];
  return (
    <>
      {rows.map(({ y, k, label }) => (
        <g key={y}>
          <text x='14' y={y - 3.2} fontSize='2.3' fill='#fff' fillOpacity='.7'>{label}</text>
          <line x1='14' y1={y} x2='86' y2={y} stroke='#fff' strokeOpacity='.22' strokeWidth='.5' strokeLinecap='round' />
          {[0, 0.25, 0.5, 0.75, 1].map((s) => <line key={s} x1={14 + s * 72} y1={y + 2} x2={14 + s * 72} y2={y + 3.2} stroke='#fff' strokeOpacity='.3' strokeWidth='.25' />)}
          <line x1='14' y1={y} x2='86' y2={y} stroke={ACCENT} strokeWidth='.6' strokeLinecap='round' pathLength='1' strokeDasharray='1' style={{ strokeDashoffset: `calc(1 - var(--p) * ${k})` }} />
          <g style={{ transform: `translateX(calc(var(--p) * ${k} * 72px))` }}>
            <circle cx='14' cy={y} r='3.6' fill='#fff' fillOpacity='.18' />
            <circle cx='14' cy={y} r='1.8' fill='#fff' />
          </g>
        </g>
      ))}
    </>
  );
}

const GRAPH = {
  agent: [24, 22],
  services: [[44, 10], [44, 34], [64, 14], [64, 32], [84, 22]],
} as const;

function Job() {
  const [ax, ay] = GRAPH.agent;
  const receipts = [34, 22, 28];
  return (
    <>
      {GRAPH.services.map(([x, y], i) => (
        <g key={i}>
          <line x1={ax} y1={ay} x2={x} y2={y} stroke='#fff' strokeOpacity='.14' strokeWidth='.3' />
          <line x1={ax} y1={ay} x2={x} y2={y} stroke={ACCENT} strokeWidth='.4' pathLength='1' strokeDasharray='1' style={{ strokeDashoffset: `calc(1 - clamp(0, calc(var(--p) * 6 - ${i}), 1))` }} />
          <circle cx={x} cy={y} r='3.4' fill={ACCENT} fillOpacity='.18' style={{ opacity: `clamp(0, calc(var(--p) * 6 - ${i}), 1)` }} />
          <circle cx={x} cy={y} r='1.5' fill='#fff' style={{ opacity: `clamp(0.3, calc(var(--p) * 6 - ${i} + 0.3), 1)` }} />
        </g>
      ))}
      <circle cx={ax} cy={ay} r='5.5' fill='#fff' fillOpacity='.12' stroke='#fff' strokeOpacity='.5' strokeWidth='.3' />
      <circle cx={ax} cy={ay} r='2.4' fill='#fff' />
      {receipts.map((w, i) => (
        <g key={i} style={{ opacity: `clamp(0.15, calc(var(--p) * 4 - ${i}), 1)` }}>
          <circle cx='18' cy={72 + i * 8.5} r='1.5' fill={ACCENT} />
          <line x1='24' y1={72 + i * 8.5} x2={24 + w * 1.6} y2={72 + i * 8.5} stroke='#fff' strokeOpacity='.75' strokeWidth='.5' strokeLinecap='round' />
        </g>
      ))}
    </>
  );
}

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(pts: number[][]) {
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M${p[0]} ${p[1]}`;
    const p0 = pts[i - 2] ?? pts[i - 1];
    const p1 = pts[i - 1];
    const p3 = pts[i + 1] ?? p;
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
    return `${d}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p[0]} ${p[1]}`;
  }, '');
}

function Ledger({ w }: { w: number }) {
  const ys = [80, 76, 71, 74, 62, 55, 50, 40, 36, 31];
  const pts = ys.map((y, i) => [6 + (i * (w - 12)) / (ys.length - 1), y]);
  const line = smooth(pts);
  return (
    <>
      <defs>
        <linearGradient id='ledger-area' x1='0' y1='0' x2='0' y2='1'>
          <stop stopColor={ACCENT} stopOpacity='.5' />
          <stop offset='1' stopColor={ACCENT} stopOpacity='0' />
        </linearGradient>
      </defs>
      {[40, 56, 72, 88].map((y) => <line key={y} x1='6' y1={y} x2={w - 6} y2={y} stroke='#fff' strokeOpacity='.1' strokeWidth='.25' />)}
      <line x1='6' y1='22' x2={w - 6} y2='22' stroke='#fff' strokeOpacity='.55' strokeWidth='.3' strokeDasharray='1.5 1.5' />
      <text x={w - 6} y='19.4' fontSize='2.6' fill='#fff' fillOpacity='.75' textAnchor='end'>Session limit</text>
      <path d={`${line}L${w - 6} 92L6 92Z`} fill='url(#ledger-area)' style={{ opacity: 'clamp(0, calc(var(--p) * 1.6 - 0.2), 1)' }} />
      <path d={line} stroke={ACCENT} strokeWidth='.7' strokeLinecap='round' pathLength='1' strokeDasharray='1' style={{ strokeDashoffset: 'calc(1 - var(--p) * 1.3)' }} />
    </>
  );
}

function Orbit({ w }: { w: number }) {
  const rings = [{ r: 14, s: 24, dot: 1.8, c: '#fff' }, { r: 24, s: 38, dot: 2.1, c: ACCENT }, { r: 34, s: 56, dot: 1.8, c: '#fff' }, { r: 44, s: 80, dot: 2.6, c: ACCENT }];
  const cx = w / 2;
  const dots = Math.floor(w / 6.3);
  return (
    <>
      {w > 150 && Array.from({ length: dots }, (_, i) => <circle key={i} cx={4 + i * 6.3} cy='50' r='.5' fill='#fff' fillOpacity='.3' />)}
      {rings.map(({ r, s, dot, c }, i) => (
        <g key={r}>
          <circle cx={cx} cy='50' r={r} stroke='#fff' strokeOpacity='.16' />
          <g className='signet-orbit' style={{ transformBox: 'view-box', transformOrigin: `${cx}px 50px`, animationDuration: `${s}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}>
            <circle cx={cx + r} cy='50' r={dot} fill={c} />
          </g>
        </g>
      ))}
      <circle cx={cx} cy='50' r='6' fill='#fff' />
    </>
  );
}

/** Scenes drawn in a 100-unit box sit in the middle of wider plates. */
const SCENES: Record<PlateScene, (props: { w: number }) => ReactNode> = {
  lattice: () => <Lattice />,
  install: () => <Install />,
  limits: () => <Limits />,
  job: () => <Job />,
  ledger: Ledger,
  orbit: Orbit,
};
const CENTERED: PlateScene[] = ['lattice', 'install', 'limits', 'job'];

/** Brand artwork in the Trellis blue family: each scene reads `--p` (0..1), set once on the root. */
export const SignetPlate = memo(function SignetPlate({ scene, progress = 0.5, aspect = 1, src, className, label }: SignetPlateProps) {
  if (src) return <img src={src} alt={label ?? ''} className={cn('block size-full rounded-3xl object-cover', className)} draggable={false} />;
  const Scene = SCENES[scene];
  const w = 100 * aspect;
  return (
    <div role='img' aria-label={label} className={cn('relative size-full overflow-hidden rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.16)]', className)} style={{ ...css({ '--p': progress }), background: scene === 'orbit' ? DEEP : BLUE }}>
      <i className='pointer-events-none absolute inset-0 block opacity-[.14] mix-blend-overlay' style={{ backgroundImage: GRAIN }} />
      <svg viewBox={`0 0 ${w} 100`} preserveAspectRatio='xMidYMid slice' fill='none' aria-hidden='true' className='absolute inset-0 size-full'>
        <g transform={CENTERED.includes(scene) ? `translate(${(w - 100) / 2} 0)` : undefined}><Scene w={w} /></g>
      </svg>
    </div>
  );
});
