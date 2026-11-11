import { useEffect, useState } from 'react';
import type { Reply } from '@/apis/comments';

type UseCommentThreadParams = {
  id: string;
  loadReplies: (id: string) => Promise<Reply[] | null>;
  addReply: (id: string, text: string) => Promise<Reply | null>;
};

export const useCommentThread = ({ id, loadReplies, addReply }: UseCommentThreadParams) => {
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let alive = true;
    setReplies(null);
    void loadReplies(id).then((loaded) => alive && setReplies(loaded ?? []));
    return () => {
      alive = false;
    };
  }, [id, loadReplies]);

  const onSend = async () => {
    const value = text.trim();
    if (!value || isSending) return;
    setIsSending(true);
    const reply = await addReply(id, value);
    setIsSending(false);
    // On failure the text stays in the box so it isn't lost.
    if (!reply) return;
    setText('');
    setReplies((list) => [...(list ?? []), reply]);
  };

  return { replies, text, isSending, onTextChange: setText, onSend };
};
