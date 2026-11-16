import { ChevronRightIcon, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SettingsRowUiProps = {
  icon: LucideIcon;
  label: string;
  detail?: ReactNode;
  /** Replaces the chevron, e.g. a Switch. A row with `onClick` and no `right` shows the chevron. */
  right?: ReactNode;
  onClick?: () => void;
};

const rowClass = 'flex w-full items-center gap-3 px-4 py-3 text-left';

const SettingsRowUi = ({ icon: Icon, label, detail, right, onClick }: SettingsRowUiProps) => {
  const body = (
    <>
      <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='size-4' strokeWidth={1.4} />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block text-body'>{label}</span>
        {detail && <span className='block text-small text-muted-foreground'>{detail}</span>}
      </span>
      {right ?? (onClick && <ChevronRightIcon className='size-4 text-muted-foreground' />)}
    </>
  );
  return onClick ? (
    <Button
      type='button'
      variant='ghost'
      onClick={onClick}
      className={cn(rowClass, 'h-auto justify-start whitespace-normal rounded-none font-normal active:scale-100')}
    >
      {body}
    </Button>
  ) : (
    <div className={rowClass}>{body}</div>
  );
};

export default SettingsRowUi;
