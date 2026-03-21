import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending:   "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminBooking() {
  const [bookings, setBookings]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [newStatus, setNewStatus]       = useState("");
  const [reason, setReason]             = useState("");
  const [updating, setUpdating]         = useState(false);

  const token = localStorage.getItem("token");

  // ── Fetch all bookings ──────────────────────────────────────────
  function fetchBookings() {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/bookings", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const data = res.data.result || [];
        setBookings(data);
        setFiltered(data);
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  // ── Filter logic ────────────────────────────────────────────────
  useEffect(() => {
    let list = [...bookings];
    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.email?.toLowerCase().includes(q) ||
          String(b.bookingId).includes(q) ||
          String(b.roomId).includes(q)
      );
    }
    setFiltered(list);
  }, [search, statusFilter, bookings]);

  // ── Open modal ──────────────────────────────────────────────────
  function openModal(booking) {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setReason(booking.reason || "");
    setModalOpen(true);
  }

  // ── Update booking status ───────────────────────────────────────
  function handleUpdateStatus() {
    if (!selectedBooking) return;
    setUpdating(true);
    axios
      .patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${selectedBooking.bookingId}`,
        { status: newStatus, reason },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(() => {
        toast.success("Booking updated successfully");
        setModalOpen(false);
        fetchBookings();
      })
      .catch(() => toast.error("Update failed — check backend PATCH route"))
      .finally(() => setUpdating(false));
  }

  // ── Stats ───────────────────────────────────────────────────────
  const total     = bookings.length;
  const pending   = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#050A30]">Booking Management</h1>
        <p className="text-gray-500 mt-1">View and manage all hotel bookings</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",     value: total,     color: "bg-blue-600" },
          { label: "Pending",   value: pending,   color: "bg-yellow-500" },
          { label: "Confirmed", value: confirmed, color: "bg-green-600" },
          { label: "Cancelled", value: cancelled, color: "bg-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
              {s.value}
            </div>
            <span className="text-gray-600 font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by email, booking ID or room ID..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={fetchBookings}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
            Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
            No bookings found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#050A30] text-white">
              <tr>
                {["Booking ID","Room ID","Email","Check-in","Check-out","Status","Reason","Action"].map((h) => (
                  <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr
                  key={b._id}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#fdf6ee] transition`}
                >
                  <td className="p-3 font-mono font-semibold text-[#785D32]">#{b.bookingId}</td>
                  <td className="p-3">{b.roomId}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3 whitespace-nowrap">{fmt(b.start)}</td>
                  <td className="p-3 whitespace-nowrap">{fmt(b.end)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 max-w-[150px] truncate">{b.reason || "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openModal(b)}
                      className="bg-[#785D32] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#5f4825] transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Row count ── */}
      {!loading && (
        <p className="text-gray-400 text-sm mt-3">
          Showing {filtered.length} of {total} bookings
        </p>
      )}

      {/* ── Update Modal ── */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <h2 className="text-xl font-bold text-[#050A30] mb-1">Update Booking</h2>
            <p className="text-gray-400 text-sm mb-4">
              Booking #{selectedBooking.bookingId} · {selectedBooking.email}
            </p>

            {/* Booking Info */}
            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between">
                <span>Room ID</span>
                <span className="font-semibold">{selectedBooking.roomId}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="font-semibold">{fmt(selectedBooking.start)}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="font-semibold">{fmt(selectedBooking.end)}</span>
              </div>
            </div>

            {/* Status dropdown */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Reason textarea */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#785D32] resize-none"
              rows={3}
              placeholder="e.g. Room unavailable, payment issue..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="flex-1 bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
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