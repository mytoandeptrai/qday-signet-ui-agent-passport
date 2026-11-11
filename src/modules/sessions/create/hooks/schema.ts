import type { TFunction } from 'i18next';
import z from 'zod';
import { money } from '@/lib/format';

export const createSessionSearchSchema = z.object({ task: z.string().optional().catch(undefined) });

export const AGENTS = ['Claude Code', 'Codex', 'Custom agent'];

export const createSessionFormSchema = (t: TFunction, available: number) =>
  z
    .object({
      task: z
        .string()
        .trim()
        .min(3, { message: t('errors.task-min') })
        .max(80, { message: t('errors.task-max') }),
      agent: z.string().min(1),
      limit: z
        .number({ message: t('errors.amount-required') })
        .positive({ message: t('errors.amount-positive') })
        .max(available, { message: t('errors.amount-max', { available: money(available) }) }),
      perCallLimit: z.number({ message: t('errors.amount-required') }).positive({ message: t('errors.amount-positive') }),
      durationHours: z
        .number({ message: t('errors.hours-invalid') })
        .int({ message: t('errors.hours-invalid') })
        .min(1, { message: t('errors.hours-invalid') })
        .max(168, { message: t('errors.hours-invalid') }),
    })
    .refine((v) => v.perCallLimit <= v.limit, { path: ['perCallLimit'], message: t('errors.per-call-exceeds') });

export type CreateSessionFormData = z.infer<ReturnType<typeof createSessionFormSchema>>;
