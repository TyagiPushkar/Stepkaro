// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function HomePage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("contact");

//   const handleJoinAsWholesaler = () => {
//     router.push("/register/wholesaler");
//   };

//   const handleJoinAsManufacturer = () => {
//     router.push("/register/manufacturer");
//   };

//   const handleLogin = () => {
//     router.push("/login");
//   };

//   const handleJoinNow = () => {
//     router.push("/register/wholesaler");
//   };

//   const handleExploreMarketplace = () => {
//     router.push("/marketplace");
//   };

//   const handleBecomeVendor = () => {
//     router.push("/add-vendor");
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar - Purple + Orange theme */}
//       <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <h1 className="text-2xl font-bold">
//             Step<span className="text-purple-600">Karo</span>
//           </h1>

//           <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
//             <a href="#" className="hover:text-orange-500 transition">
//               Home
//             </a>
//             <a href="#" className="hover:text-orange-500 transition">
//               About
//             </a>
//             <a href="#" className="hover:text-orange-500 transition">
//               Vendors
//             </a>
//             <a href="#" className="hover:text-orange-500 transition">
//               Contact
//             </a>
//             <a
//               href="/seller-privacy-policy"
//               className="hover:text-orange-500 transition"
//             >
//               Seller Privacy Policy
//             </a>
//             <a
//               href="/buyer-privacy-policy"
//               className="hover:text-orange-500 transition"
//             >
//               Buyer Privacy Policy
//             </a>
//           </nav>

//           <div className="flex gap-3">
//             <button
//               onClick={handleLogin}
//               className="px-5 py-2 rounded-full border border-gray-200  bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold text-sm font-medium hover:bg-gray-50 transition"
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section - Main Headline from Reference */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-orange-50">
//         <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
//           <div className="text-center max-w-4xl mx-auto">
//             <div className="mt-8">
//               <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
//                 Step<span className="text-purple-600">Karo</span>
//               </h1>
//               <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-2xl mx-auto">
//                 helps footwear wholesalers discover manufacturers directly
//               </p>
//             </div>

//             <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-500 leading-relaxed">
//               Access factory prices, view live stock and place orders anytime –
//               without middlemen.
//             </p>

//             <div className="mt-10 flex flex-wrap justify-center gap-4">
//               {/* <button
//                 onClick={handleExploreMarketplace}
//                 className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-xl text-white font-semibold transition shadow-lg"
//               >
//                 Explore Marketplace
//               </button> */}
//               <button
//                 onClick={handleBecomeVendor}
//                 className="px-8 py-4 rounded-2xl border   bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold hover:bg-orange-50 transition"
//               >
//                 Become a Vendor
//               </button>
//             </div>

//             {/* Stats */}
//             <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
//               {[
//                 { number: "1000+", label: "Manufacturers" },
//                 { number: "5000+", label: "Wholesalers" },
//                 { number: "1 Lakh+", label: "Products" },
//                 { number: "Pan India", label: "Reach" },
//               ].map((stat) => (
//                 <div
//                   key={stat.label}
//                   className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
//                 >
//                   <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
//                     {stat.number}
//                   </h3>
//                   <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Benefits for Wholesalers - Full content from reference */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900">
//               BENEFITS FOR WHOLESALERS
//             </h2>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             <div className="space-y-3 text-gray-700">
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ Direct factory prices
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ No hidden margins
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ All designs, rates & live stock in one app
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ No need to wait for photos / rates
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium  ">
//                 ✓ App-only offers for wholesalers
//               </p>
//             </div>
//             <div className="space-y-3 text-gray-700">
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ 24/7 ordering – anytime, anywhere
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ No calling – instant order confirmation
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ Transparent pricing always
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium">
//                 ✓ Faster dispatch & reliable delivery
//               </p>
//               <p className="flex items-center gap-2 text-orange-600 font-medium ">
//                 ✓ Better margins, more profit
//               </p>
//             </div>
//           </div>

//           <div className="text-center mt-12">
//             {/* <button
//               onClick={handleJoinAsWholesaler}
//               className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold hover:shadow-lg transition"
//             >
//               Join as Wholesaler →
//             </button> */}
//           </div>
//         </div>
//       </section>

