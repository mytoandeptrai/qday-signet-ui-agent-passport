import { createFileRoute } from '@tanstack/react-router';
import { ExploreContainer, exploreSearchSchema } from '@/modules/explore';

export const Route = createFileRoute('/(public)/explore')({
  validateSearch: exploreSearchSchema,
  component: ExploreContainer,
});
