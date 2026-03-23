import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL + "/api/rooms";

export default function AdminRooms() {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: "Bearer " + token } };

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAvail, setFilterAvail] = useState("all");

  // ── Add Form ───────────────────────────────────────────────
  const emptyForm = { category: "", maxGuests: "", photos: "", specialDescription: "", notes: "" };
  const [addForm, setAddForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // ── Edit Modal ─────────────────────────────────────────────
  const [editRoom, setEditRoom] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // ── View Modal ─────────────────────────────────────────────
  const [viewRoom, setViewRoom] = useState(null);

  // ── Fetch rooms ────────────────────────────────────────────
  function fetchRooms() {
    setLoading(true);
    axios.get(BASE, authHeader)
      .then((res) => setRooms(res.data.rooms || []))
      .catch(() => toast.error("Failed to load rooms"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchRooms(); }, []);

  // ── Filtered list ─────────────────────────────────────────
  const filtered = rooms.filter((r) => {
    const matchSearch =
      String(r.roomId).includes(search) ||
      r.category?.toLowerCase().includes(search.toLowerCase());
    const matchAvail =
      filterAvail === "all" ||
      (filterAvail === "available" && r.available === true) ||
      (filterAvail === "unavailable" && r.available === false);
    return matchSearch && matchAvail;
  });

  // ── Add Room ──────────────────────────────────────────────
  function handleAdd() {
    if (!addForm.category || !addForm.maxGuests) {
      toast.error("Category and Max Guests are required");
      return;
    }
    setAdding(true);
    const payload = {
      ...addForm,
      maxGuests: Number(addForm.maxGuests),
      photos: addForm.photos ? addForm.photos.split(",").map((p) => p.trim()) : [],
      available: true,
    };
    axios.post(BASE, payload, authHeader)
      .then(() => {
        toast.success("Room added successfully");
        setAddForm(emptyForm);
        setShowAddForm(false);
        fetchRooms();
      })
      .catch(() => toast.error("Failed to add room"))
      .finally(() => setAdding(false));
  }

  // ── Delete Room ───────────────────────────────────────────
  function handleDelete(roomId) {
    if (!window.confirm(`Delete Room #${roomId}?`)) return;
    axios.delete(`${BASE}/${roomId}`, authHeader)
      .then(() => { toast.success("Room deleted"); fetchRooms(); })
      .catch(() => toast.error("Delete failed"));
  }

  // ── Open Edit ─────────────────────────────────────────────
  function openEdit(room) {
    setEditRoom(room);
    setEditForm({
      category: room.category,
      maxGuests: room.maxGuests,
      available: room.available,
      photos: (room.photos || []).join(", "),
      specialDescription: room.specialDescription || "",
      notes: room.notes || "",
    });
  }

  // ── Save Edit ─────────────────────────────────────────────
  function handleSaveEdit() {
    setSaving(true);
    const payload = {
      ...editForm,
      maxGuests: Number(editForm.maxGuests),
      photos: editForm.photos ? editForm.photos.split(",").map((p) => p.trim()) : [],
    };
    axios.put(`${BASE}/${editRoom.roomId}`, payload, authHeader)
      .then(() => {
        toast.success("Room updated");
        setEditRoom(null);
        fetchRooms();
      })
      .catch(() => toast.error("Update failed"))
      .finally(() => setSaving(false));
  }

  // ── Quick toggle availability ──────────────────────────────
  function toggleAvailable(room) {
    axios.put(`${BASE}/${room.roomId}`, { available: !room.available }, authHeader)
      .then(() => { toast.success("Availability updated"); fetchRooms(); })
      .catch(() => toast.error("Update failed"));
  }

  // ── Stats ─────────────────────────────────────────────────
  const totalRooms = rooms.length;
  const availableCount = rooms.filter((r) => r.available).length;
  const unavailCount = rooms.filter((r) => !r.available).length;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#050A30]">Room Management</h1>
          <p className="text-gray-500 mt-1">Manage all hotel rooms</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          {showAddForm ? "✕ Cancel" : "+ Add Room"}
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: "Total Rooms", value: totalRooms, color: "bg-blue-600" },
          { label: "Available", value: availableCount, color: "bg-green-600" },
          { label: "Unavailable", value: unavailCount, color: "bg-red-500" }].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
              {s.value}
            </div>
            <span className="text-gray-600 font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Add Room Form ── */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-lg font-bold text-[#050A30] mb-4">Add New Room</h2>
          <div className="grid grid-cols-2 gap-3">

            {/* ── Category Dropdown ── */}
            <div>
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select
                className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Luxury">Luxury</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            {/* ── Max Guests ── */}
            <div>
              <label className="text-sm font-medium text-gray-700">Max Guests *</label>
              <input
                type="number"
                placeholder="e.g. 2"
                className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                value={addForm.maxGuests}
                onChange={(e) => setAddForm({ ...addForm, maxGuests: e.target.value })}
              />
            </div>

            {/* ── Photo URLs ── */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Photo URLs (comma separated)</label>
              <input
                placeholder="https://..., https://..."
                className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                value={addForm.photos}
                onChange={(e) => setAddForm({ ...addForm, photos: e.target.value })}
              />
            </div>

            {/* ── Special Description ── */}
            <div>
              <label className="text-sm font-medium text-gray-700">Special Description</label>
              <input
                placeholder="e.g. Sea view, corner room"
                className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                value={addForm.specialDescription}
                onChange={(e) => setAddForm({ ...addForm, specialDescription: e.target.value })}
              />
            </div>

            {/* ── Notes ── */}
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <input
                placeholder="Internal notes..."
                className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                value={addForm.notes}
                onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
              />
            </div>

          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="mt-4 bg-[#785D32] text-white px-6 py-2 rounded-lg hover:bg-[#5f4825] transition disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Room"}
          </button>
        </div>
      )}

      {/* ── Search & Filter ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by Room ID or Category..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={filterAvail}
          onChange={(e) => setFilterAvail(e.target.value)}
        >
          <option value="all">All Rooms</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <button
          onClick={fetchRooms}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          Refresh
        </button>
      </div>

      {/* ── Rooms Grid ── */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
          Loading rooms...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
          No rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((room) => (
            <div key={room._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">

              {/* Room Image */}
              {room.photos && room.photos.length > 0 ? (
                <img
                  src={room.photos[0]}
                  alt={`Room ${room.roomId}`}
                  className="h-44 w-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x180?text=No+Image"; }}
                />
              ) : (
                <div className="h-44 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4">
                {/* Room ID + Availability badge */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-[#785D32] text-lg">
                    Room #{room.roomId}
                  </span>
                  <span
                    onClick={() => toggleAvailable(room)}
                    title="Click to toggle availability"
                    className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer select-none ${
                      room.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.available ? "✔ Available" : "✖ Unavailable"}
                  </span>
                </div>

                <p className="text-gray-700 font-semibold">{room.category}</p>
                <p className="text-gray-500 text-sm">👥 Max Guests: {room.maxGuests}</p>
                {room.specialDescription && (
                  <p className="text-gray-400 text-sm mt-1 truncate">📝 {room.specialDescription}</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setViewRoom(room)}
                    className="flex-1 bg-purple-600 text-white py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEdit(room)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room.roomId)}
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
        Showing {filtered.length} of {totalRooms} rooms
      </p>

      {/* ── View & Edit Modals remain unchanged, you can also replace Edit form input with same dropdown for category if needed */}
    </div>
  );
}