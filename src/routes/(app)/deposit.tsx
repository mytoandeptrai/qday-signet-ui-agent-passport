import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { money, timeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import { usePassportStore } from '@/stores/passport-store';
import type { DepositMethod } from '@/types/passport';
import { createFileRoute } from '@tanstack/react-router';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/deposit')({ component: Deposit });

const PRESETS = [25, 50, 100, 250];
const METHODS: { id: DepositMethod; label: string; note: string }[] = [
  { id: 'card', label: 'Card', note: 'Instant. 2.9% fee.' },
  { id: 'bank', label: 'Bank transfer', note: '1–2 business days. No fee.' },
  { id: 'crypto', label: 'Crypto', note: 'Send USDC to your Signet address.' },
];

function Deposit() {
  const { user, deposits, deposit } = usePassportStore();
  const [method, setMethod] = useState<DepositMethod>('card');
  const [amount, setAmount] = useState('50');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 5) return setError('The minimum deposit is $5.00');
    if (n > 10_000) return setError('The maximum deposit is $10,000.00');
    setError('');
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    deposit(n, method);
    setBusy(false);
    toast.success(`${money(n)} added to your balance`);
  };

  return (
    <div className='max-w-2xl'>
      <PageHeader title='Deposit' description='Add funds your agents can spend inside sessions.' />
      <Tabs value={method} onValueChange={(v) => setMethod(v as DepositMethod)}>
        <TabsList>{METHODS.map((m) => <TabsTrigger key={m.id} value={m.id}>{m.label}</TabsTrigger>)}</TabsList>
      </Tabs>
      <p className='mt-3 text-body text-muted-foreground'>{METHODS.find((m) => m.id === method)?.note}</p>

      {method === 'crypto' ? (
        <div className='mt-6 rounded-md border p-5'>
          <div className='text-small text-muted-foreground'>Your deposit address</div>
          <div className='mt-2 flex items-center gap-3'>
            <code className='min-w-0 flex-1 font-mono text-small break-all'>{user?.walletAddress}</code>
            <Button type='button' size='sm' variant='outline' onClick={() => { navigator.clipboard?.writeText(user?.walletAddress ?? '').catch(() => undefined); toast.success('Address copied'); }}><Copy /> Copy</Button>
          </div>
          <p className='mt-3 text-caption text-text-3'>Deposits appear after 12 confirmations. Only send USDC.</p>
        </div>
      ) : (
        <form onSubmit={submit} className='mt-6' noValidate>
          <Label htmlFor='amount' className='mb-2'>Amount (USD)</Label>
          <div className='mb-3 flex gap-2'>
            {PRESETS.map((p) => <button key={p} type='button' onClick={() => setAmount(String(p))} className={cn('border px-3 py-2 text-body tabular-nums', Number(amount) === p && 'border-brand')}>${p}</button>)}
          </div>
          <Input id='amount' inputMode='decimal' value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={Boolean(error)} />
          {error && <p role='alert' className='mt-2 text-body text-danger'>{error}</p>}
          <Button type='submit' disabled={busy} className='mt-5'>{busy ? 'Processing…' : `Deposit ${money(Number(amount) || 0)}`}</Button>
        </form>
      )}

      <h2 className='mt-12 mb-3 text-body font-medium'>History</h2>
      <ul className='divide-y rounded-md border'>
        {deposits.map((d) => (
          <li key={d.id} className='flex items-center justify-between gap-4 px-5 py-3 text-body'>
            <div><div className='capitalize'>{d.method}</div><div className='text-caption text-text-3'>{timeAgo(d.createdAt)}</div></div>
            <div className='flex items-center gap-3'><StatusBadge status={d.status} /><span className='tabular-nums'>{money(d.amount)}</span></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
