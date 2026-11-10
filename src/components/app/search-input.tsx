import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

type Props = Omit<React.ComponentProps<'input'>, 'prefix'> & { containerClassName?: string };

export function SearchInput({ containerClassName, className, ...props }: Props) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search aria-hidden='true' className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
      <Input type='search' className={cn('pl-9', className)} {...props} />
    </div>
  );
}
