import { Outlet } from '@tanstack/react-router';
import AppHeader from '@/components/layouts/app-header';
import AppSidebar from '@/components/layouts/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { FCC } from '@/types';

type AppLayoutProps = {};

const AppLayout: FCC<AppLayoutProps> = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-transparent'>
        <AppHeader />
        <main className='w-full px-4 py-10 md:px-8'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
