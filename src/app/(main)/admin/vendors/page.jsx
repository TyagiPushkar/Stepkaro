"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  User,
  Store,
  Truck,
  Package,
  CreditCard,
  Loader2,
  Pencil,
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-xl border border-gray-200 w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const VENDOR_UPDATE_API =
  "https://namami-infotech.com/Stepkaro/src/vender/update_vendor_details.php";

export default function SellerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // editable
  // const [editLoading, setEditLoading] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false); // <-- ADD THIS
  const [editingRankingId, setEditingRankingId] = useState(null); // <-- ADD THIS
  const [newRankingValue, setNewRankingValue] = useState(""); // <-- ADD THIS

  const [approvalData, setApprovalData] = useState({
    wallet_value: "",
    minimum_order_value: "",
    settlement_days: "",
  });

  // SellerPage component ke andar, existing states ke sath ye add karo
  const [settlementData, setSettlementData] = useState({
    minimum_order_value: "",
    settlement_days: "",
  });
  const [settlementSaving, setSettlementSaving] = useState(false);
  const [editingSettlementId, setEditingSettlementId] = useState(null);

  const [approvalUser, setApprovalUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    status: "pending",
    // Common fields
    state: "",
    district: "",
    delivery_location: "",
    logistic_partner_name: "",
    logistic_contact_no: "",
    document_number: "",
    document_image: "",
    // Vendor specific
    business_name: "",
    gst_number: "",
    pan_number: "",
    city: "",
    country: "",
    pincode: "",
    wallet_value: "",
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php?type=seller",
      );

      const result = await response.json();

      if (result.success) {
        // buyers
        const buyers = result.data.buyers.map((buyer) => ({
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
          phone: buyer.phone,
          role: "buyer",
          address: buyer.address,
          status: buyer.status,
          avatar: "👤",
          createdAt: buyer.created_at,
          type: "buyer",
          rawData: buyer,
          // Buyer specific fields
          state: buyer.state,
          district: buyer.district,
          delivery_location: buyer.delivery_location,
          logistic_partner_name: buyer.logistic_partner_name,
          logistic_contact_no: buyer.logistic_contact_no,
          document_number: buyer.document_number,
          document_image: buyer.document_image,
          wallet_value: buyer.wallet_value || "",
        }));

        // vendors
        const vendors = result.data.vendors.map((vendor) => ({
          id: vendor.id,
          name: vendor.owner_name,
          brand: vendor.brand_name,
          brand_id: vendor.brand_id,
          // ranking: vendor.ranking,
          minimum_value: vendor.minimum_order_value,
          ranking: vendor.sort_order,
          settlement_date: vendor.due_days,
          email: vendor.email,
          phone: vendor.phone,
          role: "seller",
          address: vendor.address,
          status: vendor.status,
          avatar: "🏪",
          createdAt: vendor.created_at,
          type: "vendor",
          business_name: vendor.business_name,
          gst_number: vendor.gst_number,
          pan_number: vendor.pan_number,
          city: vendor.city,
          state: vendor.state,
          country: vendor.country,
          pincode: vendor.pincode,
          wallet_value: vendor.wallet_value || "",
          rawData: vendor,
        }));

        setUsers([...buyers, ...vendors]);
        // console.log("Fetched users:", [...buyers, ...vendors]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filters
  const filters = [
    { label: "All Users", value: "all", count: users.length, color: "purple" },
    {
      label: "Pending Requests",
      value: "pending",
      count: users.filter((u) => u.status === "pending").length,
      color: "yellow",
    },
    // {
    //   label: "Sellers",
    //   value: "seller",
    //   count: users.filter((u) => u.role === "seller").length,
    //   color: "blue",
    // },
    // {
    //   label: "Buyers",
    //   value: "buyer",
    //   count: users.filter((u) => u.role === "buyer").length,
    //   color: "green",
    // },
    {
      label: "Active",
      value: "active",
      count: users.filter((u) => u.status === "active").length,
      color: "emerald",
    },
    {
      label: "Inactive",
      value: "inactive",
      count: users.filter((u) => u.status === "inactive").length,
      color: "red",
    },
    // {
    //   label: "Rejected",
    //   value: "reject",
    //   count: users.filter((u) => u.status === "reject").length,
    //   color: "red",
    // },
  ];

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (u) => u.role === selectedFilter || u.status === selectedFilter,
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.phone?.includes(query) ||
          u.address?.toLowerCase().includes(query) ||
          u.id?.toString().includes(query) ||
          u.business_name?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [selectedFilter, searchQuery, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    setCurrentPage(1);
  };

  const openApprovalModal = (user) => {
    setApprovalUser(user);
    setApprovalData({
      wallet_value: "",
      minimum_order_value: "",
      settlement_days: "",
    });
    setShowApprovalModal(true);
  };

  const approveUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      if (!approvalUser || !approvalUser.id) {
        alert("No active user selected for approval context.");
        return;
      }

      const currentRole = approvalUser.role === "buyer" ? "buyer" : "vendor";

      const rawAmount =
        currentRole === "buyer"
          ? approvalData.wallet_value
          : approvalData.minimum_order_value;

      const payload = {
        id: Number(approvalUser.id),
        role: currentRole,
        status: "active",
        amount:
          rawAmount !== "" && rawAmount !== undefined ? Number(rawAmount) : "",
      };
      // ✅ Sirf vendor ke liye settlement_days add karo
      if (currentRole === "vendor") {
        payload.settlement_days =
          approvalData.settlement_days !== "" &&
            approvalData.settlement_days !== undefined
            ? Number(approvalData.settlement_days)
            : "";
      }

      console.log("Submitting Admin Approval Payload via Axios:", payload);

      const url =
        "https://namami-infotech.com/Stepkaro/src/super_admin/approve_seller_buyer.php";

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        alert(result.message || "User approved successfully!");

        setShowApprovalModal(false);
        setApprovalData({
          wallet_value: "",
          minimum_order_value: "",
          settlement_days: "",
        });

        if (result.success) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === approvalUser.id && u.type === approvalUser.type
                ? {
                  ...u,
                  status: "active",
                  wallet_value:
                    approvalUser.role === "buyer"
                      ? approvalData.wallet_value
                      : u.wallet_value,
                  settlement_days:
                    approvalUser.role === "vendor"
                      ? approvalData.settlement_days
                      : u.settlement_days,
                }
                : u,
            ),
          );

          setShowApprovalModal(false);

          showToast("User approved successfully");
        }
      } else {
        alert(result.message || "Failed to process approval request.");
      }
    } catch (error) {
      console.error("Axios request failure:", error);
      const errorMsg =
        error.response?.data?.message || "Network communication error.";
      alert(errorMsg);
    }
  };

  // Delete user
  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    showToast("User deleted successfully");
  };

  // Open modals
  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      address: user.address || "",
      status: user.status || "pending",
      // Common fields
      state: user.state || "",
      district: user.district || "",
      delivery_location: user.delivery_location || "",
      logistic_partner_name: user.logistic_partner_name || "",
      logistic_contact_no: user.logistic_contact_no || "",
      document_number: user.document_number || "",
      document_image: user.document_image || "",
      wallet_value: user.wallet_value || "",
      // Vendor specific
      business_name: user.business_name || "",
      gst_number: user.gst_number || "",
      pan_number: user.pan_number || "",
      city: user.city || "",
      country: user.country || "India",
      pincode: user.pincode || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Handle ranking edit
  const startRankingEdit = (user) => {
    setEditingRankingId(user.id);
    setNewRankingValue(user.ranking?.toString() || "");
  };

  const cancelRankingEdit = () => {
    setEditingRankingId(null);
    setNewRankingValue("");
  };

  const updateBrandRanking = async (brandId) => {
    setRankingLoading(true);
    const token = localStorage.getItem("access_token");
    console.log(
      "Updating Brand Ranking for Brand ID:",
      brandId,
      "New Ranking Value:",
      newRankingValue,
    );

    try {
      const payload = {
        brandId: Number(brandId),
        newPosition: Number(newRankingValue),
      };
      console.log("Submitting Brand Ranking Update Payload:", payload);

      const response = await axios.post(
        "https://namami-infotech.com/Stepkaro/src/admin/set_brand_ranking.php",
        payload, // 👉 Body data direct doosre argument mein jata hai
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👉 Baaki headers teesre argument (config object) mein aayenge
          },
        },
      );

      const result = response.data;
      console.log("Response:", result);

      if (result.success) {
        // FIX: Use brandId instead of userId
        setUsers((prev) =>
          prev.map((u) =>
            u.id === brandId ? { ...u, ranking: Number(newRankingValue) } : u,
          ),
        );

        showToast("Brand ranking updated successfully!");
        cancelRankingEdit();
      } else {
        showToast(result.message || "Failed to update ranking", "error");
      }
    } catch (error) {
      console.error("Ranking update error:", error);
      // FIX: Better error handling for axios
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update ranking";
      showToast(errorMsg, "error");
    } finally {
      setRankingLoading(false);
    }
  };

  // Edit user - handle form submit
  const handleEditUser = async () => {
    setEditLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        address: formData.address,
        state: formData.state,
        district: formData.district,
        delivery_location: formData.delivery_location,
        logistic_partner_name: formData.logistic_partner_name,
        logistic_contact_no: formData.logistic_contact_no,
        document_number: formData.document_number,
        document_image: formData.document_image,
      };

      if (
        formData.wallet_value !== "" &&
        formData.wallet_value !== null &&
        formData.wallet_value !== undefined
      ) {
        payload.wallet_value = Number(formData.wallet_value);
      }

      let endpoint = "";
      if (selectedUser.type === "buyer") {
        endpoint =
          "https://namami-infotech.com/Stepkaro/src/buyer/edit_buyer.php";
        payload.buyer_id = formData.id;
      } else {
        endpoint =
          "https://namami-infotech.com/Stepkaro/src/vender/edit_vendor.php";
        payload.business_name = formData.business_name;
        payload.gst_number = formData.gst_number;
        payload.pan_number = formData.pan_number;
        payload.city = formData.city;
        payload.country = formData.country;
        payload.pincode = formData.pincode;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log(text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.log("Invalid JSON:", text);
        return;
      }

      if (result.success) {
        showToast(result.message || "User updated successfully");
        setShowEditModal(false);
        // Refresh the users list
        const fetchResponse = await fetch(
          "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php",
        );
        const fetchResult = await fetchResponse.json();
        if (fetchResult.success) {
          const buyers = fetchResult.data.buyers.map((buyer) => ({
            id: buyer.id,
            name: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            role: "buyer",
            address: buyer.address,
            status: buyer.status,
            avatar: "👤",
            createdAt: buyer.created_at,
            type: "buyer",
            rawData: buyer,
            state: buyer.state,
            district: buyer.district,
            delivery_location: buyer.delivery_location,
            logistic_partner_name: buyer.logistic_partner_name,
            logistic_contact_no: buyer.logistic_contact_no,
            document_number: buyer.document_number,
            document_image: buyer.document_image,
            wallet_value: buyer.wallet_value || "",
          }));

          const vendors = fetchResult.data.vendors.map((vendor) => ({
            id: vendor.id,
            name: vendor.owner_name,
            email: vendor.email,
            phone: vendor.phone,
            role: "seller",
            address: vendor.address,
            status: vendor.status,
            avatar: "🏪",
            createdAt: vendor.created_at,
            type: "vendor",
            business_name: vendor.business_name,
            gst_number: vendor.gst_number,
            pan_number: vendor.pan_number,
            city: vendor.city,
            state: vendor.state,
            country: vendor.country,
            pincode: vendor.pincode,
            wallet_value: vendor.wallet_value || "",
            rawData: vendor,
          }));

          setUsers([...buyers, ...vendors]);
        }
      } else {
        showToast(result.message || "Failed to update user", "error");
      }
    } catch (error) {
      console.log("Edit Error:", error);
      showToast("Failed to update user", "error");
    } finally {
      setEditLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Address",
      "Status",
      "Joined Date",
    ];
    const csvData = users.map((user) => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.address,
      user.status,
      user.createdAt,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Export successful");
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    return role === "seller"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-red-100 text-red-700";
  };

  const updateUserStatus = async (user, status) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/admin/update_user_status_admin.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_type: user.role === "buyer" ? "buyer" : "vendor",
            id: user.id,
            status,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id && u.type === user.type ? { ...u, status } : u,
          ),
        );

        showToast("Status updated successfully");
      } else {
        showToast(result.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to update status", "error");
    }
  };

  //card update..............
  // Settlement aur Minimum Card Value update karne ke liye alag function
  // Settlement aur Minimum Card Value update karne ke liye alag function
  const handleSettlementAndCardUpdate = async (user) => {
    setSettlementSaving(true);
    const token = localStorage.getItem("access_token");

    try {
      const formData = new FormData();
      formData.append("id", user.id);
      formData.append("due_days", settlementData.settlement_days || user.settlement_date || "");
      formData.append("minimum_order_value", settlementData.minimum_order_value || user.minimum_value || "");

      const response = await axios.post(
        `${VENDOR_UPDATE_API}?id=${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                ...u,
                minimum_value: settlementData.minimum_order_value || u.minimum_value,
                settlement_date: settlementData.settlement_days || u.settlement_date,
              }
              : u
          )
        );
        showToast("Settlement & card settings updated!", "success");
        setEditingSettlementId(null);
      }
    } catch (error) {
      showToast("Failed to update settings", "error");
    } finally {
      setSettlementSaving(false);
    }
  };

  // Stats summary
  const requested = users.filter((u) => u.status === "pending").length;
  const totalSellers = users.filter((u) => u.role === "seller").length;
  const totalBuyers = users.filter((u) => u.role === "buyer").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading users...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your platform users
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
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-gray-200 hover:border-purple-300"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UsersIcon size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{requested}</p>
              <p className="text-xs text-gray-500">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalSellers}</p>
              <p className="text-xs text-gray-500">Sellers</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalBuyers}</p>
              <p className="text-xs text-gray-500">Buyers</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {inactiveUsers}
              </p>
              <p className="text-xs text-gray-500">Inactive Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.value;
          const colorMap = {
            purple: "bg-purple-600 text-white",
            yellow: "bg-yellow-100 text-yellow-700",
            blue: "bg-blue-100 text-blue-700",
            green: "bg-green-100 text-green-700",
            emerald: "bg-emerald-100 text-emerald-700",
            red: "bg-red-100 text-red-700",
          };
          const inactiveColorMap = {
            purple:
              "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600",
            yellow:
              "bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:text-yellow-600",
            blue: "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600",
            green:
              "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600",
            emerald:
              "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600",
            red: "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600",
          };
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 whitespace-nowrap border ${isActive
                ? colorMap[filter.color] || "bg-purple-600 text-white"
                : inactiveColorMap[filter.color] ||
                "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
            >
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
            {filteredUsers.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-gray-900">
            {Math.min(endIndex, filteredUsers.length)}
          </span>{" "}
          of <span className="text-gray-900">{filteredUsers.length}</span> users
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

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand Ranking
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Minimum Order Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settlement Days
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={`${user.type}-${user.id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">#{user.id}</span>
                    </td>

                    {/* <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center text-base border border-gray-200">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          {user.business_name && (
                            <p className="text-xs text-gray-500">
                              {user.business_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td> */}

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.brand}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingRankingId === user.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={newRankingValue}
                              onChange={(e) =>
                                setNewRankingValue(e.target.value)
                              }
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              autoFocus
                              min="1"
                            />
                            <button
                              onClick={() => updateBrandRanking(user.brand_id)}
                              disabled={rankingLoading}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                              title="Save ranking"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={cancelRankingEdit}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {user.ranking ?? "-"}
                            </span>
                            {user.role === "seller" && (
                              <button
                                onClick={() => startRankingEdit(user)}
                                className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Edit ranking"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td> */}

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.business_name}</p>
                    </td>

                    {/* Minimum Order Value - Editable */}
                    <td className="px-6 py-4">
                      {editingSettlementId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={settlementData.minimum_order_value}
                            onChange={(e) =>
                              setSettlementData({
                                ...settlementData,
                                minimum_order_value: e.target.value,
                              })
                            }
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Value"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">
                          {user.minimum_value || "—"}
                        </span>
                      )}
                    </td>

                    {/* Settlement Days - Editable */}
                    <td className="px-6 py-4">
                      {editingSettlementId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={settlementData.settlement_days}
                            onChange={(e) =>
                              setSettlementData({
                                ...settlementData,
                                settlement_days: e.target.value,
                              })
                            }
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Days"
                          />
                          <button
                            onClick={() => handleSettlementAndCardUpdate(user)}
                            disabled={settlementSaving}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingSettlementId(null);
                              setSettlementData({
                                minimum_order_value: "",
                                settlement_days: "",
                              });
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Cancel"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {user.settlement_date || "—"} DAYS
                          </span>
                          {user.role === "seller" && (
                            <button
                              onClick={() => {
                                setEditingSettlementId(user.id);
                                setSettlementData({
                                  minimum_order_value: user.minimum_value?.toString() || "",
                                  settlement_days: user.settlement_date?.toString() || "",
                                });
                              }}
                              className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Edit settlement"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* <td className="px-6 py-4">
                      <div className="w-50 whitespace-pre-wrap break-words text-sm text-gray-500">
                        {user.address || user.city || "—"}
                      </div>
                    </td> */}

                    <td className="px-6 py-4">
                      {user.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openApprovalModal(user)}
                            className="px-3 py-1 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateUserStatus(user, "inactive")}
                            className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateUserStatus(
                                user,
                                user.status === "active"
                                  ? "inactive"
                                  : "active",
                              )
                            }
                            className={`relative h-6 w-12 rounded-full transition ${user.status === "active"
                              ? "bg-emerald-500"
                              : "bg-gray-300"
                              }`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${user.status === "active" ? "left-6" : "left-0.5"
                                }`}
                            />
                          </button>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(
                              user.status,
                            )}`}
                          >
                            {user.status}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/vendors/${user.id}`}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/vendors/${user.id}?tab=edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Vendor"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <UsersIcon
                      size={48}
                      className="text-gray-300 mx-auto mb-3"
                    />
                    <p className="text-gray-500">No users found</p>
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
        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-gray-900 font-semibold">
            {selectedUser?.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteUser}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={
          approvalUser?.role === "buyer" ? "Approve Buyer" : "Approve Seller"
        }
      >
        <div className="space-y-4">
          {approvalUser?.role === "buyer" ? (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Minimum Wallet Balance (Optional)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={approvalData.wallet_value ?? ""}
                onChange={(e) =>
                  setApprovalData((prev) => ({
                    ...prev,
                    wallet_value: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter minimum wallet balance"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Minimum Cart Value (Optional)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={approvalData.minimum_order_value ?? ""}
                onChange={(e) =>
                  setApprovalData((prev) => ({
                    ...prev,
                    minimum_order_value: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter minimum cart value"
              />
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Settlement Date
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={approvalData.settlement_days ?? ""}
                onChange={(e) =>
                  setApprovalData((prev) => ({
                    ...prev,
                    settlement_days: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter settlement days"
              />
            </div>
          )}
          <button
            onClick={approveUser}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all"
          >
            Approve User
          </button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${selectedUser?.role === "seller" ? "Seller" : "Buyer"}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Wallet Value
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.wallet_value}
                onChange={(e) =>
                  setFormData({ ...formData, wallet_value: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Address Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Delivery Location
                </label>
                <input
                  type="text"
                  value={formData.delivery_location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      delivery_location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Logistic Details */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Truck size={16} /> Logistic Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={formData.logistic_partner_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      logistic_partner_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Contact No
                </label>
                <input
                  type="text"
                  value={formData.logistic_contact_no}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      logistic_contact_no: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={16} /> Document Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Document Number
                </label>
                <input
                  type="text"
                  value={formData.document_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      document_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Document Image URL
                </label>
                <input
                  type="text"
                  value={formData.document_image}
                  onChange={(e) =>
                    setFormData({ ...formData, document_image: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Path to document image"
                />
              </div>
            </div>
          </div>

          {/* Vendor Specific Fields */}
          {selectedUser?.role === "seller" && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Store size={16} /> Business Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formData.gst_number}
                    onChange={(e) =>
                      setFormData({ ...formData, gst_number: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.pan_number}
                    onChange={(e) =>
                      setFormData({ ...formData, pan_number: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditUser}
              disabled={editLoading}
              className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {editLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Update User
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="User Details"
        maxWidth="max-w-2xl"
      >
        {selectedUser && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center text-3xl border border-gray-200">
                {selectedUser.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.name}
                </h3>
                {selectedUser.business_name && (
                  <p className="text-sm text-purple-600">
                    {selectedUser.business_name}
                  </p>
                )}
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <p className="text-xs text-gray-400">{selectedUser.phone}</p>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="text-sm font-semibold text-gray-900">
                  #{selectedUser.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(selectedUser.role)}`}
                >
                  {selectedUser.role === "seller" ? "Seller" : "Buyer"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedUser.status)}`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined Date</p>
                <p className="text-sm text-gray-900">
                  {selectedUser.createdAt?.split(" ")[0] || "—"}
                </p>
              </div>
              {selectedUser.wallet_value && (
                <div>
                  <p className="text-xs text-gray-500">Wallet Value</p>
                  <p className="text-sm text-gray-900">
                    ₹{selectedUser.wallet_value}
                  </p>
                </div>
              )}
            </div>

            {/* Address Section */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> Address Details
              </p>
              <p className="text-sm text-gray-900">
                {selectedUser.address || selectedUser.city || "—"}
              </p>
              {(selectedUser.city || selectedUser.state) && (
                <p className="text-sm text-gray-500">
                  {selectedUser.city && `${selectedUser.city}, `}
                  {selectedUser.state && `${selectedUser.state}, `}
                  {selectedUser.country && selectedUser.country}
                  {selectedUser.pincode && ` - ${selectedUser.pincode}`}
                </p>
              )}
            </div>

            {/* Buyer Specific Fields */}
            {selectedUser.role === "buyer" && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Package size={14} /> Buyer Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedUser.district && (
                    <div>
                      <p className="text-xs text-gray-500">District</p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.district}
                      </p>
                    </div>
                  )}
                  {selectedUser.delivery_location && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Delivery Location</p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.delivery_location}
                      </p>
                    </div>
                  )}
                  {selectedUser.document_number && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Document Number</p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.document_number}
                      </p>
                    </div>
                  )}
                  {selectedUser.document_image && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Document Image</p>
                      <a
                        href={`https://namami-infotech.com/${selectedUser.document_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
                {(selectedUser.logistic_partner_name ||
                  selectedUser.logistic_contact_no) && (
                    <div className="border-t border-gray-200 pt-3 mt-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Truck size={14} /> Logistic Details
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {selectedUser.logistic_partner_name && (
                          <div>
                            <p className="text-xs text-gray-500">Partner</p>
                            <p className="text-sm text-gray-900">
                              {selectedUser.logistic_partner_name}
                            </p>
                          </div>
                        )}
                        {selectedUser.logistic_contact_no && (
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-sm text-gray-900">
                              {selectedUser.logistic_contact_no}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Vendor Specific Fields */}
            {selectedUser.role === "seller" && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Store size={14} /> Vendor Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedUser.business_name && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Business Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.business_name}
                      </p>
                    </div>
                  )}
                  {selectedUser.gst_number && (
                    <div>
                      <p className="text-xs text-gray-500">GST Number</p>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedUser.gst_number}
                      </p>
                    </div>
                  )}
                  {selectedUser.pan_number && (
                    <div>
                      <p className="text-xs text-gray-500">PAN Number</p>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedUser.pan_number}
                      </p>
                    </div>
                  )}
                  {selectedUser.pincode && (
                    <div>
                      <p className="text-xs text-gray-500">Pincode</p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.pincode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
