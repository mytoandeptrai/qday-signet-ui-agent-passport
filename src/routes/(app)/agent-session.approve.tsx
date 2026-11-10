import { SpendBar } from '@/components/app/spend-bar';
import { Button } from '@/components/ui/button';
import { money } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const search = z.object({
  task: z.string().catch('Team dinner for 12'),
  agent: z.string().catch('Claude Code'),
  limit: z.coerce.number().positive().catch(20),
  perCall: z.coerce.number().positive().catch(5),
  hours: z.coerce.number().positive().catch(8),
});

export const Route = createFileRoute('/(app)/agent-session/approve')({ validateSearch: search, component: Approve });

function Approve() {
  const p = Route.useSearch();
  const navigate = useNavigate();
  const { balance, createSession } = usePassportStore();
  const short = p.limit > balance.available;

  return (
    <div className='mx-auto max-w-[440px] rounded-md border p-6 shadow-[0_12px_40px_rgba(18,17,16,.10)]'>
      <div className='text-small text-muted-foreground'>{p.agent} is asking to spend</div>
      <h1 className='mt-1 text-lead font-medium'>{p.task}</h1>
      <div className='my-5'><SpendBar spent={0} limit={p.limit} perCall={p.perCall} /></div>
      <p className='text-body text-muted-foreground'>Expires after {p.hours} hours. You can revoke it at any time.</p>
      {short && <p role='alert' className='mt-3 text-body text-danger'>You have {money(balance.available)} available. Deposit funds first.</p>}
      <div className='mt-6 flex gap-2'>
        <Button
          className='flex-1 rounded-none'
          disabled={short}
          onClick={() => {
            const s = createSession({ task: p.task, agent: p.agent, limit: p.limit, perCallLimit: Math.min(p.perCall, p.limit), durationHours: p.hours });
            toast.success('Session approved');
            navigate({ to: '/sessions/$sessionId', params: { sessionId: s.id } });
          }}
        >
          Approve
        </Button>
        <Button variant='outline' className='flex-1 rounded-none' onClick={() => { toast('Request declined'); navigate({ to: '/overview' }); }}>Decline</Button>
      </div>
    </div>
  );
}
