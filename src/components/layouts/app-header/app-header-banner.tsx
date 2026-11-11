import { ArrowRightIcon, WaypointsIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/integrations/i18n';

const AppHeaderBanner = () => {
  const { t } = useTranslation('layout');
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return <div className='flex-1' />;

  return (
    <div className='flex min-w-0 flex-1 items-center gap-3 rounded-md border bg-background/80 px-3.5 py-2 text-body md:max-w-[720px]'>
      <WaypointsIcon className='size-[18px] shrink-0 text-muted-foreground' strokeWidth={1.4} />
      <span className='min-w-0 flex-1 truncate'>{t('banner.text')}</span>
      <button
        type='button'
        onClick={() => toast(t('toasts.router-soon'))}
        className='hidden items-center gap-1.5 text-body text-muted-foreground hover:text-foreground sm:flex'
      >
        {t('banner.learn-more')} <ArrowRightIcon className='size-4' />
      </button>
      <button
        type='button'
        aria-label={t('banner.dismiss')}
        onClick={() => setIsOpen(false)}
        className='text-muted-foreground hover:text-foreground'
      >
        <XIcon className='size-5' />
      </button>
    </div>
  );
};

export default AppHeaderBanner;
