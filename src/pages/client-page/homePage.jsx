import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export default function HomePage() {

  // ── State ─────────────────────────────────────────────────────────
  const [categories,       setCategories]       = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate,        setStartDate]        = useState("");
  const [endDate,          setEndDate]          = useState("");
  const [isLoading,        setIsLoading]        = useState(false);
  const [gallery,          setGallery]          = useState([]);
  const [feedbacks,        setFeedbacks]        = useState([]);
  const [lightbox,         setLightbox]         = useState(null);

  // ── Slider config ──────────────────────────────────────────────────
  const sliderSettings = {
    dots: true, infinite: true, speed: 900,
    slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 4000, arrows: false,
  };

  // ── Fetch all data in parallel ─────────────────────────────────────
  useEffect(() => {
    // GET /api/category — populates booking dropdown + category cards
    axios.get(`${API}/api/category`)
      .then((r) => setCategories(r.data.categories || []))
      .catch(() => toast.error("Failed to load categories."));

    // GET /api/gallery — gallery preview strip (max 6)
    axios.get(`${API}/api/gallery`)
      .then((r) => setGallery((r.data.list || []).slice(0, 6)))
      .catch(() => {});

    // GET /api/feedback/approved — public approved reviews (max 3)
    axios.get(`${API}/api/feedback/approved`)
      .then((r) => setFeedbacks((r.data.feedbacks || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  // ── Book Now → POST /api/bookings/create-by-category ────────────
  function handleBooking() {
    const token = localStorage.getItem("token");
    if (!token)                                      { toast.error("Please login to make a booking.");           return; }
    if (!selectedCategory || !startDate || !endDate) { toast.error("Please fill out all fields.");               return; }
    if (new Date(startDate) >= new Date(endDate))    { toast.error("Start date must be earlier than end date."); return; }

    setIsLoading(true);
    axios.post(`${API}/api/bookings/create-by-category`,
      { category: selectedCategory, start: startDate, end: endDate },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => toast.success(res.data.message || "Booking created!"))
    .catch((err) => toast.error(err.response?.data?.message || "Booking failed."))
    .finally(() => setIsLoading(false));
  }

  const STARS = [1, 2, 3, 4, 5];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

        .hp { font-family: 'Jost', sans-serif; background: #faf8f5; }

        /* Hero */
        .hp-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }
        .hp-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(to bottom, rgba(5,10,40,.58) 0%, rgba(5,10,40,.18) 45%, rgba(5,10,40,.72) 100%);
        }
        .hp-hero .slick-slider, .hp-hero .slick-list, .hp-hero .slick-track { height: 100%; }
        .hp-hero .slick-slide > div { height: 100%; }
        .hp-hero img { width: 100%; height: 100vh; object-fit: cover; display: block; }
        .hp-hero .slick-dots { bottom: 28px; z-index: 4; }
        .hp-hero .slick-dots li button:before { color: rgba(255,255,255,.45); font-size: 8px; }
        .hp-hero .slick-dots li.slick-active button:before { color: #c9a96e; }

        .hp-hero-content {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 0 24px;
          animation: hpIn .9s ease both;
        }
        @keyframes hpIn { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:none; } }

        .hp-eyebrow { font-size: 11px; letter-spacing: 3.5px; text-transform: uppercase; color: #c9a96e; font-weight: 500; margin-bottom: 16px; }
        .hp-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(44px,7.5vw,90px); font-weight: 600; color: #fff; line-height: 1.04; margin: 0 0 20px; letter-spacing: -1px; }
        .hp-h1 em { font-style: italic; color: #e8d9c4; }
        .hp-hero-sub { font-size: 15px; color: rgba(255,255,255,.58); font-weight: 300; max-width: 490px; margin: 0 auto 36px; line-height: 1.8; }
        .hp-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        .btn-gold { background: #c9a96e; color: #0a0f2e; padding: 13px 34px; border-radius: 4px; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border: none; cursor: pointer; transition: all .2s; font-family: 'Jost',sans-serif; text-decoration: none; display: inline-block; }
        .btn-gold:hover { background: #e8d9c4; transform: translateY(-2px); }
        .btn-ghost { border: 1px solid rgba(255,255,255,.45); color: rgba(255,255,255,.9); background: transparent; padding: 13px 34px; border-radius: 4px; font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all .2s; font-family: 'Jost',sans-serif; text-decoration: none; display: inline-block; }
        .btn-ghost:hover { border-color: #c9a96e; color: #c9a96e; }

        /* Booking bar */
        .hp-bar { background: #fff; box-shadow: 0 4px 40px rgba(0,0,0,.09); display: flex; align-items: stretch; flex-wrap: wrap; }
        .hp-bar-field { display: flex; flex-direction: column; padding: 18px 28px; border-right: 1px solid #eee; flex: 1; min-width: 140px; }
        .hp-bar-field:last-of-type { border-right: none; }
        .hp-bar-field label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #bbb; font-weight: 600; margin-bottom: 4px; }
        .hp-bar-field input, .hp-bar-field select { border: none; outline: none; font-size: 14px; color: #1a1a2e; font-family: 'Jost',sans-serif; background: transparent; cursor: pointer; }
        .hp-bar-btn { background: linear-gradient(135deg,#c9a96e,#785D32); color: #fff; border: none; cursor: pointer; padding: 0 36px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; font-family: 'Jost',sans-serif; transition: opacity .2s; flex-shrink: 0; min-width: 130px; min-height: 74px; }
        .hp-bar-btn:hover { opacity: .87; }
        .hp-bar-btn:disabled { opacity: .45; cursor: not-allowed; }

        /* Section */
        .hp-sec { padding: 88px 48px; }
        @media(max-width:768px) { .hp-sec { padding: 64px 24px; } }
        .hp-sec-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c9a96e; font-weight: 600; margin-bottom: 10px; }
        .hp-sec-title { font-family: 'Cormorant Garamond',serif; font-size: clamp(28px,4vw,50px); font-weight: 600; color: #0a0f2e; line-height: 1.08; margin: 0 0 12px; letter-spacing: -.5px; }
        .hp-sec-title em { font-style: italic; color: #785D32; }
        .hp-sec-sub { font-size: 15px; color: #7a8398; max-width: 520px; line-height: 1.8; margin: 0; }
        .hp-sec-hdr { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
        .hp-see-all { font-size: 13px; color: #c9a96e; font-weight: 500; text-decoration: none; letter-spacing: .5px; }
        .hp-see-all:hover { text-decoration: underline; }

        /* Features */
        .hp-feats { background: #0a0f2e; padding: 56px 48px; display: grid; grid-template-columns: repeat(4,1fr); gap: 36px; }
        @media(max-width:768px) { .hp-feats { grid-template-columns:1fr 1fr; gap:24px; padding:40px 24px; } }
        @media(max-width:480px) { .hp-feats { grid-template-columns:1fr; } }
        .hp-feat { text-align: center; }
        .hp-feat-icon { font-size: 28px; margin-bottom: 10px; display: block; }
        .hp-feat-name { font-family: 'Cormorant Garamond',serif; font-size: 18px; font-weight: 600; color: #e8d9c4; margin-bottom: 6px; }
        .hp-feat-desc { font-size: 13px; color: rgba(255,255,255,.33); line-height: 1.65; }

        /* Category cards */
        .hp-cats { display: grid; grid-template-columns: repeat(auto-fill,minmax(285px,1fr)); gap: 22px; }
        .hp-cat { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,.07); transition: transform .3s, box-shadow .3s; }
        .hp-cat:hover { transform: translateY(-6px); box-shadow: 0 14px 44px rgba(0,0,0,.12); }
        .hp-cat img { width: 100%; height: 196px; object-fit: cover; display: block; }
        .hp-cat-ph { width: 100%; height: 196px; background: linear-gradient(135deg,#e8d9c4,#c9a96e); display: flex; align-items: center; justify-content: center; font-size: 36px; }
        .hp-cat-body { padding: 18px 20px 22px; }
        .hp-cat-name { font-family: 'Cormorant Garamond',serif; font-size: 22px; font-weight: 600; color: #0a0f2e; margin-bottom: 5px; }
        .hp-cat-desc { font-size: 13px; color: #8a9aab; line-height: 1.6; margin-bottom: 14px; }
        .hp-cat-foot { display: flex; justify-content: space-between; align-items: center; }
        .hp-cat-price { font-family: 'Cormorant Garamond',serif; font-size: 24px; font-weight: 600; color: #785D32; }
        .hp-cat-price span { font-size: 12px; font-weight: 400; color: #aaa; font-family: 'Jost',sans-serif; }
        .hp-cat-sel { border: 1.5px solid #c9a96e; color: #785D32; background: transparent; padding: 7px 16px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: 'Jost',sans-serif; transition: all .2s; }
        .hp-cat-sel.active, .hp-cat-sel:hover { background: #c9a96e; color: #fff; border-color: #c9a96e; }
        .hp-cat-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
        .hp-cat-tag { background: #f5f0e8; color: #785D32; font-size: 10px; padding: 3px 9px; border-radius: 20px; font-weight: 500; }

        /* Gallery */
        .hp-gallery { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        @media(max-width:640px) { .hp-gallery { grid-template-columns: repeat(2,1fr); } }
        .hp-gal-item { aspect-ratio: 1; overflow: hidden; border-radius: 8px; cursor: pointer; position: relative; }
        .hp-gal-item img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
        .hp-gal-item:hover img { transform: scale(1.08); }
        .hp-gal-ov { position: absolute; inset: 0; background: rgba(10,15,46,0); transition: background .3s; display: flex; align-items: flex-end; padding: 10px; }
        .hp-gal-item:hover .hp-gal-ov { background: rgba(10,15,46,.5); }
        .hp-gal-name { color: #fff; font-size: 12px; font-weight: 500; opacity: 0; transform: translateY(6px); transition: all .3s; }
        .hp-gal-item:hover .hp-gal-name { opacity:1; transform:none; }

        /* Lightbox */
        .hp-lb-bg { position: fixed; inset: 0; background: rgba(0,0,0,.86); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px; }
        .hp-lb { background: #fff; border-radius: 14px; overflow: hidden; max-width: 680px; width: 100%; animation: lbIn .25s ease; }
        @keyframes lbIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:none; } }
        .hp-lb img { width:100%; max-height:420px; object-fit:cover; display:block; }
        .hp-lb-body { padding: 22px 26px; }
        .hp-lb-title { font-family: 'Cormorant Garamond',serif; font-size: 22px; font-weight: 600; color: #0a0f2e; margin: 0 0 6px; }
        .hp-lb-desc { font-size: 13.5px; color: #6a7585; line-height: 1.7; margin: 0 0 18px; }
        .hp-lb-close { border: 1.5px solid #c9a96e; color: #785D32; background: transparent; padding: 8px 22px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: 'Jost',sans-serif; transition: all .2s; }
        .hp-lb-close:hover { background: #c9a96e; color: #fff; }

        /* Reviews */
        .hp-reviews { display: grid; grid-template-columns: repeat(auto-fill,minmax(270px,1fr)); gap: 20px; }
        .hp-rev { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 16px rgba(0,0,0,.06); border: 1px solid #f0ebe4; transition: transform .3s; }
        .hp-rev:hover { transform: translateY(-4px); }
        .hp-rev-stars { color: #c9a96e; font-size: 13px; margin-bottom: 12px; letter-spacing: 1px; }
        .hp-rev-msg { font-size: 14px; color: #5a6478; line-height: 1.78; margin-bottom: 18px; font-style: italic; }
        .hp-rev-author { display: flex; align-items: center; gap: 10px; }
        .hp-rev-av { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#c9a96e,#785D32); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .hp-rev-name { font-size: 14px; font-weight: 500; color: #0a0f2e; }
        .hp-rev-date { font-size: 11px; color: #aab; }

        /* CTA band */
        .hp-cta-band { background: linear-gradient(135deg,#0a0f2e,#1a2050); padding: 72px 48px; text-align: center; }
        @media(max-width:768px) { .hp-cta-band { padding: 52px 24px; } }
        .hp-cta-band h2 { font-family: 'Cormorant Garamond',serif; font-size: clamp(26px,4vw,46px); font-weight: 600; color: #e8d9c4; margin: 0 0 14px; }
        .hp-cta-band p { font-size: 15px; color: rgba(255,255,255,.42); max-width: 440px; margin: 0 auto 30px; line-height: 1.75; }
        .hp-cta-band-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .btn-ghost-gold { border: 1px solid rgba(201,169,110,.5); color: #c9a96e; padding: 13px 32px; border-radius: 4px; font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; transition: all .2s; display: inline-block; }
        .btn-ghost-gold:hover { background: rgba(201,169,110,.1); }
      `}</style>

      <div className="hp">

        {/* ── Hero Slider ── */}
        <div className="hp-hero">
          <div className="hp-overlay" />
          <Slider {...sliderSettings}>
            {["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"].map((src, i) => (
              <div key={i}><img src={src} alt={`Slide ${i + 1}`} /></div>
            ))}
          </Slider>
          <div className="hp-hero-content">
            <p className="hp-eyebrow">Aurora Haven Hotel · Est. 2004</p>
            <h1 className="hp-h1">Where Luxury<br /><em>Finds its Home</em></h1>
            <p className="hp-hero-sub">
              An exclusive sanctuary crafted for those who seek more than
              accommodation — a complete, unforgettable experience.
            </p>
            <div className="hp-ctas">
              <Link to="/rooms" className="btn-gold">Explore Rooms</Link>
              <Link to="/about" className="btn-ghost">Our Story</Link>
            </div>
          </div>
        </div>

        {/* ── Booking Bar — GET /api/category | POST /api/bookings/create-by-category ── */}
        <div className="hp-bar">
          <div className="hp-bar-field">
            <label>Check-in</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="hp-bar-field">
            <label>Check-out</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="hp-bar-field">
            <label>Room Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select type…</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <button className="hp-bar-btn" onClick={handleBooking} disabled={isLoading}>
            {isLoading ? "Booking…" : "Search Now"}
          </button>
        </div>

        {/* ── Features Strip ── */}
        <div className="hp-feats">
          {[
            { icon: "🏛",  name: "Heritage Architecture", desc: "Colonial elegance woven into every corner of the villa." },
            { icon: "🍽",  name: "Culinary Excellence",   desc: "Award-winning chefs crafting world-class dining experiences." },
            { icon: "🌿",  name: "Spa & Wellness",        desc: "Holistic treatments rooted in ancient Sri Lankan traditions." },
            { icon: "🚗",  name: "Bespoke Concierge",     desc: "Personalised service from arrival to departure, 24 / 7." },
          ].map((f) => (
            <div key={f.name} className="hp-feat">
              <span className="hp-feat-icon">{f.icon}</span>
              <div className="hp-feat-name">{f.name}</div>
              <p className="hp-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Room Categories — GET /api/category ── */}
        {categories.length > 0 && (
          <section className="hp-sec" style={{ background: "#faf8f5" }}>
            <div className="hp-sec-hdr">
              <div>
                <p className="hp-sec-label">Accommodations</p>
                <h2 className="hp-sec-title">Choose Your <em>Perfect Stay</em></h2>
                <p className="hp-sec-sub">Each category is thoughtfully curated to deliver a distinct atmosphere and exclusive privileges.</p>
              </div>
              <Link to="/rooms" className="hp-see-all">View All Rooms →</Link>
            </div>
            <div className="hp-cats">
              {categories.map((cat) => (
                <div key={cat.name} className="hp-cat">
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} onError={(e) => { e.target.style.display = "none"; }} />
                    : <div className="hp-cat-ph">🛏</div>
                  }
                  <div className="hp-cat-body">
                    <div className="hp-cat-name">{cat.name}</div>
                    <p className="hp-cat-desc">{cat.description}</p>
                    <div className="hp-cat-foot">
                      <div className="hp-cat-price">${cat.price}<span>/night</span></div>
                      <button
                        className={`hp-cat-sel${selectedCategory === cat.name ? " active" : ""}`}
                        onClick={() => setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)}
                      >
                        {selectedCategory === cat.name ? "✓ Selected" : "Select"}
                      </button>
                    </div>
                    {cat.features?.length > 0 && (
                      <div className="hp-cat-tags">
                        {cat.features.slice(0, 4).map((f) => <span key={f} className="hp-cat-tag">{f}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery Preview — GET /api/gallery ── */}
        {gallery.length > 0 && (
          <section className="hp-sec" style={{ background: "#fff" }}>
            <div className="hp-sec-hdr">
              <div>
                <p className="hp-sec-label">Gallery</p>
                <h2 className="hp-sec-title">Life at <em>Leonine</em></h2>
              </div>
              <Link to="/gallery" className="hp-see-all">View Full Gallery →</Link>
            </div>
            <div className="hp-gallery">
              {gallery.map((item) => (
                <div key={item._id} className="hp-gal-item" onClick={() => setLightbox(item)}>
                  <img src={item.image} alt={item.name} onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Photo"; }} />
                  <div className="hp-gal-ov"><span className="hp-gal-name">{item.name}</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Guest Reviews — GET /api/feedback/approved ── */}
        {feedbacks.length > 0 && (
          <section className="hp-sec" style={{ background: "#faf8f5" }}>
            <div className="hp-sec-hdr">
              <div>
                <p className="hp-sec-label">Guest Reviews</p>
                <h2 className="hp-sec-title">What Our Guests <em>Say</em></h2>
              </div>
              <Link to="/feedback" className="hp-see-all">Leave a Review →</Link>
            </div>
            <div className="hp-reviews">
              {feedbacks.map((f) => (
                <div key={f._id} className="hp-rev">
                  <div className="hp-rev-stars">{STARS.map((s) => s <= (f.rating || 5) ? "★" : "☆").join("")}</div>
                  <p className="hp-rev-msg">"{f.message}"</p>
                  <div className="hp-rev-author">
                    <div className="hp-rev-av">{f.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <div className="hp-rev-name">{f.name}</div>
                      <div className="hp-rev-date">
                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA Band ── */}
        <div className="hp-cta-band">
          <h2>Ready for an Unforgettable Stay?</h2>
          <p>Reserve your room today and let us craft a personalised experience that exceeds every expectation.</p>
          <div className="hp-cta-band-btns">
            <Link to="/rooms" className="btn-gold">Book Your Stay</Link>
            <Link to="/contact" className="btn-ghost-gold">Contact Us</Link>
          </div>
        </div>

      </div>

      {/* ── Gallery Lightbox ── */}
      {lightbox && (
        <div className="hp-lb-bg" onClick={() => setLightbox(null)}>
          <div className="hp-lb" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.name} onError={(e) => { e.target.src = "https://via.placeholder.com/680x420?text=Photo"; }} />
            <div className="hp-lb-body">
              <h2 className="hp-lb-title">{lightbox.name}</h2>
              <p className="hp-lb-desc">{lightbox.description}</p>
              <button className="hp-lb-close" onClick={() => setLightbox(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}