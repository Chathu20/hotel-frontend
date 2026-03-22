import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL + "/api/users";

export default function AdminUsers() {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: "Bearer " + token } };

  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // ── View Modal ────────────────────────────────────────────────
  const [viewUser, setViewUser] = useState(null);

  // ── Change Role Modal ─────────────────────────────────────────
  const [typeUser, setTypeUser]     = useState(null);
  const [newType, setNewType]       = useState("");
  const [savingType, setSavingType] = useState(false);

  // ── Fetch all users ───────────────────────────────────────────
  function fetchUsers() {
    setLoading(true);
    axios
      .post(BASE + "/all", {}, authHeader)
      .then((res) => setUsers(res.data.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchUsers(); }, []);

  // ── Filtered list ─────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q)  ||
      u.email?.toLowerCase().includes(q);
    const matchType =
      typeFilter === "all" || u.type === typeFilter;
    return matchSearch && matchType;
  });

  // ── Toggle Disable / Enable ───────────────────────────────────
  function toggleDisable(user) {
    const action = user.disabled ? "enable" : "disable";
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.firstName}?`)) return;
    axios
      .put(`${BASE}/disable/${user._id}`, { disabled: !user.disabled }, authHeader)
      .then(() => { toast.success(`User ${action}d`); fetchUsers(); })
      .catch(() => toast.error("Failed to update user"));
  }

  // ── Delete user ───────────────────────────────────────────────
  function handleDelete(user) {
    if (!window.confirm(`Permanently delete ${user.firstName} ${user.lastName}?`)) return;
    axios
      .delete(`${BASE}/admin-delete/${user.email}`, authHeader)
      .then(() => { toast.success("User deleted"); fetchUsers(); })
      .catch(() => toast.error("Delete failed"));
  }

  // ── Open change-role modal ────────────────────────────────────
  function openTypeModal(user) {
    setTypeUser(user);
    setNewType(user.type);
  }

  // ── Save role change ──────────────────────────────────────────
  function handleChangeType() {
    setSavingType(true);
    axios
      .put(`${BASE}/change-type/${typeUser._id}`, { type: newType }, authHeader)
      .then(() => {
        toast.success("User role updated");
        setTypeUser(null);
        fetchUsers();
      })
      .catch(() => toast.error("Failed to update role"))
      .finally(() => setSavingType(false));
  }

  // ── Stats ─────────────────────────────────────────────────────
  const totalUsers    = users.length;
  const adminCount    = users.filter((u) => u.type === "admin").length;
  const customerCount = users.filter((u) => u.type === "customer").length;
  const disabledCount = users.filter((u) => u.disabled).length;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#050A30]">User Management</h1>
        <p className="text-gray-500 mt-1">Manage all registered users</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: totalUsers,    color: "bg-blue-600"   },
          { label: "Admins",      value: adminCount,    color: "bg-purple-600" },
          { label: "Customers",   value: customerCount, color: "bg-green-600"  },
          { label: "Disabled",    value: disabledCount, color: "bg-red-500"    },
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
          placeholder="Search by name or email..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <button
          onClick={fetchUsers}
          className="bg-[#785D32] text-white px-5 py-2 rounded-lg hover:bg-[#5f4825] transition"
        >
          Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
            No users found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#050A30] text-white">
              <tr>
                {["Name","Email","Role","WhatsApp","Phone","Status","Email Verified","Actions"].map((h) => (
                  <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u._id}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#fdf6ee] transition`}
                >
                  {/* Name */}
                  <td className="p-3 font-semibold text-[#050A30] whitespace-nowrap">
                    {u.firstName} {u.lastName}
                  </td>

                  {/* Email */}
                  <td className="p-3 text-gray-600">{u.email}</td>

                  {/* Role */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      u.type === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.type}
                    </span>
                  </td>

                  {/* WhatsApp */}
                  <td className="p-3 text-gray-500">{u.whatsApp || "-"}</td>

                  {/* Phone */}
                  <td className="p-3 text-gray-500">{u.phone || "-"}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.disabled
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {u.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>

                  {/* Email Verified */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.emailVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {u.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setViewUser(u)}
                        className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openTypeModal(u)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition"
                      >
                        Role
                      </button>
                      <button
                        onClick={() => toggleDisable(u)}
                        className={`px-2 py-1 rounded text-xs text-white transition ${
                          u.disabled
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {u.disabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Row count */}
      {!loading && (
        <p className="text-gray-400 text-sm mt-3">
          Showing {filtered.length} of {totalUsers} users
        </p>
      )}

      {/* ── View Modal ── */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Avatar with initials */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-[#050A30] flex items-center justify-center text-white text-2xl font-bold">
                {viewUser.firstName?.[0]}{viewUser.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#050A30]">
                  {viewUser.firstName} {viewUser.lastName}
                </h2>
                <p className="text-gray-400 text-sm">{viewUser.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: "Role",           value: viewUser.type },
                { label: "Phone",          value: viewUser.phone || "-" },
                { label: "WhatsApp",       value: viewUser.whatsApp || "-" },
                { label: "Account Status", value: viewUser.disabled ? "Disabled" : "Active" },
                { label: "Email Verified", value: viewUser.emailVerified ? "Yes" : "No" },
                { label: "User ID",        value: viewUser._id },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-[#050A30] text-right max-w-[200px] truncate">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setViewUser(null)}
              className="mt-5 w-full bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Change Role Modal ── */}
      {typeUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-[#050A30] mb-1">Change Role</h2>
            <p className="text-gray-400 text-sm mb-4">
              {typeUser.firstName} {typeUser.lastName} · {typeUser.email}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleChangeType}
                disabled={savingType}
                className="flex-1 bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition disabled:opacity-50"
              >
                {savingType ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setTypeUser(null)}
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