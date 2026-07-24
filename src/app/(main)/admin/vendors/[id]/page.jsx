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

  // Fetch Wallet & Order History
  // useEffect(() => {
  //   if (!vendor?.id) return;

  //   const fetchWalletHistory = async () => {
  //     setWalletLoading(true);
  //     try {
  //       const res = await fetch(`${WALLET_API}?user_id=${vendor.id}`);
  //       const data = await res.json();
  //       const history = Array.isArray(data?.data)
  //         ? data.data
  //         : Array.isArray(data)
  //           ? data
  //           : [];
  //       setWalletHistory(history.map(normalizeWalletItem));
  //     } catch (error) {
  //       console.error(error);
  //       setWalletHistory([]);
  //     } finally {
  //       setWalletLoading(false);
  //     }
  //   };

  //   const fetchOrderHistory = async () => {
  //     setOrderLoading(true);
  //     try {
  //       const res = await fetch(ORDER_API);
  //       const data = await res.json();
  //       const orders = Array.isArray(data?.data)
  //         ? data.data
  //         : Array.isArray(data)
  //           ? data
  //           : [];
  //       const filtered = orders.filter((order) =>
  //         [
  //           order.buyer_id,
  //           order.seller_id,
  //           order.user_id,
  //           order.vendor_id,
  //           order.customer_id,
  //         ]
  //           .map((value) => String(value || ""))
  //           .includes(String(vendor.id)),
  //       );
  //       setOrderHistory(filtered);
  //     } catch (error) {
  //       console.error(error);
  //       setOrderHistory([]);
  //     } finally {
  //       setOrderLoading(false);
  //     }
  //   };

  //   fetchWalletHistory();
  //   fetchOrderHistory();
  // }, [vendor]);

  // FIX: Separate fetchCoupons function that sets coupons state
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

        // Filter coupons for this vendor
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

        // Set coupons with filtered or all data
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

  // Fetch coupons when vendor is loaded
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

  // Coupon CRUD Operations
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

      // Optimistically update UI
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
        fetchCoupons(); // Refresh coupons
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
      // 1. Form-Data Object banana padega kyuki API images aur text dono leti hai
      const formData = new FormData();

      // 2. Target Vendor ID extract karna
      const targetVendorId = editData.id || vendor.id || vendor.vendor_id;
      if (targetVendorId) {
        formData.append("id", targetVendorId);
      }

      // 3. Saare text fields ko append karne ka logic
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

      // 4. File Input Checks
      if (editData.gst_image instanceof File) {
        formData.append("gst_image", editData.gst_image);
      }
      if (editData.tmc_image instanceof File) {
        formData.append("tmc_image", editData.tmc_image);
      }

      // 🔥 Console Par Form-Data Detail Mein Check Karna
      // console.log("--- Sending Vendor Update Data via Axios ---");
      // for (let [key, value] of formData.entries()) {
      //   if (value instanceof File) {
      //     console.log(
      //       `${key}: File -> Name: ${value.name}, Size: ${(value.size / 1024 / 1024).toFixed(2)} MB`,
      //     );
      //   } else {
      //     console.log(`${key}: ${value}`);
      //   }
      // }
      // console.log("----------------------------------");

      // 5. Axios Request with Token & URL Parameter
      const response = await axios.post(
        `${VENDOR_UPDATE_API}?id=${targetVendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Axios mein response ka data direct 'response.data' mein milta hai
      const result = response.data;

      if (result.success) {
        // 6. API response aane par local UI state ko refresh karna
        setVendor((current) =>
          current
            ? {
              ...current,
              ...editData,
              owner_name:
                editData.name || editData.owner_name || current.owner_name,
              business_name: editData.business_name || current.business_name,
              brand_name: editData.brand_name || current.brand_name,
              email: editData.email || current.email,
              phone: editData.phone || current.phone,
              status: editData.status || current.status,
              gst_image: result.gst_image,
              tmc_image: result.tmc_image,
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

      // Axios error handling (agar server se 400/500 code aaye toh message extract karna)
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong while connecting to the server.";
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  // Filtered Coupons
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

  // Fix summary cards - use coupons.length instead of couponHistory
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
        // value: orderHistory.length,
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
    [coupons.length, orderHistory.length, vendor?.wallet_value],
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "edit", label: "Edit", icon: User },
    // { id: "orders", label: "Orders", icon: ClipboardList },
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
        {/* Toast Notification */}
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
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
                    {/* Business overview */}
                    Brand Name
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {/* {vendor.business_name || vendor.name} */}
                    {vendor.brand_name}
                  </h2>
                </div>
                {/* <div className="rounded-2xl bg-slate-100 p-3 text-2xl">
                  {vendor.avatar}
                </div> */}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Business Name
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      {/* < className="h-4 w-4 text-violet-600" />{" "} */}
                      {vendor.business_name || "—"}
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-violet-600" />{" "}
                      {vendor. || "—"}
                    </div> */}
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
                <div className="rounded-2xl bg-slate-50 p-4">
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
                {/* <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    city and state
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-violet-600" />
                      <span>
                        {vendor.city} {vendor.state} {vendor.pincode}
                      </span>
                    </div>
                  </div>
                </div> */}
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
                    Documents
                  </h2>
                  <p className="text-sm text-slate-500">
                    Uploaded vendor documents
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* GST */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="font-medium">GST Certificate</h3>
                  </div>

                  {vendor.gst_image ? (
                    <>
                      <img
                        src={`https://namami-infotech.com/Stepkaro/${vendor.gst_image}`}
                        className="h-52 w-full object-contain bg-white p-3"
                        alt=""
                      />

                      <div className="p-4">
                        <a
                          href={`https://namami-infotech.com/Stepkaro/${vendor.gst_image}`}
                          target="_blank"
                          className="flex justify-center rounded-xl bg-violet-600 py-2.5 text-white font-medium hover:bg-violet-700"
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
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="font-medium">TMC Document</h3>
                  </div>

                  {vendor.tmc_image ? (
                    <>
                      <img
                        src={`https://namami-infotech.com/Stepkaro/${vendor.tmc_image}`}
                        className="h-52 w-full object-contain bg-white p-3"
                        alt=""
                      />

                      <div className="p-4">
                        <a
                          href={`https://namami-infotech.com/Stepkaro/${vendor.tmc_image}`}
                          target="_blank"
                          className="flex justify-center rounded-xl bg-violet-600 py-2.5 text-white font-medium hover:bg-violet-700"
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
              {/* <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Phone</span>
                <input
                  value={editData.phone || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label> */}
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
                  {/* <option value="pending">Pending</option> */}
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  {/* <option value="reject">Rejected</option> */}
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
              {/* <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">CITY</span>
                <input
                  value={editData.city || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">STATE</span>
                <input
                  value={editData.state || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      state: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label> */}
              {/* <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">COUNTRY</span>
                <input
                  value={editData.country || ""}
                  onChange={(event) =>
                    setEditData((current) => ({
                      ...current,
                      country: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-violet-500"
                />
              </label> */}
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">
                  Settelement Days
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
              <div className="grid gap-5 md:grid-cols-2">
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
                        gst_image: e.target.files[0],
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-white hover:file:bg-violet-700"
                  />

                  {vendor.gst_image && (
                    <a
                      href={`https://namami-infotech.com/Stepkaro/${vendor.gst_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 hover:underline"
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
                        tmc_image: e.target.files[0],
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-white hover:file:bg-violet-700"
                  />

                  {vendor.tmc_image && (
                    <a
                      href={`https://namami-infotech.com/Stepkaro/${vendor.tmc_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-600 hover:underline"
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

        {activeTab === "orders" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Recent orders
              </h2>
            </div>
            {orderLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading orders…
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No orders found for this vendor yet.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {orderHistory.map((order, index) => (
                  <div
                    key={order.id || index}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          Order #{order.id || "—"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.order_date || order.created_at || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {order.status || "Pending"}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrency(
                            order.total_amount || order.amount || 0,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "coupons" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Vendor Coupons
                </h2>
                <span className="text-sm text-slate-500">
                  ({coupons.length} total)
                </span>
              </div>
              <button
                onClick={() => openCouponModal(null)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition"
              >
                <Plus className="h-4 w-4" />
                Create Coupon
              </button>
            </div>

            {/* Coupon Search & Filter */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={couponSearchQuery}
                  onChange={(e) => setCouponSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <select
                value={couponTypeFilter}
                onChange={(e) => setCouponTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <option value="all">All Types</option>
                <option value="code">Coupon Code</option>
                <option value="order_value">Order Value Threshold</option>
              </select>
              <button
                onClick={fetchCoupons}
                className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                <RefreshCw
                  className={`h-5 w-5 ${couponLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {/* Coupons Grid */}
            {couponLoading && coupons.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-200">
                <Loader2 className="h-8 w-8 text-violet-600 animate-spin mb-2" />
                <p className="text-sm text-slate-500">Loading coupons...</p>
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <Tag className="h-12 w-12 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">No coupons found</p>
                <p className="text-sm text-slate-400 mt-1">
                  {coupons.length === 0
                    ? "No coupons available for this vendor"
                    : "Try adjusting your search filters"}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col justify-between ${coupon.status === 0
                      ? "border-slate-200 opacity-75"
                      : "border-violet-100"
                      }`}
                  >
                    {/* Decorative Side Tag Ribbon */}
                    <div
                      className={`absolute top-0 left-0 w-1.5 h-full ${coupon.coupon_type === "code"
                        ? "bg-violet-500"
                        : "bg-amber-500"
                        }`}
                    />

                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${coupon.coupon_type === "code"
                              ? "bg-violet-50 text-violet-700"
                              : "bg-amber-50 text-amber-700"
                              }`}
                          >
                            {coupon.coupon_type === "code" ? (
                              <Tag className="h-3 w-3" />
                            ) : (
                              <Percent className="h-3 w-3" />
                            )}
                            {coupon.coupon_type === "code"
                              ? "Promo Code"
                              : "Auto Order Discount"}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-2">
                            {coupon.coupon_type === "code" ? (
                              <code className="bg-slate-100 px-2 py-0.5 rounded text-violet-600 font-mono tracking-wider">
                                {coupon.coupon_code}
                              </code>
                            ) : (
                              "Cart Bulk Discount"
                            )}
                          </h3>
                        </div>

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleToggleCouponStatus(coupon.id)}
                          className={`text-2xl transition focus:outline-none ${coupon.status === 1
                            ? "text-emerald-500"
                            : "text-slate-300"
                            }`}
                          title={
                            coupon.status === 1 ? "Deactivate" : "Activate"
                          }
                        >
                          {coupon.status === 1 ? (
                            <ToggleRight className="h-9 w-9" />
                          ) : (
                            <ToggleLeft className="h-9 w-9" />
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
                          <Calendar className="h-3.5 w-3.5" />
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
                          {coupon.used_count || 0}
                        </span>{" "}
                        times
                      </div>
                      <button
                        onClick={() => openCouponModal(coupon)}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 text-violet-600 hover:bg-violet-50 border border-violet-100 rounded-lg transition"
                      >
                        <Pencil className="h-3 w-3" /> Edit Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Restricted Districts" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <RestrictedDistrictsManager
              vendorId={vendor?.user_id}
              vendorName={vendor?.business_name || vendor?.name}
              onUpdate={(updatedDistricts) => {
                // Optional callback when districts are updated
                console.log("Updated restricted districts:", updatedDistricts);
              }}
            />
          </div>
        )}
      </div>

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingCoupon
                    ? "Edit Coupon Parameters"
                    : "Create New Campaign"}
                </h2>
                <p className="text-xs text-slate-400">
                  Configure parameters for this vendor
                </p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleCouponSubmit}
              className="p-6 space-y-4 flex-1"
            >
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
                      setCouponFormData({
                        ...couponFormData,
                        coupon_type: "code",
                      })
                    }
                    className={`py-2 text-sm font-medium rounded-lg transition ${couponFormData.coupon_type === "code"
                      ? "bg-white text-violet-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 disabled:opacity-50"
                      }`}
                  >
                    Promo Code Entry
                  </button>
                  <button
                    type="button"
                    disabled={!!editingCoupon}
                    onClick={() =>
                      setCouponFormData({
                        ...couponFormData,
                        coupon_type: "order_value",
                      })
                    }
                    className={`py-2 text-sm font-medium rounded-lg transition ${couponFormData.coupon_type === "order_value"
                      ? "bg-white text-amber-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 disabled:opacity-50"
                      }`}
                  >
                    Order Value Automatic
                  </button>
                </div>
              </div>

              {/* Conditional Promo Code Row */}
              {couponFormData.coupon_type === "code" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Coupon Text Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE50, MONSOON20"
                    value={couponFormData.coupon_code}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        coupon_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
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
                    value={couponFormData.discount_type}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        discount_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
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
                      couponFormData.discount_type === "percentage"
                        ? "10"
                        : "500"
                    }
                    value={couponFormData.discount_value}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        discount_value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
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
                    value={couponFormData.min_order_amount}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        min_order_amount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                {/* <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Per User Cap Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1 (0 for unlimited)"
                    value={couponFormData.per_user_limit}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        per_user_limit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div> */}
                {couponFormData.coupon_type === "code" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Per User Cap Limit
                    </label>
                    <input
                      type="number"
                      value={1} // Piche se kuch bhi aaye, hamesha 1 dikhega
                      readOnly // Isse user isko edit nahi kar payega
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-500 cursor-not-allowed"
                    // bg-slate-50 aur cursor-not-allowed se ye visually bhi disabled/readonly lagega
                    />
                  </div>
                )}
              </div>

              {/* Timeline Bounds Row (Only if Promo Code Type) */}
              {couponFormData.coupon_type === "code" && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Start Active Period
                    </label>
                    <input
                      type="date"
                      required
                      value={couponFormData.start_date}
                      onChange={(e) =>
                        setCouponFormData({
                          ...couponFormData,
                          start_date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      End Expiry Period
                    </label>
                    <input
                      type="date"
                      required
                      value={couponFormData.end_date}
                      onChange={(e) =>
                        setCouponFormData({
                          ...couponFormData,
                          end_date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>
              )}

              {/* Form Action Controls Footer */}
              <div className="border-t border-slate-100 pt-5 mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition"
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
