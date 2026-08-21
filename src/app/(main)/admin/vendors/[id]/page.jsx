"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Package,
  Pencil,
  Percent,
  Phone,
  Plus,
  RefreshCw,
  ScrollText,
  Search,
  ShieldCheck,
  Store,
  Tag,
  ToggleLeft,
  ToggleRight,
  Truck,
  User,
  Wallet,
  X,
} from "lucide-react";
import axios from "axios";
import RestrictedDistrictsManager from "@/app/components/shared/vendor_district";

const VENDOR_API =
  "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php";

const VENDOR_UPDATE_API =
  "https://namami-infotech.com/Stepkaro/src/vender/update_vendor_details.php";
const WALLET_API =
  "https://namami-infotech.com/Stepkaro/src/admin/get_district_history.php";
const ORDER_API =
  "https://namami-infotech.com/Stepkaro/src/order/admin_get_orders.php";
const COUPON_API =
  "https://namami-infotech.com/Stepkaro/src/coupens/get_vendor_coupen.php";
const CREATE_COUPON_API =
  "https://namami-infotech.com/Stepkaro/src/coupens/create_coupen.php";
const UPDATE_COUPON_API =
  "https://namami-infotech.com/Stepkaro/src/coupens/update_coupen.php";
const TOGGLE_COUPON_API =
  "https://namami-infotech.com/Stepkaro/src/coupens/toggle_coupen.php";

const GET_DISTRICTS_LIST_API =
  "https://namami-infotech.com/Stepkaro/src/location/get_district.php";

const GET_RESTRICTED_DISTRICTS_API =
  "https://namami-infotech.com/Stepkaro/src/vender/get_restrict_district.php";
const BANK_DETAILS_API =
  "https://namami-infotech.com/Stepkaro/src/bank/get_bank_details.php";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

const getStatusBadgeClasses = (status) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "inactive") return "bg-slate-100 text-slate-700";
  return "bg-rose-100 text-rose-700";
};

const normalizeVendor = (item) => ({
  ...item,
  id: item.id,
  user_id: item.user_id || item.vendor_id || item.seller_id || "",
  name: item.owner_name || item.name || "",
  email: item.email || "",
  phone: item.phone || "",
  status: item.status || "",
  wallet_value: item.minimum_order_value || 0,
  business_name: item.business_name || item.brand_name || "",
  brand_name: item.brand_name || "",
  brand_image: item.brand_image
    ? item.brand_image.startsWith("http")
      ? item.brand_image
      : `https://namami-infotech.com/Stepkaro/${item.brand_image.replace(/^\/+/, "")}`
    : "",
  settlement_date: item.due_days || "",
  gst_number: item.gst_number || "",
  pan_number: item.pan_number || "",
  address: item.address || "",
  state: item.state || "",
  district: item.district || "",
  city: item.city || "",
  country: item.country || "",
  pincode: item.pincode || "",
  delivery_location: item.delivery_location || "",
  logistic_partner_name: item.logistic_partner_name || "",
  logistic_contact_no: item.logistic_contact_no || "",
  document_number: item.document_number || "",
  document_image: item.document_image
    ? `https://namami-infotech.com/Stepkaro/${item.document_image}`
    : "",
  created_at: item.created_at || item.createdAt || "",
  avatar: "🏪",
  rawData: item,
});

const normalizeWalletItem = (item) => {
  const rawType = (item.type || item.transaction_type || item.action || "")
    .toString()
    .toLowerCase();
  const type = rawType.includes("debit")
    ? "debit"
    : rawType.includes("credit")
      ? "credit"
      : rawType || "credit";

  return {
    id: item.id || item.transaction_id || "-",
    type,
    amount: Number(item.amount || item.transaction_amount || 0),
    wallet_before: Number(item.wallet_before || item.balance_before || 0),
    wallet_after: Number(
      item.wallet_after || item.balance_after || item.current_balance || 0,
    ),
    note: item.note || item.description || item.remarks || "-",
    date: item.created_at || item.transaction_date || item.date || "-",
  };
};

