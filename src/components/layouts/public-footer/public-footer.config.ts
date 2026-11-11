import type { TFunction } from 'i18next';
import { ROUTES } from '@/constant';

export const footerColumns = (t: TFunction) => [
  {
    title: t('footer.product'),
    links: [
      { label: t('nav.how-it-works'), href: `${ROUTES.HOME}#how` },
      { label: t('nav.explore'), href: ROUTES.EXPLORE },
      { label: t('nav.ecosystem'), href: ROUTES.ECOSYSTEM },
      { label: t('header.sign-in'), href: ROUTES.LOGIN },
    ],
  },
  {
    title: t('footer.signet'),
    links: [
      { label: t('footer.documentation'), href: '#' },
      { label: t('footer.discord'), href: '#' },
      { label: t('footer.x'), href: '#' },
      { label: t('footer.linkedin'), href: '#' },
    ],
  },
  {
    title: t('footer.legal'),
    links: [
      { label: t('footer.terms'), href: ROUTES.TERMS },
      { label: t('footer.privacy'), href: ROUTES.PRIVACY },
    ],
  },
];
