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

// const ordersData = [
//   {
//     id: "#1050",
//     customer: "Mumbai",
//     customerName: "Rajesh Kumar",
//     items: 3,
//     quantity: "50 pairs",
//     amount: 12500,
//     status: "NEW",
//     date: "2024-01-15",
//     time: "10:30 AM",
//     paymentMethod: "COD",
//     shippingAddress: "Andheri East, Mumbai - 400069",
//   },
//   {
//     id: "#1049",
//     customer: "Delhi",
//     customerName: "Priya Singh",
//     items: 2,
//     quantity: "24 pairs",
//     amount: 8400,
//     status: "ACCEPTED",
//     date: "2024-01-14",
//     time: "02:15 PM",
//     paymentMethod: "Prepaid",
//     shippingAddress: "Connaught Place, Delhi - 110001",
//   },
//   {
//     id: "#1048",
//     customer: "Chennai",
//     customerName: "Amit Patel",
//     items: 5,
//     quantity: "30 pairs",
//     amount: 15700,
//     status: "DISPATCHED",
//     date: "2024-01-13",
//     time: "09:45 AM",
//     paymentMethod: "COD",
//     shippingAddress: "T Nagar, Chennai - 600017",
//   },
//   {
//     id: "#1047",
//     customer: "Hyderabad",
//     customerName: "Sneha Reddy",
//     items: 1,
//     quantity: "10 pairs",
//     amount: 4200,
//     status: "REJECTED",
//     date: "2024-01-12",
//     time: "04:20 PM",
//     paymentMethod: "Prepaid",
//     shippingAddress: "Banjara Hills, Hyderabad - 500034",
//   },
//   {
//     id: "#1046",
//     customer: "Bangalore",
//     customerName: "Vikram Sharma",
//     items: 4,
//     quantity: "45 pairs",
//     amount: 18900,
//     status: "DELIVERED",
//     date: "2024-01-11",
//     time: "11:00 AM",
//     paymentMethod: "COD",
//     shippingAddress: "Indiranagar, Bangalore - 560038",
//   },
//   {
//     id: "#1045",
//     customer: "Kolkata",
//     customerName: "Meera Das",
//     items: 2,
//     quantity: "18 pairs",
//     amount: 7200,
//     status: "PROCESSING",
//     date: "2024-01-10",
//     time: "03:30 PM",
//     paymentMethod: "Wallet",
//     shippingAddress: "Salt Lake City, Kolkata - 700064",
//   },
// ];