export default function VendorDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const vendorId = params?.id;
  const initialTab = searchParams?.get("tab");

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [activeTab, setActiveTab] = useState(
    ["overview", "edit", "wallets", "orders", "coupons", "more"].includes(
      initialTab,
    )
      ? initialTab
      : "overview",
  );
  const [toast, setToast] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);

  // Coupon states - FIX: Use single source of truth
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponSearchQuery, setCouponSearchQuery] = useState("");
  const [couponTypeFilter, setCouponTypeFilter] = useState("all");

  const [couponFormData, setCouponFormData] = useState({
    coupon_type: "code",
    coupon_code: "",
    discount_type: "fixed",
    discount_value: "",
    per_user_limit: "0",
    min_order_amount: "",
    start_date: "",
    end_date: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  };

  // Fetch Vendor Details
  useEffect(() => {
    if (!vendorId) return;

    const fetchVendor = async () => {
      setLoading(true);
      try {
        console.log("Fetching vendor details for ID:", vendorId);
        const response = await fetch(
          `${VENDOR_API}?type=seller&id=${vendorId}`,
        );
        const data = await response.json();
        console.log("Vendor API response:", data);

        const vendors = Array.isArray(data?.data?.vendors)
          ? data.data.vendors
          : [];

        const foundVendor = vendors[0];

        if (!foundVendor) {
          showToast("Vendor not found.", "error");
          setVendor(null);
          return;
        }

        const normalizedVendor = normalizeVendor(foundVendor);
        setVendor(normalizedVendor);
        setEditData({
          name: normalizedVendor.name || "",
          email: normalizedVendor.email || "",
          phone: normalizedVendor.phone || "",
          status: normalizedVendor.status || "",
          business_name: normalizedVendor.business_name || "",
          settlement_date: normalizedVendor.settlement_date || "",
          brand_name: normalizedVendor.brand_name || "",
          brand_image: normalizedVendor.brand_image || "",
          minimum_card_value: normalizedVendor.wallet_value || 0,
          gst_number: normalizedVendor.gst_number || "",
          pan_number: normalizedVendor.pan_number || "",
          address: normalizedVendor.address || "",
          city: normalizedVendor.city || "",
          state: normalizedVendor.state || "",
          country: normalizedVendor.country || "",
          pincode: normalizedVendor.pincode || "",
          delivery_location: normalizedVendor.delivery_location || "",
          logistic_partner_name: normalizedVendor.logistic_partner_name || "",
          logistic_contact_no: normalizedVendor.logistic_contact_no || "",
          document_number: normalizedVendor.document_number || "",
        });
      } catch (error) {
        console.error(error);
        showToast("Unable to load vendor details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId || !token) return;

    const fetchBankDetails = async () => {
      setBankLoading(true);
      try {
        const response = await axios.get(BANK_DETAILS_API, {
          params: { vendor_id: vendorId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = response?.data?.data ?? response?.data;
        const bankData = Array.isArray(payload) ? payload[0] : payload;

        if (bankData && typeof bankData === "object") {
          setBankDetails(bankData);
        } else {
          setBankDetails(null);
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setBankDetails(null);
      } finally {
        setBankLoading(false);
      }
    };

    fetchBankDetails();
  }, [vendorId, token]);

  const fetchCoupons = useCallback(async () => {
    if (!vendor?.id && !vendorId) return;

    setCouponLoading(true);
    try {
      const response = await axios.get(`${COUPON_API}?vendor_id=${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Coupon API response:", response.data);

      if (response.data?.success) {
        const couponData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        const filtered = couponData.filter((coupon) => {
          const ids = [
            coupon.vendor_id,
            coupon.seller_id,
            coupon.user_id,
            coupon.vendorId,
            coupon.sellerId,
          ];
          return ids
            .map((value) => String(value || ""))
            .includes(String(vendor?.id || vendorId));
        });

        setCoupons(filtered.length ? filtered : couponData);
        console.log("Set coupons:", filtered.length ? filtered : couponData);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    } finally {
      setCouponLoading(false);
    }
  }, [token, vendor?.id, vendorId]);

  useEffect(() => {
    if (!vendor?.id && !vendorId) return;

    let isMounted = true;

    const loadCoupons = async () => {
      setCouponLoading(true);
      try {
        const response = await axios.get(
          `${COUPON_API}?vendor_id=${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data?.success && isMounted) {
          const couponData = Array.isArray(response.data.data)
            ? response.data.data
            : [];

          const filtered = couponData.filter((coupon) => {
            const ids = [
              coupon.vendor_id,
              coupon.seller_id,
              coupon.user_id,
              coupon.vendorId,
              coupon.sellerId,
            ];
            return ids
              .map((value) => String(value || ""))
              .includes(String(vendor?.id || vendorId));
          });

          setCoupons(filtered.length ? filtered : couponData);
        } else if (isMounted) {
          setCoupons([]);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        if (isMounted) {
          setCoupons([]);
        }
      } finally {
        if (isMounted) {
          setCouponLoading(false);
        }
      }
    };

    void loadCoupons();

    return () => {
      isMounted = false;
    };
  }, [token, vendor?.id, vendorId]);

  const handleToggleCouponStatus = async (id) => {
    try {
      await axios.post(
        TOGGLE_COUPON_API,
        { coupon_id: id, vendor_id: vendorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setCoupons((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: c.status === 1 ? 0 : 1 } : c,
        ),
      );
      showToast("Coupon status updated successfully", "success");
    } catch (error) {
      console.error("Error toggling coupon:", error);
      showToast("Failed to toggle coupon status", "error");
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingCoupon;
    const url = isEdit ? UPDATE_COUPON_API : CREATE_COUPON_API;

    const payload = {
      vendor_id: Number(vendorId),
      coupon_type: couponFormData.coupon_type,
      discount_type: couponFormData.discount_type,
      discount_value: Number(couponFormData.discount_value),
      min_order_amount: Number(couponFormData.min_order_amount),
      per_user_limit: Number(couponFormData.per_user_limit),
      vendor_id: Number(vendor?.id || vendorId),
    };

    if (couponFormData.coupon_type === "code") {
      payload.coupon_code = couponFormData.coupon_code;
      payload.start_date = couponFormData.start_date
        ? `${couponFormData.start_date} 00:00:00`
        : null;
      payload.end_date = couponFormData.end_date
        ? `${couponFormData.end_date} 23:59:59`
        : null;
    } else {
      payload.coupon_code = null;
      payload.start_date = null;
      payload.end_date = null;
    }

    if (isEdit) {
      payload.coupon_id = editingCoupon.id;
    }

    console.log("Submitting coupon payload:", payload);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        showToast(
          isEdit
            ? "Coupon updated successfully!"
            : "Coupon created successfully!",
          "success",
        );
        setIsCouponModalOpen(false);
        fetchCoupons();
      } else {
        showToast(response.data.message || "Failed to save coupon", "error");
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      showToast("Something went wrong saving the coupon", "error");
    }
  };

  const openCouponModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponFormData({
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
      setCouponFormData({
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
    setIsCouponModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!vendor) return;

    setSaving(true);
    try {
      const formData = new FormData();

      const targetVendorId = editData.id || vendor.id || vendor.vendor_id;
      if (targetVendorId) {
        formData.append("id", targetVendorId);
      }

      formData.append(
        "business_name",
        editData.business_name || vendor.business_name || "",
      );
      formData.append(
        "owner_name",
        editData.name || editData.owner_name || vendor.owner_name || "",
      );
      formData.append(
        "brand_name",
        editData.brand_name || vendor.brand_name || "",
      );
      formData.append("email", editData.email || vendor.email || "");
      formData.append("phone", editData.phone || vendor.phone || "");
      formData.append("status", editData.status || vendor.status || "");
      formData.append(
        "gst_number",
        editData.gst_number || vendor.gst_number || "",
      );
      formData.append(
        "pan_number",
        editData.pan_number || vendor.pan_number || "",
      );
      formData.append("address", editData.address || vendor.address || "");
      formData.append("city", editData.city || vendor.city || "");
      formData.append("state", editData.state || vendor.state || "");
      formData.append("country", editData.country || vendor.country || "");
      formData.append("pincode", editData.pincode || vendor.pincode || "");
      formData.append(
        "due_days",
        editData.settlement_date || editData.due_days || vendor.due_days || "",
      );
      formData.append(
        "minimum_order_value",
        editData.wallet_value ||
        editData.minimum_card_value ||
        vendor.wallet_value ||
        "",
      );

      // File Input Checks
      if (editData.brand_image instanceof File) {
        formData.append("brand_image", editData.brand_image);
      }
      if (editData.gst_image instanceof File) {
        formData.append("gst_image", editData.gst_image);
      }
      if (editData.tmc_image instanceof File) {
        formData.append("tmc_image", editData.tmc_image);
      }

      const response = await axios.post(
        `${VENDOR_UPDATE_API}?id=${targetVendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;

      if (result.success) {
        const updatedBrandImg = result.brand_image
          ? (result.brand_image.startsWith("http")
              ? result.brand_image
              : `https://namami-infotech.com/Stepkaro/${result.brand_image.replace(/^\/+/, "")}`)
          : editData.brand_image_preview || current?.brand_image;

        setVendor((current) =>
          current
            ? {
                ...current,
                ...editData,
                owner_name:
                  editData.name || editData.owner_name || current.owner_name,
                business_name: editData.business_name || current.business_name,
                brand_name: editData.brand_name || current.brand_name,
                brand_image: updatedBrandImg || current.brand_image,
                email: editData.email || current.email,
                phone: editData.phone || current.phone,
                status: editData.status || current.status,
                gst_image: result.gst_image || current.gst_image,
                tmc_image: result.tmc_image || current.tmc_image,
              }
            : current,
        );

        showToast(
          result.message || "Vendor profile updated successfully.",
          "success",
        );
      } else {
        showToast(result.message || "Failed to update profile.", "error");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);

      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong while connecting to the server.";
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredCoupons = useMemo(() => {
    if (!coupons || coupons.length === 0) return [];

    return coupons.filter((coupon) => {
      const matchesSearch =
        (coupon.coupon_code?.toLowerCase() || "").includes(
          couponSearchQuery.toLowerCase(),
        ) ||
        (coupon.coupon_type || "")
          .toLowerCase()
          .includes(couponSearchQuery.toLowerCase());

      const matchesType =
        couponTypeFilter === "all" || coupon.coupon_type === couponTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [coupons, couponSearchQuery, couponTypeFilter]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Minimum Card Value",
        value: formatCurrency(vendor?.wallet_value),
        icon: Wallet,
        tone: "from-violet-500 to-fuchsia-500",
      },
      {
        label: "TotalOrders",
        value: vendor?.no_of_order_recived,
        icon: ClipboardList,
        tone: "from-sky-500 to-cyan-500",
      },
      {
        label: "Coupons",
        value: coupons.length,
        icon: Tag,
        tone: "from-emerald-500 to-teal-500",
      },
    ],
    [coupons.length, vendor?.no_of_order_recived, vendor?.wallet_value],
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "edit", label: "Edit", icon: User },
    { id: "coupons", label: "Coupons", icon: Tag },
    {
      id: "Restricted Districts",
      label: "Restricted Districts",
      icon: MapPinned,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-violet-600" />
          <p className="text-sm text-slate-600">Loading vendor profile…</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-600">Vendor not found.</p>
          <Link
            href="/admin/vendors"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-0">
      <div className="mx-auto max-w-7xl space-y-5">
        {toast && (
          <div
            className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${toast.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-emerald-600 text-white"
              }`}
          >
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Link
                href="/admin/vendors"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 mt-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-4">
                {vendor.brand_image ? (
                  <img
                    src={vendor.brand_image}
                    alt={vendor.brand_name || "Brand"}
                    className="h-16 w-16 rounded-2xl border border-slate-200 object-contain shadow-sm bg-white p-1"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-violet-50 text-2xl">
                    🏪
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                      {vendor.brand_name || "Brand"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(vendor.status)}`}
                    >
                      {String(vendor.status || "pending").toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                      {vendor.business_name || vendor.name || "Vendor"}
                    </h1>
                    <p className="text-sm text-slate-500 flex flex-wrap gap-2">
                      <span>{vendor.name}</span>
                      <span>•</span>
                      <span>{vendor.phone}</span>
                      <span>•</span>
                      <span>ID: #{vendor.id}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                <span>Business verification ready</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Keep KYC, wallet, and order notes updated from here.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-r ${card.tone} p-2 text-white`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm text-slate-500">{card.label}</p>
                <p className="text-xl font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${active
                    ? "bg-violet-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-violet-700">
                    Brand Name
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {vendor.brand_name || "—"}
                  </h2>
                </div>
                {vendor.brand_image && (
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                    <img
                      src={vendor.brand_image}
                      alt={vendor.brand_name || "Brand"}
                      className="h-full w-full object-contain rounded-xl"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Business Name
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      {vendor.business_name || "—"}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Contact
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-violet-600" />{" "}
                      {vendor.email || "—"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-violet-600" />{" "}
                      {vendor.phone || "—"}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Address
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-violet-600" />
                      <span>{vendor.address || "Address not added"}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {vendor.city} {vendor.state} {vendor.pincode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Compliance & restrictions
                </h2>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <span>Settlement Date</span>
                  <span className="font-medium text-slate-900">
                    {vendor.settlement_date || "—"} DAYS
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <span>GST</span>
                  <span className="font-medium text-slate-900">
                    {vendor.gst_number || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <span>PAN</span>
                  <span className="font-medium text-slate-900">
                    {vendor.pan_number || "—"}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-violet-600" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Bank details
                  </h3>
                </div>

                {bankLoading ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                    Loading bank details...
                  </div>
                ) : bankDetails ? (
                  <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Account holder</span>
                      <span className="font-medium text-slate-900">
                        {bankDetails.acc_holder_name ||
                          bankDetails.account_holder_name ||
                          "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Account number</span>
                      <span className="font-medium text-slate-900">
                        {bankDetails.account_number || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">IFSC</span>
                      <span className="font-medium text-slate-900">
                        {bankDetails.ifsc || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Bank name</span>
                      <span className="font-medium text-slate-900">
                        {bankDetails.bank_name || "—"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No bank details found for this vendor.
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Documents & Brand Media
                  </h2>
                  <p className="text-sm text-slate-500">
                    Uploaded vendor documents and brand logo
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Brand Image */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="font-medium text-slate-900">Brand Logo / Image</h3>
                  </div>

                  {vendor.brand_image ? (
                    <>
                      <img
                        src={vendor.brand_image}
                        className="h-52 w-full object-contain bg-white p-3"
                        alt={vendor.brand_name || "Brand Logo"}
                      />

                      <div className="p-4 border-t border-slate-100">
                        <a
                          href={vendor.brand_image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center rounded-xl bg-violet-600 py-2.5 text-white font-medium hover:bg-violet-700 transition text-sm"
                        >
                          View Brand Image
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-52 items-center justify-center text-slate-400">
                      No Brand Image uploaded
                    </div>
                  )}
                </div>

                {/* GST */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="font-medium text-slate-900">GST Certificate</h3>
                  </div>

                  {vendor.gst_image ? (
                    <>
                      <img
                        src={`https://namami-infotech.com/Stepkaro/${vendor.gst_image}`}
                        className="h-52 w-full object-contain bg-white p-3"
                        alt="GST Certificate"
                      />

                      <div className="p-4 border-t border-slate-100">
                        <a
                          href={`https://namami-infotech.com/Stepkaro/${vendor.gst_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center rounded-xl bg-violet-600 py-2.5 text-white font-medium hover:bg-violet-700 transition text-sm"
                        >
                          View GST Certificate
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-52 items-center justify-center text-slate-400">
                      No GST uploaded
                    </div>
                  )}
                </div>

                {/* TMC */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="font-medium text-slate-900">TMC Document</h3>
                  </div>

                  {vendor.tmc_image ? (
                    <>
                      <img
                        src={`https://namami-infotech.com/Stepkaro/${vendor.tmc_image}`}
                        className="h-52 w-full object-contain bg-white p-3"
                        alt="TMC Document"
                      />

                      <div className="p-4 border-t border-slate-100">
                        <a
                          href={`https://namami-infotech.com/Stepkaro/${vendor.tmc_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center rounded-xl bg-violet-600 py-2.5 text-white font-medium hover:bg-violet-700 transition text-sm"
                        >
                          View TMC Document
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-52 items-center justify-center text-slate-400">
                      No TMC uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "edit" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Edit vendor profile
              </h2>
            </div>
            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={handleEditSubmit}
            >
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Owner name</span>
                <input
                  value={editData.name || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">
                  Business name
                </span>
                <input
                  value={editData.business_name || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      business_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">
                  Brand name
                </span>
                <input
                  value={editData.brand_name || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      brand_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                  placeholder="Enter brand name"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Status</span>
                <select
                  value={editData.status || "pending"}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">GST number</span>
                <input
                  value={editData.gst_number || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      gst_number: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">PAN number</span>
                <input
                  value={editData.pan_number || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      pan_number: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">
                  Settlement Days
                </span>
                <input
                  value={editData.settlement_date || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      settlement_date: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">
                  MINIMUM CARD VALUE
                </span>
                <input
                  value={editData.minimum_card_value || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      minimum_card_value: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
                <span className="font-medium text-slate-700">Address</span>
                <textarea
                  rows={3}
                  value={editData.address || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>

              {/* Uploads Section */}
              <div className="grid gap-5 md:grid-cols-3 md:col-span-2 border-t border-slate-200 pt-4 mt-2">
                {/* Brand Image Upload */}
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">
                    Brand Logo / Image
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditData((prev) => ({
                          ...prev,
                          brand_image: file,
                          brand_image_preview: URL.createObjectURL(file),
                        }));
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-white hover:file:bg-violet-700 text-xs"
                  />

                  {editData.brand_image_preview ? (
                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={editData.brand_image_preview}
                        alt="Preview"
                        className="h-10 w-10 rounded-lg border object-contain bg-white p-1"
                      />
                      <span className="text-xs text-emerald-600 font-medium">New image selected</span>
                    </div>
                  ) : vendor.brand_image ? (
                    <a
                      href={vendor.brand_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-600 hover:underline block pt-1"
                    >
                      View Current Brand Image
                    </a>
                  ) : null}
                </label>

                {/* GST Image */}
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">
                    GST Certificate
                  </span>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        gst_image: e.target.files?.[0],
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-white hover:file:bg-violet-700 text-xs"
                  />

                  {vendor.gst_image && (
                    <a
                      href={`https://namami-infotech.com/Stepkaro/${vendor.gst_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-600 hover:underline block pt-1"
                    >
                      View Current GST
                    </a>
                  )}
                </label>

                {/* TMC Image */}
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">
                    TMC Document
                  </span>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        tmc_image: e.target.files?.[0],
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-white hover:file:bg-violet-700 text-xs"
                  />

                  {vendor.tmc_image && (
                    <a
                      href={`https://namami-infotech.com/Stepkaro/${vendor.tmc_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-600 hover:underline block pt-1"
                    >
                      View Current TMC
                    </a>
                  )}
                </label>
              </div>

              <div className="md:col-span-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {saving ? "Saving changes" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Vendor Coupons
                </h2>
                <p className="text-sm text-slate-500">
                  Manage promotional coupons and discounts for this vendor
                </p>
              </div>

              <button
                type="button"
                onClick={() => openCouponModal()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                Create Coupon
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={couponSearchQuery}
                  onChange={(e) => setCouponSearchQuery(e.target.value)}
                  placeholder="Search coupons by code or type..."
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={couponTypeFilter}
                  onChange={(e) => setCouponTypeFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500"
                >
                  <option value="all">All Types</option>
                  <option value="code">Coupon Code</option>
                  <option value="auto">Auto Apply</option>
                </select>

                <button
                  type="button"
                  onClick={fetchCoupons}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  title="Refresh Coupons"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${couponLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Coupons Table */}
            {couponLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <Tag className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  No coupons found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {couponSearchQuery || couponTypeFilter !== "all"
                    ? "Try adjusting your search or filter options"
                    : "Get started by creating a new coupon for this vendor"}
                </p>
                <button
                  type="button"
                  onClick={() => openCouponModal()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                  <Plus className="h-4 w-4" />
                  Create First Coupon
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Code / Name</th>
                        <th className="px-6 py-4 font-semibold">Discount</th>
                        <th className="px-6 py-4 font-semibold">
                          Min. Order / Limit
                        </th>
                        <th className="px-6 py-4 font-semibold">Validity</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCoupons.map((coupon) => (
                        <tr
                          key={coupon.id}
                          className="hover:bg-slate-50/50 transition"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${coupon.coupon_type === "code"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                                }`}
                            >
                              {coupon.coupon_type === "code"
                                ? "Coupon Code"
                                : "Auto Apply"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {coupon.coupon_code || "AUTO_DISCOUNT"}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {coupon.discount_type === "percentage"
                              ? `${coupon.discount_value}% OFF`
                              : formatCurrency(coupon.discount_value)}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-slate-900 font-medium">
                                Min: {formatCurrency(coupon.min_order_amount)}
                              </p>
                              <p className="text-xs text-slate-500">
                                Limit: {coupon.per_user_limit} per user
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {coupon.coupon_type === "code" ? (
                              <div>
                                <p>
                                  Start: {coupon.start_date?.split(" ")[0] || "-"}
                                </p>
                                <p>
                                  End: {coupon.end_date?.split(" ")[0] || "-"}
                                </p>
                              </div>
                            ) : (
                              <span>Always Active</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCouponStatus(coupon.id)}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${coupon.status === 1
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                              {coupon.status === 1 ? (
                                <>
                                  <ToggleRight className="h-4 w-4 text-emerald-600" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4 text-slate-400" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openCouponModal(coupon)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-violet-600 transition"
                              title="Edit Coupon"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coupon Modal */}
            {isCouponModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCouponModalOpen(false)}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCouponSubmit} className="space-y-4">
                    {/* Coupon Type */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                        Coupon Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              coupon_type: "code",
                            }))
                          }
                          className={`rounded-xl border p-3 text-center text-sm font-medium transition ${couponFormData.coupon_type === "code"
                            ? "border-violet-600 bg-violet-50 text-violet-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          Coupon Code
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              coupon_type: "auto",
                            }))
                          }
                          className={`rounded-xl border p-3 text-center text-sm font-medium transition ${couponFormData.coupon_type === "auto"
                            ? "border-violet-600 bg-violet-50 text-violet-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          Auto Apply
                        </button>
                      </div>
                    </div>

                    {/* Coupon Code (Only for 'code' type) */}
                    {couponFormData.coupon_type === "code" && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Coupon Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={couponFormData.coupon_code}
                          onChange={(e) =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              coupon_code: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder="e.g. SUMMER50"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500 font-mono"
                        />
                      </div>
                    )}

                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Discount Type
                        </label>
                        <select
                          value={couponFormData.discount_type}
                          onChange={(e) =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              discount_type: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500"
                        >
                          <option value="fixed">Fixed Amount (₹)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Discount Value *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={couponFormData.discount_value}
                          onChange={(e) =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              discount_value: e.target.value,
                            }))
                          }
                          placeholder={
                            couponFormData.discount_type === "fixed"
                              ? "₹100"
                              : "10%"
                          }
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    {/* Min Order & Per User Limit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Min. Order Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={couponFormData.min_order_amount}
                          onChange={(e) =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              min_order_amount: e.target.value,
                            }))
                          }
                          placeholder="0 for no minimum"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Per User Limit
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={couponFormData.per_user_limit}
                          onChange={(e) =>
                            setCouponFormData((prev) => ({
                              ...prev,
                              per_user_limit: e.target.value,
                            }))
                          }
                          placeholder="0 for unlimited"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    {/* Dates (Only for 'code' type) */}
                    {couponFormData.coupon_type === "code" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={couponFormData.start_date}
                            onChange={(e) =>
                              setCouponFormData((prev) => ({
                                ...prev,
                                start_date: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={couponFormData.end_date}
                            onChange={(e) =>
                              setCouponFormData((prev) => ({
                                ...prev,
                                end_date: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsCouponModalOpen(false)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 shadow-sm"
                      >
                        {editingCoupon ? "Update Coupon" : "Save Coupon"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Restricted Districts" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <RestrictedDistrictsManager
              vendorId={vendorId}
              vendorName={vendor.brand_name || vendor.business_name}
            />
          </div>
        )}
      </div>
    </div>
  );
}
