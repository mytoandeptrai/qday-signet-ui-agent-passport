export const LANGUAGES = [
  { code: 'en', nativeName: 'English', walletLocale: 'en-US' },
  { code: 'zh-HK', nativeName: '繁體中文', walletLocale: 'zh-HK' },
  { code: 'ja', nativeName: '日本語', walletLocale: 'ja-JP' },
  { code: 'ms', nativeName: 'Bahasa Melayu', walletLocale: 'ms-MY' },
] as const;

export const SUPPORTED_LANGUAGE_CODES = LANGUAGES.map((language) => language.code);

export const DEFAULT_LANGUAGE = 'en';
