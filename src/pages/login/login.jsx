import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // using react-router for navigation
import "./login.css";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email, password }
      );

      // save token
      if (res.data?.token) localStorage.setItem("token", res.data.token);

      let userType =
        res?.data?.user?.userType ||
        res?.data?.user?.type ||
        res?.data?.type;

      if (!userType) {
        alert("Login success, but user type not found!");
        return;
      }

      userType = userType.toLowerCase().trim();

      if (userType === "customer") window.location.href = "/";
      else if (userType === "admin") window.location.href = "/admin";
      else alert("Unknown user type: " + userType);
    } catch (err) {
      if (err.response) alert(err.response.data?.message || "Login failed");
      else alert("Server not responding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2e] to-[#1a1f4a]">
      <div className="w-[400px] bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl text-center text-white mb-6 font-semibold">
          Welcome Back
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 h-[45px] px-3 rounded-lg bg-transparent border border-white text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mb-2 h-[45px] px-3 rounded-lg bg-transparent border border-white text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password */}
        <div className="w-full text-right mb-4">
          <Link
            to="forgotPassword"
            className="text-sm text-[#c9a96e] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-[45px] bg-[#c9a96e] hover:bg-[#b8965f] text-black font-semibold rounded-lg transition duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-300 mt-5 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#c9a96e] font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}