//       {/* Benefits for Manufacturers */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900">
//               BENEFITS FOR MANUFACTURERS
//             </h2>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             <div className="space-y-3 text-gray-700">
//               <p className="flex items-center gap-2">
//                 ✓ Receive orders from wholesalers across India
//               </p>
//               <p className="flex items-center gap-2">
//                 ✓ Sell Pan-India & expand beyond local market
//               </p>
//               <p className="flex items-center gap-2">✓ Zero joining fees</p>
//             </div>
//             <div className="space-y-3 text-gray-700">
//               <p className="flex items-center gap-2">
//                 ✓ Add unlimited products
//               </p>
//               <p className="flex items-center gap-2">
//                 ✓ Secure & fast payments
//               </p>
//               <p className="flex items-center gap-2">
//                 ✓ Dedicated seller support
//               </p>
//             </div>
//           </div>

//           {/* <div className="text-center mt-12">
//             <button
//               onClick={handleJoinAsManufacturer}
//               className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold hover:shadow-lg transition"
//             >
//               Join as Manufacturer →
//             </button>
//           </div> */}
//         </div>
//       </section>

//       {/* Why Choose StepKaro - Complete 7 points from reference */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900">
//               WHY CHOOSE STEPKARO?
//             </h2>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 title: "DIRECT FACTORY ACCESS",
//                 desc: "Connect directly with verified manufacturers",
//               },
//               {
//                 title: "VERIFIED MANUFACTURERS",
//                 desc: "Every partner is thoroughly verified",
//               },
//               {
//                 title: "TRANSPARENT PRICING",
//                 desc: "No hidden margins, clear factory prices",
//               },
//               {
//                 title: "LIVE STOCK & NEW DESIGNS",
//                 desc: "Real-time inventory updates",
//               },
//               { title: "24/7 ORDERING", desc: "Order anytime, anywhere" },
//               {
//                 title: "FAST DISPATCH & RELIABLE DELIVERY",
//                 desc: "Quick shipping across India",
//               },
//               {
//                 title: "PAY LESS, EARN MORE",
//                 desc: "Better margins for wholesalers",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="rounded-2xl bg-gradient-to-br from-purple-50 to-orange-50 p-6 shadow-sm border border-orange-100 hover:shadow-md transition"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl flex items-center justify-center mb-4">
//                   <svg
//                     className="w-6 h-6 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-sm font-bold text-gray-800">
//                   {item.title}
//                 </h3>
//                 <p className="mt-2 text-xs text-gray-500">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works - 6 steps */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900">HOW IT WORKS</h2>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {[
//               { step: "1", title: "Register Your Business" },
//               { step: "2", title: "Create Your Profile" },
//               { step: "3", title: "Browse Factories & Products" },
//               { step: "4", title: "Place Order Anytime" },
//               { step: "5", title: "Get Fast Delivery" },
//               { step: "6", title: "Grow Your Business" },
//             ].map((item) => (
//               <div key={item.step} className="text-center">
//                 <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-orange-500 text-white flex items-center justify-center text-xl font-bold mb-3">
//                   {item.step}
//                 </div>
//                 <p className="text-xs font-medium text-gray-700">
//                   {item.title}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Comparison: Traditional vs StepKaro */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid lg:grid-cols-2 gap-8">
//             <div className="rounded-2xl bg-gray-100 p-8">
//               <h3 className="text-2xl font-bold text-red-500 mb-6">
//                 TRADITIONAL SOURCING
//               </h3>
//               <div className="space-y-3 text-gray-600">
//                 <p>❌ Multiple Middlemen</p>
//                 <p>❌ Price Negotiation</p>
//                 <p>❌ Waiting for Photos</p>
//                 <p>❌ Calling for Orders</p>
//                 <p>❌ Limited Suppliers</p>
//               </div>
//             </div>
//             <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-orange-50 p-8">
//               <h3 className="text-2xl font-bold text-purple-600 mb-6">
//                 WITH STEPKARO
//               </h3>
//               <div className="space-y-3 text-gray-600">
//                 <p>✅ Direct Factory Access</p>
//                 <p>✅ Transparent Factory Prices</p>
//                 <p>✅ Instant Catalog Access</p>
//                 <p>✅ 24/7 App Ordering</p>
//                 <p>✅ Multiple Factories in One App</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Product Categories */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900">
//               WHAT YOU CAN SELL / SOURCE
//             </h2>
//           </div>
//           <div className="flex flex-wrap justify-center gap-3">
//             {[
//               "EVA Footwear",
//               "PU Footwear",
//               "PVC Footwear",
//               "Kids Sandals",
//               "Gents Slippers & Hawai",
//               "Ladies Fashion Slippers",
//             ].map((cat) => (
//               <span
//                 key={cat}
//                 className="px-6 py-3 rounded-full bg-white border border-orange-200 text-gray-700 font-medium hover:bg-orange-50 hover:border-orange-300 transition"
//               >
//                 {cat}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* App Download */}
//       <section className="py-20 bg-gradient-to-r from-purple-600 to-orange-500">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h2 className="text-4xl font-bold text-white">
//             DOWNLOAD STEPKARO – PAY LESS, EARN MORE.
//           </h2>
//           <div className="mt-8 flex flex-wrap justify-center gap-4">
//             <button className="px-8 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex items-center gap-2">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M17.523 12.095c.02 1.813 1.592 2.415 1.61 2.424-.013.043-.252.862-.83 1.707-.5.732-.998 1.462-1.8 1.477-.786.015-1.038-.466-1.936-.466-.898 0-1.179.452-1.923.481-.804.03-1.416-.793-1.92-1.523-1.045-1.525-1.845-4.31-.772-6.191.532-.937 1.484-1.53 2.517-1.545.785-.015 1.527.528 2.007.528.48 0 1.38-.652 2.326-.556.396.016 1.507.16 2.22 1.2-.058.036-1.326.774-1.312 2.31zm-2.825-5.869c.434-.526.726-1.257.646-1.985-.625.025-1.382.417-1.831.942-.403.466-.755 1.212-.66 1.927.698.054 1.411-.355 1.845-.884z" />
//               </svg>
//               GET IT ON Google Play
//             </button>
//             <button className="px-8 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex items-center gap-2">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.86 3.29.86.78 0 2.26-1.06 3.81-.9.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
//               </svg>
//               Download on the App Store
//             </button>
//           </div>
//           <p className="mt-6 text-white/80 text-sm font-medium">
//             INDIA'S FASTEST GROWING FOOTWEAR B2B PLATFORM
//           </p>
//         </div>
//       </section>

