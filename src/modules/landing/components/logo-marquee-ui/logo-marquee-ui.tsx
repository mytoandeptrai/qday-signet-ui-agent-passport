import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { PARTNERS } from '@/mock/landing';

const LogoRow = ({ isHidden }: { isHidden?: boolean }) => (
  <ul aria-hidden={isHidden} className='flex items-center gap-11 px-8 md:gap-16'>
    {PARTNERS.map((p) => (
      <li
        key={p}
        className={cn(
          'text-lead font-medium tracking-tight whitespace-nowrap text-text-3 md:text-lg',
          p === 'x402' && 'font-mono font-normal'
        )}
      >
        {p}
      </li>
    ))}
  </ul>
);

const LogoMarqueeUi = () => {
  const { t } = useTranslation('landing-page');

  return (
    <section aria-label={t('marquee.label')} className='relative z-4 pt-8 pb-10 md:pt-11 md:pb-13'>
      <p className='mb-5.5 text-center text-body text-text-3'>{t('marquee.title')}</p>
      <div className='group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]'>
        <div className='flex w-max animate-[marquee_70s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none'>
          <LogoRow />
          <LogoRow isHidden />
        </div>
      </div>
    </section>
  );
};

export default LogoMarqueeUi;
