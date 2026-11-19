import z from 'zod';

export const APP_DIALOGS = [
  'add-funds',
  'move-funds',
  'fund-signetpass',
  'shop-checkout',
  'shop-login',
  'send',
  'receive',
  'create-signetpass',
  'activate-signetpass',
  'create-session',
  'approve-session',
  'decide-request',
  'approve-agent',
] as const;

export type AppDialogName = (typeof APP_DIALOGS)[number];

const optionalNumber = z.coerce.number().positive().optional().catch(undefined);
const optionalString = z.string().optional().catch(undefined);

export const appDialogSearchSchema = z.object({
  dialog: z.enum(APP_DIALOGS).optional().catch(undefined),
  id: optionalString,
  task: optionalString,
  agent: optionalString,
  limit: optionalNumber,
  perCall: optionalNumber,
  hours: optionalNumber,
});

export type AppDialogSearch = z.infer<typeof appDialogSearchSchema>;
export type AppDialogParams = Omit<AppDialogSearch, 'dialog'>;
