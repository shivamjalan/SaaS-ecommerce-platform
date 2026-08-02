# AGENTS.md

Two independent apps in one repo (no root package.json, no shared tooling): `backend/` (Express 5 + Mongoose 9, ESM) and `frontend/` (React 19 + Vite 8, JSX, Tailwind 3). Multi-tenant SaaS: users with roles `user | admin | merchant`, merchants own a `Store`, products belong to a store, Razorpay checkout, Cloudinary image uploads.

## Commands

- Backend: `npm start` / `npm run dev` (nodemon) / `node server.js` from `backend/`. Hardcoded port 5000. `npm test` is a placeholder that exits 1. `npm run seed:admin -- <email> <password>` creates or promotes an admin user (see `backend/scripts/createAdmin.js`).
- Frontend: `npm run dev`, `npm run build`, `npm run lint` (eslint). Vite serves on 5173.
- No test framework exists anywhere.

## Env vars

- `backend/.env`: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `frontend/.env`: `VITE_RAZORPAY_KEY`, optional `VITE_API_URL`
- `.env` files are gitignored and both exist locally. There is no `.env.example`.
- Gotcha: `server.js` never calls `dotenv.config()` directly. Env only loads because `config/cloudinary.js` calls `dotenv.config()` as a side effect, and `uploadRoutes` (which pulls it in) is the first import in `server.js`. `config/env.js` is dead code, never imported. Don't "clean up" cloudinary.js's dotenv call without adding an explicit load in `server.js`.
- Backend `package.json` lists the deprecated `crypto` npm package; `import crypto from "crypto"` in `paymentController.js` resolves to it.

## API wiring

- The frontend fetches `${API_URL}/...` where `API_URL` is `VITE_API_URL` (default `http://localhost:5000/api`) from `src/utils/api.js`. The vite `/api` proxy in `vite.config.js` exists but is unused. Backend must run on port 5000; CORS is wide open (`app.use(cors())`).
- Auth: JWT in `localStorage` under `userInfo` (JSON containing `token`). Managed by `AuthContext`; guards are `ProtectedRoute` / `AdminRoute` in `src/components`. Send `Authorization: Bearer <token>`.
- Roles: `admin` is a super admin with access to every store's products/orders. `merchantStore` middleware (`middleware/storeMiddleware.js`) lets merchants through with their own store (`req.store`) and lets admins through without one; controllers then treat `req.store` as optional (admin → all stores / any product). `adminOrMerchant` (`middleware/adminOrMerchant.js`) gates uploads. Merchant-only routes (`/api/merchant/products`) still require `merchant` + `merchantStore`.
- Admin creates a product by picking a `store` in the POST body (AddProduct page has a store picker); merchants omit it and use `req.store`. `/api/products/seed` wipes all products and is admin-only.
- Order management routes use `admin`; controllers fall back to all orders / any order when `req.store` is absent. `placeOrder` recomputes `totalPrice` server-side (subtotal + 5% GST, rounded) and rebuilds order items from DB prices, ignoring client totals.
- Public storefront: `/api/stores` and `/api/stores/:slug`; merchant creates store via `POST /api/stores` (protected).
- Razorpay: checkout script is loaded globally in `frontend/index.html`; the whole flow (create-order → verify → clearCart → navigate to `/myorders`) lives in `frontend/src/utils/razorpay.js`. Amount is in rupees on the frontend; backend multiplies by 100 for paise. Both payment endpoints are behind `protect`; `verify` checks order ownership.

## Style

The codebase uses a deliberate, pervasive formatting style: decorative ASCII banner comments (`/* ===== */`), lots of whitespace, one-argument-per-line call chains. Match this in new code — compact/idiomatic JS will look out of place. Components and pages are `.jsx`; backend files are `.js`. There is no TypeScript.
