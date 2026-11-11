import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

type SessionDetailRevokeUiProps = {
  refund: number;
  onRevoke: () => void;
};

const SessionDetailRevokeUi = ({ refund, onRevoke }: SessionDetailRevokeUiProps) => {
  const { t } = useTranslation('session-detail-page');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='outline'>{t('revoke.button')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('revoke.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('revoke.description', { amount: money(refund) })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('revoke.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onRevoke}>{t('revoke.confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionDetailRevokeUi;
