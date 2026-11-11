import { useTranslation } from '@/integrations/i18n';
import { ACCENT } from '../signet-plate.constants';

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
  const { t } = useTranslation('landing-page');
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
      <text x={w - 6} y='19.4' fontSize='2.6' fill='#fff' fillOpacity='.75' textAnchor='end'>{t('plate.session-limit')}</text>
      <path d={`${line}L${w - 6} 92L6 92Z`} fill='url(#ledger-area)' style={{ opacity: 'clamp(0, calc(var(--p) * 1.6 - 0.2), 1)' }} />
      <path d={line} stroke={ACCENT} strokeWidth='.7' strokeLinecap='round' pathLength='1' strokeDasharray='1' style={{ strokeDashoffset: 'calc(1 - var(--p) * 1.3)' }} />
    </>
  );
}

export default Ledger;
