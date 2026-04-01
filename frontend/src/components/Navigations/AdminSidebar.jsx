import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, UserPlus, Mail, MessageSquare, Menu, X } from "lucide-react";

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Add Admin", icon: UserPlus, path: "/admin/add-admin" },
    { label: "Send Email", icon: Mail, path: "/admin/send-email" },
    { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 h-screen bg-[#62b6cb] text-white font-montserrat transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 md:w-64"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-[#5fa8d3]">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Exo 2, sans-serif" }}>
            Admin
          </h2>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-[#1b4965] text-[#5fa8d3]"
                    : "text-white hover:bg-[#5fa8d3] hover:text-[#1b4965]"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
