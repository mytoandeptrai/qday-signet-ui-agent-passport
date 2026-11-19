export interface ShopProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  quantity: number | null;
  chains: string[];
  merchant: { id: string; name: string };
  fulfillment: string;
  acceptedLocations: string[];
  bannedLocations: string[];
}

type ShopListing = Omit<ShopProduct, 'acceptedLocations' | 'bannedLocations'> &
  Partial<Pick<ShopProduct, 'acceptedLocations' | 'bannedLocations'>>;

const EVERYDAY = { id: 'm-everyday', name: 'Everyday Goods' };
const DESK = { id: 'm-desk', name: 'Desk & Paper Co.' };
const CABLE = { id: 'm-cable', name: 'Cable Corner' };
const BOTH = ['base', 'qday'];

const listings: ShopListing[] = [
  {
    id: 'p-earbuds',
    sku: 'earbuds',
    name: 'Wireless earbuds',
    description: 'Bluetooth earbuds with a charging case and about 20 hours of playback.',
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    price: '39',
    quantity: 12,
    chains: BOTH,
    merchant: CABLE,
    fulfillment: 'Ships in 2 to 3 days',
  },
  {
    id: 'p-sticker-pack',
    sku: 'sticker-pack',
    name: 'Sticker pack',
    description: 'Twelve waterproof vinyl stickers for laptops and bottles.',
    category: 'Stationery',
    tags: ['stickers', 'gift'],
    price: '4.5',
    quantity: null,
    chains: BOTH,
    merchant: DESK,
    fulfillment: 'Ships in 1 to 2 days',
  },
  {
    id: 'p-hoodie',
    sku: 'hoodie',
    name: 'Fleece hoodie',
    description: 'A warm, heavyweight fleece hoodie in charcoal.',
    category: 'Apparel',
    tags: ['clothing', 'winter'],
    price: '59',
    quantity: 0,
    chains: BOTH,
    merchant: EVERYDAY,
    fulfillment: 'Ships in 3 to 5 days',
  },
  {
    id: 'p-tote-bag',
    sku: 'tote-bag',
    name: 'Canvas tote bag',
    description: 'A sturdy cotton canvas tote with an inside pocket.',
    category: 'Apparel',
    tags: ['bag', 'gift'],
    price: '15',
    quantity: 30,
    chains: BOTH,
    merchant: EVERYDAY,
    fulfillment: 'Ships in 2 to 3 days',
  },
  {
    id: 'p-desk-mat',
    sku: 'desk-mat',
    acceptedLocations: ['VN', 'SG', 'US'],
    name: 'Felt desk mat',
    description: 'A large felt desk mat that keeps a keyboard and mouse in place.',
    category: 'Home',
    tags: ['desk'],
    price: '29',
    quantity: 8,
    chains: BOTH,
    merchant: DESK,
    fulfillment: 'Ships in 3 to 5 days',
  },
  {
    id: 'p-pen-set',
    sku: 'pen-set',
    name: 'Gel pen set (4)',
    description: 'Four smooth gel pens in black, blue, red and green.',
    category: 'Stationery',
    tags: ['pens', 'desk'],
    price: '7.2',
    quantity: 80,
    chains: ['qday'],
    merchant: DESK,
    fulfillment: 'Ships in 1 to 2 days',
  },
  {
    id: 'p-notebook',
    sku: 'notebook',
    name: 'Dot-grid notebook',
    description: 'A5 notebook with 160 dot-grid pages and a lay-flat spine.',
    category: 'Stationery',
    tags: ['paper', 'desk'],
    price: '9.5',
    quantity: 60,
    chains: BOTH,
    merchant: DESK,
    fulfillment: 'Ships in 1 to 2 days',
  },
  {
    id: 'p-wireless-charger',
    sku: 'wireless-charger',
    acceptedLocations: ['US', 'GB', 'DE', 'FR', 'SG'],
    name: 'Wireless charger',
    description: 'A 15 W wireless charging pad for phones and earbuds.',
    category: 'Electronics',
    tags: ['charging', 'wireless'],
    price: '24.9',
    quantity: 15,
    chains: ['base'],
    merchant: CABLE,
    fulfillment: 'Ships in 2 to 3 days',
  },
  {
    id: 'p-phone-stand',
    sku: 'phone-stand',
    name: 'Aluminium phone stand',
    description: 'A foldable aluminium stand that holds a phone at a comfortable angle.',
    category: 'Electronics',
    tags: ['desk', 'phone'],
    price: '14',
    quantity: 3,
    chains: BOTH,
    merchant: CABLE,
    fulfillment: 'Ships in 2 to 3 days',
  },
  {
    id: 'p-usb-c-cable',
    sku: 'usb-c-cable',
    name: 'USB-C cable, 1 m',
    description: 'A braided USB-C charging and data cable, one metre long.',
    category: 'Electronics',
    tags: ['charging', 'cable'],
    price: '6.9',
    quantity: 120,
    chains: BOTH,
    merchant: CABLE,
    fulfillment: 'Ships in 1 to 2 days',
  },
  {
    id: 'p-steel-bottle',
    sku: 'steel-bottle',
    bannedLocations: ['AU'],
    name: 'Steel water bottle',
    description: 'A 500 ml insulated stainless steel bottle that keeps drinks cold for a day.',
    category: 'Home',
    tags: ['kitchen', 'outdoor'],
    price: '18.5',
    quantity: 40,
    chains: BOTH,
    merchant: EVERYDAY,
    fulfillment: 'Ships in 2 to 3 days',
  },
  {
    id: 'p-ceramic-mug',
    sku: 'ceramic-mug',
    name: 'Ceramic mug',
    description: 'A 350 ml stoneware mug, dishwasher safe.',
    category: 'Home',
    tags: ['kitchen', 'gift'],
    price: '12',
    quantity: 24,
    chains: BOTH,
    merchant: EVERYDAY,
    fulfillment: 'Ships in 2 to 3 days',
  },
];

export const shopCatalog: ShopProduct[] = listings.map((listing) => ({
  acceptedLocations: [],
  bannedLocations: [],
  ...listing,
}));

export const getShopMerchant = (id: string) => shopCatalog.find((product) => product.merchant.id === id)?.merchant;

export const getShopProduct = (id: string) => shopCatalog.find((product) => product.id === id);
