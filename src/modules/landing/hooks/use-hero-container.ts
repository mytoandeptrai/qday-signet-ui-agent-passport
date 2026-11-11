import { useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { useTranslation } from '@/integrations/i18n';
import { LANDING_LIGHT, PLATE_IMAGES } from '@/mock/landing';
import { HERO_PIN_LENGTH } from '../utils';

export const useHeroContainer = () => {
  const { t } = useTranslation('landing-page');
  const track = useRef<HTMLDivElement>(null);
  const isWide = useMediaQuery('(min-width: 1024px)');
  const progress = useScrollProgress(track, HERO_PIN_LENGTH, isWide);
  const sun = isWide ? 0.08 + 0.84 * (1 - (1 - progress) ** 2) : 0.8;
  const rise = Math.min(1, Math.max(0, (progress - 0.55) / 0.45));

  return {
    t,
    track,
    isWide,
    sun,
    rise,
    spill: LANDING_LIGHT.spill,
    plateSrc: PLATE_IMAGES.hero || undefined,
    words: t('hero.words', { returnObjects: true }) as string[],
  };
};
