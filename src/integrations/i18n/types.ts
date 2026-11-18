import type { LANGUAGES } from './languages';

export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];

export type TranslationNamespace = 'common' | 'validation' | 'navigation';
