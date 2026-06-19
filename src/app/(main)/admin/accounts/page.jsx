"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Wallet,
  IndianRupee,
  BadgePercent,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Calendar,
  CreditCard,
  Eye,
} from "lucide-react";
import ViewOrderDetailsModal from "@/app/components/shared/ViewOrderDetailsModal";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

// Simplified payment statuses - clear and non-overlapping
const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { value: "paid", label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-700" },
];

const getStatusBadge = (status) => {
  const found = PAYMENT_STATUSES.find((s) => s.value === status?.toLowerCase());
  return found || { label: status || "Unknown", color: "bg-gray-100 text-gray-600" };
};

const getOrderFinancials = (order) => {
  const amount = parseFloat(order.total_amount) || 0;
  const commissionRate = parseFloat(order.commission) || 10;
  const commission = (amount * commissionRate) / 100;
  const payout = amount - commission;
  const payStatus = (order.vendor_payment_status || order.payment_status || order.status || "pending").toLowerCase();
  return { amount, commission, payout, payStatus, commissionRate };
};

const normalizeAdminOrder = (order) => ({
  ...order,
  status: order.status ?? order.payment_status ?? order.vendor_payment_status ?? "pending",
  payment_status: order.payment_status ?? order.status ?? order.vendor_payment_status ?? "pending",
  vendor_payment_status: order.vendor_payment_status ?? order.payment_status ?? order.status ?? "pending",
  items: order.items ?? [],
  article_name: order.article_name ?? order.product_name ?? order.name ?? "—",
  business_name: order.business_name ?? order.vendor_business_name ?? "—",
  owner_name: order.owner_name ?? order.vendor_name ?? "—",
  owner_phone: order.owner_phone ?? order.vendor_phone ?? "—",
  user_name: order.user_name ?? order.customer_name ?? "—",
  user_phone: order.user_phone ?? order.customer_phone ?? "—",
  product_image: order.product_image ?? order.image ?? "",
});

