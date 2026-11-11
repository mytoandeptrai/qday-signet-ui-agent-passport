import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/integrations/i18n';
import type { Agent } from '@/types/passport';

interface AgentsRevokeDialogUiProps {
  agent?: Agent;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AgentsRevokeDialogUi = ({ agent, isLoading, onClose, onConfirm }: AgentsRevokeDialogUiProps) => {
  const { t } = useTranslation('agents-page');
  return (
    <AlertDialog open={!!agent} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('revoke.title', { agent: agent?.name })}</AlertDialogTitle>
          <AlertDialogDescription>{t('revoke.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('revoke.keep')}</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={onConfirm}>
            {t('revoke.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgentsRevokeDialogUi;