const statusConfig = {
  NEW: { label: "New", color: "bg-yellow-100 text-yellow-700", icon: Clock3, nextAction: "accept" },

  ACCEPTED: { label: "Accepted", color: "bg-indigo-100 text-indigo-700", icon: CheckCircle2, nextAction: "dispatch" },
  DISPATCHED: { label: "Dispatched", color: "bg-purple-100 text-purple-700", icon: Truck, nextAction: "deliver" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle2, nextAction: null },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle, nextAction: null },
};

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
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
      }
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

  status: item.status
    ? item.status.toUpperCase()
    : "NEW",

  date: new Date(item.created_at)
    .toLocaleDateString(),

  time: new Date(item.created_at)
    .toLocaleTimeString(),

  paymentMethod: "Online",

  shippingAddress: item.customer_phone || "-",
   
  thumbnailImg: item.items && item.items[0] && item.items[0].image 
          ? item.items[0].image 
          : "",

  firstArticleName: item.items && item.items[0] && item.items[0].article_name 
          ? item.items[0].article_name 
          : "Unknown Product",

  commission: item.items && item.items[0] && item.items[0].commission !== null && item.items[0].commission !== undefined
          ? item.items[0].commission.toString() 
          : "0", 
  productsList: item.items || []    
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
      filtered = filtered.filter(order => order.status === selectedStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.shippingAddress.toLowerCase().includes(query)
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
    setShowActionModal(true);
  };

  const handleDispatchOrder = (order) => {
    setSelectedOrder(order);
    setActionType("dispatch");
    setShowActionModal(true);
  };

  const confirmAction = async () => {

  try {

    setIsLoading(true);

    const token =
      localStorage.getItem("access_token");

    let newStatus = "";

    switch(actionType) {

  case "accept":

    newStatus = "accepted";

    break;

  case "reject":

    newStatus = "rejected";

    break;

  case "dispatch":

    newStatus = "dispatched";

    break;

  case "deliver":

    newStatus = "delivered";

    break;

  default:

    return;
}

    const response = await fetch(

      "https://namami-infotech.com/Stepkaro/src/order/update_order_status.php",

      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          order_id: Number(
            selectedOrder.id.replace("#", "")
          ),

          status: newStatus,

        }),
      }
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
    const headers = ["Order ID", "Customer", "Customer Name", "Items", "Quantity", "Amount", "Status", "Date", "Payment Method"];
    const csvData = orders.map(order => [
      order.id,
      order.customer,
      order.customerName,
      order.items,
      order.quantity,
      order.amount,
      order.status,
      order.date,
      order.paymentMethod
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === "NEW" || o.status === "PROCESSING").length;

  const getActionButton = (order) => {
    switch(order.status) {
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
      case "DISPATCHED":
        return (
          <button
            className="rounded-lg bg-gray-100 p-2 text-gray-700 cursor-not-allowed opacity-50"
            title="Order Dispatched"
            disabled
          >
            <Clock3 size={16} />
          </button>
        );
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

  const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* 🎯 MaxWidth is now dynamic instead of hardcoded to max-w-md */}
        <div className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

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
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
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
              <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
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
        {["All", "NEW",  "ACCEPTED", "DISPATCHED", "DELIVERED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              selectedStatus === status
                ? "bg-violet-600 text-white shadow-md"
                : "bg-white text-violet-700 border border-violet-200 hover:bg-violet-50"
            }`}
          >
            {status === "All" ? "All Orders" : status}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredOrders.length}</span> orders
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
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
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Commission</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order, index) => {
                const statusInfo = statusConfig[order.status] || statusConfig.NEW;
                const StatusIcon = statusInfo.icon;
                return (
                  <tr
                    key={index}
                    className="border-t border-violet-100 text-sm hover:bg-violet-50/60 transition"
                  >
                    <td className="px-6 py-5 font-semibold text-violet-900">

                     <div className="flex items-center gap-3">
                        
                        {/* 📦 DYNAMIC IMAGE THUMBNAIL LAYOUT WRAPPER */}
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-violet-100 overflow-hidden shrink-0 shadow-sm relative flex items-center justify-center">
                          <img
                            src={
                              order.thumbnailImg && order.thumbnailImg.trim() !== ""
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
                              e.target.src = "https://placehold.co/40x40?text=📦";
                            }}
                          />
                        </div>

                        {/* ORDER ID LABEL TOKEN */}
                        <span className="text-violet-900 font-semibold">
                          #{order.id}
                        </span>

                      </div>
                    </td>
                   
                    {/* <td className="px-6 py-5 text-gray-700">
                      {order.items} items
                    </td> */}
                    <td className="px-6 py-5 text-gray-700 font-medium max-w-[180px] truncate" title={order.firstArticleName}>
                      {order.firstArticleName}
                      
                      {/* If there's more than 1 item, dynamically calculate the leftover count */}
                      {order.items > 1 && (
                        <span className="text-xs text-violet-500 block mt-0.5 font-normal">
                          +{order.items - 1} more item{order.items > 2 ? 's' : ''}
                        </span>
                      )}
                    </td>


                    <td className="px-6 py-5 text-gray-700">
                      {order.quantity}
                    </td>
                     <td className="px-6 py-5">
                      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                        {parseFloat(order.commission)}%
                      </span>
                    </td> 
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <div>{order.date}</div>
                      <div className="text-xs">{order.time}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
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
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
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
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Order Details">
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
                  <p className="text-sm font-semibold uppercase tracking-wider text-violet-500">Order Reference</p>
                  <p className="text-2xl font-bold text-violet-950 mt-0.5">#{selectedOrder.id}</p>
                </div>
                <span className={`rounded-full px-3.5 py-1 text-xs font-bold shadow-sm ${statusConfig[selectedOrder.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-violet-200/50 text-xs text-gray-600">
                <p><span className="text-gray-400 font-medium">Payment Method:</span> <span className="font-semibold text-gray-800">{selectedOrder.paymentMethod}</span></p>
                <p className="text-right"><span className="text-gray-400 font-medium">Order Date:</span> <span className="font-semibold text-gray-800">{selectedOrder.date}</span></p>
                <p><span className="text-gray-400 font-medium">Total Amount:</span> <span className="font-bold text-emerald-600">₹{selectedOrder.amount.toLocaleString()}</span></p>
                <p className="text-right"><span className="text-gray-400 font-medium">Order Time:</span> <span className="font-semibold text-gray-800">{selectedOrder.time}</span></p>
              </div>
            </div>

            {/* DYNAMIC PRODUCT LIST BREAKDOWN */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-violet-600 rounded-full inline-block"></span>
                Ordered Items Breakdown ({selectedOrder.productsList?.length || 0})
              </h3>

              {selectedOrder.productsList && selectedOrder.productsList.length > 0 ? (
                selectedOrder.productsList.map((prod, idx) => {
                  const productImgUrl = prod.image && prod.image.trim() !== ""
                    ? (prod.image.startsWith("http") ? prod.image : `https://namami-infotech.com/Stepkaro/${prod.image.replace("Stepkaro/", "")}`)
                    : "https://placehold.co/100x100?text=📦";

                  return (
                    <div key={idx} className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="bg-gray-50/70 p-3.5 border-b border-gray-100 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0 shadow-xs relative">
                          <img src={productImgUrl} alt="Ordered Item" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://placehold.co/100x100?text=📦"; }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-violet-600 tracking-wide uppercase">{prod.brand_name || "Generic Brand"}</p>
                          <p className="font-bold text-gray-900 text-sm truncate mt-0.5">{prod.article_name || "Unnamed Product Line"}</p>
                        </div>
                        <div className="text-right shrink-0 bg-violet-100/60 border border-violet-200/50 rounded-lg px-2.5 py-1">
                          <p className="text-xs text-violet-700 font-medium">Item Qty</p>
                          <p className="text-sm font-black text-violet-950 text-center">{prod.quantity || 1}</p>
                        </div>
                      </div>


                      <div className="grid grid-cols-2 border-b border-gray-100 bg-white">
                        
                        {/* 👥 LEFT COLUMN (50% WIDTH) */}
                        <div className="p-4 space-y-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-500/80">Category</span>
                            <span className="text-[14px] font-bold text-slate-800">{prod.category_name || "—"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Gender Target</span>
                            <span className="text-[14px] font-semibold text-slate-700 capitalize">{prod.gender || "—"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Color Scheme</span>
                            <span className="text-[14px] font-semibold text-slate-700 capitalize">{prod.color || "—"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Material</span>
                            <span className="text-[14px] font-semibold text-slate-700">{prod.material || "—"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Product Added</span>
                            <span className="text-[13px] font-medium text-slate-600">{prod.created_at ? new Date(prod.created_at).toLocaleDateString() : "—"}</span>
                          </div>
                        </div>

                        {/* 📦 RIGHT COLUMN (50% WIDTH) - Separated by a sharp structural border */}
                        <div className="p-4 space-y-3.5 border-l border-gray-100 bg-slate-50/30">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">Size Variant</span>
                            <span className="text-[15px] font-black text-purple-700">{prod.variant || "—"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Packing Type</span>
                            <span className="text-[14px] font-semibold text-slate-700">{prod.packing_type || "Loose"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pairs Per Carton</span>
                            <span className="text-[14px] font-bold text-slate-800">{prod.pairs_per_ctn || "—"}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Vendor Commission</span>
                            <div>
                              <span className="inline-block text-[13px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-0.5 mt-0.5">
                                {prod.commission ? `${parseFloat(prod.commission)}%` : "0%"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Item Status</span>
                            <div>
                              <span className="inline-block text-[13px] font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-0.5 mt-0.5 capitalize">
                                {prod.status || "—"}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="bg-gray-50/50 px-3.5 py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-gray-400 font-medium">Unit Selling Price: </span>
                          <span className="font-bold text-gray-900">₹{prod.selling_price ? Number(prod.selling_price).toLocaleString() : (prod.price ? Number(prod.price).toLocaleString() : "0")}</span>
                        </div>
                        {/* <div className="text-right">
                          <span className="text-gray-500 font-bold">Line Total Cost: </span>
                          <span className="text-sm font-black text-teal-600 bg-teal-50 border border-teal-100 rounded-lg px-2 py-0.5">₹{Number(prod.total_price || 0).toLocaleString()}</span>
                        </div> */}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                  No comprehensive itemized breakdown records available for this order reference item.
                </div>
              )}
            </div>

            {/* 🎯 HIGHLIGHTED CHANGE: REPLACED GENERIC AGGREGATE TEXT LABELS */}
            <div className="bg-gray-900 text-white rounded-xl p-4 shadow-inner flex justify-between items-center text-sm">
              <div>
                  <p className="text-gray-400 font-medium">Total Products Enclosed</p>
                  <p className="font-semibold text-purple-300 mt-0.5">
                    {selectedOrder.items} Line Items / Total Quantity: {selectedOrder.quantity}
                  </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Grand Total Net Payable</p>
                <p className="font-black text-xl mt-0.5 text-emerald-400">₹{selectedOrder.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowDetailsModal(false)} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all duration-150 shadow-md shadow-violet-200 text-sm">Close View Screen</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} title="Confirm Action">
        {selectedOrder && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to <span className="font-semibold">{actionType}</span> order 
              <span className="font-semibold text-violet-900"> {selectedOrder.id}</span>?
            </p>
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
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}