"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("contact");

  const handleJoinAsWholesaler = () => {
    router.push("/register/wholesaler");
  };

  const handleJoinAsManufacturer = () => {
    router.push("/register/manufacturer");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleJoinNow = () => {
    router.push("/register/wholesaler");
  };

  const handleExploreMarketplace = () => {
    router.push("/marketplace");
  };

  const handleBecomeVendor = () => {
    router.push("/register/manufacturer");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Purple + Orange theme */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Step<span className="text-purple-600">Karo</span>
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-orange-500 transition">Home</a>
            <a href="#" className="hover:text-orange-500 transition">About</a>
            <a href="#" className="hover:text-orange-500 transition">Vendors</a>
            <a href="#" className="hover:text-orange-500 transition">Contact</a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Login
            </button>
            <button
              onClick={handleJoinNow}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 text-white text-sm font-medium hover:shadow-lg transition"
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Main Headline from Reference */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
           
<div className="mt-8">
  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
    Step<span className="text-purple-600">Karo</span>
  </h1>
  <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-2xl mx-auto">
    helps footwear wholesalers discover manufacturers directly
  </p>
</div>  
           

            <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-500 leading-relaxed">
              Access factory prices, view live stock and place orders anytime – without middlemen.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleExploreMarketplace}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-xl text-white font-semibold transition shadow-lg"
              >
                Explore Marketplace
              </button>
              <button
                onClick={handleBecomeVendor}
                className="px-8 py-4 rounded-2xl border border-orange-200 text-gray-700 font-semibold hover:bg-orange-50 transition"
              >
                Become a Vendor
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "1000+", label: "Manufacturers" },
                { number: "5000+", label: "Wholesalers" },
                { number: "1 Lakh+", label: "Products" },
                { number: "Pan India", label: "Reach" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">{stat.number}</h3>
                  <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Wholesalers - Full content from reference */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">BENEFITS FOR WHOLESALERS</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ Direct factory prices</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ No hidden margins</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ All designs, rates & live stock in one app</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ No need to wait for photos / rates</p>
               <p className="flex items-center gap-2 text-orange-600 font-medium  ">✓ App-only offers for wholesalers</p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ 24/7 ordering – anytime, anywhere</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ No calling – instant order confirmation</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ Transparent pricing always</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium">✓ Faster dispatch & reliable delivery</p>
              <p className="flex items-center gap-2 text-orange-600 font-medium ">✓ Better margins, more profit</p>
             
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleJoinAsWholesaler}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold hover:shadow-lg transition"
            >
              Join as Wholesaler →
            </button>
          </div>
        </div>
      </section>

      {/* Benefits for Manufacturers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">BENEFITS FOR MANUFACTURERS</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">✓ Receive orders from wholesalers across India</p>
              <p className="flex items-center gap-2">✓ Sell Pan-India & expand beyond local market</p>
              <p className="flex items-center gap-2">✓ Zero joining fees</p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">✓ Add unlimited products</p>
              <p className="flex items-center gap-2">✓ Secure & fast payments</p>
              <p className="flex items-center gap-2">✓ Dedicated seller support</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleJoinAsManufacturer}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold hover:shadow-lg transition"
            >
              Join as Manufacturer →
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose StepKaro - Complete 7 points from reference */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">WHY CHOOSE STEPKARO?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "DIRECT FACTORY ACCESS", desc: "Connect directly with verified manufacturers" },
              { title: "VERIFIED MANUFACTURERS", desc: "Every partner is thoroughly verified" },
              { title: "TRANSPARENT PRICING", desc: "No hidden margins, clear factory prices" },
              { title: "LIVE STOCK & NEW DESIGNS", desc: "Real-time inventory updates" },
              { title: "24/7 ORDERING", desc: "Order anytime, anywhere" },
              { title: "FAST DISPATCH & RELIABLE DELIVERY", desc: "Quick shipping across India" },
              { title: "PAY LESS, EARN MORE", desc: "Better margins for wholesalers" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-gradient-to-br from-purple-50 to-orange-50 p-6 shadow-sm border border-orange-100 hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 6 steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">HOW IT WORKS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: "1", title: "Register Your Business" },
              { step: "2", title: "Create Your Profile" },
              { step: "3", title: "Browse Factories & Products" },
              { step: "4", title: "Place Order Anytime" },
              { step: "5", title: "Get Fast Delivery" },
              { step: "6", title: "Grow Your Business" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-orange-500 text-white flex items-center justify-center text-xl font-bold mb-3">
                  {item.step}
                </div>
                <p className="text-xs font-medium text-gray-700">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs StepKaro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-gray-100 p-8">
              <h3 className="text-2xl font-bold text-red-500 mb-6">TRADITIONAL SOURCING</h3>
              <div className="space-y-3 text-gray-600">
                <p>❌ Multiple Middlemen</p>
                <p>❌ Price Negotiation</p>
                <p>❌ Waiting for Photos</p>
                <p>❌ Calling for Orders</p>
                <p>❌ Limited Suppliers</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-orange-50 p-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">WITH STEPKARO</h3>
              <div className="space-y-3 text-gray-600">
                <p>✅ Direct Factory Access</p>
                <p>✅ Transparent Factory Prices</p>
                <p>✅ Instant Catalog Access</p>
                <p>✅ 24/7 App Ordering</p>
                <p>✅ Multiple Factories in One App</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">WHAT YOU CAN SELL / SOURCE</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["EVA Footwear", "PU Footwear", "PVC Footwear", "Kids Sandals", "Gents Slippers & Hawai", "Ladies Fashion Slippers"].map((cat) => (
              <span key={cat} className="px-6 py-3 rounded-full bg-white border border-orange-200 text-gray-700 font-medium hover:bg-orange-50 hover:border-orange-300 transition">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white">DOWNLOAD STEPKARO – PAY LESS, EARN MORE.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 12.095c.02 1.813 1.592 2.415 1.61 2.424-.013.043-.252.862-.83 1.707-.5.732-.998 1.462-1.8 1.477-.786.015-1.038-.466-1.936-.466-.898 0-1.179.452-1.923.481-.804.03-1.416-.793-1.92-1.523-1.045-1.525-1.845-4.31-.772-6.191.532-.937 1.484-1.53 2.517-1.545.785-.015 1.527.528 2.007.528.48 0 1.38-.652 2.326-.556.396.016 1.507.16 2.22 1.2-.058.036-1.326.774-1.312 2.31zm-2.825-5.869c.434-.526.726-1.257.646-1.985-.625.025-1.382.417-1.831.942-.403.466-.755 1.212-.66 1.927.698.054 1.411-.355 1.845-.884z"/>
              </svg>
              GET IT ON Google Play
            </button>
            <button className="px-8 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.86 3.29.86.78 0 2.26-1.06 3.81-.9.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </button>
          </div>
          <p className="mt-6 text-white/80 text-sm font-medium">INDIA'S FASTEST GROWING FOOTWEAR B2B PLATFORM</p>
        </div>
      </section>

      {/* Legal Tabs - Contact, Refund, Terms, Privacy */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200">
            {[
              { id: "contact", label: "Contact Us" },
              { id: "refund", label: "Refund Policy" },
              { id: "terms", label: "Terms & Conditions" },
              { id: "privacy", label: "Privacy Policy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium rounded-t-lg transition ${
                  activeTab === tab.id
                    ? "bg-white text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {activeTab === "contact" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-6">
                  Stepkaro Technologies Pvt. Ltd.<br />
                  Connecting Footwear Wholesalers Directly with Manufacturers.
                </p>
                <div className="space-y-3 text-gray-600">
                  <p><strong className="text-orange-600">Email:</strong> support@stepkaro.com</p>
                  <p><strong className="text-orange-600">Website:</strong> <a href="https://www.stepkaro.in" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">www.stepkaro.in</a></p>
                  <p><strong className="text-orange-600">Phone:</strong>+91 92170 56915</p>
                   <p><strong className="text-orange-600">Business Hours:</strong> Monday to Friday, 10:00 AM – 6:00 PM</p>
                </div>
                <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                  <p className="text-gray-700">
                    <strong>Support:</strong> For account assistance, onboarding, business inquiries, or partnership opportunities, please contact our support team.
                    We are committed to helping wholesalers discover manufacturers and helping manufacturers grow their business across India.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "refund" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Refund Policy</h3>
                <p className="text-sm text-gray-500 mb-6">Last Updated: June 2026</p>
                <div className="space-y-4 text-gray-600">
                  <p><strong className="text-orange-600">Platform Services:</strong> Any subscription fees, promotional services, listing fees, or paid services offered by Stepkaro may be subject to separate refund terms communicated at the time of purchase.</p>
                  <p><strong className="text-orange-600">Transactions Between Users:</strong> Stepkaro is not responsible for product purchases, payments, deliveries, returns, or disputes between wholesalers and manufacturers.</p>
                  <p><strong className="text-orange-600">Refund Eligibility:</strong> Refund requests for platform services, if applicable, will be reviewed on a case-by-case basis.</p>
                  <p><strong className="text-orange-600">Non-Refundable Situations:</strong> Refunds will generally not be provided for: Completed promotional services, Successfully activated subscriptions, User account violations, Incorrect information submitted by users.</p>
                  <p><strong className="text-orange-600">Contact for Refund Requests:</strong> Email: support@stepkaro.com</p>
                  <p className="text-sm text-gray-500 mt-4">Stepkaro reserves the right to make the final decision regarding refund requests.</p>
                </div>
              </div>
            )}

            {activeTab === "terms" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Terms & Conditions</h3>
                <p className="text-sm text-gray-500 mb-6">Last Updated: June 2026</p>
                <div className="space-y-3 text-gray-600">
                  <p><strong className="text-orange-600">Platform Purpose:</strong> Stepkaro is a B2B footwear platform designed to connect footwear wholesalers directly with manufacturers.</p>
                  <p><strong className="text-orange-600">User Eligibility:</strong> Users must be legally authorized businesses, manufacturers, wholesalers, distributors, or related footwear trade entities.</p>
                  <p><strong className="text-orange-600">Account Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account credentials.</p>
                  <p><strong className="text-orange-600">Business Transactions:</strong> Stepkaro acts as a technology platform facilitating business connections.</p>
                  <p><strong className="text-orange-600">Contact:</strong> For support: support@stepkaro.com</p>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h3>
                <p className="text-gray-600 mb-4">Stepkaro respects your privacy and is committed to protecting your information.</p>
                <div className="space-y-3 text-gray-600">
                  <p><strong className="text-orange-600">Information We Collect:</strong> Name, Mobile Number, Email, Business Name, GST Details, City, State, Business Category.</p>
                  <p><strong className="text-orange-600">How We Use Your Information:</strong> To create accounts, connect users, improve services, provide support, send updates.</p>
                  <p><strong className="text-orange-600">Contact:</strong> support@stepkaro.com</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-14 text-center shadow-xl">
            <h2 className="text-4xl font-bold text-white">Ready to Grow with StepKaro?</h2>
            <p className="mt-4 text-white/90 text-lg">
              Join India's growing product sourcing ecosystem and connect with businesses across the country.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleJoinAsManufacturer}
                className="px-8 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-gray-100 transition"
              >
                Join as Manufacturer
              </button>
              <button
                onClick={handleJoinAsWholesaler}
                className="px-8 py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
              >
                Join as Wholesaler
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Step<span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Karo</span></h3>
            <p className="mt-1 text-sm text-gray-500">India's Fastest Growing Footwear B2B Platform</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <button onClick={() => setActiveTab("privacy")} className="hover:text-orange-500 transition">Privacy Policy</button>
            <button onClick={() => setActiveTab("terms")} className="hover:text-orange-500 transition">Terms & Conditions</button>
            <button onClick={() => setActiveTab("refund")} className="hover:text-orange-500 transition">Refund Policy</button>
            <button onClick={() => setActiveTab("contact")} className="hover:text-orange-500 transition">Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
}