import {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  CartContext,
} from "../store/cartContext";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

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

    <div className="min-h-screen bg-background">

      <div className="max-w-xl mx-auto px-6 py-16">

        <div className="flex items-center gap-3 mb-2">

          <div className="gradient-bg h-11 w-11 rounded-xl flex items-center justify-center shadow-accent">

            <FaMapMarkerAlt className="text-white" />

          </div>

          <h1 className="text-3xl md:text-4xl font-display text-foreground">

            Shipping Address

          </h1>

        </div>

        <p className="text-muted-foreground mb-8">

          Where should we deliver your order?

        </p>

        <Card className="p-8">

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* ADDRESS */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Address

              </label>

              <Input
                type="text"
                placeholder="House, street, area"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* CITY */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                City

              </label>

              <Input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* POSTAL CODE */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Postal Code

              </label>

              <Input
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* COUNTRY */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Country

              </label>

              <Input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) =>
                  setCountry(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* BUTTON */}

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >

              Continue

            </Button>

          </form>

        </Card>

      </div>

    </div>
  );
};

export default Shipping;
