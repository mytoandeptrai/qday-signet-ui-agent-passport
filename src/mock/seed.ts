import type { AppSettings, MainWallet, User } from '@/types/passport';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const SEED_USER: Omit<User, 'email'> = {
  id: 'usr_01',
  name: 'Alex Morgan',
  createdAt: hoursAgo(24 * 40),
};

export const SEED_SETTINGS: AppSettings = {
  defaultLimit: 20,
  defaultPerCallLimit: 5,
  emailAlerts: true,
  alertOnBlocked: true,
  requireApprovalAbove: 25,
  appearance: 'light',
};

export const SEED_MAIN_WALLET: MainWallet = {
  balance: 1250,
  transactions: [
    { id: 'wtx_1', kind: 'receive', counterparty: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', amount: 500, createdAt: hoursAgo(24 * 9) },
    { id: 'wtx_2', kind: 'send', counterparty: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', amount: 75.5, createdAt: hoursAgo(24 * 5) },
    { id: 'wtx_3', kind: 'receive', counterparty: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', amount: 825.5, createdAt: hoursAgo(24 * 2) },
  ],
};
