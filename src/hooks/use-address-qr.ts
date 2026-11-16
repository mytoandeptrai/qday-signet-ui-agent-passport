import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';

export const useAddressQr = (address?: string) =>
  useQuery({
    queryKey: ['address-qr', address],
    queryFn: () => QRCode.toDataURL(address ?? '', { margin: 1, width: 192 }),
    enabled: !!address,
    staleTime: Infinity,
  });
