# Olejovník — osobní databáze olejů

Vite + React + TypeScript SPA, Hono API na Vercel Functions, Turso (libSQL) přes Drizzle. Instalovatelná PWA.

## Vývoj

```bash
nvm use
npm install
cp .env.example .env   # doplňte Turso údaje, nebo pro lokál: TURSO_DATABASE_URL=file:./local.db
npm run db:migrate
npm run dev             # web :5173, API :3001 (proxy /api)
```

## Testy

```bash
npm test          # Vitest (unit + komponenty + API s in-memory libSQL)
npm run typecheck
npm run lint
```

## Turso

```bash
turso db create oils
turso db show oils --url          # → TURSO_DATABASE_URL
turso db tokens create oils       # → TURSO_AUTH_TOKEN
npm run db:generate               # po změně db/schema.ts
npm run db:migrate                # aplikuje migrace
```

## Nasazení (Vercel)

1. Import repa `matus1331/apothecary-oils`, preset **Vite**.
2. Environment Variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (Production + Preview).
3. `/api/*` běží jako Node Function (`api/[[...route]].ts`).
4. Migrace se spouští ručně z lokálu proti produkční Turso DB (`npm run db:migrate`).

## Poznámky

- Bez přihlašování — appka i `/api` jsou veřejné, `robots: noindex`.
- Offline: čtení posledních načtených dat; zápisy vyžadují připojení.
- Ikony v `public/` jsou zástupné, nahraďte finální grafikou. Maskable ikona zatím nemá safe-zone odsazení.
