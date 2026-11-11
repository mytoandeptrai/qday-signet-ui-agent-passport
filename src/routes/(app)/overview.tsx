import { OverviewContainer } from '@/modules/overview';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/overview')({ component: OverviewContainer });
