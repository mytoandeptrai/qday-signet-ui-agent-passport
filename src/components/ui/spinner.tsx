import { Loader2Icon } from 'lucide-react';

import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  const { t } = useTranslation();
  return (
    <Loader2Icon
      role='status'
      aria-label={t('a11y.loading')}
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
