// app/components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Banknote,
  Tag,
  Layers,
  Activity,
  Image,
  Star,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Product", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Visitors", href: "/visitors", icon: TrendingUp },
  { name: "Bank/QR Orders", href: "/bank-orders", icon: Banknote },
  { name: "Category", href: "/categories", icon: Tag },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Users", href: "/users", icon: Users },
  { name: "Collections", href: "/collections", icon: Layers },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Banners", href: "/banners", icon: Image },
  { name: "Reviews", href: "/reviews", icon: Star },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Step<span className="text-teal-400">Karo</span>
              </h1>
            </Link>
            <p className="text-xs text-gray-500 mt-2">Admin Dashboard</p>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}