import { VouchersContainer } from '@/modules/vouchers';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/vouchers')({ component: VouchersContainer });
