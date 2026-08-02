import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";

const AddProduct = () => {

  const storedUser =
    JSON.parse(
      localStorage.getItem(
        "userInfo"
      )
    );

  const isAdmin =
    storedUser?.user?.role ===
    "admin";

  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
    store: "",
  });

  const [uploading, setUploading] = useState(false);

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

          setStores(data);

        } catch (error) {

          console.log(error);

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

      const storedUser = JSON.parse(
        localStorage.getItem("userInfo")
      );

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

        alert(data.error || "Image upload failed");

      }

    } catch (error) {

      console.log(error);

      alert("Image upload failed");

    } finally {

      setUploading(false);

    }

  };

  // HANDLE PRODUCT SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const storedUser = JSON.parse(
        localStorage.getItem("userInfo")
      );

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

      console.log(data);

      if (response.ok) {

        alert("Product added successfully!");

        setFormData({
          name: "",
          price: "",
          image: "",
          category: "",
          description: "",
          store: "",
        });

      } else {

        alert(data.error || "Failed");

      }

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* STORE PICKER — ADMINS ONLY */}
        {isAdmin && (
        <div>

          <label className="block font-semibold mb-2">
            Store
          </label>

          <select
            name="store"
            value={formData.store}
            onChange={handleChange}
            className="w-full border p-3 rounded"
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

        {/* PRODUCT NAME */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* IMAGE UPLOAD */}
        <div>

          <label className="block font-semibold mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="w-full border p-3 rounded"
            required
          />

          {uploading && (
            <p className="text-blue-500 mt-2">
              Uploading image...
            </p>
          )}

          {formData.image && (
            <div className="mt-4">

              <p className="font-medium mb-2">
                Preview
              </p>

              <img
                src={formData.image}
                alt="Preview"
                className="w-48 rounded shadow"
              />

            </div>
          )}

        </div>

        {/* CATEGORY */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows="4"
          required
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={uploading}
          className={`px-6 py-3 rounded text-white transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {uploading
            ? "Uploading..."
            : "Add Product"}
        </button>

      </form>

    </div>
  );
};

export default AddProduct;