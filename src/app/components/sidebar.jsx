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
  Wallet,
  Store,
  CornerUpLeftIcon,
  Ticket,
  MessageSquare,
  Cross,
  CrossIcon,
  Crosshair,
  BookAIcon,
  Book,
} from "lucide-react";

import { useEffect, useState } from "react";

// =======================
// ADMIN NAVIGATION
// =======================
const adminNavItems = [
  { name: "Home", href: "/admin/home", icon: Home },
  { name: "Product", href: "/admin/products", icon: Package },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Category", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "QR/BANK Orders", href: "/admin/qr-orders", icon: ShoppingCart },
  {
    name: "Notifications",
    href: "/admin/push_notification",
    icon: MessageSquare,
  },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Sellers", href: "/admin/vendors", icon: Store },
  { name: "Report", href: "/admin/report", icon: Book },
  // { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Enquiry", href: "/admin/enquiry", icon: MessageSquare },
  // { name: "Collections", href: "/admin/collections", icon: Layers },
  { name: "Accounts", href: "/admin/accounts", icon: Wallet },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
  // { name: "Logout", href: "/admin/logout", icon: IndianRupee },
];

// =======================
// SELLER NAVIGATION
// =======================
const sellerNavItems = [
  { name: "My Home", href: "/seller/home", icon: Home },
  { name: "My Products", href: "/seller/products", icon: Package },
  { name: "My Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "My Coupons", href: "/seller/coupons", icon: Tag },
  {
    name: "Restricted Districts",
    href: "/seller/restricted-districts",
    icon: Crosshair,
  },
  { name: "Payments", href: "/seller/payments", icon: IndianRupee },
  { name: "Account", href: "/seller/account", icon: User },
  // { name: "Logout", href: "/seller/logout", icon: IndianRupee },
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
  // THEME - WHITE THEME
  // =======================
  const sidebarTheme =
    role === "seller"
      ? "bg-gradient-to-b from-purple-50 via-white to-orange-50"
      : "bg-gradient-to-b from-purple-50 via-white to-orange-50";

  if (loadingUser) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 text-gray-700"
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
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-purple-50 via-white to-orange-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto border-r border-gray-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/home" className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg backdrop-blur-sm flex items-center justify-center border border-gray-200">
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Step
                  <span className="text-purple-600">Karo</span>
                </h1>

                <p className="text-xs text-gray-500 mt-0.5">
                  {role === "seller" ? "Seller Dashboard" : "Admin Dashboard"}
                </p>
              </div>
            </Link>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
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
                      ? "bg-gradient-to-r from-purple-50 to-orange-50 text-purple-700 border border-purple-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-purple-600" : "text-gray-500"}
                  />

                  <span className="font-medium text-sm">{item.name}</span>

                  {isActive && (
                    <div className="ml-auto w-1.5 h-6 bg-purple-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-orange-50 border border-gray-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Admin User"}
                </p>

                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
