import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLAttributes } from 'react';

export interface AnimationContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds to wait before animating; use index * 0.08 to stagger a list. */
  delay?: number;
  /** Slide in from above instead of from below. */
  reverse?: boolean;
  /** Animate every time it scrolls into view, not just the first. */
  repeat?: boolean;
}

/** Fades and slides its children in when they scroll into view. Shows them straight away under `prefers-reduced-motion`. */
export function AnimationContainer({ children, delay = 0, reverse, repeat, className, ...props }: AnimationContainerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: '0px 0px -8% 0px' }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 26 }}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}
