import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

const NAV = [
  { to: "/",         label: "Home"    },
  { to: "/rooms",    label: "Rooms"   },
  { to: "/gallery",  label: "Gallery" },
  { to: "/feedback", label: "Reviews" },
  { to: "/about",    label: "About"   },
  { to: "/contact",  label: "Contact" },
];

export default function Header() {
  const [user,     setUser]     = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // ── GET /api/users — load logged-in user ──────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // ── Scroll listener — transparent on home hero, solid elsewhere ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu on route change ─────────────────────────
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  }

  const solid    = scrolled || !isHome;
  const initials =
    (user?.firstName?.[0] ?? "").toUpperCase() +
    (user?.lastName?.[0]  ?? "").toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');

        /* ── Header shell ── */
        .lv-hdr {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 44px; height: 72px;
          font-family: 'Jost', sans-serif;
          transition: background .4s ease, box-shadow .4s ease;
          background: ${solid ? "rgba(10,15,46,.97)" : "transparent"};
          box-shadow: ${solid ? "0 2px 32px rgba(0,0,0,.24)" : "none"};
        }
        @media(max-width:768px) { .lv-hdr { padding: 0 20px; } }

        /* ── Logo ── */
        .lv-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 700;
          color: #e8d9c4; letter-spacing: 1px;
          text-decoration: none;
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .lv-logo-mark {
          width: 34px; height: 34px; border-radius: 8px;
          background: linear-gradient(135deg, #c9a96e, #785D32);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 800; color: #fff; flex-shrink: 0;
        }

        /* ── Desktop nav ── */
        .lv-nav { display: flex; align-items: center; gap: 30px; }
        @media(max-width:768px) { .lv-nav { display: none; } }
        .lv-nav-link {
          color: rgba(255,255,255,.7);
          font-size: 12.5px; font-weight: 500; letter-spacing: 1px;
          text-transform: uppercase; text-decoration: none; transition: color .2s;
          position: relative; padding-bottom: 3px;
        }
        .lv-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px; background: #c9a96e; transition: width .3s;
        }
        .lv-nav-link:hover { color: #e8d9c4; }
        .lv-nav-link:hover::after { width: 100%; }
        .lv-nav-link.active { color: #c9a96e; }
        .lv-nav-link.active::after { width: 100%; }

        /* ── Right actions ── */
        .lv-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        @media(max-width:768px) { .lv-actions { display: none; } }

        .lv-login {
          border: 1px solid rgba(201,169,110,.6); color: #c9a96e;
          background: transparent; padding: 7px 20px; border-radius: 4px;
          font-size: 11.5px; font-weight: 500; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer; transition: all .2s;
          font-family: 'Jost', sans-serif; text-decoration: none; display: inline-block;
        }
        .lv-login:hover { background: #c9a96e; color: #0a0f2e; }

        .lv-user { display: flex; align-items: center; gap: 10px; }
        .lv-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #c9a96e, #785D32);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          text-decoration: none; flex-shrink: 0;
          border: 2px solid rgba(201,169,110,.4); transition: border-color .2s;
        }
        .lv-avatar:hover { border-color: #c9a96e; }
        .lv-user-name {
          font-size: 13.5px; color: rgba(255,255,255,.85); font-weight: 400;
          max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .lv-logout {
          background: transparent; border: none; color: rgba(255,255,255,.35);
          font-size: 12px; cursor: pointer; font-family: 'Jost', sans-serif;
          letter-spacing: .5px; transition: color .2s; padding: 0;
        }
        .lv-logout:hover { color: #f87171; }

        /* ── Hamburger ── */
        .lv-burger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
        }
        @media(max-width:768px) { .lv-burger { display: flex; } }
        .lv-burger span {
          width: 22px; height: 1.5px; background: #e8d9c4;
          display: block; transition: all .3s;
        }

        /* ── Mobile drawer ── */
        .lv-drawer {
          display: none; position: fixed; top: 72px; left: 0; right: 0;
          background: rgba(10,15,46,.98); backdrop-filter: blur(18px);
          flex-direction: column; padding: 16px 28px 28px; gap: 0;
          border-top: 1px solid rgba(201,169,110,.12); z-index: 99;
          animation: drawerIn .25s ease;
        }
        @keyframes drawerIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:none; }
        }
        .lv-drawer.open { display: flex; }

        .lv-drawer-link {
          color: rgba(255,255,255,.7); font-size: 13px;
          font-family: 'Jost', sans-serif; letter-spacing: 1px;
          text-transform: uppercase; text-decoration: none;
          padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,.06);
          transition: color .2s; display: flex;
          align-items: center; justify-content: space-between;
        }
        .lv-drawer-link:hover { color: #c9a96e; }
        .lv-drawer-link.active { color: #c9a96e; }

        .lv-drawer-divider { height: 1px; background: rgba(255,255,255,.06); margin: 8px 0; }

        .lv-drawer-user {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .lv-drawer-user-name { color: rgba(255,255,255,.8); font-size: 14px; }
        .lv-drawer-user-email { color: rgba(255,255,255,.35); font-size: 11px; margin-top: 1px; }

        .lv-drawer-logout {
          background: none; border: none; color: #f87171;
          font-size: 13px; font-family: 'Jost', sans-serif;
          text-align: left; padding: 13px 0; cursor: pointer; letter-spacing: .5px;
        }
        .lv-drawer-login {
          color: #c9a96e; text-decoration: none; font-size: 13px;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 14px 0; display: block; font-family: 'Jost', sans-serif;
        }
      `}</style>

      {/* ── Header bar ── */}
      <header className="lv-hdr">

        {/* Logo */}
        <Link to="/" className="lv-logo">
          <div className="lv-logo-mark">L</div>
          Leonine Villa
        </Link>

        {/* Desktop nav */}
        <nav className="lv-nav">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`lv-nav-link${location.pathname === to ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop user section */}
        <div className="lv-actions">
          {user ? (
            <div className="lv-user">
              <Link to="/profile" className="lv-avatar" title="My Profile">
                {initials || "U"}
              </Link>
              <span className="lv-user-name">{user.firstName}</span>
              <button className="lv-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="lv-login">Login</Link>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className="lv-burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)"   : "none" }} />
          <span style={{ opacity:    menuOpen ? 0 : 1                                }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      <div className={`lv-drawer${menuOpen ? " open" : ""}`}>

        {/* User info row (if logged in) */}
        {user && (
          <div className="lv-drawer-user">
            <Link to="/profile" className="lv-avatar" style={{ textDecoration: "none" }}>
              {initials || "U"}
            </Link>
            <div>
              <div className="lv-drawer-user-name">{user.firstName} {user.lastName}</div>
              <div className="lv-drawer-user-email">{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        {NAV.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`lv-drawer-link${location.pathname === to ? " active" : ""}`}
          >
            {label}
            {location.pathname === to && (
              <span style={{ color: "#c9a96e", fontSize: 10 }}>●</span>
            )}
          </Link>
        ))}

        <div className="lv-drawer-divider" />

        {/* Auth row */}
        {user ? (
          <button className="lv-drawer-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        ) : (
          <Link to="/login" className="lv-drawer-login">Login / Sign Up</Link>
        )}
      </div>
    </>
  );
}