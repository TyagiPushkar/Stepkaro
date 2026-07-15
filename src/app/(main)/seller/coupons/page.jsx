"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  RefreshCw,
  AlertCircle,
  X,
  Check,
  Percent,
  Tag,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from "lucide-react";
import axios from "axios";

export default function SellerCouponPage() {
  // State Management
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Notification Toast State
  const [toast, setToast] = useState(null);

  //token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    coupon_type: "code",
    coupon_code: "",
    discount_type: "fixed",
    discount_value: "",
    per_user_limit: "1",
    min_order_amount: "",
    start_date: "",
    end_date: "",
  });

  // --- API Action Handlers ---

  // 1. Fetch Coupons (GET)
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://namami-infotech.com/Stepkaro/src/coupens/get_vendor_coupen.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = response?.data;
      if (result.success) {
        setCoupons(result.data);
      } else {
        showToast("Failed to fetch coupons", "error");
      }
    } catch (error) {
      showToast("Network error while fetching coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // 2. Toggle Coupon Status (POST)
  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(
        "https://namami-infotech.com/Stepkaro/src/coupens/toggle_coupen.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coupon_id: id }),
        },
      );

      // Optimistically update UI
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: c.status === 1 ? 0 : 1 } : c,
        ),
      );
      showToast("Coupon status updated successfully", "success");
    } catch (error) {
      showToast("Failed to toggle status", "error");
    }
  };

  // 3. Create or Update Coupon (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = !!editingCoupon;
    const url = isEdit
      ? "https://namami-infotech.com/Stepkaro/src/coupens/update_coupen.php"
      : "https://namami-infotech.com/Stepkaro/src/coupens/create_coupen.php";

    // Prepare payload dynamically structured according to coupon types
    const payload = {
      coupon_type: formData.coupon_type,
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      min_order_amount: Number(formData.min_order_amount),
      per_user_limit: Number(formData.per_user_limit),
    };

    if (formData.coupon_type === "code") {
      payload.coupon_code = formData.coupon_code;
      payload.start_date = formData.start_date
        ? `${formData.start_date} 00:00:00`
        : null;
      payload.end_date = formData.end_date
        ? `${formData.end_date} 23:59:59`
        : null;
    } else {
      payload.coupon_code = null;
      payload.start_date = null;
      payload.end_date = null;
    }

    if (isEdit) {
      payload.coupon_id = editingCoupon.id;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      showToast(
        isEdit
          ? "Coupon updated successfully!"
          : "Coupon created successfully!",
        "success",
      );
      setIsModalOpen(false);
      fetchCoupons(); // Refresh data
    } catch (error) {
      showToast("Something went wrong saving the coupon", "error");
    }
  };

  // --- Helpers ---
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        coupon_type: coupon.coupon_type,
        coupon_code: coupon.coupon_code || "",
        discount_type: coupon.discount_type,
        discount_value: String(coupon.discount_value),
        per_user_limit: String(coupon.per_user_limit),
        min_order_amount: String(coupon.min_order_amount),
        start_date: coupon.start_date ? coupon.start_date.split(" ")[0] : "",
        end_date: coupon.end_date ? coupon.end_date.split(" ")[0] : "",
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        coupon_type: "code",
        coupon_code: "",
        discount_type: "fixed",
        discount_value: "",
        per_user_limit: "1",
        min_order_amount: "",
        start_date: "",
        end_date: "",
      });
    }
    setIsModalOpen(true);
  };

  // --- Client-side Search & Filtering ---
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        (coupon.coupon_code?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ) ||
        coupon.coupon_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === "all" || coupon.coupon_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [coupons, searchQuery, typeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      {/* Toast Notification Container */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-all border text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Main Dashboard Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Coupons & Offers
          </h1>
          <p className="text-sm text-slate-500">
            Manage codes and value-driven automatic checkout discounts.
          </p>
        </div>
        {/* <div className="flex gap-2">
          <button
            onClick={fetchCoupons}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => openModal(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div> */}
      </div>

      {/* Search & Filter Controls */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by coupon code or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="code">Coupon Code</option>
          <option value="order_value">Order Value Threshold</option>
        </select>
      </div>

      {/* Coupons Main Grid Layout */}
      <div className="max-w-6xl mx-auto">
        {loading && coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-sm text-slate-500">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center">
            <Tag className="w-12 h-12 text-slate-300 mb-3" />
            <p className="font-semibold text-slate-700">No coupons found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try adapting your search parameters or build a new promotional
              offer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
                  coupon.status === 0
                    ? "border-slate-200 opacity-75"
                    : "border-indigo-100"
                }`}
              >
                {/* Decorative Side Tag Ribbon */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${
                    coupon.coupon_type === "code"
                      ? "bg-indigo-500"
                      : "bg-amber-500"
                  }`}
                />

                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          coupon.coupon_type === "code"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {coupon.coupon_type === "code" ? (
                          <Tag className="w-3 h-3" />
                        ) : (
                          <Percent className="w-3 h-3" />
                        )}
                        {coupon.coupon_type === "code"
                          ? "Promo Code"
                          : "Auto Order Discount"}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">
                        {coupon.coupon_type === "code" ? (
                          <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono tracking-wider">
                            {coupon.coupon_code}
                          </code>
                        ) : (
                          "Cart Bulk Discount"
                        )}
                      </h3>
                    </div>

                    {/* Status Toggle Switch Icon */}
                    <button
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`text-2xl transition focus:outline-none ${
                        coupon.status === 1
                          ? "text-emerald-500"
                          : "text-slate-300"
                      }`}
                      title={coupon.status === 1 ? "Deactivate" : "Activate"}
                    >
                      {coupon.status === 1 ? (
                        <ToggleRight className="w-9 h-9" />
                      ) : (
                        <ToggleLeft className="w-9 h-9" />
                      )}
                    </button>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3 my-3 text-sm">
                    <div>
                      <span className="block text-xs text-slate-400">
                        Discount Value
                      </span>
                      <span className="font-bold text-slate-800 text-base">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% Off`
                          : `₹${coupon.discount_value}`}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">
                        Min. Order Limit
                      </span>
                      <span className="font-semibold text-slate-700">
                        ₹{coupon.min_order_amount}
                      </span>
                    </div>
                  </div>

                  {/* Validity Info */}
                  {coupon.coupon_type === "code" && coupon.start_date ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Valid: {coupon.start_date.split(" ")[0]} to{" "}
                        {coupon.end_date?.split(" ")[0]}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-600 font-medium mt-2">
                      Always active upon threshold validation
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
                  <div className="text-xs text-slate-400">
                    Used:{" "}
                    <span className="font-semibold text-slate-700">
                      {coupon.used_count}
                    </span>{" "}
                    times
                  </div>
                  <button
                    onClick={() => openModal(coupon)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg transition"
                  >
                    <Pencil className="w-3 h-3" /> Edit Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Action Modal (Create/Edit Form Container) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Sticky Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingCoupon
                    ? "Edit Coupon Parameters"
                    : "Create New Campaign"}
                </h2>
                <p className="text-xs text-slate-400">
                  Configure parameters aligning with core checkout workflows.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
              {/* Type Selection Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Campaign Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    disabled={!!editingCoupon}
                    onClick={() =>
                      setFormData({ ...formData, coupon_type: "code" })
                    }
                    className={`py-2 text-sm font-medium rounded-lg transition ${
                      formData.coupon_type === "code"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 disabled:opacity-50"
                    }`}
                  >
                    Promo Code Entry
                  </button>
                  <button
                    type="button"
                    disabled={!!editingCoupon}
                    onClick={() =>
                      setFormData({ ...formData, coupon_type: "order_value" })
                    }
                    className={`py-2 text-sm font-medium rounded-lg transition ${
                      formData.coupon_type === "order_value"
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 disabled:opacity-50"
                    }`}
                  >
                    Order Value Automatic
                  </button>
                </div>
              </div>

              {/* Conditional Promo Code Row */}
              {formData.coupon_type === "code" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Coupon Text Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE50, MONSOON20"
                    value={formData.coupon_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coupon_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Discount Mechanics Split Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Value Metric
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="fixed">Fixed Currency Amount (₹)</option>
                    <option value="percentage">Percentage Scale (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Discount Magnitude *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={
                      formData.discount_type === "percentage" ? "10" : "500"
                    }
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Threshold Adjustments Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Minimum Cart Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="30000"
                    value={formData.min_order_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_amount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Per User Cap Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1 (0 for unlimited)"
                    value={formData.per_user_limit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        per_user_limit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Timeline Bounds Row (Only if Promo Code Type) */}
              {formData.coupon_type === "code" && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Start Active Period
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      End Expiry Period
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Form Action Controls Footer */}
              <div className="border-t border-slate-100 pt-5 mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
                >
                  {editingCoupon ? "Save Modifications" : "Deploy Promotion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
