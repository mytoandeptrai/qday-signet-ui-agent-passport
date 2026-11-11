import { ActivityContainer, activitySearchSchema } from '@/modules/activity';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/activity')({
  validateSearch: activitySearchSchema,
  component: ActivityContainer,
});
