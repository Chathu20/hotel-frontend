import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const API = import.meta.env.VITE_BACKEND_URL;
const STARS = [1,2,3,4,5];
export default function FeedbackPage() {
  const token = localStorage.getItem("token");
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({message:"",rating:5});
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  useEffect(()=>{
    axios.get(`${API}/api/feedback/approved`).then((r)=>setApproved(r.data.feedbacks||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  function handleSubmit(){
    if(!form.message.trim()){toast.error("Please write a message.");return;}
    if(!token){toast.error("Please login to submit feedback.");return;}
    setSubmitting(true);
    axios.post(`${API}/api/feedback`,form,{headers:{Authorization:`Bearer ${token}`}})
      .then(()=>{toast.success("Feedback submitted! It will appear after admin review.");setForm({message:"",rating:5});})
      .catch(()=>toast.error("Submission failed.")).finally(()=>setSubmitting(false));
  }
  const avg = approved.length?(approved.reduce((s,f)=>s+(f.rating||5),0)/approved.length).toFixed(1):"5.0";
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap');
        .fb{font-family:'Jost',sans-serif;background:#faf8f5;min-height:100vh;}
        .fb-hero{height:52vh;min-height:300px;background:linear-gradient(160deg,#0a0f2e,#1e1440);display:flex;flex-direction:column;justify-content:flex-end;padding:0 64px 56px;}
        @media(max-width:768px){.fb-hero{padding:0 24px 40px;}}
        .fb-lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a96e;font-weight:600;margin-bottom:12px;}
        .fb-title{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,5vw,60px);font-weight:600;color:#e8d9c4;margin:0;}
        .fb-title em{font-style:italic;color:#c9a96e;}
        .fb-body{max-width:1100px;margin:0 auto;padding:72px 48px;}
        @media(max-width:768px){.fb-body{padding:52px 24px;}}
        .fb-layout{display:grid;grid-template-columns:1fr 1.5fr;gap:56px;margin-bottom:72px;}
        @media(max-width:900px){.fb-layout{grid-template-columns:1fr;gap:36px;}}
        .fb-form-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#0a0f2e;margin:0 0 18px;}
        .fb-stars{display:flex;gap:8px;margin-bottom:18px;}
        .fb-star{font-size:28px;cursor:pointer;transition:transform .15s;color:#ddd;line-height:1;user-select:none;}
        .fb-star.lit{color:#c9a96e;} .fb-star:hover{transform:scale(1.2);}
        .fb-ta{width:100%;border:1px solid #e8e0d8;border-radius:8px;padding:13px 15px;font-size:14px;font-family:'Jost',sans-serif;color:#1a1a2e;resize:none;outline:none;background:#faf8f5;transition:border .2s;line-height:1.7;}
        .fb-ta:focus{border-color:#c9a96e;background:#fff;}
        .fb-submit{background:linear-gradient(135deg,#c9a96e,#785D32);color:#fff;border:none;padding:13px 32px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:'Jost',sans-serif;margin-top:12px;transition:opacity .2s;}
        .fb-submit:hover{opacity:.88;} .fb-submit:disabled{opacity:.5;cursor:not-allowed;}
        .fb-note{font-size:12px;color:#c9a96e;margin-top:8px;}
        .fb-info{background:linear-gradient(135deg,#0a0f2e,#1a2050);border-radius:14px;padding:34px;}
        .fb-info h3{font-family:'Cormorant Garamond',serif;font-size:22px;color:#e8d9c4;margin:0 0 10px;}
        .fb-info p{font-size:13.5px;color:rgba(255,255,255,.4);line-height:1.75;margin:0 0 22px;}
        .fb-stat{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:13px;}
        .fb-stat:last-child{border:none;} .fb-stat span{color:rgba(255,255,255,.4);} .fb-stat strong{color:#c9a96e;}
        .fb-revs-title{font-family:'Cormorant Garamond',serif;font-size:clamp(24px,3vw,36px);font-weight:600;color:#0a0f2e;margin:0 0 24px;}
        .fb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
        .fb-card{background:#fff;border-radius:12px;padding:22px;box-shadow:0 2px 16px rgba(0,0,0,.06);border:1px solid #f0ebe4;transition:transform .3s;}
        .fb-card:hover{transform:translateY(-4px);}
        .fb-card-stars{color:#c9a96e;font-size:13px;margin-bottom:10px;letter-spacing:2px;}
        .fb-card-msg{font-size:14px;color:#5a6478;line-height:1.75;margin-bottom:16px;font-style:italic;}
        .fb-card-auth{display:flex;align-items:center;gap:10px;}
        .fb-card-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#c9a96e,#785D32);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}
        .fb-card-name{font-size:14px;font-weight:500;color:#0a0f2e;}
        .fb-card-date{font-size:11px;color:#aab;}
      `}</style>
      <div className="fb">
        <div className="fb-hero"><p className="fb-lbl">Guest Experiences</p><h1 className="fb-title">Share Your <em>Story</em></h1></div>
        <div className="fb-body">
          <div className="fb-layout">
            <div>
              <h2 className="fb-form-title">Leave a Review</h2>
              <div className="fb-stars">{STARS.map((s)=>(<span key={s} className={`fb-star${s<=(hover||form.rating)?" lit":""}`} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>setForm({...form,rating:s})}>★</span>))}<span style={{fontSize:12,color:"#aaa",alignSelf:"center",marginLeft:4}}>{form.rating}/5</span></div>
              <textarea className="fb-ta" rows={6} placeholder="Tell us about your stay…" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})}/>
              <button className="fb-submit" onClick={handleSubmit} disabled={submitting}>{submitting?"Submitting…":"Submit Review"}</button>
              {!token&&<p className="fb-note">⚠ You need to be logged in to submit a review.</p>}
            </div>
            <div className="fb-info">
              <h3>Why Your Feedback Matters</h3>
              <p>Your honest review helps us continuously elevate the Leonine Villa experience.</p>
              <div className="fb-stat"><span>Total Reviews</span><strong>{approved.length}+</strong></div>
              <div className="fb-stat"><span>Average Rating</span><strong>{avg} ★</strong></div>
              <div className="fb-stat"><span>Response Time</span><strong>Within 24 hrs</strong></div>
            </div>
          </div>
          <h2 className="fb-revs-title">What Our Guests Say</h2>
          {loading?<p style={{color:"#aaa",textAlign:"center",padding:"40px 0"}}>Loading reviews…</p>
           :approved.length===0?<p style={{color:"#aaa",textAlign:"center",padding:"40px 0"}}>No reviews yet. Be the first!</p>
           :<div className="fb-grid">{approved.map((f)=>(<div key={f._id} className="fb-card"><div className="fb-card-stars">{STARS.map((s)=>s<=(f.rating||5)?"★":"☆").join("")}</div><p className="fb-card-msg">"{f.message}"</p><div className="fb-card-auth"><div className="fb-card-av">{f.name?.[0]?.toUpperCase()}</div><div><div className="fb-card-name">{f.name}</div><div className="fb-card-date">{f.createdAt?new Date(f.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"}):""}</div></div></div></div>))}</div>
          }
        </div>
      </div>
    </>
  );
}