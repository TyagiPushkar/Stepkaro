"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  AlertCircle,
  TrendingUp,
  Building2,
  CreditCard,
  LogOut,
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    router.push("/");
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
          }
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
  // FETCH ORDERS
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
          }
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

//   useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch(
//         "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php"
//       );

//       const data = await res.json();

//       if (data.success) {
//         setUsers([
//           ...(data.data.buyers || []),
//           ...(data.data.vendors || []),
//         ]);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   fetchUsers();
// }, []);

  // =========================
  // STATS FROM API
  // =========================
  const stats = [
  {
    title: "New Orders",
    value: dashboard?.newOrders || 0,
    icon: ShoppingCart,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Pending QR/BANK Orders",
    value: dashboard?.pending_qrBankOrders || 0,
    icon: ShoppingCart,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Active Products",
    value: dashboard?.activeProducts || 0,
    icon: Package,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Enquiry",
    value: dashboard?.enquiryPendingCount || 0,
    icon: Package,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Pending Buyer Request",
    value: dashboard?.pendingBuyerRequest || 0,
    icon: Building2,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Pending Sellers Request",
    value: dashboard?.pendingSellersRequest || 0,
    icon: Building2,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Pending Products Request",
    value: dashboard?.pendingProductsRequest || 0,
    icon: Building2,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  // {
  //   title: "Total Revenue",
  //   value: `₹${dashboard?.totalRevenue || 0}`,
  //   icon: TrendingUp,
  //   bgColor: "bg-blue-100",
  //   iconColor: "text-blue-600",
  // },
  // {
  //   title: "Admin Revenue",
  //   value: `₹${dashboard?.adminRevenue || 0}`,
  //   icon: Building2,
  //   bgColor: "bg-purple-100",
  //   iconColor: "text-purple-600",
  // },
  {
    title: "Total Buyer",
    value: dashboard?.totalBuyer || 0,
    icon: Building2,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Total Sellers",
    value: dashboard?.totalSellers || 0,
    icon: Building2,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  // {
  //   title: "Total Products",
  //   value: users.filter(
  //     (u) => (u.status || "").toLowerCase() === "pending"
  //   ).length,
  //   icon: Building2,
  //   bgColor: "bg-yellow-100",
  //   iconColor: "text-yellow-600",
  // },
  {
    title: "Pending Payments",
    value: `₹${dashboard?.pendingPayments || 0}`,
    icon: CreditCard,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "dispatched":
        return "bg-blue-100 text-blue-700";
      case "new":
        return "bg-purple-100 text-purple-700";
      case "packed":
        return "bg-indigo-100 text-indigo-700";
      case "shipped":
        return "bg-cyan-100 text-cyan-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "ordered":
        return "bg-purple-100 text-purple-700";
      case "accepted":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =========================
  // LOADING / ERROR UI
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Super Admin overview panel</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{item.title}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}
                >
                  <Icon size={22} className={item.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-gray-900 font-semibold">Recent Orders</h3>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            <Package size={48} className="text-gray-300 mx-auto mb-3" />
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[...orders]
  .sort((a, b) => {
    if (
      (a.status || "").toLowerCase() === "new" &&
      (b.status || "").toLowerCase() !== "new"
    )
      return -1;

    if (
      (a.status || "").toLowerCase() !== "new" &&
      (b.status || "").toLowerCase() === "new"
    )
      return 1;

    return 0;
  }).slice(0, 5).map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm font-medium text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.customer || order.user_name || "Guest"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.customer || order.owner_name || "Guest"}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900">
                      ₹{order.amount || order.total_amount || 0}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}