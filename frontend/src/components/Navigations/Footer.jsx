import { NavLink } from "react-router-dom";
import { Mail, Share2, Code2, Globe } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",       to: "/" },
  { label: "Your Mails", to: "/your-mails" },
  { label: "Contact",    to: "/contact" },
];

const SOCIAL_LINKS = [
  { icon: Share2, label: "Share",   href: "#" },
  { icon: Code2,  label: "GitHub",  href: "#" },
  { icon: Globe,  label: "Website", href: "#" },
  { icon: Mail,   label: "Email",   href: "mailto:hello@mailmirror.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#62b6cb] mt-auto">

      {/* ── Top divider accent ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1b4965]/20 via-[#1b4965]/50 to-[#1b4965]/20" />

      {/* ── Main footer body ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── Column 1: Brand & Description ── */}
          <div className="flex flex-col gap-4">
            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-2 no-underline group w-fit">
              <span className="w-9 h-9 bg-[#1b4965] rounded-xl flex items-center justify-center shadow-md shadow-[#1b4965]/30 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 flex-shrink-0">
                <Mail size={18} strokeWidth={2.5} className="text-[#5fa8d3]" />
              </span>
              <span
                className="text-[1.3rem] font-extrabold leading-none tracking-tight text-[#1b4965]"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                Mail<span className="text-white">Mirror</span>
              </span>
            </NavLink>

            {/* Description */}
            <p className="text-sm text-[#1b4965]/80 font-medium leading-relaxed max-w-xs">
              Securely share your Gmail inbox in read-only mode via a unique public link — safe, controlled, and always up to date.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-[#1b4965]/10 border border-[#1b4965]/20 flex items-center justify-center text-[#1b4965] hover:bg-[#1b4965] hover:text-[#5fa8d3] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#1b4965]/25 transition-all duration-200"
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Navigation ── */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-extrabold uppercase tracking-widest text-[#1b4965]"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-semibold no-underline transition-all duration-200 group w-fit
                      ${isActive ? "text-[#1b4965]" : "text-[#1b4965]/70 hover:text-[#1b4965]"}`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b4965]/40 group-hover:bg-[#1b4965] transition-colors duration-200 flex-shrink-0" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Features ── */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-extrabold uppercase tracking-widest text-[#1b4965]"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              Why MailMirror
            </h4>
            <ul className="flex flex-col gap-2.5 list-none m-0 p-0">
              {[
                "Read-only Gmail access",
                "Unique shareable links",
                "Enable / disable anytime",
                "No write permissions",
                "Real-time email updates",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-[#1b4965]/75 font-medium">
                  <span className="w-4 h-4 rounded-md bg-[#1b4965]/15 flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#1b4965" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#1b4965]/20 bg-[#52a8bf]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#1b4965]/70 font-medium">
            © {year} MailMirror. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-[#1b4965]/70 font-medium hover:text-[#1b4965] transition-colors duration-150 no-underline">
              Privacy Policy
            </a>
            <span className="text-[#1b4965]/30 text-xs">|</span>
            <a href="#" className="text-xs text-[#1b4965]/70 font-medium hover:text-[#1b4965] transition-colors duration-150 no-underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}