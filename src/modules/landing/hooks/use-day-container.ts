import { useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { useTranslation } from '@/integrations/i18n';
import { DAY_MOMENTS } from '@/mock/landing';

export const useDayContainer = () => {
  const { t } = useTranslation('landing-page');
  const track = useRef<HTMLDivElement>(null);
  const isWide = useMediaQuery('(min-width: 901px)');
  const total = DAY_MOMENTS.length;
  const length = typeof window === 'undefined' ? 1000 : window.innerHeight * 0.7 * total;
  const progress = useScrollProgress(track, length, true);
  const now = Math.min(total - 1, Math.floor(progress * total));
  const visible = DAY_MOMENTS.slice(0, now + 1);
  const texts = t('day.moments', { returnObjects: true }) as string[];

  return {
    t,
    track,
    isWide,
    total,
    now,
    line: Math.min(1, (progress * total) / (total - 1)),
    spent: visible.reduce((n, m) => n + (m.stopped ? 0 : (m.amount ?? 0)), 0),
    stoppedCount: visible.filter((m) => m.stopped).length,
    moments: DAY_MOMENTS.map((m, i) => ({ ...m, text: texts[i] })),
  };
};
