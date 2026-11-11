import { CheckIcon } from 'lucide-react';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { PIN_STYLE } from '../../utils';

type CommentPinUiProps = {
  number: number;
  left: number;
  top: number;
  isResolved: boolean;
  isOpen: boolean;
  replies?: number;
  onClick: () => void;
};

const CommentPinUi = ({ number, left, top, isResolved, isOpen, replies, onClick }: CommentPinUiProps) => {
  const { t } = useTranslation('comments');

  return (
    <button
      type='button'
      aria-label={t(isResolved ? 'pin.aria-resolved' : 'pin.aria', { number })}
      style={{ left, top }}
      className={cn(PIN_STYLE, isResolved && 'bg-muted text-muted-foreground opacity-70', isOpen && 'ring-4 ring-primary/25')}
      onClick={onClick}
    >
      {isResolved ? <CheckIcon className='size-3.5' /> : number}
      {!!replies && (
        <span className='absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-caption font-semibold text-background'>
          {replies}
        </span>
      )}
    </button>
  );
};

export default CommentPinUi;
