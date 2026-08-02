import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { THEMES } from "../utils/themes";

import { API_URL } from "../utils/api";

const StoreSettings = () => {

  const navigate = useNavigate();

  const [store, setStore] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
    theme: "default",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  /* ===================================================== */
  /* ================== FETCH STORE ====================== */
  /* ===================================================== */

  useEffect(() => {

    const fetchStore = async () => {

      try {

        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const response = await fetch(
          `${API_URL}/stores/me`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load store");
          return;
        }

        setStore(data);

        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          logo: data.logo || "",
          theme: data.theme || "default",
        });

      } catch (error) {

        console.log(error);

        alert("Failed to load store");

      } finally {

        setLoading(false);

      }

    };

    fetchStore();

  }, []);

  /* ===================================================== */
  /* ================== HANDLE INPUT ===================== */
  /* ===================================================== */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  /* ===================================================== */
  /* ================== UPLOAD LOGO ====================== */
  /* ===================================================== */

  const uploadLogo = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageData = new FormData();

    imageData.append("image", file);

    try {

      setUploading(true);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },

          body: imageData,
        }
      );

      const data = await response.json();

      if (response.ok) {

        setFormData((prev) => ({
          ...prev,
          logo: data.image,
        }));

      } else {

        alert(data.error || "Logo upload failed");

      }

    } catch (error) {

      console.log(error);

      alert("Logo upload failed");

    } finally {

      setUploading(false);

    }

  };

  /* ===================================================== */
  /* ================== HANDLE SUBMIT ==================== */
  /* ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/stores/me`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update store");
        return;
      }

      setStore(data);

      alert("Store settings updated!");

      navigate("/merchant/dashboard");

    } catch (error) {

      console.log(error);

      alert("Failed to update store");

    } finally {

      setSaving(false);

    }

  };

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <h1 className="text-3xl font-bold">

          Loading Store...

        </h1>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0] py-16">

      <div className="max-w-2xl mx-auto px-6">

        <div className="mb-10">

          <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

            Store Settings

          </p>

          <h1 className="text-4xl font-bold text-gray-900">

            {store.name}

          </h1>

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
              value={formData.slug}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block font-semibold mb-2">

              Description

            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              rows="4"
            />

          </div>

          {/* LOGO */}

          <div>

            <label className="block font-semibold mb-2">

              Store Logo

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={uploadLogo}
              className="w-full border p-3 rounded"
            />

            {uploading && (
              <p className="text-blue-500 mt-2">

                Uploading logo...

              </p>
            )}

            {formData.logo && (
              <div className="mt-4">

                <p className="font-medium mb-2">

                  Preview

                </p>

                <img
                  src={formData.logo}
                  alt="Logo Preview"
                  className="w-48 rounded shadow"
                />

              </div>
            )}

          </div>

          {/* THEME */}

          <div>

            <label className="block font-semibold mb-2">

              Theme

            </label>

            <div className="grid grid-cols-2 gap-4">

              {THEMES.map((theme) => (

                <button
                  type="button"
                  key={theme.value}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      theme: theme.value,
                    }))
                  }
                  className={`p-4 rounded-2xl border-2 text-left transition ${
                    formData.theme === theme.value
                      ? "border-rose-500 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div
                    className={`${theme.btn} h-8 rounded mb-2`}
                  />

                  <p className="font-semibold">

                    {theme.label}

                  </p>

                </button>
              ))}

            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 rounded text-white transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90"
            }`}
          >

            {saving
              ? "Saving..."
              : "Save Settings"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default StoreSettings;
