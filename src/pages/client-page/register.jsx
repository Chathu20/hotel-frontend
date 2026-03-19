import Header from "../../components/Header/header";

export default function Register(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] min-h-screen flex justify-center items-center">

        <div className="bg-white p-10 rounded-lg w-[400px]">

          <h2 className="text-2xl mb-5 text-[#3E160C] font-bold">
            Register
          </h2>

          <input placeholder="First Name" className="border w-full p-2 mb-3"/>

          <input placeholder="Last Name" className="border w-full p-2 mb-3"/>

          <input placeholder="Email" className="border w-full p-2 mb-3"/>

          <input placeholder="Password" type="password" className="border w-full p-2 mb-4"/>

          <button className="bg-[#785D32] text-white w-full p-2 rounded">
            Register
          </button>

        </div>

      </div>
    </>
  )
}