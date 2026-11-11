import { CopyIcon } from 'lucide-react';
import type { PinComment } from '@/apis/comments';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { StoreMode } from '../../hooks';
import CommentRowUi from '../comment-row-ui';

type Row = { comment: PinComment; number: number; isMissing: boolean };

type CommentListUiProps = {
  mode: StoreMode;
  openCount: number;
  unplaced: Row[];
  placed: Row[];
  onFocus: (comment: PinComment) => void;
  onCopyOpen: () => void;
};

const modeKey: Record<StoreMode, string> = { remote: 'list.synced', local: 'list.local', loading: 'list.loading' };

const CommentListUi = ({ mode, openCount, unplaced, placed, onFocus, onCopyOpen }: CommentListUiProps) => {
  const { t } = useTranslation('comments');
  const renderRow = (r: Row) => <CommentRowUi key={r.comment.id} comment={r.comment} number={r.number} isMissing={r.isMissing} onClick={onFocus} />;

  return (
    <div className='w-72 rounded-2xl border border-border bg-card p-2 text-card-foreground shadow-lg'>
      <div className='flex items-center justify-between px-2 py-1'>
        <p className='text-sm font-semibold'>{t('list.title', { count: openCount })}</p>
        <Button size='sm' variant='ghost' disabled={!openCount} onClick={onCopyOpen}>
          <CopyIcon />
          {t('list.copy-open')}
        </Button>
      </div>
      <p className='px-2 pb-1 text-xs text-muted-foreground'>{t(modeKey[mode])}</p>
      {unplaced.length + placed.length === 0 ? (
        <p className='px-2 py-3 text-sm text-muted-foreground'>{t('list.empty')}</p>
      ) : (
        <ul className='max-h-64 overflow-y-auto'>
          {unplaced.length > 0 && <li className='px-2 pb-1 pt-2 text-xs font-medium text-destructive'>{t('list.unplaced')}</li>}
          {unplaced.map(renderRow)}
          {unplaced.length > 0 && placed.length > 0 && (
            <li className='px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground'>{t('list.on-page')}</li>
          )}
          {placed.map(renderRow)}
        </ul>
      )}
    </div>
  );
};

export default CommentListUi;
