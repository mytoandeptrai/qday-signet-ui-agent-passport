import { SiteFooter } from '@/components/landing/site-footer';
import { SiteHeader } from '@/components/landing/site-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SearchInput } from '@/components/app/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { listServices, type ServiceQuery } from '@/mock/api';
import { SERVICE_CATEGORIES, SERVICES } from '@/mock/services';
import { usePassportStore } from '@/stores/passport-store';
import type { Service } from '@/types/passport';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/explore')({ component: Explore });

function Explore() {
  const signedIn = usePassportStore((s) => Boolean(s.user));
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<NonNullable<ServiceQuery['sort']>>('popular');
  const [picked, setPicked] = useState<Service | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  const { data = [], isFetching } = useQuery({
    queryKey: ['services', debounced, category, sort],
    queryFn: () => listServices({ search: debounced, category, sort }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className='min-h-screen bg-background'>
      <SiteHeader />
      <main className='mx-auto max-w-[1100px] px-4 py-14 md:px-6'>
        <h1 className='font-serif text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-light tracking-[-0.016em]'>Explore services</h1>
        <p className='mt-3 text-muted-foreground'>2,000+ services your agent can pay for. Showing {SERVICES.length} featured.</p>

        <div className='mt-8 flex flex-wrap gap-3'>
          <SearchInput containerClassName='w-full sm:w-80' placeholder='Search services' value={search} onChange={(e) => setSearch(e.target.value)} aria-label='Search services' />
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className='w-48' aria-label='Sort'><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='popular'>Most popular</SelectItem>
              <SelectItem value='name'>Name</SelectItem>
              <SelectItem value='price-asc'>Price: low to high</SelectItem>
              <SelectItem value='price-desc'>Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='mt-4 flex flex-wrap gap-1.5' role='tablist' aria-label='Categories'>
          {SERVICE_CATEGORIES.map((c) => (
            <button key={c} type='button' role='tab' aria-selected={c === category} onClick={() => setCategory(c)} className={cn('border px-2.5 py-1.5 text-[13px] transition-colors', c === category ? 'border-brand text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              {c}
            </button>
          ))}
        </div>

        <div className={cn('mt-8 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3', isFetching && 'opacity-70')}>
          {data.map((s) => (
            <button key={s.id} type='button' onClick={() => setPicked(s)} className='bg-background p-5 text-left transition-colors hover:bg-subtle'>
              <div className='flex items-baseline justify-between gap-3'>
                <b className='font-serif text-[22px] leading-[1.2] font-light'>{s.name}</b>
                <span className='text-[13px] tabular-nums text-text-3'>{s.priceLabel}</span>
              </div>
              <p className='mt-2 text-sm text-muted-foreground'>{s.description}</p>
              <div className='mt-3 text-xs text-text-3'>{s.category} · {s.provider}</div>
            </button>
          ))}
        </div>
        {data.length === 0 && <p className='py-16 text-center text-muted-foreground'>No services match “{debounced}”.</p>}
      </main>
      <SiteFooter />

      <Dialog open={Boolean(picked)} onOpenChange={(o) => !o && setPicked(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{picked?.name}</DialogTitle>
            <DialogDescription>{picked?.description}</DialogDescription>
          </DialogHeader>
          {picked && (
            <dl className='grid grid-cols-[100px_1fr] gap-y-2 text-sm'>
              <dt className='text-muted-foreground'>Price</dt><dd className='tabular-nums'>{picked.priceLabel}</dd>
              <dt className='text-muted-foreground'>Category</dt><dd>{picked.category}</dd>
              <dt className='text-muted-foreground'>Provider</dt><dd>{picked.provider}</dd>
            </dl>
          )}
          <DialogFooter>
            {signedIn ? (
              <Button asChild className='rounded-none' onClick={() => toast.success(`${picked?.name} added to your next session`)}>
                <Link to='/create-session'>Use in a session</Link>
              </Button>
            ) : (
              <Button asChild className='rounded-none'><Link to='/login' search={{ redirect: '/explore' }}>Sign in to use</Link></Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
