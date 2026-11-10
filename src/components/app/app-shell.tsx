import { AppSidebar } from '@/components/app/app-sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { money, timeAgo } from '@/lib/format';
import { usePassportStore } from '@/stores/passport-store';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Bell, CircleUser, Settings, Waypoints, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function Banner() {
  const [open, setOpen] = useState(true);
  if (!open) return <div className='flex-1' />;
  return (
    <div className='flex min-w-0 flex-1 items-center gap-3 rounded-md border bg-background/80 px-3.5 py-2 text-body md:max-w-[720px]'>
      <Waypoints className='size-[18px] shrink-0 text-muted-foreground' strokeWidth={1.4} />
      <span className='min-w-0 flex-1 truncate'>Reduce your AI costs by half with Signet Router</span>
      <button type='button' onClick={() => toast('Signet Router is coming soon')} className='hidden items-center gap-1.5 text-body text-muted-foreground hover:text-foreground sm:flex'>
        Learn more <ArrowRight className='size-4' />
      </button>
      <button type='button' aria-label='Dismiss' onClick={() => setOpen(false)} className='text-muted-foreground hover:text-foreground'><X className='size-5' /></button>
    </div>
  );
}

function Notifications() {
  const { escalations, activity } = usePassportStore();
  const items = [
    ...escalations.filter((e) => e.status === 'pending').map((e) => ({ id: e.id, text: `${e.agent} wants ${money(e.amount)} on ${e.service}`, at: e.requestedAt, to: `/agent-escalation/decide?id=${e.id}` })),
    ...activity.filter((a) => a.status === 'blocked').slice(0, 3).map((a) => ({ id: a.id, text: `Blocked: ${a.service} ${money(a.amount)} (${a.reason})`, at: a.createdAt, to: '/activity' })),
  ];
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label='Notifications' className='relative grid size-9 place-items-center text-muted-foreground outline-none hover:text-foreground'>
        <Bell className='size-[18px]' strokeWidth={1.4} />
        {escalations.some((e) => e.status === 'pending') && <span className='absolute top-2 right-2 size-2 rounded-full bg-brand' />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 && <div className='px-2 py-6 text-center text-body text-muted-foreground'>You are all caught up.</div>}
        {items.map((n) => (
          <DropdownMenuItem key={n.id} onSelect={() => navigate({ to: n.to })} className='flex-col items-start gap-0.5'>
            <span className='text-body'>{n.text}</span><span className='text-caption text-text-3'>{timeAgo(n.at)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell() {
  const user = usePassportStore((s) => s.user);
  const signOut = usePassportStore((s) => s.signOut);
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-[radial-gradient(120%_90%_at_100%_100%,var(--glow)_0%,var(--background)_60%)]'>
        <header className='flex h-16 shrink-0 items-center gap-3 border-b bg-background/60 px-4 md:px-8'>
          <SidebarTrigger className='-ml-1 md:hidden' />
          <Banner />
          <div className='ml-auto flex items-center gap-1'>
            <Notifications />
            <Link to='/settings' aria-label='Settings' className='grid size-9 place-items-center text-muted-foreground hover:text-foreground'><Settings className='size-[18px]' strokeWidth={1.4} /></Link>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label='Account menu' className='grid size-9 place-items-center text-muted-foreground outline-none hover:text-foreground'><CircleUser className='size-[18px]' strokeWidth={1.4} /></DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel className='font-normal'>
                  <div className='text-body font-medium'>{user?.name}</div>
                  <div className='text-caption text-muted-foreground'>{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: '/settings' })}>Settings</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: '/deposit' })}>Deposit</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: '/vouchers' })}>Vouchers</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => { signOut(); toast('Signed out'); navigate({ to: '/' }); }}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className='w-full px-4 py-10 md:px-8'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
