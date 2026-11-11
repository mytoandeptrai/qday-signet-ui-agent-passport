import { PlaygroundContainer, playgroundSearchSchema } from '@/modules/playground';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/playground')({
  validateSearch: playgroundSearchSchema,
  component: PlaygroundContainer,
});
