"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  CubeIcon,
  GlobeAsiaAustraliaIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  SparklesIcon,
  ClockIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
  UserIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  Bars3Icon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon as ArrowRightOutlineIcon } from "@heroicons/react/24/outline";
export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleJoinAsWholesaler = () => router.push("/wholesellerform");
  const handleJoinAsManufacturer = () => router.push("/manufactureform");
  const handleLogin = () => router.push("/login");

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#170a3b] text-white border-b border-purple-950/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-purple-900 flex items-center justify-center shadow-md">
              <Image
                src="/logo1.png"
                alt="Stepkaro Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                Step<span className="text-[#ff6b00]">karo</span>
              </h1>
              <p className="text-[10px] text-slate-300 font-medium tracking-wide">
                Factories at Your Doorstep
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-200">
            <a href="#" className="hover:text-[#ff6b00] transition">
              Home
            </a>
            <a href="#how-it-works" className="hover:text-[#ff6b00] transition">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#ff6b00] transition">
              For Wholesalers
            </a>
            <a href="#benefits" className="hover:text-[#ff6b00] transition">
              For Manufacturers
            </a>
            <a href="#why-choose" className="hover:text-[#ff6b00] transition">
              Features
            </a>
            <a href="#support" className="hover:text-[#ff6b00] transition">
              Contact Us
            </a>
            <a href="/login" className="hover:text-[#ff6b00] transition">
              Login
            </a>
          </nav>

          {/* CTA Download App Button & Mobile Menu Button */}
          {/* <div className="flex items-center gap-3 sm:gap-3">
            <button
              onClick={handleLogin}
              className="px-5 py-2.5 rounded-full bg-[#ff6b00] hover:bg-orange-600 text-white font-bold text-sm transition shadow-md shadow-orange-500/30 flex items-center gap-2 active:scale-95"
            >
              <ArrowDownTrayIcon className="w-4 h-4 text-white" />
              <span>Download App</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-purple-900/60 text-slate-200 hover:text-white"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div> */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogin}
              className="flex items-center gap-1 sm:gap-2
               px-3 py-2 sm:px-5 sm:py-2.5
               rounded-full
               bg-[#ff6b00] hover:bg-orange-600
               text-white font-semibold sm:font-bold
               text-xs sm:text-sm
               transition shadow-md shadow-orange-500/30
               active:scale-95"
            >
              <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span>Download App</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-purple-900/60 text-slate-200 hover:text-white"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#170a3b] border-t border-purple-900/60 px-6 py-4 space-y-3 text-sm font-semibold">
            <a
              href="#"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              For Wholesalers
            </a>
            <a
              href="#benefits"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              For Manufacturers
            </a>
            <a
              href="#why-choose"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              Features
            </a>
            <a
              href="#support"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              Contact Us
            </a>
            <a
              href="/login"
              className="block py-1 text-slate-200 hover:text-[#ff6b00]"
            >
              Login
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-[#170a3b] text-white pt-10 pb-24 md:pb-32 overflow-hidden"
        style={{
          borderBottomLeftRadius: "35% 70px",
          borderBottomRightRadius: "35% 70px",
        }}
      >
        {/* Background Accent Wave */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-15 pointer-events-none hidden md:block">
          <div className="w-[600px] h-[600px] bg-gradient-to-br from-orange-500 to-amber-600 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-extrabold uppercase leading-tight tracking-tight text-white">
                Stepkaro Directly Connects{" "}
                <span className="text-[#ff6b00] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black drop-shadow-md">
                  Wholesalers
                </span>{" "}
                With Footwear{" "}
                <span className="text-[#ff6b00] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black drop-shadow-md">
                  Factories
                </span>{" "}
                {/* Across India */}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Stepkaro helps footwear wholesalers discover manufacturers
                directly, access factory prices, view live stock and place
                orders anytime – without middlemen.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={handleLogin}
                  className="px-6 py-3.5 rounded-xl bg-[#ff6b00] hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-600/30 transition flex items-center gap-2.5 active:scale-95"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                  <span>Download App</span>
                </button>

                <button
                  onClick={handleJoinAsManufacturer}
                  className="px-5 py-3.5 rounded-xl bg-[#231054] border border-slate-400/40 hover:border-white text-white font-bold text-sm transition shadow-md active:scale-95"
                >
                  Join as Manufacturer
                </button>

                <button
                  onClick={handleJoinAsWholesaler}
                  className="px-5 py-3.5 rounded-xl bg-[#231054] border border-slate-400/40 hover:border-white text-white font-bold text-sm transition shadow-md active:scale-95"
                >
                  Join as Wholesaler
                </button>
              </div>
            </div>

            {/* Hero Right Mockup Image */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="relative w-full max-w-lg lg:max-w-none h-[400px] sm:h-[400px] md:h-[480px] lg:h-[500px]">
                <Image
                  src="/mobile_image.png"
                  alt="Stepkaro Mobile App Display"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Stats Strip */}
      <section className="-mt-14 md:-mt-20 relative z-30 max-w-[1500px] mx-auto px-4 md:px-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200/80 p-5 md:py-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-2">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#170a3b] flex items-center justify-center flex-shrink-0">
                <BuildingOffice2Icon className="w-7 h-7 text-[#170a3b]" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                  1000+
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
                  Manufacturers
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ff6b00] flex items-center justify-center flex-shrink-0">
                <UserGroupIcon className="w-7 h-7 text-[#ff6b00]" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                  5000+
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
                  Wholesalers
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ff6b00] flex items-center justify-center flex-shrink-0">
                <CubeIcon className="w-7 h-7 text-[#ff6b00]" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                  1 Lakh+
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
                  Products
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#170a3b] flex items-center justify-center flex-shrink-0">
                <GlobeAsiaAustraliaIcon className="w-7 h-7 text-[#170a3b]" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                  Pan India
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
                  Reach
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="pt-14 pb-8 md:pt-20 md:pb-10 px-4 md:px-8 max-w-[1500px] mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefits for Wholesalers */}
          <div className="bg-[#170a3b] text-white rounded-3xl p-6 sm:p-8 border border-purple-900/60 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-800/50">
                <h2 className="text-xl sm:text-2xl font-black tracking-wide uppercase">
                  BENEFITS FOR{" "}
                  <span className="text-[#ff6b00]">WHOLESALERS</span>
                </h2>
                <div className="w-14 h-14 bg-[#ff6b00] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-600/30">
                  <ShoppingCartIcon className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {[
                  "Direct factory prices",
                  "24/7 ordering – anytime, anywhere",
                  "No hidden margins",
                  "No calling – instant order confirmation",
                  "All designs, rates & live stock in one app",
                  "Transparent pricing always",
                  "No need to wait for photos / rates",
                  "Faster dispatch & reliable delivery",
                  "Better margins, more profit",
                  "App-only offers for wholesalers",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-100 font-medium"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-[#ff6b00] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits for Manufacturers */}
          <div className="bg-[#170a3b] text-white rounded-3xl p-6 sm:p-8 border border-purple-900/60 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-800/50">
                <h2 className="text-xl sm:text-2xl font-black tracking-wide uppercase">
                  BENEFITS FOR{" "}
                  <span className="text-[#ff6b00]">MANUFACTURERS</span>
                </h2>
                <div className="w-14 h-14 bg-[#ff6b00] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-600/30">
                  <BuildingOffice2Icon className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Receive orders from wholesalers across India",
                  "Sell Pan-India & expand beyond local market",
                  "Zero joining fees",
                  "Add unlimited products",
                  "Secure & fast payments",
                  "Dedicated seller support",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-100 font-medium"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-[#ff6b00] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Stepkaro? Section */}
      <section
        id="why-choose"
        className="py-8 md:py-6 px-4 md:px-8 max-w-[1500px] mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-center uppercase tracking-tight text-slate-900 mb-10">
          WHY CHOOSE <span className="text-[#170a3b]">STEPKARO?</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { title: "DIRECT FACTORY ACCESS", icon: BuildingOffice2Icon },
            { title: "VERIFIED MANUFACTURERS", icon: ShieldCheckIcon },
            { title: "TRANSPARENT PRICING", icon: CurrencyRupeeIcon },
            { title: "LIVE STOCK & NEW DESIGNS", icon: SparklesIcon },
            { title: "24/7 ORDERING", icon: ClockIcon },
            { title: "FAST DISPATCH & RELIABLE DELIVERY", icon: TruckIcon },
            { title: "PAY LESS, EARN MORE", icon: ArrowTrendingUpIcon },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#170a3b] flex items-center justify-center mb-3">
                <item.icon className="w-7 h-7 text-[#170a3b]" />
              </div>
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase leading-tight">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-4 px-4 md:px-8 max-w-[1500px] mx-auto"
      >
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-4 sm:p-5 text-center">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-[#170a3b] mb-4">
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-11 gap-3 items-center justify-items-center">
            {[
              {
                step: "1",
                title: "Register Your Business",
                icon: UserPlusIcon,
              },
              { isArrow: true },
              {
                step: "2",
                title: "Create Your Profile",
                icon: BuildingStorefrontIcon,
              },
              { isArrow: true },
              {
                step: "3",
                title: "Browse Factories & Products",
                icon: ShoppingBagIcon,
              },
              { isArrow: true },
              {
                step: "4",
                title: "Place Order Anytime",
                icon: ShoppingCartIcon,
              },
              { isArrow: true },
              { step: "5", title: "Get Fast Delivery", icon: TruckIcon },
              { isArrow: true },
              {
                step: "6",
                title: "Grow Your Business",
                icon: ArrowTrendingUpIcon,
              },
            ].map((item, index) =>
              item.isArrow ? (
                <div
                  key={`arrow-${index}`}
                  className="hidden lg:flex items-center justify-center -mt-4"
                >
                  <ArrowRightIcon className="w-5 h-5 text-[#ff6b00] stroke-[3]" />
                </div>
              ) : (
                <div
                  key={item.step}
                  className="flex flex-col items-center text-center group w-full"
                >
                  <div className="w-14 h-14 rounded-full bg-[#170a3b] text-white flex items-center justify-center mb-1.5 shadow-md transition group-hover:scale-105">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-black text-slate-800 block mb-0.5">
                    {item.step}
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight max-w-[120px] mx-auto">
                    {item.title}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Why Wait / Comparison Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1500px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: WHY WAIT? PLACE ORDERS 24/7 */}
          <div className="lg:col-span-6 bg-[#170a3b] text-white rounded-3xl p-6 sm:p-8 border border-purple-900/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-sm">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                  WHY WAIT?
                </h3>
                <p className="text-[#ff6b00] font-black text-xl sm:text-2xl mt-0.5">
                  PLACE ORDERS 24/7
                </p>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-semibold pt-1">
                <p className="flex items-center gap-2.5">
                  <CheckIcon className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                  <span>No calling</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <CheckIcon className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                  <span>No waiting</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <CheckIcon className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                  <span>Instant order confirmation</span>
                </p>
              </div>

              {/* Circular 24/7 Badge */}
              <div className="pt-2">
                <div className="w-20 h-20 rounded-full border-4 border-[#ff6b00] bg-purple-950/80 flex flex-col items-center justify-center text-[#ff6b00] font-black shadow-lg shadow-orange-600/30 relative">
                  <span className="text-xl leading-none font-black">24/7</span>
                  <span className="text-[8px] uppercase tracking-wider text-white font-bold mt-0.5">
                    Service
                  </span>
                </div>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="relative w-48 sm:w-56 h-64 sm:h-72 bg-slate-900 rounded-[32px] border-4 border-slate-700 shadow-2xl overflow-hidden p-2.5 flex flex-col justify-between items-center flex-shrink-0 mt-4 md:mt-0">
              {/* Phone Notch */}
              <div className="w-16 h-3 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-10"></div>

              {/* Screen Content */}
              <div className="w-full h-full bg-white rounded-2xl p-4 pt-6 flex flex-col items-center justify-center text-center shadow-inner text-slate-900">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-2.5 shadow-md">
                  <CheckIcon className="w-7 h-7 stroke-[3]" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  Order Confirmed
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 max-w-[130px] leading-tight">
                  Your order has been placed successfully!
                </p>
                <button className="mt-4 px-3.5 py-1.5 bg-[#ff6b00] hover:bg-orange-600 text-white text-[9px] font-black rounded-lg shadow-md uppercase tracking-wider">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Traditional vs Stepkaro */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden flex flex-col justify-between relative">
            {/* Header */}
            <div className="grid grid-cols-2 bg-[#170a3b] text-white text-xs sm:text-sm font-black uppercase tracking-wider py-4 text-center border-b border-purple-900">
              <div className="text-slate-200 border-r-2 border-purple-700/80">
                TRADITIONAL SOURCING
              </div>
              <div className="text-[#ff6b00]">WITH STEPKARO</div>
            </div>

            {/* Rows Container */}
            <div className="divide-y divide-gray-200 text-xs sm:text-sm font-bold flex-1 flex flex-col justify-around py-2 relative">
              {/* Overlapping VS Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#ff6b00] text-white font-black rounded-full flex items-center justify-center text-sm shadow-xl border-4 border-white z-20">
                VS
              </div>

              {[
                { trad: "Multiple Middlemen", step: "Direct Factory Access" },
                {
                  trad: "Price Negotiation",
                  step: "Transparent Factory Prices",
                },
                { trad: "Waiting for Photos", step: "Instant Catalog Access" },
                { trad: "Calling for Orders", step: "24/7 App Ordering" },
                {
                  trad: "Limited Suppliers",
                  step: "Multiple Factories in One App",
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 py-3.5 px-4 text-center items-center"
                >
                  <div className="text-slate-800 font-bold pr-6 border-r-2 border-slate-300/80">
                    {row.trad}
                  </div>
                  <div className="text-[#ff6b00] font-black pl-6">
                    {row.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Sell / Source Section */}
      <section className="py-3 px-4 md:px-8 max-w-[1500px] mx-auto">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-3 sm:p-4 text-center">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#170a3b] mb-3">
            WHAT YOU CAN SELL / SOURCE
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 items-center justify-center">
            {[
              { name: "EVA Footwear", img: "/eva.png" },
              { name: "PU Footwear", img: "/pu.png" },
              { name: "PVC Footwear", img: "/pvc.png" },
              { name: "Kids Sandals", img: "/kids.png" },
              { name: "Gents Slippers & Hawai", img: "/gents.png" },
              { name: "Ladies Fashion Slippers", img: "/ladies.png" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="py-1.5 px-2 flex flex-col items-center justify-between group cursor-pointer"
              >
                <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-[50%] bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-sm flex items-center justify-center p-1.5 mb-1.5 transition group-hover:scale-105 group-hover:shadow-md">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    width={100}
                    height={60}
                    className="object-contain max-h-12"
                  />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight max-w-[110px]">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Banner CTA & Footer */}
      <footer id="support" className="bg-[#150934] text-white pt-12">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8 items-center pb-12 border-b border-purple-900/50">
          {/* Left Column */}
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white leading-tight">
              DOWNLOAD STEPKARO – <br />
              <span className="text-[#ff6b00]">PAY LESS, EARN MORE.</span>
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              {/* Google Play Store Badge Button */}
              <button
                onClick={handleLogin}
                className="bg-black hover:bg-slate-900 border border-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg transition active:scale-95 text-left"
              >
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M3.6 2.4C3.2 2.8 3 3.4 3 4.2v15.6c0 .8.2 1.4.6 1.8l.1.1 8.7-8.7v-.2L3.7 2.3l-.1.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M15.4 15.9l-3-3v-.2l3-3 3.4 2c1 .6 1 1.5 0 2.1l-3.4 2.1z"
                  />
                  <path
                    fill="#EA4335"
                    d="M3.7 21.7c.3.3.8.4 1.4.1l10.3-5.9-3-3-8.7 8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.7 2.3l8.7 8.7 3-3L5.1 2.1c-.6-.3-1.1-.2-1.4.2z"
                  />
                </svg>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold block leading-tight">
                    GET IT ON
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-white leading-none block">
                    Google Play
                  </span>
                </div>
              </button>

              {/* Apple App Store Badge Button */}
              <button
                onClick={handleLogin}
                className="bg-black hover:bg-slate-900 border border-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg transition active:scale-95 text-left"
              >
                <svg
                  className="w-6 h-6 flex-shrink-0 fill-current text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96.99-3.1-.98.04-2.18.66-2.88 1.47-.63.73-1.18 1.9-1.03 3.02 1.1.09 2.24-.56 2.92-1.39z" />
                </svg>
                <div>
                  <span className="text-[9px] tracking-wider text-slate-300 font-semibold block leading-tight">
                    Download on the
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-white leading-none block">
                    App Store
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400">
                <Image
                  src="/logo1.png"
                  alt="Stepkaro Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-2xl font-black tracking-tight text-white">
                Step<span className="text-[#ff6b00]">karo</span>
              </h4>
            </div>
            <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">
              India's Fastest Growing Footwear B2B Platform
            </p>
          </div>

          {/* Right Column */}
          <div className="text-center md:text-right text-xs text-slate-200 space-y-2">
            <p className="font-extrabold text-[#ff6b00] uppercase text-sm tracking-wide">
              FOR SUPPORT
            </p>
            <p className="font-bold flex items-center justify-center md:justify-end gap-2 text-sm text-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <PhoneIcon className="w-3.5 h-3.5" />
              </span>
              <span>+91 92170 56915</span>
            </p>
            <p className="font-medium flex items-center justify-center md:justify-end gap-2 hover:text-amber-400 cursor-pointer">
              <GlobeAsiaAustraliaIcon className="w-4 h-4 text-amber-400" />
              <span>www.stepkaro.com</span>
            </p>
            <p className="text-slate-400 font-medium">support@stepkaro.com</p>
          </div>
        </div>

        {/* form of manufuring and wholeseller */}
        {/* <div className=""></div> */}

        {/* Orange Bottom Bar */}
        <div className="bg-[#ff6b00] py-3.5 px-4 md:px-8 text-white text-xs font-semibold">
          <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p>© 2026 Stepkaro Technologies Pvt. Ltd. All Rights Reserved.</p>
            <div className="flex flex-wrap gap-4 text-white font-bold">
              <a href="/seller-privacy-policy" className="hover:underline">
                Seller Privacy Policy
              </a>
              <span>|</span>
              <a href="/buyer-privacy-policy" className="hover:underline">
                Buyer Privacy Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
              <span>|</span>
              <a href="#" className="hover:underline">
                Refund Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
