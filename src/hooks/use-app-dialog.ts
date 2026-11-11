import { useNavigate, useSearch } from '@tanstack/react-router';
import type { AppDialogName, AppDialogParams, AppDialogSearch } from '@/constant';

const CLEARED: AppDialogSearch = {
  dialog: undefined,
  id: undefined,
  task: undefined,
  agent: undefined,
  limit: undefined,
  perCall: undefined,
  hours: undefined,
};

/** Opens and closes the global (app) dialogs through URL search params, so they are deep-linkable. */
export const useAppDialog = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as AppDialogSearch;

  const open = (dialog: AppDialogName, params: AppDialogParams = {}) =>
    navigate({ to: '.', search: ((prev: object) => ({ ...prev, ...CLEARED, ...params, dialog })) as never });

  const close = () => navigate({ to: '.', search: ((prev: object) => ({ ...prev, ...CLEARED })) as never });

  return { dialog: search.dialog, params: search, open, close };
};
