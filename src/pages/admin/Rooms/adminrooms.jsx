import { useState } from "react";

export default function AdminRooms(){

  const [rooms, setRooms] = useState([
    {
      id:1,
      type:"Luxury",
      guests:4,
      price:250,
      status:"Available",
      image:"https://images.unsplash.com/photo-1566665797739-1674de7a421a"
    },
    {
      id:2,
      type:"Normal",
      guests:2,
      price:100,
      status:"Maintenance",
      image:"https://images.unsplash.com/photo-1590490360182-c33d57733427"
    }
  ]);

  const [newRoom, setNewRoom] = useState({
    type:"",
    guests:"",
    price:"",
    image:""
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ➕ Add Room
  function addRoom(){
    if(!newRoom.type || !newRoom.guests || !newRoom.price) return;

    setRooms([
      ...rooms,
      {
        ...newRoom,
        id: Date.now(),
        status:"Available"
      }
    ]);

    setNewRoom({type:"", guests:"", price:"", image:""});
  }

  // ❌ Delete
  function deleteRoom(id){
    setRooms(rooms.filter((r)=> r.id !== id));
  }

  // ✏️ Edit
  function startEdit(room){
    setEditId(room.id);
    setEditData(room);
  }

  function handleChange(e){
    const {name, value} = e.target;
    setEditData({...editData, [name]: value});
  }

  function saveEdit(){
    setRooms(rooms.map((r)=> r.id === editId ? editData : r));
    setEditId(null);
  }

  // 🔄 Status Change
  function changeStatus(id, status){
    setRooms(rooms.map((r)=> r.id === id ? {...r, status} : r));
  }

  // 👁 View
  function handleView(room){
    setSelectedRoom(room);
  }

  // 🎨 Status Color
  function statusColor(status){
    if(status === "Available") return "bg-green-500";
    if(status === "Not Available") return "bg-red-500";
    return "bg-yellow-500";
  }

  return(
    <div>
      <h1 className="text-2xl font-bold mb-5 text-[#3E160C]">Rooms</h1>

      {/* ➕ Add Form */}
      <div className="bg-white p-4 rounded shadow mb-5 flex gap-2 flex-wrap">
        <input placeholder="Type" value={newRoom.type}
          onChange={(e)=> setNewRoom({...newRoom, type:e.target.value})}
          className="border p-2"/>

        <input type="number" placeholder="Guests" value={newRoom.guests}
          onChange={(e)=> setNewRoom({...newRoom, guests:e.target.value})}
          className="border p-2"/>

        <input type="number" placeholder="Price ($)" value={newRoom.price}
          onChange={(e)=> setNewRoom({...newRoom, price:e.target.value})}
          className="border p-2"/>

        <input placeholder="Image URL" value={newRoom.image}
          onChange={(e)=> setNewRoom({...newRoom, image:e.target.value})}
          className="border p-2"/>

        <button onClick={addRoom}
          className="bg-[#785D32] text-white px-3 rounded">
          Add
        </button>
      </div>

      {/* 🏨 Rooms */}
      <div className="grid grid-cols-3 gap-5">

        {rooms.map((room)=>(
          <div key={room.id} className="bg-white rounded shadow overflow-hidden">

            {/* 🖼 Image */}
            <img src={room.image} className="h-[150px] w-full object-cover"/>

            <div className="p-4">

              {editId === room.id ? (
                <>
                  <input name="type" value={editData.type} onChange={handleChange} className="border p-1 w-full mb-2"/>
                  <input name="guests" value={editData.guests} onChange={handleChange} className="border p-1 w-full mb-2"/>
                  <input name="price" value={editData.price} onChange={handleChange} className="border p-1 w-full mb-2"/>
                  <input name="image" value={editData.image} onChange={handleChange} className="border p-1 w-full mb-2"/>

                  <select name="status" value={editData.status} onChange={handleChange} className="border p-1 w-full mb-2">
                    <option>Available</option>
                    <option>Not Available</option>
                    <option>Maintenance</option>
                  </select>

                  <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{room.type}</h2>
                  <p>Guests: {room.guests}</p>
                  <p className="font-semibold">💰 ${room.price}</p>

                  {/* 🎨 Status Badge */}
                  <span className={`text-white px-2 py-1 rounded text-sm ${statusColor(room.status)}`}>
                    {room.status}
                  </span>

                  {/* 🔄 Status Change */}
                  <select
                    value={room.status}
                    onChange={(e)=> changeStatus(room.id, e.target.value)}
                    className="border p-1 mt-2 w-full"
                  >
                    <option>Available</option>
                    <option>Not Available</option>
                    <option>Maintenance</option>
                  </select>

                  {/* Buttons */}
                  <div className="mt-3 space-x-2">
                    <button onClick={()=> handleView(room)} className="bg-purple-600 text-white px-2 py-1 rounded">View</button>
                    <button onClick={()=> startEdit(room)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={()=> deleteRoom(room.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 👁 Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded w-[350px]">

            <img src={selectedRoom.image} className="h-[150px] w-full object-cover mb-3"/>

            <h2 className="text-xl font-bold">{selectedRoom.type}</h2>
            <p>Guests: {selectedRoom.guests}</p>
            <p>Price: ${selectedRoom.price}</p>
            <p>Status: {selectedRoom.status}</p>

            <button onClick={()=> setSelectedRoom(null)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded">
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  )
}