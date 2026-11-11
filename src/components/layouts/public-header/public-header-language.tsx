import { CheckIcon, GlobeIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/integrations/i18n';
import type { LANGUAGES } from '@/integrations/i18n';

interface PublicHeaderLanguageProps {
  languages: typeof LANGUAGES;
  current: (typeof LANGUAGES)[number];
  onChange: (code: string) => void;
}

const PublicHeaderLanguage = ({ languages, current, onChange }: PublicHeaderLanguageProps) => {
  const { t } = useTranslation('public-layout');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('header.language')}
        className='flex items-center gap-1.5 text-foreground/80 outline-none transition-colors hover:text-foreground'
      >
        <GlobeIcon className='size-4' strokeWidth={1.5} />
        <span className='hidden md:inline'>{current.nativeName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-40'>
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} lang={language.code} onSelect={() => onChange(language.code)}>
            {language.nativeName}
            {language.code === current.code && <CheckIcon className='ml-auto' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PublicHeaderLanguage;
