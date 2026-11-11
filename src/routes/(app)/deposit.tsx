import { DepositContainer } from '@/modules/deposit';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/deposit')({ component: DepositContainer });
