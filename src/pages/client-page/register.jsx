import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;
export default function Register() {
  const [form, setForm] = useState({firstName:"",lastName:"",email:"",password:"",phone:"",whatsApp:""});
  const [loading, setLoading] = useState(false);
  function onChange(e) { setForm({...form,[e.target.name]:e.target.value}); }
  function handleSubmit() {
    if(!form.firstName||!form.lastName||!form.email||!form.password||!form.phone||!form.whatsApp){toast.error("All fields are required.");return;}
    setLoading(true);
    axios.post(`${API}/api/users`,form)
      .then(()=>{toast.success("Account created! Please login.");setForm({firstName:"",lastName:"",email:"",password:"",phone:"",whatsApp:""}); })
      .catch((e)=>toast.error(e.response?.data?.message||"Registration failed."))
      .finally(()=>setLoading(false));
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
        .rg{font-family:'Jost',sans-serif;background:#faf8f5;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:96px 24px 60px;}
        .rg-card{background:#fff;border-radius:14px;box-shadow:0 4px 40px rgba(0,0,0,.1);width:100%;max-width:500px;overflow:hidden;}
        .rg-top{background:linear-gradient(135deg,#0a0f2e,#1a2050);padding:30px 36px;}
        .rg-top h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#e8d9c4;margin:0 0 5px;}
        .rg-top p{font-size:13px;color:rgba(255,255,255,.4);margin:0;}
        .rg-body{padding:30px 36px;}
        .rg-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        @media(max-width:480px){.rg-row{grid-template-columns:1fr;}}
        .rg-f{margin-bottom:14px;}
        .rg-f label{display:block;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:5px;}
        .rg-f input{width:100%;border:1px solid #e8e0d8;border-radius:6px;padding:11px 13px;font-size:14px;font-family:'Jost',sans-serif;color:#1a1a2e;outline:none;transition:border .2s;background:#faf8f5;}
        .rg-f input:focus{border-color:#c9a96e;background:#fff;}
        .rg-btn{width:100%;background:linear-gradient(135deg,#c9a96e,#785D32);color:#fff;border:none;padding:13px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:'Jost',sans-serif;margin-top:4px;transition:opacity .2s;}
        .rg-btn:hover{opacity:.88;} .rg-btn:disabled{opacity:.5;cursor:not-allowed;}
        .rg-foot{text-align:center;margin-top:14px;font-size:13px;color:#8a9aab;}
        .rg-foot a{color:#c9a96e;text-decoration:none;font-weight:500;}
      `}</style>
      <div className="rg"><div className="rg-card">
        <div className="rg-top"><h2>Create Account</h2><p>Join Aurora Haven Hotel and unlock exclusive benefits</p></div>
        <div className="rg-body">
          <div className="rg-row">
            <div className="rg-f"><label>First Name *</label><input name="firstName" placeholder="Kamal" value={form.firstName} onChange={onChange}/></div>
            <div className="rg-f"><label>Last Name *</label><input name="lastName" placeholder="Perera" value={form.lastName} onChange={onChange}/></div>
          </div>
          <div className="rg-f"><label>Email *</label><input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange}/></div>
          <div className="rg-f"><label>Password *</label><input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={onChange}/></div>
          <div className="rg-row">
            <div className="rg-f"><label>Phone *</label><input name="phone" placeholder="+94 77 ..." value={form.phone} onChange={onChange}/></div>
            <div className="rg-f"><label>WhatsApp *</label><input name="whatsApp" placeholder="+94 77 ..." value={form.whatsApp} onChange={onChange}/></div>
          </div>
          <button className="rg-btn" onClick={handleSubmit} disabled={loading}>{loading?"Creating account…":"Create Account"}</button>
          <div className="rg-foot">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div></div>
    </>
  );
}