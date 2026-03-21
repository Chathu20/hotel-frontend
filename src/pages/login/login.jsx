import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {

    // validation
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
      email: email,
      password: password
    })
    .then((res) => {

      console.log("FULL RESPONSE:", res.data);

      // ✅ save token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      // 🔥 FIX 1: correct field name + safe access
      let userType = res?.data?.user?.userType || res?.data?.user?.type || res?.data?.type;

      console.log("User Type (raw):", userType);

      // 🔥 FIX 2: handle undefined
      if (!userType) {
        alert("Login success, but user type not found!");
        return;
      }

      // 🔥 FIX 3: normalize (IMPORTANT)
      userType = userType.toLowerCase().trim();

      console.log("User Type (normalized):", userType);

      // 🔥 FIX 4: correct conditions
      if (userType === "customer") {
        window.location.href = "/";
      } 
      else if (userType === "admin") {
        window.location.href = "/admin";
      } 
      else {
        alert("Unknown user type: " + userType);
      }

    })
    .catch((err) => {

      console.error("LOGIN ERROR:", err);

      if (err.response) {
        alert(err.response.data?.message || "Login failed");
      } else {
        alert("Server not responding");
      }

    });

  }

  return (
    <div className="w-full h-[100vh] pic-bg flex justify-center items-center">
      
      <div className="w-[400px] h-[400px] backdrop-blur-md rounded-lg flex flex-col items-center justify-center relative">
        
        <h1 className="text-3xl p-[15px] text-white absolute top-[40px] text-center">
          Login
        </h1>

        <input
          type="text"
          placeholder="Enter your email address"
          className="w-[80%] bg-[#00000000] border-[2px] text-white placeholder:text-white h-[50px] px-[5px] mb-[20px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-[80%] bg-[#00000000] border-[2px] text-white placeholder:text-white h-[50px] px-[5px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-[80%] absolute bottom-[40px] bg-red-500 text-white h-[50px]"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>

    </div>
  );
}