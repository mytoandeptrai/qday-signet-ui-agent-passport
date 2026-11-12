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
- Click **Connect wallet** in the sidebar and connect a real MetaMask (RainbowKit modal). Money and signing screens stay hidden until it is connected on QDay or Base; switch networks from the wallet menu or the Wallet page.
- Every action asks MetaMask for a real message signature (`signMessage`, no transaction, no gas). Decline it in MetaMask to see the rejected state. Balances and records stay mocked.
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

- `src/integrations/web3/` — wagmi + RainbowKit setup copied from `qday-payment-merchant-portal`: QDay and Base Sepolia chains, MetaMask only, themed and localised. `src/integrations/wallet/` wraps it in `useWallet`, `useSignAction` (`signMessageAsync` — swap for `writeContract` once contracts are live) and `useActiveNetwork`.
- `useWallet` connects and disconnects, `useSignAction` runs a signature through `idle → waiting → success | rejected | error`, and `WalletGate` hides money UI until a wallet is connected. Only the address and chain id are stored, never keys.
- `src/constant/networks.const.ts` — QDay/USD8 is the default; Base/USDC is enabled too. The QDay network comes from `VITE_QDAY_*` env (Base is built into viem/wagmi); set `VITE_WALLETCONNECT_PROJECT_ID` (RainbowKit requires one). The QDay native currency and USD8 decimals are placeholders until the testnet details are confirmed.
- `src/integrations/moonpay/` — "Buy with card" on Overview, shown only while the wallet is on Base. Opens the MoonPay overlay widget (`@moonpay/moonpay-react`, loaded lazily) with the connected address prefilled. Needs `VITE_MOONPAY_PUBLISHABLE_KEY` and `VITE_MOONPAY_SERVER_URL`: a server holding the secret key that serves `GET /ip-hash` (HMAC of the customer IP for MoonPay IP matching, sent as `allowedIpAddress`) and `GET /sign-url?url=` (HMAC signature of the widget URL query). `VITE_MOONPAY_CURRENCY_CODE` is `eth` in sandbox (no Base there) and `usdc_base` in production.
- Create, send, receive, add funds and approve flows are dialogs and sheets opened by the `dialog` search param (`src/constant/app-dialog.const.ts`, rendered by `components/layouts/app-dialogs`), so they are deep-linkable.

## Theme

Brand kit v5 (synced from `qday-trellis-ui-kit`): deep teal `#06343a` and cyan `#60f2ff`, tokens in `src/styles.css`. Light is the default; the choice is stored under `trellis-theme-v5` and applied before paint from `index.html`. The cyan glow is the fixed mesh on `body`, so page wrappers stay transparent. Logos and icons keep the Signet blue.
