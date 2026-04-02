import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import {
  Mail, Search, RefreshCw, Eye, EyeOff, Clock,
  Paperclip, Star, ChevronLeft, Inbox, Filter,
  Share2, Link2, Copy, Check, ToggleLeft, ToggleRight,
  Trash2, Plus, ShieldCheck, Globe, Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMailMessages, createShareLink, getShareLinks } from "../../services/publicApi";
import Loader from "../../components/Loader/Loader";

// ── Demo Data (fallback) ──────────────────────────────────────────────────────
const DEMO_EMAILS = [
  {
    id: 1,
    from: "GitHub",
    email: "noreply@github.com",
    subject: "Your pull request was merged 🎉",
    preview: "Congratulations! Your pull request #142 'feat: add OAuth login' has been successfully merged into main.",
    body: `Hi there,\n\nGreat news! Your pull request #142 "feat: add OAuth login" has been successfully merged into the main branch by your team lead.\n\nChanges merged:\n• Google OAuth 2.0 integration\n• Secure token storage\n• Auto token refresh logic\n\nYou can view the merged changes on GitHub.\n\nThanks for your contribution!\n\nThe GitHub Team`,
    time: "9:41 AM", date: "Today", unread: true, starred: true, hasAttachment: false, avatar: "G",
  },
  {
    id: 2,
    from: "Notion",
    email: "team@notion.so",
    subject: "Your weekly digest is ready 📋",
    preview: "Here's what happened in your workspace this week. 3 new pages were created, 12 comments added.",
    body: `Hello,\n\nHere's your weekly Notion workspace digest:\n\n📄 Pages Created: 3\n💬 Comments Added: 12\n✅ Tasks Completed: 8\n👥 Team Members Active: 5\n\nTop pages this week:\n• MailMirror Project Spec\n• Q2 Roadmap Planning\n• API Documentation Draft\n\nKeep up the great work!\n\nThe Notion Team`,
    time: "8:15 AM", date: "Today", unread: true, starred: false, hasAttachment: false, avatar: "N",
  },
  {
    id: 3,
    from: "Stripe",
    email: "receipts@stripe.com",
    subject: "Invoice #1042 — Payment Confirmed",
    preview: "Your payment of $49.00 for the Pro plan has been received. Your receipt is attached.",
    body: `Hello,\n\nYour payment has been successfully processed.\n\nInvoice Details:\n━━━━━━━━━━━━━━━━━━\nInvoice #: 1042\nAmount: $49.00\nPlan: MailMirror Pro\nDate: April 2, 2026\nStatus: ✅ Paid\n━━━━━━━━━━━━━━━━━━\n\nThank you for your subscription.\n\nStripe Billing`,
    time: "6:30 PM", date: "Yesterday", unread: false, starred: true, hasAttachment: true, avatar: "S",
  },
  {
    id: 4,
    from: "Google",
    email: "no-reply@accounts.google.com",
    subject: "Security alert for your linked account",
    preview: "A new sign-in was detected on your Google account from Dhaka, Bangladesh.",
    body: `Hi,\n\nA new sign-in to your Google Account was detected.\n\nDevice: Chrome on Windows\nLocation: Dhaka, Bangladesh\nTime: April 1, 2026, 11:45 PM\n\nIf this was you, you can safely ignore this message.\n\nIf you didn't sign in recently, please secure your account immediately.\n\nGoogle Security Team`,
    time: "11:48 PM", date: "Monday", unread: false, starred: false, hasAttachment: false, avatar: "G",
  },
  {
    id: 5,
    from: "Vercel",
    email: "noreply@vercel.com",
    subject: "Deployment successful 🚀 — mailmirror-app",
    preview: "Your project mailmirror-app was successfully deployed to production at mailmirror.vercel.app",
    body: `Hey there,\n\nYour deployment is live! 🎉\n\nProject: mailmirror-app\nEnvironment: Production\nStatus: ✅ Ready\nDomain: mailmirror.vercel.app\nDeploy Time: 43s\nCommit: feat: homepage redesign (a3f92bc)\n\nVercel Team`,
    time: "3:12 PM", date: "Sunday", unread: false, starred: false, hasAttachment: false, avatar: "V",
  },
  {
    id: 6,
    from: "Figma",
    email: "noreply@figma.com",
    subject: "Arif commented on your design file",
    preview: "Arif: \"Love the color palette! Can we try a darker shade for the CTA button?\"",
    body: `Hi,\n\nArif commented on your Figma file "MailMirror UI Kit":\n\n💬 "Love the color palette! Can we try a darker shade for the CTA button? Also the navbar spacing looks tight on mobile."\n\nFile: MailMirror UI Kit\nPage: Components\nFrame: Navbar — Mobile\n\nFigma Team`,
    time: "1:05 PM", date: "Sunday", unread: false, starred: false, hasAttachment: false, avatar: "F",
  },
  {
    id: 7,
    from: "Linear",
    email: "notifications@linear.app",
    subject: "Issue assigned: Implement Gmail API integration",
    preview: "You have been assigned issue LIN-204. Due date: April 10, 2026. Priority: Urgent.",
    body: `Hello,\n\nA new issue has been assigned to you.\n\nIssue: LIN-204\nTitle: Implement Gmail API integration\nPriority: 🔴 Urgent\nDue Date: April 10, 2026\nProject: MailMirror Backend\n\nDescription:\nIntegrate the Gmail API with read-only scope. Implement token refresh logic and email fetching endpoint.\n\nLinear`,
    time: "10:00 AM", date: "Saturday", unread: false, starred: true, hasAttachment: false, avatar: "L",
  },
];

