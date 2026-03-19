import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";

export default function HomePage(){
  return(
    <>
      <Header/>

      <div className="w-full h-screen bg-[#E8D9C4] flex justify-center items-center">

        <div className="bg-white h-[100px] w-[700px] rounded-lg flex justify-center items-center gap-4 shadow">

          <input type="date" className="border p-2"/>

          <input type="date" className="border p-2"/>

          <select className="border p-2">
            <option>Luxury</option>
            <option>Normal</option>
            <option>Low</option>
          </select>

          <button className="bg-[#785D32] text-white px-4 py-2 rounded">
            Booking Now
          </button>

        </div>

      </div>

      <Footer/>
    </>
  )
}