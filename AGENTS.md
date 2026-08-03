# AGENTS.md

Two independent apps in one repo (no root package.json, no shared tooling): `backend/` (Express 5 + Mongoose 9, ESM) and `frontend/` (React 19 + Vite 8, JSX, Tailwind 3). Multi-tenant SaaS: users with roles `user | merchant | superadmin`, merchants own a `Store`, products belong to a store, Razorpay checkout, Cloudinary image uploads.

## Commands

- Backend: `npm start` / `npm run dev` (nodemon) / `node server.js` from `backend/`. Hardcoded port 5000. `npm test` is a placeholder that exits 1. `npm run seed:admin -- <email> <password>` creates or promotes an admin user (see `backend/scripts/createAdmin.js`).
- Frontend: `npm run dev`, `npm run build`, `npm run lint` (eslint). Vite serves on 5173.
- No test framework exists anywhere.

## Env vars

- `backend/.env`: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`, optional `FRONTEND_URL` (reset-link base, default `http://localhost:5173`), optional email SMTP `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS`.
- `frontend/.env`: `VITE_RAZORPAY_KEY`, optional `VITE_API_URL`
- `.env` files are gitignored and both exist locally. `.env.example` files exist in both apps.
- `server.js` loads env explicitly via `import "dotenv/config"`. `config/cloudinary.js` also calls `dotenv.config()` (harmless, idempotent). `config/env.js` was deleted (dead code).
- Password-reset emails: `backend/utils/sendEmail.js` uses nodemailer when `EMAIL_HOST/USER/PASS` are set (Gmail app password → strip the spaces), otherwise it logs the reset link to the server console. The sender is always the configured `EMAIL_USER`; the recipient is the registered user's own email.

## API wiring

- The frontend fetches `${API_URL}/...` from `src/utils/api.js`. `API_URL` is `VITE_API_URL`, or in **dev mode** the relative `/api` (served by the vite `/api` proxy in `vite.config.js` → `http://localhost:5000`), or in **production** `http://localhost:5000/api`. The vite `/api` proxy is REQUIRED for dev mode — do not remove it. Backend must run on port 5000; CORS is wide open (`app.use(cors())`).
- Auth: JWT in `localStorage` under `userInfo` (JSON containing `token`). Managed by `AuthContext`; guards are `ProtectedRoute` / `AdminRoute` in `src/components`. Send `Authorization: Bearer <token>`.
- Roles: `admin` is a super admin with access to every store's products/orders. `merchantStore` middleware (`middleware/storeMiddleware.js`) lets merchants through with their own store (`req.store`) and lets admins through without one; controllers then treat `req.store` as optional (admin → all stores / any product). `adminOrMerchant` (`middleware/adminOrMerchant.js`) gates uploads. Merchant-only routes (`/api/merchant/products`) still require `merchant` + `merchantStore`.
- Admin creates a product by picking a `store` in the POST body (AddProduct page has a store picker); merchants omit it and use `req.store`. `/api/products/seed` wipes all products and is admin-only.
- Order management routes use `admin`; controllers fall back to all orders / any order when `req.store` is absent. `placeOrder` recomputes `totalPrice` server-side (subtotal + 5% GST, rounded) and rebuilds order items from DB prices, ignoring client totals.
- Public storefront: `/api/stores` and `/api/stores/:slug`; merchant creates store via `POST /api/stores` (protected).
- Razorpay: checkout script is loaded globally in `frontend/index.html`; the whole flow (create-order → verify → clearCart → navigate to `/myorders`) lives in `frontend/src/utils/razorpay.js`. Amount is in rupees on the frontend; backend multiplies by 100 for paise. Both payment endpoints are behind `protect`; `verify` checks order ownership.

## Style

The codebase uses a deliberate, pervasive formatting style: decorative ASCII banner comments (`/* ===== */`), lots of whitespace, one-argument-per-line call chains. Match this in new code — compact/idiomatic JS will look out of place. Components and pages are `.jsx`; backend files are `.js`. There is no TypeScript.
