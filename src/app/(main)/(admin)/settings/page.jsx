"use client";
import { useState } from "react";
import { 
  Save, 
  Upload, 
  X,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Truck,
  Palette,
  Bell,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

export default function SettingsPage() {
  const tabs = [
    { id: "Brand", label: "Brand", icon: Globe },
    { id: "Store", label: "Store", icon: ShoppingBag },
    { id: "Order & Wallet", label: "Order & Wallet", icon: Wallet },
    { id: "Payment", label: "Payment", icon: CreditCard },
    { id: "Shipping", label: "Shipping", icon: Truck },
    { id: "Theme", label: "Theme", icon: Palette },
    { id: "Notification", label: "Notification", icon: Bell },
    { id: "Marketing", label: "Marketing", icon: TrendingUp },
  ];

  const [activeTab, setActiveTab] = useState("Brand");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Brand Settings State
  const [brandSettings, setBrandSettings] = useState({
    brandName: "STEPKARO TECHNOLOGIES",
    tagline: "Stepkaro",
    address: "Raipur, Chhattisgarh, India",
    whatsappNumber: "9217056915",
    callingNumber: "9217056915",
    email: "stepkaroapp@gmail.com",
    website: "www.stepkaro.com",
    navbarLogo: null,
    footerLogo: null,
    favicon: null,
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: ""
    }
  });

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: "StepKaro Store",
    storeEmail: "store@stepkaro.com",
    storePhone: "9217056915",
    storeAddress: "Raipur, Chhattisgarh",
    storeTiming: "10:00 AM - 8:00 PM",
    holidayMode: false,
    storeDescription: "Your one-stop shop for quality footwear",
    currency: "INR",
    timezone: "IST"
  });

  // Order & Wallet Settings
  const [orderWalletSettings, setOrderWalletSettings] = useState({
    minOrderAmount: 0,
    maxOrderAmount: 50000,
    walletEnabled: true,
    codEnabled: true,
    prepaidEnabled: true,
    autoConfirmOrder: false,
    orderCancelTime: 30,
    returnPolicyDays: 7
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    stripeEnabled: false,
    paypalEnabled: false,
    upiEnabled: true,
    bankTransferEnabled: true,
    razorpayKey: "rzp_test_xxxxx",
    razorpaySecret: "xxxxx_xxxxx",
    upiId: "stepkaro@okhdfcbank"
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 500,
    domesticShippingCharge: 50,
    internationalShipping: false,
    deliveryDays: "3-5",
    codCharge: 30,
    pickupAvailable: true
  });

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#14b8a6",
    secondaryColor: "#0f172a",
    accentColor: "#f59e0b",
    darkMode: true,
    compactView: false,
    fontSize: "medium"
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    lowStockAlert: true,
    newUserAlert: true
  });

  // Marketing Settings
  const [marketingSettings, setMarketingSettings] = useState({
    googleAnalytics: "UA-XXXXX-X",
    facebookPixel: "123456789",
    allowPromotions: true,
    newsletterEnabled: true,
    referAndEarn: true,
    discountCode: "WELCOME10",
    affiliateProgram: false
  });

  const handleSaveSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log("Settings saved:", {
      brand: brandSettings,
      store: storeSettings,
      orderWallet: orderWalletSettings,
      payment: paymentSettings,
      shipping: shippingSettings,
      theme: themeSettings,
      notification: notificationSettings,
      marketing: marketingSettings
    });
  };

  const handleImageUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandSettings({ ...brandSettings, [type]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    setBrandSettings({ ...brandSettings, [type]: null });
  };

  const colorOptions = [
    { name: "Teal", value: "#14b8a6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Green", value: "#10b981" }
  ];

  const TabContent = () => {
    switch(activeTab) {
      case "Brand":
        return (
          <div className="space-y-6">
            {/* Logos Section */}
            <div>
              <h3 className="text-white font-semibold mb-4">Brand Logos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Navbar Logo */}
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Brand Logo (Navbar)</p>
                  <div className="w-full h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 hover:border-teal-500/50 transition-colors relative">
                    {brandSettings.navbarLogo ? (
                      <>
                        <img src={brandSettings.navbarLogo} alt="Navbar Logo" className="max-h-28 object-contain" />
                        <button
                          onClick={() => removeImage("navbarLogo")}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <Upload size={24} className="text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500">Upload Logo</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload("navbarLogo", e)} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Footer Logo */}
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Brand Logo (Footer)</p>
                  <div className="w-full h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 hover:border-teal-500/50 transition-colors relative">
                    {brandSettings.footerLogo ? (
                      <>
                        <img src={brandSettings.footerLogo} alt="Footer Logo" className="max-h-28 object-contain" />
                        <button
                          onClick={() => removeImage("footerLogo")}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <Upload size={24} className="text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500">Upload Logo</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload("footerLogo", e)} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Favicon */}
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Favicon</p>
                  <div className="w-full h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 hover:border-teal-500/50 transition-colors relative">
                    {brandSettings.favicon ? (
                      <>
                        <img src={brandSettings.favicon} alt="Favicon" className="w-16 h-16 object-contain" />
                        <button
                          onClick={() => removeImage("favicon")}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <Upload size={24} className="text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500">Upload Favicon</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload("favicon", e)} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Information */}
            <div>
              <h3 className="text-white font-semibold mb-4">Brand Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Brand Name</label>
                  <input
                    value={brandSettings.brandName}
                    onChange={(e) => setBrandSettings({...brandSettings, brandName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Tagline</label>
                  <input
                    value={brandSettings.tagline}
                    onChange={(e) => setBrandSettings({...brandSettings, tagline: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Address</label>
                  <input
                    value={brandSettings.address}
                    onChange={(e) => setBrandSettings({...brandSettings, address: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Website</label>
                  <input
                    value={brandSettings.website}
                    onChange={(e) => setBrandSettings({...brandSettings, website: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">WhatsApp Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={brandSettings.whatsappNumber}
                      onChange={(e) => setBrandSettings({...brandSettings, whatsappNumber: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Calling Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={brandSettings.callingNumber}
                      onChange={(e) => setBrandSettings({...brandSettings, callingNumber: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={brandSettings.email}
                      onChange={(e) => setBrandSettings({...brandSettings, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Store":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Store Name</label>
                <input
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Store Email</label>
                <input
                  value={storeSettings.storeEmail}
                  onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Store Phone</label>
                <input
                  value={storeSettings.storePhone}
                  onChange={(e) => setStoreSettings({...storeSettings, storePhone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Store Address</label>
                <input
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({...storeSettings, storeAddress: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Store Timing</label>
                <input
                  value={storeSettings.storeTiming}
                  onChange={(e) => setStoreSettings({...storeSettings, storeTiming: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Currency</label>
                <select
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Store Description</label>
              <textarea
                value={storeSettings.storeDescription}
                onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white font-medium">Holiday Mode</p>
                <p className="text-xs text-gray-400">Temporarily close your store</p>
              </div>
              <button
                onClick={() => setStoreSettings({...storeSettings, holidayMode: !storeSettings.holidayMode})}
                className={`relative w-12 h-6 rounded-full transition-colors ${storeSettings.holidayMode ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${storeSettings.holidayMode ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        );

      case "Order & Wallet":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={orderWalletSettings.minOrderAmount}
                  onChange={(e) => setOrderWalletSettings({...orderWalletSettings, minOrderAmount: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Maximum Order Amount (₹)</label>
                <input
                  type="number"
                  value={orderWalletSettings.maxOrderAmount}
                  onChange={(e) => setOrderWalletSettings({...orderWalletSettings, maxOrderAmount: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Order Cancellation Time (minutes)</label>
                <input
                  type="number"
                  value={orderWalletSettings.orderCancelTime}
                  onChange={(e) => setOrderWalletSettings({...orderWalletSettings, orderCancelTime: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Return Policy (days)</label>
                <input
                  type="number"
                  value={orderWalletSettings.returnPolicyDays}
                  onChange={(e) => setOrderWalletSettings({...orderWalletSettings, returnPolicyDays: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <p className="text-white">Enable Wallet</p>
                <button
                  onClick={() => setOrderWalletSettings({...orderWalletSettings, walletEnabled: !orderWalletSettings.walletEnabled})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${orderWalletSettings.walletEnabled ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${orderWalletSettings.walletEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <p className="text-white">Enable COD</p>
                <button
                  onClick={() => setOrderWalletSettings({...orderWalletSettings, codEnabled: !orderWalletSettings.codEnabled})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${orderWalletSettings.codEnabled ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${orderWalletSettings.codEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <p className="text-white">Enable Prepaid</p>
                <button
                  onClick={() => setOrderWalletSettings({...orderWalletSettings, prepaidEnabled: !orderWalletSettings.prepaidEnabled})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${orderWalletSettings.prepaidEnabled ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${orderWalletSettings.prepaidEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case "Payment":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Razorpay Key ID</label>
                <input
                  value={paymentSettings.razorpayKey}
                  onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKey: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Razorpay Secret</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={paymentSettings.razorpaySecret}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpaySecret: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">UPI ID</label>
                <input
                  value={paymentSettings.upiId}
                  onChange={(e) => setPaymentSettings({...paymentSettings, upiId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white">Razorpay</p>
                  <p className="text-xs text-gray-400">Online payment gateway</p>
                </div>
                <button
                  onClick={() => setPaymentSettings({...paymentSettings, razorpayEnabled: !paymentSettings.razorpayEnabled})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${paymentSettings.razorpayEnabled ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${paymentSettings.razorpayEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white">UPI Payments</p>
                  <p className="text-xs text-gray-400">Google Pay, PhonePe, etc.</p>
                </div>
                <button
                  onClick={() => setPaymentSettings({...paymentSettings, upiEnabled: !paymentSettings.upiEnabled})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${paymentSettings.upiEnabled ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${paymentSettings.upiEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case "Shipping":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Domestic Shipping Charge (₹)</label>
                <input
                  type="number"
                  value={shippingSettings.domesticShippingCharge}
                  onChange={(e) => setShippingSettings({...shippingSettings, domesticShippingCharge: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">COD Charge (₹)</label>
                <input
                  type="number"
                  value={shippingSettings.codCharge}
                  onChange={(e) => setShippingSettings({...shippingSettings, codCharge: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Delivery Time (days)</label>
                <input
                  value={shippingSettings.deliveryDays}
                  onChange={(e) => setShippingSettings({...shippingSettings, deliveryDays: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white">Pickup Available</p>
                <p className="text-xs text-gray-400">Allow customers to pickup from store</p>
              </div>
              <button
                onClick={() => setShippingSettings({...shippingSettings, pickupAvailable: !shippingSettings.pickupAvailable})}
                className={`relative w-12 h-6 rounded-full transition-colors ${shippingSettings.pickupAvailable ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${shippingSettings.pickupAvailable ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        );

      case "Theme":
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Primary Color</label>
              <div className="flex gap-3 flex-wrap">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setThemeSettings({...themeSettings, primaryColor: color.value})}
                    className={`w-10 h-10 rounded-full transition-all ${themeSettings.primaryColor === color.value ? "ring-2 ring-white scale-110" : ""}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 block mb-2">Font Size</label>
              <div className="flex gap-3">
                {["small", "medium", "large"].map(size => (
                  <button
                    key={size}
                    onClick={() => setThemeSettings({...themeSettings, fontSize: size})}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      themeSettings.fontSize === size 
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" 
                        : "bg-slate-800/50 text-gray-400 border border-white/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white">Dark Mode</p>
                  <p className="text-xs text-gray-400">Enable dark theme across the store</p>
                </div>
                <button
                  onClick={() => setThemeSettings({...themeSettings, darkMode: !themeSettings.darkMode})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${themeSettings.darkMode ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${themeSettings.darkMode ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white">Compact View</p>
                  <p className="text-xs text-gray-400">Show more items per page</p>
                </div>
                <button
                  onClick={() => setThemeSettings({...themeSettings, compactView: !themeSettings.compactView})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${themeSettings.compactView ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${themeSettings.compactView ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case "Notification":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive updates via email</p>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                className={`relative w-12 h-6 rounded-full transition-colors ${notificationSettings.emailNotifications ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notificationSettings.emailNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white">SMS Notifications</p>
                <p className="text-xs text-gray-400">Receive updates via SMS</p>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
                className={`relative w-12 h-6 rounded-full transition-colors ${notificationSettings.smsNotifications ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notificationSettings.smsNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white">Push Notifications</p>
                <p className="text-xs text-gray-400">Browser push notifications</p>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
                className={`relative w-12 h-6 rounded-full transition-colors ${notificationSettings.pushNotifications ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notificationSettings.pushNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white">Order Updates</p>
                <p className="text-xs text-gray-400">Get notified for all orders</p>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, orderUpdates: !notificationSettings.orderUpdates})}
                className={`relative w-12 h-6 rounded-full transition-colors ${notificationSettings.orderUpdates ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notificationSettings.orderUpdates ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white">Low Stock Alert</p>
                <p className="text-xs text-gray-400">Get alert when stock is low</p>
              </div>
              <button
                onClick={() => setNotificationSettings({...notificationSettings, lowStockAlert: !notificationSettings.lowStockAlert})}
                className={`relative w-12 h-6 rounded-full transition-colors ${notificationSettings.lowStockAlert ? "bg-teal-500" : "bg-gray-700"}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notificationSettings.lowStockAlert ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        );

      case "Marketing":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Google Analytics ID</label>
                <input
                  value={marketingSettings.googleAnalytics}
                  onChange={(e) => setMarketingSettings({...marketingSettings, googleAnalytics: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="UA-XXXXX-X"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Facebook Pixel ID</label>
                <input
                  value={marketingSettings.facebookPixel}
                  onChange={(e) => setMarketingSettings({...marketingSettings, facebookPixel: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="123456789"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Default Discount Code</label>
                <input
                  value={marketingSettings.discountCode}
                  onChange={(e) => setMarketingSettings({...marketingSettings, discountCode: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white">Refer & Earn</p>
                  <p className="text-xs text-gray-400">Allow customers to refer friends</p>
                </div>
                <button
                  onClick={() => setMarketingSettings({...marketingSettings, referAndEarn: !marketingSettings.referAndEarn})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${marketingSettings.referAndEarn ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${marketingSettings.referAndEarn ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white">Newsletter Enabled</p>
                  <p className="text-xs text-gray-400">Collect subscriber emails</p>
                </div>
                <button
                  onClick={() => setMarketingSettings({...marketingSettings, newsletterEnabled: !marketingSettings.newsletterEnabled})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${marketingSettings.newsletterEnabled ? "bg-teal-500" : "bg-gray-700"}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${marketingSettings.newsletterEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle size={18} />
          Settings saved successfully!
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your store settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <TabContent />
        
        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleSaveSettings}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}