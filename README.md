# Signet agent passport UI

Frontend clone of agentpassport.ai, rebranded as Signet. Mock data only, no backend.
Built on the QDAY merchant portal stack: Vite, React 19, TanStack Router and Query, Zustand, Tailwind 4, shadcn/ui.

## Run

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # vite build + tsc
```

## Try it

- Sign in with any email. The one-time code is `123456`.
- Click **Connect wallet** in the sidebar. The mock MetaMask connects after about a second; money and signing screens stay hidden until it does.
- Every signature shows "Waiting for MetaMask signature…". To see a rejection, run `window.__mockWallet.rejectNext = true` in the dev console first.
- Settings → Account → "Reset demo data" restores the seed.

## Layout

- `src/types/passport.ts` — interfaces
- `src/mock/` — seed data, services catalogue, landing copy, simulated API
- `src/stores/passport-store.ts` — persisted Zustand store
- `src/routes/` — thin file routes (`(app)/` is behind the auth guard)
- `src/modules/<feature>/{containers,hooks,components}` — pages, following `.claude/skills/react-guide` (container → one hook → `-ui` components)
- `src/apis/<domain>/` — keys, types, requests and TanStack Query hooks over the mock transport
- `src/components/layouts/` — app and public layouts; `src/components/{ui,form-fields,containers,utilities}` — shared kit
- `public/locales/en/<namespace>.json` — one namespace per page
- `docs/agentpassport-spec.md` — analysis of the original site

## Wallet

- `src/integrations/wallet/` — the seam between the UI and MetaMask. `walletAdapter` (`wallet-adapter.ts`) points at the mock; swap it for a wagmi/viem adapter (setup lives in `qday-payment-merchant-portal/src/integrations/web3`) without touching the UI.
- `useWallet` connects and disconnects, `useSignAction` runs a signature through `idle → waiting → success | rejected | error`, and `WalletGate` hides money UI until a wallet is connected. Only the address and chain id are stored, never keys.
- `src/constant/networks.const.ts` — QDay/USD8 is the default; Base/USDC is configured but disabled. The QDay network comes from `VITE_QDAY_*` env (Base is built into viem/wagmi, so it needs none); the QDay chain id and USD8 decimals are placeholders until the testnet details are confirmed.
- Create, send, receive, add funds and approve flows are dialogs and sheets opened by the `dialog` search param (`src/constant/app-dialog.const.ts`, rendered by `components/layouts/app-dialogs`), so they are deep-linkable.

## Theme

Brand kit v5 (synced from `qday-trellis-ui-kit`): deep teal `#06343a` and cyan `#60f2ff`, tokens in `src/styles.css`. Light is the default; the choice is stored under `trellis-theme-v5` and applied before paint from `index.html`. The cyan glow is the fixed mesh on `body`, so page wrappers stay transparent. Logos and icons keep the Signet blue.
