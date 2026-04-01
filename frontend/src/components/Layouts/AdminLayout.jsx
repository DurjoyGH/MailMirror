import { useState } from "react";
import AdminSidebar from "../Navigations/AdminSidebar";
import Navbar from "../Navigations/Navbar";
import ScrollTop from "../ScrollTop/ScrollTop";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#bee9e8] font-montserrat">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <ScrollTop />
    </div>
  );
}
