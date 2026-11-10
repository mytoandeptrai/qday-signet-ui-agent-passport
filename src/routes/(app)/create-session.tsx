import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { money } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createFileRoute('/(app)/create-session')({
  validateSearch: z.object({ task: z.string().optional().catch(undefined) }),
  component: CreateSession,
});

const AGENTS = ['Claude Code', 'Codex', 'Custom agent'];

function CreateSession() {
  const navigate = useNavigate();
  const { task: presetTask } = Route.useSearch();
  const settings = usePassportStore((s) => s.settings);
  const available = usePassportStore((s) => s.balance.available);
  const createSession = usePassportStore((s) => s.createSession);

  const schema = z
    .object({
      task: z.string().trim().min(3, 'Describe the job in a few words').max(80, 'Keep it under 80 characters'),
      agent: z.string().min(1),
      limit: z.coerce.number('Enter an amount').positive('Must be more than $0').max(available, `You only have ${money(available)} available`),
      perCallLimit: z.coerce.number('Enter an amount').positive('Must be more than $0'),
      durationHours: z.coerce.number().int().min(1).max(168),
    })
    .refine((v) => v.perCallLimit <= v.limit, { path: ['perCallLimit'], message: 'Per-call limit cannot exceed the session limit' });

  type Input = z.input<typeof schema>;
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Input, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { task: presetTask ?? '', agent: AGENTS[0], limit: settings.defaultLimit, perCallLimit: settings.defaultPerCallLimit, durationHours: 8 },
  });

  const onSubmit = async (v: z.output<typeof schema>) => {
    await new Promise((r) => setTimeout(r, 500));
    const s = createSession(v);
    toast.success('Session created', { description: `${money(v.limit)} held for ${v.agent}.` });
    navigate({ to: '/sessions/$sessionId', params: { sessionId: s.id } });
  };

  const err = (k: keyof Input) => errors[k] && <p role='alert' className='mt-1.5 text-body text-danger'>{errors[k]?.message as string}</p>;

  return (
    <div className='max-w-xl'>
      <PageHeader title='New session' description='A session is one job with a hard spending cap. Your agent cannot spend past it.' />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-6'>
        <div><Label htmlFor='task' className='mb-2'>Task</Label><Input id='task' placeholder='Team dinner for 12' {...register('task')} />{err('task')}</div>
        <div>
          <Label className='mb-2'>Agent</Label>
          <Controller control={control} name='agent' render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className='w-full' aria-label='Agent'><SelectValue /></SelectTrigger>
              <SelectContent>{AGENTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          )} />
        </div>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div><Label htmlFor='limit' className='mb-2'>Session limit (USD)</Label><Input id='limit' inputMode='decimal' {...register('limit')} />{err('limit')}</div>
          <div><Label htmlFor='perCall' className='mb-2'>Per-call limit (USD)</Label><Input id='perCall' inputMode='decimal' {...register('perCallLimit')} />{err('perCallLimit')}</div>
        </div>
        <div><Label htmlFor='hours' className='mb-2'>Expires after (hours)</Label><Input id='hours' inputMode='numeric' {...register('durationHours')} />{err('durationHours')}</div>
        <p className='text-body text-muted-foreground'>Available balance: <b className='font-medium text-foreground'>{money(available)}</b></p>
        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create session'}</Button>
      </form>
    </div>
  );
}
