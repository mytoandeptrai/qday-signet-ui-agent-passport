import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import type { ActivityItem } from '@/types/passport';

type SessionDetailActivityUiProps = {
  items: ActivityItem[];
};

const SessionDetailActivityUi = ({ items }: SessionDetailActivityUiProps) => {
  const { t } = useTranslation('session-detail-page');
  return (
    <section>
      <h2 className='mb-3 text-body font-medium'>{t('activity.title')}</h2>
      <ul className='divide-y rounded-md border'>
        {items.map((a) => (
          <li key={a.id} className='grid grid-cols-[1fr_auto] gap-x-4 px-5 py-3 text-body'>
            <div>
              <div>{a.service}</div>
              <div className={a.status === 'blocked' ? 'text-caption text-danger' : 'text-caption text-text-3'}>
                {a.status === 'blocked' ? a.reason : a.description}
              </div>
            </div>
            <span className={a.status === 'blocked' ? 'text-text-3 line-through tabular-nums' : 'tabular-nums'}>{money(a.amount)}</span>
          </li>
        ))}
        {items.length === 0 && <li className='px-5 py-10 text-center text-body text-muted-foreground'>{t('activity.empty')}</li>}
      </ul>
    </section>
  );
};

export default SessionDetailActivityUi;
