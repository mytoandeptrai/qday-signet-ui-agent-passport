import { getSession } from '@/apis/sessions';
import { SessionDetailContainer } from '@/modules/sessions';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/sessions/$sessionId')({
  beforeLoad: async ({ params }) => {
    if (!(await getSession(params.sessionId))) throw notFound();
  },
  component: SessionDetailContainer,
});
