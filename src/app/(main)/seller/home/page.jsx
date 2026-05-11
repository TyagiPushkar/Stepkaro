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

const stats = [
  {
    title: "Pending Orders",
    value: "18",
    icon: Clock3,
    color: "from-yellow-400 to-orange-500",
    trend: "+5",
    trendUp: true,
  },
  {
    title: "Stock Out",
    value: "7",
    icon: AlertTriangle,
    color: "from-red-400 to-pink-500",
    trend: "-2",
    trendUp: false,
  },
  {
    title: "Best Selling",
    value: "24",
    icon: ShoppingBag,
    color: "from-violet-500 to-purple-600",
    trend: "+8",
    trendUp: true,
  },
  {
    title: "Revenue Summary",
    value: "₹2,45,000",
    icon: IndianRupee,
    color: "from-emerald-400 to-green-600",
    trend: "+12.5%",
    trendUp: true,
  },
  {
    title: "Total Orders",
    value: "126",
    icon: PackageCheck,
    color: "from-sky-400 to-blue-600",
    trend: "+18",
    trendUp: true,
  },
  {
    title: "Commission Reports",
    value: "₹18,400",
    icon: BadgePercent,
    color: "from-fuchsia-500 to-pink-600",
    trend: "+5.2%",
    trendUp: true,
  },
];

const recentOrdersData = [
  {
    id: "#1050",
    customer: "Mumbai",
    qty: "50 pairs",
    status: "NEW",
    amount: "₹12,500",
    date: "2024-01-15",
  },
  {
    id: "#1049",
    customer: "Delhi",
    qty: "12 pairs",
    status: "ACCEPTED",
    amount: "₹4,800",
    date: "2024-01-14",
  },
  {
    id: "#1048",
    customer: "Chennai",
    qty: "30 pairs",
    status: "DISPATCHED",
    amount: "₹9,600",
    date: "2024-01-13",
  },
  {
    id: "#1047",
    customer: "Kolkata",
    qty: "8 pairs",
    status: "DELIVERED",
    amount: "₹2,400",
    date: "2024-01-12",
  },
  {
    id: "#1046",
    customer: "Bangalore",
    qty: "15 pairs",
    status: "PROCESSING",
    amount: "₹6,000",
    date: "2024-01-11",
  },
];

const bestSellingData = [
  {
    id: 1,
    name: "Ladies Slipper 101",
    stock: "120 left",
    sales: "240 sold",
    revenue: "₹72,000",
    rating: 4.8,
    image: "👡",
  },
  {
    id: 2,
    name: "Kids Clogs",
    stock: "Out of Stock",
    sales: "198 sold",
    revenue: "₹49,500",
    rating: 4.6,
    image: "👟",
  },
  {
    id: 3,
    name: "Men Sports Shoe",
    stock: "52 left",
    sales: "180 sold",
    revenue: "₹90,000",
    rating: 4.7,
    image: "👞",
  },
];

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
  switch(status) {
    case "NEW": return Clock3;
    case "ACCEPTED": return CheckCircle;
    case "DISPATCHED": return Truck;
    case "DELIVERED": return PackageCheck;
    default: return Package;
  }
};

export default function SellerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState(recentOrdersData);
  const [bestSelling, setBestSelling] = useState(bestSellingData);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Demo user if not logged in
      setUser({ name: "Vendor", email: "vendor@stepkaro.com" });
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewOrder = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  const handleAddProduct = () => {
    router.push("/products/add");
  };

  const handleViewAllOrders = () => {
    router.push("/orders");
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
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
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
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>

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
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleAddProduct}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsic-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-lg border border-violet-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                  <div className="mt-2 flex items-center gap-1">
                    <span className={`text-xs font-medium ${item.trendUp ? "text-green-600" : "text-red-600"}`}>
                      {item.trend}
                    </span>
                    <span className="text-xs text-gray-400">vs last period</span>
                  </div>
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
              <p className="text-xs text-gray-500 mt-1">Top performers this month</p>
            </div>

            <button
              onClick={handleManageProducts}
              className="text-sm font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition"
            >
              Manage
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {bestSelling.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-violet-100 p-4 transition-all hover:bg-violet-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-lg flex items-center justify-center text-xl">
                    {product.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{product.sales}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {product.revenue}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStockColor(product.stock)}`}
                  >
                    {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t border-violet-100 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Products</p>
              <p className="text-lg font-bold text-gray-900">48</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Sales</p>
              <p className="text-lg font-bold text-gray-900">618</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Avg. Rating</p>
              <p className="text-lg font-bold text-gray-900">4.7 ★</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Wallet Balance</p>
              <p className="text-2xl font-bold">₹24,500</p>
            </div>
            <Wallet size={24} className="opacity-90" />
          </div>
          <button className="mt-3 text-xs bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition">
            Withdraw
          </button>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Payout</p>
              <p className="text-2xl font-bold">₹8,200</p>
            </div>
            <Clock3 size={24} className="opacity-90" />
          </div>
          <p className="text-xs opacity-80 mt-2">Next payout: 5 days</p>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Returns</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <XCircle size={24} className="opacity-90" />
          </div>
          <p className="text-xs opacity-80 mt-2">This month</p>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rating</p>
              <p className="text-2xl font-bold">4.8 ★</p>
            </div>
            <Star size={24} className="opacity-90 fill-white" />
          </div>
          <p className="text-xs opacity-80 mt-2">Based on 342 reviews</p>
        </div>
      </div>
    </div>
  );
}