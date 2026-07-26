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

  const [cart, setCart] =
    useState(() => {

      const savedCart =
        localStorage.getItem(
          "cart"
        );

      return savedCart
        ? JSON.parse(
            savedCart
          )
        : [];
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

  const addToCart = (
    product
  ) => {

    const existing =
      cart.find(
        (item) =>
          item._id ===
          product._id
      );

    if (existing) {

      setCart(

        cart.map((item) =>

          item._id ===
          product._id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  1,
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

    localStorage.removeItem(
      "cart"
    );
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
        cart,
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