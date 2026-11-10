import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Keeps the custom type scale (see styles.css) from being merged away as a text colour. */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['caption', 'small', 'body', 'lead', 'title', 'figure'] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
