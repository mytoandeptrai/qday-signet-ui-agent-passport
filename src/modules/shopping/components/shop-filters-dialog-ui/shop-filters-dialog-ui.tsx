import { type ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import {
  MAX_TAGS,
  type ShopFilters,
  filtersToQuery,
  isValidMaxPrice,
  searchProducts,
  shopCategories,
  shopCountries,
  shopMerchants,
  shopTags,
} from '../../utils';

const PRICE_PRESETS = ['10', '25', '50'];

const chipClass = (active: boolean) =>
  cn(
    'border px-2.5 py-1.5 text-body transition-colors disabled:cursor-not-allowed disabled:opacity-40',
    active ? 'border-brand text-foreground' : 'text-muted-foreground hover:text-foreground'
  );

const Section = ({
  title,
  aside,
  hint,
  children,
}: {
  title: string;
  aside?: string;
  hint?: string;
  children: ReactNode;
}) => (
  <section className='border-b py-4 first:pt-0 last:border-b-0'>
    <div className='flex items-baseline justify-between gap-3'>
      <h3 className='text-body font-medium'>{title}</h3>
      {aside && <span className='text-small text-muted-foreground'>{aside}</span>}
    </div>
    {hint && <p className='mt-0.5 text-small text-muted-foreground'>{hint}</p>}
    <div className='mt-3'>{children}</div>
  </section>
);

interface ShopFiltersDialogUiProps {
  open: boolean;
  applied: ShopFilters;
  search: string;
  chainId: string;
  token: string;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: ShopFilters) => void;
}

const ShopFiltersDialogUi = ({
  open,
  applied,
  search,
  chainId,
  token,
  onOpenChange,
  onApply,
}: ShopFiltersDialogUiProps) => {
  const { t } = useTranslation('shopping-page');
  const [draft, setDraft] = useState<ShopFilters>(applied);
  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when the dialog opens
  useEffect(() => {
    if (open) setDraft(applied);
  }, [open]);

  const priceError = !isValidMaxPrice(draft.maxPrice);
  const matches = searchProducts(filtersToQuery(search, draft, chainId, 1)).total;
  const set = (change: Partial<ShopFilters>) => setDraft((d) => ({ ...d, ...change }));
  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  const price = draft.maxPrice.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90dvh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('filters.title')}</DialogTitle>
          <DialogDescription>{t('filters.description')}</DialogDescription>
        </DialogHeader>
        <div>
          <Section title={t('filters.category')}>
            <div className='flex flex-wrap gap-1.5' role='group' aria-label={t('filters.category')}>
              {[undefined, ...shopCategories(chainId)].map((c) => (
                <button
                  key={c ?? 'all'}
                  type='button'
                  aria-pressed={draft.category === c}
                  onClick={() => set({ category: c })}
                  className={chipClass(draft.category === c)}
                >
                  {c ?? t('categories.all')}
                </button>
              ))}
            </div>
          </Section>
          <Section title={t('filters.price')}>
            <div className='relative'>
              <Input
                inputMode='decimal'
                aria-label={t('filters.price-aria', { token })}
                placeholder={t('filters.price-placeholder')}
                value={draft.maxPrice}
                aria-invalid={priceError || undefined}
                onChange={(e) => set({ maxPrice: e.target.value })}
                className='pr-16'
              />
              <span
                aria-hidden='true'
                className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-small text-muted-foreground'
              >
                {token}
              </span>
            </div>
            {priceError ? (
              <p role='alert' className='mt-1.5 text-small text-destructive'>
                {t('filters.price-error')}
              </p>
            ) : (
              <div className='mt-2.5 flex gap-1.5' role='group' aria-label={t('filters.presets')}>
                {PRICE_PRESETS.map((value) => (
                  <button
                    key={value}
                    type='button'
                    aria-pressed={price === value}
                    onClick={() => set({ maxPrice: price === value ? '' : value })}
                    className={chipClass(price === value)}
                  >
                    {t('filters.under', { value })}
                  </button>
                ))}
              </div>
            )}
          </Section>
          <Section
            title={t('filters.tags')}
            aside={
              draft.tags.length > 0 ? t('filters.tags-count', { count: draft.tags.length, max: MAX_TAGS }) : undefined
            }
            hint={t('filters.tags-hint')}
          >
            <div className='flex flex-wrap gap-1.5' role='group' aria-label={t('filters.tags')}>
              {shopTags(chainId).map((tag) => {
                const on = draft.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type='button'
                    aria-pressed={on}
                    disabled={!on && draft.tags.length >= MAX_TAGS}
                    onClick={() => set({ tags: toggle(draft.tags, tag) })}
                    className={chipClass(on)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </Section>
          <Section
            title={t('filters.shops')}
            aside={
              draft.merchantIds.length > 0 ? t('filters.shops-count', { count: draft.merchantIds.length }) : undefined
            }
            hint={t('filters.shops-hint')}
          >
            <div className='flex flex-wrap gap-1.5' role='group' aria-label={t('filters.shops')}>
              {shopMerchants(chainId).map((m) => {
                const on = draft.merchantIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type='button'
                    aria-pressed={on}
                    onClick={() => set({ merchantIds: toggle(draft.merchantIds, m.id) })}
                    className={chipClass(on)}
                  >
                    {m.name} <span className='text-muted-foreground'>{m.count}</span>
                  </button>
                );
              })}
            </div>
          </Section>
          <Section title={t('filters.ships-to')} hint={t('filters.ships-hint')}>
            <div className='flex flex-wrap gap-1.5' role='group' aria-label={t('filters.ships-to')}>
              {[undefined, ...shopCountries].map((c) => (
                <button
                  key={c?.code ?? 'anywhere'}
                  type='button'
                  aria-pressed={draft.location === c?.code}
                  onClick={() => set({ location: c?.code })}
                  className={chipClass(draft.location === c?.code)}
                >
                  {c?.name ?? t('filters.anywhere')}
                </button>
              ))}
            </div>
          </Section>
        </div>
        <DialogFooter className='items-center sm:justify-between'>
          <p role='status' className='text-small text-muted-foreground'>
            {!priceError && matches === 0 ? t('filters.no-match') : ''}
          </p>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setDraft((d) => ({ sort: d.sort, tags: [], maxPrice: '', merchantIds: [] }))}
            >
              {t('filters.reset')}
            </Button>
            <Button
              type='button'
              disabled={priceError || matches === 0}
              onClick={() => {
                onApply({ ...draft, maxPrice: price });
                onOpenChange(false);
              }}
            >
              {t('filters.apply')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShopFiltersDialogUi;
