import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_BACKEND_URL + "/api/rooms";
const BOOKING_API = import.meta.env.VITE_BACKEND_URL + "/api/bookings/";

export default function RoomSearch() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [booking, setBooking] = useState(false);

  const token = localStorage.getItem("token");

  // Load rooms
  useEffect(() => {
    axios.get(API)
      .then(res => setRooms(res.data.rooms || []))
      .catch(() => toast.error("Failed to load rooms"))
      .finally(() => setLoading(false));
  }, []);

  // Calculate nights
  const nights =
    startDate && endDate && new Date(endDate) > new Date(startDate)
      ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000)
      : 0;

  // Open booking UI
  function openBooking(room) {
    setSelectedRoom(room);
  }

  // Handle booking
  function handleBook() {
    if (!token) return toast.error("Please login first");
    if (!startDate || !endDate) return toast.error("Please select dates");
    if (new Date(endDate) <= new Date(startDate)) return toast.error("Invalid date range");

    setBooking(true);

    axios.post(
      BOOKING_API,
      { roomId: selectedRoom.roomId, start: startDate, end: endDate },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        toast.success("Booking successful!");
        setSelectedRoom(null);
        setStartDate("");
        setEndDate("");
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Booking failed");
      })
      .finally(() => setBooking(false));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ROOMS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rooms.map(room => (
            <div key={room.roomId} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">

              {/* Room Image */}
              <img
                src={room.photos?.[0] || "https://via.placeholder.com/400x180?text=No+Image"}
                className="h-44 w-full object-cover"
                alt={`Room ${room.roomId}`}
              />

              <div className="p-4">
                <h2 className="font-bold text-lg">Room #{room.roomId}</h2>
                <p className="text-gray-700 font-semibold">{room.category}</p>
                <p className="text-gray-500 text-sm">👥 Max Guests: {room.maxGuests}</p>
                {room.specialDescription && (
                  <p className="text-gray-400 text-sm mt-1 truncate">📝 {room.specialDescription}</p>
                )}

                {/* Book Button */}
                <button
                  onClick={() => openBooking(room)}
                  disabled={!room.available}
                  className={`mt-3 w-full py-2 rounded ${
                    room.available ? "bg-[#785D32] text-white hover:bg-[#5f4825]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {room.available ? "Book Now" : "Unavailable"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* BOOKING POPUP */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl w-[350px]">

            <h2 className="text-lg font-bold mb-3">Book Room #{selectedRoom.roomId}</h2>

            {/* Date inputs */}
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border w-full mb-3 p-2"
              min={new Date().toISOString().split("T")[0]}
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border w-full mb-3 p-2"
              min={startDate}
            />

            {/* Nights */}
            {nights > 0 && <p className="mb-2 text-sm">{nights} nights selected</p>}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleBook}
                disabled={booking}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                {booking ? "Booking..." : "Confirm"}
              </button>

              <button
                onClick={() => setSelectedRoom(null)}
                className="bg-gray-300 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}