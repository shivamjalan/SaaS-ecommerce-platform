import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/api";

const EditProduct = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

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

      console.log("STORED USER:", storedUser);

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
            category,
            description,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

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

    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-4"
      >

        {/* PRODUCT NAME */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="Product Name"
          required
        />

        {/* PRICE */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="Price"
          required
        />

        {/* PRODUCT IMAGE UPLOAD */}
        <div>

          <label className="block font-semibold mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="w-full border p-3 rounded"
          />

          {uploading && (
            <p className="text-blue-500 mt-2">
              Uploading image...
            </p>
          )}

          {image && (
            <div className="mt-4">

              <p className="font-medium mb-2">
                Preview
              </p>

              <img
                src={image}
                alt="Preview"
                className="w-48 rounded shadow"
              />

            </div>
          )}

        </div>

        {/* CATEGORY */}
        <input
          type="text"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full border p-3 rounded"
          placeholder="Category"
          required
        />

        {/* DESCRIPTION */}
        <div>

          <div className="flex items-center justify-between mb-2">

            <label className="block font-semibold">
              Product Description
            </label>

            <button
              type="button"
              onClick={generateDescription}
              disabled={generating}
              className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition disabled:text-gray-400"
            >

              {generating
                ? "Generating..."
                : "✨ Generate with AI"}

            </button>

          </div>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full border p-3 rounded"
            placeholder="Product Description"
            rows="4"
            required
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
        >
          Update Product
        </button>

      </form>

    </div>
  );
};

export default EditProduct;