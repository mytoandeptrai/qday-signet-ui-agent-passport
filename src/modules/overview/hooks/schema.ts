import type { TFunction } from 'i18next';
import z from 'zod';

export const allowanceFormSchema = (t: TFunction) =>
  z
    .object({
      limit: z.number({ message: t('errors.amount-required') }).positive({ message: t('errors.amount-required') }),
      perCall: z.number({ message: t('errors.amount-required') }).positive({ message: t('errors.amount-required') }),
    })
    .refine((v) => v.perCall <= v.limit, { path: ['perCall'], message: t('errors.per-call-exceeds') });

export type AllowanceFormData = z.infer<ReturnType<typeof allowanceFormSchema>>;
