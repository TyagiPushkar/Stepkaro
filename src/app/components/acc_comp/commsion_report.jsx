"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wallet,
  Printer,
  Search,
  Calendar,
  X,
  FileSpreadsheet,
  FileDown,
  Filter,
} from "lucide-react";
import * as XLSX from "xlsx";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function CommissionReport({
  orders = [],
  loading = false,
  error = null,
}) {
  console.log("CommissionReport - Orders received:", orders);
  console.log("CommissionReport - Orders count:", orders?.length);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Group orders by order_id - NO SORTING, preserve original order
  const groupedOrders = useMemo(() => {
    console.log("Grouping orders...");
    if (!orders || orders.length === 0) {
      console.log("No orders to group");
      return [];
    }

    const grouped = {};
    const orderIds = [];

    orders.forEach((item) => {
      const orderId = item.order_id;
      if (!grouped[orderId]) {
        grouped[orderId] = {
          order_id: orderId,
          created_at: item.created_at,
          brand_name: item.brand_name,
          business_name: item.business_name,
          shop_name: item.shop_name,
          payment_method:
            item.payment_method || item.order?.payment_method || "COD",
          status: item.status,
          total_amount: item.total_amount,
          vendor_amount: item.vendor_amount,
          admin_commission: item.admin_commission,
          items: [],
          totals: {
            total_amount: 0,
            commission_amount: 0,
            payout_amount: 0,
            total_ctn: 0,
            total_pairs: 0,
          },
        };
        orderIds.push(orderId);
      }

      // Add items from the order
      if (item.items && item.items.length > 0) {
        item.items.forEach((subItem) => {
          grouped[orderId].items.push({
            ...subItem,
            // Ensure fields exist
            quantity: subItem.quantity || 0,
            price: subItem.price || 0,
            total_price: subItem.total_price || 0,
            admin_commission: item.admin_commission || 0,
            vendor_amount: item.vendor_amount || 0,
          });

          grouped[orderId].totals.total_amount += parseFloat(
            subItem.total_price || 0,
          );
          grouped[orderId].totals.commission_amount += parseFloat(
            item.admin_commission || 0,
          );
          grouped[orderId].totals.payout_amount += parseFloat(
            item.vendor_amount || 0,
          );
          grouped[orderId].totals.total_ctn += parseInt(subItem.quantity || 0);
          grouped[orderId].totals.total_pairs +=
            parseInt(subItem.pairs_per_ctn || 0) *
            parseInt(subItem.quantity || 0);
        });
      }
    });

    const result = orderIds.map((id) => grouped[id]);
    console.log("Grouped orders count:", result.length);
    return result;
  }, [orders]);

  const statusOptions = useMemo(() => {
    const statuses = [
      ...new Set(groupedOrders.map((o) => o.status).filter(Boolean)),
    ];

    return statuses;
  }, [groupedOrders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let list = groupedOrders;

    if (startDate) {
      list = list.filter((order) => {
        const date = new Date(order.created_at);
        return date >= new Date(startDate);
      });
    }
    if (endDate) {
      list = list.filter((order) => {
        const date = new Date(order.created_at);
        return date <= new Date(endDate);
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (order) =>
          order.order_id?.toString().includes(q) ||
          order.brand_name?.toLowerCase().includes(q) ||
          order.business_name?.toLowerCase().includes(q) ||
          order.shop_name?.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((order) => order.status === statusFilter);
    }
    return list;
  }, [groupedOrders, searchQuery, startDate, endDate, statusFilter]);

  // Calculate overall totals
  const overallTotals = useMemo(() => {
    return filteredOrders.reduce(
      (acc, order) => {
        acc.total_orders += 1;
        acc.total_amount += order.totals.total_amount;
        acc.total_commission += order.totals.commission_amount;
        acc.total_payout += order.totals.payout_amount;
        acc.total_ctn += order.totals.total_ctn;
        acc.total_pairs += order.totals.total_pairs;
        return acc;
      },
      {
        total_orders: 0,
        total_amount: 0,
        total_commission: 0,
        total_payout: 0,
        total_ctn: 0,
        total_pairs: 0,
      },
    );
  }, [filteredOrders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  console.log("Current orders to display:", currentOrders.length);

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const isFilterActive = () => {
    return startDate || endDate || searchQuery || statusFilter !== "all";
  };

  // Export to Excel
  // Export to Excel - With UI calculations
  const handleExportExcel = () => {
    const headers = [
      "S.No",
      "Order ID",
      "Buyer Name",
      "Brand Name",
      "Payment Mode",
      "Display Name",
      "CTN Qty",
      "Pairs/CTN",
      "Price/Pair",
      "Commission Type",
      "Commission Per Pair",
      "Settlement Per Pair",
      "Total Commission",
      "Net Payable",
      "Total Amount",
    ];

    const rows = [];
    let serialNo = 1;

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Same calculations as UI
        const qty = Number(item.quantity || 0);
        const pairsPerCtn = Number(item.pairs_per_ctn || 0);
        const price = Number(item.price || 0);
        const commission = Number(item.commission || 0);

        const totalPairs = qty * pairsPerCtn;
        const totalPrice = totalPairs * price;

        // Commission Type display
        let commissionTypeDisplay = "";
        if (item.commission_type === "per_piece_rate") {
          commissionTypeDisplay = `Per Piece (${commission})`;
        } else if (item.commission_type === "percentage") {
          commissionTypeDisplay = `Percentage (${commission}%)`;
        } else {
          commissionTypeDisplay = "—";
        }

        // Commission Per Pair (UI calculation)
        let commissionPerPair = 0;
        if (item.commission_type === "per_piece_rate") {
          commissionPerPair = commission;
        } else if (item.commission_type === "percentage") {
          commissionPerPair = (price * commission) / 100;
        }

        // Settlement Per Pair (UI calculation)
        const settlementPerPair = price - commissionPerPair;

        // Total Commission (UI calculation)
        let totalCommission = 0;
        if (item.commission_type === "per_piece_rate") {
          totalCommission = totalPairs * commission;
        } else if (item.commission_type === "percentage") {
          totalCommission = (totalPrice * commission) / 100;
        }

        // Net Payable (UI calculation)
        const netPayable = totalPrice - totalCommission;

        // Display Name
        const displayName = [
          item.article_name,
          item.variant,
          item.color,
          item.packing_type,
        ]
          .filter(Boolean)
          .join(" | ");

        rows.push([
          serialNo++,
          `#${order.order_id || ""}`,
          order.shop_name || "—",
          order.brand_name || "—",
          order.payment_method || "COD",
          displayName || "—",
          qty,
          pairsPerCtn,
          price,
          commissionTypeDisplay,
          commissionPerPair,
          settlementPerPair,
          totalCommission,
          netPayable,
          totalPrice,
        ]);
      });
    });

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = [
      { wch: 6 }, // S.No
      { wch: 12 }, // Order ID
      { wch: 25 }, // Buyer
      { wch: 20 }, // Brand
      { wch: 15 }, // Payment
      { wch: 45 }, // Display Name
      { wch: 10 }, // CTN
      { wch: 10 }, // Pair/CTN
      { wch: 12 }, // Price
      { wch: 22 }, // Commission Type
      { wch: 18 }, // Commission/Pair
      { wch: 18 }, // Settlement
      { wch: 18 }, // Total Commission
      { wch: 18 }, // Net Payable
      { wch: 18 }, // Total Amount
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commission Report");

    // Summary Sheet
    const summaryData = [
      ["Commission Report Summary"],
      [""],
      ["Metric", "Value"],
      ["Total Orders", overallTotals.total_orders],
      ["Total Revenue", formatCurrency(overallTotals.total_amount)],
      ["Total Commission", formatCurrency(overallTotals.total_commission)],
      ["Total Payout", formatCurrency(overallTotals.total_payout)],
      ["Total CTN", overallTotals.total_ctn],
      ["Total Pairs", overallTotals.total_pairs],
      ["Total Records", filteredOrders.length],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    XLSX.writeFile(
      wb,
      `commission_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // Export CSV
  // Export CSV - With UI calculations
  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Display Name",
      "CTN Qty",
      "Pairs/CTN",
      "Price/Pair",
      "Commission Type",
      "Commission Per pair",
      "Settlement Per Pair",
      "Total Commission",
      "Net Payable",
      "Total Amount",
    ];

    const rows = [];

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Same calculations as UI
        const qty = Number(item.quantity || 0);
        const pairsPerCtn = Number(item.pairs_per_ctn || 0);
        const price = Number(item.price || 0);
        const commission = Number(item.commission || 0);

        const totalPairs = qty * pairsPerCtn;
        const totalPrice = totalPairs * price;

        // Commission Type display
        let commissionTypeDisplay = "";
        if (item.commission_type === "per_piece_rate") {
          commissionTypeDisplay = `Per Piece (${commission})`;
        } else if (item.commission_type === "percentage") {
          commissionTypeDisplay = `Percentage (${commission}%)`;
        } else {
          commissionTypeDisplay = "—";
        }

        // Commission Per Pair (UI calculation)
        let commissionPerPair = 0;
        if (item.commission_type === "per_piece_rate") {
          commissionPerPair = commission;
        } else if (item.commission_type === "percentage") {
          commissionPerPair = (price * commission) / 100;
        }

        // Settlement Per Pair (UI calculation)
        const settlementPerPair = price - commissionPerPair;

        // Total Commission (UI calculation)
        let totalCommission = 0;
        if (item.commission_type === "per_piece_rate") {
          totalCommission = totalPairs * commission;
        } else if (item.commission_type === "percentage") {
          totalCommission = (totalPrice * commission) / 100;
        }

        // Net Payable (UI calculation)
        const netPayable = totalPrice - totalCommission;

        // Display Name
        const displayName = [
          item.article_name,
          item.variant,
          item.color,
          item.packing_type,
        ]
          .filter(Boolean)
          .join(" | ");

        rows.push([
          `#${order.order_id || ""}`,
          displayName || "—",
          qty,
          pairsPerCtn,
          price,
          commissionTypeDisplay,
          commissionPerPair,
          settlementPerPair,
          totalCommission,
          netPayable,
          totalPrice,
        ]);
      });
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commission_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        <Loader2
          size={32}
          className="mx-auto mb-3 text-purple-600 animate-spin"
        />
        <p className="text-gray-500">Loading commission records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        <p className="text-red-500 font-medium">
          Unable to load commission records
        </p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(overallTotals.total_amount)}
          </p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-gray-900">
            {overallTotals.total_orders}
          </p>
          <p className="text-xs text-gray-500">Total Orders</p>
        </div>
        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">
            {overallTotals.total_ctn}
          </p>
          <p className="text-xs text-gray-500">Total CTN</p>
        </div> */}
        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-fuchsia-600">
            {formatCurrency(overallTotals.total_commission)}
          </p>
          <p className="text-xs text-gray-500">Total Commission</p>
        </div> */}
        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(overallTotals.total_payout)}
          </p>
          <p className="text-xs text-gray-500">Total Payout</p>
        </div> */}
      </div>

      {/* Search and Export Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID, Brand Name, Shop Name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              showFilters || isFilterActive()
                ? "border-purple-300 bg-purple-50 text-purple-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
            }`}
          >
            <Filter size={18} />
            Filters
            {isFilterActive() && (
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
            )}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
            >
              <FileSpreadsheet size={18} />
              <span className="hidden sm:inline">Excel</span>
            </button>
            {/* <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
            >
              <FileDown size={18} />
              <span className="hidden sm:inline">CSV</span>
            </button> */}
            {/*   */}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {isFilterActive() && (
        <div className="flex flex-wrap gap-2">
          {startDate && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
              From: {new Date(startDate).toLocaleDateString()}
              <button
                onClick={() => setStartDate("")}
                className="hover:text-blue-800"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {endDate && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
              To: {new Date(endDate).toLocaleDateString()}
              <button
                onClick={() => setEndDate("")}
                className="hover:text-blue-800"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-gray-800"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <span className="text-xs text-gray-400 self-center">
            {filteredOrders.length} orders found
          </span>
        </div>
      )}

      {/* Orders List - Excel Style */}
      <div className="space-y-4">
        {currentOrders.length > 0 ? (
          currentOrders.map((order, index) => {
            const orderIndex = startIndex + index + 1;

            return (
              <div
                key={order.order_id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Order Header */}
                <div className="px-6 py-3 bg-gray-100 border-b-2 border-gray-300">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-700">
                        #{orderIndex}
                      </span>
                      <span className="text-sm font-mono font-bold text-gray-900">
                        Order #{order.order_id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* <span className="text-sm text-gray-600">
                        {order.shop_name || order.business_name || "—"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {order.brand_name || "—"}
                      </span> */}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "new" || order.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "rejected"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          S.No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Buyer Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Brand Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Payment Mode
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Display Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          CTN Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Pairs/CTN
                        </th>
                        {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Total Pairs
                        </th> */}
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Price/Pair
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Commission Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Commission Per pair
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Settlement Per Pair
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Total Commission
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Net Payable
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                          Total Amount
                        </th>
                        {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item, idx) => {
                        const displayName = [
                          item.article_name,
                          item.variant,
                          item.color,
                          item.packing_type,
                        ]
                          .filter(Boolean)
                          .join(" | ");

                        return (
                          <tr
                            key={item.item_id || idx}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-500 border-r border-gray-100">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 max-w-xs truncate">
                              {order.shop_name || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 max-w-xs truncate">
                              {order.brand_name || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 max-w-xs truncate">
                              {order.payment_method || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100 max-w-xs truncate">
                              {displayName || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-100">
                              {item.quantity || 0}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-100">
                              {item.pairs_per_ctn || 0}
                            </td>
                            {/* <td className="px-4 py-3 text-sm font-medium text-blue-600 text-center border-r border-gray-100">
                              {parseInt(item.quantity || 0) *
                                parseInt(item.pairs_per_ctn || 0)}
                            </td> */}
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                              {item.commission_type === "per_piece_rate"
                                ? `Per Piece Rate (${item.commission || 0})`
                                : item.commission_type === "percentage"
                                  ? `Percentage (${item.commission || 0}%)`
                                  : "—"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-fuchsia-600 border-r border-gray-100">
                              {(() => {
                                const qty = 1;
                                const price = Number(item.price || 0);
                                const commission = Number(item.commission || 0);

                                const adminCommission =
                                  item.commission_type === "per_piece_rate"
                                    ? commission * qty
                                    : item.commission_type === "percentage"
                                      ? (price * qty * commission) / 100
                                      : 0;

                                return formatCurrency(adminCommission);
                              })()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                              {(() => {
                                const qty = 1;
                                const price = Number(item.price || 0);
                                const commission = Number(item.commission || 0);

                                const totalAmount = price * qty;

                                const adminCommission =
                                  item.commission_type === "per_piece_rate"
                                    ? commission * qty
                                    : item.commission_type === "percentage"
                                      ? (totalAmount * commission) / 100
                                      : 0;

                                const balanceAmount =
                                  totalAmount - adminCommission;

                                return formatCurrency(balanceAmount);
                              })()}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-purple-600 border-r border-gray-100">
                              {(() => {
                                const qty = Number(item.quantity || 0);
                                const pairsPerCtn = Number(
                                  item.pairs_per_ctn || 0,
                                );
                                const price = Number(item.price || 0);
                                const commission = Number(item.commission || 0);

                                const totalPairs = qty * pairsPerCtn;

                                const netTotalCommission =
                                  item.commission_type === "per_piece_rate"
                                    ? totalPairs * commission
                                    : item.commission_type === "percentage"
                                      ? (totalPairs * price * commission) / 100
                                      : 0;

                                return formatCurrency(netTotalCommission);
                              })()}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-purple-600 border-r border-gray-100">
                              {(() => {
                                const qty = Number(item.quantity || 0);
                                const pairsPerCtn = Number(
                                  item.pairs_per_ctn || 0,
                                );
                                const price = Number(item.price || 0);
                                const commission = Number(item.commission || 0);

                                const totalPairs = qty * pairsPerCtn;
                                const totalPrice = totalPairs * price;

                                const adminCommission =
                                  item.commission_type === "per_piece_rate"
                                    ? totalPairs * commission
                                    : item.commission_type === "percentage"
                                      ? (totalPrice * commission) / 100
                                      : 0;

                                const vendorAmount =
                                  totalPrice - adminCommission;

                                return formatCurrency(vendorAmount);
                              })()}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-emerald-600 border-r border-gray-100">
                              {(() => {
                                const qty = Number(item.quantity || 0);
                                const pairsPerCtn = Number(
                                  item.pairs_per_ctn || 0,
                                );
                                const price = Number(item.price || 0);

                                const totalPrice = qty * pairsPerCtn * price;

                                return formatCurrency(totalPrice);
                              })()}
                            </td>
                            {/* <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === "new" ||
                                  order.status === "paid"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : order.status === "rejected"
                                      ? "bg-rose-100 text-rose-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {order.status || "Pending"}
                              </span>
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-purple-50 border-t-2 border-purple-300">
                      <tr>
                        {/* S.No, Buyer, Brand, Payment, Display Name */}
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-sm font-bold text-right text-gray-700"
                        >
                          Order Total:
                        </td>

                        {/* CTN Qty */}
                        <td className="px-4 py-3 text-sm font-bold text-center text-blue-600">
                          {order.totals.total_ctn}
                        </td>

                        {/* Pairs/CTN */}
                        <td className="px-4 py-3"></td>

                        {/* Price/Pair */}
                        <td className="px-4 py-3"></td>

                        {/* Commission Type */}
                        <td className="px-4 py-3"></td>

                        {/* Commission Per Pair */}
                        <td className="px-4 py-3"></td>

                        {/* Settlement Per Pair */}
                        <td className="px-4 py-3"></td>

                        {/* Total Commission */}
                        <td className="px-4 py-3 text-sm font-bold text-emerald-600">
                          {formatCurrency(order.admin_commission)}
                        </td>

                        {/* Net Payable */}
                        <td className="px-4 py-3 text-sm font-bold text-fuchsia-600">
                          {formatCurrency(order.vendor_amount)}
                        </td>

                        {/* Total Amount */}
                        <td className="px-4 py-3 text-sm font-bold text-purple-600">
                          {formatCurrency(order.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Wallet size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No commission records found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
