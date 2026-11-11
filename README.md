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
- `src/routes/` — thin file routes (`(app)/` is behind the auth guard)
- `src/modules/<feature>/{containers,hooks,components}` — pages, following `.claude/skills/react-guide` (container → one hook → `-ui` components)
- `src/apis/<domain>/` — keys, types, requests and TanStack Query hooks over the mock transport
- `src/components/layouts/` — app and public layouts; `src/components/{ui,form-fields,containers,utilities}` — shared kit
- `public/locales/en/<namespace>.json` — one namespace per page
- `docs/agentpassport-spec.md` — analysis of the original site
