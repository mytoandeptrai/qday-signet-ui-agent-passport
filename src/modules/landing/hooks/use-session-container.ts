import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/integrations/i18n';
import { PLATE_IMAGES, SESSION_CARD } from '@/mock/landing';

export const useSessionContainer = () => {
  const { t } = useTranslation('landing-page');
  const cardRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [isRevoked, setIsRevoked] = useState(false);
  const { rows, limit, perCall } = SESSION_CARD;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timers = rows.map((_, i) => window.setTimeout(() => setShown(i + 1), 500 + i * 750));
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [rows]);

  const onRevoke = () => {
    setIsRevoked(true);
    toast(t('session.revoked-toast'));
  };

  return {
    t,
    cardRef,
    rows,
    limit,
    perCall,
    shown,
    spent: rows.slice(0, shown).reduce((s, r) => s + (r.stopped ? 0 : r.amount), 0),
    isRevoked,
    plateSrc: PLATE_IMAGES.session || undefined,
    points: t('session.points', { returnObjects: true }) as string[],
    onRevoke,
  };
};
