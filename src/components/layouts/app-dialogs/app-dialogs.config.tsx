import type { ComponentType } from 'react';
import type { AppDialogName } from '@/constant';
import { AddFundsContainer, CreateSignetpassContainer } from '@/modules/signetpass';
import { ReceiveContainer, SendContainer } from '@/modules/wallet';

interface AppDialogConfig {
  /** Short, single-purpose actions are modals; flows with several options are sheets. */
  kind: 'modal' | 'sheet';
  Content: ComponentType;
}

export const APP_DIALOG_CONFIG: Partial<Record<AppDialogName, AppDialogConfig>> = {
  send: { kind: 'modal', Content: SendContainer },
  receive: { kind: 'modal', Content: ReceiveContainer },
  'create-signetpass': { kind: 'modal', Content: CreateSignetpassContainer },
  'add-funds': { kind: 'sheet', Content: AddFundsContainer },
};
