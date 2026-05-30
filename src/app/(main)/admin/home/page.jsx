export default function HomePage() {
  const stats = [
    // { title: "Visitors", value: 0, icon: "👥", color: "blue", change: "+0%", trend: "up" },
    // { title: "Enquiries", value: 21, icon: "📧", color: "purple", change: "+5", trend: "up" },
    { title: "Total Orders", value: 113, icon: "🛒", color: "teal" },
    { title: "Live Products", value: 583, icon: "📦", color: "green" },
    { title: "Out of Stock", value: 164, icon: "⚠️", color: "red" },
    // { title: "Users", value: 620, icon: "👤", color: "indigo", change: "+42", trend: "up" },
    // { title: "Shares", value: 0, icon: "🔗", color: "orange", change: "0", trend: "neutral" },
    { title: "Revenue", value: "₹17,93,559", icon: "💰", color: "emerald" },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "Rajesh Kumar", amount: "₹2,499", status: "Delivered", date: "2024-01-15" },
    { id: "#ORD-002", customer: "Priya Singh", amount: "₹5,999", status: "Processing", date: "2024-01-15" },
    { id: "#ORD-003", customer: "Amit Patel", amount: "₹1,299", status: "Shipped", date: "2024-01-14" },
    { id: "#ORD-004", customer: "Neha Gupta", amount: "₹8,499", status: "Pending", date: "2024-01-14" },
    { id: "#ORD-005", customer: "Vikram Sharma", amount: "₹3,299", status: "Delivered", date: "2024-01-13" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-500/20 text-green-400";
      case "Processing": return "bg-blue-500/20 text-blue-400";
      case "Ordered": return "bg-purple-500/20 text-purple-400";
      case "Accepted": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  // const getTrendIcon = (trend) => {
  //   if (trend === "up") return "↑";
  //   if (trend === "down") return "↓";
  //   return "→";
  // };

  // const getTrendColor = (trend) => {
  //   if (trend === "up") return "text-green-400";
  //   if (trend === "down") return "text-red-400";
  //   return "text-gray-400";
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back! Here's an overview of your store.</p>
        </div>

        <div className="flex gap-3">
          {/* <select className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select> */}
          <button className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded-lg px-4 py-2 text-sm text-teal-400 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-teal-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium}`}>
                {item.change}
                
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </p>
            <p className="text-gray-400 text-sm mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Recent Orders</h3>
              <p className="text-gray-400 text-xs mt-1">Latest transactions from your store</p>
            </div>
            <button className="text-teal-400 text-sm hover:text-teal-300 transition-colors flex items-center gap-1">
              View All
              <span>→</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 text-sm text-white font-medium">{order.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-300">{order.customer}</td>
                  <td className="px-6 py-3 text-sm text-white">{order.amount}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions - Only 2 cards now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-xl">
              📦
            </div>
            <div>
              <h4 className="text-white font-medium">Add New Product</h4>
              <p className="text-gray-400 text-xs mt-1">Expand your catalog</p>
            </div>
          </div>
          <button className="w-full mt-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 text-sm transition-colors">
            Add Product
          </button>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-xl">
              📈
            </div>
            <div>
              <h4 className="text-white font-medium">View Reports</h4>
              <p className="text-gray-400 text-xs mt-1">Analyze your performance</p>
            </div>
          </div>
          <button className="w-full mt-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-400 text-sm transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}