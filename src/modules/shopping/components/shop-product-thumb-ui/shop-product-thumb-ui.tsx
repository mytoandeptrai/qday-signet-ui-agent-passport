import {
  BatteryCharging,
  Cable,
  Coffee,
  CupSoda,
  type LucideIcon,
  Headphones,
  NotebookPen,
  Package,
  PenLine,
  Plug,
  RectangleHorizontal,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sticker,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShopProduct } from '../../utils';

const SKU_ICONS: Record<string, LucideIcon> = {
  earbuds: Headphones,
  'sticker-pack': Sticker,
  hoodie: Shirt,
  'tote-bag': ShoppingBag,
  'desk-mat': RectangleHorizontal,
  'pen-set': PenLine,
  notebook: NotebookPen,
  'wireless-charger': BatteryCharging,
  'phone-stand': Smartphone,
  'usb-c-cable': Cable,
  'steel-bottle': CupSoda,
  'ceramic-mug': Coffee,
};
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Electronics: Plug,
  Stationery: PenLine,
  Apparel: Shirt,
  Home: CupSoda,
};

/** Each product keeps one hue, so a grid does not read as twelve identical tiles. */
const HUES = [188, 205, 160, 235, 330, 45];
const productHue = (sku: string) => {
  let hash = 0;
  for (const char of sku) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return HUES[hash % HUES.length] ?? 188;
};

interface ShopProductThumbUiProps {
  product: ShopProduct;
  className?: string;
  iconClassName?: string;
}

/** The sample catalogue has no photos, so a product shows its own icon on a tinted tile. The tint is translucent, so it reads in light and dark. */
const ShopProductThumbUi = ({ product, className, iconClassName }: ShopProductThumbUiProps) => {
  const Icon = SKU_ICONS[product.sku] ?? CATEGORY_ICONS[product.category] ?? Package;
  const hue = productHue(product.sku);
  return (
    <span
      aria-hidden='true'
      className={cn('grid shrink-0 place-items-center overflow-hidden rounded-md text-foreground', className)}
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, oklch(0.7 0.13 ${hue} / 0.32), transparent 65%), linear-gradient(150deg, oklch(0.55 0.1 ${hue} / 0.28), oklch(0.35 0.07 ${hue} / 0.16))`,
      }}
    >
      <Icon className={cn('size-7', iconClassName)} strokeWidth={1.5} />
    </span>
  );
};

export default ShopProductThumbUi;
