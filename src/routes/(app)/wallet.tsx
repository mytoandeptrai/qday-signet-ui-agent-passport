import { WalletContainer } from '@/modules/wallet';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/wallet')({ component: WalletContainer });
