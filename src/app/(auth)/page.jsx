"use client";

import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Step<span className="text-teal-500">Karo</span>
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-teal-500 transition">Home</a>
            <a href="#" className="hover:text-teal-500 transition">About</a>
            <a href="#" className="hover:text-teal-500 transition">Vendors</a>
            <a href="#" className="hover:text-teal-500 transition">Contact</a>
          </nav>

          <div className="flex gap-3">
            <button onClick={() => router.push("/login")}
             className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
              Login
            </button>
            <button className="px-5 py-2 rounded-full bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition">
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-5 py-2 text-sm text-teal-600 font-medium">
              India's Products Aggregator Platform
            </span>

            <h1 className="mt-8 text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              One Platform.
              <br />
              Endless Business
              <span className="text-teal-500"> Opportunities.</span>
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-500 leading-relaxed">
              StepKaro connects  buyers and verified vendors through a single digital marketplace. 
              Discover suppliers, compare offerings, build partnerships and grow your business — all from one place.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition shadow-lg hover:shadow-xl">
                Explore Marketplace
              </button>
              <button className="px-8 py-4 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
                Become a Vendor
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "500+", label: "Verified Vendors" },
                { number: "50K+", label: "Products Listed" },
                { number: "10K+", label: "Business Buyers" },
                { number: "100+", label: "Cities Connected" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                  <h3 className="text-3xl font-bold text-teal-500">{stat.number}</h3>
                  <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Simplifying Product Sourcing</h2>
            <p className="mt-3 text-gray-500">From fragmented sourcing to a unified marketplace.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-red-500 mb-6">Traditional Approach</h3>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-3">❌ Finding vendors individually</p>
                <p className="flex items-center gap-3">❌ Managing multiple catalogues</p>
                <p className="flex items-center gap-3">❌ Comparing prices manually</p>
                <p className="flex items-center gap-3">❌ Endless calls and follow-ups</p>
                <p className="flex items-center gap-3">❌ Slow procurement process</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-teal-500 mb-6">With StepKaro</h3>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-3">✅ One centralized marketplace</p>
                <p className="flex items-center gap-3">✅ Verified vendor network</p>
                <p className="flex items-center gap-3">✅ Easy product discovery</p>
                <p className="flex items-center gap-3">✅ Faster sourcing decisions</p>
                <p className="flex items-center gap-3">✅ Streamlined business growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Why Choose StepKaro */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose StepKaro</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Verified Vendors", desc: "Every vendor is reviewed before onboarding." },
              { title: "Unified Marketplace", desc: "Access multiple vendors through one platform." },
              { title: "Business Growth", desc: "Expand your network and sourcing reach." },
              { title: "Secure Ecosystem", desc: "Transparent order and payment workflows." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer & Vendor Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Buyers</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-3">✓ Access multiple vendors</p>
                <p className="flex items-center gap-3">✓ Compare offerings easily</p>
                <p className="flex items-center gap-3">✓ Save sourcing time</p>
                <p className="flex items-center gap-3">✓ Build supplier relationships</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Vendors</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-3">✓ Showcase your products</p>
                <p className="flex items-center gap-3">✓ Reach more buyers</p>
                <p className="flex items-center gap-3">✓ Manage orders efficiently</p>
                <p className="flex items-center gap-3">✓ Grow your business presence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-500 p-14 text-center shadow-xl">
            <h2 className="text-4xl font-bold text-white">Ready to Grow with StepKaro?</h2>
            <p className="mt-4 text-white/90 text-lg">
              Join India's growing product sourcing ecosystem and connect with businesses across the country.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 rounded-xl bg-white text-teal-600 font-semibold hover:bg-gray-100 transition">
                Join as Vendor
              </button>
              <button className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition">
                Explore Marketplace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Step<span className="text-teal-500">Karo</span></h3>
            <p className="mt-1 text-sm text-gray-500">India's Products Aggregator Platform</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-teal-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-teal-500 transition">Terms & Conditions</a>
            <a href="#" className="hover:text-teal-500 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}