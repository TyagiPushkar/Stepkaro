"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Loader2,
  XCircle,
  RefreshCw,
  FileText,
  TrendingUp,
} from "lucide-react";
import CommissionReport from "@/app/components/acc_comp/commsion_report";
import SalesReport from "@/app/components/acc_comp/sales_report";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

export default function ReportPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("commission");

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

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/report/get_report.php`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      if (data.success) {
        // console.log("Fetched orders:", data.data);
        setOrders(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-3"
          />
          <p className="text-gray-500">Loading reports data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-500 font-medium">Error loading reports</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={fetchOrders}
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">
            View commission and sales reports
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-purple-300"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-xl">
        <nav className="flex gap-1 px-4" aria-label="Reports Tabs">
          <button
            onClick={() => setActiveTab("commission")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "commission"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            <FileText size={18} />
            Commission Report
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "sales"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            <TrendingUp size={18} />
            Sales Report
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
              {orders.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Report Content */}
      <div className="mt-4">
        {activeTab === "commission" ? (
          <CommissionReport orders={orders} loading={loading} error={error} role="admin" />
        ) : (
          <SalesReport orders={orders} loading={loading} error={error} role="admin" />
        )}
      </div>
    </div>
  );
}
