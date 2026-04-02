import { Outlet } from "react-router-dom";
import Navbar from "../Navigations/Navbar";
import Footer from "../Navigations/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#bee9e8]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}