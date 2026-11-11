import { ACCENT } from '../signet-plate.constants';

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

export default Orbit;
