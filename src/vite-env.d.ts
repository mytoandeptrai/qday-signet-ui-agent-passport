/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_NETWORK?: 'qday' | 'base';
  readonly VITE_QDAY_CHAIN_ID?: string;
}
