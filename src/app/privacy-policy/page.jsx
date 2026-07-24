// app/admin/privacy-policy/page.jsx
"use client";
import Link from "next/link";
import { ArrowLeft, Shield, Mail, Phone, Building2, Calendar } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
                        <p className="text-sm text-gray-500">Stepkaro Seller App</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Effective Date */}
                    <div className="bg-purple-50 border-b border-purple-100 px-6 py-4 flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span className="text-sm text-gray-700">
                            <span className="font-semibold">Effective Date:</span> 24-07-2026
                        </span>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Overview */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-600" />
                                Overview
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Stepkaro (“we”, “our”, or “us”) operates the Stepkaro Seller App (“App”).
                                This Privacy Policy explains how we collect, use, store, and protect
                                information when manufacturers, suppliers, and sellers use our App.
                            </p>
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-sm text-purple-800">
                                    ✅ By using the Stepkaro Seller App, you agree to the collection and
                                    use of information in accordance with this Privacy Policy.
                                </p>
                            </div>
                        </div>

                        {/* 1. Information We Collect */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                1. Information We Collect
                            </h2>
                            <p className="text-gray-600 text-sm mb-3">
                                When you register or use the Stepkaro Seller App, we may collect:
                            </p>

                            <div className="space-y-3">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <h3 className="font-medium text-gray-800 text-sm mb-2">Business Information</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Business Name, Brand Name, Owner Name</li>
                                        <li>• Shop/Factory Address, Phone Number</li>
                                        <li>• Email Address (if provided)</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <h3 className="font-medium text-gray-800 text-sm mb-2">Business Verification</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• GST Number, PAN Number (if required)</li>
                                        <li>• Aadhaar Card Number (when required for verification)</li>
                                        <li>• Bank Account Details, UPI ID (if applicable)</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <h3 className="font-medium text-gray-800 text-sm mb-2">Product & Business Data</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Product listings, images, descriptions</li>
                                        <li>• Pricing, Inventory/Stock information</li>
                                        <li>• Order history, Payment and settlement records</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">This information is collected to:</span> Verify seller identity,
                                    approve accounts, display products, process orders, maintain records, provide support,
                                    improve platform, and comply with laws.
                                </p>
                            </div>
                        </div>

                        {/* 2. Use of Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                2. Use of Information
                            </h2>
                            <p className="text-gray-600 text-sm mb-3">
                                Information is used strictly for business and operational purposes:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[
                                    "Seller registration & authentication",
                                    "Identity verification",
                                    "Product listing & catalog management",
                                    "Inventory management",
                                    "Order processing & fulfillment",
                                    "Payment settlements",
                                    "GST invoicing & taxation",
                                    "Customer communication",
                                    "Fraud detection & prevention",
                                    "Platform security & improvements",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span className="text-sm text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <p className="text-sm text-emerald-800 font-medium">
                                    ⚠️ We do not sell, rent, or trade your personal information to third parties.
                                </p>
                            </div>
                        </div>

                        {/* 3. Data Sharing */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                3. Data Sharing and Disclosure
                            </h2>
                            <p className="text-gray-600 text-sm mb-3">
                                The App may share information with trusted third-party organizations:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                    "Buyers on Stepkaro",
                                    "Logistics partners",
                                    "Payment gateways",
                                    "Banking partners",
                                    "Cloud hosting",
                                    "Analytics providers",
                                    "Customer support",
                                    "Regulatory authorities",
                                ].map((item, i) => (
                                    <div key={i} className="p-2 bg-gray-50 rounded-lg text-center border border-gray-100">
                                        <span className="text-sm text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <p className="text-sm text-orange-800">
                                    🔒 Third parties receive only necessary information and maintain confidentiality standards.
                                </p>
                            </div>
                        </div>

                        {/* 4. Data Security */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                4. Data Security
                            </h2>
                            <p className="text-gray-600 text-sm">
                                We take reasonable measures to protect seller information against unauthorized access,
                                misuse, alteration, or disclosure. We follow industry-standard security practices.
                            </p>
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-sm text-red-800">
                                    ⚠️ No online system can guarantee complete security, but we follow best practices.
                                </p>
                            </div>
                        </div>

                        {/* 5. User Choices */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                5. User Choices and Control
                            </h2>
                            <p className="text-gray-600 text-sm mb-3">Sellers may:</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">✓</span>
                                    Review and update business information within the App
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">✓</span>
                                    Update product listings and inventory
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">✓</span>
                                    Request correction of inaccurate information
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-0.5">✓</span>
                                    Request deletion of account and personal data
                                </li>
                            </ul>
                            <div className="mt-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                                <p className="text-sm text-cyan-800">
                                    📋 Some records may be retained for taxation, accounting, fraud prevention, or legal compliance.
                                </p>
                            </div>
                        </div>

                        {/* 6. Children's Privacy */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                6. Children's Privacy
                            </h2>
                            <p className="text-gray-600 text-sm">
                                The Stepkaro Seller App is intended exclusively for business users and is not
                                directed toward children under 13. We do not knowingly collect personal information from children.
                            </p>
                        </div>

                        {/* 7. Third-Party Services */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                7. Third-Party Services
                            </h2>
                            <p className="text-gray-600 text-sm">
                                The App may use third-party services for payment processing, cloud storage, notifications,
                                analytics, customer support, and delivery logistics. These services operate under their own privacy policies.
                            </p>
                        </div>

                        {/* 8. Changes to Policy */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                8. Changes to This Privacy Policy
                            </h2>
                            <p className="text-gray-600 text-sm">
                                We may update this Privacy Policy periodically. Changes will be published within the App.
                                Continued use after changes constitutes acceptance.
                            </p>
                        </div>

                        {/* 9. Contact Us */}
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-6 text-white">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                9. Contact Us
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-4 w-4 opacity-70" />
                                    <div>
                                        <p className="text-purple-100 text-xs">App Name</p>
                                        <p className="font-medium">Stepkaro Seller</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 opacity-70" />
                                    <div>
                                        <p className="text-purple-100 text-xs">Email</p>
                                        <a href="mailto:stepkaroapp@gmail.com" className="font-medium hover:underline">
                                            stepkaroapp@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                                    <p className="text-sm text-purple-50">
                                        If you have any questions regarding this Privacy Policy or your personal information,
                                        please contact us at the email above.
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