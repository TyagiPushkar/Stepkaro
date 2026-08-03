// app/admin/privacy-policy/page.jsx
"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  Building2,
  Calendar,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          {/* <Link
                        href="/"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link> */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
            {/* <p className="text-sm text-gray-500">Stepkaro Seller App</p> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Effective Date */}
          {/* <div className="bg-purple-50 border-b border-purple-100 px-6 py-4 flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span className="text-sm text-gray-700">
                            <span className="font-semibold">Effective Date:</span> 24-07-2026
                        </span>
                    </div> */}

          <div className="p-6 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Overview
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stepkaro Buyer App (“Stepkaro”, “we”, “our”, or “us”) is
                committed to protecting your personal information. This Privacy
                Policy explains how we collect, use, store, and protect your
                information when you use our mobile application and related
                services.
              </p>
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-800">
                  ✅ By using the Stepkaro Buyer App, you acknowledge that you
                  have read, understood, and agree to this Privacy Policy.
                </p>
              </div>
            </div>

            {/* 1. Information We Collect */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                When you create an account or place an order, we may collect:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-medium text-gray-800 text-sm mb-2">
                    Personal Information
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full Name</li>
                    <li>• Mobile Number</li>
                    <li>• Email Address (if provided)</li>
                    <li>• Business/Firm Name</li>
                    <li>• GST Number (if applicable)</li>
                    <li>• Billing & Shipping Address</li>
                    <li>• Profile Photo (optional)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-medium text-gray-800 text-sm mb-2">
                    Order Information
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Products viewed and ordered</li>
                    <li>• Order history</li>
                    <li>• Payment method</li>
                    <li>• Delivery details</li>
                    <li>• Invoice details</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-medium text-gray-800 text-sm mb-2">
                    Device Information
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Device model</li>
                    <li>• Operating system version</li>
                    <li>• App version</li>
                    <li>• Device identifiers</li>
                    <li>• IP address</li>
                    <li>• Crash logs</li>
                    <li>• Performance and diagnostic data</li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Location Information:</span>{" "}
                  With your permission, we may access your location to improve
                  delivery services and provide location-based features.
                </p>
              </div>
            </div>

            {/* 2. Use of Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                We use your information to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Create and manage your account",
                  "Process and fulfill orders",
                  "Connect you with sellers on the platform",
                  "Provide customer support",
                  "Send order confirmations and delivery updates",
                  "Improve app performance and user experience",
                  "Detect fraud and enhance security",
                  "Comply with legal and regulatory requirements",
                  "Notify you about new products, offers, and important updates",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium">
                  ⚠️ We do not sell, rent, or trade your personal information to
                  third parties.
                </p>
              </div>
            </div>

            {/* 3. Information Sharing */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Information Sharing
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Your information may be shared with:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Registered sellers",
                  "Logistics partners",
                  "Payment gateway providers",
                  "Cloud hosting providers",
                  "Analytics services",
                  "Crash reporting services",
                  "Government authorities",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-50 rounded-lg text-center border border-gray-100"
                  >
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-800">
                  🔒 Each service provider is required to protect your
                  information.
                </p>
              </div>
            </div>

            {/* 4. Payment Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Payment Information
              </h2>
              <p className="text-gray-600 text-sm">
                Payments are processed through secure third-party payment
                providers. Stepkaro does not store your complete debit card,
                credit card, or banking information on its servers.
              </p>
            </div>

            {/* 5. Data Security */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Data Security
              </h2>
              <p className="text-gray-600 text-sm">
                We implement reasonable administrative, technical, and physical
                safeguards to protect your personal information against
                unauthorized access, loss, misuse, alteration, or disclosure.
              </p>
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-red-800">
                  ⚠️ While we strive to protect your information, no method of
                  internet transmission or electronic storage is completely
                  secure.
                </p>
              </div>
            </div>

            {/* 6. Data Retention */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                6. Data Retention
              </h2>
              <p className="text-gray-600 text-sm">
                We retain your information only for as long as necessary to:
              </p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Provide our services
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Maintain transaction records
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Comply with legal obligations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Resolve disputes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Enforce our agreements
                </li>
              </ul>
            </div>

            {/* 7. Your Rights */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                7. Your Rights
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Depending on applicable laws, you may have the right to:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Access your personal information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Update or correct inaccurate information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Delete your account (subject to legal obligations)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Withdraw consent where applicable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Request information about how your data is processed
                </li>
              </ul>
              <div className="mt-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                <p className="text-sm text-cyan-800">
                  📋 To exercise these rights, contact us using the details
                  below.
                </p>
              </div>
            </div>

            {/* 8. Notifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                8. Notifications
              </h2>
              <p className="text-gray-600 text-sm">
                We may send notifications related to:
              </p>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Order status",
                  "Delivery updates",
                  "Account security",
                  "Promotional offers",
                  "App updates",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-50 rounded-lg text-center border border-gray-100"
                  >
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  You can manage promotional notifications through your device
                  settings or within the app where available.
                </p>
              </div>
            </div>

            {/* 9. Cookies and Analytics */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                9. Cookies and Analytics
              </h2>
              <p className="text-gray-600 text-sm">
                The app may use analytics technologies to understand user
                behavior, improve performance, fix bugs, and enhance user
                experience. These technologies do not intentionally collect
                sensitive personal information beyond what is necessary for
                service improvement.
              </p>
            </div>

            {/* 10. Children's Privacy */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                10. Children's Privacy
              </h2>
              <p className="text-gray-600 text-sm">
                Stepkaro Buyer App is intended for users who are at least 18
                years old and engaged in legitimate business activities. We do
                not knowingly collect personal information from children.
              </p>
            </div>

            {/* 11. Third-Party Links */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                11. Third-Party Links
              </h2>
              <p className="text-gray-600 text-sm">
                The app may contain links to third-party websites or services.
                We are not responsible for their privacy practices or content.
                Users should review their respective privacy policies.
              </p>
            </div>

            {/* 12. Changes to Policy */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 text-sm">
                We may update this Privacy Policy from time to time. Updated
                versions will be posted within the app and/or on our website
                with a revised effective date.
              </p>
            </div>

            {/* 13. Contact Us */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                13. Contact Us
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 opacity-70" />
                  <div>
                    <p className="text-purple-100 text-xs">Company</p>
                    <p className="font-medium">
                      StepKaro Technologies Private Limited
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 opacity-70" />
                  <div>
                    <p className="text-purple-100 text-xs">Email</p>
                    <a
                      href="mailto:info@stepkaro.in"
                      className="font-medium hover:underline"
                    >
                      info@stepkaro.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 opacity-70" />
                  <div>
                    <p className="text-purple-100 text-xs">Phone</p>
                    <a
                      href="tel:+919217056915"
                      className="font-medium hover:underline"
                    >
                      +91 9217056915
                    </a>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm text-purple-50">
                    If you have any questions regarding this Privacy Policy or
                    your personal information, please contact us at the details
                    above.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
              <p>© {new Date().getFullYear()} Stepkaro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
