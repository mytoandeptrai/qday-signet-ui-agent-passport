export const getEnv = (key: string): string => {
  const w = typeof window !== "undefined" ? (window as any)._env_ : undefined;
  return (w?.[key] ?? import.meta.env[key] ?? "") as string;
};

export const env = {
  APP_URL: getEnv("VITE_APP_URL"),
  API_URL: getEnv("VITE_API_URL"),
  SOCKET_URL: getEnv("VITE_SOCKET_URL"),
  APP_SUPPORT_EMAIL: getEnv("VITE_APP_SUPPORT_EMAIL"),
  ENVIRONMENT: getEnv("VITE_ENV"),
  RECAPTCHA_SITE_KEY: getEnv("VITE_RECAPTCHA_SITE_KEY"),
  WALLETCONNECT_PROJECT_ID: getEnv("VITE_WALLETCONNECT_PROJECT_ID"),
  NATIVE_CURRENCY_NAME_QDAY: getEnv("VITE_NATIVE_CURRENCY_NAME_QDAY"),
  NATIVE_CURRENCY_SYMBOL_QDAY: getEnv("VITE_NATIVE_CURRENCY_SYMBOL_QDAY"),
  NATIVE_CURRENCY_DECIMALS_QDAY: getEnv("VITE_NATIVE_CURRENCY_DECIMALS_QDAY"),
  CHAIN_ID_QDAY: getEnv("VITE_CHAIN_ID_QDAY"),
  CHAIN_NAME_QDAY: getEnv("VITE_CHAIN_NAME_QDAY"),
  CHAIN_IS_TESTNET: getEnv("VITE_CHAIN_IS_TESTNET").trim().toLowerCase() !== "false",
  TX_SITE_QDAY: getEnv("VITE_TX_SITE_QDAY"),
  RPC_URL_QDAY: getEnv("VITE_RPC_URL_QDAY"),
  USD8_ADDRESS_QDAY: getEnv("VITE_USD8_ADDRESS_QDAY"),
  PAYMASTER_ADDRESS_QDAY: getEnv("VITE_PAYMASTER_ADDRESS_QDAY"),
  FACTORY_STAKER_ADDRESS_QDAY: getEnv("VITE_FACTORY_STAKER_ADDRESS_QDAY"),
  KERNEL_IMPLEMENTATION_ADDRESS_QDAY: getEnv(
    "VITE_KERNEL_IMPLEMENTATION_ADDRESS_QDAY",
  ),
  KERNEL_FACTORY_ADDRESS_QDAY: getEnv("VITE_KERNEL_FACTORY_ADDRESS_QDAY"),
  GA_ID: getEnv("VITE_GA_ID"),
};

export const NUMBER_FORMAT_LOOK_UP = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "B" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];

export const IMAGE_TYPE = ["png", "jpg", "jpeg", "webp", "svg"];
export const VIDEO_TYPE = ["mp4", "mov", "webm", "ogg", "wmv"];

export const FILE_FORMAT = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/jpg",
  "image/svg",
  "image/gif",
  "image/svg+xml",
];

export const keyLocalStorage = {
  EXPIRED_SIGN_UP_TIME: "expired-signup-time",
  EXPIRED_RESET_PASSWORD_TIME: "expired-reset-password-time",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export const PAGE_SIZE_OPTIONS = [5, 10, 50, 100];

export const messageError = {
  ACTIVE_CODE_EXPIRED: "ACTIVE_CODE_EXPIRED",
  EMAIL_EXISTED: "EMAIL_EXISTED",
  ADDRESS_EXISTED: "ADDRESS_EXISTED",
  USER_ACTIVATED: "USER_ACTIVATED",
  REQUESTED: "REQUESTED",
  NOT_FOUND: "NOT_FOUND",
  OLD_PASSWORD_NOT_MATCH: "OLD_PASSWORD_NOT_MATCH",
  NEED_TWO_FA: "NEED_TWO_FA",
  MATCH_CURRENT_PASSWORD: "MATCH_CURRENT_PASSWORD",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_CHAIN: "INVALID_CHAIN",
  FORGOT_PASSWORD_CODE_EXPIRED: "FORGOT_PASSWORD_CODE_EXPIRED",
  FORGOT_PASSWORD_LINK_ALREADY_USED: "FORGOT_PASSWORD_LINK_ALREADY_USED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  BLACKLISTED_ADDRESS: "BLACKLISTED_ADDRESS",
};

export const CURRENCY_CODE_MAPPING: Record<string, string> = {
  USD: "USD",
  THB: "THB",
  VND: "VND",
};

export const CURRENCY_SYMBOL_MAPPING: Record<string, string> = {
  USD: "$",
  THB: "฿",
  VND: "₫",
};

export const PROTOCOL_CHAIN_MAPPING: Record<string, string> = {
  BEP20: "BSC",
  ERC20: "ETH",
};

export const BASE_REFRESH_INTERVAL = 1000 * 10; // 10 seconds

export const MAX_WALLETS_PER_CHAIN = 2; // Maximum number of wallets allowed per chain

export const STABLE_TOKEN: Record<string, string> = {
  USDC: "USDC",
  USDT: "USDT",
  TEST: "TEST",
};
