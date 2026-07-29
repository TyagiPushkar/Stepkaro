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
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Loader2,
  LocateIcon,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

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
  return `RS .${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function getDisplayName(item) {
  return (
    [
      item?.article_name,
      item?.variant,
      item?.color,
      item?.packing_type,
      item?.category_name,
    ]
      .filter(Boolean)
      .join(" | ") || "—"
  );
}

function getCommissionType(item) {
  const type =
    item?.commission_type || item?.product?.commission_type || "percentage";

  const value = item?.commission || item?.product?.commission || 0;

  if (type === "per_piece_rate" || type === "per pairs rate") {
    return `Per Pair Rate: RS. ${value}`;
  }

  if (type === "percentage") {
    return `Percentage: ${value}%`;
  }

  return `${type}: ${value}`;
}

function getCommissionOnPair(item) {
  if (item?.commission_per_pair != null && item?.commission_per_pair !== "") {
    return Number(item.commission_per_pair);
  }
  const type =
    item?.commission_type || item?.product?.commission_type || "percentage";
  const commission = Number(item?.commission ?? item?.product?.commission ?? 0);
  const price = Number(item?.price || 0);
  if (type === "percentage") {
    return (price * commission) / 100;
  }
  return commission;
}

function buildOrderPdf({ order, buyer, vendor, items }) {
  // Configured for Standard A4 Portrait (210mm x 297mm)
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let y = 12;

  // --- Company Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // Slate dark
  doc.text("STEPKARO TECHNOLOGIES PRIVATE LIMITED", pageWidth / 2, y, {
    align: "center",
  });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100);
  const companyAddress =
    "KH NO. 680, Ground Floor, Duliya Colony, Alipur, North West Delhi - 110036";
  doc.text(companyAddress, pageWidth / 2, y, { align: "center" });
  y += 7;

  // Divider Line
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // --- Order Metadata Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text("Order Details", margin, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Order #${order?.id || "—"}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 5;

  doc.setFontSize(8);
  doc.setTextColor(80);
  const meta = [
    `Status: ${order?.status || "—"}`,
    `Date: ${order?.created_at || "—"}`,
    `Payment: ${order?.payment_method || "COD"}`,
    `Total Qty: ${order?.total_quantity || 0} ctn`,
    // `Total Amount: ₹${order?.total_amount || 0}`,
  ].join("  |  ");
  doc.text(meta, margin, y);
  y += 4; // Agli line ke liye vertical gap

  // Line 2: Total Amount (bold font aur clear visibility ke saath)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Amount: RS. ${order?.total_amount || 0}`, margin, y);

  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  y += 6;

  // --- Buyer & Seller Side-by-Side Tables ---
  const colGap = 4;
  const colWidth = (pageWidth - margin * 2 - colGap) / 2; // ~93mm per table
  const leftX = margin;
  const rightX = margin + colWidth + colGap;

  const buyerRows = [
    ["Shop Name", buyer?.shop_name || "—"],
    ["Aadhar No.", buyer?.document_number || "—"],
    ["Phone No.", buyer?.phone || "—"],
    ["District", buyer?.district || "—"],
    ["State", buyer?.state || "—"],
    ["Address", buyer?.address || "—"],
    ["Delivery Location", buyer?.delivery_location || "—"],
    ["Transport Name", buyer?.logistic_partner_name || "—"],
    ["Transport Phone", buyer?.logistic_contact_no || "—"],
  ];

  const sellerRows = [
    ["Brand Name", vendor?.brand_name || "—"],
    ["Business Name", vendor?.business_name || "—"],
    ["Phone No.", vendor?.phone || "—"],
    ["Address", vendor?.address || "—"],
    ["Email", vendor?.email || "—"],
    ["GST No.", vendor?.gst_number || "—"],
  ];

  // Buyer Table
  autoTable(doc, {
    startY: y,
    margin: { left: leftX, right: pageWidth - (leftX + colWidth) },
    tableWidth: colWidth,
    head: [["Buyer Details", ""]],
    body: buyerRows,
    theme: "grid",
    styles: { fontSize: 7.5, cellPadding: 1.5, valign: "middle" },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: colWidth * 0.38,
        textColor: [90, 90, 90],
      },
      1: { cellWidth: colWidth * 0.62 },
    },
  });

  const buyerEndY = doc.lastAutoTable.finalY;

  // Seller Table
  autoTable(doc, {
    startY: y,
    margin: { left: rightX, right: margin },
    tableWidth: colWidth,
    head: [["Seller Details", ""]],
    body: sellerRows,
    theme: "grid",
    styles: { fontSize: 7.5, cellPadding: 1.5, valign: "middle" },
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: colWidth * 0.38,
        textColor: [90, 90, 90],
      },
      1: { cellWidth: colWidth * 0.62 },
    },
  });

  y = Math.max(buyerEndY, doc.lastAutoTable.finalY) + 6;

  // --- Product Details Table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Product Details (${items?.length || 0})`, margin, y);
  y += 3;

  const totalAmount = (items || []).reduce((sum, item) => {
    const price = Number(item?.price || 0);
    const qty = Number(item?.quantity || 0);
    const pairs = Number(item?.pairs_per_ctn || 0);

    return sum + Number(item?.total_price ?? price * pairs * qty);
  }, 0);

  const totalSettlementAmount = (items || []).reduce((sum, item) => {
    const commissionOnPair =
      typeof getCommissionOnPair === "function"
        ? Number(getCommissionOnPair(item))
        : 0;

    const price = Number(item?.price || 0);
    const qty = Number(item?.quantity || 0);
    const pairs = Number(item?.pairs_per_ctn || 0);

    const settlementPerPair = price - commissionOnPair;

    return sum + settlementPerPair * pairs * qty;
  }, 0);

  const productBody = (items || []).map((item, index) => {
    const commissionOnPair =
      typeof getCommissionOnPair === "function" ? getCommissionOnPair(item) : 0;
    const price = Number(item?.price || 0);
    const pairsPerCtn = Number(item?.pairs_per_ctn || 0);
    const quantity = Number(item?.quantity || 0);

    const settlementPerPair = price - Number(commissionOnPair || 0);
    const settlementAmount = pairsPerCtn * settlementPerPair * quantity;

    const displayName =
      typeof getDisplayName === "function"
        ? getDisplayName(item)
        : item?.name || "—";
    const commissionType =
      typeof getCommissionType === "function" ? getCommissionType(item) : "—";

    return [
      String(index + 1),
      displayName,
      String(quantity),
      String(pairsPerCtn),
      String(price),
      String(item?.total_price ?? price * pairsPerCtn * quantity),
      commissionType,
      String(commissionOnPair ?? 0),
      String(settlementPerPair.toFixed(2)),
      String(settlementAmount.toFixed(2)),
    ];
  });

  // autoTable(doc, {
  //   startY: y,
  //   margin: { left: margin, right: margin },
  //   tableWidth: pageWidth - margin * 2, // Total printable width = 190mm
  //   head: [
  //     [
  //       "S.N",
  //       "Display Name",
  //       "Qty\n(Ctn)",
  //       "Pairs\n/Ctn",
  //       "Price\n/App",
  //       "Total\nAmt",
  //       "Comm.\nType",
  //       "Comm.\n/Pair",
  //       "Settl.\n/Pair",
  //       "Settl.\nAmt",
  //     ],
  //   ],
  //   body: productBody.length
  //     ? productBody
  //     : [["—", "No products found", "—", "—", "—", "—", "—", "—", "—", "—"]],
  //   theme: "grid",
  //   styles: {
  //     fontSize: 7,
  //     cellPadding: 1.5,
  //     valign: "middle",
  //     overflow: "linebreak",
  //   },
  //   headStyles: {
  //     fillColor: [30, 41, 59],
  //     textColor: 255,
  //     fontStyle: "bold",
  //     fontSize: 7,
  //     halign: "center",
  //     valign: "middle",
  //   },
  //   // Total printable area width = 190mm
  //   columnStyles: {
  //     0: { cellWidth: 8, halign: "center" }, // S.No
  //     1: { cellWidth: 42 }, // Display Name
  //     2: { cellWidth: 12, halign: "center" }, // Qty in Ctn
  //     3: { cellWidth: 12, halign: "center" }, // Pairs in Ctn
  //     4: { cellWidth: 16, halign: "right" }, // Price
  //     5: { cellWidth: 20, halign: "right" }, // Total Amount
  //     6: { cellWidth: 20, halign: "center" }, // Comm Type
  //     7: { cellWidth: 18, halign: "right" }, // Comm/Pair
  //     8: { cellWidth: 20, halign: "right" }, // Settl/Pair
  //     9: { cellWidth: 22, halign: "right" }, // Settl Amt
  //   },
  //   didDrawPage: (data) => {
  //     const pageCount = doc.internal.getNumberOfPages();
  //     doc.setFontSize(8);
  //     doc.setTextColor(120);
  //     doc.text(
  //       `Page ${data.pageNumber} of ${pageCount}`,
  //       pageWidth / 2,
  //       doc.internal.pageSize.getHeight() - 6,
  //       { align: "center" },
  //     );
  //   },
  // });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    tableWidth: pageWidth - margin * 2,

    head: [
      [
        "S.N",
        "Display Name",
        "Qty\n(Ctn)",
        "Pairs\n/Ctn",
        "Price\n/App",
        "Total\nAmt",
        "Comm.\nType",
        "Comm.\n/Pair",
        "Settl.\n/Pair",
        "Settl.\nAmt",
      ],
    ],

    body: productBody.length
      ? productBody
      : [["—", "No products found", "—", "—", "—", "—", "—", "—", "—", "—"]],

    // ===== FOOTER ROW =====
    foot: [
      [
        "",
        "",
        "",
        "",
        "TOTAL",
        `RS. ${totalAmount.toFixed(2)}`,
        "",
        "",
        "",
        `RS. ${totalSettlementAmount.toFixed(2)}`,
      ],
    ],

    showFoot: "lastPage",

    theme: "grid",

    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      valign: "middle",
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 7,
      halign: "center",
      valign: "middle",
    },

    footStyles: {
      fillColor: [235, 235, 235],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 8,
      halign: "right",
    },

    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 42 },
      2: { cellWidth: 12, halign: "center" },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 16, halign: "right" },
      5: { cellWidth: 20, halign: "right" },
      6: { cellWidth: 20, halign: "center" },
      7: { cellWidth: 18, halign: "right" },
      8: { cellWidth: 20, halign: "right" },
      9: { cellWidth: 22, halign: "right" },
    },

    didParseCell: function (data) {
      if (data.section === "foot") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [220, 220, 220];
      }
    },

    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();

      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 6,
        {
          align: "center",
        },
      );
    },
  });
  doc.save(`Order_${order?.id || "details"}.pdf`);
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
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

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
          console.log("data were:", data);
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
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-slate-100 rounded-xl p-5 max-w-xs w-full text-center shadow-xl">
          <h2 className="text-sm font-bold text-slate-800">Order Not Found</h2>
          <p className="text-slate-400 text-[11px] mt-1">
            Unable to load this order.
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

  const handleDownloadPdf = () => {
    if (!orderData || downloading) return;
    setDownloading(true);
    try {
      buildOrderPdf({ order, buyer, vendor, items });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  // Payment Receipt Verification URL Parser
  const paymentReceiptUrl = getImageUrl(
    order?.payment_ss || order?.payment_ss || order?.receipt_image,
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
                label: "Total Amount",
                val: formatCurrency(order?.total_amount),
                cls: "text-slate-900 font-extrabold",
              },
              {
                label: "Total no. of ctn",
                val: `${order?.total_quantity || 0} ctn`,
                cls: "text-slate-700 font-semibold",
              },
              {
                label: "Payment Method",
                val: order?.payment_method || "COD",
                cls: "text-indigo-600 font-mono font-bold uppercase",
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
            <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-3xs">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Payment Receipt
              </span>

              {paymentReceiptUrl ? (
                <a
                  href={paymentReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={paymentReceiptUrl}
                    alt="Payment Receipt"
                    className="w-10 h-10 rounded-lg border border-slate-200 object-contain bg-white cursor-pointer hover:opacity-90 transition"
                  />
                </a>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center ">
                  <span className="text-xs text-slate-400">
                    No Payment Receipt
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Item Configuration Grid Section */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-[10px] uppercase tracking-wider">
              <Package size={12} className="text-slate-500" />
              <span>Products ({items?.length || 0})</span>
            </div>

            <div className="space-y-1.5">
              {items?.map((item) => {
                const isExpanded = expandedItems[item.item_id];
                const product = item.product;
                const imageUrl = getImageUrl(item?.image);

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
                            alt={item?.article_name}
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
                          {[
                            item?.article_name,
                            item?.variant,
                            item?.color,
                            item?.packing_type,
                            item?.category_name,
                          ]
                            .filter(Boolean)
                            .join(" | ")}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>
                            Qty:{" "}
                            <span className="font-bold text-slate-700">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span>
                            Price:{" "}
                            <span className="font-medium">
                              {formatCurrency(item.price)}
                            </span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span>
                            pairs Ctn:{" "}
                            <span className="font-medium">
                              {item.pairs_per_ctn}
                            </span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-600 font-bold">
                            Total: {formatCurrency(item.total_price)}
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
                          <span className="text-slate-400">Size</span>{" "}
                          <span className="font-mono font-bold text-slate-700 block">
                            {item?.variant || "—"}
                          </span>
                        </div>
                        {/* <div>
                          <span className="text-slate-400">
                            MRP:
                          </span>{" "}
                          <span className="font-semibold text-slate-700 block">
                            {formatCurrency(product?.price)}
                          </span>
                        </div> */}
                        <div>
                          <span className="text-slate-400">Selling Price:</span>{" "}
                          <span className="font-bold text-emerald-600 block">
                            {formatCurrency(item?.price)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Color:</span>{" "}
                          <span className="font-semibold text-slate-700 block">
                            {item?.color || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">pairs er Ctn:</span>{" "}
                          <span className="font-bold text-indigo-600 block">
                            {item?.pairs_per_ctn || 0}
                          </span>
                        </div>
                        {/* <div>
                          <span className="text-slate-400">
                            Platform Status:
                          </span>{" "}
                          <span className="font-medium text-slate-600 block uppercase text-[10px]">
                            {product?.status || "—"}
                          </span>
                        </div> */}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Vendor Directory Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() => router.push(`/admin/users/${buyer?.id}`)}
              className="cursor-pointer"
            >
              <SectionCard title="Buyer Details" icon={User}>
                <div className="space-y-1.5">
                  <InfoRow
                    icon={User}
                    label="Shop Name"
                    value={buyer?.shop_name}
                  />
                  <InfoRow
                    icon={User}
                    label="Aadhar No."
                    value={buyer?.document_number}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone No."
                    value={buyer?.phone}
                  />
                  <InfoRow
                    icon={User}
                    label="District"
                    value={buyer?.district}
                  />
                  <InfoRow icon={MapPin} label="State" value={buyer?.state} />
                  <InfoRow
                    icon={MapPin}
                    label="Address"
                    value={buyer?.address}
                  />
                  <InfoRow
                    icon={User}
                    label="Delivery Location"
                    value={buyer?.delivery_location}
                  />
                  <InfoRow
                    icon={User}
                    label="Transport Name"
                    value={buyer?.logistic_partner_name}
                  />
                  <InfoRow
                    icon={User}
                    label="Transport Phone No."
                    value={buyer?.logistic_contact_no}
                  />
                  {/* <InfoRow icon={User} label="Name ID" value={buyer?.name} /> */}
                  {/* <InfoRow icon={User} label="Name ID" value={buyer?.name} /> */}
                  {/* <InfoRow icon={Mail} label="Secure Mail" value={buyer?.email} /> */}
                </div>
              </SectionCard>
            </div>
            <div
              onClick={() => router.push(`/admin/vendors/${vendor?.id}`)}
              className="cursor-pointer"
            >
              <SectionCard title="Vendor Details" icon={Building2}>
                <div className="space-y-1.5">
                  <InfoRow
                    icon={Building2}
                    label="Brand Name"
                    value={vendor?.brand_name}
                  />
                  <InfoRow
                    icon={Building2}
                    label="Business Name"
                    value={vendor?.business_name}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone No."
                    value={vendor?.phone}
                  />
                  <InfoRow
                    icon={LocateIcon}
                    label="Address"
                    value={vendor?.address}
                  />
                  <InfoRow icon={Mail} label="Email" value={vendor?.email} />
                  <InfoRow
                    icon={Mail}
                    label="Gst NO."
                    value={vendor?.gst_number}
                  />
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Lower Financial & Payment Receipt Split Section */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> */}
          {/* Financial Ledger Breakdown */}
          {/* <div className="md:col-span-2"> */}
          {/* <SectionCard title="SaaS Financial Settlement" icon={Wallet}>
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
              </SectionCard> */}
          {/* </div> */}

          {/* Premium Interactive Payment Receipt Card */}
          {/* <SectionCard title="Payment Receipt" icon={CreditCard}>
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
            </SectionCard> */}
          {/* </div> */}
        </div>

        {/* Global Action Footer */}
        <div className="shrink-0 px-4 py-2.5 bg-white border-t border-slate-200/60 flex justify-end gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700 disabled:opacity-60"
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
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
