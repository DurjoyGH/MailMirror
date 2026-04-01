import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Menu, X, LayoutDashboard, LogOut, LogIn } from "lucide-react";

// Replace with your real AuthContext import
// import { useAuth } from "../../context/AuthContext";
const useAuth = () => ({ user: null, logout: () => {} });

const NAV_LINKS = [
  { label: "Home",       to: "/" },
  { label: "Your Mails", to: "/your-mails" },
  { label: "Contact",    to: "/contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      {/* ── Fixed Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-6 transition-all duration-300
          ${scrolled ? "bg-[#52a8bf] shadow-lg shadow-[#1b4965]/20" : "bg-[#62b6cb]"}`}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">

          {/* Brand */}
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 no-underline group"
          >
            <span className="w-9 h-9 bg-[#1b4965] rounded-xl flex items-center justify-center shadow-md shadow-[#1b4965]/30 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
              <Mail size={18} strokeWidth={2.5} className="text-[#5fa8d3]" />
            </span>
            <span
              className="text-[1.35rem] font-extrabold leading-none tracking-tight text-[#1b4965]"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              Mail<span className="text-white">Mirror</span>
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-semibold rounded-lg tracking-wide transition-all duration-200 no-underline
                    after:absolute after:bottom-0.5 after:h-0.5 after:bg-[#1b4965] after:rounded-full after:transition-all after:duration-200
                    ${isActive
                      ? "text-[#1b4965] bg-white/30 after:left-3.5 after:right-3.5"
                      : "text-[#1b4965] hover:bg-white/25 after:left-1/2 after:right-1/2 hover:after:left-3.5 hover:after:right-3.5"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="btn text-xs px-4 py-2 bg-white/25 text-[#1b4965] border-2 border-[#1b4965]/30 hover:bg-white/45 no-underline"
                >
                  <LayoutDashboard size={14} strokeWidth={2.5} />
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn text-xs px-3 py-2 bg-transparent text-[#1b4965] border-2 border-[#1b4965]/35 hover:bg-[#1b4965]/10 cursor-pointer"
                >
                  <LogOut size={14} strokeWidth={2.5} />
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="btn btn-primary text-xs px-4 py-2"
              >
                <LogIn size={14} strokeWidth={2.5} />
                Login
              </NavLink>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden p-1.5 rounded-lg text-[#1b4965] hover:bg-white/30 transition-colors duration-150 cursor-pointer border-none bg-transparent"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <X size={22} strokeWidth={2.5} />
              : <Menu size={22} strokeWidth={2.5} />
            }
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-[68px] left-0 right-0 z-40 bg-[#52a8bf] border-b-2 border-[#1b4965]/20 shadow-lg shadow-[#1b4965]/15 px-6 pt-3 pb-5 md:hidden transition-all duration-200
          ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        {/* Mobile Nav Links */}
        <ul className="list-none m-0 p-0 flex flex-col gap-1 mb-3">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150 no-underline
                  ${isActive
                    ? "bg-white/30 text-[#1b4965]"
                    : "text-[#1b4965] hover:bg-white/25"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="h-px bg-[#1b4965]/20 my-2" />

        {/* Mobile Action Buttons */}
        <div className="flex flex-col gap-2 mt-3">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="btn text-sm w-full px-4 py-2.5 bg-white/25 text-[#1b4965] border-2 border-[#1b4965]/30 hover:bg-white/40 justify-center no-underline"
              >
                <LayoutDashboard size={15} strokeWidth={2.5} />
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn text-sm w-full px-4 py-2.5 bg-transparent text-[#1b4965] border-2 border-[#1b4965]/35 hover:bg-[#1b4965]/10 justify-center cursor-pointer"
              >
                <LogOut size={15} strokeWidth={2.5} />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary text-sm w-full px-4 py-2.5 justify-center no-underline"
            >
              <LogIn size={15} strokeWidth={2.5} />
              Login with Google
            </NavLink>
          )}
        </div>
      </div>

      {/* Spacer so page content isn't hidden under the fixed bar */}
      <div className="h-[68px]" />
    </>
  );
}