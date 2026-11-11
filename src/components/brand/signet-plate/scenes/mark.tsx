import { VIEW_BOX } from '../signet-plate.constants';

/** The Signet ring and mark, scaled to a 15-unit radius. */
const Mark = () => {
  return (
    <g>
      <circle cx='50' cy='50' r='15' fill='#fff' fillOpacity='.1' />
      <circle cx='50' cy='50' r='15' stroke='#fff' strokeWidth='1.6' strokeLinecap='round' strokeDasharray='94.3' style={{ ...VIEW_BOX, strokeDashoffset: 'calc((1 - var(--p)) * 94px)', transform: 'rotate(-90deg)' }} />
      <path d='M42.7 45.6 47.4 53.9H56.9L52.2 45.6Z' fill='#fff' style={{ ...VIEW_BOX, transform: 'scale(calc(0.7 + var(--p) * 0.3))' }} />
    </g>
  );
}

export default Mark;
