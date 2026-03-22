import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CiBookmarkCheck } from "react-icons/ci";
import { FaBed, FaUsers, FaImages, FaTags, FaCommentDots } from "react-icons/fa";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const auth  = { headers: { Authorization: "Bearer " + token } };

  const [bookings,   setBookings]   = useState([]);
  const [rooms,      setRooms]      = useState([]);
  const [users,      setUsers]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [gallery,    setGallery]    = useState([]);
  const [adminUser,  setAdminUser]  = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get(`${API}/api/bookings`,           auth),
      axios.get(`${API}/api/rooms`),
      axios.post(`${API}/api/users/all`, {},      auth),
      axios.get(`${API}/api/category`),
      axios.get(`${API}/api/feedback`,            auth),
      axios.get(`${API}/api/gallery`),
      axios.get(`${API}/api/users`,               auth),
    ]).then(([b, r, u, c, f, g, me]) => {
      if (b.status  === "fulfilled") setBookings(b.value.data.result       || []);
      if (r.status  === "fulfilled") setRooms(r.value.data.rooms           || []);
      if (u.status  === "fulfilled") setUsers(u.value.data.users           || []);
      if (c.status  === "fulfilled") setCategories(c.value.data.categories || []);
      if (f.status  === "fulfilled") setFeedbacks(f.value.data.feedbacks   || []);
      if (g.status  === "fulfilled") setGallery(g.value.data.list          || []);
      if (me.status === "fulfilled") setAdminUser(me.value.data.user);
      setLoading(false);
    });
  }, []);

  const pendingBookings   = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
  const availableRooms    = rooms.filter((r) =>  r.available).length;
  const unavailableRooms  = rooms.filter((r) => !r.available).length;
  const adminCount        = users.filter((u) => u.type === "admin").length;
  const customerCount     = users.filter((u) => u.type === "customer").length;
  const disabledCount     = users.filter((u) => u.disabled).length;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const fmt = (d) => d ? new Date(d).toLocaleDateString() : "-";

  const STATUS_COLORS = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100  text-green-700",
    cancelled: "bg-red-100    text-red-700",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#785D32] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-[#050A30]">
            Welcome back{adminUser ? `, ${adminUser.firstName}` : ""} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening at your hotel today.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
          {adminUser && <p className="text-xs text-gray-400 mt-0.5">{adminUser.email}</p>}
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Bookings",   value: bookings.length,   color: "bg-blue-600",   icon: <CiBookmarkCheck size={22} />, to: "/admin/adminbooking"    },
          { label: "Rooms",      value: rooms.length,      color: "bg-[#785D32]",  icon: <FaBed           size={18} />, to: "/admin/adminrooms"      },
          { label: "Users",      value: users.length,      color: "bg-purple-600", icon: <FaUsers         size={18} />, to: "/admin/adminusers"      },
          { label: "Categories", value: categories.length, color: "bg-orange-500", icon: <FaTags          size={18} />, to: "/admin/admincategories" },
          { label: "Feedbacks",  value: feedbacks.length,  color: "bg-pink-500",   icon: <FaCommentDots   size={18} />, to: "/admin/adminfeedback"   },
          { label: "Gallery",    value: gallery.length,    color: "bg-teal-500",   icon: <FaImages        size={18} />, to: "/admin/admingallery"    },
        ].map((card) => (
          <Link key={card.label} to={card.to}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition group"
          >
            <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-[#050A30]">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Booking Status + Room Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-[#050A30] mb-5">Booking Status</h2>
          <div className="space-y-4">
            {[
              { label: "Pending",   value: pendingBookings,   color: "bg-yellow-400" },
              { label: "Confirmed", value: confirmedBookings, color: "bg-green-500"  },
              { label: "Cancelled", value: cancelledBookings, color: "bg-red-400"    },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="font-bold text-[#050A30]">{value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${color} h-2.5 rounded-full transition-all duration-700`}
                    style={{ width: bookings.length > 0 ? `${(value / bookings.length) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/adminbooking" className="mt-5 block text-center text-sm text-[#785D32] font-semibold hover:underline">
            View All Bookings →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-[#050A30] mb-5">Room Availability</h2>
          <div className="flex items-center justify-around">
            {[
              { label: "Available",   value: availableRooms,  border: "border-green-400", text: "text-green-600" },
              { label: "Unavailable", value: unavailableRooms, border: "border-red-400",   text: "text-red-500"   },
              { label: "Total",       value: rooms.length,     border: "border-blue-400",  text: "text-blue-600"  },
            ].map(({ label, value, border, text }) => (
              <div key={label} className="text-center">
                <div className={`w-20 h-20 rounded-full border-8 ${border} flex items-center justify-center`}>
                  <span className={`text-xl font-bold ${text}`}>{value}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">{label}</p>
              </div>
            ))}
          </div>
          <Link to="/admin/adminrooms" className="mt-5 block text-center text-sm text-[#785D32] font-semibold hover:underline">
            Manage Rooms →
          </Link>
        </div>
      </div>

      {/* User Overview + Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-[#050A30] mb-5">User Overview</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Admins",    value: adminCount,    cls: "bg-purple-100 text-purple-700" },
              { label: "Customers", value: customerCount, cls: "bg-blue-100   text-blue-700"   },
              { label: "Disabled",  value: disabledCount, cls: "bg-red-100    text-red-700"    },
            ].map(({ label, value, cls }) => (
              <div key={label} className={`${cls} rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
          <Link to="/admin/adminusers" className="mt-5 block text-center text-sm text-[#785D32] font-semibold hover:underline">
            Manage Users →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-[#050A30] mb-5">Room Categories</h2>
          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#785D32]" />
                    <span className="font-medium text-[#050A30] text-sm">{cat.name}</span>
                  </div>
                  <span className="text-[#785D32] font-bold text-sm">
                    ${cat.price}<span className="text-gray-400 text-xs font-normal">/night</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/admincategories" className="mt-5 block text-center text-sm text-[#785D32] font-semibold hover:underline">
            Manage Categories →
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#050A30]">Recent Bookings</h2>
          <Link to="/admin/adminbooking" className="text-sm text-[#785D32] font-semibold hover:underline">View All →</Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#050A30] text-white">
                <tr>
                  {["Booking ID", "Room", "Email", "Check-in", "Check-out", "Status"].map((h) => (
                    <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={b._id} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#fdf6ee] transition`}>
                    <td className="p-3 font-mono font-semibold text-[#785D32]">#{b.bookingId}</td>
                    <td className="p-3">{b.roomId}</td>
                    <td className="p-3 max-w-[150px] truncate">{b.email}</td>
                    <td className="p-3 whitespace-nowrap">{fmt(b.start)}</td>
                    <td className="p-3 whitespace-nowrap">{fmt(b.end)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Feedbacks */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#050A30]">Recent Feedbacks</h2>
          <Link to="/admin/adminfeedback" className="text-sm text-[#785D32] font-semibold hover:underline">View All →</Link>
        </div>
        {feedbacks.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No feedbacks yet.</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.slice(0, 4).map((f) => (
              <div key={f._id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-[#050A30] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {f.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-[#050A30] text-sm">{f.name}</p>
                    <p className="text-gray-300 text-xs ml-2 whitespace-nowrap">
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-1 mt-0.5">{f.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}