import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logout as logoutApi } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        console.log("🔍 [Auth Context] Checking for stored token:", storedToken ? "✅ Found" : "❌ Not found");

        if (storedToken) {
          setToken(storedToken);
          console.log("📡 [Auth Context] Calling getMe() to validate token...");

          // Validate token with backend
          const response = await getMe();
          console.log("✅ [Auth Context] getMe() response:", response.data?.user);
          
          if (response.data?.user) {
            console.log("✅ [Auth Context] User authenticated:", response.data.user.email);
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            console.error("❌ [Auth Context] No user data in response");
          }
        } else {
          console.log("ℹ️ [Auth Context] No stored token found");
        }
      } catch (err) {
        console.error("❌ [Auth Context] Auth initialization error:", err.message);
        // Token is invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setUserAndToken = (newUser, newToken) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        setUserAndToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}