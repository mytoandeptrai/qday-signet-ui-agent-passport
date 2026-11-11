import type { Reply } from '@/apis/comments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/integrations/i18n';
import { useCommentThread } from '../../hooks';

type CommentThreadUiProps = {
  id: string;
  loadReplies: (id: string) => Promise<Reply[] | null>;
  addReply: (id: string, text: string) => Promise<Reply | null>;
};

const CommentThreadUi = ({ id, loadReplies, addReply }: CommentThreadUiProps) => {
  const { t } = useTranslation('comments');
  const { replies, text, isSending, onTextChange, onSend } = useCommentThread({ id, loadReplies, addReply });

  return (
    <div className='space-y-2 border-t border-border pt-2'>
      {replies === null ? (
        <p className='text-xs text-muted-foreground'>{t('thread.loading')}</p>
      ) : (
        replies.map((reply) => (
          <div key={reply.id}>
            <p className='whitespace-pre-wrap break-words text-sm'>{reply.text}</p>
            <p className='text-xs text-muted-foreground'>{new Date(reply.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
      <div className='flex items-end gap-2'>
        <Textarea
          value={text}
          disabled={isSending}
          placeholder={t('thread.placeholder')}
          aria-label={t('thread.aria')}
          className='min-h-[40px] px-3 py-2'
          rows={2}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void onSend();
          }}
        />
        <Button size='sm' disabled={isSending || !text.trim()} onClick={() => void onSend()}>
          {isSending ? t('thread.sending') : t('thread.submit')}
        </Button>
      </div>
    </div>
  );
};

export default CommentThreadUi;
