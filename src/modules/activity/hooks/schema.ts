import z from 'zod';
import { RANGE_DAYS, TABS } from '../utils/constants';

export const activitySearchSchema = z.object({
  tab: z.enum(TABS).optional().catch(undefined),
  range: z.coerce
    .number()
    .refine((n) => (RANGE_DAYS as readonly number[]).includes(n))
    .optional()
    .catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
  pageSize: z.coerce.number().int().min(1).optional().catch(undefined),
});

export type ActivitySearch = z.infer<typeof activitySearchSchema>;
