"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token"); // safety (agar aur naam se saved ho)

    router.push("/"); // home redirect
  };

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token") || ""
      : "";

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://namami-infotech.com/Stepkaro/src/super_admin/dashboard.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data.data || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  // =========================
  // FETCH ORDERS (optional same as before)
  // =========================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://namami-infotech.com/Stepkaro/src/order/admin_get_orders.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        const resData = await response.json();

        if (resData.success) {
          setOrders(resData.data || []);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchOrders();
  }, [token]);

  // =========================
  // LOADING / ERROR UI
  // =========================
  if (loading) {
    return (
      <div className="text-center text-gray-400 p-10">Loading dashboard...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 p-10">Error: {error}</div>;
  }

  // =========================
  // STATS FROM API
  // =========================
  const stats = [
    {
      title: "Total Orders",
      value: dashboard?.totalOrders || 0,
      icon: "🛒",
      bgClass: "bg-teal-500/20",
      textClass: "text-teal-400",
    },
   
    {
      title: "Active Products",
      value: dashboard?.activeProducts || 0,
      icon: "📦",
      bgClass: "bg-green-500/20",
      textClass: "text-green-400",
    },
    {
      title: "Out of Stock",
      value: dashboard?.outOfStock || 0,
      icon: "⚠️",
      bgClass: "bg-red-500/20",
      textClass: "text-red-400",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboard?.totalRevenue || 0}`,
      icon: "💰",
      bgClass: "bg-emerald-500/20",
      textClass: "text-emerald-400",
    },
    {
      title: "Admin Revenue",
      value: `₹${dashboard?.adminRevenue || 0}`,
      icon: "🏦",
      bgClass: "bg-purple-500/20",
      textClass: "text-purple-400",
    },
    {
      title: "Pending Payments",
      value: `₹${dashboard?.pendingPayments || 0}`,
      icon: "💳",
      bgClass: "bg-orange-500/20",
      textClass: "text-orange-400",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "dispatched":
        return "bg-blue-500/20 text-blue-400";
      case "new":
        return "bg-purple-500/20 text-purple-400";
      case "packed":
        return "bg-indigo-500/20 text-indigo-400";
      case "shipped":
        return "bg-cyan-500/20 text-cyan-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "ordered":
        return "bg-purple-500/20 text-purple-400";
      case "accepted":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      
<div className="flex justify-between items-start">
  <div>
    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
    <p className="text-gray-400 text-sm">Super Admin overview panel</p>
  </div>
  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
  >
    Logout
  </button>
</div>
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-5"
          >
            <div className="text-2xl">{item.icon}</div>
            <p className="text-xl font-bold text-white mt-2">{item.value}</p>
            <p className="text-gray-400 text-sm">{item.title}</p>
          </div>
        ))}
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Recent Orders</h3>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 text-gray-400 text-center">No orders found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="p-3 text-left text-gray-400">ID</th>
                <th className="p-3 text-left text-gray-400">Customer</th>
                <th className="p-3 text-left text-gray-400">vendor</th>
                <th className="p-3 text-left text-gray-400">Amount</th>
                <th className="p-3 text-left text-gray-400">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.order_id} className="border-t border-white/5">
                  <td className="p-3 text-white">#{order.order_id}</td>
                  <td className="p-3 text-gray-300">
                    {order.customer || order.user_name || "Guest"}
                  </td>
                  <td className="p-3 text-gray-300">
                    {order.customer || order.owner_name || "Guest"}
                  </td>
                  <td className="p-3 text-white">
                    ₹{order.amount || order.total_amount || 0}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
