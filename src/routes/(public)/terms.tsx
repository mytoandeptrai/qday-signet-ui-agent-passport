import { createFileRoute } from '@tanstack/react-router';
import { TermsContainer } from '@/modules/legal';

export const Route = createFileRoute('/(public)/terms')({ component: TermsContainer });
