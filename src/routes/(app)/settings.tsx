import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/integrations/theme/theme-context';
import { shortAddress, timeAgo } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import type { AppSettings } from '@/types/passport';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/settings')({ component: Settings });

function Settings() {
  const { user, settings, updateSettings, addPasskey, removePasskey, reset } = usePassportStore();
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});
  const set = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    const e: typeof errors = {};
    if (!(draft.defaultLimit > 0)) e.defaultLimit = 'Must be more than $0';
    if (!(draft.defaultPerCallLimit > 0)) e.defaultPerCallLimit = 'Must be more than $0';
    else if (draft.defaultPerCallLimit > draft.defaultLimit) e.defaultPerCallLimit = 'Cannot exceed the session limit';
    setErrors(e);
    if (Object.keys(e).length) return toast.error('Fix the highlighted fields');
    updateSettings(draft);
    toast.success('Settings saved');
  };

  const num = (k: 'defaultLimit' | 'defaultPerCallLimit' | 'requireApprovalAbove') => (
    <>
      <Input inputMode='decimal' value={draft[k]} onChange={(e) => set(k, Number(e.target.value) as never)} aria-invalid={Boolean(errors[k])} />
      {errors[k] && <p role='alert' className='mt-1.5 text-body text-danger'>{errors[k]}</p>}
    </>
  );

  return (
    <div className='max-w-2xl'>
      <PageHeader title='Settings' />
      <Tabs defaultValue='limits'>
        <TabsList>
          <TabsTrigger value='limits'>Limits</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='account'>Account</TabsTrigger>
        </TabsList>

        <TabsContent value='limits' className='mt-6 space-y-6'>
          <div><Label className='mb-2'>Default session limit (USD)</Label>{num('defaultLimit')}</div>
          <div><Label className='mb-2'>Default per-call limit (USD)</Label>{num('defaultPerCallLimit')}</div>
          <div><Label className='mb-2'>Ask me before any single payment above (USD)</Label>{num('requireApprovalAbove')}</div>
          <Button className='rounded-none' onClick={save}>Save changes</Button>
        </TabsContent>

        <TabsContent value='notifications' className='mt-6 space-y-5'>
          {([['emailAlerts', 'Email me about every session', 'A summary when a session ends.'], ['alertOnBlocked', 'Alert me when a payment is blocked', 'Sent right away, with the reason.']] as const).map(([k, t, d]) => (
            <div key={k} className='flex items-center justify-between gap-6 rounded-md border p-4'>
              <div><div className='text-body font-medium'>{t}</div><div className='text-body text-muted-foreground'>{d}</div></div>
              <Switch checked={draft[k]} onCheckedChange={(v) => set(k, v)} aria-label={t} />
            </div>
          ))}
          <Button className='rounded-none' onClick={save}>Save changes</Button>
        </TabsContent>

        <TabsContent value='security' className='mt-6'>
          <div className='mb-3 flex items-center justify-between'>
            <h2 className='text-body font-medium'>Passkeys</h2>
            <Button size='sm' variant='outline' className='rounded-none' onClick={() => { addPasskey(`Device ${(user?.passkeys.length ?? 0) + 1}`); toast.success('Passkey added'); }}>Add passkey</Button>
          </div>
          <ul className='divide-y rounded-md border'>
            {user?.passkeys.map((p) => (
              <li key={p.id} className='flex items-center justify-between px-5 py-3 text-body'>
                <div><div>{p.label}</div><div className='text-caption text-text-3'>{p.lastUsedAt ? `Used ${timeAgo(p.lastUsedAt)}` : 'Never used'}</div></div>
                <button type='button' className='text-small text-muted-foreground hover:text-danger disabled:opacity-40' disabled={(user?.passkeys.length ?? 0) <= 1} title={(user?.passkeys.length ?? 0) <= 1 ? 'Keep at least one passkey' : undefined} onClick={() => { removePasskey(p.id); toast('Passkey removed'); }}>Remove</button>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value='account' className='mt-6 space-y-6'>
          <dl className='grid grid-cols-[120px_1fr] gap-y-3 text-body'>
            <dt className='text-muted-foreground'>Name</dt><dd>{user?.name}</dd>
            <dt className='text-muted-foreground'>Email</dt><dd>{user?.email}</dd>
            <dt className='text-muted-foreground'>Wallet</dt><dd className='font-mono text-small'>{user && shortAddress(user.walletAddress)}</dd>
          </dl>
          <AppearanceField value={draft.appearance} onChange={(v) => { set('appearance', v); updateSettings({ appearance: v }); }} />
          <div className='border-t pt-6'>
            <p className='mb-3 text-body text-muted-foreground'>Reset sessions, activity, vouchers and balance to the demo data.</p>
            <Button variant='outline' className='rounded-none' onClick={() => { reset(); setDraft(usePassportStore.getState().settings); toast.success('Demo data restored'); }}>Reset demo data</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppearanceField({ value, onChange }: { value: AppSettings['appearance']; onChange: (v: AppSettings['appearance']) => void }) {
  const { setTheme } = useTheme();
  return (
    <div>
      <Label className='mb-2'>Appearance</Label>
      <div className='flex gap-2'>
        {(['light', 'dark', 'system'] as const).map((a) => (
          <Button key={a} type='button' size='sm' variant={value === a ? 'default' : 'outline'} className='rounded-none capitalize' onClick={() => { onChange(a); setTheme(a); }}>{a}</Button>
        ))}
      </div>
    </div>
  );
}
