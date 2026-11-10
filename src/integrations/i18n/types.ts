import type { LANGUAGES } from './languages';

/** Supported languages */
export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];

/** Available translation namespaces */
export type TranslationNamespace = 'common' | 'validation' | 'navigation';
