import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/api";

import { Card } from "../components/ui/card";
import { Input, Textarea } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

const EditProduct = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState("");

  // NEW STATES
  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  // FETCH PRODUCT
  useEffect(() => {

    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {

        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images || []);
        setStock(data.stock ?? "");

        // NEW DATA
        setCategory(data.category);
        setDescription(data.description);

      });

  }, [id]);

  // HANDLE IMAGE UPLOAD
  const uploadImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageData = new FormData();

    imageData.append("image", file);

    try {

      setUploading(true);

      const storedUser =
        JSON.parse(localStorage.getItem("userInfo"));

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

        setImage(data.image);

      } else {

        alert(data.error || "Image upload failed");

      }

    } catch (error) {

      console.log(error);

      alert("Image upload failed");

    } finally {

      setUploading(false);

    }

  };

  // HANDLE GALLERY IMAGE UPLOAD
  const uploadGalleryImages = async (e) => {

    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    try {

      setUploading(true);

      const storedUser =
        JSON.parse(localStorage.getItem("userInfo"));

      const uploaded = [];

      for (const file of files) {

        const data = new FormData();

        data.append("image", file);

        const response = await fetch(
          `${API_URL}/upload`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${storedUser.token}`,
            },

            body: data,
          }
        );

        const result = await response.json();

        if (response.ok) {
          uploaded.push(result.image);
        }

      }

      if (uploaded.length > 0) {
        setImages((prev) => [...prev, ...uploaded]);
      }

    } catch (error) {

      console.log(error);

      alert("Image upload failed");

    } finally {

      setUploading(false);

    }

  };

  // REMOVE GALLERY IMAGE
  const removeGalleryImage = (url) => {

    setImages((prev) =>
      prev.filter((img) => img !== url)
    );

  };

  // HANDLE AI DESCRIPTION
  const generateDescription = async () => {

    if (!name) {

      alert("Enter a product name first");

      return;

    }

    try {

      setGenerating(true);

      const storedUser =
        JSON.parse(localStorage.getItem("userInfo"));

      const response = await fetch(
        `${API_URL}/ai/product-description`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.token}`,
          },

          body: JSON.stringify({ name, category }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "AI generation failed");
        return;
      }

      setDescription(data.description);

    } catch (error) {

      console.log(error);

      alert("AI generation failed");

    } finally {

      setGenerating(false);

    }

  };

  // UPDATE PRODUCT
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      // GET USER FROM LOCALSTORAGE
      const storedUser =
        JSON.parse(localStorage.getItem("userInfo"));

      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${storedUser.token}`,
          },

          body: JSON.stringify({
            name,
            price,
            image,
            images,
            stock,
            category,
            description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Product updated successfully");

        navigate("/");

      } else {

        alert(data.error || "Update failed");

      }

    } catch (error) {

      console.log(error);

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

            Edit{" "}

            <span className="gradient-text">

              Product

            </span>

          </h1>

        </div>

        <Card className="p-8">

          <form
            onSubmit={handleUpdate}
            className="space-y-6"
          >

            {/* ===================================================== */}
            {/* ==================== PRODUCT NAME =================== */}
            {/* ===================================================== */}

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Product Name

              </label>

              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
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
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock (quantity available)"
                min="0"
              />

            </div>

            {/* ===================================================== */}
            {/* ================== PRODUCT IMAGE UPLOAD ============== */}
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
              />

              {uploading && (
                <p className="text-accent mt-2 text-sm font-medium">

                  Uploading image...

                </p>
              )}

              {image && (
                <div className="mt-4">

                  <p className="text-sm font-medium text-foreground mb-2">

                    Preview

                  </p>

                  <img
                    src={image}
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

              {images.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {images.map((img, i) => (
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
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="Category"
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
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Product Description"
                rows="4"
                required
              />

            </div>

            {/* ===================================================== */}
            {/* ==================== UPDATE BUTTON ================== */}
            {/* ===================================================== */}

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >

              Update Product

            </Button>

          </form>

        </Card>

      </div>

    </div>
  );
};

export default EditProduct;
