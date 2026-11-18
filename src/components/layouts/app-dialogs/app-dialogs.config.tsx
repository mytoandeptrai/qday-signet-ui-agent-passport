import type { ComponentType } from 'react';
import type { AppDialogName } from '@/constant';
import { ApproveAgentContainer } from '@/modules/agents';
import { ShopCheckoutContainer } from '@/modules/shopping';
import { CreateSessionContainer, SessionApproveContainer, SessionDecideContainer } from '@/modules/sessions';
import { ActivateSignetpassContainer, AddFundsContainer, CreateSignetpassContainer, FundSignetpassContainer, MoveFundsContainer } from '@/modules/signetpass';
import { ReceiveContainer, SendContainer } from '@/modules/wallet';

interface AppDialogConfig {
  kind: 'modal' | 'sheet';
  Content: ComponentType;
}

export const APP_DIALOG_CONFIG: Partial<Record<AppDialogName, AppDialogConfig>> = {
  send: { kind: 'modal', Content: SendContainer },
  receive: { kind: 'modal', Content: ReceiveContainer },
  'create-signetpass': { kind: 'modal', Content: CreateSignetpassContainer },
  'activate-signetpass': { kind: 'modal', Content: ActivateSignetpassContainer },
  'add-funds': { kind: 'sheet', Content: AddFundsContainer },
  'move-funds': { kind: 'modal', Content: MoveFundsContainer },
  'fund-signetpass': { kind: 'modal', Content: FundSignetpassContainer },
  'shop-checkout': { kind: 'modal', Content: ShopCheckoutContainer },
  'create-session': { kind: 'sheet', Content: CreateSessionContainer },
  'approve-session': { kind: 'modal', Content: SessionApproveContainer },
  'approve-agent': { kind: 'modal', Content: ApproveAgentContainer },
  'decide-request': { kind: 'modal', Content: SessionDecideContainer },
};
