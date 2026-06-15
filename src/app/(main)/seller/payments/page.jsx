"use client";
import { useEffect, useState } from "react";
import {
  Wallet,
  IndianRupee,
  BadgePercent,
  PackageCheck,
  RefreshCw,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function SellerPaymentsPage() {
  const [pendingData, setPendingData] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [commissionData, setCommissionData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [pendingRes, historyRes, commissionRes, monthlyRes] = await Promise.all([
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

  const handleExport = () => {
    const data = {
      pendingData,
      commissionData,
      paymentHistory,
      monthlySales,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const stats = [
    {
      title: "Pending Payout",
      value: `₹${pendingData?.total_pending_amount?.toLocaleString() || 0}`,
      icon: Wallet,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Gross Sales",
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
      case "completed":
      case "paid":
        return { label: "Completed", color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle };
      case "pending":
        return { label: "Pending", color: "bg-yellow-500/20 text-yellow-400", icon: Clock };
      case "failed":
        return { label: "Failed", color: "bg-red-500/20 text-red-400", icon: XCircle };
      default:
        return { label: status || "Processing", color: "bg-gray-500/20 text-gray-400", icon: AlertCircle };
    }
  };

  if (loading) {
    return (
      // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
       <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
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
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <Download size={16} />
            Export Report
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
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
              // className="group rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-5 shadow-lg hover:border-teal-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">{item.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">{item.value}</h2>
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

      {/* <div className="mt-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden"> */}
      <div className="mt-8 rounded-2xl bg-white border border-violet-100 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text--gray-900">Pending Payments</h2>
              <p className="text-sm text-gray-500 mt-1">Orders waiting for settlement</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <span className="text-amber-400 font-medium">
                Total: ₹{pendingData?.total_pending_amount?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">

            {/* <thead className="bg-slate-800/80 border-b border-white/10"> */}
             <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
              {/* <tr className="text-left text-sm text-gray-400"> */}
               <tr className="text-left text-xs uppercase tracking-wider text-violet-800">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Order Amount</th>
                <th className="px-6 py-4 font-semibold">Commission</th>
                <th className="px-6 py-4 font-semibold">Payout Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Order Date</th>
                <th className="px-6 py-4 font-semibold">Expected Date</th>
              </tr>
            </thead>
            {/* <tbody className="divide-y divide-white/5"> */}
            <tbody className="divide-y divide-violet-100 text-sm">
              {pendingPayments.length > 0 ? (
                pendingPayments.map((item) => (
                  <tr key={item.id} className="hover:bg-violet-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-violet-900">
                      #{item.order_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font font-medium">
                      ₹{item.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-fuchsia-600">
                      ₹{item.commission_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-teal-400">
                      ₹{item.payout_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                        <Clock size={12} />
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.order_date || item.created_at?.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-400">
                      {item.expected_payment_date || "Processing"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <Wallet size={40} className="mx-auto mb-3 text-gray-500" />
                    No pending payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Table */}
      {/* <div className="mt-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden"> */}
      <div className="mt-8 rounded-2xl bg-white border border-violet-100 shadow-lg overflow-hidden">
        {/* <div className="px-6 py-4 border-b border-white/10"> */}
        <div className="px-6 py-4 border-b border-violet-100">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          <p className="text-sm text-gray-400 mt-1">Recent transactions and settlements</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* <thead className="bg-slate-800/80 border-b border-white/10"> */}
             <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
              <tr className="text-left text-sm text-violet-800">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Commission</th>
                <th className="px-6 py-4 font-semibold">Payout</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item) => {
                  const statusBadge = getPaymentStatusBadge(item.payment_status);
                  const StatusIcon = statusBadge.icon;
                  return (
                    <tr key={item.id} className="hover:bg-violet-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text--violet-900">
                        #{item.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        ₹{item.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-fuchsia-600">
                        ₹{item.commission_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-teal-600">
                        ₹{item.payout_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusBadge.color}`}>
                          <StatusIcon size={12} />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.payment_date || item.created_at?.split(" ")[0]}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Sales Report Table */}
      {/* <div className="mt-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden"> */}

      <div className="mt-8 rounded-2xl bg-white border border-violet-100 shadow-lg overflow-hidden">
        {/* <div className="px-6 py-4 border-b border-white/10"> */}
        <div className="px-6 py-4 border-b border-violet-100">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Sales Report</h2>
          <p className="text-sm text-gray-500 mt-1">Sales and commission breakdown by month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* <thead className="bg-slate-800/80 border-b border-white/10"> */}
            <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
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
                  <tr key={index} className="hover:bg-violet-50/50 transition-colors">
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
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