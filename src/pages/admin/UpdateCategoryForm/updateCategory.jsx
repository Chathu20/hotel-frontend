import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UpdateCategoryForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const category = location.state;

  const [name, setName] = useState(category.name);
  const [price, setPrice] = useState(category.price);
  const [features, setFeatures] = useState(category.features.join(", "));
  const [description, setDescription] = useState(category.description);
  const [image, setImage] = useState(category.image);

  function handleUpdate(e) {
    e.preventDefault();

    const updatedCategory = {
      name,
      price,
      features: features.split(",").map((f) => f.trim()),
      description,
      image,
    };

    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/api/category/" + category.name,
        updatedCategory,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        toast.success("Category updated successfully");
        navigate("/admin/categories");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Update failed");
      });
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Update Category
        </h2>

        {/* Name */}
        <input
          type="text"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Price */}
        <input
          type="number"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* Features */}
        <input
          type="text"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Features (comma separated)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="w-full border p-2 mb-3 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Image URL */}
        <input
          type="text"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Update Category
        </button>
      </form>
    </div>
  );
}