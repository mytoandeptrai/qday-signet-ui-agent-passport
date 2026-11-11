import { useRouterState } from '@tanstack/react-router';
import { useEffect, useReducer, useState } from 'react';
import { toast } from 'sonner';
import type { PinComment } from '@/apis/comments';
import { useTranslation } from '@/integrations/i18n';
import { asElement, clamp, type Draft, isUi, locate, selectorFor } from '../utils';
import { useCommentStore } from './use-comment-store';

export const useCommentLayerContainer = () => {
  const { t } = useTranslation('comments');
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { comments, mode, add, setResolved, remove, loadReplies, addReply } = useCommentStore(isMounted);
  const [isPicking, setIsPicking] = useState(false);
  const [hoverEl, setHoverEl] = useState<Element | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [, relayout] = useReducer((n: number) => n + 1, 0);

  // Comments are loaded after hydration only.
  useEffect(() => setIsMounted(true), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset whenever the route changes
  useEffect(() => {
    setDraft(null);
    setOpenId(null);
    setIsPicking(false);
    setIsListOpen(false);
  }, [pathname]);

  // Pins are fixed-positioned, so they are re-measured whenever the page moves or changes.
  useEffect(() => {
    if (!isMounted) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(relayout);
    };
    const mutations = new MutationObserver((records) => {
      if (records.some((r) => !isUi(asElement(r.target)))) schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [isMounted]);

  // Pick mode: highlight the hovered element and turn the next click into a draft comment.
  useEffect(() => {
    if (!isPicking) {
      setHoverEl(null);
      return;
    }
    document.documentElement.classList.add('comment-picking');
    const onMove = (e: PointerEvent) => {
      const target = asElement(e.target);
      const root = document.documentElement;
      setHoverEl(target && target !== root && !isUi(target) ? target : null);
    };
    // The page must not react while picking (links, buttons, menus opening on pointerdown…).
    const block = (e: Event) => {
      if (isUi(asElement(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onClick = (e: MouseEvent) => {
      const target = asElement(e.target);
      if (!target || isUi(target)) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = target.getBoundingClientRect();
      setDraft({
        selector: selectorFor(target),
        x: rect.width ? clamp((e.clientX - rect.left) / rect.width, 0, 1) : 0.5,
        y: rect.height ? clamp((e.clientY - rect.top) / rect.height, 0, 1) : 0.5,
      });
      setOpenId(null);
      setIsListOpen(false);
      setIsPicking(false);
    };
    const blocked = ['pointerdown', 'pointerup', 'mousedown', 'mouseup'];
    document.addEventListener('pointermove', onMove, true);
    blocked.forEach((type) => document.addEventListener(type, block, true));
    document.addEventListener('click', onClick, true);
    return () => {
      document.documentElement.classList.remove('comment-picking');
      document.removeEventListener('pointermove', onMove, true);
      blocked.forEach((type) => document.removeEventListener(type, block, true));
      document.removeEventListener('click', onClick, true);
    };
  }, [isPicking]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsPicking(false);
      setDraft(null);
      setOpenId(null);
      setIsListOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pageComments = comments.filter((c) => c.route === pathname).sort((a, b) => a.createdAt - b.createdAt);
  const numberOf = (id: string) => pageComments.findIndex((c) => c.id === id) + 1;
  const rows = pageComments.map((comment) => {
    const at = locate(comment.selector, comment.x, comment.y);
    return { comment, number: numberOf(comment.id), at, isMissing: !at };
  });
  // Open comments whose element was removed or changed; they stay reachable from the corner.
  const unplaced = rows.filter((r) => !r.comment.resolved && r.isMissing);
  const placed = rows.filter((r) => !unplaced.includes(r));
  const opened = pageComments.find((c) => c.id === openId) ?? null;
  const openedAt = opened && locate(opened.selector, opened.x, opened.y);
  const draftAt = draft && locate(draft.selector, draft.x, draft.y);
  const hoverRect = hoverEl?.getBoundingClientRect() ?? null;
  const openCount = pageComments.filter((c) => !c.resolved).length;

  const onSave = async (text: string) => {
    if (!draft) return;
    setIsSaving(true);
    const saved = await add({ route: pathname, ...draft, text });
    setIsSaving(false);
    // On failure the draft stays open so the text isn't lost.
    if (!saved) return;
    setDraft(null);
    setOpenId(saved.id);
  };

  const onFocusComment = (c: PinComment) => {
    setDraft(null);
    setOpenId(c.id);
    setIsListOpen(false);
    locate(c.selector, c.x, c.y)?.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const onCopyOpen = async () => {
    const open = pageComments.filter((c) => !c.resolved);
    const payload = open.map(({ route, selector, x, y, text }) => ({ route, selector, x, y, text }));
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      toast.success(t('toasts.copied', { count: open.length }));
    } catch {
      toast.error(t('toasts.copy-failed'));
    }
  };

  const onTogglePicking = () => {
    setIsPicking((v) => !v);
    setDraft(null);
    setOpenId(null);
    setIsListOpen(false);
  };

  return {
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
    onCancelDraft: () => setDraft(null),
    onPinClick: (id: string) => {
      setDraft(null);
      setOpenId(openId === id ? null : id);
    },
    onCloseOpened: () => setOpenId(null),
    onDeleteOpened: () => {
      if (!opened) return;
      void remove(opened.id);
      setOpenId(null);
    },
    onToggleResolvedOpened: () => opened && void setResolved(opened.id, !opened.resolved),
    onFocusComment,
    onCopyOpen,
    onTogglePicking,
    onToggleList: () => setIsListOpen((v) => !v),
    onOpenList: () => setIsListOpen(true),
  };
};