const normalizeOrdersResponse = (payload) => {
  const list = payload?.data ?? payload?.orders ?? payload ?? [];
  return Array.isArray(list) ? list.map(normalizeAdminOrder) : [];
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function AdminAccountsPage() {
  const [summary, setSummary] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [updatingId, setUpdatingId] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [payForm, setPayForm] = useState({
    status: "paid",
    paid_amount: "",
    payment_reference: "",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 8;

  const token = useMemo(
    () => (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : ""),
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

  const fetchAccountsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders
      const ordersRes = await fetch(`${API_BASE}/order/admin_get_orders.php`, { headers });
      if (!ordersRes.ok) {
        throw new Error("Failed to fetch orders");
      }
      const ordersData = await ordersRes.json();
      const normalizedOrders = normalizeOrdersResponse(ordersData);
      if (normalizedOrders.length) {
        setOrders(normalizedOrders);
      }

      // Fetch accounts data
      const [summaryRes, settlementsRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/super_admin/get_accounts_summary.php`, { headers }),
        fetch(`${API_BASE}/super_admin/get_vendor_settlements.php`, { headers }),
        fetch(`${API_BASE}/super_admin/get_payment_history.php`, { headers }),
      ]);

      if (!summaryRes.ok || !settlementsRes.ok) {
        throw new Error("Failed to fetch accounts data");
      }

      const summaryData = await summaryRes.json();
      const settlementsData = await settlementsRes.json();
      const historyData = historyRes.ok ? await historyRes.json() : null;

      if (!summaryData?.success || !settlementsData?.success) {
        throw new Error(summaryData?.message || "Failed to fetch accounts data");
      }

      setSummary(summaryData.summary);
      setSettlements(settlementsData.data || []);
      setPaymentHistory(historyData?.data || []);
      setError(null);

    } catch (err) {
      console.error("Error fetching accounts data:", err);
      setError(err.message || "Failed to load accounts data");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ordersPerPage;
    return orders.slice(start, start + ordersPerPage);
  }, [orders, ordersPage]);

  const ordersTotalPages = Math.ceil(orders.length / ordersPerPage);

  useEffect(() => {
    fetchAccountsData();
  }, [fetchAccountsData]);

  const stats = [
    {
      title: "Total Revenue",
      subtitle: "Amount received from orders",
      value: formatCurrency(summary?.total_revenue),
      icon: IndianRupee,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Admin Revenue",
      subtitle: "Platform commission earned",
      value: formatCurrency(summary?.admin_revenue),
      icon: BadgePercent,
      color: "from-purple-500 to-fuchsia-600",
    },
    {
      title: "Pending Vendor Payouts",
      subtitle: "Amount to pay vendors",
      value: formatCurrency(summary?.pending_vendor_payouts),
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Paid to Vendors",
      subtitle: "Total settled amount",
      value: formatCurrency(summary?.total_paid_to_vendors),
      icon: Wallet,
      color: "from-sky-500 to-blue-600",
    },
  ];

  const filters = useMemo(
    () => [
      { label: "All", value: "all", count: settlements.length },
      {
        label: "Pending",
        value: "pending",
        count: settlements.filter((s) => s.payment_status === "pending").length,
      },
      {
        label: "Paid",
        value: "paid",
        count: settlements.filter((s) => s.payment_status === "paid").length,
      },
      {
        label: "Failed",
        value: "failed",
        count: settlements.filter((s) => s.payment_status === "failed").length,
      },
    ],
    [settlements],
  );

  const filteredSettlements = useMemo(() => {
    let list = settlements;

    if (statusFilter !== "all") {
      list = list.filter((s) => s.payment_status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.vendor_name?.toLowerCase().includes(q) ||
          s.business_name?.toLowerCase().includes(q) ||
          s.vendor_id?.toString().includes(q) ||
          s.owner_phone?.includes(q),
      );
    }

    return list;
  }, [settlements, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSettlements = filteredSettlements.slice(startIndex, startIndex + itemsPerPage);

  const openPayModal = (settlement) => {
    setSelectedSettlement(settlement);
    setPayForm({
      status: "paid",
      paid_amount: settlement.pending_amount?.toString() || "",
      payment_reference: "",
      payment_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setShowPayModal(true);
  };

  const handleUpdatePayment = async () => {
    if (!selectedSettlement) return;

    setUpdatingId(selectedSettlement.vendor_id);

    try {
      const payload = {
        vendor_id: selectedSettlement.vendor_id,
        status: payForm.status,
        paid_amount: parseFloat(payForm.paid_amount) || 0,
        payment_reference: payForm.payment_reference,
        payment_date: payForm.payment_date,
        notes: payForm.notes,
      };

      const response = await axios.post(
        `${API_BASE}/super_admin/update_vendor_payment_status.php`,
        payload,
        { headers },
      );

      if (response.data?.success) {
        showToast("Payment status updated successfully");
        setShowPayModal(false);
        fetchAccountsData();
      } else {
        const paidAmt = parseFloat(payForm.paid_amount) || 0;
        setSettlements((prev) =>
          prev.map((s) => {
            if (s.vendor_id !== selectedSettlement.vendor_id) return s;
            const newPaid = s.paid_amount + paidAmt;
            const newPending = Math.max(0, s.pending_amount - paidAmt);
            return {
              ...s,
              payment_status: newPending === 0 ? "paid" : "pending",
              paid_amount: newPaid,
              pending_amount: newPending,
            };
          }),
        );
        showToast("Status updated locally (API pending backend setup)", "info");
        setShowPayModal(false);
      }
    } catch {
      const paidAmt = parseFloat(payForm.paid_amount) || 0;
      setSettlements((prev) =>
        prev.map((s) => {
          if (s.vendor_id !== selectedSettlement.vendor_id) return s;
          const newPaid = s.paid_amount + paidAmt;
          const newPending = Math.max(0, s.pending_amount - paidAmt);
          return {
            ...s,
            payment_status: newPending === 0 ? "paid" : "pending",
            paid_amount: newPaid,
            pending_amount: newPending,
          };
        }),
      );
      showToast("Status updated locally", "info");
      setShowPayModal(false);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuickStatusUpdate = async (settlement, newStatus) => {
    setUpdatingId(settlement.vendor_id);
    try {
      await axios.post(
        `${API_BASE}/super_admin/update_vendor_payment_status.php`,
        { vendor_id: settlement.vendor_id, status: newStatus },
        { headers },
      );
    } catch {
      /* local fallback */
    }
    setSettlements((prev) =>
      prev.map((s) =>
        s.vendor_id === settlement.vendor_id
          ? { ...s, payment_status: newStatus }
          : s,
      ),
    );
    showToast(`Status updated to ${newStatus}`);
    setUpdatingId(null);
  };

  // ========== EXPORT FUNCTIONALITY ==========
  const handleExportCSV = () => {
    // Export Settlements
    const settlementHeaders = [
      "Vendor ID",
      "Vendor Name",
      "Business Name",
      "Phone",
      "Total Orders",
      "Gross Amount",
      "Commission",
      "Payout Due",
      "Paid Amount",
      "Pending Amount",
      "Payment Status",
      "Due Date"
    ];

    const settlementRows = settlements.map((s) => [
      s.vendor_id || "",
      s.vendor_name || "",
      s.business_name || "",
      s.owner_phone || "",
      s.total_orders || 0,
      s.gross_amount || 0,
      s.commission || 0,
      s.payout_amount || 0,
      s.paid_amount || 0,
      s.pending_amount || 0,
      s.payment_status || "",
      s.due_date || ""
    ]);

    const settlementCSV = [settlementHeaders, ...settlementRows]
      .map((row) => row.join(","))
      .join("\n");

    // Export Orders
    const orderHeaders = [
      "Order ID",
      "Article Name",
      "Vendor Name",
      "Business Name",
      "Total Amount",
      "Commission",
      "Vendor Payout",
      "Payment Status",
      "Created Date"
    ];

    const orderRows = orders.map((o) => [
      o.order_id || "",
      o.article_name || "",
      o.owner_name || "",
      o.business_name || "",
      o.total_amount || 0,
      o.commission || 0,
      (parseFloat(o.total_amount || 0) - (parseFloat(o.total_amount || 0) * parseFloat(o.commission || 10) / 100)) || 0,
      o.vendor_payment_status || o.payment_status || "",
      o.created_at?.split(" ")[0] || ""
    ]);

    const orderCSV = [orderHeaders, ...orderRows]
      .map((row) => row.join(","))
      .join("\n");

    // Export Payment History
    const historyHeaders = [
      "Vendor Name",
      "Amount Paid",
      "Payment Reference",
      "Status",
      "Payment Date"
    ];

    const historyRows = paymentHistory.map((h) => [
      h.vendor_name || "",
      h.paid_amount || h.amount || 0,
      h.payment_reference || "",
      h.status || "",
      h.payment_date || ""
    ]);

    const historyCSV = [historyHeaders, ...historyRows]
      .map((row) => row.join(","))
      .join("\n");

    // Combine all exports into one file
    const fullCSV = [
      "=== VENDOR SETTLEMENTS ===",
      settlementCSV,
      "",
      "=== ORDER PAYOUTS ===",
      orderCSV,
      "",
      "=== PAYMENT HISTORY ===",
      historyCSV
    ].join("\n");

    const blob = new Blob([fullCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accounts_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Accounts report exported successfully");
  };

  // ========== EXPORT SETTLEMENTS ONLY ==========
  const handleExportSettlementsOnly = () => {
    const headers = [
      "Vendor ID",
      "Vendor Name",
      "Business Name",
      "Phone",
      "Total Orders",
      "Gross Amount",
      "Commission",
      "Payout Due",
      "Paid Amount",
      "Pending Amount",
      "Payment Status",
      "Due Date"
    ];

    const rows = settlements.map((s) => [
      s.vendor_id || "",
      s.vendor_name || "",
      s.business_name || "",
      s.owner_phone || "",
      s.total_orders || 0,
      s.gross_amount || 0,
      s.commission || 0,
      s.payout_amount || 0,
      s.paid_amount || 0,
      s.pending_amount || 0,
      s.payment_status || "",
      s.due_date || ""
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settlements_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Settlements exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={40} className="text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading accounts data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-500 font-medium">Error loading accounts data</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={fetchAccountsData}
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
          <CheckCircle size={18} />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts & Settlements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage vendor payouts, revenue tracking & payment status</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportSettlementsOnly}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-purple-300"
          >
            <Download size={16} />
            Export Settlements
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-purple-50 px-4 py-2 text-sm text-purple-600 hover:bg-purple-100 hover:border-purple-300"
          >
            <Download size={16} />
            Full Report
          </button>
          <button
            onClick={fetchAccountsData}
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
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">{item.value}</h2>
                  <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${item.color} text-white`}>
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
          <p className="text-2xl font-bold text-gray-900">{summary?.total_vendors || settlements.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Vendors</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-amber-600">
            {summary?.pending_settlements || settlements.filter((s) => s.payment_status === "pending").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending Settlements</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-emerald-600">
            {settlements.filter((s) => s.payment_status === "paid").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Paid</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-gray-500">
            {settlements.filter((s) => s.payment_status === "failed").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Failed</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by vendor name, business, ID or phone..."
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
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isActive ? "bg-purple-500/30 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vendor Settlements Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Vendor Payment Settlements</h2>
          <p className="text-sm text-gray-500 mt-1">Amount to pay each vendor, due dates & payment status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout Due</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentSettlements.length > 0 ? (
                currentSettlements.map((item) => {
                  const badge = getStatusBadge(item.payment_status);
                  return (
                    <tr key={item.vendor_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Building2 size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.business_name || item.vendor_name}</p>
                            <p className="text-xs text-gray-500">{item.vendor_name} · #{item.vendor_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.total_orders}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(item.gross_amount)}</td>
                      <td className="px-6 py-4 text-sm text-fuchsia-600">{formatCurrency(item.commission)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-600">{formatCurrency(item.payout_amount)}</td>
                      <td className="px-6 py-4 text-sm text-emerald-600">{formatCurrency(item.paid_amount)}</td>
                      <td className="px-6 py-4 text-sm text-amber-600">{formatCurrency(item.pending_amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {item.due_date || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {item.payment_status === "pending" && (
                            <button
                              onClick={() => openPayModal(item)}
                              disabled={updatingId === item.vendor_id}
                              className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
                            >
                              Pay Vendor
                            </button>
                          )}
                          <select
                            value={item.payment_status}
                            onChange={(e) => handleQuickStatusUpdate(item, e.target.value)}
                            disabled={updatingId === item.vendor_id}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1.5 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            {PAYMENT_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <Wallet size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No vendor settlements found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredSettlements.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSettlements.length)} of{" "}
              {filteredSettlements.length} vendors
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

      {/* Order-wise Payouts */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Order-wise Payouts</h2>
            <p className="text-sm text-gray-500 mt-1">Per-order revenue, commission & vendor payout details</p>
          </div>
          <span className="text-sm text-gray-500">{orders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Payout</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const fin = getOrderFinancials(order);
                  const payBadge = getStatusBadge(fin.payStatus);
                  return (
                    <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">#{order.order_id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.created_at?.split(" ")[0] || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-35 truncate">{order.article_name || "—"}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{order.owner_name || "—"}</p>
                        <p className="text-xs text-gray-500">{order.business_name || ""}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(fin.amount)}</td>
                      <td className="px-6 py-4 text-sm text-fuchsia-600">{formatCurrency(fin.commission)}</td>
                      <td className="px-6 py-4 text-sm text-purple-600 font-semibold">{formatCurrency(fin.payout)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${payBadge.color}`}>{payBadge.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Order Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                    No orders found for payout tracking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {ordersTotalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
              disabled={ordersPage === 1}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 self-center">
              {ordersPage} / {ordersTotalPages}
            </span>
            <button
              onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
              disabled={ordersPage === ordersTotalPages}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Payment History</h2>
          <p className="text-sm text-gray-500 mt-1">Completed vendor payout transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item, idx) => {
                  const badge = getStatusBadge(item.status || item.payment_status);
                  return (
                    <tr key={item.id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.vendor_name || item.business_name}</td>
                      <td className="px-6 py-4 text-sm text-emerald-600">{formatCurrency(item.paid_amount || item.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.payment_reference || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.payment_date || item.created_at?.split(" ")[0] || "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <CreditCard size={32} className="mx-auto mb-2 text-gray-300" />
                    No payment history yet — payments will appear here after vendor settlements
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Vendor Modal */}
      {showPayModal && selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pay Vendor</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedSettlement.business_name || selectedSettlement.vendor_name}</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Pending Amount</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(selectedSettlement.pending_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Payout</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(selectedSettlement.payout_amount)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Payment Status</label>
                <select
                  value={payForm.status}
                  onChange={(e) => setPayForm({ ...payForm, status: e.target.value })}
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
                <label className="text-sm text-gray-600 block mb-1">Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={payForm.paid_amount}
                  onChange={(e) => setPayForm({ ...payForm, paid_amount: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Payment Reference / UTR</label>
                <input
                  type="text"
                  value={payForm.payment_reference}
                  onChange={(e) => setPayForm({ ...payForm, payment_reference: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Transaction ID or UTR number"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Payment Date</label>
                <input
                  type="date"
                  value={payForm.payment_date}
                  onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Notes (optional)</label>
                <textarea
                  value={payForm.notes}
                  onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                  placeholder="Any notes about this payment"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  disabled={updatingId === selectedSettlement.vendor_id}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {updatingId === selectedSettlement.vendor_id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ViewOrderDetailsModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        order={selectedOrder}
        variant="admin"
        showFinancials={true}
        token={token}
      />
    </div>
  );
}