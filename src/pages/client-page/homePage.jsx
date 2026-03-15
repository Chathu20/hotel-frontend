import Header from "../../components/Header/header";

export default function HomePage(){
    return(
         <>
          <Header/>
              <div className="w-full h-screen bg-blue-900">
                <div className="border border-white bg-white h-[100px] w-[700pz] rounded-lg flex justify-center item-center">
                  ,<input type="date"/>
                  <input type="date"/>
                  <select>
                    <option>Luxury</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </select>
                  <button>Booking Now</button>
                </div>
              </div>
            </>
          );
        }
        
        
    