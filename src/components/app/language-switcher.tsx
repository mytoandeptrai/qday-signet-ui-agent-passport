import { CheckIcon, GlobeIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { t } = useTranslation('common');
  const { languages, current, onChangeLanguage } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('switchLanguage')}
        className={cn('flex items-center gap-1.5 outline-none transition-colors', className)}
      >
        <GlobeIcon className='size-4' strokeWidth={1.5} />
        <span className='hidden md:inline text-sm'>{current.nativeName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-40'>
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} lang={language.code} onSelect={() => onChangeLanguage(language.code)}>
            {language.nativeName}
            {language.code === current.code && <CheckIcon className='ml-auto' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
