import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../Loader/Loader";

export default function ProtectedRoute({
  adminOnly = false,
  redirectTo = "/login",
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  // TODO: Add admin role check when added to User schema
  // if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}