import type { TFunction } from 'i18next';
import z from 'zod';
import { money } from '@/lib/format';

export const sendFormSchema = (t: TFunction, available: number) =>
  z.object({
    to: z.string().trim().regex(/^0x[a-fA-F0-9]{40}$/, { message: t('send.errors.address') }),
    amount: z
      .number({ message: t('send.errors.amount-positive') })
      .positive({ message: t('send.errors.amount-positive') })
      .max(available, { message: t('send.errors.amount-max', { available: money(available) }) }),
  });

export type SendFormData = z.infer<ReturnType<typeof sendFormSchema>>;
export const initialSendFormData = { to: '', amount: 0 } satisfies SendFormData;
