import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  createComment,
  createReply,
  deleteComment,
  getCommentList,
  getReplyList,
  type NewComment,
  type PinComment,
  type Reply,
  setCommentResolved,
} from '@/apis/comments';
import { useTranslation } from '@/integrations/i18n';
import { loadLocal, newId, saveLocal, STORAGE_KEY } from '../utils';

/** "remote": stored as GitHub Issues. "local": no server token, so this browser only. */
export type StoreMode = 'loading' | 'remote' | 'local';

export const useCommentStore = (enabled: boolean) => {
  const { t } = useTranslation('comments');
  const [comments, setComments] = useState<PinComment[]>([]);
  const [mode, setMode] = useState<StoreMode>('loading');
  const modeRef = useRef<StoreMode>('loading');
  const failedLoad = useRef(false);

  const applyMode = (next: StoreMode) => {
    modeRef.current = next;
    setMode(next);
  };

  const refresh = useCallback(async () => {
    try {
      const result = await getCommentList();
      failedLoad.current = false;
      if (result.configured) {
        applyMode('remote');
        setComments(result.comments);
      } else {
        applyMode('local');
        setComments(loadLocal());
      }
    } catch {
      // Keep whatever is on screen; only tell the user once per outage.
      if (!failedLoad.current) toast.error(t('toasts.load-failed'));
      failedLoad.current = true;
      if (modeRef.current === 'loading') applyMode('local');
    }
  }, [t]);

  // Comments are read after hydration only, and again whenever the tab regains focus
  // so changes made on another machine show up without a manual reload.
  useEffect(() => {
    if (!enabled) return;
    void refresh();
    const onVisible = () => document.visibilityState === 'visible' && void refresh();
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && modeRef.current === 'local' && setComments(loadLocal());
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
    };
  }, [enabled, refresh]);

  const mutateLocal = (next: (list: PinComment[]) => PinComment[]) =>
    setComments((list) => {
      const result = next(list);
      saveLocal(result);
      return result;
    });

  /** Resolves with the saved comment, or null if it could not be saved. */
  const add = async (input: NewComment): Promise<PinComment | null> => {
    if (modeRef.current !== 'remote') {
      const comment: PinComment = { id: newId(), ...input, resolved: false, createdAt: Date.now() };
      mutateLocal((list) => [...list, comment]);
      return comment;
    }
    try {
      const comment = await createComment(input);
      setComments((list) => [...list, comment]);
      return comment;
    } catch {
      toast.error(t('toasts.save-failed'));
      return null;
    }
  };

  // Resolve and delete update the screen first and roll back if GitHub rejects the change.
  const optimistic = async (next: (list: PinComment[]) => PinComment[], remote: () => Promise<unknown>, failure: string) => {
    if (modeRef.current !== 'remote') return mutateLocal(next);
    let previous: PinComment[] = [];
    setComments((list) => {
      previous = list;
      return next(list);
    });
    try {
      await remote();
    } catch {
      setComments(previous);
      toast.error(failure);
    }
  };

  const setResolved = (id: string, resolved: boolean) =>
    optimistic(
      (list) => list.map((c) => (c.id === id ? { ...c, resolved } : c)),
      () => setCommentResolved(id, resolved),
      t('toasts.update-failed')
    );

  const remove = (id: string) =>
    optimistic(
      (list) => list.filter((c) => c.id !== id),
      () => deleteComment(id),
      t('toasts.delete-failed')
    );

  // Replies exist only for comments stored on GitHub; they are fetched when a pin is opened.
  const loadReplies = useCallback(
    async (id: string): Promise<Reply[] | null> => {
      try {
        return await getReplyList(id);
      } catch {
        toast.error(t('toasts.replies-failed'));
        return null;
      }
    },
    [t]
  );

  const addReply = useCallback(
    async (id: string, text: string): Promise<Reply | null> => {
      try {
        const reply = await createReply(id, text);
        setComments((list) => list.map((c) => (c.id === id ? { ...c, replies: (c.replies ?? 0) + 1 } : c)));
        return reply;
      } catch {
        toast.error(t('toasts.reply-failed'));
        return null;
      }
    },
    [t]
  );

  return { comments, mode, add, setResolved, remove, loadReplies, addReply };
};
