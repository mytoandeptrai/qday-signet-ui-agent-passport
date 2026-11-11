import type { PinComment } from '@/apis/comments';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

type CommentRowUiProps = {
  comment: PinComment;
  number: number;
  isMissing: boolean;
  onClick: (comment: PinComment) => void;
};

const CommentRowUi = ({ comment, number, isMissing, onClick }: CommentRowUiProps) => {
  const { t } = useTranslation('comments');

  return (
    <li>
      <button
        type='button'
        className='flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-secondary'
        onClick={() => onClick(comment)}
      >
        <span
          className={cn(
            'grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground',
            comment.resolved && 'bg-muted text-muted-foreground'
          )}
        >
          {number}
        </span>
        <span className='min-w-0 flex-1'>
          <span className={cn('line-clamp-2 text-sm', comment.resolved && 'text-muted-foreground line-through')}>{comment.text}</span>
          {!!comment.replies && (
            <span className='block text-xs text-muted-foreground'>{t('list.reply', { count: comment.replies })}</span>
          )}
          {isMissing && <span className='block text-xs text-destructive'>{t('list.not-found')}</span>}
        </span>
      </button>
    </li>
  );
};

export default CommentRowUi;
