import { useTranslation } from '@/integrations/i18n';

type SessionDetailServicesUiProps = {
  services: string[];
};

const SessionDetailServicesUi = ({ services }: SessionDetailServicesUiProps) => {
  const { t } = useTranslation('session-detail-page');
  return (
    <div className='rounded-md border p-5'>
      <div className='mb-3 text-body font-medium'>{t('services.title')}</div>
      {services.length ? (
        <div className='flex flex-wrap gap-1.5'>
          {services.map((s) => (
            <span key={s} className='border px-2 py-1 text-caption'>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className='text-body text-muted-foreground'>{t('services.any')}</p>
      )}
    </div>
  );
};

export default SessionDetailServicesUi;
