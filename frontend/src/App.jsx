import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import PublicLayout from "./components/Layouts/PublicLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import GuestRoute from "./components/ProtectedRoutes/GuestRoute";
import ScrollToTop from "./components/ScrollTop/ScrollTop";
import HomePage from "./pages/Public/HomePage";
import Login from "./pages/Auth/Login";
import YourMailsPage from "./pages/Public/YourMailsPage.jsx";
import ContactPage from "./pages/Public/ContactPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontFamily: "monospace" } }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes — anyone can access */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/your-mails" element={<YourMailsPage />} />
              <Route path="/contact" element={<ContactPage />} />

            {/* Guest only — redirect away if already logged in */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Logged-in users only */}
            <Route element={<ProtectedRoute />}>

            </Route>
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
             
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;