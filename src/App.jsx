import Header from "./components/Header/header.jsx"
import "./App.css";
import HomePage from "./pages/client-page/homePage.jsx";
import AdminPage from "./pages/admin-page/admin.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes path="/*">
        <Route path="/" element={<HomePage/>}/>
        <Route path="/admin/*" element={<AdminPage/>}/>
        <Route path="/*" element={
          <div className="w-full h-[100vh] bg-green-400">
          404
          </div>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App