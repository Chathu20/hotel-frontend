import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import uploadMedia from "../../../utils/mediaUpload";

const BASE = import.meta.env.VITE_BACKEND_URL + "/api/gallery";

export default function AdminGallery() {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: "Bearer " + token } };

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  // ── Add Form ──────────────────────────────────────────────────
  const emptyForm = { name: "", description: "", file: null };
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState(emptyForm);
  const [addPreview, setAddPreview] = useState(null);
  const [uploading, setUploading]   = useState(false);

  // ── Edit Modal ────────────────────────────────────────────────
  const [editItem, setEditItem]       = useState(null);
  const [editForm, setEditForm]       = useState({});
  const [editFile, setEditFile]       = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [saving, setSaving]           = useState(false);

  // ── View Modal ────────────────────────────────────────────────
  const [viewItem, setViewItem] = useState(null);

  // ── Fetch gallery items ───────────────────────────────────────
  function fetchItems() {
    setLoading(true);
    axios.get(BASE)
      .then((res) => setItems(res.data.list || []))
      .catch(() => toast.error("Failed to load gallery"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchItems(); }, []);

  // ── Filtered list ─────────────────────────────────────────────
  const filtered = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handle add file pick ──────────────────────────────────────
  function handleAddFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAddForm({ ...addForm, file });
    setAddPreview(URL.createObjectURL(file));
  }

  // ── Add item ──────────────────────────────────────────────────
  async function handleAdd() {
    if (!addForm.name || !addForm.description || !addForm.file) {
      toast.error("Name, description and image are all required");
      return;
    }
    setUploading(true);
    try {
      const imageUrl = await uploadMedia(addForm.file);
      await axios.post(BASE, {
        name:        addForm.name,
        description: addForm.description,
        image:       imageUrl,
      }, authHeader);
      toast.success("Gallery item added");
      setAddForm(emptyForm);
      setAddPreview(null);
      setShowAdd(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed — check Firebase Storage settings");
    } finally {
      setUploading(false);
    }
  }

  // ── Open edit modal ───────────────────────────────────────────
  function openEdit(item) {
    setEditItem(item);
    setEditForm({ name: item.name, description: item.description });
    setEditFile(null);
    setEditPreview(null);
  }

  function handleEditFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setEditFile(file);
    setEditPreview(URL.createObjectURL(file));
  }

  // ── Save edit ─────────────────────────────────────────────────
  async function handleSaveEdit() {
    setSaving(true);
    try {
      let imageUrl = editItem.image;
      if (editFile) {
        imageUrl = await uploadMedia(editFile);
      }
      await axios.put(`${BASE}/${editItem._id}`, {
        name:        editForm.name,
        description: editForm.description,
        image:       imageUrl,
      }, authHeader);
      toast.success("Gallery item updated");
      setEditItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  function handleDelete(item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    axios.delete(`${BASE}/${item._id}`, authHeader)
      .then(() => { toast.success("Deleted"); fetchItems(); })
      .catch(() => toast.error("Delete failed"));
  }

  const total = items.length;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#050A30]">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Upload and manage hotel gallery images</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setAddForm(emptyForm); setAddPreview(null); }}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          {showAdd ? "✕ Cancel" : "+ Add Image"}
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Images",      value: total,                   color: "bg-blue-600"  },
          { label: "Showing",           value: filtered.length,         color: "bg-green-600" },
          { label: "Hidden by Filter",  value: total - filtered.length, color: "bg-gray-500"  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
              {s.value}
            </div>
            <span className="text-gray-600 font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-lg font-bold text-[#050A30] mb-4">Add New Gallery Image</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Image Name *</label>
                <input
                  placeholder="e.g. Lobby, Pool Area"
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  placeholder="Describe this image..."
                  rows={3}
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32] resize-none"
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#785D32] file:text-white hover:file:bg-[#5f4825]"
                  onChange={handleAddFile}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center">
              {addPreview ? (
                <img src={addPreview} className="h-48 w-full object-cover rounded-lg" />
              ) : (
                <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  Image preview will appear here
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={uploading}
            className="mt-4 bg-[#785D32] text-white px-6 py-2 rounded-lg hover:bg-[#5f4825] transition disabled:opacity-50"
          >
            {uploading ? "Uploading to Firebase..." : "Upload & Save"}
          </button>
        </div>
      )}

      {/* ── Search & Refresh ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or description..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchItems}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          Refresh
        </button>
      </div>

      {/* ── Gallery Grid ── */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
          Loading gallery...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
          No gallery items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition group"
            >
              {/* Image with hover overlay */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-52 w-full object-cover cursor-pointer"
                  onClick={() => setViewItem(item)}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center pointer-events-none">
                  <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                    Click to view
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-[#050A30] text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setViewItem(item)}
                    className="flex-1 bg-purple-600 text-white py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 bg-red-500 text-white py-1 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-400 text-sm mt-4">
        Showing {filtered.length} of {total} images
      </p>

      {/* ── View Modal ── */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img
              src={viewItem.image}
              alt={viewItem.name}
              className="h-64 w-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/400x256?text=No+Image"; }}
            />
            <div className="p-5">
              <h2 className="text-2xl font-bold text-[#050A30] mb-1">{viewItem.name}</h2>
              <p className="text-gray-500 mb-3">{viewItem.description}</p>
              <p className="text-xs text-gray-300 break-all">ID: {viewItem._id}</p>
              <button
                onClick={() => setViewItem(null)}
                className="mt-4 w-full bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#050A30] mb-1">Edit Gallery Item</h2>
            <p className="text-gray-400 text-sm mb-4">{editItem.name}</p>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32] resize-none"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Replace Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#785D32] file:text-white hover:file:bg-[#5f4825]"
                  onChange={handleEditFile}
                />
              </div>

              {/* Current or new preview */}
              <img
                src={editPreview || editItem.image}
                className="h-36 w-full object-cover rounded-lg"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x144?text=No+Image"; }}
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}