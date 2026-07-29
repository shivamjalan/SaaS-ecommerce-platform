import {
  createContext,
  useState,
  useEffect,
} from "react";

export const CartContext =
  createContext();

const CartProvider = ({
  children,
}) => {

  // ================= CART =================

  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

const [cart, setCart] = useState(savedCart);

const [cartStore, setCartStore] = useState(() => {
  return localStorage.getItem("cartStore") || null;
});

  // ================= SHIPPING ADDRESS =================

  const [
    shippingAddress,
    setShippingAddress,
  ] = useState(() => {

    const savedAddress =
      localStorage.getItem(
        "shippingAddress"
      );

    return savedAddress
      ? JSON.parse(
          savedAddress
        )
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

  // First product in cart
  if (!cartStore) {
    setCartStore(product.store);
  }

  // Product belongs to another merchant
  if (cartStore && cartStore !== product.store) {

    const confirmClear = window.confirm(
      "Your cart contains items from another store.\n\nClear the cart and continue?"
    );

    if (!confirmClear) {
      return;
    }

    setCart([]);
    setCartStore(product.store);

    setCart([
      {
        ...product,
        quantity: 1,
      },
    ]);

    return;
  }

  const existing = cart.find(
    (item) => item._id === product._id
  );

  if (existing) {

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

  const removeFromCart = (
    id
  ) => {

    setCart(

      cart.filter(
        (item) =>
          item._id !== id
      )
    );
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

          return {
            ...item,

            quantity:
              type ===
              "increase"
                ? item.quantity +
                  1
                : Math.max(
                    1,
                    item.quantity -
                      1
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