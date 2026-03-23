import axios from "axios";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000/api/gallery";

  async function fetchItems() {
    try {
      const res = await axios.get(API);
      setItems(res.data.list);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(API, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setForm({ name: "", image: "", description: "" });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(item) {
    setForm(item);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">
        Gallery Management
      </h1>

      {/* FORM CARD */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Item" : "Add New Item"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className={`p-2 rounded-lg text-white font-semibold ${
              editingId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update Item" : "Create Item"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", image: "", description: "" });
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-lg"
            >
              Cancel Edit
            </button>
          )}

        </form>
      </div>

      {/* GALLERY GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {item.description}
              </p>

              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}