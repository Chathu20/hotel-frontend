import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const API   = import.meta.env.VITE_BACKEND_URL;
const STARS = [1, 2, 3, 4, 5];

export default function FeedbackPage() {
  const token = localStorage.getItem("token");

  const [approved,   setApproved]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [message,    setMessage]    = useState("");
  const [rating,     setRating]     = useState(5);
  const [hover,      setHover]      = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  // GET /api/feedback/approved  (public)
  useEffect(() => {
    axios.get(`${API}/api/feedback/approved`)
      .then((r) => setApproved(r.data.feedbacks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // POST /api/feedback  (requires token)
  function handleSubmit() {
    if (!message.trim()) { toast.error("Please write your review message."); return; }
    if (!token)          { toast.error("You must be logged in to submit a review."); return; }

    setSubmitting(true);
    axios.post(
      `${API}/api/feedback`,
      { message: message.trim(), rating },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      toast.success(res.data.message || "Review submitted!");
      setMessage(""); setRating(5); setSubmitted(true);
    })
    .catch((err) => toast.error(err.response?.data?.message || "Submission failed."))
    .finally(() => setSubmitting(false));
  }

  const avgRating = approved.length
    ? (approved.reduce((s, f) => s + (f.rating || 5), 0) / approved.length).toFixed(1)
    : "5.0";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap');
        .fb { font-family:'Jost',sans-serif; background:#faf8f5; min-height:100vh; }
        .fb-hero { height:52vh; min-height:300px; background:linear-gradient(160deg,#0a0f2e 0%,#1e1440 100%); display:flex; flex-direction:column; justify-content:flex-end; padding:0 64px 56px; position:relative; overflow:hidden; }
        .fb-hero::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(201,169,110,.1),transparent 70%); }
        @media(max-width:768px){ .fb-hero { padding:0 24px 40px; } }
        .fb-lbl { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#c9a96e; font-weight:600; margin-bottom:12px; position:relative; z-index:1; }
        .fb-h1  { font-family:'Cormorant Garamond',serif; font-size:clamp(34px,5vw,60px); font-weight:600; color:#e8d9c4; margin:0; position:relative; z-index:1; }
        .fb-h1 em { font-style:italic; color:#c9a96e; }
        .fb-body { max-width:1100px; margin:0 auto; padding:72px 48px; }
        @media(max-width:768px){ .fb-body { padding:48px 24px; } }
        .fb-layout { display:grid; grid-template-columns:1fr 1.4fr; gap:56px; margin-bottom:72px; }
        @media(max-width:900px){ .fb-layout { grid-template-columns:1fr; gap:36px; } }
        .fb-form-title { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:#0a0f2e; margin:0 0 20px; }
        .fb-stars { display:flex; gap:8px; margin-bottom:20px; align-items:center; }
        .fb-star  { font-size:30px; cursor:pointer; transition:transform .15s; color:#ddd; line-height:1; user-select:none; }
        .fb-star.lit   { color:#c9a96e; }
        .fb-star:hover { transform:scale(1.2); }
        .fb-rating-lbl { font-size:12px; color:#aaa; margin-left:6px; }
        .fb-ta { width:100%; border:1.5px solid #e8e0d8; border-radius:8px; padding:14px 16px; font-size:14px; font-family:'Jost',sans-serif; color:#1a1a2e; resize:none; outline:none; background:#faf8f5; transition:border .2s; line-height:1.75; }
        .fb-ta:focus { border-color:#c9a96e; background:#fff; }
        .fb-submit { background:linear-gradient(135deg,#c9a96e,#785D32); color:#fff; border:none; padding:13px 36px; border-radius:6px; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; margin-top:14px; transition:opacity .2s; }
        .fb-submit:hover    { opacity:.88; }
        .fb-submit:disabled { opacity:.45; cursor:not-allowed; }
        .fb-auth-note { margin-top:16px; padding:14px 18px; background:#fff8ee; border:1px solid rgba(201,169,110,.4); border-radius:8px; font-size:13px; color:#785D32; }
        .fb-auth-note a { color:#785D32; font-weight:600; text-decoration:underline; }
        .fb-success { margin-top:16px; padding:14px 18px; background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; font-size:14px; color:#15803d; display:flex; align-items:center; gap:10px; }
        .fb-info { background:linear-gradient(135deg,#0a0f2e,#1a2050); border-radius:14px; padding:36px; }
        .fb-info h3 { font-family:'Cormorant Garamond',serif; font-size:22px; color:#e8d9c4; margin:0 0 12px; }
        .fb-info p  { font-size:13.5px; color:rgba(255,255,255,.4); line-height:1.75; margin:0 0 24px; }
        .fb-stat { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.07); font-size:13px; }
        .fb-stat:last-child { border:none; }
        .fb-stat span   { color:rgba(255,255,255,.4); }
        .fb-stat strong { color:#c9a96e; }
        .fb-revs-hdr   { display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:12px; margin-bottom:28px; }
        .fb-revs-title { font-family:'Cormorant Garamond',serif; font-size:clamp(24px,3vw,36px); font-weight:600; color:#0a0f2e; margin:0; }
        .fb-revs-count { font-size:13px; color:#aaa; }
        .fb-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:20px; }
        .fb-card { background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 16px rgba(0,0,0,.06); border:1px solid #f0ebe4; transition:transform .3s; }
        .fb-card:hover { transform:translateY(-4px); }
        .fb-card-stars { color:#c9a96e; font-size:14px; margin-bottom:12px; letter-spacing:2px; }
        .fb-card-msg   { font-size:14px; color:#5a6478; line-height:1.78; margin-bottom:18px; font-style:italic; }
        .fb-card-auth  { display:flex; align-items:center; gap:10px; }
        .fb-card-av    { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#c9a96e,#785D32); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
        .fb-card-name  { font-size:14px; font-weight:500; color:#0a0f2e; }
        .fb-card-date  { font-size:11px; color:#bbb; }
        .fb-empty { text-align:center; padding:60px 24px; color:#bbb; font-size:15px; }
      `}</style>

      <div className="fb">
        <div className="fb-hero">
          <p className="fb-lbl">Guest Experiences</p>
          <h1 className="fb-h1">Share Your <em>Story</em></h1>
        </div>

        <div className="fb-body">
          <div className="fb-layout">

            {/* ── Submit form ── */}
            <div>
              <h2 className="fb-form-title">Leave a Review</h2>

              {/* Star rating picker */}
              <div className="fb-stars">
                {STARS.map((s) => (
                  <span
                    key={s}
                    className={`fb-star${s <= (hover || rating) ? " lit" : ""}`}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                  >★</span>
                ))}
                <span className="fb-rating-lbl">{rating} / 5</span>
              </div>

              {/* Message */}
              <textarea
                className="fb-ta"
                rows={6}
                placeholder="Tell us about your stay at Leonine Villa…"
                value={message}
                onChange={(e) => { setMessage(e.target.value); setSubmitted(false); }}
              />

              {/* Submit or login prompt */}
              {token ? (
                <button className="fb-submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Review"}
                </button>
              ) : (
                <div className="fb-auth-note">
                  ⚠ You need to be <Link to="/login">logged in</Link> to submit a review.
                  Don't have an account? <Link to="/register">Register here</Link>.
                </div>
              )}

              {/* Success banner */}
              {submitted && (
                <div className="fb-success">
                  <span>✅</span>
                  <span>Thank you! Your review has been submitted and will appear after admin approval.</span>
                </div>
              )}
            </div>

            {/* ── Info box ── */}
            <div className="fb-info">
              <h3>Why Your Feedback Matters</h3>
              <p>Your honest review helps us continuously elevate the Leonine Villa experience for every guest.</p>
              <div className="fb-stat"><span>Total Reviews</span>    <strong>{approved.length}</strong></div>
              <div className="fb-stat"><span>Average Rating</span>   <strong>{avgRating} ★</strong></div>
              <div className="fb-stat"><span>Response Time</span>    <strong>Within 24 hrs</strong></div>
              <div className="fb-stat"><span>Verified Reviews</span> <strong>100%</strong></div>
            </div>
          </div>

          {/* ── Reviews grid — GET /api/feedback/approved ── */}
          <div className="fb-revs-hdr">
            <h2 className="fb-revs-title">What Our Guests Say</h2>
            {approved.length > 0 && (
              <span className="fb-revs-count">
                {approved.length} verified review{approved.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div className="fb-empty">Loading reviews…</div>
          ) : approved.length === 0 ? (
            <div className="fb-empty">No reviews yet — be the first to share your experience!</div>
          ) : (
            <div className="fb-grid">
              {approved.map((f) => (
                <div key={f._id} className="fb-card">
                  <div className="fb-card-stars">
                    {STARS.map((s) => s <= (f.rating || 5) ? "★" : "☆").join("")}
                  </div>
                  <p className="fb-card-msg">"{f.message}"</p>
                  <div className="fb-card-auth">
                    <div className="fb-card-av">{f.name?.[0]?.toUpperCase() || "G"}</div>
                    <div>
                      <div className="fb-card-name">{f.name}</div>
                      <div className="fb-card-date">
                        {f.createdAt
                          ? new Date(f.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}