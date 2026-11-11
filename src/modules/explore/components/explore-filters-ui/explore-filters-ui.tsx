import { SearchInput } from '@/components/app/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { SORTS } from '../../hooks/schema';

type ExploreFiltersUiProps = {
  search: string;
  sort: (typeof SORTS)[number];
  category: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: (typeof SORTS)[number]) => void;
  onCategoryChange: (value: string) => void;
};

const ExploreFiltersUi = ({
  search,
  sort,
  category,
  categories,
  onSearchChange,
  onSortChange,
  onCategoryChange,
}: ExploreFiltersUiProps) => {
  const { t } = useTranslation('explore-page');

  return (
    <>
      <div className='mt-8 flex flex-wrap gap-3'>
        <SearchInput
          containerClassName='w-full sm:w-80'
          placeholder={t('search-placeholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t('search-placeholder')}
        />
        <Select value={sort} onValueChange={(v) => onSortChange(v as (typeof SORTS)[number])}>
          <SelectTrigger className='w-48' aria-label={t('sort.label')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`sort.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='mt-4 flex flex-wrap gap-1.5' role='tablist' aria-label={t('categories')}>
        {categories.map((c) => (
          <button
            key={c}
            type='button'
            role='tab'
            aria-selected={c === category}
            onClick={() => onCategoryChange(c)}
            className={cn(
              'border px-2.5 py-1.5 text-body transition-colors',
              c === category ? 'border-brand text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
};

export default ExploreFiltersUi;
