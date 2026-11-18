import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

interface ShopQuantityStepperUiProps {
  name: string;
  quantity: number;
  max: number;
  className?: string;
  onChange: (quantity: number) => void;
}

const ShopQuantityStepperUi = ({ name, quantity, max, className, onChange }: ShopQuantityStepperUiProps) => {
  const { t } = useTranslation('shopping-page');
  return (
    <div className={cn('flex items-center justify-between rounded-md border', className)}>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        aria-label={t('stepper.decrease', { name })}
        onClick={() => onChange(quantity - 1)}
      >
        <MinusIcon />
      </Button>
      <span aria-label={t('stepper.quantity', { name })} className='min-w-8 text-center text-body tabular-nums'>
        {quantity}
      </span>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        aria-label={t('stepper.increase', { name })}
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default ShopQuantityStepperUi;
