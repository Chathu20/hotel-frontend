import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL + "/api/users";

export default function AdminSettings() {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: "Bearer " + token } };

  // ── State ─────────────────────────────────────────────────────
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    phone:     "",
    whatsApp:  "",
  });

  // Password section
  const [pwOpen, setPwOpen]         = useState(false);
  const [pwForm, setPwForm]         = useState({ current: "", newPw: "", confirm: "" });
  const [changingPw, setChangingPw] = useState(false);

  // ── Load logged-in admin ──────────────────────────────────────
  function fetchUser() {
    setLoading(true);
    axios
      .get(BASE, authHeader)
      .then((res) => {
        const u = res.data.user;
        setUser(u);
        setForm({
          firstName: u.firstName || "",
          lastName:  u.lastName  || "",
          phone:     u.phone     || "",
          whatsApp:  u.whatsApp  || "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchUser(); }, []);

  // ── Save profile ──────────────────────────────────────────────
  function handleSave() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    setSaving(true);
    axios
      .put(`${BASE}/update/${user.email}`, form, authHeader)
      .then(() => {
        toast.success("Profile updated successfully");
        setEditMode(false);
        fetchUser();
      })
      .catch(() => toast.error("Update failed"))
      .finally(() => setSaving(false));
  }

  function handleCancel() {
    setForm({
      firstName: user.firstName || "",
      lastName:  user.lastName  || "",
      phone:     user.phone     || "",
      whatsApp:  user.whatsApp  || "",
    });
    setEditMode(false);
  }

  // ── Change password ───────────────────────────────────────────
  function handleChangePassword() {
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      toast.error("All password fields are required");
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwForm.newPw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPw(true);
    // Verify current password first, then update
    axios
      .post(`${BASE}/login`, { email: user.email, password: pwForm.current })
      .then(() =>
        axios.put(
          `${BASE}/update/${user.email}`,
          { password: pwForm.newPw },
          authHeader
        )
      )
      .then(() => {
        toast.success("Password changed! Logging you out...");
        setPwForm({ current: "", newPw: "", confirm: "" });
        setPwOpen(false);
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }, 2000);
      })
      .catch(() => toast.error("Current password is incorrect"))
      .finally(() => setChangingPw(false));
  }

  // ── Logout ────────────────────────────────────────────────────
  function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  // ── Loading / error ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-400 text-lg">Loading settings...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-400">Could not load profile. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#050A30]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin account</p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* Avatar row */}
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#050A30] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 select-none">
              {user.firstName?.[0]?.toUpperCase()}
              {user.lastName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[#050A30] truncate">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400 text-sm truncate">{user.email}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">
                  {user.type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  user.emailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {user.emailVerified ? "✓ Verified" : "Not Verified"}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  user.disabled
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {user.disabled ? "Disabled" : "Active"}
                </span>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="ml-auto bg-[#785D32] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5f4825] transition flex-shrink-0"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                className={`border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none transition ${
                  editMode ? "focus:ring-2 focus:ring-[#785D32]" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
                value={form.firstName}
                disabled={!editMode}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                className={`border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none transition ${
                  editMode ? "focus:ring-2 focus:ring-[#785D32]" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
                value={form.lastName}
                disabled={!editMode}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="border rounded-lg px-3 py-2 w-full mt-1 bg-gray-50 text-gray-400 cursor-not-allowed"
                value={user.email}
                disabled
              />
              <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                className={`border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none transition ${
                  editMode ? "focus:ring-2 focus:ring-[#785D32]" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
                value={form.phone}
                disabled={!editMode}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">WhatsApp</label>
              <input
                className={`border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none transition ${
                  editMode ? "focus:ring-2 focus:ring-[#785D32]" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
                value={form.whatsApp}
                disabled={!editMode}
                onChange={(e) => setForm({ ...form, whatsApp: e.target.value })}
              />
            </div>
          </div>

          {/* Save / Cancel */}
          {editMode && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Account Info Card ── */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-[#050A30] mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Role",           value: user.type,                          cls: "bg-purple-100 text-purple-700" },
              { label: "Account Status", value: user.disabled ? "Disabled":"Active",cls: user.disabled ? "bg-red-100 text-red-700":"bg-green-100 text-green-700" },
              { label: "Email Verified", value: user.emailVerified ? "Yes":"No",    cls: user.emailVerified ? "bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <span className="text-gray-500">{label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Change Password Card ── */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-[#050A30]">Change Password</h3>
            <button
              onClick={() => { setPwOpen(!pwOpen); setPwForm({ current: "", newPw: "", confirm: "" }); }}
              className="text-sm text-[#785D32] font-semibold hover:underline"
            >
              {pwOpen ? "Cancel" : "Change"}
            </button>
          </div>

          {!pwOpen ? (
            <p className="text-gray-400 text-sm mt-1">
              Click "Change" to update your password. You will be logged out after a successful change.
            </p>
          ) : (
            <div className="space-y-3 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                  value={pwForm.newPw}
                  onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#785D32]"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                />
              </div>

              {/* Live match indicator */}
              {pwForm.newPw && pwForm.confirm && (
                <p className={`text-xs font-semibold ${
                  pwForm.newPw === pwForm.confirm ? "text-green-600" : "text-red-500"
                }`}>
                  {pwForm.newPw === pwForm.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              <button
                onClick={handleChangePassword}
                disabled={changingPw}
                className="w-full bg-[#785D32] text-white py-2 rounded-lg hover:bg-[#5f4825] transition font-semibold disabled:opacity-50"
              >
                {changingPw ? "Changing..." : "Change Password"}
              </button>
            </div>
          )}
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-white rounded-2xl shadow p-6 border border-red-100">
          <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-4">
            Logging out will end your current session. You will need to sign in again to access the admin panel.
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}