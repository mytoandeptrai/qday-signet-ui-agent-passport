import type { TFunction } from 'i18next';
import { ActivityIcon, CompassIcon, BotIcon, HomeIcon, ReceiptTextIcon, WalletIcon } from 'lucide-react';
import { ROUTES } from '@/constant';

export const navItems = (t: TFunction) => [
  { title: t('nav.home'), url: ROUTES.OVERVIEW, icon: HomeIcon },
  { title: t('nav.wallet'), url: ROUTES.WALLET, icon: WalletIcon },
  { title: t('nav.agents'), url: ROUTES.AGENTS, icon: BotIcon },
  { title: t('nav.sessions'), url: ROUTES.SESSIONS, icon: ReceiptTextIcon },
  { title: t('nav.activity'), url: ROUTES.ACTIVITY, icon: ActivityIcon },
  { title: t('nav.explore'), url: ROUTES.EXPLORE, icon: CompassIcon },
];
