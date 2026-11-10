import { SignetMark } from '@/components/brand/signet-mark';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { Activity, ChevronDown, CircleHelp, Compass, Home, Plus, Waypoints } from 'lucide-react';
import { toast } from 'sonner';

const NAV = [
  { to: '/overview', label: 'Home', icon: Home },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/explore', label: 'Explore', icon: Compass },
] as const;

export function AppSidebar() {
  const match = useMatchRoute();
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='px-4 pt-5 pb-6'>
        <Link to='/' aria-label='Signet, home' className='flex items-center gap-3 text-body text-muted-foreground'>
          <SignetMark className='size-6 shrink-0' />
          <span className='group-data-[collapsible=icon]:hidden'>Signet</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden px-2'>
        <SidebarGroup>
          <SidebarMenu>
            {NAV.map(({ to, label, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild tooltip={label} isActive={!!match({ to, fuzzy: true })} className='h-10 gap-3 px-3 text-body [&_svg]:size-[18px] [&_svg]:text-muted-foreground'>
                  <Link to={to}><Icon strokeWidth={1.4} /><span>{label}</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className='mt-4'>
          <SidebarGroupLabel className='px-3 text-small font-medium text-muted-foreground'>Products</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip='Signet Router' onClick={() => toast('Signet Router is coming soon')} className='h-10 gap-3 px-3 text-body [&_svg]:size-[18px] [&_svg]:text-muted-foreground'>
                <Waypoints strokeWidth={1.4} /><span>Signet Router</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='px-2 pb-3'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip='New session' className='h-10 gap-3 px-3 text-body text-muted-foreground [&_svg]:size-[18px]'>
              <Link to='/create-session'><Plus strokeWidth={1.4} /><span>New session</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip='Help' className='h-10 gap-3 px-3 text-body text-muted-foreground [&_svg]:size-[18px]'>
                  <CircleHelp strokeWidth={1.4} /><span>Help</span><ChevronDown className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='start' className='w-48'>
                <DropdownMenuItem onSelect={() => toast('Docs open in the real product')}>Documentation</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toast.success('Message sent to support (mock)')}>Contact support</DropdownMenuItem>
                <DropdownMenuItem asChild><Link to='/terms'>Terms</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to='/privacy'>Privacy</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
