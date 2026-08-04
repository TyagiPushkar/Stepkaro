"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  Building2,
  Calendar,
  Lock,
  UserCheck,
  Eye,
  CreditCard,
  Bell,
  Cookie,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ArrowDownTrayIcon, Bars3Icon } from "@heroicons/react/24/solid";

export default function BuyerPrivacyPolicyPage() {
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

        {/* Hero Section Banner */}
        <section className="bg-gradient-to-r from-[#170a3b] via-purple-900 to-[#170a3b] text-white py-6 px-4 md:px-6 border-b border-purple-800/40 relative overflow-hidden">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/40 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Buyer Protection Policy
                </span>
                <span className="text-[11px] text-purple-200 flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  <Building2 className="w-3 h-3 text-amber-300" /> Stepkaro Buyer App
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Buyer Privacy Policy
              </h1>
              <p className="text-purple-200 text-xs md:text-sm mt-1 max-w-2xl">
                How Stepkaro collects, uses, stores, and protects personal and business information for registered buyers & wholesalers.
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

        {/* Main Content Area - Wide Container */}
        <main className="max-w-[1500px] mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Main Content Column (8/12) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Overview */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-purple-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Overview</h2>
                    <p className="text-[10px] text-slate-500">Stepkaro Buyer Privacy Commitment</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  Stepkaro Buyer App (“Stepkaro”, “we”, “our”, or “us”) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you use our mobile application and related services.
                </p>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                  <p className="text-xs text-purple-900 font-medium">
                    By using the Stepkaro Buyer App, you acknowledge that you have read, understood, and agree to this Privacy Policy.
                  </p>
                </div>
              </div>

              {/* 1. Information We Collect */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-orange-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#ff6b00] flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
                    <p className="text-[10px] text-slate-500">Data gathered during account creation & ordering</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-xs mb-1.5 text-[#ff6b00]">Personal Details</h3>
                    <ul className="text-xs text-slate-600 space-y-1 font-medium">
                      <li>• Full Name</li>
                      <li>• Mobile Number</li>
                      <li>• Email Address</li>
                      <li>• Business / Firm Name</li>
                      <li>• GST Number (if applicable)</li>
                      <li>• Shipping Address</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-xs mb-1.5 text-purple-700">Order Information</h3>
                    <ul className="text-xs text-slate-600 space-y-1 font-medium">
                      <li>• Products viewed & ordered</li>
                      <li>• Order history & statuses</li>
                      <li>• Selected payment method</li>
                      <li>• Delivery preferences</li>
                      <li>• Tax invoices</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-xs mb-1.5 text-blue-600">Device Information</h3>
                    <ul className="text-xs text-slate-600 space-y-1 font-medium">
                      <li>• Device model</li>
                      <li>• Operating system</li>
                      <li>• App version</li>
                      <li>• IP address & device ID</li>
                      <li>• Diagnostic crash logs</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Location Information:</span> With your explicit permission, we may access location data to improve delivery logistics and location-based discovery.
                  </p>
                </div>
              </div>

              {/* 2. How We Use Your Information */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-emerald-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">2. How We Use Your Information</h2>
                    <p className="text-[10px] text-slate-500">Operational & platform usage purposes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {[
                    "Create and manage buyer accounts",
                    "Process and fulfill footwear orders",
                    "Connect buyers directly with footwear manufacturers",
                    "Provide prompt customer support",
                    "Send order confirmations & dispatch tracking",
                    "Enhance security and prevent fraudulent activities",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 border border-slate-150">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-xs text-emerald-900 font-bold">
                    ⚠️ We do not sell, rent, or trade your personal information to third parties under any circumstances.
                  </p>
                </div>
              </div>

              {/* 3. Information Sharing */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-blue-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">3. Information Sharing</h2>
                    <p className="text-[10px] text-slate-500">Third-party service provider access</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-2.5 font-medium">Your information may be shared strictly as necessary with:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    "Registered Sellers",
                    "Logistics Partners",
                    "Payment Gateways",
                    "Cloud Hosting",
                    "Analytics Services",
                    "Crash Diagnostics",
                    "Legal Authorities",
                  ].map((item, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg text-center text-xs font-bold text-slate-700 border border-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Payment & Data Security */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-slate-200 hover:border-red-300 transition">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">4. Payment & Data Security</h2>
                    <p className="text-[10px] text-slate-500">Security standards & retention rules</p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Payments are processed through PCI-compliant third-party gateways. Stepkaro does not store complete debit/credit card or banking password details on its servers.
                </p>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-900 font-semibold">
                    🔒 We employ industry-standard encryption, firewalls, and technical safeguards to protect all user data against unauthorized access.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Column (4/12) */}
            <div className="lg:col-span-4 space-y-4">
         
              <div className="bg-gradient-to-br from-[#170a3b] to-purple-900 text-white rounded-xl p-5 shadow-sm border border-purple-800">
                <div className="w-9 h-9 rounded-lg bg-[#ff6b00] flex items-center justify-center text-white font-bold mb-3 shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold mb-1">Privacy Support</h3>
                <p className="text-purple-200 text-[11px] leading-relaxed mb-4">
                  For privacy queries or data access requests:
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
                    href="/seller-privacy-policy"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#ff6b00] border border-slate-200 transition"
                  >
                    <span>Seller Privacy Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/termconditions"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#ff6b00] border border-slate-200 transition"
                  >
                    <span>Terms & Conditions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/refundpolicy"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#ff6b00] border border-slate-200 transition"
                  >
                    <span>Refund Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
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
