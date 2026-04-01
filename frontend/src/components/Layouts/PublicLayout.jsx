import Navbar from "../Navigations/Navbar";
import Footer from "../Navigations/Footer";
import ScrollTop from "../ScrollTop/ScrollTop";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#bee9e8] font-montserrat">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollTop />
    </div>
  );
}
