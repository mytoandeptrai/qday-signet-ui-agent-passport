import z from 'zod';

/** Dialogs and sheets that open on top of any (app) page, driven by the `dialog` search param. */
export const APP_DIALOGS = [
  'add-funds',
  'send',
  'receive',
  'create-signetpass',
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
  /** Escalation id for `decide-request`, agent id for `approve-agent`. */
  id: optionalString,
  /** Pre-fills for `create-session`, and the request shown by `approve-session`. */
  task: optionalString,
  agent: optionalString,
  limit: optionalNumber,
  perCall: optionalNumber,
  hours: optionalNumber,
});

export type AppDialogSearch = z.infer<typeof appDialogSearchSchema>;
export type AppDialogParams = Omit<AppDialogSearch, 'dialog'>;
