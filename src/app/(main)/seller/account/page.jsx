"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Shield,
  Edit,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertCircle,
  Home,
  Briefcase,
  CreditCard,
  Globe,
  MapPinIcon,
  Hash,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Login required");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/vender/get_vender.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setVendor(result.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        if (
          result.message?.includes("token") ||
          response.status === 401
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setError("Session expired. Please login again.");
        } else {
          setError(result.message || "Failed to fetch profile");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  const handleEditProfile = () => {
    router.push("/seller/profile/edit");
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchVendor();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle size={18} />
          Profile loaded successfully!
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-400 mt-1">
              View and manage your account information
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-slate-800 text-gray-300 hover:bg-slate-700 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:scale-105 transition shadow-lg"
            >
              <Edit size={16} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">
                {vendor?.business_name?.charAt(0) || "V"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-white">
                  {vendor?.business_name || "Vendor"}
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium capitalize flex items-center gap-1">
                  <CheckCircle size={12} />
                  {vendor?.status || "Active"}
                </span>
              </div>
              <p className="text-gray-400 mt-1">{vendor?.owner_name}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Joined {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : "-"}
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={14} />
                  Verified Vendor
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <Briefcase size={18} className="text-teal-400" />
              <h3 className="text-lg font-semibold text-white">Business Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Building2 size={12} />
                  Business Name
                </p>
                <p className="text-white font-medium">
                  {vendor?.business_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <User size={12} />
                  Owner Name
                </p>
                <p className="text-white font-medium">
                  {vendor?.owner_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <FileText size={12} />
                  GST Number
                </p>
                <p className="text-white font-medium font-mono">
                  {vendor?.gst_number || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <CreditCard size={12} />
                  PAN Number
                </p>
                <p className="text-white font-medium font-mono">
                  {vendor?.pan_number || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <Mail size={18} className="text-teal-400" />
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Mail size={12} />
                  Email Address
                </p>
                <p className="text-white font-medium break-all">
                  {vendor?.Email || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Phone size={12} />
                  Phone Number
                </p>
                <p className="text-white font-medium">
                  {vendor?.phone || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <MapPin size={18} className="text-teal-400" />
              <h3 className="text-lg font-semibold text-white">Address Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Home size={12} />
                  Address
                </p>
                <p className="text-white font-medium break-all">
                  {vendor?.address || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Globe size={12} />
                  Country
                </p>
                <p className="text-white font-medium">
                  {vendor?.country || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPinIcon size={12} />
                  State
                </p>
                <p className="text-white font-medium">
                  {vendor?.state || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin size={12} />
                  City
                </p>
                <p className="text-white font-medium">
                  {vendor?.city || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Hash size={12} />
                  Pincode
                </p>
                <p className="text-white font-medium">
                  {vendor?.pincode || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-xl text-center">
          <p className="text-xs text-gray-500">
            Need to update your information? Click the Edit Profile button above.
          </p>
        </div>
      </div>
    </div>
  );
}