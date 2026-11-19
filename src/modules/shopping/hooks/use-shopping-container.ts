import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useAddToCartMutation,
  useGetShop,
  useLogoutEcommerceMutation,
  useRemoveFromCartMutation,
  useSetCartQuantityMutation,
} from '@/apis/shopping';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import {
  ALL_MERCHANTS,
  SHOP_PAGE_SIZE,
  type ShopFilters,
  type ShopProduct,
  type ShopSort,
  activeFilterCount,
  cartCount,
  cartTotal,
  groupByMerchant,
  countryName,
  emptyFilters,
  filtersToQuery,
  pricedCart,
  searchProducts,
  searchWords,
  shopCategories,
  shopMerchants,
} from '../utils';
import type { CartGroup, ShopFilterChip } from '../components';

export const SHOP_TABS = ['browse', 'cart', 'orders'] as const;
export type ShopTab = (typeof SHOP_TABS)[number];

export const useShoppingContainer = () => {
  const { t } = useTranslation('shopping-page');
  const { open } = useAppDialog();
  const { data: shop } = useGetShop();
  const { data: mainWallet } = useGetMainWallet();
  const addToCart = useAddToCartMutation();
  const setQuantity = useSetCartQuantityMutation();
  const removeFromCart = useRemoveFromCartMutation();
  const logout = useLogoutEcommerceMutation();

  const network = NETWORKS[mainWallet?.network ?? 'base'];
  const chainId = network.key;
  const token = network.token.symbol;
  const cart = shop?.cart ?? [];
  const orders = shop?.orders ?? [];
  const accounts = shop?.accounts ?? {};

  const [tab, setTab] = useState<ShopTab>('browse');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ShopFilters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shown, setShown] = useState(SHOP_PAGE_SIZE);
  const [viewing, setViewing] = useState<ShopProduct | null>(null);

  const orderCount = useRef(orders.length);
  useEffect(() => {
    if (orders.length > orderCount.current && cart.length === 0) setTab('orders');
    orderCount.current = orders.length;
  }, [orders.length, cart.length]);

  const searching = searchWords(search).length > 0;
  const sort: ShopSort =
    filters.sort === 'relevance' && !searching ? 'newest' : (filters.sort ?? (searching ? 'relevance' : 'newest'));
  const page = useMemo(
    () => searchProducts(filtersToQuery(search, filters, chainId, shown)),
    [search, filters, chainId, shown]
  );
  const filterCount = activeFilterCount(filters);
  const merchantNames = useMemo(() => new Map(shopMerchants(chainId).map((m) => [m.id, m.name])), [chainId]);

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

  const groups: CartGroup[] = groupByMerchant(pricedCart(cart, chainId), (line) => line.product.merchant).map(({ merchant, items }) => {
    const account = accounts[merchant.id] ?? null;
    return {
      merchant,
      lines: items,
      total: cartTotal(items),
      account,
      hasAddress: !!account?.shippingAddress,
      hasUnpayable: items.some((line) => !line.payable),
    };
  });
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
    merchants: shopMerchants(chainId),
    merchantId: filters.merchantIds.length === 0 ? ALL_MERCHANTS : filters.merchantIds.length === 1 ? filters.merchantIds[0] : '',
    filters,
    filterCount,
    filtered: searching || filterCount > 0,
    chips,
    filtersOpen,
    page,
    pageSize: SHOP_PAGE_SIZE,
    viewing,
    count: cartCount(cart),
    groups,
    orders,
    quantityOf: (id: string) => cart.find((l) => l.productId === id)?.quantity ?? 0,
    onTabChange: (value: string) => setTab(value as ShopTab),
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
    onMerchantChange: (value: string) => {
      setFilters((f) => ({ ...f, merchantIds: value === ALL_MERCHANTS ? [] : [value] }));
      resetPage();
    },
    onLogin: (merchantId: string) => open('shop-login', { id: merchantId }),
    onLogout: (merchantId: string) => logout.mutate(merchantId),
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
    onCheckout: (merchantId: string) => open('shop-checkout', { id: merchantId }),
  };
};
