import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_BACKEND_URL;
export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(null);
  useEffect(() => {
    axios.get(`${API}/api/gallery`).then((r)=>setItems(r.data.list||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500&display=swap');
        .gl{font-family:'Jost',sans-serif;background:#faf8f5;min-height:100vh;}
        .gl-hero{height:55vh;min-height:320px;background:linear-gradient(160deg,#0a0f2e,#1a1440);display:flex;flex-direction:column;justify-content:flex-end;padding:0 64px 56px;}
        @media(max-width:768px){.gl-hero{padding:0 24px 40px;}}
        .gl-lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a96e;font-weight:600;margin-bottom:12px;}
        .gl-title{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,5vw,60px);font-weight:600;color:#e8d9c4;margin:0;}
        .gl-title em{font-style:italic;color:#c9a96e;}
        .gl-body{max-width:1200px;margin:0 auto;padding:72px 48px;}
        @media(max-width:768px){.gl-body{padding:48px 24px;}}
        .gl-mason{columns:3 250px;gap:12px;}
        @media(max-width:640px){.gl-mason{columns:2 130px;}}
        .gl-item{break-inside:avoid;margin-bottom:12px;border-radius:10px;overflow:hidden;cursor:pointer;position:relative;display:block;}
        .gl-item img{width:100%;display:block;transition:transform .4s;}
        .gl-item:hover img{transform:scale(1.05);}
        .gl-ov{position:absolute;inset:0;background:rgba(10,15,46,0);transition:background .3s;display:flex;flex-direction:column;justify-content:flex-end;padding:14px;}
        .gl-item:hover .gl-ov{background:rgba(10,15,46,.5);}
        .gl-iname{color:#fff;font-size:14px;font-weight:500;opacity:0;transform:translateY(6px);transition:all .3s;}
        .gl-item:hover .gl-iname{opacity:1;transform:none;}
        .gl-empty{text-align:center;padding:80px 24px;color:#bbb;font-size:15px;}
        .gl-spinner{width:40px;height:40px;border-radius:50%;border:3px solid #f0ebe4;border-top-color:#c9a96e;animation:sp .7s linear infinite;margin:0 auto 12px;}
        @keyframes sp{to{transform:rotate(360deg);}}
        .gl-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
        .gl-modal{background:#fff;border-radius:14px;overflow:hidden;max-width:700px;width:100%;}
        .gl-modal img{width:100%;max-height:420px;object-fit:cover;display:block;}
        .gl-modal-body{padding:22px 26px;}
        .gl-modal-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#0a0f2e;margin:0 0 6px;}
        .gl-modal-desc{font-size:13.5px;color:#6a7585;line-height:1.7;margin:0 0 18px;}
        .gl-modal-close{border:1.5px solid #c9a96e;color:#785D32;background:transparent;padding:8px 22px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-family:'Jost',sans-serif;transition:all .2s;}
        .gl-modal-close:hover{background:#c9a96e;color:#fff;}
      `}</style>
      <div className="gl">
        <div className="gl-hero"><p className="gl-lbl">Gallery</p><h1 className="gl-title">Life at <em>Leonine</em></h1></div>
        <div className="gl-body">
          {loading ? <div className="gl-empty"><div className="gl-spinner"/><p>Loading gallery…</p></div>
           : items.length===0 ? <div className="gl-empty">No gallery items yet.</div>
           : <div className="gl-mason">{items.map((item)=>(<div key={item._id} className="gl-item" onClick={()=>setView(item)}><img src={item.image} alt={item.name} onError={(e)=>{e.target.src="https://via.placeholder.com/400x300?text=Photo";}}/><div className="gl-ov"><div className="gl-iname">{item.name}</div></div></div>))}</div>
          }
        </div>
      </div>
      {view&&(<div className="gl-modal-bg" onClick={()=>setView(null)}><div className="gl-modal" onClick={(e)=>e.stopPropagation()}><img src={view.image} alt={view.name}/><div className="gl-modal-body"><h2 className="gl-modal-title">{view.name}</h2><p className="gl-modal-desc">{view.description}</p><button className="gl-modal-close" onClick={()=>setView(null)}>Close</button></div></div></div>)}
    </>
  );
}