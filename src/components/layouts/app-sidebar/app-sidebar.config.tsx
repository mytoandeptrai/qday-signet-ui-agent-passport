import type { TFunction } from 'i18next';
import { ActivityIcon, CompassIcon, HomeIcon } from 'lucide-react';
import { ROUTES } from '@/constant';

export const navItems = (t: TFunction) => [
  { title: t('nav.home'), url: ROUTES.OVERVIEW, icon: HomeIcon },
  { title: t('nav.activity'), url: ROUTES.ACTIVITY, icon: ActivityIcon },
  { title: t('nav.explore'), url: ROUTES.EXPLORE, icon: CompassIcon },
];
