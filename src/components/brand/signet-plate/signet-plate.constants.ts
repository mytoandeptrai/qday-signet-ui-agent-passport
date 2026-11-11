import type { CSSProperties } from 'react';

export const BLUE = [
  'radial-gradient(55% 50% at 14% 8%, rgba(96,242,255,.45), transparent 70%)',
  'radial-gradient(50% 55% at 92% 12%, rgba(0,154,165,.75), transparent 70%)',
  'radial-gradient(70% 55% at 72% 102%, rgba(0,104,111,.7), transparent 70%)',
  'radial-gradient(60% 60% at 0% 100%, rgba(0,126,135,.85), transparent 70%)',
  'linear-gradient(160deg, #0a5058, #06343a)',
].join(',');
export const DEEP = 'radial-gradient(60% 80% at 50% 0%, rgba(96,242,255,.3), transparent 70%), radial-gradient(40% 60% at 100% 100%, rgba(0,154,165,.35), transparent 70%), linear-gradient(180deg, #06343a, #021417)';
export const GRAIN = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`;

export const css = (vars: Record<string, string | number>): CSSProperties => vars as CSSProperties;
export const SVG_BOX: CSSProperties = { transformBox: 'fill-box' };
export const VIEW_BOX: CSSProperties = { transformBox: 'view-box', transformOrigin: '50px 50px' };
export const ACCENT = '#60f2ff';
