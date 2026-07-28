"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Truck,
  Clock3,
  XCircle,
  Eye,
  Package,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  TrendingUp,
  MessageCircle,
  Printer,
  DollarSign,
  IndianRupee,
} from "lucide-react";

const statusConfig = {
  NEW: {
    label: "New",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock3,
    nextAction: "accept",
  },

  ACCEPTED: {
    label: "Accepted",
    color: "bg-indigo-100 text-indigo-700",
    icon: CheckCircle2,
    nextAction: "dispatch",
  },

  DISPATCHED_TO_WR: {
    label: "Dispatched to warehouse",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
    nextAction: "Dilivered",
  },

  RECEIVED_IN_WR: {
    label: "Received in Warehouse",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
    nextAction: null,
  },

  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    nextAction: null,
  },
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const status =
        selectedStatus === "All"
          ? ""
          : `?status=${selectedStatus.toLowerCase()}`;

      const response = await fetch(
        `https://namami-infotech.com/Stepkaro/src/vender/get_vendor_orders.php${status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      console.log("API RESPONSE:", result);

      if (result.success) {
        const formattedOrders = result.data.map((item) => ({
          // id: `#${item.id}`,
          id: item.order_id ? item.order_id.toString() : "0",

          customer: item.customer_name || "N/A",

          customerName: item.customer_name || "N/A",

          items: Number(item.total_items || 0),

          quantity: Number(item.total_quantity || 0),

           amount: Number(item.total_amount || 0),

            admin_commission: Number(item.admin_commission || 0),

          vendor_amount: Number(item.vendor_amount || 0),

          status: item.status ? item.status.toUpperCase() : "NEW",

          date: new Date(item.created_at).toLocaleDateString(),

          time: new Date(item.created_at).toLocaleTimeString(),

          paymentMethod: "Online",

          shippingAddress: item.customer_phone || "-",

          reject_reason: item.reject_reason || "-",

          rejected_by: item.rejected_by || "-",

          thumbnailImg:
            item.items && item.items[0] && item.items[0].image
              ? item.items[0].image
              : "",

          firstArticleName:
            item.items && item.items[0] && item.items[0].article_name
              ? item.items[0].article_name
              : "Unknown Product",

          commission:
            item.items &&
            item.items[0] &&
            item.items[0].commission !== null &&
            item.items[0].commission !== undefined
              ? item.items[0].commission.toString()
              : "0",
          productsList: item.items || [],
        }));

        console.log("FORMATTED ORDERS:", formattedOrders);

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.log("FETCH ERROR:", error);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (selectedStatus !== "All") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.shippingAddress.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [selectedStatus, searchQuery, orders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Order actions
  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setActionType("accept");
    setShowActionModal(true);
  };

  const handleRejectOrder = (order) => {
    setSelectedOrder(order);
    setActionType("reject");
    setRejectReason("");
    setShowActionModal(true);
  };

  const handleDispatchOrder = (order) => {
    setSelectedOrder(order);
    setActionType("dispatch");
    setShowActionModal(true);
  };

  const handleDeliverOrder = (order) => {
    setSelectedOrder(order);
    setActionType("Dilivered");
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("access_token");

      let newStatus = "";

      switch (actionType) {
        case "accept":
          newStatus = "accepted";

          break;

        case "reject":
          newStatus = "rejected";

          break;

        case "dispatch":
          newStatus = "dispatched_to_wr";

          break;

        case "Dilivered":
          newStatus = "received_in_wr";

          break;

        default:
          return;
      }

      const payload = {
        order_id: Number(selectedOrder.id.replace("#", "")),
        status: newStatus,
      };

      if (actionType === "reject") {
        payload.reject_reason = rejectReason;
      }

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/order/update_order_status.php",

        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      console.log("UPDATE STATUS RESPONSE:", result);

      if (result.success) {
        fetchOrders();

        setShowActionModal(false);

        setSelectedOrder(null);
      } else {
        alert(result.message || "Failed to update order");
      }
    } catch (error) {
      console.log("UPDATE STATUS ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleExportOrders = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Customer Name",
      "Items",
      "Quantity",
      "Amount",
      "Status",
      "Date",
      "Payment Method",
    ];
    const csvData = orders.map((order) => [
      order.id,
      order.customer,
      order.customerName,
      order.items,
      order.quantity,
      order.amount,
      order.status,
      order.date,
      order.paymentMethod,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingCount = orders.filter(
    (o) => o.status === "NEW" || o.status === "PROCESSING",
  ).length;

  const getActionButton = (order) => {
    switch (order.status) {
      case "NEW":
      case "PROCESSING":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAcceptOrder(order)}
              className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
              title="Accept Order"
            >
              <CheckCircle2 size={16} />
            </button>
            <button
              onClick={() => handleRejectOrder(order)}
              className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
              title="Reject Order"
            >
              <XCircle size={16} />
            </button>
          </div>
        );
      case "ACCEPTED":
        return (
          <button
            onClick={() => handleDispatchOrder(order)}
            className="rounded-lg bg-sky-100 p-2 text-sky-700 transition hover:bg-sky-200"
            title="Dispatch Order"
          >
            <Truck size={16} />
          </button>
        );
      // case "DISPATCHED_TO_WR":
      //   return (
      //     <button
      //       onClick={() => handleDeliverOrder(order)}
      //       className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
      //       title="Mark as Received"
      //     >
      //       <CheckCircle2 size={16} />
      //     </button>
      //   );
      default:
        return null;
    }
  };

  // Modal Component
  // const Modal = ({ isOpen, onClose, title, children }) => {
  //   if (!isOpen) return null;
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  //       <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
  //         <div className="flex justify-between items-center p-4 border-b">
  //           <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
  //           <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
  //             ✕
  //           </button>
  //         </div>
  //         <div className="p-4">{children}</div>
  //       </div>
  //     </div>
  //   );
  // };

  // Modal component moved to top-level to prevent losing input focus during type/re-renders

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Header with Revenue Card */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-violet-600 flex items-center gap-2">
              <Package size={14} />
              Manage and track all your orders
            </p>
          </div>

          {/* Revenue Card - Featured prominently */}
          {/* <div className="hidden lg:flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl px-6 py-3 shadow-lg">
            <div className="bg-white/20 rounded-xl p-2">
              <IndianRupee size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div> */}
        </div>

        <div className="flex gap-3">
          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by ID, customer, address..."
              className="w-full rounded-xl border border-violet-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <button
            onClick={handleExportOrders}
            className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Mobile Revenue Card */}
      <div className="mb-6 lg:hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/80">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <IndianRupee size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      {/* <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600">Pending: {pendingCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Delivered: {orders.filter(o => o.status === "DELIVERED").length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-sm text-gray-600">Dispatched: {orders.filter(o => o.status === "DISPATCHED").length}</span>
        </div>
      </div> */}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {["All", "NEW", "ACCEPTED", "DISPATCHED_TO_WR", "RECEIVED_IN_WR", "REJECTED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedStatus === status
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-white text-violet-700 border border-violet-200 hover:bg-violet-50"
              }`}
            >
              {status === "All"
                ? "All Orders"
                : status === "DISPATCHED_TO_WR"
                ? "DISPATCHED TO WAREHOUSE"
                : status === "RECEIVED_IN_WR"
                ? "RECEIVED IN WAREHOUSE"
                : status}
            </button>
          ),
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredOrders.length}</span>{" "}
          orders
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-violet-200 bg-white px-2 py-1 text-sm"
          >
            {/* <option value={5}>5</option> */}
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-violet-100 to-purple-100">
              <tr className="text-left text-sm text-violet-800">
                <th className="px-6 py-4 font-semibold">Order ID</th>

                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Total Products</th>
                <th className="px-6 py-4 font-semibold">Total Quantity</th>
                <th className="px-6 py-4 font-semibold">Commission</th>
                <th className="px-6 py-4 font-semibold">Admin Amount</th>
                <th className="px-6 py-4 font-semibold">Vendor Amount</th>
                <th className="px-6 py-4 font-semibold">Total Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                {selectedStatus === "REJECTED" && (
                  <>
                <th className="px-6 py-4 font-semibold">Reject Reason</th>
                <th className="px-6 py-4 font-semibold">Reject By</th>
              </>
                )}
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order, index) => {
                const statusInfo =
                  statusConfig[order.status] || statusConfig.NEW;
                const StatusIcon = statusInfo.icon;
                return (
                  <tr
                    key={index}
                    className="border-t border-violet-100 text-sm hover:bg-violet-50/60 transition"
                  >
                    <td className="px-6 py-5 font-semibold text-violet-900">
                      <div className="flex items-center gap-3">
                        {/* 📦 DYNAMIC IMAGE THUMBNAIL LAYOUT WRAPPER */}
                        {/* <div className="w-10 h-10 rounded-lg bg-slate-100 border border-violet-100 overflow-hidden shrink-0 shadow-sm relative flex items-center justify-center">
                          <img
                            src={
                              order.thumbnailImg &&
                              order.thumbnailImg.trim() !== ""
                                ? order.thumbnailImg.startsWith("http")
                                  ? order.thumbnailImg
                                  : order.thumbnailImg.startsWith("Stepkaro/")
                                    ? `https://namami-infotech.com/${order.thumbnailImg}`
                                    : `https://namami-infotech.com/Stepkaro/${order.thumbnailImg}`
                                : "https://placehold.co/40x40?text=📦"
                            }
                            alt="Product preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails or path doesn't point to a real file, fallback gracefully
                              e.target.src =
                                "https://placehold.co/40x40?text=📦";
                            }}
                          />
                        </div> */}

                        {/* ORDER ID LABEL TOKEN */}
                        <span className="text-violet-900 font-semibold">
                          #{order.id}
                        </span>
                      </div>
                    </td>

                    {/* <td className="px-6 py-5 text-gray-700">
                      {order.items} items
                    </td> */}
                    <td
                      className="px-6 py-5 text-gray-700 font-medium max-w-[180px] truncate"
                      title={order.firstArticleName}
                    >
                      {order.firstArticleName}

                      {/* If there's more than 1 item, dynamically calculate the leftover count */}
                      {order.items > 1 && (
                        <span className="text-xs text-violet-500 block mt-0.5 font-normal">
                          +{order.items - 1} more item
                          {order.items > 2 ? "s" : ""}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {order.productsList?.length || 0} Products
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {order.productsList?.reduce((sum, prod) => sum + Number(prod.quantity || 0), 0) || 0} Qty
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                        {parseFloat(order.commission)}%
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      ₹{order.admin_commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      ₹{order.vendor_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <div>{order.date}</div>
                      <div className="text-xs">{order.time}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>


                      {selectedStatus === "REJECTED" && (
                        <>
                    {/* reject reason */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                        {order.reject_reason}
                      </span>
                    </td>

                    {/* reject by */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                        {order.rejected_by}
                      </span>
                    </td>
                    </>
                    )}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="rounded-lg bg-violet-100 p-2 text-violet-700 transition hover:bg-violet-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {getActionButton(order)}
                        {/* <button
                          onClick={() => handlePrintInvoice(order)}
                          className="rounded-lg bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
                          title="Print Invoice"
                        >
                          <Printer size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 border-t border-violet-100 px-6 py-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    currentPage === pageNum
                      ? "bg-violet-600 text-white"
                      : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Order Details"
      >
        {/* {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-violet-50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold text-violet-900">{selectedOrder.id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[selectedOrder.status]?.color}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div> */}

        {/* <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="text-gray-500">Name:</span> {selectedOrder.customerName}</p>
                <p className="text-sm"><span className="text-gray-500">Location:</span> {selectedOrder.customer}</p>
                <p className="text-sm"><span className="text-gray-500">Address:</span> {selectedOrder.shippingAddress}</p>
              </div>
            </div> */}

        {/* <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm"><span className="text-gray-500">Items:</span> {selectedOrder.items}</p>
                <p className="text-sm"><span className="text-gray-500">Quantity:</span> {selectedOrder.quantity}</p>
                <p className="text-sm"><span className="text-gray-500">Amount:</span> ₹{selectedOrder.amount.toLocaleString()}</p>
                <p className="text-sm"><span className="text-gray-500">Payment:</span> {selectedOrder.paymentMethod}</p>
                <p className="text-sm"><span className="text-gray-500">Date:</span> {selectedOrder.date}</p>
                <p className="text-sm"><span className="text-gray-500">Time:</span> {selectedOrder.time}</p>
              </div>
            </div> */}

        {/* <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handlePrintInvoice(selectedOrder);
                }}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <Printer size={16} />
                Print
              </button> */}

        {/* <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              >
                Close
              </button>
            </div>
          </div>
        )} */}

        {selectedOrder && (
          <div className="space-y-5 w-full mx-auto">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-violet-500">
                    Order Reference
                  </p>
                  <p className="text-2xl font-bold text-violet-950 mt-0.5">
                    #{selectedOrder.id}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3.5 py-1 text-xs font-bold shadow-sm ${statusConfig[selectedOrder.status]?.color || "bg-gray-100 text-gray-700"}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-violet-200/50 text-xs text-gray-600">
                <p>
                  <span className="text-gray-400 font-medium">
                    Payment Method:
                  </span>{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>
                <p className="text-right">
                  <span className="text-gray-400 font-medium">Order Date:</span>{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.date}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400 font-medium">
                    Total Amount:
                  </span>{" "}
                  <span className="font-bold text-emerald-600">
                    ₹{selectedOrder.amount.toLocaleString()}
                  </span>
                </p>
                <p className="text-right">
                  <span className="text-gray-400 font-medium">Order Time:</span>{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.time}
                  </span>
                </p>
              </div>
            </div>

            {/* DYNAMIC PRODUCT LIST BREAKDOWN */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-violet-650 rounded-full inline-block"></span>
                Ordered Items Breakdown ({selectedOrder.productsList?.length || 0} line items)
              </h3>

              <div className="border border-violet-100 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-violet-50/50 border-b border-violet-100 text-violet-750 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3">Product</th>
                        <th className="p-3">Variant</th>
                        <th className="p-3">Specs</th>
                        <th className="p-3 text-right">Pairs/Ctn</th>
                        <th className="p-3 text-right">Carton Qty</th>
                        <th className="p-3 text-right">Selling Price</th>
                        {/* <th className="p-3 text-right">Commission</th> */}
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-violet-50 text-gray-700">
                      {selectedOrder.productsList && selectedOrder.productsList.length > 0 ? (
                        selectedOrder.productsList.map((prod, idx) => {
                          const productImgUrl =
                            prod.image && prod.image.trim() !== ""
                              ? prod.image.startsWith("http")
                                ? prod.image
                                : `https://namami-infotech.com/Stepkaro/${prod.image.replace("Stepkaro/", "")}`
                              : "https://placehold.co/100x100?text=📦";

                          return (
                            <tr key={idx} className="hover:bg-violet-50/30 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 shadow-3xs">
                                    <img
                                      src={productImgUrl}
                                      alt="Ordered Item"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src =
                                          "https://placehold.co/100x100?text=📦";
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">
                                      {prod.article_name || "Unnamed Product"}
                                    </p>
                                    {prod.brand_name && (
                                      <p className="text-[10px] text-violet-500 font-semibold uppercase tracking-tight">
                                        {prod.brand_name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-mono font-bold text-violet-700">
                                {prod.variant || "—"}
                              </td>
                              <td className="p-3 text-gray-500 text-[11px] leading-normal">
                                <div>Gender: {prod.gender || "—"}</div>
                                <div>Color: <span className="capitalize">{prod.color || "—"}</span></div>
                                {prod.material && <div>Mat: {prod.material}</div>}
                                {prod.packing_type && <div>Pkg: {prod.packing_type}</div>}
                              </td>
                              <td className="p-3 text-right font-medium">
                                {prod.pairs_per_ctn || "—"}
                              </td>
                              <td className="p-3 text-right font-bold text-gray-900">
                                {prod.quantity || 1}
                              </td>
                              <td className="p-3 text-right font-medium">
                                ₹
                                {prod.selling_price
                                  ? Number(prod.selling_price).toLocaleString()
                                  : prod.price
                                    ? Number(prod.price).toLocaleString()
                                    : "0"}
                              </td>
                              {/* <td className="p-3 text-right">
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5">
                                  {prod.commission ? `${parseFloat(prod.commission)}%` : "0%"}
                                </span>
                              </td> */}
                              <td className="p-3 text-right font-bold text-emerald-600">
                                ₹{Number(prod.total_price || 0).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="p-6 text-center text-gray-400">
                            No comprehensive itemized breakdown records available for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-violet-50/20 border-t border-violet-100 font-bold">
                        <td colSpan="4" className="p-3 text-gray-550 text-right uppercase tracking-wider text-[10px]">
                          Totals
                        </td>
                        <td className="p-3 text-right text-xs bg-violet-100/30 text-violet-750 font-extrabold border-x border-violet-100">
                          Qty: {selectedOrder.productsList?.reduce((sum, prod) => sum + Number(prod.quantity || 0), 0) || 0}
                        </td>
                        <td colSpan="2" className="p-3 text-gray-400 text-right uppercase tracking-wider text-[10px]">
                          {selectedOrder.productsList?.length || 0} items
                        </td>
                        <td className="p-3 text-right text-[13px] text-emerald-700 font-black bg-emerald-50/20">
                          ₹{selectedOrder.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* 🎯 HIGHLIGHTED CHANGE: REPLACED GENERIC AGGREGATE TEXT LABELS */}
            <div className="bg-gray-900 text-white rounded-xl p-4 shadow-inner flex justify-between items-center text-sm">
              <div>
                <p className="text-gray-400 font-medium">
                  Total Products Enclosed
                </p>
                <p className="font-semibold text-purple-300 mt-0.5">
                  {selectedOrder.productsList?.length || 0} Line Items / Total Quantity:{" "}
                  {selectedOrder.productsList?.reduce((sum, prod) => sum + Number(prod.quantity || 0), 0) || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Grand Total Net Payable</p>
                <p className="font-black text-xl mt-0.5 text-emerald-400">
                  ₹{selectedOrder.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all duration-150 shadow-md shadow-violet-200 text-sm"
              >
                Close View Screen
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Confirm Action"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">
              Are you sure you want to{" "}
              <span className="font-semibold text-violet-750">{actionType}</span> order
              <span className="font-semibold text-violet-900">
                {" "}
                #{selectedOrder.id}
              </span>
              ?
            </p>
            {actionType === "reject" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-gray-450 block">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={4}
                  className="w-full border border-violet-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-violet-50/20"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={isLoading}
                className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
