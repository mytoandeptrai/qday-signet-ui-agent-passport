import z from 'zod';

export const approveSearchSchema = z.object({
  task: z.string().catch('Team dinner for 12'),
  agent: z.string().catch('Claude Code'),
  limit: z.coerce.number().positive().catch(20),
  perCall: z.coerce.number().positive().catch(5),
  hours: z.coerce.number().positive().catch(8),
});
