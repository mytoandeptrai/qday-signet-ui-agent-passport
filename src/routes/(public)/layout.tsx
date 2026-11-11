import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/layouts';

export const Route = createFileRoute('/(public)')({ component: PublicLayout });
