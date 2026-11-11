export const UI_ATTR = 'data-comment-ui';

export type Draft = { selector: string; x: number; y: number };

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const isUi = (el: Element | null) => !!el?.closest(`[${UI_ATTR}]`);
export const asElement = (target: EventTarget | null) => (target instanceof Element ? target : null);

/** Builds a selector from stable ids where possible, otherwise from tag + nth-of-type. */
export const selectorFor = (el: Element): string => {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && node !== document.documentElement) {
    // Generated ids (React useId, Radix) change between renders, so they can't anchor a comment.
    if (node.id && !/[:]|^radix-/.test(node.id) && document.querySelectorAll(`#${CSS.escape(node.id)}`).length === 1) {
      parts.unshift(`#${CSS.escape(node.id)}`);
      return parts.join(' > ');
    }
    const current: Element = node;
    const parent: Element | null = current.parentElement;
    const tag = current.tagName.toLowerCase();
    if (!parent) break;
    const index = Array.from(parent.children).filter((c) => c.tagName === current.tagName).indexOf(current) + 1;
    parts.unshift(`${tag}:nth-of-type(${index})`);
    node = parent;
  }
  return parts.length ? `body > ${parts.join(' > ')}` : 'body';
};

export const locate = (selector: string, x: number, y: number) => {
  let el: Element | null = null;
  try {
    el = document.querySelector(selector);
  } catch {
    return null;
  }
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return { el, left: rect.left + rect.width * x, top: rect.top + rect.height * y };
};

export type Located = NonNullable<ReturnType<typeof locate>>;

export const PIN_STYLE =
  'pointer-events-auto fixed z-[100] grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-card bg-primary text-[11px] font-semibold text-primary-foreground shadow-md transition-transform hover:scale-110';
