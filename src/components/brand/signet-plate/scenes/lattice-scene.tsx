import type { ReactNode } from 'react';
import { ACCENT } from '../signet-plate.constants';
import Mark from './mark';

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

export default Lattice;
