import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { timeAgo } from '@/lib/format';
import type { Agent } from '@/types/passport';

interface AgentsListUiProps {
  title: string;
  empty: string;
  agents: Agent[];
  onApprove?: (id: string) => void;
  onRevoke?: (id: string) => void;
}

const AgentsListUi = ({ title, empty, agents, onApprove, onRevoke }: AgentsListUiProps) => {
  const { t } = useTranslation('agents-page');
  return (
    <section className='mt-8'>
      <h2 className='text-body font-medium'>{title}</h2>
      {agents.length === 0 ? (
        <p className='mt-3 text-body text-muted-foreground'>{empty}</p>
      ) : (
        <ul className='mt-3 divide-y rounded-md border'>
          {agents.map((agent) => (
            <li key={agent.id} className='flex items-center gap-3 px-4 py-3'>
              <div className='min-w-0 flex-1'>
                <p className='text-body font-medium'>{agent.name}</p>
                <p className='text-small text-muted-foreground'>
                  {agent.approvedAt
                    ? t('row.approved', { when: timeAgo(agent.approvedAt) })
                    : t('row.requested', { when: timeAgo(agent.requestedAt) })}
                </p>
              </div>
              <StatusBadge status={agent.status} />
              {onApprove && agent.status === 'pending' && (
                <Button size='sm' onClick={() => onApprove(agent.id)}>
                  {t('labels.approve')}
                </Button>
              )}
              {onRevoke && agent.status === 'active' && (
                <Button size='sm' variant='outline' onClick={() => onRevoke(agent.id)}>
                  {t('labels.revoke')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AgentsListUi;
