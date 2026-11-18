import { SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { ALL_MERCHANTS, SHOP_SORTS, type ShopSort } from '../../utils';

export interface ShopFilterChip {
  key: string;
  label: string;
  remove: () => void;
}

interface ShopSearchUiProps {
  search: string;
  sort: ShopSort;
  searching: boolean;
  category?: string;
  categories: string[];
  merchants: { id: string; name: string }[];
  merchantId: string;
  filterCount: number;
  chips: ShopFilterChip[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: ShopSort) => void;
  onCategoryChange: (value?: string) => void;
  onMerchantChange: (value: string) => void;
  onOpenFilters: () => void;
}

const ShopSearchUi = ({
  search,
  sort,
  searching,
  category,
  categories,
  merchants,
  merchantId,
  filterCount,
  chips,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  onMerchantChange,
  onOpenFilters,
}: ShopSearchUiProps) => {
  const { t } = useTranslation('shopping-page');
  return (
    <>
      <div className='flex flex-wrap gap-3'>
        <SearchInput
          containerClassName='w-full sm:w-80'
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          value={search}
          maxLength={200}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select value={merchantId} onValueChange={onMerchantChange}>
          <SelectTrigger className='w-48' aria-label={t('merchant.label')}>
            <SelectValue placeholder={t('merchant.several')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_MERCHANTS}>{t('merchant.all')}</SelectItem>
            {merchants.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => onSortChange(v as ShopSort)}>
          <SelectTrigger className='w-48' aria-label={t('sort.label')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHOP_SORTS.map((s) => (
              <SelectItem key={s} value={s} disabled={s === 'relevance' && !searching}>
                {t(`sort.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type='button'
          variant='outline'
          aria-label={filterCount > 0 ? t('filters.applied', { count: filterCount }) : t('filters.button')}
          onClick={onOpenFilters}
        >
          <SlidersHorizontalIcon />
          {t('filters.button')}
          {filterCount > 0 && <span aria-hidden='true'>{filterCount}</span>}
        </Button>
      </div>
      <div className='mt-4 flex flex-wrap gap-1.5' role='group' aria-label={t('categories.label')}>
        {[undefined, ...categories].map((c) => (
          <button
            key={c ?? 'all'}
            type='button'
            aria-pressed={category === c}
            onClick={() => onCategoryChange(c)}
            className={cn(
              'border px-2.5 py-1.5 text-body transition-colors',
              category === c ? 'border-brand text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {c ?? t('categories.all')}
          </button>
        ))}
      </div>
      {chips.length > 0 && (
        <ul className='mt-3 flex flex-wrap gap-1.5' aria-label={t('chips.label')}>
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type='button'
                aria-label={t('chips.remove', { label: chip.label })}
                onClick={chip.remove}
                className='flex items-center gap-1 border border-brand px-2 py-1 text-small'
              >
                {chip.label}
                <XIcon className='size-3' aria-hidden='true' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ShopSearchUi;
