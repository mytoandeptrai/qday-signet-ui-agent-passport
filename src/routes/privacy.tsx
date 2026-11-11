import { createFileRoute } from '@tanstack/react-router';
import { PrivacyContainer } from '@/modules/legal';

export const Route = createFileRoute('/privacy')({ component: PrivacyContainer });
