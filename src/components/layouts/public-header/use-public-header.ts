import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/integrations/i18n';
import { usePassportStore } from '@/stores/passport-store';
import { publicNavItems } from './public-header.config';

export const usePublicHeader = () => {
  const { t } = useTranslation('public-layout');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { languages, current, onChangeLanguage } = useLanguage();
  const isSignedIn = usePassportStore((s) => Boolean(s.user));

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  return {
    navItems: publicNavItems(t),
    isSignedIn,
    languages,
    language: current,
    onChangeLanguage,
    isMenuOpen,
    onOpenMenu: () => setIsMenuOpen(true),
    onCloseMenu: () => setIsMenuOpen(false),
  };
};