// ── Generate a random token ───────────────────────────────────────────────────
const generateToken = () => Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

// ── Inject mobile-responsive CSS into HTML email content ─────────────────────
// HTML emails often have fixed-width tables (e.g. width="600"). This style
// reset forces them to fit the container without breaking the email structure.
const RESPONSIVE_EMAIL_STYLE = `
<style>
  html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  img { max-width: 100% !important; height: auto !important; }
  a, p, span, div, td, th { word-break: break-word !important; overflow-wrap: anywhere !important; }

  /* Mobile-only assistance: keep layout responsive without destroying template structure */
  @media only screen and (max-width: 640px) {
    table { max-width: 100% !important; }
    td, th { max-width: 100% !important; }
    [width] { max-width: 100% !important; }
  }
</style>
`.trim();

const sanitizeEmailHtml = (html) =>
  DOMPurify.sanitize(RESPONSIVE_EMAIL_STYLE + html, {
    ADD_TAGS: ["style"],
    ADD_ATTR: ["style","class","id","width","height","align","bgcolor",
               "cellpadding","cellspacing","border","target","rel"],
    FORBID_TAGS: ["script","iframe","object","embed","form","input","button"],
  });

// ── Format email body ─────────────────────────────────────────────────────────
const formatBody = (body) =>
  body.split("\n").map((line, i) => <span key={i}>{line}<br /></span>);

