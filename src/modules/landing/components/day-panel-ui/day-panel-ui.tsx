import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import type { LandingMoment } from '@/types/passport';
import { DAY_BUDGET, DAY_LATTICE, formatUsd } from '../../utils';

type DayPanelUiProps = {
  moments: LandingMoment[];
  now: number;
  line: number;
  spent: number;
  stoppedCount: number;
  isWide: boolean;
};

const DayPanelUi = ({ moments, now, line, spent, stoppedCount, isWide }: DayPanelUiProps) => {
  const { t } = useTranslation('landing-page');

  return (
    <div
      role='img'
      aria-label={t('day.label')}
      className='relative mt-12 aspect-[.9] overflow-hidden rounded-3xl bg-[#06343a] text-[#f4f7f8] md:aspect-[2.5]'
      style={{
        backgroundImage: `radial-gradient(70% 90% at 12% 0%, rgba(96,242,255,.3), transparent 70%), radial-gradient(60% 70% at 100% 100%, rgba(0,154,165,.35), transparent 70%), ${DAY_LATTICE}`,
      }}
    >
      <div className='absolute inset-x-7 top-7 max-md:inset-x-5 max-md:top-5'>
        <div className='flex items-end justify-between gap-4'>
          <div>
            <div className='text-body text-[#f4f7f8]/70'>{t('day.spent-today')}</div>
            <div className='mt-1 font-display text-[clamp(30px,3.4vw,48px)] leading-none font-semibold tabular-nums'>
              {formatUsd(spent)}
              <span className='ml-2 text-lead font-normal text-[#f4f7f8]/60'>{t('day.budget', { amount: DAY_BUDGET })}</span>
            </div>
          </div>
          <div
            className={cn(
              'rounded-full border px-3 py-1 text-body transition-colors duration-500',
              stoppedCount ? 'border-[#f0ada7]/60 bg-[#f0ada7]/15 text-[#f0ada7]' : 'border-white/20 text-[#f4f7f8]/70'
            )}
          >
            {stoppedCount ? t('day.stopped-count', { count: stoppedCount }) : t('day.within-limits')}
          </div>
        </div>
        <div className='mt-5 h-1.5 overflow-hidden rounded-full bg-white/15'>
          <div
            className='h-full origin-left rounded-full bg-gradient-to-r from-[#009aa5] to-[#60f2ff] transition-transform duration-500 ease-out'
            style={{ transform: `scaleX(${spent / DAY_BUDGET})` }}
          />
        </div>
      </div>

      <div className='absolute inset-x-7 bottom-7 max-md:inset-x-5 max-md:bottom-5'>
        {isWide && (
          <div className='pointer-events-none absolute top-1.25 left-0 h-px w-[calc(83.333%+20px)] bg-white/20'>
            <div className='h-full origin-left bg-[#60f2ff] will-change-transform' style={{ transform: `scaleX(${line})` }} />
          </div>
        )}
        <ol className='grid grid-cols-6 gap-6 max-[900px]:grid-cols-1'>
          {moments.map((m, i) => (
            <li
              key={m.time}
              className={cn(
                'relative pt-6 transition-opacity duration-500',
                i === now ? 'opacity-100' : i < now ? 'opacity-75' : 'opacity-40',
                !isWide && i !== now && 'hidden'
              )}
            >
              {isWide && (
                <span
                  className={cn(
                    'absolute top-0 left-0 size-2.75 rounded-full transition-all duration-500',
                    i > now ? 'bg-white/30' : m.stopped ? 'bg-[#f0ada7]' : 'bg-[#60f2ff]',
                    i === now && 'scale-125 shadow-[0_0_0_6px_rgba(96,242,255,.2)]',
                    i === now && m.stopped && 'shadow-[0_0_0_6px_rgba(240,173,167,.25)]'
                  )}
                />
              )}
              <div className='text-body tabular-nums text-[#f4f7f8]/70'>{m.time}</div>
              <div className='mt-1.5 font-display text-lg leading-snug md:text-xl'>{m.text}</div>
              <div className={cn('mt-2 text-body', m.stopped ? 'text-[#f0ada7]' : 'text-[#60f2ff]')}>
                {m.stopped
                  ? t('day.stopped-line', { amount: m.amount?.toFixed(2) })
                  : t('day.paid-line', { service: m.service, amount: m.amount?.toFixed(2) })}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default DayPanelUi;
