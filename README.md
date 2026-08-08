# SaaS

A multi-tenant e-commerce platform for independent stores of any kind. Every merchant
owns a store and manages its products and orders; a superadmin oversees all stores. Built as
two independent apps in one repo — a REST API and a React SPA.

```
backend/   Express 5 + Mongoose 9 (ESM) REST API on :5000
frontend/  React 19 + Vite 8 (JSX) SPA on :5173
```

## Features

- Multi-tenant architecture: `user | merchant | superadmin` roles
- Merchants create a store, list products, manage orders and customers
- Superadmin sees every store's products and orders
- Public storefront with per-store pages (`/store/:slug`)
- Razorpay checkout (create-order → verify → clear cart)
- Cloudinary image uploads
- AI shopping assistant chat (OpenAI) with markdown replies
- Password reset via real email (nodemailer/SMTP)
- 5% GST auto-applied server-side on every order
- Low-stock warnings, order cancellation with stock restore
- Framer Motion page transitions, loading skeletons, micro animations

## Tech stack

| App      | Stack |
| -------- | ----- |
| Backend  | Node.js, Express 5, Mongoose 9, JWT, Razorpay, Cloudinary, OpenAI, nodemailer |
| Frontend | React 19, Vite 8, JSX, Tailwind CSS 3, Framer Motion, react-router 7, react-markdown |

## Project structure

```
.
├── backend/
│   ├── config/          # cloudinary, razorpay
│   ├── controllers/     # store, product, order, payment, user, merchant, ai
│   ├── middleware/      # auth, role guards, store scoping, uploads
│   ├── models/          # User, Store, Product, Order
│   ├── routes/          # API routes
│   ├── services/        # analytics
│   ├── scripts/         # createAdmin.js
│   ├── utils/           # sendEmail.js, etc.
│   ├── server.js        # entry point (dotenv/config)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # UI primitives, skeletons, AnimatedOutlet, chatbot
    │   ├── contexts/    # AuthContext, CartContext
    │   ├── layouts/     # MainLayout
    │   ├── pages/       # Home, Stores, StorePage, ProductDetail, auth, merchant, admin
    │   ├── utils/       # api, pricing, razorpay, constants
    │   └── hooks/       # usePageMeta
    ├── vite.config.js   # dev /api proxy → :5000 (REQUIRED for dev)
    └── .env.example
```

## Getting started

Prerequisites: Node.js 20+, MongoDB running locally or a `MONGO_URI`.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in real values (see below)
npm run dev               # → http://localhost:5000
```

Create a superadmin (optional):

```bash
npm run seed:admin -- <email> <password>
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # set VITE_RAZORPAY_KEY
npm run dev               # → http://localhost:5173
```

In dev mode the frontend calls `/api` on 5173, which Vite proxies to the backend on
5000 (`vite.config.js`). Do not remove that proxy.

## Environment variables

Copy `.env.example` in each app and fill it in. Never commit real `.env` files
(already gitignored).

### Backend (`backend/.env`)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Signing secret for auth tokens |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | yes | Cloudinary uploads |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | yes | Razorpay payments |
| `OPENAI_API_KEY` / `OPENAI_MODEL` / `OPENAI_BASE_URL` | yes | AI assistant |
| `FRONTEND_URL` | no | Reset-link base, default `http://localhost:5173` |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` | no | SMTP (Gmail app password). If unset, reset links are logged to the console |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `VITE_RAZORPAY_KEY` | yes | Razorpay key for checkout |
| `VITE_API_URL` | no | Override API base; defaults to `/api` (dev proxy) or `http://localhost:5000/api` |

## Scripts

| App      | Command | What it does |
| -------- | ------- | ------------ |
| Backend  | `npm run dev` | Run with nodemon on :5000 |
| Backend  | `npm start` / `node server.js` | Run in production |
| Backend  | `npm run seed:admin -- <email> <password>` | Create/promote an admin |
| Frontend | `npm run dev` | Vite dev server on :5173 |
| Frontend | `npm run build` | Production build |
| Frontend | `npm run lint` | ESLint |

## Deployment (Render + Vercel)

The backend runs as a Render Web Service, the frontend on Vercel. Both read from the
same repo (monorepo — each dashboard points at its own subfolder).

### Backend on Render

1. Push the repo to GitHub.
2. Render dashboard → New → **Web Service** → connect the repo → **Root Directory**: `backend`.
3. **Build command**: `npm install` · **Start command**: `node server.js`
   (`server.js` already honors Render's `PORT` env var; it falls back to 5000 locally).
4. **Environment** → add every variable from `backend/.env`:
   `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `RAZORPAY_*`, `OPENAI_*`, `EMAIL_*`,
   and `FRONTEND_URL` = your Vercel URL (e.g. `https://vistaar.vercel.app`) so
   password-reset emails link to the deployed site.
5. MongoDB Atlas → **Network Access** → allow `0.0.0.0/0` (Render uses rotating egress IPs).
6. Deploy. Your API base becomes `https://<service>.onrender.com/api`.

> Render's free tier sleeps after ~15 min idle; the first request can take 30–60s to wake.

### Frontend on Vercel

1. Vercel → **Add New Project** → import the same repo.
2. Framework preset **Vite** · **Root Directory**: `frontend` (build `npm run build`,
   output `dist` are auto-detected).
3. **Environment variables**: `VITE_API_URL` = `https://<service>.onrender.com/api`,
   `VITE_RAZORPAY_KEY` = your Razorpay key.
4. Deploy. `vercel.json` rewrites handle client-side routing for react-router.

### After deploy

- Admin account: run `npm run seed:admin -- <email> <password>` against the same Atlas
  DB (locally or from a Render Shell).

## Roles

- **user** — browse, cart, order, track own orders
- **merchant** — owns a store; CRUD products, manage orders/customers, analytics
- **superadmin** — access to every store's products and orders

## Notes

- Order totals are always recomputed server-side (subtotal + 5% GST, rounded); client
  totals are ignored.
- Admin routes require `superadmin`; merchant routes require `merchant` + a store.
- CORS is open (`app.use(cors())`) — intended for dev; lock it down for production.
