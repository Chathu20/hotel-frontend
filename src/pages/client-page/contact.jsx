import Header from "../../components/Header/header";

export default function Contact(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] h-screen flex justify-center items-center">

        <div className="bg-white p-10 rounded w-[400px]">

          <h2 className="text-2xl mb-4">Contact Us</h2>

          <input placeholder="Name" className="border w-full p-2 mb-3"/>

          <input placeholder="Email" className="border w-full p-2 mb-3"/>

          <textarea placeholder="Message" className="border w-full p-2 mb-3"/>

          <button className="bg-[#785D32] text-white w-full p-2 rounded">
            Send
          </button>

        </div>

      </div>
    </>
  )
}