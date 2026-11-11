import { useNavigate } from '@tanstack/react-router';
import { useGetActivityList } from '@/apis/activity';
import { useGetEscalationList } from '@/apis/escalations';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

export const useAppHeaderNotifications = () => {
  const { t } = useTranslation('layout');
  const navigate = useNavigate();
  const { data: escalations = [] } = useGetEscalationList();
  const { data: activity = [] } = useGetActivityList();

  const pending = escalations.filter((e) => e.status === 'pending');
  const notifications = [
    ...pending.map((e) => ({
      id: e.id,
      text: t('notifications.escalation', { agent: e.agent, amount: money(e.amount), service: e.service }),
      at: e.requestedAt,
      to: `${ROUTES.DECIDE}?id=${e.id}`,
    })),
    ...activity
      .filter((a) => a.status === 'blocked')
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        text: t('notifications.blocked', { service: a.service, amount: money(a.amount), reason: a.reason }),
        at: a.createdAt,
        to: ROUTES.ACTIVITY,
      })),
  ];

  const onSelect = (to: string) => navigate({ to });

  return { notifications, hasPending: pending.length > 0, onSelect };
};
