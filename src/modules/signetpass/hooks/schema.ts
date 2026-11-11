import type { TFunction } from 'i18next';
import z from 'zod';
import { money } from '@/lib/format';

export const transferFormSchema = (t: TFunction, available: number) =>
  z.object({
    amount: z
      .number({ message: t('add-funds.transfer.errors.amount-positive') })
      .positive({ message: t('add-funds.transfer.errors.amount-positive') })
      .max(available, { message: t('add-funds.transfer.errors.amount-max', { available: money(available) }) }),
  });

export type TransferFormData = z.infer<ReturnType<typeof transferFormSchema>>;
export const initialTransferFormData: TransferFormData = { amount: 0 };

export const ADD_FUNDS_TABS = ['crypto', 'wallet', 'card'] as const;
export type AddFundsTab = (typeof ADD_FUNDS_TABS)[number];
