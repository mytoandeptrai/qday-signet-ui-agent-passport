import { money, timeAgo } from '@/lib/format';
import type { ActivityItem } from '@/types/passport';

type OverviewActivityUiProps = {
  items: ActivityItem[];
};

const OverviewActivityUi = ({ items }: OverviewActivityUiProps) => {
  return (
    <ul className='divide-y rounded-md border'>
      {items.map((a) => (
        <li key={a.id} className='grid grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-3 text-body'>
          <div className='min-w-0'>
            <div className='truncate'>
              {a.service} <span className='text-muted-foreground'>· {a.description}</span>
            </div>
            <div className={a.status === 'blocked' ? 'text-caption text-danger' : 'text-caption text-text-3'}>
              {a.status === 'blocked' ? a.reason : timeAgo(a.createdAt)}
            </div>
          </div>
          <span className={a.status === 'blocked' ? 'text-text-3 line-through tabular-nums' : 'tabular-nums'}>{money(a.amount)}</span>
        </li>
      ))}
    </ul>
  );
};

export default OverviewActivityUi;
