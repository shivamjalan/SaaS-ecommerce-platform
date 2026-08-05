import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  API_URL,
  apiErrorMessage,
  getUserInfo,
} from "../utils/api";

import { Card } from "../components/ui/card";
import { Input, Textarea } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

const StoreSettings = () => {

  const navigate = useNavigate();

  const [store, setStore] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
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

        const userInfo = getUserInfo();

        if (!userInfo) return;

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
          alert(data.error || data.message || "Failed to load store");
          return;
        }

        setStore(data);

        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          logo: data.logo || "",
        });

      } catch (error) {

        console.error(error);

        alert(apiErrorMessage());

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

      const userInfo = getUserInfo();

      if (!userInfo) return;

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

        alert(data.error || data.message || "Logo upload failed");

      }

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

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

      const userInfo = getUserInfo();

      if (!userInfo) return;

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
        alert(data.error || data.message || "Failed to update store");
        return;
      }

      setStore(data);

      alert("Store settings updated!");

      navigate("/merchant/dashboard");

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

    } finally {

      setSaving(false);

    }

  };

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-background">

        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 rounded-full border-2 border-border border-t-accent animate-spin" />

          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">

            Loading Store...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-background py-16">

      <div className="max-w-2xl mx-auto px-6">

        <div className="mb-10">

          <SectionLabel>

            Store Settings

          </SectionLabel>

          <h1 className="mt-4 text-4xl font-display text-foreground">

            {store.name}

          </h1>

        </div>

        <Card className="p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* STORE NAME */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Store Name

              </label>

              <Input
                type="text"
                name="name"
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
                value={formData.slug}
                onChange={handleChange}
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Description

              </label>

              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />

            </div>

            {/* LOGO */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Store Logo

              </label>

              <Input
                type="file"
                accept="image/*"
                onChange={uploadLogo}
              />

              {uploading && (
                <p className="text-accent mt-2 text-sm font-medium">

                  Uploading logo...

                </p>
              )}

              {formData.logo && (
                <div className="mt-4">

                  <p className="text-sm font-medium text-foreground mb-2">

                    Preview

                  </p>

                  <img
                    src={formData.logo}
                    alt="Logo Preview"
                    className="w-48 rounded-xl border border-border shadow-sm"
                  />

                </div>
              )}

            </div>

            {/* SUBMIT */}

            <Button
              type="submit"
              disabled={saving}
              className="w-full"
              size="lg"
            >

              {saving
                ? "Saving..."
                : "Save Settings"}

            </Button>

          </form>

        </Card>

      </div>

    </div>
  );
};

export default StoreSettings;
