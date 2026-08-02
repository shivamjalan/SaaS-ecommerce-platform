import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../store/authContext";

import { API_URL } from "../utils/api";

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

      alert("Store created successfully! Welcome to Saree SaaS.");

      navigate("/merchant/dashboard");

    } catch (error) {

      console.log(error);

      alert("Failed to create store");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0] py-16">

      <div className="max-w-xl mx-auto px-6">

        <div className="text-center mb-10">

          <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

            Become a Seller

          </p>

          <h1 className="text-4xl font-bold text-gray-900">

            Open Your Store

          </h1>

          <p className="mt-3 text-gray-500">

            Set up your storefront and start selling on Saree SaaS.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
        >

          {/* STORE NAME */}

          <div>

            <label className="block font-semibold mb-2">

              Store Name

            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Shivam Sarees"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

          </div>

          {/* SLUG */}

          <div>

            <label className="block font-semibold mb-2">

              Store Slug

            </label>

            <input
              type="text"
              name="slug"
              placeholder="e.g. shivam-sarees"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <p className="text-sm text-gray-400 mt-1">

              Your store will be live at /store/{"{"}slug{"}"}

            </p>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block font-semibold mb-2">

              Description

            </label>

            <textarea
              name="description"
              placeholder="Tell customers about your store"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              rows="4"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90"
            }`}
          >

            {loading
              ? "Creating..."
              : "Create Store"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateStore;
