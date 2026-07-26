import {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../store/CartContext";

const Shipping = () => {

  const navigate =
    useNavigate();

  const {
    shippingAddress,
    saveShippingAddress,
  } = useContext(
    CartContext
  );

  const [address, setAddress] =
    useState(
      shippingAddress.address
    );

  const [city, setCity] =
    useState(
      shippingAddress.city
    );

  const [
    postalCode,
    setPostalCode,
  ] = useState(
    shippingAddress.postalCode
  );

  const [country, setCountry] =
    useState(
      shippingAddress.country
    );

  /* ===================================================== */
  /* ================= HANDLE SUBMIT ==================== */
  /* ===================================================== */

  const handleSubmit = (
    e
  ) => {

    e.preventDefault();

    // SAVE TO CONTEXT
    saveShippingAddress({
      address,
      city,
      postalCode,
      country,
    });

    // GO TO PLACE ORDER
    navigate(
      "/placeorder"
    );
  };

  return (

    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">

        Shipping Address

      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        {/* ADDRESS */}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
          required
        />

        {/* CITY */}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) =>
            setCity(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
          required
        />

        {/* POSTAL CODE */}
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) =>
            setPostalCode(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
          required
        />

        {/* COUNTRY */}
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) =>
            setCountry(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
        >

          Continue

        </button>

      </form>

    </div>
  );
};

export default Shipping;