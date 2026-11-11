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

type OverviewRevokeDialogUiProps = {
  session?: SpendingSession;
  onClose: () => void;
  onConfirm: () => void;
};

const OverviewRevokeDialogUi = ({ session, onClose, onConfirm }: OverviewRevokeDialogUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <AlertDialog open={Boolean(session)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('revoke.title', { task: session?.task })}</AlertDialogTitle>
          <AlertDialogDescription>{t('revoke.description', { amount: session ? money(session.limit - session.spent) : '' })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('revoke.keep')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t('revoke.confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OverviewRevokeDialogUi;