//       {/* Legal Tabs - Contact, Refund, Terms, Privacy */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-6">
//           <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200">
//             {[
//               { id: "contact", label: "Contact Us" },
//               { id: "refund", label: "Refund Policy" },
//               { id: "terms", label: "Terms & Conditions" },
//               { id: "privacy", label: "Privacy Policy" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-6 py-3 text-sm font-medium rounded-t-lg transition ${
//                   activeTab === tab.id
//                     ? "bg-white text-orange-600 border-b-2 border-orange-500"
//                     : "text-gray-500 hover:text-orange-500"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             {activeTab === "contact" && (
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                   Contact Us
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   Stepkaro Technologies Pvt. Ltd.
//                   <br />
//                   Connecting Footwear Wholesalers Directly with Manufacturers.
//                 </p>
//                 <div className="space-y-3 text-gray-600">
//                   <p>
//                     <strong className="text-orange-600">Email:</strong>{" "}
//                     support@stepkaro.com
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">Website:</strong>{" "}
//                     <a
//                       href="https://www.stepkaro.in"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-orange-600 hover:underline"
//                     >
//                       www.stepkaro.in
//                     </a>
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">Phone:</strong>+91 92170
//                     56915
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">Business Hours:</strong>{" "}
//                     Monday to Friday, 10:00 AM – 6:00 PM
//                   </p>
//                 </div>
//                 <div className="mt-6 p-4 bg-orange-50 rounded-xl">
//                   <p className="text-gray-700">
//                     <strong>Support:</strong> For account assistance,
//                     onboarding, business inquiries, or partnership
//                     opportunities, please contact our support team. We are
//                     committed to helping wholesalers discover manufacturers and
//                     helping manufacturers grow their business across India.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {activeTab === "refund" && (
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                   Refund Policy
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Last Updated: June 2026
//                 </p>
//                 <div className="space-y-4 text-gray-600">
//                   <p>
//                     <strong className="text-orange-600">
//                       Platform Services:
//                     </strong>{" "}
//                     Any subscription fees, promotional services, listing fees,
//                     or paid services offered by Stepkaro may be subject to
//                     separate refund terms communicated at the time of purchase.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       Transactions Between Users:
//                     </strong>{" "}
//                     Stepkaro is not responsible for product purchases, payments,
//                     deliveries, returns, or disputes between wholesalers and
//                     manufacturers.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       Refund Eligibility:
//                     </strong>{" "}
//                     Refund requests for platform services, if applicable, will
//                     be reviewed on a case-by-case basis.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       Non-Refundable Situations:
//                     </strong>{" "}
//                     Refunds will generally not be provided for: Completed
//                     promotional services, Successfully activated subscriptions,
//                     User account violations, Incorrect information submitted by
//                     users.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       Contact for Refund Requests:
//                     </strong>{" "}
//                     Email: support@stepkaro.com
//                   </p>
//                   <p className="text-sm text-gray-500 mt-4">
//                     Stepkaro reserves the right to make the final decision
//                     regarding refund requests.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {activeTab === "terms" && (
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                   Terms & Conditions
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Last Updated: June 2026
//                 </p>
//                 <div className="space-y-3 text-gray-600">
//                   <p>
//                     <strong className="text-orange-600">
//                       Platform Purpose:
//                     </strong>{" "}
//                     Stepkaro is a B2B footwear platform designed to connect
//                     footwear wholesalers directly with manufacturers.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       User Eligibility:
//                     </strong>{" "}
//                     Users must be legally authorized businesses, manufacturers,
//                     wholesalers, distributors, or related footwear trade
//                     entities.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       Account Responsibility:
//                     </strong>{" "}
//                     Users are responsible for maintaining the confidentiality of
//                     their account credentials.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       Business Transactions:
//                     </strong>{" "}
//                     Stepkaro acts as a technology platform facilitating business
//                     connections.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">Contact:</strong> For
//                     support: support@stepkaro.com
//                   </p>
//                 </div>
//               </div>
//             )}

