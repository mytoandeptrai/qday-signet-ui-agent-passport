import { PLAYGROUND_SCENARIOS } from '@/mock/playground';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

const route = getRouteApi('/(app)/playground');

export const usePlaygroundContainer = () => {
  const { idea } = route.useSearch();
  const navigate = useNavigate();
  const scenario = PLAYGROUND_SCENARIOS.find((s) => s.id === idea) ?? PLAYGROUND_SCENARIOS[0];

  const onSelectScenario = (id: string) => navigate({ to: '/playground', search: { idea: id }, replace: true });

  return { scenarios: PLAYGROUND_SCENARIOS, scenario, onSelectScenario };
};
