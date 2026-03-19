import Header from "../../components/Header/header";

export default function Gallery(){

  return(
    <>
      <Header/>

      <div className="bg-[#E8D9C4] min-h-screen p-10">

        <h1 className="text-3xl mb-6 text-[#3E160C]">
          Hotel Gallery
        </h1>

        <div className="grid grid-cols-4 gap-5">

          <img src="/room1.jpg" className="rounded"/>
          <img src="/room2.jpg" className="rounded"/>

        </div>

      </div>
    </>
  )
}