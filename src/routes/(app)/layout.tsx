import { AppLayout } from '@/components/layouts';
import { appDialogSearchSchema } from '@/constant';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)')({
  validateSearch: appDialogSearchSchema,
  beforeLoad: ({ location }) => {
    if (!usePassportStore.getState().user) throw redirect({ to: '/login', search: { redirect: location.href } });
  },
  component: AppLayout,
});
