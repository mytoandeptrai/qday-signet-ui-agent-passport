import { SVG_BOX } from '../signet-plate.constants';

const CODE = [
  [['#60f2ff', 8], ['#fff', 22]],
  [['#fff', 14], ['#8ecaed', 18], ['#fff', 10]],
  [['#fff', 6], ['#60f2ff', 26]],
  [['#8ecaed', 12], ['#fff', 30]],
  [['#fff', 20], ['#60f2ff', 12]],
  [['#60f2ff', 16], ['#fff', 8], ['#8ecaed', 14]],
  [['#fff', 28]],
  [['#8ecaed', 10], ['#fff', 20], ['#60f2ff', 8]],
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

export default Install;
