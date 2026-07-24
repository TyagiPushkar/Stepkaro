// app/admin/enquiries/page.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  X,
  User,
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Package,
  IndianRupee,
  Tag,
  Layers,
  Ruler,
  Palette,
  Info,
  MapPin,
  Calendar,
  Phone,
  Building2,
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-xl border border-gray-200 w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  //filter of date..................
  // Existing states ke saath ye add karein
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/enquiry/get_enquiry.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log(result.data)
        setEnquiries(result.data || []);
      } else {
        setError(result.message || "Failed to fetch enquiries");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEnquiries();
    }
  }, [token]);

  // Filter enquiries
  // Filter enquiries with date range
  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name?.toLowerCase().includes(query) ||
          e.mobile?.includes(query) ||
          e.buyer_shop_name?.toLowerCase().includes(query) ||
          e.vendor_brand_name?.toLowerCase().includes(query) ||
          e.vendor_phone?.includes(query) ||
          e.business_name?.toLowerCase().includes(query) ||
          e.city?.toLowerCase().includes(query) ||
          e.message?.toLowerCase().includes(query) ||
          e.article_name?.toLowerCase().includes(query)
      );
    }

    // Date Range Filter - ADD THIS
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // End of day

      filtered = filtered.filter((e) => {
        if (!e.created_at) return false;
        const createdDate = new Date(e.created_at);
        return createdDate >= from && createdDate <= to;
      });
    } else if (fromDate) {
      const from = new Date(fromDate);
      filtered = filtered.filter((e) => {
        if (!e.created_at) return false;
        const createdDate = new Date(e.created_at);
        return createdDate >= from;
      });
    } else if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => {
        if (!e.created_at) return false;
        const createdDate = new Date(e.created_at);
        return createdDate <= to;
      });
    }

    return filtered;
  }, [searchQuery, enquiries, fromDate, toDate]); // <- Add dependencies

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const openViewModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowViewModal(true);
  };

  // Handle Status Change Query
  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      setUpdatingId(enquiryId);

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/enquiry/update_enquiry_status.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: enquiryId,
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update local state to immediately reflect the change
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === enquiryId ? { ...item, status: newStatus } : item
          )
        );
        showToast(`Status updated to "${newStatus}" successfully!`);
      } else {
        showToast(result.message || "Failed to update status", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      showToast("No enquiries to export", "error");
      return;
    }

    const exportData = filteredEnquiries.length > 0 ? filteredEnquiries : enquiries;

    const headers = [
      "ID",
      "Display Name",
      "Shop Name",
      "Brand Name",
      "Mobile",
      "State",
      "District",
      "Message",
      "Created At",
      "Status"
    ];

    const rows = exportData.map((e) => [
      e.id || "",
      `${e.article_name} | ${e.variant} | ${e.color} | ${e.packing_type} | ${e.category_name}`,
      e.buyer_shop_name || "",
      e.vendor_brand_name || "",
      e.mobile || "",
      e.buyer_state || "",
      e.buyer_district || "",
      e.message || "",
      e.created_at || "",
      e.status || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${exportData.length} enquiries successfully`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get product status badge
  const getProductStatusBadge = (status) => {
    if (status === "active") {
      return "bg-emerald-100 text-emerald-700";
    } else if (status === "inactive") {
      return "bg-red-100 text-red-700";
    } else if (status === "approve_request") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 font-medium">Error loading enquiries</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage product enquiries from customers
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">

          <div className="relative flex-1 lg:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search enquiries..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>


          <button
            onClick={handleExportCSV}
            className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-purple-200"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
          <p className="text-xs text-gray-500">Total Enquiries</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-purple-600">
            {enquiries.filter((e) => e.name).length}
          </p>
          <p className="text-xs text-gray-500">From Customers</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-orange-500">
            {new Set(enquiries.map((e) => e.city).filter(Boolean)).size}
          </p>
          <p className="text-xs text-gray-500">Cities</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <p className="text-2xl font-bold text-emerald-600">
            {enquiries.filter((e) => e.message).length}
          </p>
          <p className="text-xs text-gray-500">With Messages</p>
        </div>
      </div>

      {/* Results Summary */}
      {/* Results Summary - Updated with better date filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-gray-900">
            {filteredEnquiries.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-gray-900">
            {Math.min(endIndex, filteredEnquiries.length)}
          </span>{" "}
          of <span className="text-gray-900 font-medium">{filteredEnquiries.length}</span> enquiries
          {(fromDate || toDate) && (
            <span className="text-xs text-purple-600 ml-2 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              📅 Filtered
            </span>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter - Simple Horizontal Layout */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Calendar size={16} className="text-purple-600" />

            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500 font-medium">From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <span className="text-gray-400">→</span>

            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500 font-medium">To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                onClick={clearFilters}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear date filter"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                {/* <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */}
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEnquiries.length > 0 ? (
                currentEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">#{enquiry.id}</span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                          {enquiry.image ? (
                            <img
                              src={enquiry.image}
                              alt={enquiry.article_name || "Product"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {/* {enquiry.article_name || "—"} */}
                            {enquiry.article_name} | {enquiry.variant} |{" "}
                            {enquiry.color} | {enquiry.packing_type} |{" "}
                            {enquiry.category_name}
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            ₹{enquiry.selling_price || enquiry.price || 0}
                          </p> */}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {enquiry.buyer_shop_name || "—"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {enquiry.mobile || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {enquiry.buyer_state || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {enquiry.buyer_district || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {enquiry.vendor_brand_name || "—"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {enquiry.vendor_phone || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {enquiry.message ? (
                          enquiry.message.length > 30
                            ? enquiry.message.substring(0, 30) + "..."
                            : enquiry.message
                        ) : "—"}
                      </span>
                    </td>

                    {/* <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">
                        {enquiry.status}
                      </span>
                    </td> */}

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(enquiry.created_at)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {updatingId === enquiry.id ? (
                          <Loader2 size={18} className="animate-spin text-purple-600" />
                        ) : (
                          <select
                            value={enquiry.status || "new"}
                            onChange={(e) => handleStatusUpdate(enquiry.id, e.target.value)}
                            className="bg-white border border-gray-300 hover:border-purple-500 rounded-lg text-xs py-1.5 px-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all"
                          >
                            <option value="new">new</option>
                            <option value="open">open</option>
                            <option value="inprogress">inprogress</option>
                            <option value="resolved">resolved</option>
                            <option value="closed">closed</option>
                          </select>
                        )}
                        {/* <button
                          onClick={() => openViewModal(enquiry)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye size={16} />
                          <span className="text-xs font-medium">View</span>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No enquiries found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEnquiries.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of{" "}
              {filteredEnquiries.length} enquiries
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

      {/* View Enquiry Modal with Product Details */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            {/* Enquiry & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">Enquiry ID</p>
                <p className="text-sm font-medium text-gray-900">#{selectedEnquiry.id}</p>
                <p className="text-xs text-gray-500 mt-2">Created At</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(selectedEnquiry.created_at)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={14} className="text-purple-600" /> Customer
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedEnquiry.name || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Phone size={14} className="text-purple-600" /> Mobile
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedEnquiry.mobile || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Building2 size={14} className="text-purple-600" /> Business
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedEnquiry.business_name || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin size={14} className="text-purple-600" /> City
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedEnquiry.city || "—"}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <MessageSquare size={14} className="text-orange-500" /> Message
              </p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedEnquiry.message || "No message provided"}
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={18} className="text-purple-600" />
                Product Details
              </h3>

              {selectedEnquiry.article_name ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Image */}
                  <div className="flex justify-center">
                    <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {selectedEnquiry.image ? (
                        <img
                          src={selectedEnquiry.image}
                          alt={selectedEnquiry.article_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={48} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Product Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedEnquiry.article_name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Selling Price</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          ₹{selectedEnquiry.selling_price || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Original Price</p>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{selectedEnquiry.price || 0}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedEnquiry.stock_quantity || 0} units
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getProductStatusBadge(selectedEnquiry.product_status)}`}>
                          {selectedEnquiry.product_status || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {selectedEnquiry.variant && (
                        <div>
                          <p className="text-xs text-gray-500">Variant</p>
                          <p className="text-sm text-gray-900">{selectedEnquiry.variant}</p>
                        </div>
                      )}
                      {selectedEnquiry.size && (
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-sm text-gray-900">{selectedEnquiry.size}</p>
                        </div>
                      )}
                      {selectedEnquiry.color && (
                        <div>
                          <p className="text-xs text-gray-500">Color</p>
                          <p className="text-sm text-gray-900">{selectedEnquiry.color}</p>
                        </div>
                      )}
                    </div>

                    {(selectedEnquiry.gender || selectedEnquiry.material || selectedEnquiry.origin) && (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedEnquiry.gender && (
                          <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="text-sm text-gray-900">{selectedEnquiry.gender}</p>
                          </div>
                        )}
                        {selectedEnquiry.material && (
                          <div>
                            <p className="text-xs text-gray-500">Material</p>
                            <p className="text-sm text-gray-900">{selectedEnquiry.material}</p>
                          </div>
                        )}
                        {selectedEnquiry.origin && (
                          <div>
                            <p className="text-xs text-gray-500">Origin</p>
                            <p className="text-sm text-gray-900">{selectedEnquiry.origin}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedEnquiry.product_description && (
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {selectedEnquiry.product_description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package size={40} className="mx-auto mb-2 text-gray-300" />
                  <p>No product associated with this enquiry</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}