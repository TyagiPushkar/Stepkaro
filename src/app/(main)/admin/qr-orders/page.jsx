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
import ViewOrderDetailsModal from "@/app/components/shared/ViewOrderDetailsModal";

const allowedStatuses = [
  "accepted",
  "rejected",
  "dispatched_to_wr",
  "received_in_wr",
  "shipped",
  "book_to_tp",
  //  "delivered",
];

export default function Qrbankpage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  //rejected orders
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const token = localStorage.getItem("access_token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch real data from your API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/order/admin_get_orders.php?status=pending",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const resData = await response.json();
      // console.log("Fetched Orders:", resData);

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
  useEffect(() => {
    fetchOrders();
  }, []);

  // Dynamic filter tab calculation based on live data
  const filters = useMemo(() => {
    return [
      // {
      //   label: "All Orders",
      //   value: "all",
      //   count: orders.length,
      //   icon: Package,
      //   color: "purple",
      // },
      {
        label: "Pending Orders",
        value: "pending",
        count: orders.filter((o) => o.status === "pending").length,
        icon: Loader2,
        color: "orange",
      },
      // {
      //   label: "Payment Verified",
      //   value: "accepted",
      //   count: orders.filter((o) => o.payment_status === "Verified").length,
      //   icon: CheckCircle,
      //   color: "green",
      // },
      {
        label: "Rejected",
        value: "rejected",
        count: orders.filter((o) => o.status === "rejected").length,
        icon: XCircle,
        color: "red",
      },
    ];
  }, [orders]);

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        label: "Confirmed",
        color: "bg-green-100 text-green-700",
      },
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
      accepted: { label: "Accepted", color: "bg-blue-100 text-blue-700" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
      dispatched_to_wr: {
        label: "Dispatched to WR",
        color: "bg-purple-100 text-purple-700",
      },
      book_to_tp: {
        label: "Booked for Transport",
        color: "bg-green-100 text-green-700",
      },
      received_in_wr: {
        label: "Received in WR",
        color: "bg-yellow-100 text-yellow-700",
      },
      shipped: { label: "Shipped", color: "bg-teal-100 text-teal-700" },
      // delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
      new: { label: "New", color: "bg-teal-100 text-teal-700" },
    };
    return (
      badges[status] || {
        label: status || "Processing",
        color: "bg-gray-100 text-gray-600",
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
          (order.owner_name &&
            order.owner_name.toLowerCase().includes(query)) ||
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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleUpdateOrderStatus = async (
    orderId,
    status,
    reason = ""
  ) => {
    // console.log(`${status} order ${orderId}`);

    // const payload = {
    //   order_id: orderId,
    //   status: status,
    // };

    // // Reject hone par reason bhi bhejo
    // if (status === "rejected") {
    //   payload.reject_reason = reason;
    // }
    // console.log("Payload:", payload);
    const formData = new FormData();

    formData.append("order_id", orderId);
    formData.append("status", status);

    // Reject hone par reason bhi bhejo
    if (status === "rejected") {
      formData.append("reject_reason", reason);
    }

    console.log([...formData.entries()])

    try {
      const response = await axios.post(
        "https://namami-infotech.com/Stepkaro/src/order/admin_update_order_status_new.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.success) {
        // console.log("Order updated successfully");
        await fetchOrders();
        // setOrders((prev) =>
        //   prev.map((order) =>
        //     order.order_id === orderId ? { ...order, status } : order,
        //   ),
        // );
        showToast(`Order ${orderId} updated to ${status}`);
      } else {
        console.log(response.data?.message || "Failed to update order");
        showToast(response.data?.message || "Failed to update order", "error");
      }
    } catch (error) {
      console.error("API Error:", error);
      showToast("Failed to update order", "error");
    }
  };

  // ========== EXPORT FUNCTIONALITY ==========
  const handleExportOrders = () => {
    if (orders.length === 0) {
      showToast("No orders to export", "error");
      return;
    }

    const exportData = filteredOrders.length > 0 ? filteredOrders : orders;

    const headers = [
      "Order ID",
      // "Order Date",
      "Order Time",
      "Shop Name",
      "Shop Phone",
      "Brand Name",
      "Brand Phone",
      // "Article ",
      "Total Per Ctn",
      "Payment Method",
      "Total Amount",
      "Status",
    ];

    const rows = exportData.map((order) => {
      const dateTimeParts = order.created_at
        ? order.created_at.split(" ")
        : ["", ""];
      const orderDate = dateTimeParts[0] || "";
      const orderTime = dateTimeParts[1]
        ? dateTimeParts[1].substring(0, 5)
        : "";

      return [
        order.order_id || "",
        // orderTime,
        orderDate,
        order.shop_name || "Guest Customer",
        order.user_phone || "N/A",
        order.brand_name || "N/A",
        order.owner_phone || "N/A",
        // order.article_name || "N/A",
        order.total_quantity || "N/A",
        order.payment_method || "COD",
        parseFloat(order.total_amount || 0).toLocaleString("en-IN"),
        order.status || "Pending",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${exportData.length} orders successfully`);
  };

  // ========== EXPORT FILTERED ORDERS ==========
  const handleExportFilteredOrders = () => {
    if (filteredOrders.length === 0) {
      showToast("No orders matching filter to export", "error");
      return;
    }

    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Phone",
      "Vendor Name",
      "Vendor Phone",
      "Article Name",
      "Payment Method",
      "Total Amount",
      "Order Date",
      "Order Time",
      "Status",
    ];

    const rows = filteredOrders.map((order) => {
      const dateTimeParts = order.created_at
        ? order.created_at.split(" ")
        : ["", ""];
      const orderDate = dateTimeParts[0] || "";
      const orderTime = dateTimeParts[1]
        ? dateTimeParts[1].substring(0, 5)
        : "";

      return [
        order.order_id || "",
        order.user_name || "Guest Customer",
        order.user_phone || "N/A",
        order.owner_name || "N/A",
        order.owner_phone || "N/A",
        order.article_name || "N/A",
        order.payment_method || "COD",
        parseFloat(order.total_amount || 0).toLocaleString("en-IN"),
        orderDate,
        orderTime,
        order.status || "Pending",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_filtered_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${filteredOrders.length} filtered orders successfully`);
  };

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `https://namami-infotech.com/Stepkaro/${image}`;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order.id || order.order_id);
    setViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg text-white ${toast.type === "success"
            ? "bg-emerald-500"
            : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportOrders}
            className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-purple-200"
          >
            <Download size={16} />
            Export All
          </button>
          {filteredOrders.length < orders.length &&
            filteredOrders.length > 0 && (
              <button
                onClick={handleExportFilteredOrders}
                className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-gray-200 hover:border-purple-300"
              >
                <Download size={16} />
                Export Filtered ({filteredOrders.length})
              </button>
            )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by order ID, customer, phone, vendor, or article name..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.value;
          const colorMap = {
            purple: "bg-purple-600 text-white border-purple-600",
            yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
            green: "bg-green-100 text-green-700 border-green-200",
            red: "bg-red-100 text-red-700 border-red-200",
            blue: "bg-blue-100 text-blue-700 border-blue-200",
          };
          const inactiveColorMap = {
            purple:
              "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600",
            yellow:
              "bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:text-yellow-600",
            green:
              "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600",
            red: "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600",
            blue: "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600",
          };
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 border ${isActive
                ? colorMap[filter.color] ||
                "bg-purple-600 text-white border-purple-600"
                : inactiveColorMap[filter.color] ||
                "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
            >
              <Icon size={16} />
              {filter.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
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
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-gray-900">
            {filteredOrders.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-gray-900">
            {Math.min(endIndex, filteredOrders.length)}
          </span>{" "}
          of <span className="text-gray-900">{filteredOrders.length}</span>{" "}
          orders
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total no. of CTN
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Mode
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment SS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {selectedFilter === "rejected" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reject Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rejected By
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {error ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-red-500 text-sm"
                  >
                    Error loading orders: {error}
                  </td>
                </tr>
              ) : currentOrders.length > 0 ? (
                currentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
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
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            #{order.order_id}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {orderDate ? orderDate.split("-").reverse().join("/") : ""}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {orderTime}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.shop_name || "Guest Seller"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {order.user_phone || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.brand_name || "Guest vendor"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {order.owner_phone || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {order.total_quantity || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {order.payment_method === "bank" && (
                          <span className="text-xs uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                            BANK
                          </span>
                        )}

                        {order.payment_method === "qr_code" && (
                          <span className="text-xs uppercase bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                            QR CODE
                          </span>
                        )}

                        {!["BANK", "QR_CODE"].includes(
                          order.payment_method,
                        ) && <span className="text-xs text-gray-400">-</span>}
                      </td>

                      <td className="px-6 py-4">
                        {order.payment_ss ? (
                          <a
                            href={getImageUrl(order.payment_ss)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={getImageUrl(order.payment_ss)}
                              alt="Payment Screenshot"
                              className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">
                            No Screenshot
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹
                          {parseFloat(order.total_amount).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* extra kaam */}
                      {selectedFilter === "rejected" && (
                        <>
                          <td className="px-6 py-4">
                            <div className="max-w-xs text-sm text-gray-700 whitespace-pre-wrap break-words">
                              {order.reject_reason || order.rejectReason || "-"}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              {order.reject_by || order.rejected_by || "-"}
                            </div>
                          </td>
                        </>
                      )}

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                // onClick={() =>
                                //   handleUpdateOrderStatus(
                                //     order.order_id,
                                //     "rejected",
                                //   )
                                // }
                                onClick={() => {
                                  setRejectOrderId(order.order_id);
                                  setRejectReason("");
                                  setRejectModalOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(order.order_id, "new")
                                }
                                className="px-3 py-1.5 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                              >
                                Accept
                              </button>
                            </div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order.order_id,
                                  e.target.value,
                                )
                              }
                              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              {allowedStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Order Details"
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
                    <Package size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">
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
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
              <span className="text-gray-900">
                {Math.min(endIndex, filteredOrders.length)}
              </span>{" "}
              of <span className="text-gray-900">{filteredOrders.length}</span>{" "}
              orders
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === pageNum
                      ? "bg-purple-600 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ViewOrderDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        orderId={selectedOrder}
        variant="admin"
        showFinancials={true}
        token={token || ""}
      />
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Reject Order
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Please enter the rejection reason.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full mt-4 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason("");
                  setRejectOrderId(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!rejectReason.trim()) {
                    showToast("Please enter rejection reason", "error");
                    return;
                  }

                  handleUpdateOrderStatus(
                    rejectOrderId,
                    "rejected",
                    rejectReason
                  );

                  setRejectModalOpen(false);
                  setRejectReason("");
                  setRejectOrderId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
