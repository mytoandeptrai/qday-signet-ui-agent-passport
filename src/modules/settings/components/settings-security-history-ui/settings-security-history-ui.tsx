import { useTranslation } from '@/integrations/i18n';
import { shortAddress, timeAgo } from '@/lib/format';
import type { SecurityEvent } from '@/types/passport';

interface SettingsSecurityHistoryUiProps {
  events: SecurityEvent[];
}

const formatDetail = (detail: string) => (detail.startsWith('0x') && detail.length > 20 ? shortAddress(detail) : detail);

const SettingsSecurityHistoryUi = ({ events }: SettingsSecurityHistoryUiProps) => {
  const { t } = useTranslation('settings-page');
  return (
    <>
      <h2 className='mb-3 text-body font-medium'>{t('security.title')}</h2>
      {events.length === 0 ? (
        <p className='text-body text-muted-foreground'>{t('security.empty')}</p>
      ) : (
        <ul className='divide-y rounded-md border'>
          {events.map((event) => (
            <li key={event.id} className='flex items-center justify-between gap-4 px-5 py-3 text-body'>
              <div className='min-w-0'>
                <div>{t(`security.events.${event.type}`)}</div>
                <div className='truncate text-caption text-muted-foreground'>{formatDetail(event.detail)}</div>
              </div>
              <span className='shrink-0 text-small text-muted-foreground'>{timeAgo(event.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SettingsSecurityHistoryUi;