//             {activeTab === "privacy" && (
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-4">
//                   Privacy Policy
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   Stepkaro respects your privacy and is committed to protecting
//                   your information.
//                 </p>
//                 <div className="space-y-3 text-gray-600">
//                   <p>
//                     <strong className="text-orange-600">
//                       Information We Collect:
//                     </strong>{" "}
//                     Name, Mobile Number, Email, Business Name, GST Details,
//                     City, State, Business Category.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">
//                       How We Use Your Information:
//                     </strong>{" "}
//                     To create accounts, connect users, improve services, provide
//                     support, send updates.
//                   </p>
//                   <p>
//                     <strong className="text-orange-600">Contact:</strong>{" "}
//                     support@stepkaro.com
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-14 text-center shadow-xl">
//             <h2 className="text-4xl font-bold text-white">
//               Ready to Grow with StepKaro?
//             </h2>
//             <p className="mt-4 text-white/90 text-lg">
//               Join India's growing product sourcing ecosystem and connect with
//               businesses across the country.
//             </p>
//             <div className="mt-8 flex flex-wrap justify-center gap-4">
//               <button
//                 onClick={handleJoinAsManufacturer}
//                 className="px-8 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-gray-100 transition"
//               >
//                 Join as Manufacturer
//               </button>
//               <button
//                 onClick={handleJoinAsWholesaler}
//                 className="px-8 py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
//               >
//                 Join as Wholesaler
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-gray-100 bg-gray-50 py-12">
//         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
//           <div>
//             <h3 className="text-2xl font-bold text-gray-900">
//               Step
//               <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
//                 Karo
//               </span>
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               India's Fastest Growing Footwear B2B Platform
//             </p>
//           </div>
//           <div className="flex gap-6 text-sm text-gray-500">
//             <button
//               onClick={() => setActiveTab("privacy")}
//               className="hover:text-orange-500 transition"
//             >
//               Privacy Policy
//             </button>
//             <button
//               onClick={() => setActiveTab("terms")}
//               className="hover:text-orange-500 transition"
//             >
//               Terms & Conditions
//             </button>
//             <button
//               onClick={() => setActiveTab("refund")}
//               className="hover:text-orange-500 transition"
//             >
//               Refund Policy
//             </button>
//             <button
//               onClick={() => setActiveTab("contact")}
//               className="hover:text-orange-500 transition"
//             >
//               Contact Us
//             </button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
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
} from "@heroicons/react/24/solid";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("contact");

  const handleJoinAsWholesaler = () => router.push("/register/wholesaler");
  const handleJoinAsManufacturer = () => router.push("/register/manufacturer");
  const handleLogin = () => router.push("/login");
  const handleJoinNow = () => router.push("/register/wholesaler");
  const handleExploreMarketplace = () => router.push("/marketplace");

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-white font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#1A0744] backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BuildingOffice2Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                Step<span className="text-amber-500">karo</span>
              </h1>
              <p className="text-[10px] text-slate-400">
                Factories at Your Doorstep
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-amber-400 transition">
              Home
            </a>
            <a href="#" className="hover:text-amber-400 transition">
              How It Works
            </a>
            <a href="#" className="hover:text-amber-400 transition">
              For Wholesalers
            </a>
            <a href="#" className="hover:text-amber-400 transition">
              For Manufacturers
            </a>
            <a href="#" className="hover:text-amber-400 transition">
              Features
            </a>
            <a href="#" className="hover:text-amber-400 transition">
              Contact Us
            </a>
          </nav>

          <button
            onClick={handleLogin}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm hover:opacity-90 transition shadow-md shadow-orange-500/20"
          >
            Download App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#1A0744] ">
        {/* <div className="grid lg:grid-cols-2 gap-12 items-center"> */}
        {/* <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              Connect Directly <br /> With Footwear <br />
              <span className="text-amber-500">Factories</span> <br />
              Across India
            </h1>
            <p className="mt-6 text-slate-300 text-base leading-relaxed max-w-xl">
              Stepkaro helps footwear wholesalers discover manufacturers
              directly, access factory prices, view live stock and place orders
              anytime – without middlemen.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleLogin}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-sm text-white hover:shadow-lg transition flex items-center gap-2"
              >
                <span>↓</span> Download App
              </button>
              <button
                onClick={handleJoinAsManufacturer}
                className="px-6 py-3 rounded-lg bg-indigo-950/80 border border-indigo-700 font-semibold text-sm text-white hover:bg-indigo-900 transition"
              >
                Join as Manufacturer
              </button>
              <button
                onClick={handleJoinAsWholesaler}
                className="px-6 py-3 rounded-lg bg-indigo-950/80 border border-indigo-700 font-semibold text-sm text-white hover:bg-indigo-900 transition"
              >
                Join as Wholesaler
              </button>
            </div>
          </div> */}

        {/* <section className="relative bg-[#1A0744]"> */}
        <div className="relative w-full h-[500px] overflow-hidden">
          <Image
            src="/hero_banner.png"
            alt="Stepkaro App Screen"
            fill
            priority
            className="object-cover"
          />
        </div>
        {/* </section> */}

        {/* Right Hero App Banner Mockup */}
        {/* <div className="relative flex justify-center ">
          <div className="relative w-full h-[500px] px-6 py-6">
            <Image
              src="/hero_banner.png"
              alt="Stepkaro App Screen"
              fill
              className=" object-cover"
              priority
            />
          </div> */}
        {/* </div> */}
        {/* </div> */}

        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <BuildingOffice2Icon className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">1000+</h3>
              <p className="text-xs text-slate-400">Manufacturers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">5000+</h3>
              <p className="text-xs text-slate-400">Wholesalers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CubeIcon className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">1 Lakh+</h3>
              <p className="text-xs text-slate-400">Products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlobeAsiaAustraliaIcon className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">Pan India</h3>
              <p className="text-xs text-slate-400">Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wholesaler Box */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900/60 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wide">
                Benefits For Wholesalers
              </h2>
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Direct factory prices",
                "No hidden margins",
                "All designs, rates & live stock in one app",
                "No need to wait for photos / rates",
                "24/7 ordering – anytime, anywhere",
                "No calling – instant order confirmation",
                "Transparent pricing always",
                "Faster dispatch & reliable delivery",
                "Better margins, more profit",
                "App-only offers for wholesalers",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-200"
                >
                  <CheckCircleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manufacturer Box */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900/60 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wide">
                Benefits For Manufacturers
              </h2>
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <BuildingOffice2Icon className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            <div className="space-y-3">
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
                  className="flex items-start gap-2 text-xs text-slate-200"
                >
                  <CheckCircleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Stepkaro */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center uppercase tracking-tight mb-10">
          Why Choose <span className="text-amber-500">Stepkaro?</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-center flex flex-col items-center justify-center"
            >
              <item.icon className="w-8 h-8 text-amber-500 mb-2" />
              <h3 className="text-[11px] font-bold text-slate-200 uppercase leading-tight">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center uppercase tracking-tight mb-10">
          How It <span className="text-amber-500">Works</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { step: "1", title: "Register Your Business", icon: UserPlusIcon },
            { step: "2", title: "Create Your Profile", icon: UserIcon },
            {
              step: "3",
              title: "Browse Factories & Products",
              icon: MagnifyingGlassIcon,
            },
            { step: "4", title: "Place Order Anytime", icon: ShoppingCartIcon },
            { step: "5", title: "Get Fast Delivery", icon: TruckIcon },
            {
              step: "6",
              title: "Grow Your Business",
              icon: ArrowTrendingUpIcon,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-900/80 border border-indigo-700 text-amber-400 font-bold flex items-center justify-center mb-2 text-sm">
                {item.step}
              </div>
              <p className="text-xs font-semibold text-slate-300">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Wait / Comparison Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Why Wait Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold uppercase text-white tracking-wide">
                WHY WAIT?
              </h3>
              <p className="text-amber-500 font-bold text-lg">
                PLACE ORDERS 24/7
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-amber-500" /> No calling
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-amber-500" /> No waiting
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-amber-500" /> Instant order
                  confirmation
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Image
                src="/stepkaro1.jpeg"
                alt="Order Confirmed Mockup"
                width={200}
                height={200}
                className="rounded-xl object-contain"
              />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 text-center text-xs font-bold uppercase tracking-wider bg-slate-800 border-b border-slate-700 py-3">
              <div className="text-slate-400">Traditional Sourcing</div>
              <div className="text-amber-500">With Stepkaro</div>
            </div>

            <div className="divide-y divide-slate-700/60 text-xs flex-1">
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
                <div key={idx} className="grid grid-cols-2 p-3 text-center">
                  <div className="text-slate-400 flex items-center justify-center gap-1">
                    <XMarkIcon className="w-4 h-4 text-rose-500 inline" />{" "}
                    {row.trad}
                  </div>
                  <div className="text-slate-200 font-semibold flex items-center justify-center gap-1">
                    <CheckIcon className="w-4 h-4 text-emerald-400 inline" />{" "}
                    {row.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-8">
          What You Can <span className="text-amber-500">Sell / Source</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col items-center"
            >
              <div className="w-full h-24 relative mb-2 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  width={100}
                  height={80}
                  className="object-contain max-h-20"
                />
              </div>
              <p className="text-xs font-bold text-slate-200">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Banner CTA */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-10 pb-6 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-center border-b border-slate-800 pb-8">
          <div>
            <h3 className="text-lg font-black text-white uppercase">
              Download Stepkaro – <br />
              <span className="text-amber-500">Pay Less, Earn More.</span>
            </h3>
            <div className="mt-4 flex gap-3">
              <button className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
                Get it on Google Play
              </button>
              <button className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
                Download on App Store
              </button>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-xl font-bold tracking-tight text-white">
              Step<span className="text-amber-500">karo</span>
            </h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              India's Fastest Growing Footwear B2B Platform
            </p>
          </div>

          <div className="text-right text-xs text-slate-300 space-y-1">
            <p className="font-bold text-amber-500 uppercase">For Support</p>
            <p>+91 92170 56915</p>
            <p>www.stepkaro.in</p>
            <p>support@stepkaro.com</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
          <p>© 2026 Stepkaro Technologies Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-slate-300">
              Refund Policy
            </a>
            <a href="#" className="hover:text-slate-300">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
