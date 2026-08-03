import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

/* ===================================================== */
/* =================== LAZY PAGES ====================== */
/* ===================================================== */

const Home = lazy(() => import("./pages/Home"));

const MyOrders = lazy(() => import("./pages/MyOrders"));

const ProductDetail = lazy(() => import("./pages/ProductDetail"));

const AddProduct = lazy(() => import("./pages/AddProduct"));

const EditProduct = lazy(() => import("./pages/EditProduct"));

const Cart = lazy(() => import("./pages/Cart"));

const Login = lazy(() => import("./pages/Login"));

const Register = lazy(() => import("./pages/Register"));

const Shipping = lazy(() => import("./pages/Shipping"));

const AdminOrders = lazy(() => import("./pages/AdminOrders"));

const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));

const Stores = lazy(() => import("./pages/Stores"));

const StorePage = lazy(() => import("./pages/StorePage"));

const CreateStore = lazy(() => import("./pages/CreateStore"));

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const MerchantDashboard = lazy(() => import("./pages/MerchantDashboard"));

const MerchantOrders = lazy(() => import("./pages/MerchantOrders"));

const MerchantProducts = lazy(() => import("./pages/MerchantProducts"));

const StoreSettings = lazy(() => import("./pages/StoreSettings"));

const MerchantCustomers = lazy(() => import("./pages/MerchantCustomers"));

const MerchantAnalytics = lazy(() => import("./pages/MerchantAnalytics"));

/* ===================================================== */
/* ================= ROUTE PROTECTION ================== */
/* ===================================================== */

import ProtectedRoute from "./components/ProtectedRoute";

import AdminRoute from "./components/AdminRoute";

import MerchantRoute from "./components/MerchantRoute";

/* ===================================================== */
/* =============== SUSPENSE FALLBACK =================== */
/* ===================================================== */

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">

    <div className="h-12 w-12 rounded-full border-2 border-border border-t-accent animate-spin" />

    <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">

      Loading...

    </p>

  </div>
);

function App() {

  return (

    <Suspense fallback={<PageLoader />}>

      <Routes>

        <Route
          path="/"
          element={<MainLayout />}
        >

          <Route
            index
            element={<Home />}
          />

          <Route
            path="product/:id"
            element={<ProductDetail />}
          />

          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />

          <Route
            path="placeorder"
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="myorders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="create-store"
            element={
              <ProtectedRoute>
                <CreateStore />
              </ProtectedRoute>
            }
          />

          <Route
            path="merchant/dashboard"
            element={
              <MerchantRoute>
                <MerchantDashboard />
              </MerchantRoute>
            }
          />

          <Route
            path="merchant/orders"
            element={
              <MerchantRoute>
                <MerchantOrders />
              </MerchantRoute>
            }
          />

          <Route
            path="merchant/products"
            element={
              <MerchantRoute>
                <MerchantProducts />
              </MerchantRoute>
            }
          />

          <Route
            path="merchant/analytics"
            element={
              <MerchantRoute>
                <MerchantAnalytics />
              </MerchantRoute>
            }
          />

          <Route
            path="merchant/customers"
            element={
              <MerchantRoute>
                <MerchantCustomers />
              </MerchantRoute>
            }
          />

          <Route
            path="merchant/settings"
            element={
              <MerchantRoute>
                <StoreSettings />
              </MerchantRoute>
            }
          />

          <Route
            path="add-product"
            element={
              <MerchantRoute>
                <AddProduct />
              </MerchantRoute>
            }
          />

          <Route
            path="admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="edit-product/:id"
            element={
              <MerchantRoute>
                <EditProduct />
              </MerchantRoute>
            }
          />

          <Route
            path="login"
            element={<Login />}
          />

          <Route
            path="forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="reset-password/:token"
            element={<ResetPassword />}
          />

          <Route
            path="register"
            element={<Register />}
          />

          <Route
            path="/store/:slug"
            element={<StorePage />}
          />

          <Route
            path="/stores"
            element={<Stores />}
          />

        </Route>

      </Routes>

    </Suspense>
  );
}

export default App;
