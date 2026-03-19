import { useState } from "react";

export default function AdminSettings() {
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "admin@hotel.com",
    password: "",
    photo: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  function handleUpdate() {
    setAdmin({ ...admin, password: newPassword || admin.password });
    setNewPassword("");
    setEditMode(false);
    alert("Profile updated!");
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setAdmin({ ...admin, photo: URL.createObjectURL(file) });
    }
  }

  return (
    <div className="p-5 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-[#3E160C]">Admin Settings</h1>

      <div className="bg-white p-5 rounded shadow space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={admin.photo || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2"
          />
          {editMode && (
            <input type="file" onChange={handlePhotoUpload} className="mb-2" />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name:</label>
          <input
            type="text"
            value={admin.name}
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            disabled={!editMode}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email:</label>
          <input
            type="email"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            disabled={!editMode}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Password:</label>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!editMode}
            className="border w-full p-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          {editMode ? (
            <>
              <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-3 py-1 rounded">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-3 py-1 rounded">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}