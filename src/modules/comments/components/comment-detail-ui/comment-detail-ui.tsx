import { CheckIcon, ExternalLinkIcon, RotateCcwIcon, Trash2Icon, XIcon } from 'lucide-react';
import type { PinComment, Reply } from '@/apis/comments';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { StoreMode } from '../../hooks';
import CommentThreadUi from '../comment-thread-ui';

type CommentDetailUiProps = {
  comment: PinComment;
  mode: StoreMode;
  isMissing: boolean;
  loadReplies: (id: string) => Promise<Reply[] | null>;
  addReply: (id: string, text: string) => Promise<Reply | null>;
  onClose: () => void;
  onDelete: () => void;
  onToggleResolved: () => void;
};

const CommentDetailUi = ({
  comment,
  mode,
  isMissing,
  loadReplies,
  addReply,
  onClose,
  onDelete,
  onToggleResolved,
}: CommentDetailUiProps) => {
  const { t } = useTranslation('comments');

  return (
    <div className='space-y-2'>
      {isMissing && <p className='rounded-lg bg-destructive/10 px-2 py-1 text-xs text-destructive'>{t('detail.missing')}</p>}
      <div className='flex items-start justify-between gap-2'>
        <p className='whitespace-pre-wrap break-words text-sm'>{comment.text}</p>
        <Button size='icon' variant='ghost' className='-mr-1 -mt-1 size-7 shrink-0' aria-label={t('detail.close')} onClick={onClose}>
          <XIcon />
        </Button>
      </div>
      <p className='text-xs text-muted-foreground'>
        {new Date(comment.createdAt).toLocaleString()}
        {comment.resolved ? ` · ${t('detail.resolved')}` : ''}
        {comment.url && (
          <>
            {' · '}
            <a
              href={comment.url}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-primary'
            >
              {t('detail.github')}
              <ExternalLinkIcon className='size-3' />
            </a>
          </>
        )}
      </p>
      {mode === 'remote' && <CommentThreadUi id={comment.id} loadReplies={loadReplies} addReply={addReply} />}
      <div className='flex justify-end gap-2'>
        <Button size='sm' variant='ghost' onClick={onDelete}>
          <Trash2Icon />
          {t('detail.delete')}
        </Button>
        <Button size='sm' variant='outline' onClick={onToggleResolved}>
          {comment.resolved ? (
            <>
              <RotateCcwIcon />
              {t('detail.reopen')}
            </>
          ) : (
            <>
              <CheckIcon />
              {t('detail.resolve')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CommentDetailUi;
