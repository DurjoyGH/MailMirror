import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../Loader/Loader";

// Redirects logged-in users away from guest-only pages (e.g. /login)
export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/your-mails" replace />;
  }

  return <Outlet />;
}