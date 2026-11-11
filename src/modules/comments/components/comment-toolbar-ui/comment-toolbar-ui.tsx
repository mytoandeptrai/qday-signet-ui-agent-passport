import { ListIcon, MessageSquarePlusIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type CommentToolbarUiProps = {
  isListOpen: boolean;
  isPicking: boolean;
  openCount: number;
  unplacedCount: number;
  onToggleList: () => void;
  onOpenList: () => void;
  onTogglePicking: () => void;
};

const CommentToolbarUi = ({
  isListOpen,
  isPicking,
  openCount,
  unplacedCount,
  onToggleList,
  onOpenList,
  onTogglePicking,
}: CommentToolbarUiProps) => {
  const { t } = useTranslation('comments');

  return (
    <>
      {!isListOpen && unplacedCount > 0 && (
        <Button
          size='sm'
          variant='outline'
          className='border-destructive/40 text-destructive hover:text-destructive'
          onClick={onOpenList}
        >
          <TriangleAlertIcon />
          {t('toolbar.unplaced', { count: unplacedCount })}
        </Button>
      )}
      <div className='flex gap-2'>
        <Button variant='outline' aria-label={t('toolbar.list-aria')} aria-expanded={isListOpen} onClick={onToggleList}>
          <ListIcon />
          {openCount > 0 && <span>{openCount}</span>}
        </Button>
        <Button variant={isPicking ? 'default' : 'outline'} aria-pressed={isPicking} onClick={onTogglePicking}>
          <MessageSquarePlusIcon />
          {isPicking ? t('toolbar.cancel') : t('toolbar.comment')}
        </Button>
      </div>
    </>
  );
};

export default CommentToolbarUi;
