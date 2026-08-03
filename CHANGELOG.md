# CHANGELOG — Saree SaaS

> Complete log of every change made across the entire codebase, with **before / after**,
> the **reason**, and the **impact** of each change.
>
> Covers: merchant SaaS core (Phase 1), monetization (added & removed), AI & analytics
> (Phase 3), store-scoped product visibility, role-based navigation, and the
> `admin → superadmin` role rename.

---

## Table of Contents

1. [Phase 1 — Merchant SaaS Core](#1-phase-1--merchant-saas-core)
2. [Phase 2 — Monetization (added, then fully removed)](#2-phase-2--monetization-added-then-fully-removed)
3. [Phase 3 — AI & Analytics](#3-phase-3--ai--analytics)
4. [Products visible only through Stores](#4-products-visible-only-through-stores)
5. [Role-based Navigation UI](#5-role-based-navigation-ui)
6. [Role rename: admin → superadmin](#6-role-rename-admin--superadmin)
7. [Image galleries, inventory & customer chatbot](#7-image-galleries-inventory--customer-chatbot)
8. [Fix: blank page + My Orders missing](#8-fix-app-rendered-a-blank-page--my-orders-missing)
9. [Phase 4 — "Minimalist Modern" full UI redesign](#9-phase-4--minimalist-modern-full-ui-redesign)

---

## 1. Phase 1 — Merchant SaaS Core

The platform went from a single-tenant storefront to a multi-tenant marketplace where
any user can open a store, become a merchant, and manage products/orders/customers.

### 1.1 New merchant pages (frontend)

| File (new) | Purpose |
|---|---|
| `frontend/src/pages/CreateStore.jsx` | Form to create a store; POSTs to `/api/stores`, then flips the local role to `merchant` so merchant features unlock immediately |
| `frontend/src/pages/MerchantDashboard.jsx` | Fetches `/stores/me` + `/merchant/dashboard`; stat cards, quick links, recent orders |
| `frontend/src/pages/MerchantOrders.jsx` | Lists merchant orders; status dropdown; "mark delivered" action |
| `frontend/src/pages/MerchantProducts.jsx` | Lists merchant products; delete action |
| `frontend/src/pages/MerchantCustomers.jsx` | Lists a merchant's customers |
| `frontend/src/pages/StoreSettings.jsx` | Edit store name/slug/description, logo upload, theme picker |
| `frontend/src/utils/themes.js` | `THEMES` array (`default`, `royal`, `emerald`, `midnight`) + `getTheme()` helper |

**Why:** merchants needed dedicated tooling to run their store.
**Impact:** merchants now have a full management area instead of nothing.

### 1.2 App.jsx routing

- **Before:** no merchant pages; `add-product` / `edit-product/:id` guarded by `AdminRoute`.
- **After:** added imports + routes:
  - `/create-store`
  - `/merchant/dashboard`, `/merchant/orders`, `/merchant/products`, `/merchant/customers`, `/merchant/settings`
  - `add-product` / `edit-product/:id` moved from `AdminRoute` → `MerchantRoute` (admins still pass because MerchantRoute allows admin).

**Why:** merchants needed access to their own product CRUD, which was admin-only.
**Impact:** merchants can manage products; the old admin-only gate no longer blocks them.

### 1.3 Productcard.jsx — owner/admin gate

- **Before:** edit/delete buttons were not gated by ownership.
- **After:** `isOwnerOrAdmin = role === "admin" || (role === "merchant" && user.store === product.store?._id)`.

**Why:** only the store owner (or a superadmin) should manage a product.
**Impact:** buyers can no longer see edit/delete actions; merchants only see them on their own products.

### 1.4 AddProduct.jsx — store picker

- **Before:** every user who reached the page picked a store.
- **After:** the store `<select>` renders **only when the user is admin** (`isAdmin`); merchants rely on their own linked store (`req.store`).

**Why:** a merchant should never choose a different store than their own.
**Impact:** merchants can't misassign products; admins can still assign to any store.

### 1.5 EditProduct.jsx — image upload

- **Before:** product image could not be changed from the edit page.
- **After:** Cloudinary upload via `/api/upload` with preview, same pattern as AddProduct.

**Why:** editing a product required re-uploading an image.
**Impact:** full product editing capability.

### 1.6 StorePage.jsx — theme-aware storefront

- **Before:** every store looked identical.
- **After:** reads the store's `theme` via `getTheme()` and applies `theme.banner` / `theme.btn` colors.

**Why:** stores should look distinct per merchant branding.
**Impact:** storefronts are now themed.

### 1.7 Debug log cleanup

- **Before:** `console.log("PRODUCT SCHEMA:")` in `backend/models/Product.js`; `console.log(CartProvider)` in `frontend/src/main.jsx`.
- **After:** both removed.

**Why:** leftover debug noise.
**Impact:** cleaner console output.

### 1.8 Backend merchant support

- **Before:** merchants had no API surface.
- **After:**
  - `backend/controllers/merchantController.js` (new) — merchant dashboard, orders, products, customers, analytics.
  - `backend/routes/merchantRoutes.js` (new) — `GET /merchant/dashboard|orders|products|customers|analytics`, all behind `protect + merchant + merchantStore`.
  - `backend/controllers/storeController.js` — `getMyStore` (`GET /stores/me`) returns the merchant's own store.

**Why:** the frontend merchant pages need these APIs.
**Impact:** merchants can manage their business end-to-end.

---

## 2. Phase 2 — Monetization (added, then fully removed)

### 2.1 Added subscription plans

- **Before:** no billing concept.
- **After (briefly):** `storeModel.js` gained a `subscription` field; plan → `free | basic | pro | enterprise` with pricing ₹0 / ₹299 / ₹599 / ₹1499; full SaaS gating planned; all themes kept free.

### 2.2 Removed entirely

- **Before:** `subscription` field existed on the Store model.
- **After:** `storeModel.js` dropped the `subscription` field; `storeController.js` no longer selects it; all gating code removed.

**Why (per user):** *"remove that subscription thing entirely, make it everything for everyone."*
**Impact:** no paywalls anywhere — every store and theme is free for all users.

---

## 3. Phase 3 — AI & Analytics

### 3.1 Backend — analytics service

**File:** `backend/services/analyticsService.js` (new) — `getStoreAnalytics(storeId)`.

- **Before:** merchants had no sales data.
- **After:** returns:
  - `dailySales` — last 30 days (aggregated by `%Y-%m-%d`)
  - `topProducts` — top 5 by revenue (`$unwind` on order items)
  - `categoryRevenue` — revenue grouped by product category
  - `orderStatusBreakdown` — orders per status
  - `totalRevenue` — paid orders only

**Impact:** merchants get real numbers to grow on.

### 3.2 Backend — analytics endpoint

- **Before:** no `/merchant/analytics`.
- **After:** `GET /api/merchant/analytics` (`protect + merchant + merchantStore`) in `merchantRoutes.js`, controller `getMerchantAnalytics`.

### 3.3 Backend — AI controller & routes

**Files:** `backend/controllers/aiController.js`, `backend/routes/aiRoutes.js` (new).

- `callOpenAI()` — POSTs to `OPENAI_BASE_URL || https://api.openai.com/v1/chat/completions`; model `OPENAI_MODEL || "gpt-4o-mini"`; 15 s `AbortController` timeout; returns `data.choices[0].message.content`.
- `POST /api/ai/product-description` — writes a 2–3 sentence description from name + category.
- `POST /api/ai/sales-insights` — feeds analytics into the model, returns 3–4 sentence business summary.
- Mounted in `server.js` at `/api/ai`.

**Why:** wanted AI-assisted product writing and insights.
**Impact:** merchants/admin can generate descriptions and get AI business summaries.

### 3.4 Backend — product recommendations

- **Before:** product detail page had no related products.
- **After:** `getProductRecommendations` + `GET /api/products/:id/recommendations` — same store + category, excluding self, limit 4 (fallback: same store).

### 3.5 Frontend — analytics page

- `npm install recharts` (bundles: 464 modules → 1039 modules; chunk warning `>500 kB`, ~860 kB JS).
- `frontend/src/pages/MerchantAnalytics.jsx` (new) — fetches `/merchant/analytics`; zero-fills 30-day revenue; `AreaChart` (revenue), `BarChart` (top products), `PieChart` (category revenue), status chips.
- Route `/merchant/analytics` added in `App.jsx` (MerchantRoute); "Analytics" link in Navbar.

### 3.6 Frontend — AI in the UI

- `MerchantDashboard.jsx` — "AI Insights" panel: Generate / Regenerate Summary button → `POST /api/ai/sales-insights`; quick-links grid `md:grid-cols-3 lg:grid-cols-5`; added Analytics quick-link card.
- `AddProduct.jsx` + `EditProduct.jsx` — "✨ Generate with AI" button → `POST /api/ai/product-description` fills the description field.
- `ProductDetail.jsx` — "You may also like" grid of `ProductCard`s from `/products/:id/recommendations`.

### 3.7 Env / key wiring

- **Before:** no AI config.
- **After (`backend/.env`):**
  - `OPENAI_API_KEY` (Bynara Router key, `sk-nry-…`)
  - `OPENAI_MODEL=gpt-5.4`
  - `OPENAI_BASE_URL=https://router.bynara.id/v1/chat/completions`
- `aiController.js` reads `OPENAI_BASE_URL` (added after the key turned out to be Bynara-proxy only — default OpenAI endpoint returned 401).

**Impact:** AI works through the user's Bynara proxy account.

### 3.8 AI route fix — admins were blocked

- **Before:** `/api/ai/product-description` used `protect + merchant + merchantStore` → admins got **403 "Merchant access only"**, so "Generate with AI" failed on the AddProduct page for admins.
- **After:** `merchant` → `adminOrMerchant` (superadmin or merchant).
- `POST /api/ai/sales-insights` kept merchant-only (it needs `req.store`).

**Why:** superadmins add products too and should use the AI button.
**Impact:** AI generation now works for both roles.

---

## 4. Products visible only through Stores

The global product catalog was removed; products are reachable **only via a store's page**.

### 4.1 Backend

- **Before:** `GET /api/products` returned every product across all stores.
- **After:** route + `getProducts` controller deleted. Only `GET /api/products/store/:slug` (store products) remains.
- Verified live: `GET /api/products` → **404**, `/api/products/store/shivam-sarees` → **200**.

### 4.2 Frontend

- Deleted `frontend/src/pages/Products.jsx` (the all-products listing page).
- `App.jsx` — removed the `/products` route + import.
- `Navbar.jsx` — removed the "Products" link.
- `Home.jsx` — hero CTA `Explore Now → /products` changed to `Explore Stores → /stores`.
- `ProductDetail.jsx` — `← Back to Products` (→ `/`) changed to `← Back to Store` (→ `/store/${product.store.slug}`, fallback `/stores`).

**Why (per user):** *"the products should be visible only through stores… i don't think all the products should be visible."*
**Impact:** buyers browse per-store; there's no cross-store catalog anymore.

---

## 5. Role-based Navigation UI

The navbar is now visually and structurally different per role.

### 5.1 Structure per role (final state)

| Role | Nav links |
|---|---|
| **Merchant** | Stores, Dashboard, Orders, Analytics, Products, Store (settings). **No cart.** |
| **User** | Stores, My Orders, "Open a Store" button. |
| **Superadmin** | Stores, Add Product, Manage Orders. |
| Logged out | Stores. |

### 5.2 Visual differentiation

- **Merchant:** indigo-tinted bar, amber logo badge, subtitle "Merchant Workspace", amber link hover, amber **MERCHANT** pill next to name.
- **Superadmin:** purple-tinted bar, purple logo badge, subtitle "Superadmin Console", purple **SUPERADMIN** pill.
- **User / logged out:** black bar, pink logo badge, subtitle "Luxury Fashion Store", pink hover.

**Why (per user):** *"i still see the navbar same for both merchant and user roles… make those different."*
**Impact:** at a glance you know which workspace you're in.

### 5.3 Cart & My Orders rules

- **My Orders** — **Before:** shown for any logged-in user (then removed entirely). **After:** shown **only for normal users** (role `user`).
- **Cart** — **After:** hidden for merchants (`{!isMerchant && …}`), visible for users/superadmins/logged-out visitors.

**Why (per user):** *"remove my orders for normal users… remove cart for merchants"* (final correction: My Orders was actually wanted **back** for normal users).
**Impact:** merchants get a shopping-free workspace; shoppers keep orders + cart.

### 5.4 Reverted detour

An intermediate version collapsed the merchant nav to a single "Create a Store" link; that was reverted — merchants again get the full separate links (Dashboard, Orders, Analytics, Products, Store). *("the merchant should be able to see dashboard and analytics separately and not just create a store.")*

---

## 6. Role rename: admin → superadmin

The `admin` role was renamed to `superadmin` (roles are now `user | merchant | superadmin`).

### 6.1 Backend

| File | Before | After |
|---|---|---|
| `models/User.js` | `enum: ["user", "admin", "merchant"]` | `enum: ["user", "merchant", "superadmin"]` |
| `middleware/adminMiddleware.js` | `req.user.role === "admin"` | `req.user.role === "superadmin"`; message "Superadmin access only" |
| `middleware/adminOrMerchant.js` | `role === "admin" \|\| role === "merchant"` | `role === "superadmin" \|\| role === "merchant"`; message updated |
| `middleware/storeMiddleware.js` | `if (req.user.role === "admin") next()` | `if (req.user.role === "superadmin") next()` |
| `scripts/createAdmin.js` | creates/promotes `role: "admin"` | creates/promotes `role: "superadmin"` (name "Superadmin") |

### 6.2 Frontend

| File | Before | After |
|---|---|---|
| `components/AdminRoute.jsx` | `role !== "admin"` | `role !== "superadmin"` |
| `components/MerchantRoute.jsx` | `role !== "merchant" && role !== "admin"` | `role !== "merchant" && role !== "superadmin"` |
| `components/Navbar.jsx` | `isAdmin = role === "admin"`, "Admin Console", "Admin" badge | `"superadmin"`, "Superadmin Console", "SUPERADMIN" badge |
| `components/Productcard.jsx` | `isOwnerOrAdmin` used `"admin"` | uses `"superadmin"` |
| `pages/AddProduct.jsx` | `isAdmin` checked `"admin"` | checks `"superadmin"` |
| `pages/AdminOrders.jsx` | heading "Admin Dashboard" | "Superadmin Dashboard" |

### 6.3 Data migration

- Ran a migration script (`updateMany({ role: "admin" }, { role: "superadmin" })`).
- **Result:** `matchedCount: 0` — the local DB contained only `shivam` (merchant) and `demo` (user), so no migration was needed.
- To create a superadmin: `npm run seed:admin -- <email> <password>` from `backend/`.

**Why (per user):** *"there is nothing called as admins now… we have user who shop through stores, we have merchants who own stores and the products and a superadmin."*
**Impact:** role naming matches the new multi-tenant architecture; no single-tenant "admin" concept remains.

---

## 7. Image galleries, inventory & customer chatbot

This phase adds seller e-commerce capabilities (multi-image product galleries, stock
tracking + low-stock alerts) and a storefront AI chatbot for customers. Phase 4
(hardening/deploy) is on hold per the user.

### 7.1 Product model — galleries & stock (backend)

- `models/Product.js` — added `images: [String]` (default `[]`) and `stock: Number`
  (required, min `0`, default `0`).
- Data migration: existing 8 products set to `stock: 100, images: []`
  (`modifiedCount: 8`; script deleted after running).

### 7.2 Product CRUD & stock route (backend)

- `controllers/productController.js` — `createProduct` / `updateProduct` accept
  `images` (array) and `stock`; update uses `updateFields` so `images`/`stock` are only
  applied when present in the request body.
- New `updateProductStock` controller + `PUT /api/merchant/products/:id/stock`
  (`routes/merchantProductRoutes.js`) for quick stock adjustments.

### 7.3 Stock enforcement on orders (backend)

- `controllers/orderController.js` — `placeOrder` returns **400 "Insufficient stock"**
  when requested qty exceeds stock; after saving, stock is reserved via atomic
  `$inc: -qty`. Order cancel restores stock (`$inc: +qty`). Server still recomputes
  totals (subtotal + 5% GST) and gating on `isPaid` unchanged.

### 7.4 Merchant dashboard low-stock (backend)

- `controllers/merchantController.js` — dashboard response now includes
  `lowStockProducts` (stock ≤ 10, ascending).

### 7.5 Customer chatbot (backend)

- `controllers/aiController.js` — new `chatReply`: store slug + message + optional
  history; builds context from the store's top 20 products; `callOpenAI` is the only
  valid OpenAI entry point (Bynara router).
- `routes/aiRoutes.js` — `POST /api/ai/chat` (public, no auth).

### 7.6 Frontend — seller tools & shopper UI

| File | Change |
|---|---|
| `pages/AddProduct.jsx` | `images` array + multi-file gallery upload/preview/remove; `stock` field |
| `pages/EditProduct.jsx` | same gallery + stock editing |
| `pages/ProductDetail.jsx` | gallery thumbnails (active image state), stock badge, "out of stock" blocks Add to Cart |
| `components/Productcard.jsx` | grayscale when out of stock; stock badge (Out / Only X left / In Stock) |
| `pages/StorePage.jsx` | mounts `ChatBot`; `relative` card wrapper for badges |
| `components/ChatBot.jsx` (new) | floating widget posting to `/api/ai/chat` |
| `pages/MerchantProducts.jsx` | stock badge + inline "Edit Stock" (PUT `:id/stock`) |
| `pages/MerchantDashboard.jsx` | amber "Low Stock Alerts" card when `lowStockProducts` non-empty |
| `store/CartContext.jsx` | qty capped at `product.stock` (alert "Only X in stock"); `updateQuantity` clamps to stock |

### 7.7 Verification

- Backend: all changed files pass `node --check`; running server confirmed.
- Frontend: `eslint` → 0 errors; `vite build` passes.
- Live: `POST /api/ai/chat` → **200** with a store-aware reply listing products + stock.
- All of the above remains uncommitted.

---

## 8. Fix: app rendered a blank page ("nothing is loading") + My Orders missing

Two real-world bugs surfaced in the built app. Both traced to how sessions/cart are read
out of `localStorage`.

### 8.1 Blank-page crash from corrupt `localStorage`

- **Before:** `store/CartContext.jsx` did an unguarded
  `JSON.parse(localStorage.getItem("cart"))` and `JSON.parse(...("shippingAddress"))`
  at provider init, and `store/AuthContext.jsx` did the same for `userInfo`.
- **Bug:** any old/corrupt stored value (e.g. the literal string `"undefined"` that
  legacy `localStorage.setItem` calls leave behind, or a truncated JSON string) throws
  during the **first render of the providers** → React renders an empty `<div id="root">`
  → the whole app looks like "nothing is loading".
- **Reproduced:** headless Chrome with `localStorage.cart = "undefined"` → root page
  rendered empty. After fix → full app renders.
- **After:** both providers parse safely (`try/catch`); on failure they log, clear the
  bad key, and fall back to a sane default (`[]` / empty address / `null` session).

### 8.2 My Orders (and role-based nav) missing for stale sessions

- **Before:** Navbar checked `userInfo?.user?.role`, but sessions persisted before the
  `{ token, user: {...} }` shape (flat `{ token, role, name }`, or role `"admin"` before
  the rename to `superadmin`) never matched → "My Orders", merchant/superadmin links all
  silently disappeared.
- **After:** `AuthContext` normalizes any stored shape into `{ token, user: {...} }` and
  maps legacy `"admin"` → `"superadmin"`. My Orders/role nav now work for both fresh and
  stale sessions (verified in headless Chrome with a flat legacy session).
- Also removed a stray `3` that sat at the bottom of `utils/api.js`.

**Why:** the app worked on a fresh login but died on browsers with pre-existing storage —
which is exactly the "nothing is loading / My Orders removed" report.
**Impact:** blank-page crash eliminated; role-based UI is resilient to old sessions.

---

## 9. Phase 4 — "Minimalist Modern" full UI redesign

Per the user's reference style ("Minimalist Modern"): **electric blue gradient
(#0052FF → #4D7CFF)** as the single accent, dual-font typography (Calistoga display +
Inter body + JetBrains Mono labels), animated hero/depth, inverted sections, gradient
text/borders, and **per-store theme removal** — every store now uses the unified blue.

### 9.1 Design tokens & global setup

- `tailwind.config.js` — full token set under `theme.extend`: colors
  (`background`, `foreground`, `muted`, `muted-foreground`, `accent`, `accent-secondary`,
  `accent-foreground`, `border`, `card`, `ring`); fonts `display` (Calistoga) / `sans`
  (Inter) / `mono` (JetBrains Mono); shadows `accent` / `accent-lg`; keyframes
  `pulse-dot`, `float`, `spin-slow`.
- `index.html` — Google Fonts (Calistoga, Inter 400–700, JetBrains Mono 400/500), title
  changed to "Saree SaaS", meta description added.
- `src/index.css` — base styles, `.gradient-bg` / `.gradient-text` / `.dot-pattern`
  utilities, `prefers-reduced-motion` block.
- New `src/lib/utils.js` — `cn()` (clsx + tailwind-merge).
- Installed: `class-variance-authority`, `tailwind-merge`, `clsx`.

### 9.2 UI primitives (new)

| File | Contents |
|---|---|
| `components/ui/button.jsx` | `Button` via cva — variants `primary/secondary/outline/ghost/danger`, sizes `sm/md/lg/icon`; renders a plain `<button>` (Links-as-buttons use `gradient-bg` classes) |
| `components/ui/card.jsx` | `Card` + `FeaturedCard` (gradient-border) |
| `components/ui/input.jsx` | `Input` + `Textarea` |
| `components/ui/badge.jsx` | `SectionLabel` (pill w/ pulsing dot) + `Badge` (status pill) |

### 9.3 Theme system removed

- **Before:** `src/utils/themes.js` (`THEMES` array: `default/royal/emerald/midnight`) and
  a theme picker in `StoreSettings.jsx`; `StorePage.jsx` applied per-store banner/btn colors.
- **After:** `themes.js` **deleted** (no remaining references); `StoreSettings.jsx`
  rewritten without the picker (name/slug/description/logo + upload + preview);
  `StorePage.jsx` uses the unified dark-gradient banner overlay
  `bg-gradient-to-b from-foreground/50 via-foreground/70 to-foreground` with the store
  name in white display font.

**Why (per user):** unify on blue — remove the theme picker.
**Impact:** one consistent brand across every store; one less per-store field.

### 9.4 Shared components restyled

- `Navbar.jsx` — light `bg-background/80 backdrop-blur` bar, gradient logo box, role-aware
  links (user: Stores/My Orders/Open a Store; merchant: Dashboard/Orders/Analytics/
  Products/Store; superadmin: Add Product/Manage Orders), gradient cart badge, role chips,
  `Button`/outline Logout, gradient Register link.
- `ChatBot.jsx` — floating gradient button; panel with dark dot-pattern header,
  `animate-pulse-dot` "Store assistant", gradient user bubbles, assistant cards,
  typing dots, Enter-to-send, autoFocus.
- `Productcard.jsx` — `bg-card border-border` card, category pill, wishlist button, stock
  badges, gradient price + gradient eye button, owner/admin Edit/Delete actions.

### 9.5 Pages restyled

All pages were restyled to the new system (SectionLabel + gradient headline, Card
wrappers, Button/Input primitives, gradient accents, inverted sections, framer-motion
fade/stagger on Home):

`Home.jsx` (asymmetric hero grid, animated hero graphic — rotating dashed ring,
gradient-border image card, floating stat/product cards, ambient glow, dot grid;
inverted `bg-foreground text-background` stats band; CTA card),
`Stores.jsx`, `StorePage.jsx`, `ProductDetail.jsx`, `Cart.jsx` (GST 5% row),
`Shipping.jsx`, `PlaceOrder.jsx` (payment method radio cards),
`MyOrders.jsx` (inverted per-order header + status steps tracker),
`Login.jsx` / `Register.jsx`, `CreateStore.jsx`,
`MerchantDashboard.jsx`, `MerchantProducts.jsx`, `MerchantOrders.jsx`,
`MerchantAnalytics.jsx`, `MerchantCustomers.jsx`, `AddProduct.jsx`,
`EditProduct.jsx`, `AdminOrders.jsx`, `StoreSettings.jsx`.

All fetch/handler/recharts logic preserved; only presentation changed.

### 9.6 Verification

- `eslint` → **0 errors** (fixed a `react-refresh/only-export-components` error by
  removing the `buttonVariants` export from `ui/button.jsx`).
- `vite build` → passes (chunk-size warning only, pre-existing recharts).
- Live: frontend dev server 200 on 5173, backend 200 on 5000.
- All of this remains uncommitted.

---

## 10. Post-redesign polish — image lightbox

- New `components/ImageLightbox.jsx`: full-screen viewer with `object-contain` image,
  prev/next arrows, "n / total" counter, clickable thumbnails, and Escape / arrow-key
  keyboard navigation.
- `pages/ProductDetail.jsx` gallery rewired: gallery now `[product.image, ...product.images]`
  (deduped), so the primary image is included; main image is clickable and has an expand
  button; thumbnails drive the active image.
- **Why:** the shopper couldn't inspect product photos up close.
  **Impact:** full-screen zoom for every product; lint + build passed.

---

## 11. Cleanup round + Forgot Password + Superadmin dashboard

Scope agreed with user: **B** (dead UI/deps), **C** (tech debt), **D** (features) —
**no** ship-readiness work (nothing committed), **no** reviews/ratings, wishlist = remove
the button.

### 11.1 Dead UI & unused deps removed

- `components/Productcard.jsx` — wishlist heart + `FaHeart` import removed (no wishlist
  client-side or backend — per user decision).
- Frontend `npm uninstall razorpay` — package was unused (checkout uses the global script
  in `index.html` + `utils/razorpay.js`).
- `App.jsx` rewritten with `React.lazy` + `<Suspense fallback={<PageLoader />}>` so every
  route is a separate chunk (confirmed in build output); added routes
  `/forgot-password` and `/reset-password/:token`.

### 11.2 Tech-debt cleanup

- `server.js` — added `import "dotenv/config"` at the top (removes reliance on the
  cloudinary.js side effect; `config/env.js` was dead code and is deleted) and removed
  startup/debug `console.log`s (Mongo/Cloudinary/port).
- GST centralised: new `frontend/src/utils/pricing.js` (`GST_RATE`, `GST_RATE_PERCENT`,
  `roundGstTotal`) used by `Cart.jsx` + `PlaceOrder.jsx`; backend `orderController.js`
  gained `GST_RATE = 0.05` and uses `Math.round(subtotal * (1 + GST_RATE))` — the 5% and
  rounding now live in exactly one place per app.
- Low-stock threshold centralised: new `frontend/src/utils/constants.js`
  `LOW_STOCK_THRESHOLD = 10` (Productcard, MerchantProducts, ProductDetail) and a
  `LOW_STOCK_THRESHOLD` const in `backend/controllers/merchantController.js`.
- Network-error copy centralised: `apiErrorMessage()` added to `utils/api.js`, used by
  Stores, StorePage, ProductDetail (kills "Network Error" port-5000 strings).
- Created `backend/.env.example` and `frontend/.env.example`.

### 11.3 Search / filter / sort (shopper)

- `pages/Stores.jsx` — search input + sort dropdown (Newest / A–Z / Z–A), live
  `filteredStores`.
- `pages/StorePage.jsx` — search input, category filter chips, sort select
  (Featured / Price low→high / Price high→low / Name), `filteredProducts`, and empty /
  no-match states.

### 11.4 User can cancel own order

- `orderController.js` — `cancelOrder` now allows the order **owner** (or superadmin /
  merchant-staff), blocks cancelling delivered orders, and restores product stock.
  `updateOrderStatus` to "Cancelled" also restores stock and blocks if delivered.
- `orderRoutes.js` — `PUT /:id/cancel` changed from `protect, admin` to `protect` only.
- `pages/MyOrders.jsx` — danger Cancel button (hidden once delivered/cancelled); fetch
  refactored to `useCallback`.

### 11.5 Forgot password

- `models/User.js` — added `resetPasswordToken` / `resetPasswordExpire`.
- New `backend/utils/sendEmail.js` — dynamically imports nodemailer only when SMTP env
  vars are set; otherwise prints the reset link to the console (dev fallback).
- `userController.js` — `forgotPassword` (random 32-byte token, stored SHA-256-hashed,
  1-hour expiry, link to `process.env.FRONTEND_URL || "http://localhost:5173"`) and
  `resetPassword` (verifies token + expiry, rehashes password).
- `userRoutes.js` — `POST /api/users/forgot-password`, `PUT /api/users/reset-password/:token`.
- Frontend: new `pages/ForgotPassword.jsx` + `pages/ResetPassword.jsx`; "Forgot password?"
  link added to `Login.jsx`.

### 11.6 Superadmin dashboard distinct from merchant

- `orderController.js getAllOrders` — now `.populate("store", "name slug logo")`.
- `pages/AdminOrders.jsx` — store filter dropdown (superadmin sees all stores) +
  4 stat cards (Total Orders, Revenue from `isPaid`, Unpaid, Pending) replacing the
  single total-orders card, plus a "no orders for this store" state.

### 11.7 SEO + asset cleanup

- New `src/hooks/usePageMeta.js` (title/description/theme-color) applied to Home, Stores,
  StorePage, ProductDetail.
- Deleted unused `src/assets/vite.svg` + `src/assets/react.svg` (hero.png remains).

### 11.8 Dead-code sweep (no behavior change)

- Deleted `backend/config/env.js` (never imported — dead code).
- `middleware/authMiddleware.js` — removed debug `console.log`s that dumped the raw
  Authorization header and decoded JWT on every request.
- `config/cloudinary.js` — removed debug logs (kept `dotenv.config()`).
- `paymentController.js` — removed `console.log(req.body)` on every payment request.
- Removed non-catch debug logs in `CartContext.jsx`, `AuthContext.jsx`, `EditProduct.jsx`,
  `AddProduct.jsx`, `PlaceOrder.jsx`, `Register.jsx`, `Productcard.jsx`, `utils/razorpay.js`
  (catch-block error logs kept).
- The vite `/api` proxy was briefly removed during the sweep and immediately restored — it is **required** in dev mode (`API_URL` is the relative `/api` then). Kept in `vite.config.js`; no behavior change.
- Removed the leftover per-store theme system: `storeModel.js` `theme` field and every
  `theme` reference/select in `storeController.js` (frontend picker removed in Phase 4).

### 11.9 Verification

- Backend: all changed files pass `node --check`; server restarted on 5000;
  `GET /api/stores` 200 and `POST /api/users/forgot-password` 200.
- Frontend: `eslint` → **0 errors**; `vite build` → passes with lazy route chunks.
- Nothing committed.

---

## 12. Real email delivery (SMTP) + chatbot markdown

### 12.1 Incident: login 404 after proxy removal

- **Bug:** during the dead-code sweep the vite `/api` proxy was removed. In dev mode
  `API_URL` is the relative `/api`, so the browser called the Vite server directly →
  `POST /api/users/login` returned **404**.
- **Fix:** restored the proxy in `vite.config.js` (`/api` → `http://localhost:5000`) and
  restarted the dev server. AGENTS.md updated to warn the proxy is **required** in dev.
- **Verified:** through the proxy `/api/stores` 200, `/api/users/login` 401 (bad creds).

### 12.2 Chatbot showed raw `**` markers

- **Bug:** the AI assistant's markdown (`**bold**`, `-` lists) rendered as raw text in the
  chat bubble.
- **After:** installed `react-markdown`; assistant replies now render through
  `<Markdown>` inside a `.markdown` bubble class (bold, lists, links, code, headings)
  added to `src/index.css`. Chat prompt also tells the model to use plain text (no
  `**`, `*`, `#`, backticks).
- **Why:** markdown emphasis now renders as bold instead of leaking literal `**`.
  **Impact:** StorePage chunk grew (~125 KB) due to react-markdown.

### 12.3 Password-reset email actually sends

- **Before:** `sendEmail.js` only logged the link to the server console (no SMTP vars set,
  and `nodemailer` wasn't installed).
- **After:**
  - Installed `nodemailer` in `backend/`.
  - `sendEmail.js` (new util): uses SMTP when `EMAIL_HOST/USER/PASS` are set, otherwise
    falls back to logging the link to the console (dev).
  - Added `EMAIL_HOST= smtp.gmail.com`, `EMAIL_PORT=587`, `EMAIL_USER`, `EMAIL_PASS` and
    `FRONTEND_URL` to `backend/.env` and `backend/.env.example`.
- **Bug during setup:** the 16-char Gmail app password was pasted **with spaces**
  (`rwbr cntk dcjn nrsm`) → SMTP auth would have failed. Stripped the spaces to
  `rwbrcntkdcjnnrsm`.
- **Verified end-to-end:** restarted backend on 5000; `POST /api/users/forgot-password`
  for `shivamjalan739@gmail.com` → HTTP 200, token hash + 60-min expiry written to the
  user record, and the email **arrived in the recipient's inbox**.

**How it works for any user:** the sender is always the configured Gmail account; the
recipient is whichever email the user registered with (`user.email`). Only registered
accounts get a link (unknown emails return the same generic message, no leak). Gmail
caps app-password sending (~500/day) — fine for dev; a transactional provider is the
production upgrade.

---

## Verification status

- Backend: all changed files pass `node --check` (syntax); running server verified on 5000.
- Frontend: `eslint` → **0 errors**; `vite build` → passes (lazy route chunks confirmed).
- Live API verified: `GET /api/stores` 200, `POST /api/users/forgot-password` 200.
- **Password-reset email delivered** to a real Gmail inbox (SMTP via nodemailer).
- Blank-page bug reproduced & fixed (corrupt `localStorage` no longer crashes the app).
- Nothing has been committed to git since `031361d` ("fixed the vite proxy server"); the entire backlog above is uncommitted.
