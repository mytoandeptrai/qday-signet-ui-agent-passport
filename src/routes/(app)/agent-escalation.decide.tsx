import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { money, timeAgo } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createFileRoute('/(app)/agent-escalation/decide')({
  validateSearch: z.object({ id: z.string().catch('esc_01') }),
  component: Decide,
});

function Decide() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const esc = usePassportStore((s) => s.escalations.find((e) => e.id === id));
  const decide = usePassportStore((s) => s.decideEscalation);

  if (!esc) return <p className='text-center text-muted-foreground'>That request no longer exists. <Link to='/overview' className='underline'>Back to overview</Link></p>;
  const done = esc.status !== 'pending';

  return (
    <div className='mx-auto max-w-[440px] rounded-md border p-6 shadow-[0_12px_40px_rgba(27,30,36,.10)]'>
      <div className='flex items-center justify-between'><span className='text-small text-muted-foreground'>Over your limit · {timeAgo(esc.requestedAt)}</span><StatusBadge status={esc.status} /></div>
      <h1 className='mt-3 text-lead font-medium'>{esc.agent} wants {money(esc.amount)}</h1>
      <p className='mt-2 text-body text-muted-foreground'>{esc.service}: {esc.description}. This is past the limit you set, so it was stopped until you decide.</p>
      <div className='mt-6 flex gap-2'>
        <Button className='flex-1' disabled={done} onClick={() => { decide(esc.id, true); toast.success('Approved once'); navigate({ to: '/overview' }); }}>Approve once</Button>
        <Button variant='outline' className='flex-1' disabled={done} onClick={() => { decide(esc.id, false); toast('Declined'); navigate({ to: '/overview' }); }}>Decline</Button>
      </div>
    </div>
  );
}
