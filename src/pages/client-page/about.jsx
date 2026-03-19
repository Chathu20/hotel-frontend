import Header from "../../components/Header/header";

export default function About(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] min-h-screen p-10">

        <h1 className="text-4xl text-[#3E160C] font-bold mb-6">
          About Our Hotel
        </h1>

        <p>
        Our luxury hotel offers the best experience with modern rooms,
        beautiful views, and excellent service.
        </p>

      </div>
    </>
  )
}