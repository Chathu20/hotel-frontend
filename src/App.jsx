
import "./App.css";
import AdminPage from "./pages/admin-page/admin.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/login.jsx";
import TestComponent from "./pages/Test/test.jsx";
import { CustomerPage } from "./pages/client-page/clientPage.jsx";
import CategoriesPage from "./pages/client-page/categories.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
    
    <Toaster position="top-right" reverseOrder={false}/>
    <Routes path="/*">
     <Route path="/test" element={<TestComponent />} />
     <Route path="/login" element={<LoginPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/admin/*" element={<AdminPage />} />
     <Route path="/*" element={<CustomerPage/>} />
  </Routes>
</BrowserRouter>
  );
}

export default App