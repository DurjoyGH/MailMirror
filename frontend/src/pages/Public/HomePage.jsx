import { NavLink } from "react-router-dom";
import {
  Mail, ShieldCheck, Link2, Eye, EyeOff, RefreshCw,
  ArrowRight, Zap, Lock, Share2, CheckCircle2,
} from "lucide-react";

// ── Static data ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Read-Only Access",
    desc: "Only gmail.readonly scope is granted — your inbox stays completely protected. No write, delete, or reply permissions ever.",
  },
  {
    icon: Link2,
    title: "Unique Share Links",
    desc: "Generate a unique URL per account. Share it with anyone — they get a live, read-only view of your inbox instantly.",
  },
  {
    icon: RefreshCw,
    title: "Always Up to Date",
    desc: "Emails refresh in real time via the Gmail API. No manual exports or screenshots — your shared view stays dynamic.",
  },
  {
    icon: Lock,
    title: "Controlled Sharing",
    desc: "Enable or disable your share link at any time with one click. You stay in complete control of who sees your inbox.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    desc: "Log in with Google, connect your Gmail, and generate your share link in under 30 seconds. No configuration needed.",
  },
  {
    icon: Eye,
    title: "Clean Viewer Experience",
    desc: "Recipients get a beautiful, distraction-free email viewer — no Gmail UI clutter, no accidental actions possible.",
  },
];

const STEPS = [
  { num: "01", title: "Login with Google", desc: "Authenticate securely via Google OAuth 2.0 — no password stored."       },
  { num: "02", title: "Connect Gmail",      desc: "Grant read-only access to your inbox. Safe & reversible anytime."        },
  { num: "03", title: "Generate Your Link", desc: "Get a unique shareable URL for your inbox in one click."                 },
  { num: "04", title: "Share & Control",    desc: "Send the link to anyone. Enable or disable it whenever you want."        },
];

const COMPARISON = [
  { method: "Gmail Delegation", safe: false, dynamic: true,  controlled: false },
  { method: "Screenshots",      safe: true,  dynamic: false, controlled: true  },
  { method: "Forwarding",       safe: false, dynamic: false, controlled: false },
  { method: "MailMirror ✦",    safe: true,  dynamic: true,  controlled: true  },
];

