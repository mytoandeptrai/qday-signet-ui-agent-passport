# Agent Passport clone: analysis and mapping

Source analysed: `https://agentpassport.ai/` (Kite Passport), via REA (`capture_browser_scenario`) and the public HTML/JS/CSS. This project rebrands it as **Signet**. All data is mock.

## 1. Site structure

| Part | Tech | Notes |
|---|---|---|
| Landing `/` | static HTML + vanilla JS, WebGL riso art | Hero, logo marquee, session card, how it works, "a day" (pinned scroll), closing, footer |
| App (`/login`, `/overview`, …) | Vite SPA, TanStack Router, auth-gated | ~40 routes; only the login screen is visible without an account |

SPA routes found in the bundle: `/login`, `/register`, `/overview`, `/activity`, `/explore`, `/deposit`, `/settings`, `/account`, `/wallets`, `/vouchers`, `/transactions`, `/receipts`, `/playground`, `/create-session`, `/sessions/$id`, `/service-session/$id`, `/agent-session/approve`, `/agent-escalation/decide`, `/wallet/send/approve`, `/wallet/x402/pay`, `/oauth/authorize`, `/passkey/new`, `/recovery/cancel-by-link`, `/ecosystem`, `/installation`, `/terms`, `/privacy`, plus `embed/*`, `sandbox/*`, `admin/vouchers`.

Dashboard pages are rebuilt from the route names and chunk code, not from screenshots (no account). Treat their layout as an interpretation.

## 2. Theme

| Token | Value |
|---|---|
| page / text | `#ffffff` / `#121110` |
| text-2 / text-3 | `#6b665e` / `#9d978d` |
| line / subtle | `#e9e6e0` / `#f6f4ef` |
| accent (brand) | `#e2703f` (hover `#cc6134`) |
| ink blue (closing CTA) | `#33548a` |
| danger | `#b4432f` |
| fonts | Spectral 300 (headings), Inter (UI), JetBrains Mono |
| shape | square buttons, 4–6px radius cards, hairline borders |

## 3. Landing components → files

| Original | Here |
|---|---|
| Header + mobile sheet menu | `components/landing/site-header.tsx` |
| Hero: rotating word, Get started, Install popover (copies prompt) | `hero.tsx`, `install-button.tsx` |
| Sunrise print scrubbed by scroll, terminal that rises over it | `riso-plate.tsx` (SVG), `terminal-card.tsx`, `hooks/use-scroll-progress.ts` |
| Investors marquee | `LogoMarquee` in `sections.tsx` |
| Session card (ledger rows land one by one, Revoke) | `SessionSection` |
| How it works (3 plates, copy command) | `HowSection` |
| A day on Signet (pinned, 6 moments, one visible on phones) | `DaySection` |
| Closing + footer | `ClosingSection`, `site-footer.tsx` |

The WebGL riso renderer is replaced by an SVG print with a grain filter. The sun position follows scroll as in the original.

## 4. Flows implemented

- Sign in / sign up: email → 6-digit code (mock `123456`) → optional passkey step; "Continue with a passkey"; resend cooldown; safe `redirect` param.
- Route guard on `(app)` routes → `/login?redirect=…`.
- Overview: balance, pending escalation banner, session cards with Revoke (confirm dialog), recent activity.
- Activity: search, status and session filters, pagination, detail dialog, CSV export.
- Explore (public): debounced search, category tabs, sort, detail dialog.
- Sessions: create (zod validation, balance check), detail, revoke.
- Approve session / decide escalation pages (change balance, activity and session state).
- Deposit (card/bank/crypto), vouchers (redeem), settings (limits, notifications, passkeys, appearance, reset demo data).
- Ecosystem, terms, privacy, 404.

## 5. Data model

See `src/types/passport.ts` (`User`, `Passkey`, `Balance`, `SpendingSession`, `ActivityItem`, `Service`, `Escalation`, `Voucher`, `Deposit`, `AppSettings`). Seed data: `src/mock/seed.ts`, `src/mock/services.ts`, `src/mock/landing.ts`. Simulated API with latency: `src/mock/api.ts`. State: Zustand store persisted to `localStorage` (`src/stores/passport-store.ts`).

## 6. Not cloned

`/wallets`, `/transactions`, `/receipts`, `/playground`, `/oauth/authorize`, `/passkey/new`, embeds, sandbox and admin routes; real WebAuthn; the real riso WebGL shaders.
