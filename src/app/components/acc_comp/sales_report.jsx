"use client";

import { useMemo, useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wallet,
  Printer,
  Download,
  Search,
  Calendar,
  X,
  TrendingUp,
  ShoppingBag,
  FileSpreadsheet,
  FileDown,
  Filter,
  Eye,
} from "lucide-react";
import * as XLSX from "xlsx";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function SalesReport({
  orders = [],
  loading = false,
  error = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const tableRef = useRef(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let list = orders;

    if (startDate) {
      list = list.filter((order) => {
        const date = new Date(order.order_date || order.created_at);
        return date >= new Date(startDate);
      });
    }
    if (endDate) {
      list = list.filter((order) => {
        const date = new Date(order.order_date || order.created_at);
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
          order.shop_name?.toLowerCase().includes(q) ||
          order.display_name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [orders, searchQuery, startDate, endDate]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalOrders = new Set(filteredOrders.map((o) => o.order_id)).size;
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + parseFloat(o.total_amount || 0),
      0,
    );
    const totalItems = filteredOrders.length;
    const totalCtn = filteredOrders.reduce(
      (sum, o) => sum + parseInt(o.total_quantity || 0),
      0,
    );
    const totalCommission = filteredOrders.reduce(
      (sum, o) => sum + parseFloat(o.admin_commission || 0),
      0,
    );
    const totalVendorAmount = filteredOrders.reduce(
      (sum, o) => sum + parseFloat(o.vendor_amount || 0),
      0,
    );

    return {
      totalOrders,
      totalRevenue,
      totalItems,
      totalCtn,
      totalCommission,
      totalVendorAmount,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }, [filteredOrders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const headers = [
      "S.No",
      "Order ID",
      "Order Date",
      "Shop Name",
      "Brand Name",
      "Total CTN",
      "Payment Mode",
      "Total Amount (₹)",
      "Commission (₹)",
      "Amount Payable (₹)",
      "Status",
    ];

    const rows = filteredOrders.map((item, index) => [
      index + 1,
      item.order_id || "",
      item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-GB")
        : "",
      item.shop_name || "",
      item.brand_name || "",
      item.total_quantity || 0,
      item.payment_method || "",
      Number(item.total_amount || 0),
      Number(item.admin_commission || 0),
      Number(item.vendor_amount || 0),
      item.status || "Pending",
    ]);

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws["!cols"] = [
      { wch: 6 }, // S.No
      { wch: 12 }, // Order ID
      { wch: 15 }, // Order Date
      { wch: 20 }, // Shop Name
      { wch: 20 }, // Brand Name
      { wch: 12 }, // Total CTN
      { wch: 15 }, // Payment Mode
      { wch: 18 }, // Total Amount
      { wch: 18 }, // Commission
      { wch: 18 }, // Amount Payable
      { wch: 12 }, // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    // Add summary sheet
    const summaryData = [
      ["Sales Report Summary"],
      [""],
      ["Metric", "Value"],
      ["Total Orders", summary.totalOrders],
      ["Total Revenue", summary.totalRevenue],
      ["Total CTN", summary.totalCtn],
      ["Total Commission", summary.totalCommission],
      ["Total Amount Payable", summary.totalVendorAmount],
      ["Average Order Value", summary.avgOrderValue],
      ["Total Records", filteredOrders.length],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    XLSX.writeFile(
      wb,
      `sales_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Order Date",
      "Shop Name",
      "Brand Name",
      "Total CTN",
      "Payment Mode",
      "Total Amount",
      "Commission",
      "Amount Payable",
      "Status",
    ];

    const rows = filteredOrders.map((item) => [
      item.order_id || "",
      item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-GB")
        : "",
      item.shop_name || "",
      item.brand_name || "",
      item.total_quantity || 0,
      item.payment_method || "",
      item.total_amount || 0,
      item.admin_commission || 0,
      item.vendor_amount || 0,
      item.status || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  // Check if filters are active
  const isFilterActive = () => {
    return startDate || endDate || searchQuery;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        <Loader2
          size={32}
          className="mx-auto mb-3 text-purple-600 animate-spin"
        />
        <p className="text-gray-500">Loading sales records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        <p className="text-red-500 font-medium">Unable to load sales records</p>
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
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-gray-900">
            {summary.totalOrders}
          </p>
          <p className="text-xs text-gray-500">Total Orders</p>
        </div>
        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">{summary.totalCtn}</p>
          <p className="text-xs text-gray-500">Total CTN</p>
        </div> */}
        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-fuchsia-600">
            {formatCurrency(summary.totalCommission)}
          </p>
          <p className="text-xs text-gray-500">Total Commission</p>
        </div> */}
        {/* <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(summary.avgOrderValue)}
          </p>
          <p className="text-xs text-gray-500">Avg Order Value</p>
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
            placeholder="Search by Order ID, Brand, Shop, Product..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Filter Toggle Button */}
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

          {/* Export Buttons */}
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
            {/* <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Print</span>
            </button> */}
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
            {filteredOrders.length} records found
          </span>
        </div>
      )}

      {/* Sales Table - Excel Style */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={20} className="text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">
              Sales Data
            </span>
            <span className="text-xs text-gray-400">
              {filteredOrders.length} rows
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="text-xs bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition-colors flex items-center gap-1"
            >
              <FileSpreadsheet size={14} />
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Order Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Shop
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Total CTN
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Payment Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Amount Payable
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((item, index) => {
                  const serialNo = startIndex + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500 border-r border-gray-100">
                        {serialNo}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600 border-r border-gray-100">
                        #{item.order_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-r border-gray-100">
                        {item.shop_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-r border-gray-100">
                        {item.brand_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-100">
                        {item.total_quantity || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {item.payment_method || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-600 border-r border-gray-100">
                        {formatCurrency(item.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-fuchsia-600 border-r border-gray-100">
                        {formatCurrency(item.admin_commission)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-600 border-r border-gray-100">
                        {formatCurrency(item.vendor_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            item.status === "new" || item.status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "rejected"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center">
                    <ShoppingBag
                      size={48}
                      className="text-gray-300 mx-auto mb-3"
                    />
                    <p className="text-gray-500">No sales records found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            {/* Excel-style Footer with Totals */}
            {filteredOrders.length > 0 && (
              <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-3 text-sm font-bold text-gray-700 text-right"
                  >
                    Grand Total:
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-emerald-600">
                    {formatCurrency(summary.totalRevenue)}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-fuchsia-600">
                    {formatCurrency(summary.totalCommission)}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-purple-600">
                    {formatCurrency(summary.totalVendorAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {filteredOrders.length} records
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} records
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
