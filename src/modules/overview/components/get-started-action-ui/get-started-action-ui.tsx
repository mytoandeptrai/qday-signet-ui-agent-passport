import { Button } from '@/components/ui/button';

type GetStartedActionUiProps = {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
};

const GetStartedActionUi = ({ text, actionLabel, onAction, children }: GetStartedActionUiProps) => (
  <div className='max-w-md text-body text-muted-foreground'>
    <p>{text}</p>
    {actionLabel && (
      <Button className='mt-4' variant='outline' onClick={onAction}>
        {actionLabel}
      </Button>
    )}
    {children && <div className='mt-4'>{children}</div>}
  </div>
);

export default GetStartedActionUi;
