import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useAddToCartMutation,
  useGetShop,
  useLoginEcommerceMutation,
  useLogoutEcommerceMutation,
  useRemoveFromCartMutation,
  useSetCartQuantityMutation,
} from '@/apis/shopping';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { type EcommerceLoginFormData, ecommerceLoginSchema, initialEcommerceLoginFormData } from './schema';
import {
  ALL_MERCHANTS,
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

export const useShoppingContainer = () => {
  const { t } = useTranslation('shopping-page');
  const { open } = useAppDialog();
  const { data: shop } = useGetShop();
  const { data: mainWallet } = useGetMainWallet();
  const addToCart = useAddToCartMutation();
  const setQuantity = useSetCartQuantityMutation();
  const removeFromCart = useRemoveFromCartMutation();
  const login = useLoginEcommerceMutation();
  const logout = useLogoutEcommerceMutation();
  const loginForm = useForm<EcommerceLoginFormData>({
    resolver: zodResolver(ecommerceLoginSchema(t)),
    defaultValues: initialEcommerceLoginFormData,
    mode: 'onChange',
  });

  const network = NETWORKS[mainWallet?.network ?? 'base'];
  const chainId = network.key;
  const token = network.token.symbol;
  const cart = shop?.cart ?? [];
  const orders = shop?.orders ?? [];
  const account = shop?.account ?? null;

  const [tab, setTab] = useState<ShopTab>('browse');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ShopFilters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shown, setShown] = useState(SHOP_PAGE_SIZE);
  const [viewing, setViewing] = useState<ShopProduct | null>(null);

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
    account,
    loginForm,
    isLoggingIn: login.isPending,
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
    onLogin: async (values: EcommerceLoginFormData) => {
      await login.mutateAsync(values);
      loginForm.reset(initialEcommerceLoginFormData);
    },
    onLogout: () => logout.mutate(),
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
  };
};
