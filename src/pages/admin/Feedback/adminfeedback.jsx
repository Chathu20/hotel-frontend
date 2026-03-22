import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL + "/api/feedback";

export default function AdminFeedback() {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: "Bearer " + token } };

  const [feedbacks, setFeedbacks]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [viewFeedback, setViewFeedback] = useState(null);

  // ── Fetch all feedbacks ───────────────────────────────────────
  function fetchFeedbacks() {
    setLoading(true);
    axios
      .get(BASE, authHeader)
      .then((res) => setFeedbacks(res.data.feedbacks || []))
      .catch(() => toast.error("Failed to load feedbacks"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchFeedbacks(); }, []);

  // ── Search filter ─────────────────────────────────────────────
  const filtered = feedbacks.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q)    ||
      f.email?.toLowerCase().includes(q)   ||
      f.message?.toLowerCase().includes(q)
    );
  });

  // ── Delete ────────────────────────────────────────────────────
  function handleDelete(f) {
    if (!window.confirm(`Delete feedback from ${f.name}?`)) return;
    axios
      .delete(`${BASE}/${f._id}`, authHeader)
      .then(() => { toast.success("Feedback deleted"); fetchFeedbacks(); })
      .catch(() => toast.error("Delete failed"));
  }

  // ── Format date ───────────────────────────────────────────────
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
        })
      : "";

  const total = feedbacks.length;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#050A30]">Feedback Management</h1>
        <p className="text-gray-500 mt-1">View and manage customer feedback</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Feedbacks", value: total,                   color: "bg-blue-600"  },
          { label: "Showing",         value: filtered.length,         color: "bg-green-600" },
          { label: "Hidden",          value: total - filtered.length, color: "bg-gray-500"  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
              {s.value}
            </div>
            <span className="text-gray-600 font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Search & Refresh ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, email or message..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchFeedbacks}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          Refresh
        </button>
      </div>

      {/* ── Feedback List ── */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
          Loading feedbacks...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
          No feedbacks found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((f, i) => (
            <div
              key={f._id}
              className={`bg-white rounded-xl shadow p-5 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition ${
                i % 2 !== 0 ? "bg-gray-50" : ""
              }`}
            >
              {/* Left — info */}
              <div className="flex-1 min-w-0">

                {/* Avatar + name + email + date */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#050A30] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {f.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-[#050A30] leading-tight">{f.name}</p>
                    <p className="text-gray-400 text-xs">{f.email}</p>
                  </div>
                  <p className="ml-auto text-gray-300 text-xs whitespace-nowrap hidden md:block">
                    {fmt(f.createdAt)}
                  </p>
                </div>

                {/* Message preview */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 pl-14">
                  {f.message}
                </p>

                {/* Date on mobile */}
                <p className="text-gray-300 text-xs mt-2 pl-14 md:hidden">
                  {fmt(f.createdAt)}
                </p>
              </div>

              {/* Right — actions */}
              <div className="flex flex-row md:flex-col gap-2 justify-end flex-shrink-0">
                <button
                  onClick={() => setViewFeedback(f)}
                  className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(f)}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Row count */}
      {!loading && (
        <p className="text-gray-400 text-sm mt-4">
          Showing {filtered.length} of {total} feedbacks
        </p>
      )}

      {/* ── View Modal ── */}
      {viewFeedback && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-[#050A30] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {viewFeedback.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#050A30]">{viewFeedback.name}</h2>
                <p className="text-gray-400 text-sm">{viewFeedback.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Submitted</span>
                <span className="font-semibold text-[#050A30]">{fmt(viewFeedback.createdAt)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Email</span>
                <span className="font-semibold text-[#050A30] text-right max-w-[220px] truncate">
                  {viewFeedback.email}
                </span>
              </div>
            </div>

            {/* Full message */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Message</p>
              <p className="text-gray-700 leading-relaxed">{viewFeedback.message}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { handleDelete(viewFeedback); setViewFeedback(null); }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setViewFeedback(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}