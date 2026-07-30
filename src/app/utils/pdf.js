// utils/pdf.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- Helper: Dynamic Commission on Pair Calculation ---
function getCommissionOnPair(item) {
  if (item?.commission_per_pair != null && item?.commission_per_pair !== "") {
    return Number(item.commission_per_pair);
  }

  const type =
    item?.commission_type || item?.product?.commission_type || "percentage";
  const commission = Number(item?.commission ?? item?.product?.commission ?? 0);
  const sellingPrice = Number(item?.selling_price ?? item?.price ?? 0);

  if (type === "percentage") {
    return (sellingPrice * commission) / 100;
  }
  return commission;
}

export const generateVendorOrderPdf = ({ order, items }) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let y = 12;

  // Company Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("STEPKARO TECHNOLOGIES PRIVATE LIMITED", pageWidth / 2, y, {
    align: "center",
  });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100);
  doc.text(
    "KH NO. 680, Ground Floor, Duliya Colony, Alipur, North West Delhi - 110036",
    pageWidth / 2,
    y,
    { align: "center" },
  );
  y += 6;

  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Order Metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Order #${order?.id || "—"}`, margin, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Status: ${order?.status || "—"}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 5;

  doc.setFontSize(8);
  doc.setTextColor(80);
  const meta = [`Date: ${order?.created_at?.split(" ")[0] || "—"}`].join(
    "  |  ",
  );
  doc.text(meta, margin, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Amount: RS. ${order?.amount || 0}`, margin, y);
  y += 6;

  // Global totals for Footer
  let totalQty = 0;
  let totalAmount = 0;
  let totalSettlement = 0;

  // Product Table Body Mapping
  const productBody = (items || []).map((item, idx) => {
    const selling_price = Number(item?.selling_price ?? item?.price ?? 0);
    const pairsPerCtn = Number(item?.pairs_per_ctn || 0);
    const quantity = Number(item?.quantity || 0);

    // Dynamic Commission based on selling_price
    const commissionOnPair = getCommissionOnPair(item);

    // Derived Amounts
    const totalItemAmount = selling_price * pairsPerCtn * quantity;
    const settlementPerPair = selling_price - commissionOnPair;
    const settlementAmount = pairsPerCtn * settlementPerPair * quantity;

    // Accumulate Footer Totals
    totalQty += quantity;
    totalAmount += totalItemAmount;
    totalSettlement += settlementAmount;

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

    const commType =
      item?.commission_type ||
      item?.product?.commission_type ||
      "per_piece_rate";
    const commValue = item?.commission ?? item?.product?.commission ?? 0;
    const commDisplay =
      commType === "percentage" ? `${commValue}%` : `Flat ${commValue}`;

    return [
      String(idx + 1),
      displayName,
      String(quantity),
      String(pairsPerCtn),
      selling_price.toFixed(2),
      commDisplay,
      commissionOnPair.toFixed(2),
      settlementPerPair.toFixed(2),
      settlementAmount.toFixed(2),
      totalItemAmount.toFixed(2),
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    tableWidth: pageWidth - margin * 2,
    head: [
      [
        "S.No",
        "DISPLAY NAME",
        "QTY IN CTN",
        "PAIRS PER CTN",
        "PRICE ON APP (Rs)",
        "COMMISSION TYPE",
        "COMMISSION PER PAIR (Rs)",
        "SETTLEMENT PER PAIR (Rs)",
        "SETTLEMENT AMOUNT (Rs)",
        "TOTAL AMOUNT (Rs)",
      ],
    ],
    body: productBody.length
      ? productBody
      : [["—", "No products", "—", "—", "—", "—", "—", "—", "—", "—"]],
    foot: [
      [
        "",
        "TOTAL",
        `${totalQty}`,
        "",
        "",
        "",
        "",
        "",
        `RS. ${totalSettlement.toFixed(2)}`,
        `RS. ${totalAmount.toFixed(2)}`,
      ],
    ],
    showFoot: "lastPage",
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 1.5, valign: "middle" },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 7,
      halign: "center",
    },
    footStyles: {
      fillColor: [235, 235, 235],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 7,
      halign: "right",
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 38 },
      2: { cellWidth: 12, halign: "center" },
      3: { cellWidth: 14, halign: "center" },
      4: { cellWidth: 18, halign: "right" },
      5: { cellWidth: 18, halign: "center" },
      6: { cellWidth: 20, halign: "right" },
      7: { cellWidth: 20, halign: "right" },
      8: { cellWidth: 21, halign: "right" },
      9: { cellWidth: 21, halign: "right" },
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: "center" },
      );
    },
  });

  doc.save(`Order_${order?.id || "details"}.pdf`);
};
