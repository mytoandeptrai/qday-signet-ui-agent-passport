import { SpendBar } from '@/components/app/spend-bar';
import { StatusBadge } from '@/components/app/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { money, shortAddress, timeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import { INSTALL_PROMPT } from '@/mock/landing';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Check, ChevronUp, Circle, Copy, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/overview')({ component: Overview });

const IDEAS: { id: string; title: string }[] = [
  { id: 'learn', title: 'Learn about your Signet' },
  { id: 'purchases', title: 'Turn recommendations into purchases' },
  { id: 'cloud', title: 'Cloud queries and paid data' },
  { id: 'apartments', title: 'Automate apartment hunting' },
  { id: 'candidates', title: 'Find candidates for a role' },
  { id: 'onboarding', title: 'Automate new hire onboarding' },
];

const WINDOWS_PROMPT = INSTALL_PROMPT.replace('curl -fsSL https://signet.example/install.sh | bash', 'irm https://signet.example/install.ps1 | iex');

function Overview() {
  const { user, balance, sessions, activity, escalations, revokeSession, settings, onboarding, updateSettings, completeOnboarding, addPasskey } = usePassportStore();
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [windows, setWindows] = useState(false);
  const [limit, setLimit] = useState(String(settings.defaultLimit));
  const [perCall, setPerCall] = useState(String(settings.defaultPerCallLimit));
  const [limitError, setLimitError] = useState('');
  const active = sessions.filter((s) => s.status === 'active');
  const pending = escalations.filter((e) => e.status === 'pending');
  const target = sessions.find((s) => s.id === revokeId);
  const activeLimit = active.reduce((n, s) => n + s.limit, 0);
  const activeSpent = active.reduce((n, s) => n + s.spent, 0);

  const steps = [
    { label: 'Connect your agent', done: onboarding.connected },
    { label: 'Secure with passkey', done: (user?.passkeys.length ?? 0) > 0 },
    { label: 'Set your allowance', done: onboarding.allowance },
    { label: 'Add funds', done: balance.available > 0 },
    { label: 'Learn Signet', done: true },
  ];

  const copyPrompt = () => {
    navigator.clipboard?.writeText(windows ? WINDOWS_PROMPT : INSTALL_PROMPT).catch(() => undefined);
    completeOnboarding('connected');
    toast.success('Copied. Paste it into your agent.');
  };

  const saveAllowance = () => {
    const l = Number(limit);
    const c = Number(perCall);
    if (!(l > 0) || !(c > 0)) return setLimitError('Enter amounts above $0');
    if (c > l) return setLimitError('The per-call limit cannot exceed the allowance');
    setLimitError('');
    updateSettings({ defaultLimit: l, defaultPerCallLimit: c });
    completeOnboarding('allowance');
    toast.success('Allowance saved');
  };

  return (
    <>
      <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14'>
        <div className='min-w-0'>
          {pending.map((e) => (
            <div key={e.id} className='mb-8 flex flex-wrap items-center justify-between gap-3 border border-brand/40 bg-brand/5 px-5 py-4'>
              <div className='text-body'>
                <b className='font-medium'>{e.agent}</b> wants to spend <b className='font-medium'>{money(e.amount)}</b> on {e.service}: {e.description}.
                <span className='ml-2 text-muted-foreground'>{timeAgo(e.requestedAt)}</span>
              </div>
              <Button asChild size='sm' variant='outline'><Link to='/agent-escalation/decide' search={{ id: e.id }}>Review</Link></Button>
            </div>
          ))}

          <div className='flex items-baseline justify-between'>
            <h2 className='text-body text-muted-foreground'>Signet in action</h2>
            <Link to='/create-session' className='flex items-center gap-1.5 text-body text-muted-foreground hover:text-foreground'>New session →</Link>
          </div>
          <div className='mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2'>
            {IDEAS.map((i) => (
              <Link key={i.id} to='/playground' search={{ idea: i.id }} className='group flex items-center gap-4 py-2'>
                <img src={`/images/ideas/${i.id}.svg`} alt='' className='size-12 shrink-0 rounded-[14px]' />
                <span className='text-lead leading-[1.35] group-hover:underline'>{i.title}</span>
              </Link>
            ))}
          </div>

          <div className='mt-10 border-t pt-8'>
            <div className='grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]'>
              <h2 className='text-body text-muted-foreground'>Get started</h2>
              <div className='flex items-start justify-between'>
                <span className='text-body text-muted-foreground'>{['Paste this into your coding agent.', 'Passkeys protect your approvals.', 'Choose how much your agents can spend.', 'Fund your balance.', 'What to try next.'][step]}</span>
                <button type='button' aria-label={open ? 'Collapse' : 'Expand'} onClick={() => setOpen((o) => !o)}><ChevronUp className={cn('size-5 text-muted-foreground transition-transform', !open && 'rotate-180')} /></button>
              </div>
            </div>
            {open && (
              <div className='mt-4 grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]'>
                <ol className='space-y-1'>
                  {steps.map((s, i) => (
                    <li key={s.label}>
                      <button type='button' onClick={() => setStep(i)} className={cn('flex w-full items-center gap-4 py-2 text-left text-body', i === step ? 'text-foreground' : 'text-muted-foreground')}>
                        {s.done ? <span className='grid size-5 place-items-center rounded-full bg-success text-white'><Check className='size-3' strokeWidth={3} /></span> : <Circle className='size-5' strokeWidth={1.3} />}
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ol>
                <div>
                  {step === 0 && (
                    <>
                      <div className='relative rounded-md border bg-background/70 p-5 pr-14'>
                        <p className='font-mono text-small leading-[1.65]'>{windows ? WINDOWS_PROMPT : INSTALL_PROMPT}</p>
                        <button type='button' aria-label='Copy the install prompt' onClick={copyPrompt} className='absolute top-4 right-4 text-muted-foreground hover:text-foreground'><Copy className='size-5' /></button>
                      </div>
                      <button type='button' onClick={() => setWindows((w) => !w)} className='mt-3 text-body text-muted-foreground underline underline-offset-4'>{windows ? 'On macOS or Linux?' : 'On Windows?'}</button>
                    </>
                  )}
                  {step === 1 && (
                    <div className='max-w-md text-body text-muted-foreground'>
                      <p>{(user?.passkeys.length ?? 0) > 0 ? `You have ${user?.passkeys.length} passkey${user?.passkeys.length === 1 ? '' : 's'} on this account.` : 'Add a passkey to approve spending with your fingerprint or face.'}</p>
                      <Button className='mt-4' variant='outline' onClick={() => { addPasskey(`Device ${(user?.passkeys.length ?? 0) + 1}`); toast.success('Passkey added'); }}>Add a passkey</Button>
                    </div>
                  )}
                  {step === 2 && (
                    <div className='max-w-md space-y-4'>
                      <div><label htmlFor='allow' className='mb-2 block text-body'>Allowance per session (USD)</label><Input id='allow' inputMode='decimal' value={limit} onChange={(e) => setLimit(e.target.value)} /></div>
                      <div><label htmlFor='percall' className='mb-2 block text-body'>Per-call limit (USD)</label><Input id='percall' inputMode='decimal' value={perCall} onChange={(e) => setPerCall(e.target.value)} /></div>
                      {limitError && <p role='alert' className='text-body text-danger'>{limitError}</p>}
                      <Button onClick={saveAllowance}>Save allowance</Button>
                    </div>
                  )}
                  {step === 3 && (
                    <div className='max-w-md text-body text-muted-foreground'>
                      <p>Your balance is {money(balance.available)}. Add more any time, by card, bank or crypto.</p>
                      <Button asChild className='mt-4' variant='outline'><Link to='/deposit'>Add funds</Link></Button>
                    </div>
                  )}
                  {step === 4 && (
                    <ul className='max-w-md list-disc space-y-2 pl-5 text-body text-muted-foreground'>
                      <li>A session is one job with a hard cap.</li>
                      <li>Payments over your limit are stopped, then wait for you.</li>
                      <li>Revoke a session at any time and the rest returns to your balance.</li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside>
          <div className='text-body text-muted-foreground'>Balance</div>
          <div className='mt-1.5 font-display text-figure leading-none font-semibold tabular-nums'>{money(balance.available)}</div>
          <div className='mt-5 flex gap-2'>
            <Button asChild variant='outline' className='flex-1'><Link to='/deposit'>Add funds</Link></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='px-4'><Wallet className='size-4' strokeWidth={1.4} /> Wallet</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-64'>
                <DropdownMenuLabel>Your wallet</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => { navigator.clipboard?.writeText(user?.walletAddress ?? '').catch(() => undefined); toast.success('Address copied'); }}>
                  <span className='font-mono text-caption'>{user && shortAddress(user.walletAddress)}</span><Copy className='ml-auto size-4' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='mt-10 flex items-baseline justify-between text-body'>
            <span>Allowance</span>
            <button type='button' className='text-body text-muted-foreground hover:text-foreground' onClick={() => { setStep(2); setOpen(true); }}>{onboarding.allowance ? 'Edit' : 'Set up'}</button>
          </div>
          <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-border'><i className='block h-full rounded-full bg-brand transition-[width] duration-500' style={{ width: `${activeLimit ? Math.min(100, (activeSpent / activeLimit) * 100) : 0}%` }} /></div>
          <div className='mt-2 flex justify-between text-small text-muted-foreground tabular-nums'>
            <span>{money(activeSpent)} spent</span><span>{money(activeLimit)} held · ${settings.defaultLimit} default</span>
          </div>
        </aside>
      </div>

      <section className='mt-16 max-w-[1000px]'>
        <div className='mb-4 flex items-baseline justify-between'>
          <h2 className='text-body font-medium'>Sessions</h2>
          <Link to='/create-session' className='text-small text-muted-foreground hover:text-foreground'>New session →</Link>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          {sessions.slice(0, 4).map((s) => (
            <div key={s.id} className='rounded-md border p-5'>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                  <Link to='/sessions/$sessionId' params={{ sessionId: s.id }} className='text-base font-medium hover:underline'>{s.task}</Link>
                  <div className='mt-1 text-caption text-muted-foreground'>{s.agent} · {timeAgo(s.createdAt)}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <SpendBar spent={s.spent} limit={s.limit} perCall={s.perCallLimit} />
              {s.status === 'active' && (
                <button type='button' onClick={() => setRevokeId(s.id)} className='mt-4 text-small font-medium text-muted-foreground hover:text-danger'>Revoke</button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className='mt-12 max-w-[1000px]'>
        <div className='mb-4 flex items-baseline justify-between'>
          <h2 className='text-body font-medium'>Recent activity</h2>
          <Link to='/activity' className='text-small text-muted-foreground hover:text-foreground'>See all →</Link>
        </div>
        <ul className='divide-y rounded-md border'>
          {activity.slice(0, 5).map((a) => (
            <li key={a.id} className='grid grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-3 text-body'>
              <div className='min-w-0'>
                <div className='truncate'>{a.service} <span className='text-muted-foreground'>· {a.description}</span></div>
                <div className={a.status === 'blocked' ? 'text-caption text-danger' : 'text-caption text-text-3'}>{a.status === 'blocked' ? a.reason : timeAgo(a.createdAt)}</div>
              </div>
              <span className={a.status === 'blocked' ? 'text-text-3 line-through tabular-nums' : 'tabular-nums'}>{money(a.amount)}</span>
            </li>
          ))}
        </ul>
      </section>

      <AlertDialog open={Boolean(target)} onOpenChange={(o) => !o && setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke “{target?.task}”?</AlertDialogTitle>
            <AlertDialogDescription>The agent can no longer spend in this session. {target && money(target.limit - target.spent)} returns to your balance.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep session</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!target) return;
                revokeSession(target.id);
                toast.success('Session revoked');
              }}
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
