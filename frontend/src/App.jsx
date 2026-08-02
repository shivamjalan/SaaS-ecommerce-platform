import {
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

/* ===================================================== */
/* ====================== PAGES ======================== */
/* ===================================================== */

import Home from "./pages/Home";

import Products from "./pages/Products";

import MyOrders from "./pages/MyOrders";

import ProductDetail from "./pages/ProductDetail";

import AddProduct from "./pages/AddProduct";

import EditProduct from "./pages/EditProduct";

import Cart from "./pages/Cart";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Shipping from "./pages/Shipping";
import AdminOrders from "./pages/AdminOrders";
import PlaceOrder from "./pages/PlaceOrder";
import Stores from "./pages/Stores";
import StorePage from "./pages/StorePage";
import CreateStore from "./pages/CreateStore";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantOrders from "./pages/MerchantOrders";
import MerchantProducts from "./pages/MerchantProducts";
import StoreSettings from "./pages/StoreSettings";
import MerchantCustomers from "./pages/MerchantCustomers";

/* ===================================================== */
/* ================= ROUTE PROTECTION ================== */
/* ===================================================== */

import ProtectedRoute from "./components/ProtectedRoute";

import AdminRoute from "./components/AdminRoute";

import MerchantRoute from "./components/MerchantRoute";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<MainLayout />}
      >

        {/* ===================================================== */}
        {/* ===================== HOME PAGE ===================== */}
        {/* ===================================================== */}

        <Route
          index
          element={<Home />}
        />

        {/* ===================================================== */}
        {/* ==================== PRODUCTS ======================= */}
        {/* ===================================================== */}

        <Route
          path="products"
          element={<Products />}
        />

        {/* ===================================================== */}
        {/* ================= PRODUCT DETAILS =================== */}
        {/* ===================================================== */}

        <Route
          path="product/:id"
          element={
            <ProductDetail />
          }
        />

        {/* ===================================================== */}
        {/* ======================= CART ======================== */}
        {/* ===================================================== */}

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* ===================================================== */}
        {/* ===================== SHIPPING ====================== */}
        {/* ===================================================== */}

        <Route
          path="shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />

        {/* ===================================================== */}
        {/* ==================== PLACE ORDER ==================== */}
        {/* ===================================================== */}

        <Route
          path="placeorder"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />

        {/* ===================================================== */}
        {/* ==================== MY ORDERS ====================== */}
        {/* ===================================================== */}

        <Route
          path="myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* ===================================================== */}
        {/* ==================== CREATE STORE =================== */}
        {/* ===================================================== */}

        <Route
          path="create-store"
          element={
            <ProtectedRoute>
              <CreateStore />
            </ProtectedRoute>
          }
        />

        {/* ===================================================== */}
        {/* ================= MERCHANT DASHBOARD ================ */}
        {/* ===================================================== */}

        <Route
          path="merchant/dashboard"
          element={
            <MerchantRoute>
              <MerchantDashboard />
            </MerchantRoute>
          }
        />

        {/* ===================================================== */}
        {/* ================= MERCHANT ORDERS =================== */}
        {/* ===================================================== */}

        <Route
          path="merchant/orders"
          element={
            <MerchantRoute>
              <MerchantOrders />
            </MerchantRoute>
          }
        />

        {/* ===================================================== */}
        {/* ================= MERCHANT PRODUCTS ================= */}
        {/* ===================================================== */}

        <Route
          path="merchant/products"
          element={
            <MerchantRoute>
              <MerchantProducts />
            </MerchantRoute>
          }
        />

        {/* ===================================================== */}
        {/* ================= MERCHANT CUSTOMERS ================ */}
        {/* ===================================================== */}

        <Route
          path="merchant/customers"
          element={
            <MerchantRoute>
              <MerchantCustomers />
            </MerchantRoute>
          }
        />

        {/* ===================================================== */}
        {/* ================= STORE SETTINGS ==================== */}
        {/* ===================================================== */}

        <Route
          path="merchant/settings"
          element={
            <MerchantRoute>
              <StoreSettings />
            </MerchantRoute>
          }
        />

        {/* ===================================================== */}
        {/* ==================== ADMIN ROUTES =================== */}
        {/* ===================================================== */}

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

        {/* ===================================================== */}
        {/* ================= AUTH ROUTES ======================= */}
        {/* ===================================================== */}

        <Route
          path="login"
          element={<Login />}
        />
        <Route
    path="/store/:slug"
    element={<StorePage />}
/>
        <Route
          path="register"
          element={<Register />}
        />
        <Route
    path="/stores"
    element={<Stores />}
/>
      </Route>

    </Routes>
  );
}

export default App;