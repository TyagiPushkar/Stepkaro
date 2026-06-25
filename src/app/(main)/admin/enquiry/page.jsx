// app/admin/enquiries/page.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Phone,
  Building2,
  MapPin,
  Calendar,
  X,
  User,
  Mail,
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
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
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

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
  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name?.toLowerCase().includes(query) ||
          e.mobile?.includes(query) ||
          e.business_name?.toLowerCase().includes(query) ||
          e.city?.toLowerCase().includes(query) ||
          e.message?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, enquiries]);

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

  const openDeleteModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/enquiry/delete_enquiry.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedEnquiry.id }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setEnquiries(enquiries.filter((e) => e.id !== selectedEnquiry.id));
        setShowDeleteModal(false);
        setSelectedEnquiry(null);
        showToast("Enquiry deleted successfully");
      } else {
        showToast(result.message || "Failed to delete enquiry", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete enquiry", "error");
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
      "Name",
      "Mobile",
      "City",
      "Business Name",
      "Message",
      "Created At"
    ];

    const rows = exportData.map((e) => [
      e.id || "",
      e.name || "",
      e.mobile || "",
      e.city || "",
      e.business_name || "",
      e.message || "",
      e.created_at || ""
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
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg text-white ${
            toast.type === "success"
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
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-gray-900">
            {filteredEnquiries.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-gray-900">
            {Math.min(endIndex, filteredEnquiries.length)}
          </span>{" "}
          of <span className="text-gray-900">{filteredEnquiries.length}</span> enquiries
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">#{enquiry.id}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {enquiry.name || "—"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {enquiry.mobile || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {enquiry.business_name || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {enquiry.city || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {enquiry.message ? (
                          enquiry.message.length > 30 
                            ? enquiry.message.substring(0, 30) + "..." 
                            : enquiry.message
                        ) : "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(enquiry.created_at)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(enquiry)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(enquiry)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 size={16} />
                        </button>
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
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
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

      {/* View Enquiry Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Enquiry ID</p>
                <p className="text-sm font-medium text-gray-900">#{selectedEnquiry.id}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <User size={16} className="text-purple-600" />
                Customer Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEnquiry.name || "—"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEnquiry.mobile || "—"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Business Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEnquiry.business_name || "—"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEnquiry.city || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MessageSquare size={16} className="text-orange-500" />
                Message
              </p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedEnquiry.message || "No message provided"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(selectedEnquiry.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Enquiry Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Enquiry"
        maxWidth="max-w-md"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this enquiry from{" "}
          <span className="text-gray-900 font-semibold">{selectedEnquiry?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}   



