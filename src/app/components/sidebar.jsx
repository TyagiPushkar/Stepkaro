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
  Tag,
  Layers,
  Image as ImageIcon,
  Settings,
  Menu,
  X,
  User,
  IndianRupee,
} from "lucide-react";

import { useEffect, useState } from "react";

// =======================
// ADMIN NAVIGATION
// =======================
const adminNavItems = [
  { name: "Home", href: "/admin/home", icon: Home },
  { name: "Product", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Category", href: "/admin/categories", icon: Tag },
  { name: "Users", href: "/admin/users", icon: Users },
  // { name: "Collections", href: "/admin/collections", icon: Layers },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Account", href: "/admin/accounts", icon: User },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

// =======================
// SELLER NAVIGATION
// =======================
const sellerNavItems = [
  { name: "My Home", href: "/seller/home", icon: Home },
  { name: "My Products", href: "/seller/products", icon: Package },
  { name: "My Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "Payments", href: "/seller/payments", icon: IndianRupee },
  { name: "Account", href: "/seller/account", icon: User },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoadingUser(false);
  }, []);
  const role = user?.role;

  const navItems = role === "seller" ? sellerNavItems : adminNavItems;

  // =======================
  // THEME
  // =======================
  const sidebarTheme =
    role === "seller"
      ? "bg-gradient-to-b from-violet-700 via-purple-700 to-fuchsia-600"
      : "bg-gradient-to-b from-indigo-950 via-blue-900 to-blue-700";

  if (loadingUser) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900/95 backdrop-blur-xl border border-white/10 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-indigo-950 via-blue-900 to-blue-700 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/home" className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Step
                  <span className="text-blue-300">Karo</span>
                </h1>

                <p className="text-xs text-white/70 mt-0.5">
                  {role === "seller" ? "Seller Dashboard" : "Admin Dashboard"}
                </p>
              </div>
            </Link>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-white/70"
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />

                  <span className="font-medium text-sm">{item.name}</span>

                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {user?.name || "Admin User"}
                </p>

                <p className="text-xs text-white/70">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
