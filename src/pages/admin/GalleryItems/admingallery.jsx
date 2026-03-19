import { useState } from "react";

export default function AdminGallery(){

  const [gallery, setGallery] = useState([
    {id:1, name:"Beach View", file:null, url:"https://via.placeholder.com/150"},
    {id:2, name:"Lobby", file:null, url:"https://via.placeholder.com/150"}
  ]);

  const [form, setForm] = useState({name:"", file:null});
  const [editId, setEditId] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  // Handle form input
  function handleChange(e){
    const {name, value, files} = e.target;
    if(name === "file"){
      setForm({...form, file: files[0]});
    } else {
      setForm({...form, [name]: value});
    }
  }

  // Add or Update
  function handleSubmit(){
    if(editId){
      setGallery(gallery.map(g => g.id === editId ? {...g, name: form.name, url: form.file ? URL.createObjectURL(form.file) : g.url} : g));
      setEditId(null);
    } else {
      const newItem = {
        id: Date.now(),
        name: form.name,
        file: form.file,
        url: form.file ? URL.createObjectURL(form.file) : ""
      };
      setGallery([...gallery, newItem]);
    }
    setForm({name:"", file:null});
  }

  // Edit
  function editItem(item){
    setEditId(item.id);
    setForm({name:item.name, file:null});
  }

  // Delete
  function deleteItem(id){
    setGallery(gallery.filter(g => g.id !== id));
  }

  return(
    <div>
      <h1 className="text-2xl font-bold mb-5 text-[#3E160C]">Gallery Upload</h1>

      {/* Form */}
      <div className="bg-white p-5 rounded shadow w-[400px] mb-5">
        <input 
          type="text" 
          name="name"
          placeholder="Image Name" 
          value={form.name}
          onChange={handleChange}
          className="border w-full p-2 mb-3"
        />

        <input 
          type="file" 
          name="file"
          onChange={handleChange}
          className="mb-3 w-full"
        />

        <button 
          onClick={handleSubmit}
          className="bg-[#785D32] text-white w-full p-2 rounded"
        >
          {editId ? "Update" : "Upload"}
        </button>
      </div>

      {/* Gallery List */}
      <div className="grid grid-cols-3 gap-5">
        {gallery.map(item=>(
          <div key={item.id} className="bg-white p-3 rounded shadow flex flex-col items-center">
            <img 
              src={item.url || "https://via.placeholder.com/150"} 
              alt={item.name} 
              className="w-full h-32 object-cover mb-2 cursor-pointer"
              onClick={()=> setViewImage(item)}
            />
            <h3 className="font-bold mb-2">{item.name}</h3>
            <div className="flex gap-2">
              <button 
                onClick={()=> editItem(item)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button 
                onClick={()=> deleteItem(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-2">{viewImage.name}</h2>
            <img src={viewImage.url} alt={viewImage.name} className="w-full h-64 object-cover mb-3"/>
            <button 
              onClick={()=> setViewImage(null)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}