const MOCK_EMAILS = [
  { from: "GitHub", subj: "Your PR was merged",           time: "9:41 AM",   unread: true  },
  { from: "Notion", subj: "Weekly digest is ready",       time: "8:15 AM",   unread: true  },
  { from: "Stripe", subj: "Invoice #1042 paid",           time: "Yesterday", unread: false },
  { from: "Google", subj: "Security alert for your acc.", time: "Mon",       unread: false },
  { from: "Vercel", subj: "Deployment successful 🚀",     time: "Sun",       unread: false },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* ════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section relative overflow-hidden pt-16 pb-28">

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#62b6cb]/30 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5fa8d3]/20 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        {/* Dot grid — uses global .bg-dot-grid */}
        <div className="bg-dot-grid absolute inset-0 pointer-events-none opacity-20" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-10">

            {/* ── Left: Text ── */}
            <div className="flex-1 text-center lg:text-left">

              {/* Badge — uses global .section-badge */}
              <span className="section-badge animate-fade-up">
                <span className="inline-block w-2 h-2 rounded-full bg-[#1b4965] mr-2 animate-pulse" />
                Gmail Read-Only Sharing
              </span>

              {/* Headline */}
              <h1 className="section-title text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 animate-fade-up delay-100">
                Share Your Inbox,
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-white">Safely.</span>
                  <span className="absolute inset-x-0 bottom-1 h-3 bg-[#62b6cb] -z-0 rounded" />
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#1b4965]/75 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up delay-200">
                MailMirror lets you generate a secure, read-only link to your Gmail inbox.
                No write access. No passwords. Just a clean, shareable view — always live.
              </p>

              {/* CTAs — uses global .btn .btn-primary .btn-ghost */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-up delay-300">
                <NavLink to="/login" className="btn btn-primary text-sm px-7 py-3.5">
                  <Mail size={16} strokeWidth={2.5} />
                  Get Started Free
                  <ArrowRight size={15} strokeWidth={2.5} />
                </NavLink>
                <NavLink to="/your-mails" className="btn btn-ghost text-sm px-7 py-3.5">
                  <Eye size={16} strokeWidth={2.5} />
                  View Demo
                </NavLink>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-8 animate-fade-up delay-400">
                {["No credit card", "Read-only scope", "Disable anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} strokeWidth={2.5} className="text-[#1b4965]" />
                    <span className="text-xs font-semibold text-[#1b4965]/70">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Inbox card mockup — uses global .animate-float .glass-card ── */}
            <div className="flex-1 flex items-center justify-center w-full max-w-sm lg:max-w-none animate-fade-up delay-200">
              <div className="animate-float relative w-full max-w-md">

                {/* Card */}
                <div className="glass-card shadow-2xl shadow-[#1b4965]/20 overflow-hidden">

                  {/* Card header */}
                  <div className="bg-[#62b6cb] px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-[#1b4965] rounded-lg flex items-center justify-center">
                        <Mail size={14} strokeWidth={2.5} className="text-[#5fa8d3]" />
                      </div>
                      <span className="text-sm font-bold text-[#1b4965]">Shared Inbox</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1b4965]/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1b4965]/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1b4965]/60" />
                    </div>
                  </div>

                  {/* Read-only badge */}
                  <div className="mx-5 mt-4 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#bee9e8]/80 border border-[#62b6cb]/40">
                    <EyeOff size={13} strokeWidth={2.5} className="text-[#1b4965]" />
                    <span className="text-xs font-semibold text-[#1b4965]/80">View only — no actions available</span>
                  </div>

                  {/* Mock email rows */}
                  {MOCK_EMAILS.map((email, i) => (
                    <div
                      key={i}
                      className={`mx-3 mb-1.5 px-4 py-3 rounded-xl flex items-center gap-3 cursor-default transition-colors duration-150
                        ${email.unread ? "bg-[#bee9e8]/60 border border-[#62b6cb]/30" : "hover:bg-[#bee9e8]/30"}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                        ${email.unread ? "bg-[#1b4965] text-[#5fa8d3]" : "bg-[#1b4965]/10 text-[#1b4965]"}`}>
                        {email.from[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs truncate ${email.unread ? "font-bold text-[#1b4965]" : "font-semibold text-[#1b4965]/60"}`}>
                            {email.from}
                          </span>
                          <span className="text-[10px] text-[#1b4965]/50 flex-shrink-0">{email.time}</span>
                        </div>
                        <p className={`text-[11px] truncate mb-0 ${email.unread ? "text-[#1b4965]/80 font-medium" : "text-[#1b4965]/50"}`}>
                          {email.subj}
                        </p>
                      </div>
                      {email.unread && <div className="w-2 h-2 rounded-full bg-[#1b4965] flex-shrink-0" />}
                    </div>
                  ))}
                  <div className="h-3" />
                </div>

                {/* Share link pill */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b4965] shadow-lg shadow-[#1b4965]/40 whitespace-nowrap">
                  <Share2 size={12} strokeWidth={2.5} className="text-[#5fa8d3]" />
                  <span className="text-xs font-bold text-[#5fa8d3]">mailmirror.app/view/abc123</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PROBLEM / COMPARISON SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section bg-[#62b6cb]/30">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <span className="section-badge">The Problem</span>
            <h2 className="section-title">Gmail doesn't do read-only sharing.</h2>
            <p className="text-sm text-[#1b4965]/70 font-medium mt-3 max-w-lg mx-auto">
              Every existing option either gives too much access or becomes stale immediately.
            </p>
          </div>

          {/* Comparison table — uses global table/th/td styles */}
          <div className="overflow-x-auto rounded-2xl border border-[#1b4965]/15 shadow-lg shadow-[#1b4965]/10">
            <table className="min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left">Method</th>
                  {["Safe", "Dynamic", "Controlled"].map((h) => (
                    <th key={h} className="text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => {
                  const isMailMirror = row.method.includes("MailMirror");
                  return (
                    <tr key={i} className={isMailMirror ? "bg-[#bee9e8]/80" : "bg-white/40"}>
                      <td className={`font-bold ${isMailMirror ? "text-[#1b4965]" : "text-[#1b4965]/70"}`}>
                        {row.method}
                      </td>
                      {[row.safe, row.dynamic, row.controlled].map((val, j) => (
                        <td key={j} className="text-center">
                          {val
                            ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1b4965]/10 text-[#1b4965]">
                                <CheckCircle2 size={15} strokeWidth={2.5} />
                              </span>
                            : <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-400 font-bold text-sm">✕</span>
                          }
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURES GRID
      ════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything you need. Nothing you don't.</h2>
          </div>

          {/* Feature cards — uses global .glass-card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="glass-card group p-6 hover:bg-white/75 hover:border-[#62b6cb] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1b4965]/10"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1b4965] flex items-center justify-center mb-4 shadow-md shadow-[#1b4965]/25 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={20} strokeWidth={2} className="text-[#5fa8d3]" />
                </div>
                <h3 className="text-base font-extrabold text-[#1b4965] mb-2">{title}</h3>
                <p className="text-sm text-[#1b4965]/65 font-medium leading-relaxed mb-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS — STEPS
      ════════════════════════════════════════════════════ */}
      <section className="section bg-[#62b6cb]/25">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Up and running in 4 steps.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-px bg-[#1b4965]/20 z-0" />
                )}
                {/* Step box */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#1b4965] flex items-center justify-center mb-4 shadow-lg shadow-[#1b4965]/25 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-xl font-black text-[#5fa8d3]">{num}</span>
                </div>
                <h3 className="text-sm font-extrabold text-[#1b4965] mb-2">{title}</h3>
                <p className="text-xs text-[#1b4965]/65 font-medium leading-relaxed mb-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section relative overflow-hidden">

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#62b6cb]/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center">

          {/* Pulsing icon — uses global .pulse-ring */}
          <div className="pulse-ring relative inline-flex mb-8 rounded-3xl">
            <div className="w-20 h-20 rounded-3xl bg-[#1b4965] flex items-center justify-center shadow-2xl shadow-[#1b4965]/30">
              <Mail size={34} strokeWidth={1.8} className="text-[#5fa8d3]" />
            </div>
          </div>

          <h2 className="section-title text-3xl sm:text-5xl mb-5">
            Ready to share your inbox safely?
          </h2>
          <p className="text-base text-[#1b4965]/70 font-medium mb-8 leading-relaxed">
            Join MailMirror today — it takes less than a minute to set up.
            Your Gmail stays secure. Your link stays live.
          </p>

          {/* CTAs — uses global .btn .btn-primary .btn-ghost */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <NavLink to="/login" className="btn btn-primary text-sm px-8 py-4">
              <Mail size={16} strokeWidth={2.5} />
              Start for Free
              <ArrowRight size={15} strokeWidth={2.5} />
            </NavLink>
            <NavLink to="/contact" className="btn btn-ghost text-sm px-8 py-4">
              Have questions? Contact us
            </NavLink>
          </div>
        </div>
      </section>

    </main>
  );
}