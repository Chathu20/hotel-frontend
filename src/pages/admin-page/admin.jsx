import { Link, Route, Routes } from "react-router-dom";

import { CiBookmarkCheck } from "react-icons/ci";
import { FaBed, FaUsers, FaImages } from "react-icons/fa";
import { MdCategory, MdFeedback, MdSettings } from "react-icons/md";

import AdminBooking from "../admin/Booking/adminbooking";
import AdminCategories from "../admin/categories/admincategories";
import AdminRooms from "../admin/Rooms/adminrooms";
import AdminUsers from "../admin/Users/adminusers";
import AdminFeedback from "../admin/Feedback/adminfeedback";
import AdminGallery from "../admin/GalleryItems/admingallery";
import AdminSettings from "../admin/Setting/adminsetting";
import AddCategoryForm from "../admin/AddCategoryForm/addCategoryForm";
import UpdateCategoryForm from "../admin/UpdateCategoryForm/updateCategory";


export default function AdminPage() {
  return (
    <div className="w-full h-screen flex">
      
      <div className="w-[20%] bg-[#050A30] h-full flex flex-col p-5 gap-5 text-white">
        <h1 className="text-2xl font-bold text-[#E8D9C4] mb-5">Admin Panel</h1>

        <Link to="/admin/adminbooking" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <CiBookmarkCheck size={22} />
          <span>Bookings</span>
        </Link>

        <Link to="/admin/admincategories" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <MdCategory size={22} />
          <span>Categories</span>
        </Link>

        <Link to="/admin/adminrooms" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <FaBed size={22} />
          <span>Rooms</span>
        </Link>

        <Link to="/admin/adminusers" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <FaUsers size={22} />
          <span>Users</span>
        </Link>

        <Link to="/admin/adminfeedback" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <MdFeedback size={22} />
          <span>Feedback</span>
        </Link>

        <Link to="/admin/admingallery" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <FaImages size={22} />
          <span>Gallery Items</span>
        </Link>

        <Link to="/admin/adminsetting" className="flex items-center gap-3 text-lg hover:text-[#E8D9C4]">
          <MdSettings size={22} /> {/* ← Correct icon */}
          <span>Settings</span>
        </Link>
      </div>


      <div className="w-[80%] max-h-[100vh] overflow-y-scroll bg-blue-900">
        <Routes>
            
          <Route path="/adminbooking" element={<AdminBooking />} /> 
          <Route path="/admincategories" element={<AdminCategories />} />
          <Route path="/update-category" element={<UpdateCategoryForm/>}/> 
          <Route path="/add-category" element={<AddCategoryForm/>}/>
          <Route path="/adminrooms" element={<AdminRooms />} /> 
          <Route path="/adminusers" element={<AdminUsers />} /> 
          <Route path="/adminfeedback" element={<AdminFeedback />} /> 
          <Route path="/admingallery" element={<AdminGallery />} />    
          <Route path="/adminsetting" element={<AdminSettings />} />       
        </Routes>
      </div>
    </div>
  );
}