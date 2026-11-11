import { approveSearchSchema, SessionApproveContainer } from '@/modules/sessions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/agent-session/approve')({
  validateSearch: approveSearchSchema,
  component: SessionApproveContainer,
});
