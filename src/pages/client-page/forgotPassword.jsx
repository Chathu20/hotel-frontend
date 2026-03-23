import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleForgotPassword() {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`, {
        email,
      })
      .then((res) => {
        alert(res.data?.message || "Reset link sent to your email");
        setEmail("");
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data?.message || "Failed to send reset link");
        } else {
          alert("Server not responding");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2e] to-[#1a1f4a]">
      
      {/* Card */}
      <div className="w-[400px] bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl text-center text-white mb-6 font-semibold">
          Forgot Password
        </h1>

        <p className="text-gray-300 text-sm text-center mb-6">
          Enter your email and we’ll send you a password reset link
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 h-[45px] px-3 rounded-lg bg-transparent border border-white text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Send Button */}
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full h-[45px] bg-[#c9a96e] hover:bg-[#b8965f] text-black font-semibold rounded-lg transition duration-300"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <p className="text-center text-gray-300 mt-5 text-sm">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-[#c9a96e] font-medium hover:underline"
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
}