import {
  useState,
  useEffect,
} from "react";

import { CartContext } from "./cartContext";

const CartProvider = ({
  children,
}) => {

  // ================= SAFE PARSE =================

  const parseStored = (key, fallback) => {

    try {

      const raw =
        localStorage.getItem(key);

      if (!raw) return fallback;

      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object"
          ? parsed
          : fallback;

    } catch {

      localStorage.removeItem(key);

      return fallback;

    }

  };

  // ================= CART =================

  const [cart, setCart] = useState(
    () => parseStored("cart", [])
  );

const [cartStore, setCartStore] = useState(() => {
  return localStorage.getItem("cartStore") || null;
});

  // ================= SHIPPING ADDRESS =================

  const [
    shippingAddress,
    setShippingAddress,
  ] = useState(() => {

    const savedAddress =
      parseStored("shippingAddress", null);

    return savedAddress &&
      savedAddress.address !== undefined
      ? savedAddress
      : {
          address: "",
          city: "",
          postalCode: "",
          country: "",
        };
  });

  // ================= SAVE CART =================

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);
  useEffect(() => {
  if (cartStore) {
    localStorage.setItem("cartStore", cartStore);
  } else {
    localStorage.removeItem("cartStore");
  }
}, [cartStore]);

  // ================= SAVE SHIPPING =================

  useEffect(() => {

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(
        shippingAddress
      )
    );

  }, [shippingAddress]);

  // ================= ADD TO CART =================

  const addToCart = (product) => {
    const storeId =
  typeof product.store === "object"
    ? product.store._id
    : product.store;
  // First product in cart
  if (!cartStore) {
    setCartStore(storeId);
  }

  // Product belongs to another merchant
  if (cartStore && cartStore !== storeId) {

    const confirmClear = window.confirm(
      "Your cart contains items from another store.\n\nClear the cart and continue?"
    );

    if (!confirmClear) {
      return;
    }

    setCart([]);
    setCartStore(storeId);

    setCart([
      {
        ...product,
        quantity: 1,
      },
    ]);

    return;
  }

  const available = product.stock ?? Infinity;

  const existing = cart.find(
    (item) => item._id === product._id
  );

  if (existing) {

    if (existing.quantity + 1 > available) {
      alert(
        available === Infinity
          ? "No more stock available"
          : `Only ${available} in stock`
      );
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  } else {

    if (available < 1) {
      alert("This product is out of stock");
      return;
    }

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ]);

  }
};
  // ================= REMOVE =================

  const removeFromCart = (id) => {

    const updatedCart = cart.filter(
        item => item._id !== id
    );

    setCart(updatedCart);

    if (updatedCart.length === 0) {
        setCartStore(null);
    }
};

  // ================= QUANTITY =================

  const updateQuantity = (
    id,
    type
  ) => {

    setCart(

      cart.map((item) => {

        if (
          item._id === id
        ) {

          const maxQty =
            item.stock ?? Infinity;

          const nextQty =
            type === "increase"
              ? item.quantity + 1
              : item.quantity - 1;

          return {
            ...item,

            quantity:
              type ===
              "increase"
                ? Math.min(
                    maxQty,
                    nextQty
                  )
                : Math.max(
                    1,
                    nextQty
                  ),
          };
        }

        return item;
      })
    );
  };

  // ================= CLEAR CART =================

  const clearCart = () => {

  setCart([]);

  setCartStore(null);

  localStorage.removeItem("cart");

  localStorage.removeItem("cartStore");

};

  // ================= SAVE SHIPPING ADDRESS =================

  const saveShippingAddress =
    (data) => {

      setShippingAddress(
        data
      );
    };

  return (

    <CartContext.Provider
      value={{
        cart,cartStore,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        shippingAddress,
        saveShippingAddress,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export default CartProvider;