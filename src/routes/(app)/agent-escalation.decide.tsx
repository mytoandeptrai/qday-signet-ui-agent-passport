import { decideSearchSchema, SessionDecideContainer } from '@/modules/sessions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/agent-escalation/decide')({
  validateSearch: decideSearchSchema,
  component: SessionDecideContainer,
});
