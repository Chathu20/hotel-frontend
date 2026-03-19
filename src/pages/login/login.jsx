import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login clicked");

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: email,
          password: password,
        }
      );

      console.log(res.data);

      // ✅ save token
      localStorage.setItem("token", res.data.token);

      alert("Login Success ✅");

      // ✅ redirect
      if (res.data.user.type == "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.error(err);
      alert("Login Failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-[100vh] pic-bg flex justify-center items-center overflow-hidden">
      
      <div className="w-[400px] p-6 backdrop-blur-md bg-white/30 rounded-lg shadow-lg">
        
        <h1 className="text-3xl p-[15px] text-black text-center font-bold">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            className="p-2 rounded-md border outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            className="p-2 rounded-md border outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}