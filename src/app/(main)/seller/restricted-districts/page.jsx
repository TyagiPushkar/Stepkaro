"use client";
import { useEffect, useState } from "react";
import { Crosshair, RefreshCw, AlertCircle } from "lucide-react";
import RestrictedDistrictsManager from "@/app/components/shared/vendor_district";

export default function RestrictedDistrictsPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendor = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Login required. Please log in again.");
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
        },
      );

      const result = await response.json();

      if (result.success) {
        setVendor(result.data);
      } else {
        setError(result.message || "Failed to fetch vendor profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-600 font-medium">Loading districts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={fetchVendor}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Crosshair size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
              Restricted Districts
            </h1>
            <p className="mt-0.5 text-sm text-violet-600">
              Manage districts where your products are not available for delivery
            </p>
          </div>
        </div>

        <button
          onClick={fetchVendor}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 transition self-start lg:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Vendor Info Banner */}
      {vendor && (
        <div className="mb-6 bg-white/80 backdrop-blur-sm border border-violet-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <span className="text-lg font-bold text-white">
              {vendor.business_name?.charAt(0) || "V"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{vendor.business_name}</p>
            <p className="text-xs text-gray-500">{vendor.owner_name} &bull; ID: {vendor.id}</p>
          </div>
        </div>
      )}

      {/* Main Component */}
      <div className="bg-white/80 backdrop-blur-sm border border-violet-100 rounded-2xl p-6 shadow-lg">
        {vendor?.id ? (
          <RestrictedDistrictsManager
            vendorId={vendor.id}
            vendorName={vendor.business_name}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Crosshair size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No vendor data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
