import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useAddToCartMutation,
  useClearShopMutation,
  useGetShop,
  useRemoveFromCartMutation,
  useSetCartQuantityMutation,
  useSetOrderStatusMutation,
} from '@/apis/shopping';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import {
  SHOP_PAGE_SIZE,
  type ShopFilters,
  type ShopProduct,
  type ShopSort,
  activeFilterCount,
  cartCount,
  cartTotal,
  countryName,
  emptyFilters,
  filtersToQuery,
  pricedCart,
  searchProducts,
  searchWords,
  shopCategories,
  shopMerchants,
} from '../utils';
import type { ShopFilterChip } from '../components';

export const SHOP_TABS = ['browse', 'cart', 'orders'] as const;
export type ShopTab = (typeof SHOP_TABS)[number];

/** Page state for Shopping: browse, cart and orders. Cart and orders live in the store; search, filters and dialogs are local. */
export const useShoppingContainer = () => {
  const { t } = useTranslation('shopping-page');
  const { open } = useAppDialog();
  const { data: shop } = useGetShop();
  const { data: mainWallet } = useGetMainWallet();
  const addToCart = useAddToCartMutation();
  const setQuantity = useSetCartQuantityMutation();
  const removeFromCart = useRemoveFromCartMutation();
  const setOrderStatus = useSetOrderStatusMutation();
  const clearShop = useClearShopMutation();

  const network = NETWORKS[mainWallet?.network ?? 'base'];
  const chainId = network.key;
  const token = network.token.symbol;
  const cart = shop?.cart ?? [];
  const orders = shop?.orders ?? [];

  const [tab, setTab] = useState<ShopTab>('browse');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ShopFilters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shown, setShown] = useState(SHOP_PAGE_SIZE);
  const [viewing, setViewing] = useState<ShopProduct | null>(null);

  // A paid order lands the shopper on the Orders tab.
  const orderCount = useRef(orders.length);
  useEffect(() => {
    if (orders.length > orderCount.current) setTab('orders');
    orderCount.current = orders.length;
  }, [orders.length]);

  const searching = searchWords(search).length > 0;
  const sort: ShopSort =
    filters.sort === 'relevance' && !searching ? 'newest' : (filters.sort ?? (searching ? 'relevance' : 'newest'));
  const page = useMemo(
    () => searchProducts(filtersToQuery(search, filters, chainId, shown)),
    [search, filters, chainId, shown]
  );
  const filterCount = activeFilterCount(filters);
  const merchantNames = useMemo(() => new Map(shopMerchants(chainId).map((m) => [m.id, m.name])), [chainId]);

  // One removable chip per filter in force, so none hides inside the dialog.
  const chips: ShopFilterChip[] = [
    ...(filters.category
      ? [{ key: 'category', label: filters.category, remove: () => setFilters((f) => ({ ...f, category: undefined })) }]
      : []),
    ...filters.tags.map((tag) => ({
      key: `tag-${tag}`,
      label: tag,
      remove: () => setFilters((f) => ({ ...f, tags: f.tags.filter((x) => x !== tag) })),
    })),
    ...(filters.maxPrice.trim()
      ? [
          {
            key: 'price',
            label: t('chips.price', { price: filters.maxPrice.trim(), token }),
            remove: () => setFilters((f) => ({ ...f, maxPrice: '' })),
          },
        ]
      : []),
    ...filters.merchantIds.map((id) => ({
      key: `shop-${id}`,
      label: merchantNames.get(id) ?? id,
      remove: () => setFilters((f) => ({ ...f, merchantIds: f.merchantIds.filter((m) => m !== id) })),
    })),
    ...(filters.location
      ? [
          {
            key: 'location',
            label: t('chips.ships-to', { country: countryName(filters.location) }),
            remove: () => setFilters((f) => ({ ...f, location: undefined })),
          },
        ]
      : []),
  ];

  const lines = pricedCart(cart, chainId);
  const oldest = (status: 'paid' | 'shipped') => [...orders].reverse().find((o) => o.status === status);
  const resetPage = () => setShown(SHOP_PAGE_SIZE);

  return {
    t,
    isTestnet: network.testnet,
    token,
    chainName: network.name,
    chainId,
    ready: !!shop,
    tab,
    search,
    sort,
    searching,
    category: filters.category,
    categories: shopCategories(chainId),
    filters,
    filterCount,
    filtered: searching || filterCount > 0,
    chips,
    filtersOpen,
    page,
    pageSize: SHOP_PAGE_SIZE,
    viewing,
    count: cartCount(cart),
    lines,
    total: cartTotal(lines),
    hasUnpayable: lines.some((line) => !line.payable),
    orders,
    canShip: !!oldest('paid'),
    canDeliver: !!oldest('shipped'),
    quantityOf: (id: string) => cart.find((l) => l.productId === id)?.quantity ?? 0,
    onTabChange: (value: string) => setTab(value as ShopTab),
    onOpenCart: () => setTab('cart'),
    onBrowse: () => setTab('browse'),
    onSearchChange: (value: string) => {
      setSearch(value);
      resetPage();
    },
    onSortChange: (value: ShopSort) => {
      setFilters((f) => ({ ...f, sort: value }));
      resetPage();
    },
    onCategoryChange: (value?: string) => {
      setFilters((f) => ({ ...f, category: value }));
      resetPage();
    },
    onApplyFilters: (next: ShopFilters) => {
      setFilters(next);
      resetPage();
    },
    onOpenFilters: () => setFiltersOpen(true),
    onFiltersOpenChange: setFiltersOpen,
    onClearFilters: () => {
      setSearch('');
      setFilters(emptyFilters());
      resetPage();
    },
    onShowMore: () => setShown((n) => n + SHOP_PAGE_SIZE),
    onView: setViewing,
    onCloseView: () => setViewing(null),
    onAdd: (productId: string) => addToCart.mutate(productId),
    onAddViewed: () => {
      if (!viewing) return;
      addToCart.mutate(viewing.id);
      toast.success(t('product.added', { name: viewing.name }));
      setViewing(null);
    },
    onQuantity: (productId: string, quantity: number) => setQuantity.mutate({ productId, quantity }),
    onRemove: (productId: string) => removeFromCart.mutate(productId),
    onCheckout: () => open('shop-checkout'),
    onShip: () => {
      const order = oldest('paid');
      if (order) setOrderStatus.mutate({ id: order.id, from: 'paid', to: 'shipped' });
    },
    onDeliver: () => {
      const order = oldest('shipped');
      if (order) setOrderStatus.mutate({ id: order.id, from: 'shipped', to: 'delivered' });
    },
    onClear: () => {
      clearShop.mutate();
      toast.success(t('orders.preview.cleared'));
    },
  };
};
