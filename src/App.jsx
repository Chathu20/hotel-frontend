import Header from "./components/Header/header.jsx"
import "./App.css";
import HomePage from "./pages/client-page/homePage.jsx";
import AdminPage from "./pages/admin-page/admin.jsx";
import About from "./pages/client-page/about";
import Contact from "./pages/client-page/contact";
import RoomSearch from "./pages/client-page/roomSearch";
import Gallery from "./pages/client-page/gallery";
import Register from "./pages/client-page/register.jsx";
import Profile from "./pages/client-page/profile.jsx";
import Feedback from "./pages/client-page/feedback.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/login.jsx";
import TestComponent from "./pages/Test/test.jsx";
function App() {
  return (
    <BrowserRouter>

  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/rooms" element={<RoomSearch />} />
    <Route path="/gallery" element={<Gallery />} />
    
    <Route path="/register" element={<Register />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/feedback" element={<Feedback />} />
    <Route path="/test" element={<TestComponent />} />
    <Route path="/login" element={<LoginPage />} />

    <Route path="/admin/*" element={<AdminPage />} />
  </Routes>
</BrowserRouter>
  );
}

export default App