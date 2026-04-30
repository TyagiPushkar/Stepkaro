// app/components/Sidebar.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
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
  Image as ImageIcon,
  Settings,
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
  { name: "Category", href: "/categories", icon: Tag },
  { name: "Users", href: "/users", icon: Users },
  { name: "Collections", href: "/collections", icon: Layers },
  { name: "Banners", href: "/banners", icon: ImageIcon },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900/95 backdrop-blur-xl border border-white/10 text-white"
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

      {/* Sidebar - Blue gradient: darker on top, lighter on bottom */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-indigo-950 via-blue-900 to-blue-700 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-white/10">
            <Link href="/home" className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Image
                  src="/logo.jpeg"
                  alt="StepKaro Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Step<span className="text-blue-300">Karo</span>
                </h1>
                <p className="text-xs text-blue-200/70 mt-0.5">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-white/60 hover:text-white"
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
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer section matching screenshot style */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-blue-200/70">admin@stepkaro.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}