import { AppLayout } from '@/components/layouts';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)')({
  beforeLoad: ({ location }) => {
    if (!usePassportStore.getState().user) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: AppLayout,
});
