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
import { money } from '@/lib/format';
import type { SpendingSession } from '@/types/passport';

interface SessionsRevokeDialogUiProps {
  session?: SpendingSession;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SessionsRevokeDialogUi = ({ session, isLoading, onClose, onConfirm }: SessionsRevokeDialogUiProps) => {
  const { t } = useTranslation('sessions-page');
  return (
    <AlertDialog open={!!session} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('revoke.title', { task: session?.task })}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('revoke.description', { amount: money(session ? Math.max(0, session.limit - session.spent) : 0) })}
          </AlertDialogDescription>
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

export default SessionsRevokeDialogUi;
