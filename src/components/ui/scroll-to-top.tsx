import { ArrowUpIcon } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

/** Floating button that appears after scrolling down and returns to the top of the page. */
const ScrollToTop = () => {
  const { t } = useTranslation('public-layout');
  const { visible, onScrollToTop } = useScrollToTop();
  return (
    <button
      type='button'
      aria-label={t('scroll-to-top')}
      onClick={onScrollToTop}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed right-4 bottom-20 z-40 grid size-11 place-items-center rounded-full border bg-card text-foreground shadow-elevated transition-all duration-200 hover:bg-subtle',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      )}
    >
      <ArrowUpIcon className='size-5' strokeWidth={1.5} />
    </button>
  );
};

export default ScrollToTop;
