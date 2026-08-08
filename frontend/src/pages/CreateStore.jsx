import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import { FaStore } from "react-icons/fa";

import { AuthContext } from "../store/authContext";

import { API_URL } from "../utils/api";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

const CreateStore = () => {

  const navigate = useNavigate();

  const { userInfo, setUserInfo } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  /* ===================================================== */
  /* ================= HANDLE INPUT ====================== */
  /* ===================================================== */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  /* ===================================================== */
  /* ================= HANDLE SUBMIT ===================== */
  /* ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/stores`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create store");
        return;
      }

      // Refresh the local role so merchant features unlock immediately
      setUserInfo({
        ...userInfo,
        user: {
          ...userInfo.user,
          role: "merchant",
          store: data._id,
        },
      });

      alert("Store created successfully! Welcome to Vistaar.");

      navigate("/merchant/dashboard");

    } catch (error) {

      console.log(error);

      alert("Failed to create store");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">

      <div className="w-full max-w-xl">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-6">

            <div className="gradient-bg h-16 w-16 rounded-2xl flex items-center justify-center shadow-accent">

              <FaStore className="text-white" size={26} />

            </div>

          </div>

          <SectionLabel>

            Become a Seller

          </SectionLabel>

          <h1 className="mt-5 text-4xl font-display text-foreground">

            Open Your{" "}

            <span className="gradient-text">

              Store

            </span>

          </h1>

          <p className="mt-3 text-muted-foreground">

            Set up your storefront and start selling on Vistaar.

          </p>

        </div>

        <Card className="p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* STORE NAME */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Store Name

              </label>

              <Input
                type="text"
                name="name"
                placeholder="e.g. My Store"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* SLUG */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Store Slug

              </label>

              <Input
                type="text"
                name="slug"
                placeholder="e.g. my-store"
                value={formData.slug}
                onChange={handleChange}
                required
              />

              <p className="text-sm text-muted-foreground mt-2">

                Your store will be live at /store/{"{"}slug{"}"}

              </p>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Description

              </label>

              <textarea
                name="description"
                placeholder="Tell customers about your store"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
                rows="4"
              />

            </div>

            {/* SUBMIT */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >

              {loading
                ? "Creating..."
                : "Create Store"}

            </Button>

          </form>

        </Card>

      </div>

    </div>
  );
};

export default CreateStore;
