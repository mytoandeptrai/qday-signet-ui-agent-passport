import { toast } from 'sonner';
import { useTranslation } from '@/integrations/i18n';
import { navGroups } from './app-sidebar.config';

export const useAppSidebar = () => {
  const { t } = useTranslation('layout');

  const onRouterClick = () => toast(t('toasts.router-soon'));
  const onDocsClick = () => toast(t('toasts.docs'));
  const onSupportClick = () => toast.success(t('toasts.support'));

  return { groups: navGroups(t), onRouterClick, onDocsClick, onSupportClick };
};
