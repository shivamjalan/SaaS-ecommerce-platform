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

const AddProduct = () => {

  const navigate = useNavigate();

  const storedUser =
    getUserInfo();

  const isAdmin =
    storedUser?.user?.role ===
    "superadmin";

  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    images: [],
    category: "",
    description: "",
    stock: "",
    store: "",
  });

  const [uploading, setUploading] = useState(false);

  const [generating, setGenerating] = useState(false);

  // FETCH STORES FOR THE STORE PICKER
  useEffect(() => {

    const fetchStores =
      async () => {

        try {

          const response =
            await fetch(
              `${API_URL}/stores`
            );

          const data =
            await response.json();

          if (!response.ok) {

            setStores([]);

            alert(data.error || data.message || "Failed to load stores");

            return;

          }

          setStores(
            Array.isArray(data) ? data : []
          );

        } catch (error) {

          console.error(error);

          setStores([]);

          alert(apiErrorMessage());

        }
      };

    fetchStores();

  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // HANDLE IMAGE UPLOAD
  const uploadImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageData = new FormData();

    imageData.append("image", file);

    try {

      setUploading(true);

      const storedUser = getUserInfo();

      if (!storedUser) return;

      const response = await fetch(
        `${API_URL}/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },

          body: imageData,
        }
      );

      const data = await response.json();

      if (response.ok) {

        setFormData((prev) => ({
          ...prev,
          image: data.image,
        }));

      } else {

        alert(data.error || data.message || "Image upload failed");

      }

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

    } finally {

      setUploading(false);

    }

  };

  // HANDLE GALLERY IMAGE UPLOAD
  const uploadGalleryImages = async (e) => {

    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setUploading(true);

    try {

      const storedUser = getUserInfo();

      if (!storedUser) return;

      const uploaded = [];

      for (const file of files) {

        const imageData = new FormData();

        imageData.append("image", file);

        const response = await fetch(
          `${API_URL}/upload`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${storedUser.token}`,
            },

            body: imageData,
          }
        );

        const data = await response.json();

        if (response.ok && data.image) {
          uploaded.push(data.image);
        }

      }

      if (uploaded.length > 0) {

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploaded],
        }));

      }

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

    } finally {

      setUploading(false);

    }

  };

  // REMOVE GALLERY IMAGE
  const removeGalleryImage = (url) => {

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (img) => img !== url
      ),
    }));

  };

  // HANDLE AI DESCRIPTION
  const generateDescription = async () => {

    if (!formData.name) {

      alert("Enter a product name first");

      return;

    }

    try {

      setGenerating(true);

      const storedUser = getUserInfo();

      if (!storedUser) return;

      const response = await fetch(
        `${API_URL}/ai/product-description`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.token}`,
          },

          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "AI generation failed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        description: data.description,
      }));

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

    } finally {

      setGenerating(false);

    }

  };

  // HANDLE PRODUCT SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const storedUser = getUserInfo();

      if (!storedUser) return;

      const response = await fetch(
        `${API_URL}/products`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${storedUser.token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Product added successfully!");

        navigate("/merchant/products");

      } else {

        alert(data.error || data.message || "Failed to add product");

      }

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

    }

  };

  return (

    <div className="min-h-screen bg-background py-16">

      <div className="max-w-2xl mx-auto px-6">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="mb-10">

          <SectionLabel>

            Product Catalogue

          </SectionLabel>

          <h1 className="mt-4 text-4xl md:text-5xl font-display text-foreground">

            Add a New{" "}

            <span className="gradient-text">

              Product

            </span>

          </h1>

        </div>

        <Card className="p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ===================================================== */}
            {/* ================= STORE PICKER — ADMINS ============== */}
            {/* ===================================================== */}

            {isAdmin && (
            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Store

              </label>

              <select
                name="store"
                value={formData.store}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >

                <option value="">

                  Select a store

                </option>

                {stores.map((store) => (

                  <option
                    key={store._id}
                    value={store._id}
                  >

                    {store.name}

                  </option>

                ))}

              </select>

            </div>
            )}

            {/* ===================================================== */}
            {/* ==================== PRODUCT NAME =================== */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Product Name

              </label>

              <Input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* ===================================================== */}
            {/* ======================= PRICE ======================= */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Price

              </label>

              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />

            </div>

            {/* ===================================================== */}
            {/* ======================= STOCK ======================= */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Stock

              </label>

              <Input
                type="number"
                name="stock"
                placeholder="Stock (quantity available)"
                value={formData.stock}
                onChange={handleChange}
                min="0"
              />

            </div>

            {/* ===================================================== */}
            {/* ==================== IMAGE UPLOAD =================== */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Product Image

              </label>

              <Input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="h-auto py-2 file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/70"
                required
              />

              {uploading && (
                <p className="text-accent mt-2 text-sm font-medium">

                  Uploading image...

                </p>
              )}

              {formData.image && (
                <div className="mt-4">

                  <p className="text-sm font-medium text-foreground mb-2">

                    Preview

                  </p>

                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-48 rounded-xl border border-border shadow-sm"
                  />

                </div>
              )}

            </div>

            {/* ===================================================== */}
            {/* ================== GALLERY IMAGES =================== */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Gallery Images (optional)

              </label>

              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={uploadGalleryImages}
                className="h-auto py-2 file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/70"
              />

              {formData.images.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-xl border border-border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(img)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* ===================================================== */}
            {/* ===================== CATEGORY ====================== */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Category

              </label>

              <Input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />

            </div>

            {/* ===================================================== */}
            {/* ==================== DESCRIPTION ==================== */}
            {/* ===================================================== */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-medium text-foreground">

                  Product Description

                </label>

                <Button
                  type="button"
                  onClick={generateDescription}
                  disabled={generating}
                  variant="secondary"
                  size="sm"
                >

                  {generating
                    ? "Generating..."
                    : "✨ Generate with AI"}

                </Button>

              </div>

              <Textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />

            </div>

            {/* ===================================================== */}
            {/* ==================== SUBMIT BUTTON ================== */}
            {/* ===================================================== */}

            <Button
              type="submit"
              disabled={uploading}
              className="w-full"
              size="lg"
            >

              {uploading
                ? "Uploading..."
                : "Add Product"}

            </Button>

          </form>

        </Card>

      </div>

    </div>
  );
};

export default AddProduct;
