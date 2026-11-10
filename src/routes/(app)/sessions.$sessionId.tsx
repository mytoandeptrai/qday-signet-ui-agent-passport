import { PageHeader } from '@/components/app/page-header';
import { SpendBar } from '@/components/app/spend-bar';
import { StatusBadge } from '@/components/app/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { money, timeAgo } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/sessions/$sessionId')({
  beforeLoad: ({ params }) => {
    if (!usePassportStore.getState().sessions.some((s) => s.id === params.sessionId)) throw notFound();
  },
  component: SessionDetail,
});

function SessionDetail() {
  const { sessionId } = Route.useParams();
  const session = usePassportStore((s) => s.sessions.find((x) => x.id === sessionId));
  const allActivity = usePassportStore((s) => s.activity);
  const activity = useMemo(() => allActivity.filter((a) => a.sessionId === sessionId), [allActivity, sessionId]);
  const revoke = usePassportStore((s) => s.revokeSession);
  if (!session) return null;

  return (
    <>
      <Link to='/overview' className='mb-6 inline-block text-small text-muted-foreground hover:text-foreground'>← Overview</Link>
      <PageHeader
        title={session.task}
        description={`${session.agent} · started ${timeAgo(session.createdAt)} · ${session.status === 'active' ? `expires ${timeAgo(session.expiresAt)}` : session.status}`}
        action={
          session.status === 'active' && (
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant='outline' className='rounded-none'>Revoke</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
                  <AlertDialogDescription>{money(session.limit - session.spent)} returns to your balance. This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { revoke(session.id); toast.success('Session revoked'); }}>Revoke</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        }
      />
      <div className='grid gap-6 md:grid-cols-[1fr_320px]'>
        <section>
          <h2 className='mb-3 text-body font-medium'>Activity</h2>
          <ul className='divide-y rounded-md border'>
            {activity.map((a) => (
              <li key={a.id} className='grid grid-cols-[1fr_auto] gap-x-4 px-5 py-3 text-body'>
                <div><div>{a.service}</div><div className={a.status === 'blocked' ? 'text-caption text-danger' : 'text-caption text-text-3'}>{a.status === 'blocked' ? a.reason : a.description}</div></div>
                <span className={a.status === 'blocked' ? 'text-text-3 line-through tabular-nums' : 'tabular-nums'}>{money(a.amount)}</span>
              </li>
            ))}
            {activity.length === 0 && <li className='px-5 py-10 text-center text-body text-muted-foreground'>No payments yet.</li>}
          </ul>
        </section>
        <aside className='space-y-6'>
          <div className='rounded-md border p-5'>
            <div className='mb-4 flex items-center justify-between'><span className='text-body font-medium'>Spend</span><StatusBadge status={session.status} /></div>
            <SpendBar spent={session.spent} limit={session.limit} perCall={session.perCallLimit} />
          </div>
          <div className='rounded-md border p-5'>
            <div className='mb-3 text-body font-medium'>Allowed services</div>
            {session.allowedServices.length ? (
              <div className='flex flex-wrap gap-1.5'>{session.allowedServices.map((s) => <span key={s} className='border px-2 py-1 text-caption'>{s}</span>)}</div>
            ) : <p className='text-body text-muted-foreground'>Any service, within the limits.</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
