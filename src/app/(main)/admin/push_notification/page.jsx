"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Send,
  Users,
  User,
  Tag,
  Image as ImageIcon,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  Eye,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    image: null,
    imagePreview: null,
    targetAudience: "all", // all, vendors, customers, specific_user
    userId: "",
    userType: "", // vendor, customer
    deepLink: "",
    scheduledDate: "",
    scheduledTime: "",
    priority: "normal", // normal, high
  });

  const [showSendModal, setShowSendModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const imageInputRef = useRef(null);
  const token = localStorage.getItem("access_token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://namami-infotech.com/Stepkaro/src/notification/get_notifications.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        console.log(response.data.data);
        setNotifications(response.data.data || []);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch notifications",
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showToast(error.message || "Failed to load notifications", "error");
      // For demo, add sample data
      setNotifications([
        {
          id: 1,
          title: "Welcome to Stepkaro",
          body: "Thank you for joining our platform!",
          image: null,
          sent_at: new Date().toISOString(),
          status: "sent",
          target_audience: "all",
          sent_count: 150,
          delivered_count: 120,
          read_count: 80,
        },
        {
          id: 2,
          title: "New Product Launch",
          body: "Check out our latest collection!",
          image: "https://via.placeholder.com/300",
          sent_at: new Date(Date.now() - 86400000).toISOString(),
          status: "sent",
          target_audience: "vendors",
          sent_count: 45,
          delivered_count: 40,
          read_count: 25,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send notification
  const sendNotification = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Validate form
      if (!formData.title.trim()) {
        showToast("Please enter a title", "error");
        setSending(false);
        return;
      }
      if (!formData.body.trim()) {
        showToast("Please enter a message body", "error");
        setSending(false);
        return;
      }

      // Prepare payload
      const payload = {
        title: formData.title,
        body: formData.body,
        target_audience: formData.targetAudience,
        user_id: formData.userId || null,
        user_type: formData.userType || null,
        deep_link: formData.deepLink || null,
        priority: formData.priority,
        // scheduled_at:
        //   formData.scheduledDate && formData.scheduledTime
        //     ? `${formData.scheduledDate} ${formData.scheduledTime}`
        //     : null,
        scheduled_at: formData.scheduledDate ? formData.scheduledDate : null,
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formDataToSend.append(key, payload[key]);
        }
      });

      // Add image if exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      // Console log FormData
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `https://namami-infotech.com/Stepkaro/src/notification/create_notification.php`, // Use API_BASE constant
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // FIX 1: Access data through response.data
      if (
        response.data &&
        (response.data.success || response.data.status === "success")
      ) {
        showToast("Notification sent successfully!");
        resetForm();
        setShowSendModal(false);
        if (typeof fetchNotifications === "function") {
          fetchNotifications();
        }
      } else {
        throw new Error(
          response.data?.message || "Failed to send notification",
        );
      }
    } catch (error) {
      console.error("Error sending notification:", error);

      // FIX 2: Safely extract error message from API response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send notification";

      showToast(errorMessage, "error");
    } finally {
      setSending(false);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    try {
      const response = await axios.delete(
        `https://namami-infotech.com/Stepkaro/src/notification/delete_notification.php?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showToast("Notification deleted successfully");
        fetchNotifications();
      } else {
        throw new Error(
          response.data.message || "Failed to delete notification",
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      showToast(error.message || "Failed to delete notification", "error");
    }
  };

  // Resend notification
  const resendNotification = async (id) => {
    try {
      const response = await axios.post(
        `https://namami-infotech.com/Stepkaro/src/notification/resend_notification.php`,
        { notification_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showToast("Notification resent successfully");
        fetchNotifications();
      } else {
        throw new Error(
          response.data.message || "Failed to resend notification",
        );
      }
    } catch (error) {
      console.error("Error resending notification:", error);
      showToast(error.message || "Failed to resend notification", "error");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      image: null,
      imagePreview: null,
      targetAudience: "all",
      userId: "",
      userType: "",
      deepLink: "",
      scheduledDate: "",
      scheduledTime: "",
      priority: "normal",
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.body?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      notif.status === selectedFilter ||
      notif.target_audience === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    fetchNotifications();
    // Request permission on load
    // requestPermissionAndGetToken();
  }, []);

  // Listen for foreground messages
  // useEffect(() => {
  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     console.log("Message received in foreground:", payload);
  //     showToast(payload.notification?.body || "New notification received");
  //     // You can show a custom notification here
  //   });

  // return () => {
  //   unsubscribe();
  // };
  // }, []);

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      sent: { label: "Sent", color: "bg-green-100 text-green-700" },
      scheduled: { label: "Scheduled", color: "bg-yellow-100 text-yellow-700" },
      failed: { label: "Failed", color: "bg-red-100 text-red-700" },
      draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
    };
    return (
      badges[status] || {
        label: status || "Unknown",
        color: "bg-gray-100 text-gray-600",
      }
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="text-purple-600" size={24} />
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Send and manage push notifications
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchNotifications}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowSendModal(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={18} />
            New Notification
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={selectedFilter}
          onChange={(e) => {
            setSelectedFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="scheduled">Scheduled</option>
          <option value="failed">Failed</option>
          <option value="draft">Draft</option>
          <option value="all">All Users</option>
          <option value="vendors">Vendors</option>
          <option value="customers">Buyer</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">Total</p>
          <p className="text-2xl font-bold">{notifications.length}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">Sent</p>
          <p className="text-2xl font-bold">
            {notifications.filter((n) => n.status === "sent").length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">Scheduled</p>
          <p className="text-2xl font-bold">
            {notifications.filter((n) => n.status === "scheduled").length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-4 text-white">
          <p className="text-xs opacity-90">Failed</p>
          <p className="text-2xl font-bold">
            {notifications.filter((n) => n.status === "failed").length}
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Loading notifications...</p>
                  </td>
                </tr>
              ) : currentNotifications.length > 0 ? (
                currentNotifications.map((notification) => {
                  const statusBadge = getStatusBadge(notification.status);
                  return (
                    <tr
                      key={notification.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {notification.image && (
                            <img
                              src={notification.image}
                              alt={notification.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {notification.body}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {notification.target_audience === "customers"
                            ? "Buyer"
                            : notification.target_audience || "All"}
                        </span>

                        {notification.user_type && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full ml-1">
                            {notification.user_type === "customers"
                              ? "Buyer"
                              : notification.user_type}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Users size={12} className="text-gray-400" />
                            <span className="text-gray-600">Sent: {notification.sent_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-emerald-500" />
                            <span className="text-gray-600">Delivered: {notification.delivered_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} className="text-blue-500" />
                            <span className="text-gray-600">Read: {notification.read_count || 0}</span>
                          </div>
                        </div>
                      </td> */}

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {notification.scheduled_at
                            ? notification.scheduled_at
                            : "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(notification.sent_at)}
                        </div>
                      </td>

                      {/* <td className="px-6 py-4">
                        <div className="flex gap-2"> */}
                      {/* <button
                            onClick={() => {
                              setSelectedNotification(notification);
                              setShowDetailsModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button> */}
                      {/* {notification.status === "failed" && (
                            <button
                              onClick={() =>
                                resendNotification(notification.id)
                              }
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Resend"
                            >
                              <RefreshCw size={16} />
                            </button>
                          )} */}
                      {/* <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button> */}
                      {/* </div>
                      </td> */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Bell size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first notification
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredNotifications.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
              {/* <span className="text-gray-900">
                {Math.min(endIndex, filteredNotifications.length)}
              </span>{" "} */}
              of{" "}
              <span className="text-gray-900">
                {filteredNotifications.length}
              </span>{" "}
              notifications
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

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Send size={20} className="text-purple-600" />
                Send Notification
              </h2>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  resetForm();
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={sendNotification} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter notification title"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  maxLength="100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  placeholder="Enter notification message"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                  maxLength="500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.body.length}/500 characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="notification-image"
                  />
                  <label
                    htmlFor="notification-image"
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <ImageIcon size={18} />
                    Choose Image
                  </label>
                  {formData.imagePreview && (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="all">All Users</option>
                    <option value="customers">Buyer</option>
                    <option value="vendors">Vendors</option>
                    {/* <option value="specific_user">Specific User</option> */}
                  </select>
                </div>

                {formData.targetAudience === "specific_user" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      placeholder="Enter user ID"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required={formData.targetAudience === "specific_user"}
                    />
                  </div>
                )}

                {/* {(formData.targetAudience === "vendors" || formData.targetAudience === "customers") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Type
                    </label>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All {formData.targetAudience}</option>
                      <option value="premium">Premium</option>
                      <option value="new">New</option>
                    </select>
                  </div>
                )} */}
              </div>

              {/* Deep Link */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deep Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.deepLink}
                  onChange={(e) => setFormData({ ...formData, deepLink: e.target.value })}
                  placeholder="https://stepkaro.com/..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div> */}

              {/* Schedule and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {/* <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="w-32 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    /> */}
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div> */}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowSendModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Notification Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedNotification.image && (
                <img
                  src={selectedNotification.image}
                  alt={selectedNotification.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Title
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedNotification.title}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Message
                </label>
                <p className="text-gray-700">{selectedNotification.body}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Target
                  </label>
                  <p className="text-gray-900">
                    {selectedNotification.target_audience || "All"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </label>
                  <p className="text-gray-900">
                    {selectedNotification.status || "Unknown"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Sent At
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedNotification.sent_at)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">
                  Statistics
                </label>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedNotification.sent_count || 0}
                    </p>
                    <p className="text-xs text-gray-500">Sent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedNotification.delivered_count || 0}
                    </p>
                    <p className="text-xs text-gray-500">Delivered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedNotification.read_count || 0}
                    </p>
                    <p className="text-xs text-gray-500">Read</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
