"use client";

import { useEffect, useState } from "react";
import {
  X,
  Package,
  User,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  BadgePercent,
  Wallet,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Loader2,
  CreditCard,
  ExternalLink,
} from "lucide-react";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";
const BASE_URL_IMAGE = "https://namami-infotech.com/Stepkaro/";

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  accepted: {
    label: "Accepted",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  dispatched: {
    label: "Dispatched",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  packed: {
    label: "Packed",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  shipped: { label: "Shipped", color: "bg-sky-50 text-sky-700 border-sky-200" },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

function getStatusBadge(status) {
  const key = status?.toLowerCase();
  return (
    STATUS_STYLES[key] || {
      label: status || "Unknown",
      color: "bg-slate-50 text-slate-600 border-slate-200",
    }
  );
}

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${BASE_URL_IMAGE}${image}`;
  return `${BASE_URL_IMAGE}/${image}`;
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

// Compact Micro Data Row Helper
function InfoRow({ icon: Icon, label, value }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-start gap-2.5 py-1">
      <div className="p-1 rounded bg-slate-100 border border-slate-200/40 text-slate-500 shrink-0 mt-0.5">
        <Icon size={12} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase font-bold tracking-tight text-slate-400 leading-none">
          {label}
        </p>
        <p className="text-xs font-semibold text-slate-700 mt-1 break-words leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

// Refined Light Card Container
function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 shadow-2xs">
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2.5">
        <Icon size={13} className="text-indigo-600" />
        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">
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
  orderId,
  token = "",
}) {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    if (!isOpen || !orderId) {
      setOrderData(null);
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/order/admin_get_details_order.php?order_id=${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data.data) {
            setOrderData(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [isOpen, orderId, token]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-3 border border-slate-100">
          <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />
          <p className="text-slate-600 text-xs font-medium">
            Syncing order timeline metrics...
          </p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-slate-100 rounded-xl p-5 max-w-xs w-full text-center shadow-xl">
          <h2 className="text-sm font-bold text-slate-800">Order Logs Empty</h2>
          <p className="text-slate-400 text-[11px] mt-1">
            Details could not be referenced from backend pool.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
          >
            Close Panel
          </button>
        </div>
      </div>
    );
  }

  const { order, buyer, vendor, items } = orderData;
  const statusBadge = getStatusBadge(order?.status);

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Payment Receipt Verification URL Parser
  const paymentReceiptUrl = getImageUrl(
    order?.payment_receipt || order?.receipt_image,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl flex flex-col bg-slate-50 border border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Flat Header */}
        <div className="shrink-0 px-4 py-3 bg-white border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <ShoppingBag size={15} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-tight text-slate-900">
                  Order Session Ledger
                </h2>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  #{order?.id}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Calendar size={10} />{" "}
                  {order?.created_at?.split(" ")[0] || "—"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Clock size={10} />{" "}
                  {order?.created_at?.split(" ")[1]?.substring(0, 5) || "—"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Balanced Body Area */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Top Quick Status Metric Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              {
                label: "Net Payable",
                val: formatCurrency(order?.total_amount),
                cls: "text-slate-900 font-extrabold",
              },
              {
                label: "Item Count",
                val: `${items?.length || 0} Batches`,
                cls: "text-slate-700 font-semibold",
              },
              {
                label: "Channel Method",
                val: order?.payment_method || "COD",
                cls: "text-indigo-600 font-mono font-bold uppercase",
              },
              {
                label: "Admin Payout Cuts",
                val: formatCurrency(order?.admin_commission),
                cls: "text-fuchsia-600 font-semibold",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-3xs"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  {stat.label}
                </span>
                <p className={`text-sm mt-0.5 ${stat.cls}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Dynamic Item Configuration Grid Section */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-[10px] uppercase tracking-wider">
              <Package size={12} className="text-slate-500" />
              <span>Consolidated Item Matrix ({items?.length || 0})</span>
            </div>

            <div className="space-y-1.5">
              {items?.map((item) => {
                const isExpanded = expandedItems[item.item_id];
                const product = item.product;
                const imageUrl = getImageUrl(product?.image);

                return (
                  <div
                    key={item.item_id}
                    className="rounded-xl border border-slate-200/60 bg-white overflow-hidden shadow-3xs"
                  >
                    {/* Compact Nested Item Trigger */}
                    <div
                      className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-slate-50/80 transition-colors"
                      onClick={() => toggleItem(item.item_id)}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/40 shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product?.article_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/64x64/f1f5f9/94a3b8?text=Product";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package size={16} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {product?.article_name || "Unbranded Item Line"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>
                            Pool Qty:{" "}
                            <span className="font-bold text-slate-700">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span>
                            Unit:{" "}
                            <span className="font-medium">
                              {formatCurrency(item.price)}
                            </span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-600 font-bold">
                            Sum: {formatCurrency(item.total_price)}
                          </span>
                        </div>
                      </div>

                      <div className="text-slate-400 shrink-0 p-1">
                        {isExpanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </div>
                    </div>

                    {/* Extended Operational Specs Block */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 px-3 py-2 bg-slate-50/60 grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-[11px]">
                        <div>
                          <span className="text-slate-400">Variant Class:</span>{" "}
                          <span className="font-mono font-bold text-slate-700 block">
                            {product?.variant || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            Base Retail MRP:
                          </span>{" "}
                          <span className="font-semibold text-slate-700 block">
                            {formatCurrency(product?.price)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            SaaS Deal Price:
                          </span>{" "}
                          <span className="font-bold text-emerald-600 block">
                            {formatCurrency(product?.selling_price)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            Warehouse Stocks:
                          </span>{" "}
                          <span className="font-semibold text-slate-700 block">
                            {product?.stock_quantity || "0"} Pcs
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            Margin Cut Rate:
                          </span>{" "}
                          <span className="font-bold text-indigo-600 block">
                            {product?.commission || 0}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            Platform Status:
                          </span>{" "}
                          <span className="font-medium text-slate-600 block uppercase text-[10px]">
                            {product?.status || "—"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Vendor Directory Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SectionCard title="Customer Profile" icon={User}>
              <div className="space-y-1.5">
                <InfoRow icon={User} label="Name ID" value={buyer?.name} />
                <InfoRow icon={Phone} label="Phone Line" value={buyer?.phone} />
                <InfoRow icon={Mail} label="Secure Mail" value={buyer?.email} />
                <InfoRow
                  icon={MapPin}
                  label="Destination Address"
                  value={buyer?.address}
                />
              </div>
            </SectionCard>

            <SectionCard title="Vendor Directory" icon={Building2}>
              <div className="space-y-1.5">
                <InfoRow
                  icon={Building2}
                  label="Registered Entity"
                  value={vendor?.business_name}
                />
                <InfoRow
                  icon={User}
                  label="Merchant Name"
                  value={vendor?.owner_name}
                />
                <InfoRow
                  icon={Phone}
                  label="Acquisition Contact"
                  value={vendor?.phone}
                />
                <InfoRow
                  icon={Mail}
                  label="Corporate Email"
                  value={vendor?.email}
                />
              </div>
            </SectionCard>
          </div>

          {/* Lower Financial & Payment Receipt Split Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Financial Ledger Breakdown */}
            <div className="md:col-span-2">
              <SectionCard title="SaaS Financial Settlement" icon={Wallet}>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                      Gross Intake
                    </span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">
                      {formatCurrency(order?.total_amount)}
                    </p>
                  </div>
                  <div className="bg-fuchsia-50/50 border border-fuchsia-100 rounded-lg p-2">
                    <div className="flex items-center justify-center gap-0.5 text-fuchsia-500 text-[9px] font-bold uppercase tracking-tight">
                      <BadgePercent size={10} />
                      <span>Cut System</span>
                    </div>
                    <p className="text-xs font-black text-fuchsia-700 mt-0.5">
                      {formatCurrency(order?.admin_commission)}
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tight block">
                      Merchant Yield
                    </span>
                    <p className="text-xs font-black text-emerald-700 mt-0.5">
                      {formatCurrency(order?.vendor_amount)}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Premium Interactive Payment Receipt Card */}
            <SectionCard title="Receipt Attachment" icon={CreditCard}>
              {paymentReceiptUrl ? (
                <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-1 overflow-hidden h-[54px] flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={paymentReceiptUrl}
                      alt="Receipt Entry Thumbnail"
                      className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-700 truncate">
                        Payment_Receipt.jpg
                      </p>
                      <span className="text-[9px] text-indigo-600 font-semibold tracking-wide block uppercase">
                        Stored Cloud Path
                      </span>
                    </div>
                  </div>
                  <a
                    href={paymentReceiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-md transition-colors border border-slate-200/40"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              ) : (
                <div className="h-[54px] border border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    No Slip Doc Logs Uploaded
                  </span>
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Global Action Footer */}
        <div className="shrink-0 px-4 py-2.5 bg-white border-t border-slate-200/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
          >
            Close Session
          </button>
        </div>
      </div>
    </div>
  );
}
