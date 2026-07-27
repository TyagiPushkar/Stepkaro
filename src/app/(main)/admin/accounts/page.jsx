"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import CommissionReport from "../../../components/acc_comp/commsion_report";
import {
  Wallet,
  IndianRupee,
  BadgePercent,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

// Simplified payment statuses - clear and non-overlapping
const PAYMENT_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "paid", label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  { value: "rejected", label: "Rejected", color: "bg-rose-100 text-rose-700" },
];

const getStatusBadge = (status) => {
  const found = PAYMENT_STATUSES.find((s) => s.value === status?.toLowerCase());
  return (
    found || { label: status || "Unknown", color: "bg-gray-100 text-gray-600" }
  );
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function AdminAccountsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [updatingId, setUpdatingId] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payForm, setPayForm] = useState({
    status: "paid",
    payment_date: "", // ← Always empty string, never undefined
    reject_reason: "",
    utr_no: "",
  });
  const token = useMemo(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("access_token") || ""
        : "",
    [],
  );

  const headers = useMemo(
    () => ({
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    }),
    [token],
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE}/payment/order_list_payout.php`,
        { headers },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      if (data.success) {
        console.log(data.data);
        setPayments(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalOrders = payments.length;
    const totalRevenue = payments.reduce(
      (sum, p) => sum + parseFloat(p.total_amount || 0),
      0,
    );
    const totalCommission = payments.reduce(
      (sum, p) => sum + parseFloat(p.commission_amount || 0),
      0,
    );
    const totalPayout = payments.reduce(
      (sum, p) => sum + parseFloat(p.payout_amount || 0),
      0,
    );
    const pendingPayout = payments
      .filter((p) => p.payment_status === "pending")
      .reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0);
    const paidPayout = payments
      .filter((p) => p.payment_status === "paid")
      .reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0);
    const rejectedPayout = payments
      .filter((p) => p.payment_status === "rejected")
      .reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0);

    return {
      totalOrders,
      totalRevenue,
      totalCommission,
      totalPayout,
      pendingPayout,
      paidPayout,
      rejectedPayout,
      pendingCount: payments.filter((p) => p.payment_status === "pending")
        .length,
      paidCount: payments.filter((p) => p.payment_status === "paid").length,
      rejectedCount: payments.filter((p) => p.payment_status === "rejected")
        .length,
    };
  }, [payments]);

  const stats = [
    {
      title: "Total Revenue",
      subtitle: "All orders total amount",
      value: formatCurrency(summary.totalRevenue),
      icon: IndianRupee,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Commission",
      subtitle: "Platform commission earned",
      value: formatCurrency(summary.totalCommission),
      icon: BadgePercent,
      color: "from-purple-500 to-fuchsia-600",
    },
    {
      title: "Pending Payouts",
      subtitle: `₹${summary.pendingCount} orders pending`,
      value: formatCurrency(summary.pendingPayout),
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Paid to Vendors",
      subtitle: `₹${summary.paidCount} orders paid`,
      value: formatCurrency(summary.paidPayout),
      icon: Wallet,
      color: "from-sky-500 to-blue-600",
    },
  ];

  const filters = useMemo(
    () => [
      { label: "All", value: "all", count: payments.length },
      {
        label: "Pending",
        value: "pending",
        count: payments.filter((p) => p.payment_status === "pending").length,
      },
      {
        label: "Paid",
        value: "paid",
        count: payments.filter((p) => p.payment_status === "paid").length,
      },
      {
        label: "Rejected",
        value: "rejected",
        count: payments.filter((p) => p.payment_status === "rejected").length,
      },
    ],
    [payments],
  );

  const filteredPayments = useMemo(() => {
    let list = payments;

    if (statusFilter !== "all") {
      list = list.filter((p) => p.payment_status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.vendor_id?.toString().includes(q) ||
          p.order_id?.toString().includes(q) ||
          p.id?.toString().includes(q),
      );
    }

    return list;
  }, [payments, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openPayModal = (payment) => {
    setSelectedPayment(payment);
    setPayForm({
      status: payment.payment_status === "paid" ? "paid" : "pending",
      payment_date: "", // ✅ Always empty string, never undefined
      reject_reason: "",
      utr_no: payment.utr_no || "",
    });
    setShowPayModal(true);
  };

  const handleUpdatePayment = async () => {
    if (!selectedPayment) return;

    setUpdatingId(selectedPayment.id);

    try {
      const payload = {
        payment_id: selectedPayment.id,
        status: payForm.status,
        payment_date: payForm.payment_date,
        utr_no: payForm.status === "paid" ? payForm.utr_no : "",
        reject_reason:
          payForm.status === "rejected" ? payForm.reject_reason : "",
      };

      const response = await axios.post(
        `${API_BASE}/payment/paid_to_vendor.php`,
        payload,
        { headers },
      );

      if (response.data?.success) {
        showToast("Payment status updated successfully");
        setShowPayModal(false);

        // Update local state
        setPayments((prev) =>
          prev.map((item) =>
            item.id === selectedPayment.id
              ? {
                  ...item,
                  payment_status: payForm.status,
                  utr_no: payForm.status === "paid" ? payForm.utr_no : "",
                  payment_date: payForm.payment_date,
                  reject_reason:
                    payForm.status === "rejected" ? payForm.reject_reason : "",
                }
              : item,
          ),
        );
      } else {
        throw new Error(response.data?.message || "Failed to update payment");
      }
    } catch (err) {
      console.error("Error updating payment:", err);
      showToast(err.message || "Failed to update payment", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuickStatusUpdate = async (payment, newStatus) => {
    setUpdatingId(payment.id);
    try {
      const payload = {
        payment_id: payment.id,
        status: newStatus,
        utr_no:
          newStatus === "paid" ? payment.utr_no || "TXN" + Date.now() : "",
      };

      const response = await axios.post(
        `${API_BASE}/payment/paid_to_vendor.php`,
        payload,
        { headers },
      );

      if (response.data?.success) {
        showToast(`Status updated to ${newStatus}`);
        setPayments((prev) =>
          prev.map((item) =>
            item.id === payment.id
              ? {
                  ...item,
                  payment_status: newStatus,
                  utr_no:
                    newStatus === "paid"
                      ? payment.utr_no || "TXN" + Date.now()
                      : "",
                  payment_date:
                    newStatus === "paid" ? new Date().toISOString() : null,
                }
              : item,
          ),
        );
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Payment ID",
      "Order ID",
      "Order Date",
      "Recevied in WR Date",
      "Due Date",
      "Brand Name",
      "Business Name",
      "Total Amount",
      "Commission",
      "Payout Amount",
      "Payment Date",
      "UTR No",
      "Payment Status",
      // "Status of Payment",
      // "Created At",
    ];

    const rows = filteredPayments.map((p) => [
      p.id || "",
      p.order_id || "",
      p.order_date || "",
      p.created_at || "",
      p.due_date || "",
      p.brand_name || "",
      p.business_name || "",
      p.total_amount || 0,
      p.commission_amount || 0,
      p.payout_amount || 0,
      p.payment_date || "",
      p.utr_no || "",
      p.payment_status || "",
      // p.status || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Payments exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-3"
          />
          <p className="text-gray-500">Loading payments data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-500 font-medium">Error loading payments</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={fetchPayments}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm text-white ${
            toast.type === "success"
              ? "bg-emerald-500"
              : toast.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Payments</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage vendor payout status for each order
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-purple-300"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-purple-300"
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
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r ${item.color} text-white`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-gray-900">
            {summary.totalOrders}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-amber-600">
            {summary.pendingCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-emerald-600">
            {summary.paidCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Paid</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-rose-600">
            {summary.rejectedCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Rejected</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
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
          placeholder="Search by Payment ID, Order ID or Vendor ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = statusFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {filter.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? "bg-purple-500/30 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Records
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage payment status for each vendor order
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recevied in WR Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor ID
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Payout
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  utr no
                </th>
                {payments.some((p) => p.payment_status === "rejected") && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reject Reason
                  </th>
                )}

                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPayments.length > 0 ? (
                currentPayments.map((payment) => {
                  const badge = getStatusBadge(payment.payment_status);
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        #{payment.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        #{payment.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.order_date
                          ? new Date(payment.order_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.due_date
                          ? new Date(payment.due_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.brand_name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.business_name || "—"}
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Building2 size={14} className="text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            #{payment.vendor_id}
                          </span>
                        </div>
                      </td> */}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(payment.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-fuchsia-600">
                        {formatCurrency(payment.commission_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                        {formatCurrency(payment.payout_amount)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.payment_date
                          ? new Date(payment.payment_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.utr_no || "—"}
                      </td>
                      {/* ✅ Fixed: Show reject reason only if present */}
                      {payments.some(
                        (p) => p.payment_status === "rejected",
                      ) && (
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {payment.reject_reason || "—"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPayModal(payment)}
                            disabled={updatingId === payment.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                          >
                            {payment.payment_status === "pending"
                              ? "Pay / Reject"
                              : payment.payment_status}
                          </button>
                          {/* <select
                            value={payment.payment_status}
                            onChange={(e) =>
                              handleQuickStatusUpdate(payment, e.target.value)
                            }
                            disabled={updatingId === payment.id}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1.5 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select> */}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Wallet size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No payment records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of{" "}
              {filteredPayments.length} payments
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

      {/* Commission Report Tab */}
      {/* <div className="mt-6"> */}
        {/* <div className="border-b border-gray-200">
          <nav className="flex gap-1" aria-label="Tabs">
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-purple-600 text-purple-600">
              Payment Records
            </button>
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Commission Report
            </button>
          </nav>
        </div> */}

        {/* Show Commission Report */}
        {/* <div className="mt-4">
          <CommissionReport />
        </div> */}
      {/* </div> */}

      {/* Payment Modal */}
      {showPayModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Update Payment Status
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Order #{selectedPayment.order_id} | Vendor #
                {selectedPayment.vendor_id}
              </p>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(selectedPayment.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payout Amount</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(selectedPayment.payout_amount)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Payment Status
                </label>
                <select
                  value={payForm.status}
                  onChange={(e) =>
                    setPayForm({ ...payForm, status: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {payForm.status === "paid" && (
                  <label className="text-sm text-gray-600 block mb-1">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                )}
                {payForm.status === "rejected" && (
                  <label className="text-sm text-gray-600 block mb-1">
                    Rejected Date <span className="text-red-500">*</span>
                  </label>
                )}
                <input
                  type="date"
                  value={payForm.payment_date}
                  onChange={(e) =>
                    setPayForm({ ...payForm, payment_date: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {!payForm.payment_date && (
                  <p className="mt-1 text-xs text-amber-600">
                    Payment date is required
                  </p>
                )}
              </div>
              {payForm.status === "paid" && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    UTR / Transaction Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payForm.utr_no}
                    onChange={(e) =>
                      setPayForm({ ...payForm, utr_no: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter UTR number"
                  />
                  {!payForm.utr_no.trim() && (
                    <p className="mt-1 text-xs text-amber-600">
                      UTR is required for paid status
                    </p>
                  )}
                </div>
              )}

              {payForm.status === "rejected" && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Reject Reason <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payForm.reject_reason}
                    onChange={(e) =>
                      setPayForm({ ...payForm, reject_reason: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter reject reason"
                  />
                  {!payForm.reject_reason && (
                    <p className="mt-1 text-xs text-amber-600">
                      Reject reason is required for rejected status
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  disabled={
                    updatingId === selectedPayment.id ||
                    (payForm.status === "paid" && !payForm.utr_no.trim())
                  }
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {updatingId === selectedPayment.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
