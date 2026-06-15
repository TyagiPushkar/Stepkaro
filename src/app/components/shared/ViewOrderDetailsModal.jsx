"use client";

import { useEffect, useState } from "react";
import {
  X,
  Package,
  User,
  Building2,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  BadgePercent,
  Wallet,
  Truck,
  Hash,
  Tag,
  Palette,
  Layers,
  Loader2,
  ShoppingBag,
} from "lucide-react";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

const STATUS_STYLES = {
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  processing: { label: "Processing", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  accepted: { label: "Accepted", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  confirmed: { label: "Confirmed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  dispatched: { label: "Dispatched", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  packed: { label: "Packed", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  shipped: { label: "Shipped", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  delivered: { label: "Delivered", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  transport: { label: "Booked for Transport", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  paid: { label: "Paid", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  completed: { label: "Completed", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

export function normalizeOrder(order) {
  if (!order) return null;

  const rawId = order.order_id ?? order.id;
  const orderId =
    typeof rawId === "string" ? rawId.replace("#", "") : rawId;

  const totalAmount = parseFloat(order.total_amount ?? order.amount ?? 0) || 0;
  const commissionRate = parseFloat(order.commission) || 10;
  const commissionAmount =
    order.commission_amount != null
      ? parseFloat(order.commission_amount)
      : (totalAmount * commissionRate) / 100;
  const payoutAmount =
    order.payout_amount != null
      ? parseFloat(order.payout_amount)
      : totalAmount - commissionAmount;

  const createdAt = order.created_at || null;
  let orderDate = order.date || "—";
  let orderTime = order.time || "—";
  if (createdAt) {
    const parts = String(createdAt).split(" ");
    orderDate = parts[0] || orderDate;
    orderTime = parts[1]?.substring(0, 5) || orderTime;
  }

  return {
    orderId,
    status: (order.status || "pending").toLowerCase(),
    orderDate,
    orderTime,
    createdAt,
    paymentMethod: order.payment_method || order.paymentMethod || "COD",
    totalAmount,
    commissionRate,
    commissionAmount,
    payoutAmount,
    vendorPaymentStatus: (
      order.vendor_payment_status ||
      order.payment_status ||
      "pending"
    ).toLowerCase(),
    customer: {
      name: order.user_name || order.customer_name || order.customerName || "—",
      phone: order.user_phone || order.customer_phone || "—",
      address:
        order.user_address ||
        order.shipping_address ||
        order.shippingAddress ||
        "—",
      email: order.user_email || order.email || null,
    },
    vendor: {
      name: order.owner_name || order.vendor_name || "—",
      phone: order.owner_phone || order.vendor_phone || "—",
      business: order.business_name || "—",
    },
    product: {
      id: order.product_id || null,
      name: order.article_name || order.product_name || "—",
      image: order.product_image || order.image,
      brand: order.brand_name || order.brand || "—",
      category: order.category_name || order.category || "—",
      size: order.size || "—",
      color: order.color || "—",
      material: order.material || "—",
      quantity: order.quantity ?? order.qty ?? order.total_quantity ?? "—",
      unitPrice: order.unit_price || order.selling_price || null,
    },
    items: order.total_items ?? order.items ?? null,
    quantity: order.quantity ?? order.qty ?? order.total_quantity ?? null,
  };
}

function getStatusBadge(status) {
  const key = status?.toLowerCase();
  return (
    STATUS_STYLES[key] || {
      label: status || "Unknown",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
  );
}

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `https://namami-infotech.com${image}`;
  return `https://namami-infotech.com/${image}`;
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function InfoRow({ icon: Icon, label, value, isAdmin = true }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-start gap-3">
      <div
        className={`p-1.5 rounded-lg shrink-0 ${
          isAdmin ? "bg-slate-700/50" : "bg-violet-100"
        }`}
      >
        <Icon size={14} className={isAdmin ? "text-teal-400" : "text-violet-600"} />
      </div>
      <div className="min-w-0">
        <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>{label}</p>
        <p className={`text-sm font-medium break-words ${isAdmin ? "text-white" : "text-gray-900"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, isAdmin }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isAdmin
          ? "bg-slate-800/40 border-white/5"
          : "bg-white border-violet-100 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className={isAdmin ? "text-teal-400" : "text-violet-600"} />
        <h3 className={`text-sm font-semibold ${isAdmin ? "text-white" : "text-gray-900"}`}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export default function ViewOrderDetailsModal({
  isOpen,
  onClose,
  order,
  variant = "admin",
  showFinancials = true,
  token = "",
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = variant === "admin";

  useEffect(() => {
    if (!isOpen || !order) {
      setDetails(null);
      return;
    }

    const normalized = normalizeOrder(order);
    setDetails(normalized);

    const orderId = normalized?.orderId;
    if (!orderId || !token) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/order/get_order_details.php?order_id=${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.data) {
            setDetails(normalizeOrder({ ...order, ...data.data }));
          }
        }
      } catch {
        /* use list data */
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, order, token]);

  if (!isOpen || !details) return null;

  const statusBadge = getStatusBadge(details.status);
  const payBadge = getStatusBadge(details.vendorPaymentStatus);
  const imageUrl = getImageUrl(details.product.image);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col ${
          isAdmin
            ? "bg-slate-900 border border-white/10"
            : "bg-white border border-violet-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`shrink-0 px-6 py-4 border-b ${
            isAdmin ? "border-white/10 bg-slate-900/95" : "border-violet-100 bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2.5 rounded-xl ${
                  isAdmin ? "bg-teal-500/20" : "bg-violet-100"
                }`}
              >
                <ShoppingBag
                  size={22}
                  className={isAdmin ? "text-teal-400" : "text-violet-600"}
                />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isAdmin ? "text-white" : "text-gray-900"}`}>
                  Order #{details.orderId}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadge.color}`}
                  >
                    {statusBadge.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      isAdmin ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Calendar size={11} />
                    {details.orderDate}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      isAdmin ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Clock size={11} />
                    {details.orderTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <Loader2
                  size={18}
                  className={`animate-spin ${isAdmin ? "text-teal-400" : "text-violet-600"}`}
                />
              )}
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isAdmin
                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Product card */}
          <div
            className={`rounded-xl border overflow-hidden ${
              isAdmin ? "border-white/10 bg-slate-800/30" : "border-violet-100 bg-violet-50/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              <div
                className={`sm:w-44 shrink-0 aspect-square sm:aspect-auto sm:min-h-[180px] flex items-center justify-center ${
                  isAdmin ? "bg-slate-800" : "bg-violet-100"
                }`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={details.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/200x200/f1f5f9/64748b?text=Product";
                    }}
                  />
                ) : (
                  <Package
                    size={48}
                    className={isAdmin ? "text-gray-600" : "text-violet-300"}
                  />
                )}
              </div>
              <div className="flex-1 p-5">
                <p
                  className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    isAdmin ? "text-teal-400" : "text-violet-600"
                  }`}
                >
                  Product Details
                </p>
                <h3
                  className={`text-lg font-bold mb-3 ${
                    isAdmin ? "text-white" : "text-gray-900"
                  }`}
                >
                  {details.product.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Tag, label: "Brand", value: details.product.brand },
                    { icon: Layers, label: "Category", value: details.product.category },
                    { icon: Hash, label: "Size", value: details.product.size },
                    { icon: Palette, label: "Color", value: details.product.color },
                    { icon: Package, label: "Material", value: details.product.material },
                    {
                      icon: ShoppingBag,
                      label: "Quantity",
                      value: details.product.quantity,
                    },
                  ].map(({ icon: FieldIcon, label, value }) =>
                    value && value !== "—" ? (
                      <div key={label} className="flex items-center gap-2">
                        <FieldIcon
                          size={13}
                          className={isAdmin ? "text-gray-500" : "text-violet-400"}
                        />
                        <div>
                          <p className={`text-[10px] uppercase ${isAdmin ? "text-gray-500" : "text-gray-400"}`}>
                            {label}
                          </p>
                          <p className={`text-sm font-medium ${isAdmin ? "text-gray-200" : "text-gray-800"}`}>
                            {value}
                          </p>
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer */}
            <SectionCard title="Customer Information" icon={User} isAdmin={isAdmin}>
              <div className="space-y-3">
                <InfoRow icon={User} label="Name" value={details.customer.name} isAdmin={isAdmin} />
                <InfoRow icon={Phone} label="Phone" value={details.customer.phone} isAdmin={isAdmin} />
                {details.customer.email && (
                  <InfoRow icon={Mail} label="Email" value={details.customer.email} isAdmin={isAdmin} />
                )}
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={details.customer.address}
                  isAdmin={isAdmin}
                />
              </div>
            </SectionCard>

            {/* Vendor */}
            <SectionCard title="Vendor Information" icon={Building2} isAdmin={isAdmin}>
              <div className="space-y-3">
                <InfoRow
                  icon={Building2}
                  label="Business"
                  value={details.vendor.business}
                  isAdmin={isAdmin}
                />
                <InfoRow icon={User} label="Owner" value={details.vendor.name} isAdmin={isAdmin} />
                <InfoRow icon={Phone} label="Phone" value={details.vendor.phone} isAdmin={isAdmin} />
              </div>
            </SectionCard>
          </div>

          {/* Payment & order summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              className={`rounded-xl p-4 border ${
                isAdmin
                  ? "bg-slate-800/60 border-white/5"
                  : "bg-white border-violet-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={14} className={isAdmin ? "text-teal-400" : "text-violet-600"} />
                <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>Payment</p>
              </div>
              <p className={`text-sm font-bold uppercase ${isAdmin ? "text-white" : "text-gray-900"}`}>
                {details.paymentMethod}
              </p>
            </div>

            <div
              className={`rounded-xl p-4 border ${
                isAdmin
                  ? "bg-slate-800/60 border-white/5"
                  : "bg-white border-violet-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee size={14} className={isAdmin ? "text-emerald-400" : "text-emerald-600"} />
                <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>Order Total</p>
              </div>
              <p className={`text-lg font-bold ${isAdmin ? "text-emerald-400" : "text-emerald-600"}`}>
                {formatCurrency(details.totalAmount)}
              </p>
            </div>

            {details.items != null && (
              <div
                className={`rounded-xl p-4 border ${
                  isAdmin
                    ? "bg-slate-800/60 border-white/5"
                    : "bg-white border-violet-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package size={14} className={isAdmin ? "text-blue-400" : "text-blue-600"} />
                  <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>Items</p>
                </div>
                <p className={`text-lg font-bold ${isAdmin ? "text-white" : "text-gray-900"}`}>
                  {details.items}
                </p>
              </div>
            )}

            <div
              className={`rounded-xl p-4 border ${
                isAdmin
                  ? "bg-slate-800/60 border-white/5"
                  : "bg-white border-violet-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Truck size={14} className={isAdmin ? "text-purple-400" : "text-purple-600"} />
                <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>Fulfillment</p>
              </div>
              <span
                className={`inline-flex text-xs px-2 py-1 rounded-full border font-semibold ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
            </div>
          </div>

          {/* Financial breakdown (accounts) */}
          {showFinancials && (
            <SectionCard title="Payment & Settlement Breakdown" icon={Wallet} isAdmin={isAdmin}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`rounded-lg p-4 ${
                    isAdmin ? "bg-slate-900/50" : "bg-emerald-50"
                  }`}
                >
                  <p className={`text-xs mb-1 ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>
                    Gross Amount
                  </p>
                  <p className={`text-xl font-bold ${isAdmin ? "text-white" : "text-gray-900"}`}>
                    {formatCurrency(details.totalAmount)}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    isAdmin ? "bg-slate-900/50" : "bg-fuchsia-50"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <BadgePercent size={12} className="text-fuchsia-400" />
                    <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>
                      Commission ({details.commissionRate}%)
                    </p>
                  </div>
                  <p className={`text-xl font-bold text-fuchsia-400`}>
                    {formatCurrency(details.commissionAmount)}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    isAdmin ? "bg-slate-900/50" : "bg-teal-50"
                  }`}
                >
                  <p className={`text-xs mb-1 ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>
                    Vendor Payout
                  </p>
                  <p className={`text-xl font-bold ${isAdmin ? "text-teal-400" : "text-teal-600"}`}>
                    {formatCurrency(details.payoutAmount)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>
                  Vendor payment status:
                </p>
                <span
                  className={`inline-flex text-xs px-2.5 py-1 rounded-full border font-semibold ${payBadge.color}`}
                >
                  {payBadge.label}
                </span>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Footer */}
        <div
          className={`shrink-0 px-6 py-4 border-t ${
            isAdmin ? "border-white/10 bg-slate-900/95" : "border-violet-100 bg-white"
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
              isAdmin
                ? "bg-slate-800 hover:bg-slate-700 text-gray-300 border border-white/10"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
