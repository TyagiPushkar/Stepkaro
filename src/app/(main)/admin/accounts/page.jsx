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
  { value: "pending", label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "paid", label: "Paid", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "failed", label: "Failed", color: "bg-red-500/20 text-red-400" },
];

const getStatusBadge = (status) => {
  const found = PAYMENT_STATUSES.find((s) => s.value === status?.toLowerCase());
  return found || { label: status || "Unknown", color: "bg-gray-500/20 text-gray-400" };
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

const buildFallbackFromOrders = (dashboard, orders) => {
  const vendorMap = {};

  orders.forEach((order) => {
    const vendorId = order.vendor_id || order.owner_id || order.owner_name || "unknown";
    const key = String(vendorId);

    if (!vendorMap[key]) {
      vendorMap[key] = {
        vendor_id: order.vendor_id || order.owner_id || key,
        vendor_name: order.owner_name || "Unknown Vendor",
        business_name: order.business_name || order.owner_name || "—",
        owner_phone: order.owner_phone || "—",
        total_orders: 0,
        gross_amount: 0,
        commission_amount: 0,
        payout_amount: 0,
        paid_amount: 0,
        pending_amount: 0,
        payment_status: "pending",
        due_date: null,
        last_order_date: null,
      };
    }

    const amount = parseFloat(order.total_amount) || 0;
    const commissionRate = parseFloat(order.commission) || 10;
    const commission = (amount * commissionRate) / 100;
    const payout = amount - commission;
    const payStatus = (order.vendor_payment_status || order.payment_status || "pending").toLowerCase();

    vendorMap[key].total_orders += 1;
    vendorMap[key].gross_amount += amount;
    vendorMap[key].commission_amount += commission;
    vendorMap[key].payout_amount += payout;

    if (payStatus === "paid") {
      vendorMap[key].paid_amount += payout;
    } else {
      vendorMap[key].pending_amount += payout;
    }

    const orderDate = order.created_at?.split(" ")[0];
    if (!vendorMap[key].last_order_date || orderDate > vendorMap[key].last_order_date) {
      vendorMap[key].last_order_date = orderDate;
    }
  });

  const settlements = Object.values(vendorMap).map((v) => {
    // Determine status: paid if no pending amount, otherwise pending
    const status = v.pending_amount === 0 ? "paid" : "pending";
    return { ...v, payment_status: status, due_date: v.last_order_date };
  });

  const totalPaid = settlements.reduce((sum, v) => sum + v.paid_amount, 0);
  const totalPending = settlements.reduce((sum, v) => sum + v.pending_amount, 0);

  return {
    summary: {
      total_revenue: dashboard?.totalRevenue || 0,
      admin_revenue: dashboard?.adminRevenue || 0,
      pending_vendor_payouts: dashboard?.pendingPayments || totalPending,
      total_paid_to_vendors: totalPaid,
      total_vendors: settlements.length,
      pending_settlements: settlements.filter((v) => v.payment_status === "pending").length,
    },
    settlements,
    paymentHistory: [],
  };
};

// Demo data with clear statuses
const DEMO_ACCOUNTS_DATA = {
  summary: {
    total_revenue: 276500,
    admin_revenue: 41250,
    pending_vendor_payouts: 120000,
    total_paid_to_vendors: 155750,
    total_vendors: 5,
    pending_settlements: 2,
  },
  settlements: [
    {
      vendor_id: 101,
      vendor_name: "Neha Sharma",
      business_name: "CraftKart",
      owner_phone: "9876543210",
      total_orders: 24,
      gross_amount: 84200,
      commission_amount: 8420,
      payout_amount: 75780,
      paid_amount: 45200,
      pending_amount: 30580,
      payment_status: "pending",
      due_date: "2026-06-10",
    },
    {
      vendor_id: 102,
      vendor_name: "Amit Verma",
      business_name: "ElecHub",
      owner_phone: "9123456789",
      total_orders: 18,
      gross_amount: 62500,
      commission_amount: 6250,
      payout_amount: 56250,
      paid_amount: 56250,
      pending_amount: 0,
      payment_status: "paid",
      due_date: "2026-06-08",
    },
    {
      vendor_id: 103,
      vendor_name: "Priya Joshi",
      business_name: "HomeStyle",
      owner_phone: "9012345678",
      total_orders: 12,
      gross_amount: 35000,
      commission_amount: 3500,
      payout_amount: 31500,
      paid_amount: 0,
      pending_amount: 31500,
      payment_status: "pending",
      due_date: "2026-06-14",
    },
    {
      vendor_id: 104,
      vendor_name: "Sunil Rao",
      business_name: "FreshMart",
      owner_phone: "9988776655",
      total_orders: 20,
      gross_amount: 64500,
      commission_amount: 6450,
      payout_amount: 58050,
      paid_amount: 58050,
      pending_amount: 0,
      payment_status: "paid",
      due_date: "2026-06-09",
    },
    {
      vendor_id: 105,
      vendor_name: "Leena Patel",
      business_name: "StyleStreet",
      owner_phone: "9090909090",
      total_orders: 10,
      gross_amount: 35000,
      commission_amount: 3500,
      payout_amount: 31500,
      paid_amount: 6600,
      pending_amount: 24900,
      payment_status: "pending",
      due_date: "2026-06-12",
    },
  ],
  paymentHistory: [
    {
      id: 1,
      vendor_name: "Amit Verma",
      amount: 56250,
      payment_reference: "UTR123456",
      status: "paid",
      payment_date: "2026-06-08",
    },
    {
      id: 2,
      vendor_name: "Sunil Rao",
      amount: 58050,
      payment_reference: "UTR123457",
      status: "paid",
      payment_date: "2026-06-09",
    },
  ],
  orders: [
    {
      order_id: 1205,
      article_name: "Handmade Decor",
      owner_name: "Neha Sharma",
      business_name: "CraftKart",
      total_amount: "1800",
      commission: "10",
      vendor_payment_status: "pending",
      created_at: "2026-06-13 11:12:00",
    },
    {
      order_id: 1209,
      article_name: "Organic Spices Pack",
      owner_name: "Amit Verma",
      business_name: "ElecHub",
      total_amount: "2500",
      commission: "10",
      vendor_payment_status: "paid",
      created_at: "2026-06-11 09:05:00",
    },
    {
      order_id: 1212,
      article_name: "Luxury Bedsheet",
      owner_name: "Priya Joshi",
      business_name: "HomeStyle",
      total_amount: "4200",
      commission: "10",
      vendor_payment_status: "pending",
      created_at: "2026-06-14 14:33:00",
    },
    {
      order_id: 1215,
      article_name: "Organic Fruit Basket",
      owner_name: "Sunil Rao",
      business_name: "FreshMart",
      total_amount: "1800",
      commission: "10",
      vendor_payment_status: "paid",
      created_at: "2026-06-09 12:10:00",
    },
    {
      order_id: 1220,
      article_name: "Branded Sneakers",
      owner_name: "Leena Patel",
      business_name: "StyleStreet",
      total_amount: "7000",
      commission: "10",
      vendor_payment_status: "pending",
      created_at: "2026-06-12 16:25:00",
    },
  ],
};

export default function AdminAccountsPage() {
  const [summary, setSummary] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState("");
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

  const setDemoMode = useCallback(() => {
    setSummary(DEMO_ACCOUNTS_DATA.summary);
    setSettlements(DEMO_ACCOUNTS_DATA.settlements);
    setPaymentHistory(DEMO_ACCOUNTS_DATA.paymentHistory);
    setOrders(DEMO_ACCOUNTS_DATA.orders);
    setUsingFallback(true);
    setFallbackMessage("Showing demo accounts data because the API request failed.");
    setError(null);
  }, []);

  const fetchAccountsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const ordersRes = await fetch(`${API_BASE}/order/admin_get_orders.php`, { headers });
      const ordersData = ordersRes.ok ? await ordersRes.json() : null;
      const normalizedOrders = normalizeOrdersResponse(ordersData);
      if (normalizedOrders.length) {
        setOrders(normalizedOrders);
      }

      const [summaryRes, settlementsRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/super_admin/get_accounts_summary.php`, { headers }),
        fetch(`${API_BASE}/super_admin/get_vendor_settlements.php`, { headers }),
        fetch(`${API_BASE}/super_admin/get_payment_history.php`, { headers }),
      ]);

      const summaryData = summaryRes.ok ? await summaryRes.json() : null;
      const settlementsData = settlementsRes.ok ? await settlementsRes.json() : null;
      const historyData = historyRes.ok ? await historyRes.json() : null;

      if (summaryData?.success && settlementsData?.success) {
        setSummary(summaryData.summary);
        setSettlements(settlementsData.data || []);
        setPaymentHistory(historyData?.data || []);
        setUsingFallback(false);
        setFallbackMessage("");
        return;
      }

      const dashRes = await fetch(`${API_BASE}/super_admin/dashboard.php`, { headers });
      const dashData = dashRes.ok ? await dashRes.json() : { success: false };

      if (!dashData.success && !ordersData?.success) {
        setDemoMode();
        return;
      }

      const fallback = buildFallbackFromOrders(dashData.data || {}, ordersData?.data || []);
      setSummary(fallback.summary);
      setSettlements(fallback.settlements);
      setPaymentHistory(fallback.paymentHistory || []);
      setUsingFallback(true);
      setFallbackMessage("Showing computed data from orders — dedicated accounts API not yet available.");
    } catch (err) {
      setDemoMode();
    } finally {
      setLoading(false);
    }
  }, [headers, setDemoMode]);

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
    const loadData = async () => {
      await fetchAccountsData();
    };
    void loadData();
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
        // Local update
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

  const handleExport = () => {
    const data = {
      summary,
      settlements,
      paymentHistory,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accounts-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Report exported");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={40} className="text-teal-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading accounts data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <XCircle size={48} className="text-red-400 mx-auto mb-3" />
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchAccountsData}
          className="mt-4 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm text-white ${
            toast.type === "success"
              ? "bg-emerald-500/90"
              : toast.type === "info"
              ? "bg-blue-500/90"
              : "bg-red-500/90"
          }`}
        >
          <CheckCircle size={18} />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Accounts & Settlements</h1>
          <p className="text-gray-400 text-sm mt-1">Manage vendor payouts, revenue tracking & payment status</p>
          {usingFallback && (
            <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {fallbackMessage || "Showing computed data from orders — dedicated accounts API not yet available"}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={fetchAccountsData}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700"
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
              className="bg-slate-900/50 border border-white/10 rounded-xl p-5 hover:border-teal-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{item.title}</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{item.value}</h2>
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r ${item.color} text-white`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{summary?.total_vendors || settlements.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total Vendors</p>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {summary?.pending_settlements || settlements.filter((s) => s.payment_status === "pending").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pending Settlements</p>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {settlements.filter((s) => s.payment_status === "paid").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Paid</p>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">
            {settlements.filter((s) => s.payment_status === "failed").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Failed</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by vendor name, business, ID or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Status Filters - simplified */}
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
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : "bg-slate-800/50 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-teal-500/30" : "bg-slate-700"}`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vendor Settlements Table */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Vendor Payment Settlements</h2>
          <p className="text-sm text-gray-400 mt-1">Amount to pay each vendor, due dates & payment status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Gross Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Payout Due</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Paid</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Pending</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentSettlements.length > 0 ? (
                currentSettlements.map((item) => {
                  const badge = getStatusBadge(item.payment_status);
                  return (
                    <tr key={item.vendor_id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center">
                            <Building2 size={16} className="text-teal-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{item.business_name || item.vendor_name}</p>
                            <p className="text-xs text-gray-400">{item.vendor_name} · #{item.vendor_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.total_orders}</td>
                      <td className="px-6 py-4 text-sm text-white">{formatCurrency(item.gross_amount)}</td>
                      <td className="px-6 py-4 text-sm text-fuchsia-400">{formatCurrency(item.commission)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-teal-400">{formatCurrency(item.payout_amount)}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400">{formatCurrency(item.paid_amount)}</td>
                      <td className="px-6 py-4 text-sm text-amber-400">{formatCurrency(item.pending_amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
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
                              className="px-3 py-1.5 text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg disabled:opacity-50"
                            >
                              Pay Vendor
                            </button>
                          )}
                          <select
                            value={item.payment_status}
                            onChange={(e) => handleQuickStatusUpdate(item, e.target.value)}
                            disabled={updatingId === item.vendor_id}
                            className="bg-slate-800 border border-slate-600 text-white text-xs rounded-lg px-2 py-1.5 disabled:opacity-50"
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
                    <Wallet size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No vendor settlements found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredSettlements.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
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
                className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm bg-slate-800 text-gray-400 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-400">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm bg-slate-800 text-gray-400 rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order-wise Payouts */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Order-wise Payouts</h2>
            <p className="text-sm text-gray-400 mt-1">Per-order revenue, commission & vendor payout details</p>
          </div>
          <span className="text-sm text-gray-400">{orders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Vendor Payout</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Pay Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const fin = getOrderFinancials(order);
                  const payBadge = getStatusBadge(fin.payStatus);
                  return (
                    <tr key={order.order_id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">#{order.order_id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.created_at?.split(" ")[0] || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-35 truncate">{order.article_name || "—"}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{order.owner_name || "—"}</p>
                        <p className="text-xs text-gray-500">{order.business_name || ""}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{formatCurrency(fin.amount)}</td>
                      <td className="px-6 py-4 text-sm text-fuchsia-400">{formatCurrency(fin.commission)}</td>
                      <td className="px-6 py-4 text-sm text-teal-400 font-semibold">{formatCurrency(fin.payout)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${payBadge.color}`}>{payBadge.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
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
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-400">
                    No orders found for payout tracking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {ordersTotalPages > 1 && (
          <div className="px-6 py-3 border-t border-white/10 flex justify-center gap-2">
            <button
              onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
              disabled={ordersPage === 1}
              className="px-3 py-1.5 text-sm bg-slate-800 text-gray-400 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-400 self-center">
              {ordersPage} / {ordersTotalPages}
            </span>
            <button
              onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
              disabled={ordersPage === ordersTotalPages}
              className="px-3 py-1.5 text-sm bg-slate-800 text-gray-400 rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Payment History</h2>
          <p className="text-sm text-gray-400 mt-1">Completed vendor payout transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Amount Paid</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item, idx) => {
                  const badge = getStatusBadge(item.status || item.payment_status);
                  return (
                    <tr key={item.id || idx} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">{item.vendor_name || item.business_name}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400">{formatCurrency(item.paid_amount || item.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">{item.payment_reference || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {item.payment_date || item.created_at?.split(" ")[0] || "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    <CreditCard size={32} className="mx-auto mb-2 text-gray-600" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-md">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Pay Vendor</h2>
              <p className="text-sm text-gray-400 mt-1">{selectedSettlement.business_name || selectedSettlement.vendor_name}</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Pending Amount</p>
                  <p className="text-lg font-bold text-amber-400">{formatCurrency(selectedSettlement.pending_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Payout</p>
                  <p className="text-lg font-bold text-teal-400">{formatCurrency(selectedSettlement.payout_amount)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Payment Status</label>
                <select
                  value={payForm.status}
                  onChange={(e) => setPayForm({ ...payForm, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={payForm.paid_amount}
                  onChange={(e) => setPayForm({ ...payForm, paid_amount: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Payment Reference / UTR</label>
                <input
                  type="text"
                  value={payForm.payment_reference}
                  onChange={(e) => setPayForm({ ...payForm, payment_reference: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                  placeholder="Transaction ID or UTR number"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Payment Date</label>
                <input
                  type="date"
                  value={payForm.payment_date}
                  onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Notes (optional)</label>
                <textarea
                  value={payForm.notes}
                  onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                  rows={2}
                  placeholder="Any notes about this payment"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  disabled={updatingId === selectedSettlement.vendor_id}
                  className="flex-1 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
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