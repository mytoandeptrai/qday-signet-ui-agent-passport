import { Button } from '@/components/ui/button';

interface MoveFundsNeedsSignetPassUiProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const MoveFundsNeedsSignetPassUi = ({ message, actionLabel, onAction }: MoveFundsNeedsSignetPassUiProps) => (
  <div className='flex flex-col items-start gap-3'>
    <p className='text-body text-muted-foreground'>{message}</p>
    <Button onClick={onAction}>{actionLabel}</Button>
  </div>
);

export default MoveFundsNeedsSignetPassUi;
