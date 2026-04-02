import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMe } from "../../services/authApi";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");
      const error = searchParams.get("error");
      const message = searchParams.get("message");

      console.log("🔍 [Auth Callback] Params received:", {
        token: token ? "✅ Yes" : "❌ No",
        userId,
        error,
        message,
      });

      if (error || message) {
        console.error("❌ [Auth Callback] Auth error:", message);
        navigate(`/login?error=${encodeURIComponent(message || "Authentication failed")}`);
        return;
      }

      if (token && userId) {
        console.log("✅ [Auth Callback] Token received, storing...");
        
        // Save token to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        
        console.log("📡 [Auth Callback] Validating token with backend...");
        
        try {
          // Validate token and get user data
          const response = await getMe();
          console.log("✅ [Auth Callback] User validated:", response.data?.user?.email);
          
          if (response.data?.user) {
            // Populate auth context with user data
            setUserAndToken(response.data.user, token);
            console.log("✅ [Auth Callback] Auth context populated, navigating to /your-mails...");
            navigate("/your-mails");
          } else {
            throw new Error("No user data in response");
          }
        } catch (err) {
          console.error("❌ [Auth Callback] Validation failed:", err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate(`/login?error=Token validation failed: ${err.message}`);
        }
      } else {
        console.error("❌ [Auth Callback] No token received");
        navigate("/login?error=No token received");
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUserAndToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#62b6cb]/20">
          <div className="w-8 h-8 border-4 border-[#62b6cb] border-t-[#1b4965] rounded-full animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-[#1b4965] mb-1">Signing you in...</h2>
        <p className="text-sm text-[#1b4965]/60">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}
