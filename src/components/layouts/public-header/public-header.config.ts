import type { TFunction } from 'i18next';
import { ROUTES } from '@/constant';

export const publicNavItems = (t: TFunction) => [
  { label: t('nav.how-it-works'), href: `${ROUTES.HOME}#how` },
  { label: t('nav.explore'), href: ROUTES.EXPLORE },
  { label: t('nav.ecosystem'), href: ROUTES.ECOSYSTEM },
  { label: t('nav.developers'), href: '#' },
];
