import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Mail, Users, UserPlus, Send, MessageSquare,
  LayoutDashboard, LogOut, Menu, X, ChevronLeft,
  Bell, Search,
} from "lucide-react";

// Replace with your real AuthContext
// import { useAuth } from "../../context/AuthContext";
const useAuth = () => ({ user: { name: "Admin User", email: "admin@mailmirror.com" }, logout: () => {} });

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard",    to: "/admin" },
  { icon: Users,           label: "Manage Users", to: "/admin/users" },
  { icon: UserPlus,        label: "Add Admin",    to: "/admin/add-admin" },
  { icon: Send,            label: "Send Email",   to: "/admin/send-email" },
  { icon: MessageSquare,   label: "Messages",     to: "/admin/messages" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#bee9e8] font-['Montserrat',sans-serif]">

      {/* ══════════════════════════════════════════
          MOBILE OVERLAY
      ══════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#1b4965]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-[#1b4965] shadow-2xl shadow-[#1b4965]/30
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-[72px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Sidebar Brand ── */}
        <div className={`flex items-center border-b border-white/10 h-[68px] flex-shrink-0 px-4
          ${sidebarOpen ? "justify-between" : "justify-center"}`}>
          {sidebarOpen && (
            <NavLink to="/" className="flex items-center gap-2 no-underline group">
              <span className="w-8 h-8 bg-[#5fa8d3]/20 border border-[#5fa8d3]/30 rounded-xl flex items-center justify-center group-hover:bg-[#5fa8d3]/30 transition-colors duration-200">
                <Mail size={16} strokeWidth={2.5} className="text-[#5fa8d3]" />
              </span>
              <span
                className="text-base font-extrabold tracking-tight text-white"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                Mail<span className="text-[#5fa8d3]">Mirror</span>
              </span>
            </NavLink>
          )}

          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center text-white/70 hover:text-white transition-all duration-200 cursor-pointer border-none flex-shrink-0"
          >
            <ChevronLeft
              size={14}
              strokeWidth={2.5}
              className={`transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {/* ── Nav Links ── */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col gap-1 px-2 list-none m-0 p-0 px-2">
            {SIDEBAR_LINKS.map(({ icon: Icon, label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  title={!sidebarOpen ? label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline group
                    ${isActive
                      ? "bg-[#5fa8d3]/20 text-white border border-[#5fa8d3]/30"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                    }
                    ${!sidebarOpen ? "justify-center" : ""}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`flex-shrink-0 ${isActive ? "text-[#5fa8d3]" : "text-white/60 group-hover:text-white"}`}>
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      {sidebarOpen && (
                        <span className="text-sm font-semibold truncate">{label}</span>
                      )}
                      {sidebarOpen && isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5fa8d3] flex-shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Sidebar Footer: User + Logout ── */}
        <div className="border-t border-white/10 p-3 flex-shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#5fa8d3]/25 border border-[#5fa8d3]/40 flex items-center justify-center text-xs font-bold text-[#5fa8d3] flex-shrink-0">
                {user?.name?.[0] ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name ?? "Admin"}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email ?? ""}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-full bg-[#5fa8d3]/25 border border-[#5fa8d3]/40 flex items-center justify-center text-xs font-bold text-[#5fa8d3]">
                {user?.name?.[0] ?? "A"}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/50 hover:bg-red-500/15 hover:text-red-400 transition-all duration-200 cursor-pointer border-none bg-transparent
              ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <LogOut size={16} strokeWidth={2} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-xs font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"}`}
      >

        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-20 h-[68px] flex items-center justify-between px-5 bg-[#62b6cb] border-b border-[#1b4965]/15 shadow-sm shadow-[#1b4965]/10 flex-shrink-0">

          {/* Left: Mobile hamburger + Page title */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#1b4965]/10 hover:bg-[#1b4965]/20 flex items-center justify-center text-[#1b4965] transition-colors cursor-pointer border-none"
            >
              {mobileOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
            </button>

            {/* Search bar */}
            <div className="relative hidden sm:flex items-center">
              <Search size={14} strokeWidth={2} className="absolute left-3 text-[#1b4965]/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                style={{ paddingLeft: "2.25rem", paddingRight: "1rem", paddingTop: "0.45rem", paddingBottom: "0.45rem" }}
                className="w-48 lg:w-64 text-xs bg-white/40 border border-[#1b4965]/15 rounded-xl text-[#1b4965] placeholder:text-[#1b4965]/40 focus:bg-white/60 focus:border-[#1b4965]/35 transition-all duration-200 outline-none font-medium"
              />
            </div>
          </div>

          {/* Right: Notification + user pill */}
          <div className="flex items-center gap-2.5">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-xl bg-[#1b4965]/10 hover:bg-[#1b4965]/20 flex items-center justify-center text-[#1b4965] transition-colors cursor-pointer border-none">
              <Bell size={16} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border-2 border-[#62b6cb]" />
            </button>

            {/* User pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1b4965]/10 border border-[#1b4965]/15">
              <div className="w-7 h-7 rounded-full bg-[#1b4965] flex items-center justify-center text-xs font-bold text-[#5fa8d3]">
                {user?.name?.[0] ?? "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#1b4965] leading-none">{user?.name ?? "Admin"}</p>
                <p className="text-[10px] text-[#1b4965]/50 leading-none mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-5 lg:p-7 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}