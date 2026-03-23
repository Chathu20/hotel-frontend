import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;
export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) { window.location.href = "/login"; return; }
    Promise.allSettled([
      axios.get(`${API}/api/users`,    {headers:{Authorization:`Bearer ${token}`}}),
      axios.get(`${API}/api/bookings`, {headers:{Authorization:`Bearer ${token}`}}),
    ]).then(([u,b]) => {
      if(u.status==="fulfilled") setUser(u.value.data.user);
      if(b.status==="fulfilled") setBookings(b.value.data.result||[]);
      setLoading(false);
    });
  }, []);
  const STATUS = {pending:"#d97706",confirmed:"#16a34a",cancelled:"#dc2626"};
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "-";
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500&display=swap');
        .pf{font-family:'Jost',sans-serif;background:#faf8f5;min-height:100vh;}
        .pf-hero{height:45vh;min-height:260px;background:linear-gradient(160deg,#0a0f2e,#1a2050);display:flex;flex-direction:column;justify-content:flex-end;padding:0 64px 48px;}
        @media(max-width:768px){.pf-hero{padding:0 24px 36px;}}
        .pf-lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a96e;font-weight:600;margin-bottom:10px;}
        .pf-name{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,48px);font-weight:600;color:#e8d9c4;margin:0;}
        .pf-body{max-width:1000px;margin:0 auto;padding:56px 48px;}
        @media(max-width:768px){.pf-body{padding:36px 24px;}}
        .pf-grid{display:grid;grid-template-columns:1fr 2fr;gap:32px;align-items:start;}
        @media(max-width:768px){.pf-grid{grid-template-columns:1fr;}}
        .pf-card{background:#fff;border-radius:12px;padding:26px;box-shadow:0 2px 16px rgba(0,0,0,.07);}
        .pf-av{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#c9a96e,#785D32);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#fff;margin-bottom:12px;}
        .pf-fullname{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#0a0f2e;margin:0 0 3px;}
        .pf-email{font-size:13px;color:#8a9aab;margin:0 0 14px;}
        .pf-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
        .pf-badge{font-size:10px;letter-spacing:.8px;text-transform:uppercase;font-weight:600;padding:3px 9px;border-radius:20px;}
        .pf-div{height:1px;background:#f0ebe4;margin:12px 0;}
        .pf-row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;}
        .pf-rl{color:#aaa;} .pf-rv{color:#1a1a2e;font-weight:500;}
        .pf-out{width:100%;background:transparent;border:1.5px solid #e8e0d8;color:#8a9aab;padding:10px;border-radius:6px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;font-family:'Jost',sans-serif;margin-top:16px;transition:all .2s;}
        .pf-out:hover{border-color:#f87171;color:#f87171;}
        .pf-bk-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#0a0f2e;margin:0 0 16px;}
        .pf-bk{background:#fff;border-radius:10px;padding:14px 18px;margin-bottom:10px;box-shadow:0 1px 8px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
        .pf-bk-id{font-size:13px;font-weight:600;color:#785D32;}
        .pf-bk-room{font-size:13px;color:#0a0f2e;}
        .pf-bk-date{font-size:12px;color:#aaa;}
        .pf-bk-stat{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;padding:3px 10px;border-radius:20px;}
      `}</style>
      <div className="pf">
        <div className="pf-hero"><p className="pf-lbl">My Account</p><h1 className="pf-name">{loading?"Loading…":user?`${user.firstName} ${user.lastName}`:"Guest"}</h1></div>
        <div className="pf-body">
          {loading ? <p style={{color:"#aaa",textAlign:"center"}}>Loading profile…</p>
           : user ? (
            <div className="pf-grid">
              <div className="pf-card">
                <div className="pf-av">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                <div className="pf-fullname">{user.firstName} {user.lastName}</div>
                <div className="pf-email">{user.email}</div>
                <div className="pf-badges">
                  <span className="pf-badge" style={{background:"#f0e8ff",color:"#7c3aed"}}>{user.type}</span>
                  <span className="pf-badge" style={{background:user.emailVerified?"#d1fae5":"#fef3c7",color:user.emailVerified?"#065f46":"#92400e"}}>{user.emailVerified?"Verified":"Not Verified"}</span>
                </div>
                <div className="pf-div"/>
                {[["Phone",user.phone],["WhatsApp",user.whatsApp]].map(([l,v])=>(
                  <div key={l} className="pf-row"><span className="pf-rl">{l}</span><span className="pf-rv">{v||"—"}</span></div>
                ))}
                <button className="pf-out" onClick={()=>{localStorage.removeItem("token");toast.success("Logged out");window.location.href="/login";}}>Logout</button>
              </div>
              <div>
                <div className="pf-bk-title">My Bookings ({bookings.length})</div>
                {bookings.length===0
                  ? <p style={{color:"#aaa",fontSize:14}}>No bookings yet. <Link to="/rooms" style={{color:"#c9a96e"}}>Browse rooms →</Link></p>
                  : bookings.map((b)=>(
                    <div key={b._id} className="pf-bk">
                      <div><div className="pf-bk-id">Booking #{b.bookingId}</div><div className="pf-bk-room">Room {b.roomId}</div><div className="pf-bk-date">{fmt(b.start)} — {fmt(b.end)}</div></div>
                      <span className="pf-bk-stat" style={{background:(STATUS[b.status]||"#888")+"22",color:STATUS[b.status]||"#888"}}>{b.status}</span>
                    </div>
                  ))
                }
              </div>
            </div>
           ) : <div style={{textAlign:"center",paddingTop:40}}><p style={{color:"#aaa"}}>Could not load profile.</p><Link to="/login" style={{color:"#c9a96e"}}>Login again →</Link></div>
          }
        </div>
      </div>
    </>
  );
}