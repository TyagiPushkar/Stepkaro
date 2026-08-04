"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Clock,
  Building2,
  Headphones,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { ArrowDownTrayIcon, Bars3Icon } from "@heroicons/react/24/solid";

export default function ContactUsPage() {
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
              <Link href="/contactus" className="text-[#ff6b00] transition">
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
              <Link href="/contactus" className="block py-1 text-[#ff6b00]">
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
                  <Headphones className="w-3 h-3" /> Support & Assistance
                </span>
                <span className="text-[11px] text-purple-200 flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  <Building2 className="w-3 h-3 text-amber-300" /> Stepkaro Technologies Pvt. Ltd.
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Contact Us
              </h1>
              <p className="text-purple-200 text-xs md:text-sm mt-1 max-w-2xl font-medium">
                Connecting Footwear Wholesalers Directly with Manufacturers across India.
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

        {/* Main Content Area - Compact Gaps & Padding */}
        <main className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 space-y-5">
          {/* Quick Contact Information Cards - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone Card */}
            <a
              href="tel:+919217056915"
              className="group bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-[#ff6b00] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#ff6b00] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#ff6b00] group-hover:text-white transition-all">
                <Phone className="w-5 h-5" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Direct Phone Support</p>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 group-hover:text-[#ff6b00] transition-colors">
                +91 9217056915
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-500" /> Mon - Fri (10:00 AM – 6:00 PM)
              </p>
            </a>

            {/* Email Card */}
            <a
              href="mailto:info@stepkaro.in"
              className="group bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-purple-600 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-purple-700 group-hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Inquiry</p>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 group-hover:text-purple-700 transition-colors">
                info@stepkaro.in
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-purple-600" /> Response within 24 hours
              </p>
            </a>

            {/* Website Card */}
            <a
              href="https://www.stepkaro.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Official Website</p>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors">
                www.stepkaro.in
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" /> B2B Footwear Portal
              </p>
            </a>
          </div>

          {/* Business Hours & Support Services Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Business Hours Card (5/12) */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Business Hours</h3>
                    <p className="text-[10px] text-slate-500">Operating Schedule</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Days</span>
                    <span className="font-extrabold text-purple-900">Monday to Friday</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Hours</span>
                    <span className="font-extrabold text-[#ff6b00]">10:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[11px] font-semibold text-emerald-900">
                  Support active during business operating hours
                </p>
              </div>
            </div>

            {/* Support Assistance Section (7/12) */}
            <div className="lg:col-span-7 bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#ff6b00] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Support Services</h3>
                    <p className="text-[10px] text-slate-500">How our team can assist you</p>
                  </div>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed mb-3">
                  For account assistance, onboarding, business inquiries, or partnership opportunities, please contact our support team.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Account Registration & Login Assistance",
                    "Wholesaler Onboarding Support",
                    "Manufacturer Listing Guidance",
                    "Business & Partnership Inquiries",
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2.5 bg-purple-50/60 rounded-lg border border-purple-100 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                      <span className="font-semibold text-slate-800">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Commitment Banner - Compact */}
          <div className="bg-gradient-to-r from-[#170a3b] via-purple-900 to-[#ff6b00] text-white rounded-2xl p-6 shadow-md border border-purple-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="max-w-3xl">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                Our Commitment
              </span>
              <p className="text-sm md:text-base font-bold mt-1 text-white leading-relaxed">
                "We are committed to helping wholesalers discover manufacturers and helping manufacturers grow their business across India."
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 px-6 py-2.5 bg-white text-purple-950 hover:bg-orange-100 font-bold text-xs rounded-full shadow-sm transition active:scale-95"
            >
              Get Started Now
            </Link>
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
