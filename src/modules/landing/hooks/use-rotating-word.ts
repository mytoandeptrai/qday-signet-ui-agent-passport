import { useEffect, useState } from 'react';

export const useRotatingWord = (words: string[]) => {
  const [index, setIndex] = useState(0);
  const [isOut, setIsOut] = useState(false);

  useEffect(() => {
    if (index >= words.length - 1) return;
    const timeout = window.setTimeout(() => {
      setIsOut(true);
      window.setTimeout(() => {
        setIndex((n) => n + 1);
        setIsOut(false);
      }, 420);
    }, 2200);
    return () => window.clearTimeout(timeout);
  }, [index, words.length]);

  return { word: words[index], isOut };
};
