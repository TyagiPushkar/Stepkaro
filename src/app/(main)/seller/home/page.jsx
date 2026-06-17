"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Clock3,
  AlertTriangle,
  IndianRupee,
  PackageCheck,
  BadgePercent,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  TrendingUp,
  Wallet,
  Calendar,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Plus,
} from "lucide-react";

const getStatusColor = (status) => {
  const colors = {
    NEW: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    DISPATCHED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    PROCESSING: "bg-orange-100 text-orange-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const getStatusIcon = (status) => {
  switch (status) {
    case "NEW":
      return Clock3;
    case "ACCEPTED":
      return CheckCircle;
    case "DISPATCHED":
      return Truck;
    case "DELIVERED":
      return PackageCheck;
    default:
      return Package;
  }
};

export default function SellerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "https://namami-infotech.com/Stepkaro/src/vender/vendor_dashboard.php",

          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (data.success) {
          setDashboardData(data.data);

          setBestSelling(data.data.best_selling_products || []);

          const ordersResponse = await fetch(
            "https://namami-infotech.com/Stepkaro/src/vender/get_vendor_orders.php",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const ordersData = await ordersResponse.json();

          if (ordersData.success) {
            const latestOrders = (ordersData.data || [])
              .slice(0, 5)
              .map((order) => ({
                id: `#${order.id}`,
                customer: order.city || order.customer_name || "Customer",
                qty: `${order.total_quantity || 0} items`,
                status: (order.status || "").toUpperCase(),
                amount: `₹${order.total_amount || 0}`,
                date: order.created_at || "",
              }));

            setRecentOrders(latestOrders);
          }
        }
      } catch (error) {
        console.log("Dashboard Error:", error);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    // {
    //   title: "Total Sales",
    //   value: `₹${dashboardData?.total_sales || 0}`,
    //   icon: ShoppingBag,
    //   color: "from-green-400 to-emerald-600",
    // },
    {
      title: "Total Revenue",
      value: `₹${dashboardData?.total_revenue || 0}`,
      icon: Wallet,
      color: "from-blue-400 to-sky-600",
    },
    {
      title: "Total Products",
      value: dashboardData?.total_products || 0,
      icon: Star,
      color: "from-purple-400 to-fuchsia-600",
    },
    {
      title: "Pending Orders",
      value: dashboardData?.pending_orders || 0,
      icon: Clock3,
      color: "from-yellow-400 to-orange-500",
    },

    {
      title: "Stock Out",
      value: dashboardData?.stock_out || 0,
      icon: AlertTriangle,
      color: "from-red-400 to-pink-500",
    },

    {
      title: "Total Orders",
      value: dashboardData?.total_orders || 0,
      icon: PackageCheck,
      color: "from-sky-400 to-blue-600",
    },

    // {
    //   title: "Commission Reports",
    //   value: `₹${dashboardData?.commission_report?.commission || 0}`,
    //   icon: BadgePercent,
    //   color: "from-fuchsia-500 to-pink-600",
    // },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewOrder = (orderId) => {
    router.push(`orders`);
  };

  const handleAddProduct = () => {
    router.push("/products/add");
  };

  const handleViewAllOrders = () => {
    router.push("orders");
  };

  const handleManageProducts = () => {
    router.push("/products");
  };

  const handleExportReport = () => {
    const reportData = {
      period: selectedPeriod,
      stats: stats,
      orders: recentOrders,
      products: bestSelling,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStockColor = (stock) => {
    if (stock === "Out of Stock") return "bg-red-100 text-red-700";
    const count = parseInt(stock);
    if (count < 50) return "bg-orange-100 text-orange-700";
    return "bg-emerald-100 text-emerald-700";
  };
  const handleImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `https://namami-infotech.com/Stepkaro/${image}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
          <p className="mt-2 text-sm text-violet-600 flex items-center gap-2">
            <Calendar size={14} />
            Welcome back, {user?.name || "Vendor"} 👋
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportReport}
            className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={handleRefresh}
            className={`rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 flex items-center gap-2 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              onClick={() =>
                item.title === "Commission Reports"
                  ? router.push("/seller/payments")
                  : router.push("/seller/orders")
              }
              className="group rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-lg border border-violet-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                  <div className="mt-2 flex items-center gap-1"></div>
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

      {/* Bottom Grid */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-violet-100 p-6 shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-violet-900 flex items-center gap-2">
                <PackageCheck size={20} />
                Recent Orders
              </h2>
              <p className="text-xs text-gray-500 mt-1">Latest transactions</p>
            </div>

            <button
              onClick={handleViewAllOrders}
              className="text-sm font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition"
            >
              View All
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-violet-100 p-4 transition-all hover:bg-violet-50 cursor-pointer"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-violet-100`}>
                      <StatusIcon size={16} className="text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.id}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {order.customer} • {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {order.amount}
                    </p>
                    <p className="text-xs text-gray-500">{order.qty}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-violet-100 p-6 shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-violet-900 flex items-center gap-2">
                <TrendingUp size={20} />
                Best Selling Products
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Top performers this month
              </p>
            </div>

            {/* <button
              onClick={handleManageProducts}
              className="text-sm font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition"
            >
              Manage
              <ChevronRight size={14} />
            </button> */}
          </div>

          <div className="space-y-3">
            {bestSelling?.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-violet-100 p-4 transition-all hover:bg-violet-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={handleImageUrl(product.image)}
                    alt={product.article_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.article_name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {product.total_sold} sold
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
