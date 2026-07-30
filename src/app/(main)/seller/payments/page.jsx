"use client";
import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Wallet,
  IndianRupee,
  BadgePercent,
  PackageCheck,
  RefreshCw,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function SellerPaymentsPage() {
  const [pendingData, setPendingData] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [commissionData, setCommissionData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter States
  const [pendingStartDate, setPendingStartDate] = useState("");
  const [pendingEndDate, setPendingEndDate] = useState("");

  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [pendingRes, historyRes, commissionRes, monthlyRes] =
        await Promise.all([
          fetch(
            "https://namami-infotech.com/Stepkaro/src/vender/get_vendor_pending_payments.php",
            { headers }
          ),
          fetch(
            "https://namami-infotech.com/Stepkaro/src/vender/get_vendor_payment_history.php",
            { headers }
          ),
          fetch(
            "https://namami-infotech.com/Stepkaro/src/vender/get_commission_report.php",
            { headers }
          ),
          fetch(
            "https://namami-infotech.com/Stepkaro/src/vender/get_monthly_sales_report.php",
            { headers }
          ),
        ]);

      const pending = await pendingRes.json();
      const history = await historyRes.json();
      const commission = await commissionRes.json();
      const monthly = await monthlyRes.json();

      if (pending.success) {
        setPendingData(pending);
        setPendingPayments(pending.data || []);
      }
      if (history.success) setPaymentHistory(history.data || []);
      if (commission.success) setCommissionData(commission.data);
      if (monthly.success) setMonthlySales(monthly.data || []);
    } catch (error) {
      console.log("Payments Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    await fetchData();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Helper function to convert YYYY-MM-DD or string dates for filtering comparisons
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const cleanDate = dateStr.split(" ")[0];
    return new Date(cleanDate);
  };

  // Filtered Pending Payments
  const filteredPendingPayments = useMemo(() => {
    return pendingPayments.filter((item) => {
      if (!item.order_date) return true;
      const itemDate = parseDate(item.order_date);

      if (pendingStartDate && itemDate < new Date(pendingStartDate)) {
        return false;
      }
      if (pendingEndDate) {
        const end = new Date(pendingEndDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }
      return true;
    });
  }, [pendingPayments, pendingStartDate, pendingEndDate]);

  // Filtered Payment History
  const filteredPaymentHistory = useMemo(() => {
    return paymentHistory.filter((item) => {
      // Status Filter
      if (
        historyStatusFilter !== "all" &&
        item.payment_status?.toLowerCase() !== historyStatusFilter.toLowerCase()
      ) {
        return false;
      }

      // Date Filter
      if (!item.order_date) return true;
      const itemDate = parseDate(item.order_date);

      if (historyStartDate && itemDate < new Date(historyStartDate)) {
        return false;
      }
      if (historyEndDate) {
        const end = new Date(historyEndDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }
      return true;
    });
  }, [paymentHistory, historyStatusFilter, historyStartDate, historyEndDate]);

  // Excel Export Handler
  const exportToExcel = (data, fileName, sheetName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Export Pending Payments
  const handleExportPending = () => {
    const exportData = filteredPendingPayments.map((item) => ({
      "Order ID": `#${item.order_id}`,
      "Order Date": item.order_date || "-",
      "Received In WR": item.created_at || "-",
      "Net Payout (₹)": item.payout_amount || 0,
      "Due Date": item.due_date || "-",
      Status: "Pending",
      "Settlement Date": item.payment_date || "-",
      "Total Amount (₹)": item.total_amount || 0,
      "UTR/Transaction ID": item.utr_no || "-",
    }));
    exportToExcel(exportData, "Pending_Payments_Report", "Pending Payments");
  };

  // Export Payment History
  const handleExportHistory = () => {
    const exportData = filteredPaymentHistory.map((item) => ({
      "Order ID": `#${item.order_id}`,
      "Order Date": item.order_date || "-",
      "Received In WR": item.created_at || "-",
      "Net Payout (₹)": item.payout_amount || 0,
      "Due Date": item.due_date || "-",
      Status: item.payment_status || "Processing",
      "Settlement Date": item.payment_date || "-",
      "Total Amount (₹)": item.total_amount || 0,
      "UTR/Transaction ID": item.utr_no || "-",
    }));
    exportToExcel(exportData, "Payment_History_Report", "Payment History");
  };

  // Export Monthly Sales Report
  const handleExportMonthly = () => {
    const exportData = monthlySales.map((item) => ({
      Month: item.month,
      Orders: item.total_orders,
      "Total Sales (₹)": item.total_sales || 0,
      "Commission (₹)": item.total_commission || 0,
      "Net Payout (₹)": item.total_payout || 0,
    }));
    exportToExcel(exportData, "Monthly_Sales_Report", "Monthly Sales");
  };

  const stats = [
    {
      title: "Pending Payout",
      value: `₹${pendingData?.total_pending_amount?.toLocaleString() || 0}`,
      icon: Wallet,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Total Sales",
      value: `₹${commissionData?.gross_sales?.toLocaleString() || 0}`,
      icon: IndianRupee,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Commission",
      value: `₹${commissionData?.total_commission?.toLocaleString() || 0}`,
      icon: BadgePercent,
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      title: "Net Payout",
      value: `₹${commissionData?.net_payout?.toLocaleString() || 0}`,
      icon: PackageCheck,
      color: "from-sky-500 to-blue-600",
    },
  ];

  const getPaymentStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          label: "Paid",
          color: "bg-emerald-500/20 text-emerald-600",
          icon: CheckCircle,
        };
      case "pending":
        return {
          label: "Pending",
          color: "bg-yellow-500/20 text-yellow-600",
          icon: Clock,
        };
      case "failed":
        return {
          label: "Failed",
          color: "bg-red-500/20 text-red-600",
          icon: XCircle,
        };
      default:
        return {
          label: status || "Processing",
          color: "bg-gray-500/20 text-gray-600",
          icon: AlertCircle,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle size={18} />
          Data refreshed successfully!
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Payments & Settlement
          </h1>
          <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
            <Calendar size={14} />
            Vendor Settlement Dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group rounded-2xl bg-white border border-violet-100 p-5 shadow-md hover:border-violet-300 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                </div>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Payments Table */}
      <div className="mt-8 rounded-2xl bg-white border border-violet-100 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-violet-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Payments
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Orders waiting for settlement
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Filters */}
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-violet-50/50 p-1.5 rounded-xl border border-violet-100">
              <span className="font-medium px-1">Order Date:</span>
              <input
                type="date"
                value={pendingStartDate}
                onChange={(e) => setPendingStartDate(e.target.value)}
                className="bg-white border border-violet-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
              />
              <span>to</span>
              <input
                type="date"
                value={pendingEndDate}
                onChange={(e) => setPendingEndDate(e.target.value)}
                className="bg-white border border-violet-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
              />
            </div>
            {/* 
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <span className="text-amber-600 text-sm font-semibold mr-2">
                Total: ₹
                {pendingData?.total_pending_amount?.toLocaleString() || 0}
              </span>
            </div> */}

            <button
              onClick={handleExportPending}
              className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 shadow-sm"
            >
              <Download size={14} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Scrollable Container with max height for ~10 rows */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 sticky top-0 z-10 shadow-sm">
              <tr className="text-left text-xs uppercase tracking-wider text-violet-800">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Order Date</th>
                <th className="px-6 py-4 font-semibold">Recived In WR</th>
                <th className="px-6 py-4 font-semibold">Net Payout</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Settlement Date</th>
                <th className="px-6 py-4 font-semibold">Total Amount</th>
                <th className="px-6 py-4 font-semibold">
                  UtR/Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100 text-sm">
              {filteredPendingPayments.length > 0 ? (
                filteredPendingPayments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-violet-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-violet-900">
                      #{item.order_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.order_date
                        ? item.order_date
                          .split(" ")[0]
                          .replace(/-/g, "/")
                          .split("/")
                          .reverse()
                          .join("/")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.created_at
                        ? item.created_at
                          .split(" ")[0]
                          .replace(/-/g, "/")
                          .split("/")
                          .reverse()
                          .join("/")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-teal-600">
                      ₹{item.payout_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-fuchsia-600">
                      {item.due_date
                        ? item.due_date
                          .split(" ")[0]
                          .replace(/-/g, "/")
                          .split("/")
                          .reverse()
                          .join("/")
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 font-medium">
                        <Clock size={12} />
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-fuchsia-600">
                      {item.payment_date
                        ? item.payment_date
                          .split(" ")[0]
                          .replace(/-/g, "/")
                          .split("/")
                          .reverse()
                          .join("/")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      ₹{item.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.utr_no || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <Wallet size={40} className="mx-auto mb-3 text-gray-400" />
                    No pending payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="mt-8 rounded-2xl bg-white border border-violet-100 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-violet-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            <p className="text-sm text-gray-400 mt-0.5">Recent transactions and settlements</p>
          </div>

          {/* Ek hi single line mein bina scroll ke layout */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-violet-50/50 px-2 py-1 rounded-xl border border-violet-100">
              <Filter size={14} className="text-violet-600 shrink-0" />
              <span className="font-medium hidden md:inline">Status:</span>
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="bg-white border border-violet-200 rounded-lg px-2 py-0.5 text-xs focus:outline-none font-medium"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-violet-50/50 px-2 py-1 rounded-xl border border-violet-100">
              <span className="font-medium hidden md:inline">Order Date:</span>
              <input
                type="date"
                value={historyStartDate}
                onChange={(e) => setHistoryStartDate(e.target.value)}
                className="bg-white border border-violet-200 rounded-lg px-1.5 py-0.5 text-xs focus:outline-none"
              />
              <span>-</span>
              <input
                type="date"
                value={historyEndDate}
                onChange={(e) => setHistoryEndDate(e.target.value)}
                className="bg-white border border-violet-200 rounded-lg px-1.5 py-0.5 text-xs focus:outline-none"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportHistory}
              className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 shadow-sm shrink-0"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Scrollable Container with max height for ~10 rows */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 sticky top-0 z-10 shadow-sm">
              <tr className="text-left text-sm text-violet-800">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Order Date</th>
                <th className="px-6 py-4 font-semibold">Recived In WR</th>
                <th className="px-6 py-4 font-semibold">Net Payout</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Settlement Date</th>
                <th className="px-6 py-4 font-semibold">Total Amount</th>
                <th className="px-6 py-4 font-semibold">
                  UtR/Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100">
              {filteredPaymentHistory.length > 0 ? (
                filteredPaymentHistory.map((item) => {
                  const statusBadge = getPaymentStatusBadge(
                    item.payment_status
                  );
                  const StatusIcon = statusBadge.icon;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-violet-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-violet-900">
                        #{item.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.order_date
                          ? item.order_date
                            .split(" ")[0]
                            .replace(/-/g, "/")
                            .split("/")
                            .reverse()
                            .join("/")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.created_at
                          ? item.created_at
                            .split(" ")[0]
                            .replace(/-/g, "/")
                            .split("/")
                            .reverse()
                            .join("/")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-teal-600">
                        ₹{item.payout_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-fuchsia-600">
                        {item.due_date
                          ? item.due_date
                            .split(" ")[0]
                            .replace(/-/g, "/")
                            .split("/")
                            .reverse()
                            .join("/")
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${statusBadge.color}`}
                        >
                          <StatusIcon size={12} />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.payment_date
                          ? item.payment_date
                            .split(" ")[0]
                            .replace(/-/g, "/")
                            .split("/")
                            .reverse()
                            .join("/")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        ₹{item.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.utr_no || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Sales Report Table */}
      <div className="mt-8 rounded-2xl bg-white border border-violet-100 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-violet-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Sales Report
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sales and commission breakdown by month
            </p>
          </div>
          <button
            onClick={handleExportMonthly}
            className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 shadow-sm"
          >
            <Download size={14} />
            Export Excel
          </button>
        </div>

        {/* Scrollable Container with max height for ~10 rows */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 sticky top-0 z-10 shadow-sm">
              <tr className="text-left text-sm text-violet-800">
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold">Orders</th>
                <th className="px-6 py-4 font-semibold">Total Sales</th>
                <th className="px-6 py-4 font-semibold">Commission</th>
                <th className="px-6 py-4 font-semibold">Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100">
              {monthlySales.length > 0 ? (
                monthlySales.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-violet-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-violet-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.total_orders}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ₹{item.total_sales?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-fuchsia-600">
                      ₹{item.total_commission?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-teal-600">
                      ₹{item.total_payout?.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No monthly sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}