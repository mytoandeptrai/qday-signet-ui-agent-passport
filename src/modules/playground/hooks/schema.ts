import z from 'zod';

export const playgroundSearchSchema = z.object({ idea: z.string().optional() });
