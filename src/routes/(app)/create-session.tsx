import { CreateSessionContainer, createSessionSearchSchema } from '@/modules/sessions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/create-session')({
  validateSearch: createSessionSearchSchema,
  component: CreateSessionContainer,
});
