import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddCategory() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    price: "",
    features: "",
    description: "",
    image: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
  e.preventDefault();

  console.log("Form submitted");

  const data = {
    ...form,
    price: Number(form.price),
    features: form.features.split(",").map((f) => f.trim()),
  };

  console.log(data);

  axios
    .post(import.meta.env.VITE_BACKEND_URL + "/api/category", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log(res.data);
      toast.success("Success");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Error");
    });
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Add Category</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 mb-2"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-2 mb-2"
          onChange={handleChange}
          required
        />

        <input
          name="features"
          placeholder="Features (comma separated)"
          className="w-full border p-2 mb-2"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 mb-2"
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Add Category
        </button>
      </form>
    </div>
  );
}