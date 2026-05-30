"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "../components/sidebar";

export default function MainLayout({
  children,
}) {
  const router = useRouter();

  const pathname = usePathname();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    // not logged in
    if (!storedUser) {
      router.push("/");
      return;
    }

    const user = JSON.parse(storedUser);

    const role =
      user?.role?.toLowerCase();

    // seller trying admin
    if (
      pathname.startsWith("/admin") &&
      role !== "admin"
    ) {
      router.push("/seller/home");
      return;
    }

    // admin trying seller
    if (
      pathname.startsWith("/seller") &&
      role !== "seller"
    ) {
      router.push("/admin/home");
      return;
    }

    setLoading(false);

  }, [pathname, router]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      <Sidebar />

      <div className="lg:pl-72">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}