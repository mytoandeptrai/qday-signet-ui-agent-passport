import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { addToCart, clearShop, getShop, loginEcommerce, logoutEcommerce, placeOrder, removeFromCart, setCartQuantity, setOrderStatus } from './requests';

export const useGetShop = () => useQuery({ queryKey: [KEYS.SHOP], queryFn: getShop });

const useRefreshAll = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
};

export const useAddToCartMutation = () =>
  useMutation({ mutationKey: [KEYS.ADD], mutationFn: addToCart, onSuccess: useRefreshAll() });

export const useSetCartQuantityMutation = () =>
  useMutation({ mutationKey: [KEYS.QUANTITY], mutationFn: setCartQuantity, onSuccess: useRefreshAll() });

export const useRemoveFromCartMutation = () =>
  useMutation({ mutationKey: [KEYS.REMOVE], mutationFn: removeFromCart, onSuccess: useRefreshAll() });

export const usePlaceOrderMutation = () =>
  useMutation({ mutationKey: [KEYS.ORDER], mutationFn: placeOrder, onSuccess: useRefreshAll() });

export const useSetOrderStatusMutation = () =>
  useMutation({ mutationKey: [KEYS.STATUS], mutationFn: setOrderStatus, onSuccess: useRefreshAll() });

export const useClearShopMutation = () =>
  useMutation({ mutationKey: [KEYS.CLEAR], mutationFn: clearShop, onSuccess: useRefreshAll() });

export const useLoginEcommerceMutation = () =>
  useMutation({ mutationKey: [KEYS.LOGIN], mutationFn: loginEcommerce, onSuccess: useRefreshAll() });

export const useLogoutEcommerceMutation = () =>
  useMutation({ mutationKey: [KEYS.LOGOUT], mutationFn: logoutEcommerce, onSuccess: useRefreshAll() });
