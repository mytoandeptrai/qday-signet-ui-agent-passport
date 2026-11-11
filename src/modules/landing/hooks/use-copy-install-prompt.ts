import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { INSTALL_PROMPT } from '@/mock/landing';

export const useCopyInstallPrompt = (message: string, resetMs: number) => {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = () => {
    navigator.clipboard?.writeText(INSTALL_PROMPT).catch(() => undefined);
    toast.success(message);
    setIsCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIsCopied(false), resetMs);
  };

  return { isCopied, onCopy };
};
