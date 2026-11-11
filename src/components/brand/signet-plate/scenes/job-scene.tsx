import { ACCENT } from '../signet-plate.constants';

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

export default Job;
