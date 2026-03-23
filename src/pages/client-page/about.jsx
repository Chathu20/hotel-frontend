export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap');
        .ab { font-family: 'Jost', sans-serif; background: #faf8f5; }
        .ab-hero { height: 60vh; min-height: 360px; background: linear-gradient(135deg, #0a0f2e 0%, #1a2050 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 64px; }
        @media(max-width:768px) { .ab-hero { padding: 0 24px 48px; } }
        .ab-lbl { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c9a96e; font-weight: 600; margin-bottom: 12px; }
        .ab-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px,6vw,68px); font-weight: 600; color: #e8d9c4; line-height: 1.1; margin: 0; }
        .ab-title em { font-style: italic; color: #c9a96e; }
        .ab-body { max-width: 1100px; margin: 0 auto; padding: 80px 48px; }
        @media(max-width:768px) { .ab-body { padding: 56px 24px; } }
        .ab-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; margin-bottom: 72px; }
        @media(max-width:768px) { .ab-stats { grid-template-columns: 1fr 1fr; } }
        .ab-stat { text-align: center; background: #fff; border-radius: 12px; padding: 28px 16px; box-shadow: 0 2px 16px rgba(0,0,0,.06); }
        .ab-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 700; color: #785D32; line-height: 1; }
        .ab-stat-lbl { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #aaa; font-weight: 600; margin-top: 6px; }
        .ab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        @media(max-width:768px) { .ab-grid { grid-template-columns: 1fr; gap: 32px; } }
        .ab-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(24px,3vw,36px); font-weight: 600; color: #0a0f2e; margin: 0 0 16px; }
        .ab-h2 em { font-style: italic; color: #785D32; }
        .ab-p { font-size: 15px; color: #6a7585; line-height: 1.8; margin: 0 0 14px; }
        .ab-card { background: linear-gradient(135deg, #0a0f2e, #1a2050); border-radius: 14px; padding: 36px; }
        .ab-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #e8d9c4; margin: 0 0 18px; }
        .ab-list { list-style: none; padding: 0; margin: 0; }
        .ab-list li { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 13.5px; color: rgba(255,255,255,.65); }
        .ab-list li::before { content: '✦'; color: #c9a96e; font-size: 9px; flex-shrink: 0; }
      `}</style>
      <div className="ab">
        <div className="ab-hero">
          <p className="ab-lbl">Our Story</p>
          <h1 className="ab-title">Where Heritage<br />Meets <em>Hospitality</em></h1>
        </div>
        <div className="ab-body">
          <div className="ab-stats">
            {[{v:"20+",l:"Years of Service"},{v:"500+",l:"Happy Guests"},{v:"50+",l:"Luxury Rooms"},{v:"4.9★",l:"Average Rating"}].map((s) => (
              <div key={s.l} className="ab-stat"><div className="ab-stat-val">{s.v}</div><div className="ab-stat-lbl">{s.l}</div></div>
            ))}
          </div>
          <div className="ab-grid">
            <div>
              <h2 className="ab-h2">A Legacy of <em>Excellence</em></h2>
              <p className="ab-p">Founded in 2004 with a singular vision — to create a space where every detail whispers luxury — Leonine Villa has grown into one of Sri Lanka's most celebrated luxury retreats.</p>
              <p className="ab-p">Our architecture draws from colonial heritage while our amenities embrace the finest of contemporary comfort. Every corner has been thoughtfully designed to transport guests into a world apart.</p>
              <p className="ab-p">We believe true hospitality isn't a service — it's a feeling. From the first greeting to the final farewell, our team ensures every moment exceeds expectation.</p>
            </div>
            <div className="ab-card">
              <h3>Why Aurora Haven Hotel?</h3>
              <ul className="ab-list">
                {["Award-winning culinary experiences","Bespoke spa & wellness treatments","24/7 dedicated concierge service","Curated local cultural experiences","Sustainable luxury practices","Free high-speed connectivity"].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}