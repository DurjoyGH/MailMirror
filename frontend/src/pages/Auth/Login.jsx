import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, ArrowRight, Lock, User, Loader } from "lucide-react";
import { getGoogleAuthUrl, registerWithEmail, verifyEmail } from "../../services/authApi";

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // "login" | "register" | "forgot"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  // Handle Google login redirect
  const handleGoogleLogin = () => {
    try {
      const authUrl = getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError("Failed to initiate Google login");
    }
  };

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "login") {
        // Email login - not implemented in backend yet
        setError("Email login will be implemented with password hash");
      } else if (tab === "register") {
        // Register with email
        if (form.password !== form.confirm) {
          throw new Error("Passwords do not match");
        }
        if (form.password.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }

        const response = await registerWithEmail({
          email: form.email,
          name: form.name,
        });

        if (response.data) {
          // Show verification tab
          setTab("verify");
          setForm({ ...form, password: "", confirm: "" });
        }
      } else if (tab === "forgot") {
        setError("Password reset will be implemented soon");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[#62b6cb]/30 blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#5fa8d3]/20 blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="bg-dot-grid absolute inset-0 pointer-events-none opacity-10" />

      {/* Card */}
      <div className="glass-card w-full max-w-md shadow-2xl shadow-[#1b4965]/15 animate-fade-up">

        {/* ── Card Header ── */}
        <div className="bg-[#62b6cb] px-8 py-7 rounded-t-2xl text-center">
          <NavLink to="/" className="inline-flex items-center gap-2 justify-center group mb-1">
            <span className="w-9 h-9 bg-[#1b4965] rounded-xl flex items-center justify-center shadow-md group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-200">
              <Mail size={18} strokeWidth={2.5} className="text-[#5fa8d3]" />
            </span>
            <span className="text-[1.3rem] font-extrabold tracking-tight text-[#1b4965]"
              style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Mail<span className="text-white">Mirror</span>
            </span>
          </NavLink>

          <p className="text-xs font-semibold text-[#1b4965]/70 mt-2 tracking-wide">
            {tab === "login"   && "Welcome back! Sign in to continue."}
            {tab === "register" && "Create your free account today."}
            {tab === "forgot"  && "We'll send you a reset link."}
          </p>
        </div>

        {/* ── Tab switcher (Login / Register) ── */}
        {tab !== "forgot" && (
          <div className="flex border-b border-[#1b4965]/10 bg-white/20">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-bold tracking-wide capitalize transition-all duration-200 cursor-pointer border-none
                  ${tab === t
                    ? "text-[#1b4965] border-b-2 border-[#1b4965] bg-white/30"
                    : "text-[#1b4965]/50 hover:text-[#1b4965]/80 hover:bg-white/20"
                  }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
        )}

        {/* ── Card Body ── */}
        <div className="px-8 py-8">

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* ── Google Button (always shown except forgot) ── */}
          {tab !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-[#1b4965] font-bold text-sm border-2 border-[#1b4965]/15 shadow-sm hover:shadow-md hover:border-[#1b4965]/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#1b4965]/15" />
                <span className="text-xs font-semibold text-[#1b4965]/40 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-[#1b4965]/15" />
              </div>
            </>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name — register only */}
            {tab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1b4965]/70 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b4965]/40 pointer-events-none z-10" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1b4965]/70 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b4965]/40 pointer-events-none z-10" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            {/* Password — login & register */}
            {tab !== "forgot" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1b4965]/70 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b4965]/40 pointer-events-none z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={tab === "register" ? "Create a strong password" : "Enter your password"}
                    required
                    style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1b4965]/40 hover:text-[#1b4965] transition-colors cursor-pointer border-none bg-transparent p-0"
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password — register only */}
            {tab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1b4965]/70 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b4965]/40 pointer-events-none z-10" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                    style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1b4965]/40 hover:text-[#1b4965] transition-colors cursor-pointer border-none bg-transparent p-0"
                  >
                    {showConfirm ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password link — login only */}
            {tab === "login" && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => setTab("forgot")}
                  className="text-xs font-semibold text-[#1b4965]/60 hover:text-[#1b4965] transition-colors cursor-pointer border-none bg-transparent p-0 underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button — uses global .btn .btn-primary */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-1 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader size={15} className="animate-spin" /> Processing...</>
              ) : tab === "login" ? (
                <><ArrowRight size={15} strokeWidth={2.5} /> Sign In</>
              ) : tab === "register" ? (
                <><User size={15} strokeWidth={2.5} /> Create Account</>
              ) : (
                <><Mail size={15} strokeWidth={2.5} /> Send Reset Link</>
              )}
            </button>

          </form>

          {/* ── Back to login (forgot tab) ── */}
          {tab === "forgot" && (
            <p className="text-center text-xs text-[#1b4965]/60 font-medium mt-5">
              Remembered it?{" "}
              <button
                onClick={() => setTab("login")}
                className="font-bold text-[#1b4965] hover:underline underline-offset-2 cursor-pointer border-none bg-transparent p-0"
              >
                Back to Sign In
              </button>
            </p>
          )}

          {/* ── Bottom switch hint ── */}
          {tab !== "forgot" && (
            <p className="text-center text-xs text-[#1b4965]/60 font-medium mt-5">
              {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setTab(tab === "login" ? "register" : "login")}
                className="font-bold text-[#1b4965] hover:underline underline-offset-2 cursor-pointer border-none bg-transparent p-0"
              >
                {tab === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          )}
        </div>

        {/* ── Card Footer ── */}
        <div className="px-8 pb-6 text-center">
          <p className="text-[11px] text-[#1b4965]/40 font-medium leading-relaxed">
            By continuing, you agree to our{" "}
            <NavLink to="/terms" className="underline underline-offset-2 hover:text-[#1b4965]/70">Terms of Service</NavLink>
            {" "}and{" "}
            <NavLink to="/privacy" className="underline underline-offset-2 hover:text-[#1b4965]/70">Privacy Policy</NavLink>.
          </p>
        </div>

      </div>
    </main>
  );
}