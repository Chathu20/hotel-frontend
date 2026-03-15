import UserTag from "../userData/userdata.jsx";

export default function Header() {
  return (
    <header className="w-full bg-blue-500 h-[100px] flex items-center justify px-5 text-white">
             
    <UserTag imageLink="https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2944.jpg?semt=ais_rp_50_assets&w=740&q=80"   name="Chathu"/>

      <h1 className="text-2xl font-bold p-[150px] ml-[-150px]">
        Aurora Haven Hotel
      </h1>

      <ul className="flex gap-6 cursor-pointer">
        <li>Home</li>
        <li>Rooms</li>
        <li>Gallery</li>
        <li>Contact</li>
      </ul>
  
    </header>
  )
}