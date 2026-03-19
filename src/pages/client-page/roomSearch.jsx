import Header from "../../components/Header/header";

export default function RoomSearch(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] min-h-screen p-10">

        <h1 className="text-3xl mb-6 text-[#3E160C]">
          Available Rooms
        </h1>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl font-bold">Luxury Room</h2>
            <p>Max Guests: 4</p>

            <button className="bg-[#785D32] text-white px-3 py-1 mt-3 rounded">
              Book Now
            </button>
          </div>

        </div>

      </div>
    </>
  )
}