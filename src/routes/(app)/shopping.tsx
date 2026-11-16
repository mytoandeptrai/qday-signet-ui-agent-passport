import { ShoppingContainer } from '@/modules/shopping';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/shopping')({ component: ShoppingContainer });
