import Header from "../../components/Header/header";

export default function Feedback(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] min-h-screen flex justify-center items-center">

        <div className="bg-white p-8 rounded w-[400px]">

          <h2 className="text-2xl mb-4 text-[#3E160C] font-bold">
            Customer Feedback
          </h2>

          <textarea placeholder="Write your feedback..." className="border w-full p-2 mb-3"/>

          <button className="bg-[#785D32] text-white w-full p-2 rounded">
            Submit
          </button>

        </div>

      </div>
    </>
  )
}