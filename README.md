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
- Sign-up mode (`/login?mode=signup`) adds the passkey step.
- Voucher code to redeem: `SIGNET-LAUNCH-50`.
- Settings → Account → "Reset demo data" restores the seed.

## Layout

- `src/types/passport.ts` — interfaces
- `src/mock/` — seed data, services catalogue, landing copy, simulated API
- `src/stores/passport-store.ts` — persisted Zustand store
- `src/routes/` — file routes (`(app)/` is behind the auth guard)
- `src/components/landing/` — landing page; `src/components/app/` — dashboard shell
- `docs/agentpassport-spec.md` — analysis of the original site
