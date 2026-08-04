"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  UserCheck,
  Lock,
  Building2,
  AlertTriangle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Scale,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { ArrowDownTrayIcon, Bars3Icon } from "@heroicons/react/24/solid";

export default function TermsAndConditionsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Header / Navbar */}
        <header className="sticky top-0 z-50 bg-[#170a3b] text-white border-b border-purple-950/60 shadow-md">
          <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 bg-purple-900 flex items-center justify-center shadow-xs">
                <Image
                  src="/logo1.png"
                  alt="Stepkaro Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white leading-none">
                  Step<span className="text-[#ff6b00]">karo</span>
                </h1>
                <p className="text-[9px] text-slate-300 font-medium tracking-wide">
                  Factories at Your Doorstep
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-200">
              <Link href="/" className="hover:text-[#ff6b00] transition">
                Home
              </Link>
              <Link href="/#how-it-works" className="hover:text-[#ff6b00] transition">
                How It Works
              </Link>
              <Link href="/#benefits" className="hover:text-[#ff6b00] transition">
                For Wholesalers
              </Link>
              <Link href="/#benefits" className="hover:text-[#ff6b00] transition">
                For Manufacturers
              </Link>
              <Link href="/#why-choose" className="hover:text-[#ff6b00] transition">
                Features
              </Link>
              <Link href="/contactus" className="hover:text-[#ff6b00] transition">
                Contact Us
              </Link>
              <Link href="/login" className="hover:text-[#ff6b00] transition">
                Login
              </Link>
            </nav>

            {/* Download App & Mobile Menu */}
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff6b00] hover:bg-orange-600 text-white font-bold text-xs transition shadow-sm active:scale-95"
              >
                <ArrowDownTrayIcon className="w-3.5 h-3.5 text-white" />
                <span>Download App</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg bg-purple-900/60 text-slate-200 hover:text-white"
                aria-label="Toggle menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-[#170a3b] border-t border-purple-900/60 px-5 py-3 space-y-2 text-xs font-semibold">
              <Link href="/" className="block py-1 text-slate-200 hover:text-[#ff6b00]">
                Home
              </Link>
              <Link href="/contactus" className="block py-1 text-slate-200 hover:text-[#ff6b00]">
                Contact Us
              </Link>
              <Link href="/login" className="block py-1 text-slate-200 hover:text-[#ff6b00]">
                Login
              </Link>
            </div>
          )}
        </header>

        {/* Hero Section Banner - Compact */}
        <section className="bg-gradient-to-r from-[#170a3b] via-purple-900 to-[#170a3b] text-white py-6 px-4 md:px-6 border-b border-purple-800/40 relative overflow-hidden">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/40 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                  <Scale className="w-3 h-3" /> Legal Terms
                </span>
                <span className="text-[11px] text-purple-200 flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  <Calendar className="w-3 h-3 text-amber-300" /> Updated: June 2026
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-purple-200 text-xs md:text-sm mt-1 max-w-2xl">
                By accessing or using Stepkaro, you agree to the following terms and conditions.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </section>

        {/* Main Content Area - Reduced Padding & Spacing */}
        <main className="max-w-[1500px] mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Main Content Column (8/12) */}
            <div className="lg:col-span-12 space-y-4">
              {/* Introduction Banner */}
              <div className="bg-purple-900 text-white rounded-xl p-4 shadow-xs border border-purple-800 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#ff6b00] shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">
                  By accessing or using Stepkaro, you agree to the following terms.
                </p>
              </div>

              {/* 1. Platform Purpose */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-orange-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#ff6b00] flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Platform Purpose</h2>
                    <p className="text-[10px] text-slate-500">B2B Footwear Connectivity</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Stepkaro is a B2B footwear platform designed to connect footwear wholesalers directly with manufacturers.
                </p>
              </div>

              {/* 2. User Eligibility */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-purple-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">User Eligibility</h2>
                    <p className="text-[10px] text-slate-500">Authorized Trade Entities</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Users must be legally authorized businesses, manufacturers, wholesalers, distributors, or related footwear trade entities.
                </p>
              </div>

              {/* 3. Account Responsibility */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-blue-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Account Responsibility</h2>
                    <p className="text-[10px] text-slate-500">Confidentiality & Accuracy</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Users are responsible for maintaining the confidentiality of their account credentials and ensuring that information provided is accurate.
                </p>
              </div>

              {/* 4. Business Transactions */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-amber-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Business Transactions</h2>
                    <p className="text-[10px] text-slate-500">Platform Facilitation Disclaimer</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  Stepkaro acts as a technology platform facilitating business connections.
                </p>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                    The platform is not a party to transactions between buyers and sellers.
                  </p>
                </div>
              </div>

              {/* 5. Product Information */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-emerald-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Product Information</h2>
                    <p className="text-[10px] text-slate-500">Manufacturer Responsibility</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Manufacturers are responsible for ensuring that product details, pricing, stock information, and descriptions are accurate.
                </p>
              </div>

              {/* 6. Prohibited Activities */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-red-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Prohibited Activities</h2>
                    <p className="text-[10px] text-slate-500">Users shall not:</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Provide false information",
                    "Misuse platform data",
                    "Engage in fraudulent activities",
                    "Violate applicable laws",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Suspension of Accounts */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-amber-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Suspension of Accounts</h2>
                    <p className="text-[10px] text-slate-500">Account Enforcement</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Stepkaro reserves the right to suspend or terminate accounts that violate these terms.
                </p>
              </div>

              {/* 8. Limitation of Liability */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-purple-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Limitation of Liability</h2>
                    <p className="text-[10px] text-slate-500">Liability Waiver</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Stepkaro shall not be liable for disputes, losses, delays, quality issues, or damages arising from transactions between users.
                </p>
              </div>

              {/* 9. Changes to Terms */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-slate-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Changes to Terms</h2>
                    <p className="text-[10px] text-slate-500">Updates & Revisions</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  These terms may be updated periodically. Continued use of the platform constitutes acceptance of revised terms.
                </p>
              </div>
            </div>

            {/* Sidebar Column (4/12) */}
            {/* <div className="lg:col-span-4 space-y-4">
           
              <div className="bg-gradient-to-br from-[#170a3b] to-purple-900 text-white rounded-xl p-5 shadow-sm border border-purple-800">
                <div className="w-9 h-9 rounded-lg bg-[#ff6b00] flex items-center justify-center text-white font-bold mb-3 shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold mb-1">Contact for Support</h3>
                <p className="text-purple-200 text-[11px] leading-relaxed mb-4">
                  For support or inquiries regarding these terms:
                </p>

                <div className="space-y-2.5">
                  <a
                    href="mailto:info@stepkaro.in"
                    className="flex items-center gap-2.5 p-2.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/15 transition"
                  >
                    <Mail className="w-4 h-4 text-[#ff6b00]" />
                    <div>
                      <p className="text-[9px] text-purple-300 font-semibold uppercase">Email</p>
                      <p className="text-xs font-bold text-white">info@stepkaro.in</p>
                    </div>
                  </a>

                  <a
                    href="tel:+919217056915"
                    className="flex items-center gap-2.5 p-2.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/15 transition"
                  >
                    <Phone className="w-4 h-4 text-[#ff6b00]" />
                    <div>
                      <p className="text-[9px] text-purple-300 font-semibold uppercase">Phone</p>
                      <p className="text-xs font-bold text-white">+91 9217056915</p>
                    </div>
                  </a>
                </div>
              </div>

  
              <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#ff6b00]" /> Other Platform Policies
                </h3>
                <div className="space-y-1.5 text-xs font-semibold">
                  <Link
                    href="/refundpolicy"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#ff6b00] border border-slate-200 transition"
                  >
                    <span>Refund Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/buyer-privacy-policy"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#ff6b00] border border-slate-200 transition"
                  >
                    <span>Buyer Privacy Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/seller-privacy-policy"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#ff6b00] border border-slate-200 transition"
                  >
                    <span>Seller Privacy Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#ff6b00] py-3 px-4 md:px-6 text-white text-[11px] font-semibold mt-6">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© 2026 Stepkaro Technologies Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-3 text-white font-bold">
            <Link href="/seller-privacy-policy" className="hover:underline">
              Seller Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/buyer-privacy-policy" className="hover:underline">
              Buyer Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/termconditions" className="hover:underline">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/refundpolicy" className="hover:underline">
              Refund Policy
            </Link>
            <span>|</span>
            <Link href="/contactus" className="hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
