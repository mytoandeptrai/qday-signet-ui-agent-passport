import { type RefObject, useEffect, useState } from 'react';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Progress (0..1) through a tall track while its sticky child is pinned.
 * `length` is how many px of scrolling map to the full range; the value eases toward the target.
 */
export function useScrollProgress(track: RefObject<HTMLElement | null>, length: number, enabled = true) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      return;
    }
    let target = 0;
    let shown = 0;
    let raf = 0;
    const read = () => {
      const el = track.current;
      if (!el) return;
      target = clamp01((window.scrollY - (el.offsetTop - 0)) / length);
      kick();
    };
    const tick = () => {
      raf = 0;
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.001) shown = target;
      setProgress(shown);
      if (shown !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      cancelAnimationFrame(raf);
    };
  }, [track, length, enabled]);

  return progress;
}
