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
    Loader2,
    Calendar,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderDetailsModal } from "@/app/components/shared/VendorOrderModel";
import { generateVendorOrderPdf } from "@/app/utils/pdf";

// -------------------- Helper Functions --------------------
const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `https://namami-infotech.com/Stepkaro/${image}`;
};

const formatCurrency = (amount) => {
    return `RS.${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

// -------------------- Status Config --------------------
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

// -------------------- Modal Component (reusable) --------------------
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}>
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
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

// -------------------- Main Component --------------------
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
    const [toast, setToast] = useState(null);

    // State for vendor-specific details modal
    const [orderDetails, setOrderDetails] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // -------------------- Fetch Orders --------------------
    useEffect(() => {
        fetchOrders();
    }, [selectedStatus]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const status = selectedStatus === "All" ? "" : `?status=${selectedStatus.toLowerCase()}`;

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

            if (result.success) {
                console.log(result.data);
                const formattedOrders = result.data.map((item) => ({
                    id: item.order_id ? item.order_id.toString() : "0",
                    order_id: item.order_id,
                    created_at: item.created_at,
                    customer: item.customer_name || "N/A",
                    customerName: item.customer_name || "N/A",
                    shop_name: item.shop_name || item.customer_name || "Guest Seller",
                    user_phone: item.customer_phone || "N/A",
                    brand_name: item.brand_name || "N/A",
                    owner_phone: item.vendor_phone || "N/A",
                    items: Number(item.total_items || 0),
                    quantity: Number(item.total_quantity || 0),
                    amount: Number(item.total_amount || 0),
                    admin_commission: Number(item.admin_commission || 0),
                    vendor_amount: Number(item.vendor_amount || 0),
                    status: item.status ? item.status.toUpperCase() : "NEW",
                    date: new Date(item.created_at).toLocaleDateString(),
                    time: new Date(item.created_at).toLocaleTimeString(),
                    paymentMethod: item.payment_method || "Online",
                    shippingAddress: item.customer_phone || "-",
                    reject_reason: item.reject_reason || "-",
                    rejected_by: item.rejected_by || "-",
                    thumbnailImg: item.items && item.items[0] && item.items[0].image ? item.items[0].image : "",
                    firstArticleName: item.items && item.items[0] && item.items[0].article_name ? item.items[0].article_name : "Unknown Product",
                    commission: item.items && item.items[0] && item.items[0].commission !== null && item.items[0].commission !== undefined ? item.items[0].commission.toString() : "0",
                    productsList: item.items || [],
                    total_quantity: item.total_quantity || 0,
                }));

                setOrders(formattedOrders);
            }
        } catch (error) {
            console.log("FETCH ERROR:", error);
        }
    };

    // -------------------- Handlers --------------------
    const handleViewDetails = (order) => {
        setOrderDetails(order);   // Direct selected order store karo
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setOrderDetails(null);
    };


    const handleDownloadPdf = async (orderDetails) => {
        if (!orderDetails) return;
        console.log(orderDetails);
        // setDownloading(true);
        try {
            // Determine if we have a flat order or { order, items }
            let orderData, itemsData;
            if (orderDetails.order && orderDetails.items) {
                // Structure: { order, items }
                orderData = orderDetails.order;
                itemsData = orderDetails.items;
            } else {
                // Flat order object with productsList
                orderData = orderDetails;
                itemsData = orderDetails.productsList || [];
            }
            // Ensure itemsData is an array
            if (!Array.isArray(itemsData)) itemsData = [];
            await generateVendorOrderPdf({ order: orderData, items: itemsData });
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            // setDownloading(false);
        }
    };

    // Order actions (accept, reject, dispatch, deliver)
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
                order_id: Number(selectedOrder.id),
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
                }
            );

            const result = await response.json();

            if (result.success) {
                fetchOrders();
                setShowActionModal(false);
                setSelectedOrder(null);
                showToast(`Order ${actionType}ed successfully!`);
            } else {
                alert(result.message || "Failed to update order");
            }
        } catch (error) {
            console.log("UPDATE STATUS ERROR:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportOrders = () => {
        const headers = [
            "Order ID",
            "Date",
            "Total Ctn",
            "Total Amount",
            "Commission",
            "Settlement Amount",
            "Status",
        ];
        const csvData = orders.map((order) => [
            order.id,
            order.date,
            order.productsList?.reduce((sum, prod) => sum + Number(prod.quantity || 0), 0) || 0,
            order.amount,
            order.admin_commission,
            order.vendor_amount,
            order.status,
        ]);

        const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Orders exported successfully!");
    };

    // Filter and pagination
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (selectedStatus !== "All") {
            filtered = filtered.filter((order) => order.status === selectedStatus);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();

            filtered = filtered.filter((order) =>
                order.id.toString().includes(query) ||
                order.customer?.toLowerCase().includes(query) ||
                order.customerName?.toLowerCase().includes(query) ||
                order.shop_name?.toLowerCase().includes(query) ||
                order.brand_name?.toLowerCase().includes(query) ||
                order.created_at?.toLowerCase().includes(query) ||
                order.date?.toLowerCase().includes(query) ||
                String(order.amount).includes(query)
            );
        }

        return filtered;
    }, [orders, selectedStatus, searchQuery]);

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
            default:
                return null;
        }
    };

    // -------------------- Render --------------------
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg text-white ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                >
                    {toast.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and track all your orders</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search by ID, customer, brand..."
                            className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button
                        onClick={handleExportOrders}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-purple-200"
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
                    <p className="text-2xl font-bold text-yellow-600">
                        {orders.filter((o) => o.status === "NEW").length}
                    </p>
                    <p className="text-xs text-gray-500">Pending Orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                {["All", "NEW", "ACCEPTED", "DISPATCHED_TO_WR", "RECEIVED_IN_WR", "REJECTED"].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleStatusFilter(status)}
                        className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all border ${selectedStatus === status
                            ? "bg-purple-600 text-white border-purple-600 shadow-md"
                            : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                            }`}
                    >
                        {status === "All" ? "All Orders" : status.replace(/_/g, " ")}
                    </button>
                ))}
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
                    <span className="text-gray-900">{Math.min(endIndex, filteredOrders.length)}</span> of{" "}
                    <span className="text-gray-900">{filteredOrders.length}</span> orders
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
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
                                    Total CTN
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Settlement Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invoice
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                {selectedStatus === "REJECTED" && (
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
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => {
                                    const statusInfo = statusConfig[order.status] || statusConfig.NEW;
                                    const StatusIcon = statusInfo.icon;
                                    const dateTimeParts = order.created_at ? order.created_at.split(" ") : ["N/A", ""];
                                    const orderDate = dateTimeParts[0];
                                    const orderTime = dateTimeParts[1] ? dateTimeParts[1].substring(0, 5) : "";

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {orderDate ? orderDate.split("-").reverse().join("/") : ""}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">{orderTime}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.productsList?.reduce((sum, prod) => sum + Number(prod.quantity || 0), 0) || 0} Qty
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ₹{order.amount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{order.admin_commission || "N/A"}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{order.vendor_amount || "N/A"}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDownloadPdf(order)}
                                                    disabled={downloadingPdf}
                                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Download Invoice"
                                                >
                                                    {downloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                </button>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                                                    <StatusIcon size={12} />
                                                    {statusInfo.label}
                                                </span>
                                            </td>

                                            {selectedStatus === "REJECTED" && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{order.reject_reason}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{order.rejected_by}</span>
                                                    </td>
                                                </>
                                            )}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {getActionButton(order)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="11" className="px-6 py-12 text-center">
                                        <Package size={48} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No orders found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredOrders.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
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
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
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

            {/* ========== VENDOR DETAILS MODAL ========== */}
            <OrderDetailsModal
                isOpen={showDetailsModal}
                onClose={handleCloseDetails}
                orderDetails={orderDetails}
                loading={false}
            />

            {/* Action Confirmation Modal */}
            <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} title="Confirm Action" maxWidth="max-w-md">
                {selectedOrder && (
                    <div className="space-y-4">
                        <p className="text-gray-700 font-medium">
                            Are you sure you want to <span className="font-semibold text-purple-600">{actionType}</span> order
                            <span className="font-semibold text-gray-900"> #{selectedOrder.id}</span>?
                        </p>
                        {actionType === "reject" && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 block">Rejection Reason</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Enter rejection reason..."
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
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