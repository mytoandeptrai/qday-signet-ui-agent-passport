import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

const TONE: Record<string, string> = {
  active: 'text-success border-success/30 bg-success/5',
  settled: 'text-success border-success/30 bg-success/5',
  completed: 'text-success border-success/30 bg-success/5',
  approved: 'text-success border-success/30 bg-success/5',
  redeemed: 'text-muted-foreground border-border bg-subtle',
  unused: 'text-brand border-brand/30 bg-brand/5',
  pending: 'text-brand border-brand/30 bg-brand/5',
  blocked: 'text-danger border-danger/30 bg-danger/5',
  revoked: 'text-danger border-danger/30 bg-danger/5',
  declined: 'text-danger border-danger/30 bg-danger/5',
  failed: 'text-danger border-danger/30 bg-danger/5',
  expired: 'text-muted-foreground border-border bg-subtle',
};

export const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-caption font-medium', TONE[status] ?? TONE.expired)}>{t(`status.${status}`, { defaultValue: status })}</span>;
};
