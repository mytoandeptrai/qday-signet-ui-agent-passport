import type { TFunction } from 'i18next';
import z from 'zod';

export const limitsFormSchema = (t: TFunction) =>
  z
    .object({
      defaultLimit: z.number({ message: t('errors.amount-positive') }).positive({ message: t('errors.amount-positive') }),
      defaultPerCallLimit: z.number({ message: t('errors.amount-positive') }).positive({ message: t('errors.amount-positive') }),
      requireApprovalAbove: z.number({ message: t('errors.amount-invalid') }).min(0, { message: t('errors.amount-invalid') }),
    })
    .refine((v) => v.defaultPerCallLimit <= v.defaultLimit, { path: ['defaultPerCallLimit'], message: t('errors.per-call-exceeds') });

export const notificationsFormSchema = z.object({ emailAlerts: z.boolean(), alertOnBlocked: z.boolean() });

export type LimitsFormData = z.infer<ReturnType<typeof limitsFormSchema>>;
export type NotificationsFormData = z.infer<typeof notificationsFormSchema>;

export const APPEARANCES = ['light', 'dark', 'system'] as const;
export const NOTIFICATION_FIELDS = ['emailAlerts', 'alertOnBlocked'] as const;
