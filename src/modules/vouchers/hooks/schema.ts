import type { TFunction } from 'i18next';
import z from 'zod';

export const voucherFormSchema = (t: TFunction) =>
  z.object({ code: z.string().trim().min(1, { message: t('errors.code-required') }) });

export type VoucherFormData = z.infer<ReturnType<typeof voucherFormSchema>>;
export const initialVoucherFormData: VoucherFormData = { code: '' };
