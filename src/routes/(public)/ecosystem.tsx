import { createFileRoute } from '@tanstack/react-router';
import { EcosystemContainer } from '@/modules/ecosystem';

export const Route = createFileRoute('/(public)/ecosystem')({ component: EcosystemContainer });
