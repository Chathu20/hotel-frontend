import Header from "../../components/Header/header";

export default function Profile(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] min-h-screen p-10">

        <div className="bg-white p-6 rounded shadow w-[400px]">

          <h2 className="text-2xl font-bold text-[#3E160C] mb-4">
            Account Details
          </h2>

          <p>Name : Sanduni</p>
          <p>Email : sanduni@email.com</p>

        </div>

      </div>
    </>
  )
}