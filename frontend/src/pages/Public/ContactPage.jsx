import { useState } from "react";
import {
  Mail, MessageSquare, Send, User, Phone,
  MapPin, Clock, CheckCircle2, ChevronDown,
} from "lucide-react";

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is my Gmail data safe with MailMirror?",
    a: "Absolutely. MailMirror only requests gmail.readonly scope — we can never send, delete, or modify any email on your behalf. Your refresh token is encrypted in our database and never exposed publicly.",
  },
  {
    q: "Can the person viewing my shared link reply to emails?",
    a: "No. The shared link is strictly read-only. Viewers can browse and read emails but have zero ability to reply, forward, delete, or take any action whatsoever.",
  },
  {
    q: "How do I stop sharing my inbox?",
    a: "Go to the Your Mails page, click 'Share Inbox', and toggle off or delete any active share links. Access is revoked instantly — no one with that link can view your inbox anymore.",
  },
  {
    q: "Can I create multiple share links?",
    a: "Yes! You can generate as many unique share links as you need — share different links with different people and disable them independently.",
  },
  {
    q: "Does MailMirror store my emails?",
    a: "No. MailMirror fetches your emails live from Gmail via the API each time someone loads the shared view. We do not store email content in our database.",
  },
];

// ── Contact Info ──────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@mailmirror.app",
    sub: "We reply within 24 hours",
  },
  {
    icon: MessageSquare,
    label: "Live Chat",
    value: "Available on the platform",
    sub: "Mon – Fri, 9 AM – 6 PM",
  },
  {
    icon: MapPin,
    label: "Based In",
    value: "Dhaka, Bangladesh",
    sub: "GMT+6 timezone",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Under 24 hours",
    sub: "Usually much faster",
  },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden
        ${open ? "bg-white/60 border-[#62b6cb]/50" : "bg-white/30 border-[#1b4965]/10 hover:bg-white/45"}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer border-none bg-transparent"
      >
        <span className={`text-sm font-bold leading-snug transition-colors duration-150
          ${open ? "text-[#1b4965]" : "text-[#1b4965]/75"}`}>
          {q}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`text-[#1b4965]/50 flex-shrink-0 transition-transform duration-300
            ${open ? "rotate-180 text-[#1b4965]" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="h-px bg-[#1b4965]/10 mb-3" />
          <p className="text-sm text-[#1b4965]/65 font-medium leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Replace with your real API call: await publicApi.sendContact(form)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <main className="min-h-screen">

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section className="section relative overflow-hidden pt-16 pb-20">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#62b6cb]/30 blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#5fa8d3]/20 blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="bg-dot-grid absolute inset-0 pointer-events-none opacity-10" />

        <div className="relative max-w-2xl mx-auto text-center">
          <span className="section-badge animate-fade-up">Get In Touch</span>
          <h1 className="section-title text-4xl sm:text-5xl mt-2 mb-4 animate-fade-up delay-100">
            We'd love to
            <span className="relative inline-block ml-3">
              <span className="relative z-10 text-white">hear from you.</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-[#62b6cb] -z-0 rounded" />
            </span>
          </h1>
          <p className="text-base text-[#1b4965]/65 font-medium leading-relaxed animate-fade-up delay-200">
            Have a question, feedback, or just want to say hello? Fill in the form below
            and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CONTACT INFO CARDS
      ════════════════════════════════════════════════════ */}
      <section className="px-6 -mt-4 mb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="glass-card p-5 flex items-start gap-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1b4965]/10 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1b4965] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#1b4965]/25">
                <Icon size={17} strokeWidth={2} className="text-[#5fa8d3]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#1b4965]/50 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-[#1b4965] leading-snug truncate">{value}</p>
                <p className="text-[11px] text-[#1b4965]/50 font-medium mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FORM + FAQ
      ════════════════════════════════════════════════════ */}
      <section className="section pt-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Contact Form ── */}
          <div className="glass-card shadow-xl shadow-[#1b4965]/10 overflow-hidden">
            {/* Form header */}
            <div className="bg-[#62b6cb] px-7 py-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1b4965] rounded-xl flex items-center justify-center shadow-md shadow-[#1b4965]/30">
                <Send size={17} strokeWidth={2} className="text-[#5fa8d3]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#1b4965]"
                  style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  Send a Message
                </h2>
                <p className="text-[11px] text-[#1b4965]/60 font-medium">All fields are required</p>
              </div>
            </div>

            <div className="px-7 py-7">
              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center animate-fade-up">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center">
                    <CheckCircle2 size={30} strokeWidth={1.8} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1b4965] mb-1"
                      style={{ fontFamily: "'Exo 2', sans-serif" }}>
                      Message Sent!
                    </h3>
                    <p className="text-sm text-[#1b4965]/60 font-medium leading-relaxed">
                      Thanks for reaching out. We'll reply to your email within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-ghost text-xs px-5 py-2.5 mt-1"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1b4965]/65 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={14} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1b4965]/35 pointer-events-none" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          style={{ paddingLeft: "2.5rem" }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1b4965]/65 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1b4965]/35 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          style={{ paddingLeft: "2.5rem" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1b4965]/65 uppercase tracking-wider">
                      Subject
                    </label>
                    <div className="relative">
                      <MessageSquare size={14} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1b4965]/35 pointer-events-none" />
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        style={{ paddingLeft: "2.5rem" }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1b4965]/65 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your question or feedback..."
                      required
                      rows={5}
                      style={{ paddingLeft: "1rem", resize: "none" }}
                    />
                    <p className="text-[10px] text-[#1b4965]/40 font-medium text-right">
                      {form.message.length} characters
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn btn-primary w-full justify-center py-3.5 text-sm mt-1
                      ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={15} strokeWidth={2.5} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={2.5} />
                        Send Message
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="section-badge">FAQ</span>
              <h2 className="section-title text-2xl sm:text-3xl mt-1 mb-2">
                Frequently asked questions
              </h2>
              <p className="text-sm text-[#1b4965]/60 font-medium leading-relaxed">
                Quick answers to the most common questions about MailMirror.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} {...faq} />
              ))}
            </div>

            {/* Still have questions */}
            <div className="glass-card p-5 flex items-center gap-4 mt-1">
              <div className="w-11 h-11 rounded-xl bg-[#1b4965] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#1b4965]/25">
                <Mail size={18} strokeWidth={2} className="text-[#5fa8d3]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#1b4965] mb-0.5"
                  style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  Still have questions?
                </p>
                <p className="text-xs text-[#1b4965]/60 font-medium">
                  Email us directly at{" "}
                  <a href="mailto:hello@mailmirror.app" className="font-bold text-[#1b4965] hover:underline underline-offset-2">
                    hello@mailmirror.app
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}

// needed for loading spinner in submit button
function RefreshCw({ size, strokeWidth, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}