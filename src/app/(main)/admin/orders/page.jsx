"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Download,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem("access_token");

  // Fetch real data from your API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Authorization token required by your PHP middleware

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
        } else {
          throw new Error(resData.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Dynamic filter tab calculation based on live data
  const filters = useMemo(() => {
    return [
      {
        label: "All Orders",
        value: "all",
        count: orders.length,
        icon: Package,
        color: "teal",
      },
      {
        label: "Order Confirmation",
        value: "pending",
        count: orders.filter((o) => o.status === "pending").length,
        icon: Clock,
        color: "yellow",
      },
      {
        label: "Order Accepted",
        value: "accepted",
        count: orders.filter((o) => o.status === "accepted").length,
        icon: CheckCircle,
        color: "green",
      },
      {
        label: "Order Rejected",
        value: "rejected",
        count: orders.filter((o) => o.status === "rejected").length,
        icon: XCircle,
        color: "red",
      },
      {
        label: "Order Dispatched",
        value: "dispatched",
        count: orders.filter((o) => o.status === "dispatched").length,
        icon: Truck,
        color: "blue",
      },
      {
        label: "Booked For Transport",
        value: "transport",
        count: orders.filter((o) => o.status === "transport").length,
        icon: Package,
        color: "purple",
      },
    ];
  }, [orders]);

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        label: "Confirmed",
        color: "bg-green-500/20 text-green-400",
      },
      pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
      accepted: { label: "Accepted", color: "bg-blue-500/20 text-blue-400" },
      rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400" },
      dispatched: {
        label: "Dispatched",
        color: "bg-purple-500/20 text-purple-400",
      },
      transport: {
        label: "Booked for Transport",
        color: "bg-indigo-500/20 text-indigo-400",
      },
      processing: {
        label: "Processing",
        color: "bg-orange-500/20 text-orange-400",
      },
      new: { label: "New", color: "bg-teal-500/20 text-teal-400" },
    };
    return (
      badges[status] || {
        label: status || "Processing",
        color: "bg-gray-500/20 text-gray-400",
      }
    );
  };

  // Live filter and search handling over backend response data keys
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((order) => order.status === selectedFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_id?.toString().includes(query) ||
          (order.user_name && order.user_name.toLowerCase().includes(query)) ||
          (order.user_phone && order.user_phone.includes(query)) ||
          (order.business_name &&
            order.business_name.toLowerCase().includes(query)) ||
          (order.article_name &&
            order.article_name.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [selectedFilter, searchQuery, orders]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAcceptOrder = async (orderId) => {
    console.log(`Accept order ${orderId}`);
    try {
      const response = await axios.put(
        "https://namami-infotech.com/Stepkaro/src/order/admin_approve_order.php",
        {
          order_id: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (response.data?.success) {
        console.log("Order updated successfully");

        // optional UI update
        // e.g. refresh list or update state
      } else {
        console.log(response.data?.message || "Failed to update order");
      }
    } catch (error) {
      console.error("API Error:", error);
      console.log(error.response?.data?.message || "Server error");
    }
  };

  const handleRejectOrder = (orderId) => {
    console.log(`Reject order ${orderId}`);
  };

  const handleViewOrder = (orderId) => {
    console.log(`View order ${orderId}`);
  };

  const handleExportOrders = () => {
    console.log("Exporting orders...");
  };
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `https://namami-infotech.com/${image}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportOrders}
            className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded-lg px-4 py-2 text-sm text-teal-400 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export Orders
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by order ID, customer, phone, vendor, or article name..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? `bg-${filter.color}-500/20 text-${filter.color}-400 border border-${filter.color}-500/30`
                  : "bg-slate-800/50 text-gray-400 hover:text-white border border-white/10 hover:border-teal-500/30"
              }`}
            >
              <Icon size={16} />
              {filter.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? `bg-${filter.color}-500/30 text-${filter.color}-400`
                    : "bg-slate-700 text-gray-400"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Showing{" "}
          <span className="text-white">
            {filteredOrders.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-white">
            {Math.min(endIndex, filteredOrders.length)}
          </span>{" "}
          of <span className="text-white">{filteredOrders.length}</span> orders
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Orders Table container with API State controls */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Article Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Loader2
                      size={32}
                      className="text-teal-500 animate-spin mx-auto mb-2"
                    />
                    <p className="text-gray-400 text-sm">
                      Fetching live database records...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-red-400 text-sm"
                  >
                    Error loading orders: {error}
                  </td>
                </tr>
              ) : currentOrders.length > 0 ? (
                currentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);

                  // Extract Date & Time cleanly from "YYYY-MM-DD HH:MM:SS"
                  const dateTimeParts = order.created_at
                    ? order.created_at.split(" ")
                    : ["N/A", ""];
                  const orderDate = dateTimeParts[0];
                  const orderTime = dateTimeParts[1]
                    ? dateTimeParts[1].substring(0, 5)
                    : "";

                  return (
                    <tr
                      key={order.order_id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(order.product_image)}
                            alt="Product"
                            className="w-8 h-8 rounded-md object-cover border border-gray-700"
                            // onError={(e) => {
                            //   e.target.src = "/placeholder.png";
                            // }}
                          />

                          <span className="text-sm font-medium text-white">
                            #{order.order_id}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {order.user_name || "Guest Customer"}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {order.user_phone || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {order.owner_name || "Guest Customer"}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {order.owner_phone || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {order.article_name || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs uppercase bg-slate-800 text-gray-400 px-2 py-1 rounded">
                          {order.payment_method || "COD"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white">
                          ₹
                          {parseFloat(order.total_amount).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{orderDate}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {orderTime}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectOrder(order.order_id)}
                            className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAcceptOrder(order.order_id)}
                            className="px-3 py-1.5 text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleViewOrder(order.order_id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Package size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No orders found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search or filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white">{startIndex + 1}</span> to{" "}
              <span className="text-white">
                {Math.min(endIndex, filteredOrders.length)}
              </span>{" "}
              of <span className="text-white">{filteredOrders.length}</span>{" "}
              orders
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-400"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
