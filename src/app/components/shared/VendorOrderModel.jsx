// components/OrderDetailsModal.js
import React, { useState } from "react";
import {
    Loader2,
    Download,
    ShoppingBag,
    Calendar,
    Clock,
    X,
    Package,
    ChevronUp,
    ChevronDown,
    User,
    Phone,
    MapPin,
    Building2,
    LocateIcon,
    Mail,
    BadgePercent,
    Wallet,
} from "lucide-react";
import { formatCurrency, getImageUrl, getStatusBadge } from "../../utils/helpers";
import { generateVendorOrderPdf } from "../../utils/pdf";

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {Icon && <Icon size={12} className="text-slate-500" />}
            <span>{title}</span>
        </div>
        {children}
    </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-2 text-[11px]">
        <Icon size={12} className="text-slate-400 mt-0.5 shrink-0" />
        <span className="text-slate-500 font-medium">{label}:</span>
        <span className="text-slate-700 font-semibold truncate">{value || "—"}</span>
    </div>
);

export const OrderDetailsModal = ({
    isOpen,
    onClose,
    orderDetails,   // Flat order object (with productsList) or { order, items } structure
    loading,
}) => {
    console.log(orderDetails)
    const [expandedItems, setExpandedItems] = useState({});
    const [downloading, setDownloading] = useState(false);

    if (!isOpen) return null;

    const toggleItem = (itemId) => {
        setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const handleDownloadPdf = async () => {
        if (!orderDetails || downloading) return;
        setDownloading(true);
        try {
            // Determine if we have a flat order or { order, items }
            let orderData, itemsData;
            if (orderDetails.order && orderDetails.items) {
                // Structure: { order, items }
                orderData = orderDetails.order;
                itemsData = orderDetails.items;
            } else {
                // Flat order object with productsList
                orderData = orderDetails;
                itemsData = orderDetails.productsList || [];
            }
            // Ensure itemsData is an array
            if (!Array.isArray(itemsData)) itemsData = [];
            await generateVendorOrderPdf({ order: orderData, items: itemsData });
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setDownloading(false);
        }
    };

    // Loading & error states
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-3 border border-slate-100">
                    <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />
                    <p className="text-slate-600 text-xs font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white border border-slate-100 rounded-xl p-5 max-w-xs w-full text-center shadow-xl">
                    <h2 className="text-sm font-bold text-slate-800">Order Not Found</h2>
                    <p className="text-slate-400 text-[11px] mt-1">Unable to load this order.</p>
                    <button onClick={onClose} className="mt-4 w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition">
                        Close Panel
                    </button>
                </div>
            </div>
        );
    }

    // ---- SAFELY extract order data ----
    // Check if orderDetails has a nested 'order' property (structure from admin_get_details_order.php)
    const isNested = !!orderDetails.order && !!orderDetails.items;
    const order = isNested ? orderDetails.order : orderDetails;
    const itemsRaw = isNested ? orderDetails.items : orderDetails.productsList;

    // Ensure items is an array (fallback to empty array)
    const items = Array.isArray(itemsRaw) ? itemsRaw : [];

    const statusBadge = getStatusBadge(order?.status);
    const paymentReceiptUrl = getImageUrl(order?.payment_ss || order?.receipt_image);

    // Compute totals
    let totalQty = 0,
        totalAmount = 0,
        totalSettlement = 0;
    items.forEach((item) => {
        const qty = Number(item?.quantity || 0);
        const pairs = Number(item?.pairs_per_ctn || 0);
        const selling_price = Number(item?.selling_price || 0);
        const price = Number(item?.price || 0);
        const comm = Number(item?.commission_per_pair || 0);
        const total = selling_price * pairs * qty;
        totalQty += qty;
        totalAmount += total;
        totalSettlement += (selling_price - comm) * pairs * qty;
    });

    // Buyer & vendor (if present)
    const buyer = orderDetails.buyer || null;
    const vendor = orderDetails.vendor || null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl flex flex-col bg-slate-50 border border-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="shrink-0 px-4 py-3 bg-white border-b border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                            <ShoppingBag size={15} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xs font-black uppercase tracking-tight text-slate-900">
                                    Order Details
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
                                    {order?.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                    <Clock size={10} />{" "}
                                    {order?.created_at
                                        ? new Date(order.created_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "—"}
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

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                Total Amount
                            </span>
                            <p className="text-sm mt-0.5 text-slate-900 font-extrabold">
                                {formatCurrency(order?.amount)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                Total no. of ctn
                            </span>
                            <p className="text-sm mt-0.5 text-slate-700 font-semibold">
                                {totalQty} ctn
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                Commission
                            </span>
                            <p className="text-sm mt-0.5 text-indigo-600 font-mono font-bold uppercase">
                                {formatCurrency(order?.admin_commission)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                Settlement Amount
                            </span>
                            <p className="text-sm mt-0.5 text-indigo-600 font-mono font-bold uppercase">
                                {formatCurrency(order?.vendor_amount)}
                            </p>
                        </div>

                    </div>

                    {/* Products Accordion */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-slate-800 font-bold text-[10px] uppercase tracking-wider">
                            <Package size={12} className="text-slate-500" />
                            <span>Products ({items.length})</span>
                        </div>
                        <div className="space-y-1.5">
                            {items.map((item, idx) => {
                                const itemId = item.item_id || idx;
                                const isExpanded = expandedItems[itemId];
                                const imageUrl = getImageUrl(item?.image);
                                const displayName =
                                    [
                                        item?.article_name,
                                        item?.variant,
                                        item?.color,
                                        item?.packing_type,
                                        item?.category_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" | ") || "—";

                                const qty = Number(item?.quantity || 0);
                                const pairs = Number(item?.pairs_per_ctn || 0);
                                const selling_price = Number(item?.selling_price || 0);
                                const price = Number(item?.price || 0);
                                const itemTotal = item?.total_price ?? selling_price * pairs * qty;

                                return (
                                    <div
                                        key={itemId}
                                        className="rounded-xl border border-slate-200/60 bg-white overflow-hidden shadow-sm"
                                    >
                                        <div
                                            className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-slate-50/80 transition-colors"
                                            onClick={() => toggleItem(itemId)}
                                        >
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/40 shrink-0">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item?.article_name || "Product"}
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
                                                <p className="text-xs font-bold text-slate-800 truncate uppercase">
                                                    {displayName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 flex-wrap">
                                                    <span>
                                                        Qty:{" "}
                                                        <span className="font-bold text-slate-700">{qty}</span>
                                                    </span>
                                                    <span className="text-slate-300">|</span>
                                                    <span>
                                                        Price:{" "}
                                                        <span className="font-medium">{formatCurrency(selling_price)}</span>
                                                    </span>
                                                    <span className="text-slate-300">|</span>
                                                    <span>
                                                        pairs Ctn:{" "}
                                                        <span className="font-medium">{pairs}</span>
                                                    </span>
                                                    <span className="text-slate-300">|</span>
                                                    <span className="text-emerald-600 font-bold">
                                                        Total: {formatCurrency(itemTotal)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-slate-400 shrink-0 p-1">
                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t border-slate-100 px-3 py-2 bg-slate-50/60 grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-[11px]">
                                                <div>
                                                    <span className="text-slate-400">Size</span>{" "}
                                                    <span className="font-mono font-bold text-slate-700 block">
                                                        {item?.variant || "—"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Selling Price:</span>{" "}
                                                    <span className="font-bold text-emerald-600 block">
                                                        {formatCurrency(selling_price)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Color:</span>{" "}
                                                    <span className="font-semibold text-slate-700 block">
                                                        {item?.color || "—"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">pairs per Ctn:</span>{" "}
                                                    <span className="font-bold text-indigo-600 block">
                                                        {pairs}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-4 py-2.5 bg-white border-t border-slate-200/60 flex justify-end gap-2">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={downloading || loading || !orderDetails}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700 disabled:opacity-60 cursor-pointer"
                    >
                        {downloading ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            <Download size={13} />
                        )}
                        {downloading ? "Preparing PDF..." : "Download PDF"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};