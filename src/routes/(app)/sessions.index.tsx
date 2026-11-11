import { SessionsListContainer } from '@/modules/sessions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/sessions/')({ component: SessionsListContainer });