// ── Share Panel Component ─────────────────────────────────────────────────────
function SharePanel({ onClose }) {
  const [links, setLinks] = useState([
    { id: 1, token: "x7k2m9ab", active: true,  createdAt: "Apr 1, 2026", views: 14 },
    { id: 2, token: "p3n8q1yz", active: false, createdAt: "Mar 28, 2026", views: 3  },
  ]);
  const [copied, setCopied] = useState(null);

  const baseUrl = window.location.origin;

  const handleCopy = (token) => {
    navigator.clipboard.writeText(`${baseUrl}/view/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleToggle = (id) => {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreate = () => {
    const newLink = {
      id: Date.now(),
      token: generateToken(),
      active: true,
      createdAt: "Apr 2, 2026",
      views: 0,
    };
    setLinks((prev) => [newLink, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1b4965]/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — slides up from bottom on mobile, centered on sm+ */}
      <div className="relative glass-card w-full sm:max-w-lg shadow-2xl shadow-[#1b4965]/25 animate-fade-up overflow-hidden
        rounded-t-3xl sm:rounded-2xl max-h-[92svh] sm:max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#62b6cb] px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1b4965] rounded-xl flex items-center justify-center shadow-md">
              <Share2 size={17} strokeWidth={2.5} className="text-[#5fa8d3]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1b4965]"
                style={{ fontFamily: "'Exo 2', sans-serif" }}>
                Share Your Inbox
              </h3>
              <p className="text-[11px] text-[#1b4965]/65 font-medium">Manage your public read-only links</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1b4965]/10 hover:bg-[#1b4965]/20 flex items-center justify-center text-[#1b4965] transition-colors cursor-pointer border-none"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {/* Info banner */}
          <div className="mx-4 sm:mx-5 mt-4 sm:mt-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-[#bee9e8]/80 border border-[#62b6cb]/40">
            <ShieldCheck size={15} strokeWidth={2} className="text-[#1b4965] flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-[#1b4965]/75 leading-relaxed">
              Anyone with your link can <strong>view</strong> your inbox in read-only mode.
              They <strong>cannot</strong> reply, delete, or modify any emails.
            </p>
          </div>

          {/* Links list */}
          <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
            {links.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-[#1b4965]/40 gap-2">
                <Link2 size={28} strokeWidth={1.5} />
                <p className="text-sm font-semibold">No share links yet</p>
              </div>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className={`rounded-2xl border p-3 sm:p-4 transition-all duration-200
                    ${link.active
                      ? "bg-white/50 border-[#62b6cb]/40"
                      : "bg-white/20 border-[#1b4965]/10 opacity-60"
                    }`}
                >
                  {/* Link URL row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                      ${link.active ? "bg-[#1b4965]" : "bg-[#1b4965]/30"}`}>
                      {link.active
                        ? <Globe size={12} strokeWidth={2.5} className="text-[#5fa8d3]" />
                        : <Lock size={12} strokeWidth={2.5} className="text-white/60" />
                      }
                    </div>
                    {/* Truncated URL — prevent overflow on small screens */}
                    <code className="flex-1 text-[10px] sm:text-[11px] font-bold text-[#1b4965]/70 truncate bg-[#1b4965]/5 rounded-lg px-2 py-1.5 min-w-0">
                      /view/{link.token}
                    </code>
                    <button
                      onClick={() => handleCopy(link.token)}
                      disabled={!link.active}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-150 cursor-pointer flex-shrink-0
                        ${copied === link.token
                          ? "bg-green-100 border-green-300 text-green-600"
                          : link.active
                            ? "bg-[#1b4965] border-[#1b4965] text-[#5fa8d3] hover:bg-[#163d54]"
                            : "bg-transparent border-[#1b4965]/15 text-[#1b4965]/30 cursor-not-allowed"
                        }`}
                    >
                      {copied === link.token
                        ? <><Check size={11} strokeWidth={3} /> Copied!</>
                        : <><Copy size={11} strokeWidth={2.5} /> Copy</>
                      }
                    </button>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between flex-wrap gap-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-[#1b4965]/50 font-medium">
                      <span>{link.createdAt}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye size={10} strokeWidth={2} /> {link.views} views
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggle(link.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all duration-150 cursor-pointer
                          ${link.active
                            ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                            : "bg-[#1b4965]/5 border-[#1b4965]/15 text-[#1b4965]/50 hover:bg-[#1b4965]/10"
                          }`}
                      >
                        {link.active
                          ? <><ToggleRight size={12} strokeWidth={2} /> Active</>
                          : <><ToggleLeft size={12} strokeWidth={2} /> Disabled</>
                        }
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all cursor-pointer border-solid"
                      >
                        <Trash2 size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky create button */}
        <div className="px-4 sm:px-5 pb-5 pt-3 flex-shrink-0 border-t border-[#1b4965]/8 bg-white/30">
          <button
            onClick={handleCreate}
            className="btn btn-primary w-full justify-center py-3 text-sm"
          >
            <Plus size={15} strokeWidth={2.5} />
            Generate New Share Link
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function YourMailsPage() {
  const { user } = useAuth();
  const [emails, setEmails] = useState(DEMO_EMAILS);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const isOwner = !!user;

  const getReadStorageKey = () => {
    const identity = user?.id || user?.email || "guest";
    return `mailmirror_read_${identity}`;
  };

  const getReadIds = () => {
    try {
      const raw = localStorage.getItem(getReadStorageKey());
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  };

  const saveReadIds = (idsSet) => {
    localStorage.setItem(getReadStorageKey(), JSON.stringify([...idsSet]));
  };

  const markAsRead = (messageId) => {
    if (!isOwner) return;
    const ids = getReadIds();
    ids.add(messageId);
    saveReadIds(ids);
    setEmails((prev) =>
      prev.map((mail) => (mail.id === messageId ? { ...mail, unread: false } : mail))
    );
    setSelected((prev) =>
      prev && prev.id === messageId ? { ...prev, unread: false } : prev
    );
  };

  const fetchMails = async ({ refresh = false } = {}) => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await getMailMessages();
      if (response.data?.emails) {
        const readIds = getReadIds();
        const formattedEmails = response.data.emails.map((email) => ({
          id: email.id,
          from: email.from.split("<")[0].trim() || "Unknown",
          email: email.from,
          subject: email.subject || "(No Subject)",
          preview: email.preview || "",
          body: email.body || email.preview || "",
          bodyHtml: email.bodyHtml || "",
          time: new Date(email.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          date: new Date(email.date).toLocaleDateString(),
          unread: !readIds.has(email.id),
          starred: email.starred,
          hasAttachment: email.hasAttachment,
          avatar: email.from.charAt(0).toUpperCase(),
        }));
        setEmails(formattedEmails);
      }
    } catch (err) {
      setError("Failed to load mails. Using demo data.");
      setEmails(DEMO_EMAILS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filtered = emails.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.from.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.preview.toLowerCase().includes(q);
    const matchFilter = filterUnread ? e.unread : true;
    return matchSearch && matchFilter;
  });

  const unreadCount = emails.filter((e) => e.unread).length;

  if (loading && isOwner) return <Loader />;

  return (
    <>
      {/* Error message */}
      {error && (
        <div className="mx-0 sm:mx-4 mt-3 sm:mt-4 p-3 rounded-none sm:rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Share Modal */}
      {showShare && <SharePanel onClose={() => setShowShare(false)} />}

      <main className="min-h-screen section px-0 sm:px-6 lg:px-8 py-5 sm:py-10">
        <div className="max-w-[92rem] mx-auto px-0 sm:px-4 lg:px-6">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 sm:mb-6 px-0 sm:px-0">
            <div className="min-w-0">
              <span className="section-badge">
                {isOwner ? "My Inbox" : "Shared Inbox"}
              </span>
              <h1 className="section-title text-xl sm:text-3xl mt-1">Your Mails</h1>
              <p className="text-xs sm:text-sm text-[#1b4965]/60 font-medium mt-1 truncate">
                {isOwner
                  ? `${user.email} · ${emails.length} emails, ${unreadCount} unread`
                  : `Read-only · ${emails.length} emails, ${unreadCount} unread`
                }
              </p>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b4965]/8 border border-[#1b4965]/15">
                <EyeOff size={12} strokeWidth={2} className="text-[#1b4965]" />
                <span className="text-[10px] sm:text-xs font-bold text-[#1b4965]/70 uppercase tracking-wider">View Only</span>
              </div>
              {isOwner && (
                <button
                  onClick={() => setShowShare(true)}
                  className="btn btn-primary text-xs px-3 sm:px-4 py-2"
                >
                  <Share2 size={13} strokeWidth={2.5} />
                  <span className="hidden xs:inline">Share Inbox</span>
                  <span className="xs:hidden">Share</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Public viewer notice ── */}
          {!isOwner && (
            <div className="mb-4 sm:mb-5 mx-0 sm:mx-0 flex items-start sm:items-center gap-3 px-4 py-3 rounded-none sm:rounded-2xl bg-[#bee9e8]/80 border border-[#62b6cb]/50 shadow-sm">
              <Globe size={15} strokeWidth={2} className="text-[#1b4965] flex-shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#1b4965]">You're viewing a shared inbox</p>
                <p className="text-[10px] sm:text-xs text-[#1b4965]/60 font-medium">
                  Read-only link — you cannot reply, delete or modify emails.
                </p>
              </div>
            </div>
          )}

          {/* ── Main Panel ── */}
          {/*
            Mobile:  full-height panels that switch (list ↔ detail), no dual-column
            Desktop: side-by-side, fixed height
          */}
          <div className="glass-card shadow-xl shadow-[#1b4965]/10 overflow-hidden flex flex-col lg:flex-row
            h-[calc(100svh-220px)] sm:h-[calc(100svh-200px)] lg:min-h-[620px] lg:h-[calc(100vh-220px)] lg:max-h-[820px]
            rounded-none sm:rounded-2xl">

            {/* ════════════════════════════════════
                LEFT — Email List
                Mobile:  full-width, hidden when detail open
                Desktop: fixed sidebar
            ════════════════════════════════════ */}
            <div className={`flex flex-col border-r border-[#1b4965]/10 min-h-0
              ${selected
                ? "hidden lg:flex lg:w-80 xl:w-96"   /* hide on mobile when email open */
                : "flex w-full lg:w-80 xl:w-96"       /* full width on mobile */
              }`}>

              {/* List Toolbar */}
              <div className="px-3 sm:px-4 py-3 border-b border-[#1b4965]/10 bg-white/20 flex flex-col gap-2 flex-shrink-0">
                {/* Search */}
                <div className="relative">
                  <Search size={13} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b4965]/40 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search emails..."
                    style={{ paddingLeft: "2.2rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingRight: "0.75rem", fontSize: "0.8rem" }}
                  />
                </div>

                {/* Filter row */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setFilterUnread((v) => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer
                      ${filterUnread
                        ? "bg-[#1b4965] text-[#5fa8d3] border-[#1b4965]"
                        : "bg-transparent text-[#1b4965]/60 border-[#1b4965]/20 hover:bg-[#1b4965]/8"
                      }`}
                  >
                    <Filter size={11} strokeWidth={2.5} />
                    Unread {filterUnread && `(${unreadCount})`}
                  </button>

                  <button
                    onClick={() => fetchMails({ refresh: true })}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1b4965]/50 hover:text-[#1b4965] transition-colors cursor-pointer border-none bg-transparent p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={12} strokeWidth={2.5} className={isRefreshing ? "animate-spin" : ""} />
                    {isRefreshing ? "Syncing…" : "Refresh"}
                  </button>
                </div>
              </div>

              {/* Email rows */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 gap-3 text-[#1b4965]/40">
                    <Inbox size={36} strokeWidth={1.5} />
                    <p className="text-sm font-semibold">No emails found</p>
                  </div>
                ) : (
                  filtered.map((email) => (
                    <button
                      key={email.id}
                      onClick={() => {
                        setSelected(email);
                        markAsRead(email.id);
                      }}
                      className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 border-b border-[#1b4965]/8 transition-all duration-150 cursor-pointer
                        ${selected?.id === email.id
                          ? "bg-[#1b4965]/10 border-l-2 border-l-[#1b4965]"
                          : email.unread
                            ? "bg-[#bee9e8]/50 hover:bg-[#bee9e8]/80"
                            : "bg-transparent hover:bg-white/40"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
                          ${email.unread ? "bg-[#1b4965] text-[#5fa8d3]" : "bg-[#1b4965]/12 text-[#1b4965]/60"}`}>
                          {email.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className={`text-xs truncate ${email.unread ? "font-bold text-[#1b4965]" : "font-semibold text-[#1b4965]/65"}`}>
                              {email.from}
                            </span>
                            <span className="text-[10px] text-[#1b4965]/45 flex-shrink-0 font-medium">{email.time}</span>
                          </div>
                          <p className={`text-[11px] truncate mb-1 ${email.unread ? "font-semibold text-[#1b4965]" : "font-medium text-[#1b4965]/60"}`}>
                            {email.subject}
                          </p>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[10px] text-[#1b4965]/45 truncate font-medium">{email.preview}</p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {email.starred    && <Star size={10} strokeWidth={2} className="text-amber-400 fill-amber-400" />}
                              {email.hasAttachment && <Paperclip size={10} strokeWidth={2} className="text-[#1b4965]/40" />}
                              {email.unread     && <span className="w-2 h-2 rounded-full bg-[#1b4965]" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* ════════════════════════════════════
                RIGHT — Email Detail
                Mobile:  full-width, only shown when selected
                Desktop: flex-1 always visible
            ════════════════════════════════════ */}
            <div className={`flex-1 flex flex-col min-h-0
              ${selected ? "flex w-full" : "hidden lg:flex"}`}>
              {selected ? (
                <>
                  {/* Detail Header */}
                  <div className="px-2 sm:px-6 py-3 sm:py-4 border-b border-[#1b4965]/10 bg-white/20 flex items-start gap-3 flex-shrink-0">
                    {/* Back button — mobile only */}
                    <button
                      onClick={() => setSelected(null)}
                      className="lg:hidden flex-shrink-0 w-8 h-8 rounded-lg bg-[#1b4965]/10 hover:bg-[#1b4965]/20 flex items-center justify-center text-[#1b4965] transition-colors cursor-pointer border-none mt-0.5"
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Subject */}
                      <h2 className="text-sm sm:text-base font-extrabold text-[#1b4965] leading-snug mb-2 break-words">
                        {selected.subject}
                      </h2>

                      {/* Sender + time */}
                      <div className="flex items-center gap-2 mb-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#1b4965] flex items-center justify-center text-xs font-bold text-[#5fa8d3] flex-shrink-0">
                          {selected.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-[#1b4965] block truncate">{selected.from}</span>
                          <span className="text-[10px] text-[#1b4965]/50 font-medium block truncate">{selected.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#1b4965]/50 font-medium flex-shrink-0">
                          <Clock size={10} strokeWidth={2} />
                          <span className="hidden sm:inline">{selected.date}, </span>
                          {selected.time}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selected.starred && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-[10px] font-semibold text-amber-600">
                            <Star size={9} className="fill-amber-400 text-amber-400" /> Starred
                          </span>
                        )}
                        {selected.hasAttachment && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1b4965]/8 border border-[#1b4965]/15 text-[10px] font-semibold text-[#1b4965]/60">
                            <Paperclip size={9} /> Attachment
                          </span>
                        )}
                        {selected.unread && (
                          <span className="px-2 py-0.5 rounded-full bg-[#1b4965]/10 border border-[#1b4965]/20 text-[10px] font-bold text-[#1b4965]">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="flex-1 min-h-0 px-0 sm:px-6 py-0 sm:py-5 overflow-y-auto overflow-x-hidden">
                    <div className="w-full max-w-full min-w-0">
                      {selected.bodyHtml ? (
                        <div
                          className="email-html-content w-full max-w-full overflow-x-hidden text-xs sm:text-sm text-[#1b4965]/80 font-medium leading-relaxed bg-white/40 sm:rounded-2xl p-2 sm:p-5 border-0 sm:border border-[#1b4965]/8"
                          dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(selected.bodyHtml) }}
                        />
                      ) : (
                        <div className="w-full max-w-full min-w-0 break-words text-xs sm:text-sm text-[#1b4965]/80 font-medium leading-relaxed bg-white/40 sm:rounded-2xl p-2 sm:p-5 border-0 sm:border border-[#1b4965]/8">
                          {formatBody(selected.body)}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state — desktop only */
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#1b4965]/35 px-8 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#1b4965]/8 border border-[#1b4965]/12 flex items-center justify-center">
                    <Mail size={34} strokeWidth={1.5} className="text-[#1b4965]/30" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1b4965]/40 mb-1">Select an email to read</p>
                    <p className="text-xs font-medium text-[#1b4965]/30">
                      Click any email from the list to view its contents here.
                    </p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => setShowShare(true)}
                      className="btn btn-primary text-xs px-5 py-2.5 mt-2"
                    >
                      <Share2 size={13} strokeWidth={2.5} />
                      Share Your Inbox
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ── Footer note ── */}
          <p className="text-center text-[10px] sm:text-xs text-[#1b4965]/45 font-medium mt-3 sm:mt-4 px-0 sm:px-0">
            Showing {filtered.length} of {emails.length} emails · Powered by{" "}
            <span className="font-bold text-[#1b4965]/60">MailMirror</span>
          </p>

        </div>
      </main>
    </>
  );
}