import { Link } from "react-router-dom";

export default function Header(){
  return(
    <div className="w-full h-[80px] bg-[#050A30] text-white flex justify-between items-center px-10">

      <h1 className="text-2xl font-bold text-[#E8D9C4]">
        Aurora Haven Hotel
      </h1>

      <div className="flex gap-6">

        <Link to="/">Home</Link>
        <Link to="/rooms">Rooms</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
          <Link to="/profile">Profile</Link>
   

      </div>

    </div>
  )
}