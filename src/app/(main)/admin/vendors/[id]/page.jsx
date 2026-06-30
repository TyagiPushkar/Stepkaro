"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  ScrollText,
  ShieldCheck,
  Store,
  Tag,
  Truck,
  User,
  Wallet,
} from "lucide-react";

const VENDOR_API =
  "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php?type=seller";
const WALLET_API =
  "https://namami-infotech.com/Stepkaro/src/admin/get_wallet_history.php";
const ORDER_API =
  "https://namami-infotech.com/Stepkaro/src/order/admin_get_orders.php";
const COUPON_API =
  "https://namami-infotech.com/Stepkaro/src/coupens/get_vendor_coupen.php";

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
  name: item.owner_name || item.name || "",
  email: item.email || "",
  phone: item.phone || "",
  status: item.status || "pending",
  wallet_value: item.minimum_order_value || 0,
  business_name: item.business_name || item.brand_name || "",
  brand_name: item.brand_name || "",
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
  const [walletHistory, setWalletHistory] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [couponHistory, setCouponHistory] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    if (!vendorId) return;

    const fetchVendor = async () => {
      setLoading(true);
      try {
        const response = await fetch(VENDOR_API);
        const data = await response.json();
        const vendors = Array.isArray(data?.data?.vendors)
          ? data.data.vendors
          : [];
        const foundVendor = vendors.find(
          (item) => String(item.id) === String(vendorId),
        );

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
          status: normalizedVendor.status || "pending",
          business_name: normalizedVendor.business_name || "",
          brand_name: normalizedVendor.brand_name || "",
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
    if (!vendor?.id) return;

    const fetchWalletHistory = async () => {
      setWalletLoading(true);
      try {
        const res = await fetch(`${WALLET_API}?user_id=${vendor.id}`);
        const data = await res.json();
        const history = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        setWalletHistory(history.map(normalizeWalletItem));
      } catch (error) {
        console.error(error);
        setWalletHistory([]);
      } finally {
        setWalletLoading(false);
      }
    };

    const fetchOrderHistory = async () => {
      setOrderLoading(true);
      try {
        const res = await fetch(ORDER_API);
        const data = await res.json();
        const orders = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        const filtered = orders.filter((order) =>
          [
            order.buyer_id,
            order.seller_id,
            order.user_id,
            order.vendor_id,
            order.customer_id,
          ]
            .map((value) => String(value || ""))
            .includes(String(vendor.id)),
        );
        setOrderHistory(filtered);
      } catch (error) {
        console.error(error);
        setOrderHistory([]);
      } finally {
        setOrderLoading(false);
      }
    };

    const fetchCoupons = async () => {
      setCouponLoading(true);
      try {
        const res = await fetch(COUPON_API);
        const data = await res.json();
        const coupons = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        const filtered = coupons.filter((coupon) => {
          const ids = [
            coupon.vendor_id,
            coupon.seller_id,
            coupon.user_id,
            coupon.vendorId,
            coupon.sellerId,
          ];
          return ids
            .map((value) => String(value || ""))
            .includes(String(vendor.id));
        });
        setCouponHistory(filtered.length ? filtered : coupons.slice(0, 6));
      } catch (error) {
        console.error(error);
        setCouponHistory([]);
      } finally {
        setCouponLoading(false);
      }
    };

    fetchWalletHistory();
    fetchOrderHistory();
    fetchCoupons();
  }, [vendor]);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!vendor) return;

    setSaving(true);
    try {
      setVendor((current) =>
        current
          ? {
              ...current,
              ...editData,
              name: editData.name || current.name,
              business_name: editData.business_name || current.business_name,
              brand_name: editData.brand_name || current.brand_name,
              email: editData.email || current.email,
              phone: editData.phone || current.phone,
              status: editData.status || current.status,
            }
          : current,
      );
      showToast("Vendor profile updated for this session.", "success");
    } finally {
      setSaving(false);
    }
  };

  const summaryCards = useMemo(
    () => [
      {
        label: "Minimum Card Value",
        value: formatCurrency(vendor?.wallet_value),
        icon: Wallet,
        tone: "from-violet-500 to-fuchsia-500",
      },
      {
        label: "Orders",
        value: orderHistory.length,
        icon: ClipboardList,
        tone: "from-sky-500 to-cyan-500",
      },
      {
        label: "Coupons",
        value: couponHistory.length,
        icon: Tag,
        tone: "from-emerald-500 to-teal-500",
      },
    ],
    [couponHistory.length, orderHistory.length, vendor?.wallet_value],
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "edit", label: "Edit", icon: User },
    { id: "wallets", label: "Wallet History", icon: Wallet },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "more", label: "More", icon: ShieldCheck },
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
                    Vendor profile
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
                  <p className="text-sm text-slate-500">
                    {vendor.name} · #{vendor.id}
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
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
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
                    Business overview
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {vendor.business_name || vendor.name}
                  </h2>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-2xl">
                  {vendor.avatar}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                      {vendor.city}, {vendor.state} · {vendor.pincode}
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
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <span>Logistics partner</span>
                  <span className="font-medium text-slate-900">
                    {vendor.logistic_partner_name || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <span>Delivery location</span>
                  <span className="font-medium text-slate-900">
                    {vendor.delivery_location || "—"}
                  </span>
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
              <label className="space-y-2 text-sm text-slate-600">
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
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="reject">Rejected</option>
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

        {activeTab === "wallets" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Wallet history
              </h2>
            </div>
            {walletLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading wallet activity…
              </div>
            ) : walletHistory.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No wallet activity recorded yet.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {walletHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.note}</p>
                      <p className="text-sm text-slate-500">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${item.type === "debit" ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {item.type === "debit" ? "-" : "+"}
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Before {formatCurrency(item.wallet_before)} · After{" "}
                        {formatCurrency(item.wallet_after)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Vendor coupons
              </h2>
            </div>
            {couponLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading coupons…
              </div>
            ) : couponHistory.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No coupons linked to this vendor yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {couponHistory.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">
                        {coupon.coupon_code || coupon.code || "Coupon"}
                      </p>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {coupon.status === 1 || coupon.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {coupon.discount_type || "fixed"} ·{" "}
                      {coupon.discount_value || 0}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {coupon.start_date || coupon.valid_from || "—"} →{" "}
                      {coupon.end_date || coupon.valid_to || "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "more" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Documents & notes
                </h2>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Document number</p>
                  <p className="mt-1">{vendor.document_number || "—"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">
                    Verification note
                  </p>
                  <p className="mt-1">
                    Keep this vendor under review if business documents or bank
                    details are pending.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Operational controls
                </h2>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4 text-amber-600" />{" "}
                    Restrictions
                  </span>
                  <span className="font-medium text-slate-900">
                    KYC pending
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-violet-600" /> Wallet
                    cap
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(vendor.wallet_value)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-sky-600" /> Dispatch mode
                  </span>
                  <span className="font-medium text-slate-900">
                    Self dispatch
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-emerald-600" /> Product
                    policy
                  </span>
                  <span className="font-medium text-slate-900">Standard</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${toast.type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
