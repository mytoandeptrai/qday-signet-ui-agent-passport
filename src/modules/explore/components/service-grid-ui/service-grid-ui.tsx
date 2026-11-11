import type { Service } from '@/apis/services';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

type ServiceGridUiProps = {
  services: Service[];
  isFetching: boolean;
  query: string;
  onPick: (service: Service) => void;
};

const ServiceGridUi = ({ services, isFetching, query, onPick }: ServiceGridUiProps) => {
  const { t } = useTranslation('explore-page');

  return (
    <>
      <div className={cn('mt-8 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3', isFetching && 'opacity-70')}>
        {services.map((s) => (
          <button
            key={s.id}
            type='button'
            onClick={() => onPick(s)}
            className='bg-background p-5 text-left transition-colors hover:bg-subtle'
          >
            <div className='flex items-baseline justify-between gap-3'>
              <b className='font-display text-title leading-tight font-semibold'>{s.name}</b>
              <span className='text-body tabular-nums text-text-3'>{s.priceLabel}</span>
            </div>
            <p className='mt-2 text-sm text-muted-foreground'>{s.description}</p>
            <div className='mt-3 text-xs text-text-3'>
              {s.category} · {s.provider}
            </div>
          </button>
        ))}
      </div>
      <Show when={services.length === 0}>
        <p className='py-16 text-center text-muted-foreground'>{t('empty', { query })}</p>
      </Show>
    </>
  );
};

export default ServiceGridUi;
