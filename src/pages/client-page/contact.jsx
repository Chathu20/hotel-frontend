import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  function handleSubmit() {
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all required fields."); return; }
    toast.success("Message sent! We'll be in touch soon.");
    setForm({ name:"", email:"", phone:"", message:"" });
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap');
        .ct{font-family:'Jost',sans-serif;background:#faf8f5;}
        .ct-hero{height:50vh;min-height:300px;background:linear-gradient(160deg,#0a0f2e 0%,#1e1440 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:0 64px 56px;}
        @media(max-width:768px){.ct-hero{padding:0 24px 40px;}}
        .ct-lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c9a96e;font-weight:600;margin-bottom:12px;}
        .ct-title{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,5vw,60px);font-weight:600;color:#e8d9c4;line-height:1.1;margin:0;}
        .ct-title em{font-style:italic;color:#c9a96e;}
        .ct-body{max-width:1100px;margin:0 auto;padding:72px 48px;display:grid;grid-template-columns:1fr 1.4fr;gap:56px;align-items:start;}
        @media(max-width:900px){.ct-body{grid-template-columns:1fr;gap:36px;padding:52px 24px;}}
        .ct-info-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#0a0f2e;margin:0 0 22px;}
        .ct-item{display:flex;align-items:flex-start;gap:14px;margin-bottom:20px;}
        .ct-icon{width:38px;height:38px;border-radius:8px;background:#f5f0e8;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
        .ct-ilbl{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#aaa;font-weight:600;margin-bottom:3px;}
        .ct-ival{font-size:13.5px;color:#4a5568;line-height:1.6;}
        .ct-card{background:#fff;border-radius:14px;padding:36px;box-shadow:0 4px 32px rgba(0,0,0,.08);}
        .ct-card-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#0a0f2e;margin:0 0 22px;}
        .ct-field{margin-bottom:15px;}
        .ct-field label{display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:5px;}
        .ct-field input,.ct-field textarea{width:100%;border:1px solid #e8e0d8;border-radius:6px;padding:11px 14px;font-size:14px;font-family:'Jost',sans-serif;color:#1a1a2e;outline:none;transition:border .2s;background:#faf8f5;}
        .ct-field input:focus,.ct-field textarea:focus{border-color:#c9a96e;background:#fff;}
        .ct-field textarea{resize:none;}
        .ct-submit{width:100%;background:linear-gradient(135deg,#c9a96e,#785D32);color:#fff;border:none;padding:13px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:'Jost',sans-serif;transition:opacity .2s;}
        .ct-submit:hover{opacity:.88;}
      `}</style>
      <div className="ct">
        <div className="ct-hero">
          <p className="ct-lbl">Get In Touch</p>
          <h1 className="ct-title">We'd Love to <em>Hear From You</em></h1>
        </div>
        <div className="ct-body">
          <div>
            <h2 className="ct-info-title">Contact Information</h2>
            {[
              {icon:"📍",lbl:"Address",val:"123 Luxury Lane, Paradise City, Sri Lanka"},
              {icon:"📞",lbl:"Phone",  val:"+94 11 234 5678"},
              {icon:"✉️",lbl:"Email",  val:"info@leoninehotel.com"},
              {icon:"🕐",lbl:"Hours",  val:"Reception open 24 hours, 7 days a week"},
            ].map((i)=>(
              <div key={i.lbl} className="ct-item">
                <div className="ct-icon">{i.icon}</div>
                <div><div className="ct-ilbl">{i.lbl}</div><div className="ct-ival">{i.val}</div></div>
              </div>
            ))}
          </div>
          <div className="ct-card">
            <h3 className="ct-card-title">Send a Message</h3>
            <div className="ct-field"><label>Your Name *</label><input placeholder="e.g. Kamal Perera" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
            <div className="ct-field"><label>Email *</label><input type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div>
            <div className="ct-field"><label>Phone</label><input placeholder="+94 77 123 4567" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} /></div>
            <div className="ct-field"><label>Message *</label><textarea rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} /></div>
            <button className="ct-submit" onClick={handleSubmit}>Send Message</button>
          </div>
        </div>
      </div>
    </>
  );
}