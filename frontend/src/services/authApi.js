import api from "./api";

/**
 * Get Google OAuth URL for login
 * Redirects to backend handler (registered redirect_uri in Google Console)
 */
export const getGoogleAuthUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // Must match redirect_uri registered in Google Console
  const redirectUri = `${apiUrl}/auth/google/callback`;
  const scope = [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/gmail.readonly",
  ].join(" ");

  console.log("🔗 [Auth API] Initiating Google OAuth");
  console.log("   Client ID:", clientId);
  console.log("   Redirect URI:", redirectUri);

  // access_type=offline to get refresh token
  // prompt=consent to show consent screen every time
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
};

/**
 * Register with email
 * @param {Object} data - { email: string, name: string }
 */
export const registerWithEmail = (data) =>
  api.post("/auth/register/email", data);

/**
 * Verify email with token
 * @param {Object} data - { email: string, token: string }
 */
export const verifyEmail = (data) =>
  api.post("/auth/verify-email", data);

/**
 * Get current authenticated user
 */
export const getMe = () => api.get("/auth/me");

/**
 * Logout current session
 */
export const logout = () => api.post("/auth/logout");

/**
 * Logout from all sessions
 */
export const logoutAll = () => api.post("/auth/logout-all");