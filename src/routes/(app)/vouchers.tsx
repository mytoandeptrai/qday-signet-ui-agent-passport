import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { money, timeAgo } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/vouchers')({ component: Vouchers });

function Vouchers() {
  const { vouchers, redeemVoucher } = usePassportStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const redeem = (value: string) => {
    if (!value.trim()) return setError('Enter a voucher code');
    const r = redeemVoucher(value);
    if (!r.ok) return setError(r.error);
    setError('');
    setCode('');
    toast.success(`${money(r.amount)} added to your balance`);
  };

  return (
    <div className='max-w-2xl'>
      <PageHeader title='Vouchers' description='Redeem a code to add credit to your balance. Try SIGNET-LAUNCH-50.' />
      <form onSubmit={(e) => { e.preventDefault(); redeem(code); }} noValidate>
        <Label htmlFor='code' className='mb-2'>Voucher code</Label>
        <div className='flex gap-2'>
          <Input id='code' containerClassName='flex-1' placeholder='SIGNET-XXXX-00' value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={Boolean(error)} className='font-mono uppercase' />
          <Button type='submit'>Redeem</Button>
        </div>
        {error && <p role='alert' className='mt-2 text-body text-danger'>{error}</p>}
      </form>
      <ul className='mt-10 divide-y rounded-md border'>
        {vouchers.map((v) => (
          <li key={v.id} className='flex items-center justify-between gap-4 px-5 py-3 text-body'>
            <div><div className='font-mono text-small'>{v.code}</div><div className='text-caption text-text-3'>{v.redeemedAt ? `Redeemed ${timeAgo(v.redeemedAt)}` : `Issued ${timeAgo(v.createdAt)}`}</div></div>
            <div className='flex items-center gap-3'>
              <StatusBadge status={v.status} />
              <span className='tabular-nums'>{money(v.amount)}</span>
              {v.status === 'unused' && <Button size='sm' variant='outline' onClick={() => redeem(v.code)}>Redeem</Button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
