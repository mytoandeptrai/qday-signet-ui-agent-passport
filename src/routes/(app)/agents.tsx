import { AgentsContainer } from '@/modules/agents';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/agents')({ component: AgentsContainer });
