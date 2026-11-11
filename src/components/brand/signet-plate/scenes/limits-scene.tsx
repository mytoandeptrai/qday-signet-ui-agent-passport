import { ACCENT } from '../signet-plate.constants';

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

export default Limits;
