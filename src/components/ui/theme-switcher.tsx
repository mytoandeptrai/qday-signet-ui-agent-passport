'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@/integrations/theme/theme-context';
import { useTheme } from '@/integrations/theme/theme-context';
import { cn } from '@/lib/utils';

const OPTIONS: { value: Theme; icon: typeof Sun; labelKey: string }[] = [
  { value: 'light', icon: Sun, labelKey: 'labels.light' },
  { value: 'dark', icon: Moon, labelKey: 'labels.dark' },
  { value: 'system', icon: Monitor, labelKey: 'labels.system' },
];

export default function ThemeSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div role='radiogroup' aria-label={t('common:labels.theme')} className={cn('inline-flex gap-1 rounded-lg border bg-muted/50 p-1', className)}>
      {OPTIONS.map(({ value, icon: Icon, labelKey }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type='button'
            role='radio'
            aria-checked={isActive}
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium text-body transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              isActive ? 'bg-background text-foreground shadow-xs dark:bg-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className='size-4' />
            <span>{t(`common:${labelKey}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
