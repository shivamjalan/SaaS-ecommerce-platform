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

/* ===================================================== */
/* ================= ROUTE PROTECTION ================== */
/* ===================================================== */

import ProtectedRoute from "./components/ProtectedRoute";

import AdminRoute from "./components/AdminRoute";

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
        {/* ==================== ADMIN ROUTES =================== */}
        {/* ===================================================== */}

        <Route
          path="add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
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
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
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