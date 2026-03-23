import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_BACKEND_URL;

export default function RoomSearch() {

  // ── State ─────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");
  const [selected,   setSelected]   = useState("");
  const [booking,    setBooking]    = useState(false);
  const [detail,     setDetail]     = useState(null);   // detail modal
  const token = localStorage.getItem("token");

  // ── GET /api/category ──────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/api/category`)
      .then((r) => setCategories(r.data.categories || []))
      .catch(() => toast.error("Failed to load room categories."))
      .finally(() => setLoading(false));
  }, []);

  // ── POST /api/bookings/create-by-category ─────────────────────────
  function handleBook(categoryName) {
    const cat = categoryName || selected;
    if (!startDate || !endDate) { toast.error("Please choose check-in and check-out dates."); return; }
    if (!cat)                   { toast.error("Please select a room category."); return; }
    if (!token)                 { toast.error("Please login to make a booking."); return; }
    if (new Date(startDate) >= new Date(endDate)) { toast.error("Check-out must be after check-in."); return; }

    setBooking(true);
    axios.post(`${API}/api/bookings/create-by-category`,
      { category: cat, start: startDate, end: endDate },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((r) => {
      toast.success(r.data.message || "Room booked successfully!");
      setStartDate(""); setEndDate(""); setSelected(""); setDetail(null);
    })
    .catch((e) => toast.error(e.response?.data?.message || "Booking failed."))
    .finally(() => setBooking(false));
  }

  // ── Calculated nights ─────────────────────────────────────────────
  const nights =
    startDate && endDate && new Date(endDate) > new Date(startDate)
      ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000)
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

        .rs { font-family: 'Jost', sans-serif; background: #faf8f5; min-height: 100vh; }

        /* Hero */
        .rs-hero {
          height: 56vh; min-height: 340px;
          background: linear-gradient(160deg, #0a0f2e 0%, #1a2050 60%, #2a1810 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 64px 56px; position: relative; overflow: hidden;
        }
        .rs-hero::before {
          content: ''; position: absolute; top: -140px; right: -140px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,.1), transparent 70%);
          pointer-events: none;
        }
        @media(max-width:768px) { .rs-hero { padding: 0 24px 40px; height: 48vh; } }
        .rs-hero-label {
          font-size: 10px; letter-spacing: 3.5px; text-transform: uppercase;
          color: #c9a96e; font-weight: 600; margin-bottom: 12px; position: relative; z-index: 1;
        }
        .rs-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5.5vw, 64px); font-weight: 600;
          color: #e8d9c4; line-height: 1.08; margin: 0 0 12px; position: relative; z-index: 1;
        }
        .rs-hero-title em { font-style: italic; color: #c9a96e; }
        .rs-hero-sub {
          font-size: 14px; color: rgba(255,255,255,.42);
          max-width: 420px; line-height: 1.7; position: relative; z-index: 1;
        }

        /* Booking bar */
        .rs-bar {
          background: #fff; box-shadow: 0 4px 40px rgba(0,0,0,.1);
          display: flex; align-items: stretch; flex-wrap: wrap;
          position: sticky; top: 72px; z-index: 50;
        }
        .rs-bar-field {
          display: flex; flex-direction: column;
          padding: 16px 26px; border-right: 1px solid #f0ebe4; flex: 1; min-width: 130px;
        }
        .rs-bar-field:last-of-type { border-right: none; }
        .rs-bar-field label {
          font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
          color: #bbb; font-weight: 600; margin-bottom: 4px;
        }
        .rs-bar-field input, .rs-bar-field select {
          border: none; outline: none; font-size: 14px;
          color: #1a1a2e; font-family: 'Jost', sans-serif; background: transparent; cursor: pointer;
        }
        .rs-bar-info {
          display: flex; flex-direction: column; justify-content: center;
          padding: 14px 24px; background: #f5f0e8;
          border-right: 1px solid #e8e0d8; min-width: 110px;
        }
        .rs-bar-nights { font-family: 'Cormorant Garamond',serif; font-size: 22px; font-weight: 600; color: #785D32; line-height: 1; }
        .rs-bar-nights-lbl { font-size: 10px; color: #aaa; letter-spacing: .5px; margin-top: 2px; }
        .rs-bar-btn {
          background: linear-gradient(135deg, #c9a96e, #785D32); color: #fff;
          border: none; cursor: pointer; padding: 0 36px;
          font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          font-family: 'Jost',sans-serif; transition: opacity .2s;
          flex-shrink: 0; min-width: 140px; min-height: 70px;
        }
        .rs-bar-btn:hover { opacity: .87; }
        .rs-bar-btn:disabled { opacity: .45; cursor: not-allowed; }

        /* Content area */
        .rs-content { max-width: 1260px; margin: 0 auto; padding: 64px 48px; }
        @media(max-width:768px) { .rs-content { padding: 48px 24px; } }
        .rs-filter-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
        .rs-count { font-size: 13px; color: #8a9aab; }
        .rs-count strong { color: #0a0f2e; font-weight: 600; }

        /* Grid */
        .rs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 24px; }

        /* Card */
        .rs-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 18px rgba(0,0,0,.07); transition: transform .3s, box-shadow .3s; display: flex; flex-direction: column; }
        .rs-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,.12); }
        .rs-card-img-wrap { position: relative; overflow: hidden; }
        .rs-card-img { width:100%; height:210px; object-fit:cover; display:block; transition:transform .5s; }
        .rs-card:hover .rs-card-img { transform: scale(1.04); }
        .rs-card-ph { width:100%; height:210px; background:linear-gradient(135deg,#e8d9c4,#c9a96e); display:flex; align-items:center; justify-content:center; font-size:44px; }
        .rs-card-badge { position:absolute; top:14px; left:14px; background:rgba(10,15,46,.75); color:#c9a96e; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; padding:4px 10px; border-radius:20px; backdrop-filter:blur(4px); }
        .rs-card-body { padding:20px 22px 22px; flex:1; display:flex; flex-direction:column; }
        .rs-card-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#0a0f2e; margin-bottom:6px; }
        .rs-card-desc { font-size:13px; color:#8a9aab; line-height:1.65; margin-bottom:14px; flex:1; }
        .rs-card-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:16px; }
        .rs-card-tag { background:#f5f0e8; color:#785D32; font-size:10px; padding:3px 9px; border-radius:20px; font-weight:500; }
        .rs-card-footer { display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid #f0ebe4; flex-wrap:wrap; gap:10px; }
        .rs-card-price { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:#785D32; }
        .rs-card-price span { font-size:12px; font-weight:400; color:#aaa; font-family:'Jost',sans-serif; }
        .rs-card-total { font-size:11px; color:#aaa; margin-top:2px; }
        .rs-card-actions { display:flex; gap:8px; }
        .rs-btn-detail { border:1.5px solid #e8e0d8; color:#8a9aab; background:transparent; padding:8px 14px; border-radius:4px; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:all .2s; }
        .rs-btn-detail:hover { border-color:#785D32; color:#785D32; }
        .rs-btn-book { background:linear-gradient(135deg,#c9a96e,#785D32); color:#fff; border:none; padding:8px 18px; border-radius:4px; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:opacity .2s; }
        .rs-btn-book:hover { opacity:.88; }
        .rs-btn-book:disabled { opacity:.45; cursor:not-allowed; }

        /* Empty/loading */
        .rs-empty { text-align:center; padding:80px 24px; color:#bbb; font-size:15px; grid-column:1/-1; }
        .rs-spinner { width:40px; height:40px; border-radius:50%; border:3px solid #f0ebe4; border-top-color:#c9a96e; animation:spin .7s linear infinite; margin:0 auto 12px; }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* Detail modal */
        .rs-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.72); display:flex; align-items:center; justify-content:center; z-index:200; padding:20px; }
        .rs-modal { background:#fff; border-radius:16px; overflow:hidden; max-width:680px; width:100%; max-height:90vh; display:flex; flex-direction:column; animation:mIn .25s ease; }
        @keyframes mIn { from{opacity:0;transform:scale(.96) translateY(16px);} to{opacity:1;transform:none;} }
        .rs-modal-img { width:100%; height:280px; object-fit:cover; display:block; flex-shrink:0; }
        .rs-modal-img-ph { width:100%; height:280px; background:linear-gradient(135deg,#e8d9c4,#c9a96e); display:flex; align-items:center; justify-content:center; font-size:56px; flex-shrink:0; }
        .rs-modal-body { padding:28px 32px; overflow-y:auto; flex:1; }
        .rs-modal-name { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:#0a0f2e; margin:0 0 8px; }
        .rs-modal-desc { font-size:14px; color:#6a7585; line-height:1.75; margin-bottom:20px; }
        .rs-modal-feats-lbl { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#aaa; font-weight:600; margin-bottom:10px; }
        .rs-modal-feats { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:24px; }
        .rs-modal-tag { background:#f5f0e8; color:#785D32; font-size:12px; padding:4px 12px; border-radius:20px; font-weight:500; }
        .rs-modal-footer { display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid #f0ebe4; flex-wrap:wrap; gap:12px; }
        .rs-modal-price { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:#785D32; }
        .rs-modal-price span { font-size:14px; font-weight:400; color:#aaa; font-family:'Jost',sans-serif; }
        .rs-modal-total { font-size:12px; color:#aaa; margin-top:2px; }
        .rs-modal-btns { display:flex; gap:10px; }
        .rs-modal-close { border:1.5px solid #e8e0d8; color:#8a9aab; background:transparent; padding:11px 22px; border-radius:6px; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:all .2s; }
        .rs-modal-close:hover { border-color:#785D32; color:#785D32; }
        .rs-modal-book { background:linear-gradient(135deg,#c9a96e,#785D32); color:#fff; border:none; padding:11px 28px; border-radius:6px; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:opacity .2s; }
        .rs-modal-book:hover { opacity:.88; }
        .rs-modal-book:disabled { opacity:.45; cursor:not-allowed; }
        .rs-modal-note { font-size:12px; color:#c9a96e; margin-top:8px; }
      `}</style>

      <div className="rs">

        {/* ─── Hero ─── */}
        <div className="rs-hero">
          <p className="rs-hero-label">Accommodations</p>
          <h1 className="rs-hero-title">Find Your <em>Perfect Room</em></h1>
          <p className="rs-hero-sub">Browse our curated room categories, select your dates, and book instantly.</p>
        </div>

        {/* ─── Sticky Booking Bar ─── */}
        <div className="rs-bar">
          <div className="rs-bar-field">
            <label>Check-in</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="rs-bar-field">
            <label>Check-out</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="rs-bar-field">
            <label>Category</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Any category</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          {nights > 0 && (
            <div className="rs-bar-info">
              <div className="rs-bar-nights">{nights}</div>
              <div className="rs-bar-nights-lbl">night{nights !== 1 ? "s" : ""}</div>
            </div>
          )}
          <button className="rs-bar-btn" onClick={() => handleBook()} disabled={booking}>
            {booking ? "Booking…" : "Book Now"}
          </button>
        </div>

        {/* ─── Cards grid ─── */}
        <div className="rs-content">
          <div className="rs-filter-row">
            <p className="rs-count">
              Showing <strong>{categories.length}</strong> room {categories.length === 1 ? "category" : "categories"}
            </p>
          </div>

          <div className="rs-grid">
            {loading ? (
              <div className="rs-empty">
                <div className="rs-spinner" />
                <p>Loading room categories…</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="rs-empty">No room categories available yet.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat.name} className="rs-card">
                  <div className="rs-card-img-wrap">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="rs-card-img"
                          onError={(e) => { e.target.style.display = "none"; }} />
                      : null
                    }
                    <div className="rs-card-ph" style={{ display: cat.image ? "none" : "flex" }}>🛏</div>
                    <div className="rs-card-badge">{cat.name}</div>
                  </div>
                  <div className="rs-card-body">
                    <div className="rs-card-name">{cat.name}</div>
                    <p className="rs-card-desc">{cat.description}</p>
                    {cat.features?.length > 0 && (
                      <div className="rs-card-tags">
                        {cat.features.slice(0, 5).map((f) => (
                          <span key={f} className="rs-card-tag">{f}</span>
                        ))}
                      </div>
                    )}
                    <div className="rs-card-footer">
                      <div>
                        <div className="rs-card-price">${cat.price}<span>/night</span></div>
                        {nights > 0 && (
                          <div className="rs-card-total">
                            ${(cat.price * nights).toLocaleString()} total · {nights} night{nights !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                      <div className="rs-card-actions">
                        <button className="rs-btn-detail" onClick={() => setDetail(cat)}>Details</button>
                        <button
                          className="rs-btn-book"
                          onClick={() => { setSelected(cat.name); handleBook(cat.name); }}
                          disabled={booking}
                        >
                          {booking ? "…" : "Book"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      {detail && (
        <div className="rs-modal-bg" onClick={() => setDetail(null)}>
          <div className="rs-modal" onClick={(e) => e.stopPropagation()}>
            {detail.image
              ? <img src={detail.image} alt={detail.name} className="rs-modal-img"
                  onError={(e) => { e.target.style.display = "none"; }} />
              : <div className="rs-modal-img-ph">🛏</div>
            }
            <div className="rs-modal-body">
              <h2 className="rs-modal-name">{detail.name}</h2>
              <p className="rs-modal-desc">{detail.description}</p>
              {detail.features?.length > 0 && (
                <>
                  <div className="rs-modal-feats-lbl">Room Features</div>
                  <div className="rs-modal-feats">
                    {detail.features.map((f) => <span key={f} className="rs-modal-tag">{f}</span>)}
                  </div>
                </>
              )}
              <div className="rs-modal-footer">
                <div>
                  <div className="rs-modal-price">${detail.price}<span>/night</span></div>
                  {nights > 0 && (
                    <div className="rs-modal-total">
                      ${(detail.price * nights).toLocaleString()} total · {nights} night{nights !== 1 ? "s" : ""}
                    </div>
                  )}
                  {(!startDate || !endDate) && (
                    <p className="rs-modal-note">⚠ Select dates above to see total price</p>
                  )}
                </div>
                <div className="rs-modal-btns">
                  <button className="rs-modal-close" onClick={() => setDetail(null)}>Close</button>
                  <button
                    className="rs-modal-book"
                    onClick={() => { setSelected(detail.name); handleBook(detail.name); }}
                    disabled={booking}
                  >
                    {booking ? "Booking…" : "Book Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}