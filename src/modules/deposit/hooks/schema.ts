import type { TFunction } from 'i18next';
import z from 'zod';

export const MIN_DEPOSIT = 5;
export const MAX_DEPOSIT = 10_000;
export const PRESETS = [25, 50, 100, 250];
export const METHODS = ['card', 'bank', 'crypto'] as const;

export const depositFormSchema = (t: TFunction) =>
  z.object({
    amount: z
      .number({ message: t('errors.amount-min') })
      .min(MIN_DEPOSIT, { message: t('errors.amount-min') })
      .max(MAX_DEPOSIT, { message: t('errors.amount-max') }),
  });

export type DepositFormData = z.infer<ReturnType<typeof depositFormSchema>>;
export const initialDepositFormData: DepositFormData = { amount: 50 };
