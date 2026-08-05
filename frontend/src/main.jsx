import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import AuthProvider from "./store/AuthContext.jsx";
import CartProvider from "./store/CartContext.jsx";

import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <ErrorBoundary>

      <BrowserRouter>

        <AuthProvider>

          <CartProvider>

            <App />

          </CartProvider>

        </AuthProvider>

      </BrowserRouter>

    </ErrorBoundary>

  </React.StrictMode>
);