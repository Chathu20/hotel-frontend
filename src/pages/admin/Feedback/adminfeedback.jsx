import { useState } from "react";

export default function AdminFeedback(){

  const [feedbacks, setFeedbacks] = useState([
    {id:1, name:"Kamal", msg:"Great hotel!", status:"pending"},
    {id:2, name:"Nimal", msg:"Very clean rooms", status:"pending"}
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Delete feedback
  function deleteFeedback(id){
    setFeedbacks(feedbacks.filter(f => f.id !== id));
  }

  // Accept feedback
  function acceptFeedback(id){
    setFeedbacks(feedbacks.map(f => f.id === id ? {...f, status:"accepted"} : f));
  }

  // Reject feedback
  function rejectFeedback(id){
    setFeedbacks(feedbacks.map(f => f.id === id ? {...f, status:"rejected"} : f));
  }

  // View feedback
  function viewFeedback(f){
    setSelectedFeedback(f);
  }

  // Badge color based on status
  function statusColor(status){
    if(status === "accepted") return "bg-green-500";
    if(status === "rejected") return "bg-red-500";
    return "bg-yellow-500"; // pending
  }

  return(
    <div>
      <h1 className="text-2xl font-bold mb-5 text-[#3E160C]">Feedback</h1>

      <div className="space-y-3">
        {feedbacks.map((f)=>(
          <div key={f.id} className="bg-white p-4 rounded shadow flex justify-between items-center">

            <div>
              <h3 className="font-bold">{f.name}</h3>
              <p>{f.msg.length > 30 ? f.msg.slice(0,30)+"..." : f.msg}</p>
              <span className={`text-white px-2 py-1 rounded ${statusColor(f.status)}`}>
                {f.status.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={()=> viewFeedback(f)} 
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>

              <button 
                onClick={()=> acceptFeedback(f.id)} 
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>

              <button 
                onClick={()=> rejectFeedback(f.id)} 
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

              <button 
                onClick={()=> deleteFeedback(f.id)} 
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-2">{selectedFeedback.name}</h2>
            <p>{selectedFeedback.msg}</p>
            <span className={`text-white px-2 py-1 rounded ${statusColor(selectedFeedback.status)}`}>
              {selectedFeedback.status.toUpperCase()}
            </span>
            <button 
              onClick={()=> setSelectedFeedback(null)} 
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}