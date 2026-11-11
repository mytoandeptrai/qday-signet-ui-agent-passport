import type { TFunction } from 'i18next';
import z from 'zod';

export const loginSearchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(['login', 'signup']).optional().catch(undefined),
});

export const emailFormSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t('errors.email-required') })
      .pipe(z.email({ message: t('errors.email-invalid') })),
  });

export const codeFormSchema = (t: TFunction) =>
  z.object({ code: z.string().regex(/^\d{6}$/, { message: t('errors.code-invalid') }) });

export const initialEmailFormData = { email: '' };
export const initialCodeFormData = { code: '' };

export type EmailFormData = z.infer<ReturnType<typeof emailFormSchema>>;
export type CodeFormData = z.infer<ReturnType<typeof codeFormSchema>>;
export type LoginStep = 'email' | 'code' | 'passkey';
