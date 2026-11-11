import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ActivityDetailUi } from '../../components';
import { useActivityDetailContainer } from '../../hooks';
import type { ActivityRow } from '../../utils';

type ActivityDetailDialogContainerProps = {
  row: ActivityRow | null;
  onClose: () => void;
};

const ActivityDetailDialogContainer = ({ row, onClose }: ActivityDetailDialogContainerProps) => {
  const { reason, task } = useActivityDetailContainer(row);
  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{row?.detail}</DialogTitle>
          <DialogDescription>{row?.sub}</DialogDescription>
        </DialogHeader>
        {row && <ActivityDetailUi row={row} reason={reason} task={task} />}
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailDialogContainer;
