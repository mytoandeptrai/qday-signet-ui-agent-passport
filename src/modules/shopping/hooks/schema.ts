import type { TFunction } from 'i18next';
import z from 'zod';

export const ecommerceLoginSchema = (t: TFunction) =>
  z.object({
    email: z.string().trim().email({ message: t('login.errors.email') }),
    password: z.string().min(1, { message: t('login.errors.password') }),
  });

export type EcommerceLoginFormData = z.infer<ReturnType<typeof ecommerceLoginSchema>>;
export const initialEcommerceLoginFormData: EcommerceLoginFormData = { email: '', password: '' };
