import z from 'zod';

export const decideSearchSchema = z.object({ id: z.string().catch('esc_01') });
