import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletGate from '@/components/ui/wallet-gate';
import {
  ShopCartUi,
  ShopFiltersDialogUi,
  ShopOrdersUi,
  ShopProductDialogUi,
  ShopProductGridUi,
  ShopSearchUi,
} from '../../components';
import { useShoppingContainer } from '../../hooks';

const ShoppingContainer = () => {
  const s = useShoppingContainer();
  const { t } = s;

  if (!s.isTestnet) {
    return (
      <div>
        <PageHeader title={t('title')} />
        <p className='text-body text-muted-foreground'>{t('coming-soon')}</p>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-275'>
      <PageHeader title={t('title')} description={t('description')} />
      <WalletGate>
        {!s.ready ? (
          <Skeleton className='h-60' />
        ) : (
          <>
            <Tabs value={s.tab} onValueChange={s.onTabChange} className='gap-6'>
              <TabsList className='w-fit'>
                <TabsTrigger value='browse'>{t('tabs.browse')}</TabsTrigger>
                <TabsTrigger value='cart'>
                  {t('tabs.cart')}
                  {s.count > 0 && <span className='opacity-80'>{s.count}</span>}
                </TabsTrigger>
                <TabsTrigger value='orders'>
                  {t('tabs.orders')}
                  {s.orders.length > 0 && <span className='opacity-80'>{s.orders.length}</span>}
                </TabsTrigger>
              </TabsList>
              <TabsContent value='browse'>
                <ShopSearchUi
                  search={s.search}
                  sort={s.sort}
                  searching={s.searching}
                  category={s.category}
                  categories={s.categories}
                  merchants={s.merchants}
                  merchantId={s.merchantId}
                  filterCount={s.filterCount}
                  chips={s.chips}
                  onSearchChange={s.onSearchChange}
                  onSortChange={s.onSortChange}
                  onCategoryChange={s.onCategoryChange}
                  onMerchantChange={s.onMerchantChange}
                  onOpenFilters={s.onOpenFilters}
                />
                <ShopProductGridUi
                  products={s.page.items}
                  total={s.page.total}
                  hasMore={s.page.hasMore}
                  pageSize={s.pageSize}
                  token={s.token}
                  filtered={s.filtered}
                  quantityOf={s.quantityOf}
                  onOpen={s.onView}
                  onAdd={s.onAdd}
                  onQuantity={s.onQuantity}
                  onShowMore={s.onShowMore}
                  onClearFilters={s.onClearFilters}
                />
              </TabsContent>
              <TabsContent value='cart'>
                <ShopCartUi
                  groups={s.groups}
                  token={s.token}
                  chainName={s.chainName}
                  onQuantity={s.onQuantity}
                  onRemove={s.onRemove}
                  onLogin={s.onLogin}
                  onLogout={s.onLogout}
                  onCheckout={s.onCheckout}
                  onBrowse={s.onBrowse}
                />
              </TabsContent>
              <TabsContent value='orders'>
                <ShopOrdersUi orders={s.orders} token={s.token} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </WalletGate>
      <ShopProductDialogUi
        product={s.viewing}
        token={s.token}
        chainName={s.chainName}
        inCart={s.viewing ? s.quantityOf(s.viewing.id) : 0}
        onClose={s.onCloseView}
        onAdd={s.onAddViewed}
      />
      <ShopFiltersDialogUi
        open={s.filtersOpen}
        applied={s.filters}
        search={s.search}
        chainId={s.chainId}
        token={s.token}
        onOpenChange={s.onFiltersOpenChange}
        onApply={s.onApplyFilters}
      />
    </div>
  );
};

export default ShoppingContainer;
