import { MessageSquarePlusIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
  CommentCardUi,
  CommentComposerUi,
  CommentDetailUi,
  CommentListUi,
  CommentPinUi,
  CommentToolbarUi,
  PickOverlayUi,
} from '../../components';
import { useCommentLayerContainer } from '../../hooks';
import { PIN_STYLE, UI_ATTR } from '../../utils';

const CommentLayerContainer = () => {
  const {
    isMounted,
    mode,
    isSaving,
    isPicking,
    isListOpen,
    hoverRect,
    draft,
    draftAt,
    openId,
    opened,
    openedAt,
    openCount,
    rows,
    unplaced,
    placed,
    loadReplies,
    addReply,
    onSave,
    onCancelDraft,
    onPinClick,
    onCloseOpened,
    onDeleteOpened,
    onToggleResolvedOpened,
    onFocusComment,
    onCopyOpen,
    onTogglePicking,
    onToggleList,
    onOpenList,
  } = useCommentLayerContainer();

  if (!isMounted) return null;

  return createPortal(
    <div {...{ [UI_ATTR]: '' }}>
      {isPicking && <PickOverlayUi hoverRect={hoverRect} />}

      {rows.map(({ comment, number, at }) =>
        at ? (
          <CommentPinUi
            key={comment.id}
            number={number}
            left={at.left}
            top={at.top}
            isResolved={comment.resolved}
            isOpen={openId === comment.id}
            replies={comment.replies}
            onClick={() => onPinClick(comment.id)}
          />
        ) : null
      )}

      {draft && draftAt && (
        <>
          <span style={{ left: draftAt.left, top: draftAt.top }} className={cn(PIN_STYLE, 'pointer-events-none')}>
            <MessageSquarePlusIcon className='size-3.5' />
          </span>
          <CommentCardUi left={draftAt.left} top={draftAt.top}>
            <CommentComposerUi isSaving={isSaving} onSave={onSave} onCancel={onCancelDraft} />
          </CommentCardUi>
        </>
      )}

      {opened && (
        <CommentCardUi corner={!openedAt} left={openedAt?.left ?? 0} top={openedAt?.top ?? 0}>
          <CommentDetailUi
            comment={opened}
            mode={mode}
            isMissing={!openedAt}
            loadReplies={loadReplies}
            addReply={addReply}
            onClose={onCloseOpened}
            onDelete={onDeleteOpened}
            onToggleResolved={onToggleResolvedOpened}
          />
        </CommentCardUi>
      )}

      <div className='pointer-events-auto fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2'>
        {isListOpen && (
          <CommentListUi mode={mode} openCount={openCount} unplaced={unplaced} placed={placed} onFocus={onFocusComment} onCopyOpen={onCopyOpen} />
        )}
        <CommentToolbarUi
          isListOpen={isListOpen}
          isPicking={isPicking}
          openCount={openCount}
          unplacedCount={opened && !openedAt ? 0 : unplaced.length}
          onToggleList={onToggleList}
          onOpenList={onOpenList}
          onTogglePicking={onTogglePicking}
        />
      </div>
    </div>,
    document.body
  );
};

export default CommentLayerContainer;
