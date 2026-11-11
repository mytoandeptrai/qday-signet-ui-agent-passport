import { useTranslation } from '@/integrations/i18n';
import type { FCC } from '@/types';
import { clamp } from '../../utils';

type CommentCardUiProps = {
  left?: number;
  top?: number;
  /** Pins the card above the toolbar, for comments whose element can no longer be found. */
  corner?: boolean;
};

const WIDTH = 288;

const CommentCardUi: FCC<CommentCardUiProps> = ({ left = 0, top = 0, corner = false, children }) => {
  const { t } = useTranslation('comments');
  const cardTop = clamp(top + 14, 8, Math.max(8, window.innerHeight - 220));

  return (
    <div
      role='dialog'
      aria-label={t('card')}
      style={
        corner
          ? { right: 16, bottom: 72, width: WIDTH, maxHeight: window.innerHeight - 88 }
          : {
              left: clamp(left + 14, 8, Math.max(8, window.innerWidth - WIDTH - 8)),
              top: cardTop,
              width: WIDTH,
              maxHeight: window.innerHeight - cardTop - 8,
            }
      }
      className='pointer-events-auto fixed z-[100] overflow-y-auto rounded-2xl border border-border bg-card p-3 text-card-foreground shadow-lg'
    >
      {children}
    </div>
  );
};

export default CommentCardUi;
