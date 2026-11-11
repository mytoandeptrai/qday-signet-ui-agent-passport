import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/integrations/i18n';
import { HOW_STEPS, PLATE_IMAGES } from '@/mock/landing';

export const useHowContainer = () => {
  const { t } = useTranslation('landing-page');
  const [isAsked, setIsAsked] = useState(false);
  const titles = t('how.steps', { returnObjects: true }) as string[];

  const onAsk = () => {
    setIsAsked(true);
    toast(t('how.job-toast'));
  };

  return {
    t,
    isAsked,
    steps: HOW_STEPS.map((s, i) => ({ ...s, title: titles[i], plateSrc: PLATE_IMAGES.how[i] || undefined })),
    onAsk,
  };
};
