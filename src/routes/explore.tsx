import { createFileRoute } from '@tanstack/react-router';
import { ExploreContainer, exploreSearchSchema } from '@/modules/explore';

export const Route = createFileRoute('/explore')({
  validateSearch: exploreSearchSchema,
  component: ExploreContainer,
});
