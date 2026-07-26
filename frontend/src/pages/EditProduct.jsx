import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  // FETCH PRODUCT
  useEffect(() => {

    fetch(`http://localhost:5000/api/products/${id}`)
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

  // UPDATE PRODUCT
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      // GET USER FROM LOCALSTORAGE
      const storedUser =
        JSON.parse(localStorage.getItem("userInfo"));

      console.log("STORED USER:", storedUser);

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
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

        {/* IMAGE URL */}
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="Image URL"
          required
        />

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