import { toast } from 'sonner';
import { useTranslation } from '@/integrations/i18n';
import { navItems } from './app-sidebar.config';

export const useAppSidebar = () => {
  const { t } = useTranslation('layout');

  const onRouterClick = () => toast(t('toasts.router-soon'));
  const onDocsClick = () => toast(t('toasts.docs'));
  const onSupportClick = () => toast.success(t('toasts.support'));

  return { items: navItems(t), onRouterClick, onDocsClick, onSupportClick };
};
