import type { TFunction } from 'i18next';
import { ActivityIcon, BotIcon, CompassIcon, HomeIcon, ReceiptTextIcon, ShoppingBagIcon, WalletIcon } from 'lucide-react';
import { ROUTES } from '@/constant';

export const navGroups = (t: TFunction) => [
  {
    items: [
      { title: t('nav.home'), url: ROUTES.OVERVIEW, icon: HomeIcon },
      { title: t('nav.wallet'), url: ROUTES.WALLET, icon: WalletIcon },
    ],
  },
  {
    label: t('nav.agentic-payments'),
    items: [
      { title: t('nav.sessions'), url: ROUTES.SESSIONS, icon: ReceiptTextIcon },
      { title: t('nav.agents'), url: ROUTES.AGENTS, icon: BotIcon },
      { title: t('nav.activity'), url: ROUTES.ACTIVITY, icon: ActivityIcon },
    ],
  },
  {
    label: t('nav.marketplace'),
    items: [
      { title: t('nav.services'), url: ROUTES.EXPLORE, icon: CompassIcon },
      { title: t('nav.shopping'), url: ROUTES.SHOPPING, icon: ShoppingBagIcon },
    ],
  },
];
