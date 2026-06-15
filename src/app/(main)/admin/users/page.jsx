"use client";
import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

const [approvalData, setApprovalData] = useState({
  wallet_value: "",
  minimum_order_value: "",
});

const [approvalUser, setApprovalUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "buyer",
    address: "",
    status: "pending",
  });

  // Users state
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php",
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
          }));

          // vendors
          const vendors = result.data.vendors.map((vendor) => ({
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
            rawData: vendor,
          }));

          setUsers([...buyers, ...vendors]);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filters
  const filters = [
    { label: "All Users", value: "all", count: users.length, color: "teal" },
    {
      label: "Pending Requests",
      value: "pending",
      count: users.filter((u) => u.status === "pending").length,
      color: "yellow",
    },
    {
      label: "Sellers",
      value: "seller",
      count: users.filter((u) => u.role === "seller").length,
      color: "blue",
    },
    {
      label: "Buyers",
      value: "buyer",
      count: users.filter((u) => u.role === "buyer").length,
      color: "green",
    },
    {
  label: "Active",
  value: "active",
  count: users.filter((u) => u.status === "active").length,
},

{
  label: "Inactive",
  value: "inactive",
  count: users.filter((u) => u.status === "inactive").length,
},
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
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.phone.includes(query) ||
          u.address.toLowerCase().includes(query) ||
          u.id.toString().includes(query),
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
  });

  setShowApprovalModal(true);
};

 

const approveUser = async () => {

  const token = localStorage.getItem("access_token");

  try {

    console.log("Approve clicked");
    console.log("approvalUser", approvalUser);
    console.log("approvalData", approvalData);

    if (approvalUser.role === "buyer") {

      if (approvalData.wallet_value) {

        const walletResponse = await fetch(
          "https://namami-infotech.com/Stepkaro/src/super_admin/set_wallet_user.php",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              buyer_id: approvalUser.id,
              wallet_value: approvalData.wallet_value,
            }),
          }
        );

        const walletResult = await walletResponse.json();

        console.log("Wallet Response", walletResult);
      }

      const statusResponse = await fetch(
        "https://namami-infotech.com/Stepkaro/src/admin/update_user_status_admin.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_type: "buyer",
            id: approvalUser.id,
            status: "active",
          }),
        }
      );

      const statusResult = await statusResponse.json();

      console.log("Status Response", statusResult);

    } else {

      if (approvalData.minimum_order_value) {

        const minimumResponse = await fetch(
          "https://namami-infotech.com/Stepkaro/src/admin/set_vendor_minimum_order.php",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vendor_id: approvalUser.id,
              minimum_order_value:
                approvalData.minimum_order_value,
            }),
          }
        );

        const minimumResult = await minimumResponse.json();

        console.log(
          "Minimum Order Response",
          minimumResult
        );
      }

      const statusResponse = await fetch(
        "https://namami-infotech.com/Stepkaro/src/admin/update_user_status_admin.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_type: "vendor",
            id: approvalUser.id,
            status: "active",
          }),
        }
      );

      const statusResult = await statusResponse.json();

      console.log("Status Response", statusResult);
    }

    setShowApprovalModal(false);

window.location.reload();

  

  } catch (error) {

    console.log("Approve Error", error);

  }
};

 
  // const handleAddUser = () => {
  //   if (
  //     !formData.name.trim() ||
  //     !formData.email.trim() ||
  //     !formData.phone.trim()
  //   ) {
  //     alert("Please fill all required fields");
  //     return;
  //   }

  //   const newId = Math.max(...users.map((u) => u.id), 0) + 1;
  //   const newUser = {
  //     id: newId,
  //     name: formData.name,
  //     email: formData.email,
  //     phone: formData.phone,
  //     role: formData.role,
  //     address: formData.address,
  //     status: formData.status,
  //     avatar: formData.role === "seller" ? "👨" : "👩",
  //     createdAt: new Date().toISOString().split("T")[0],
  //   };
  //   setUsers([...users, newUser]);
  //   setShowAddModal(false);
  //   setFormData({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     role: "buyer",
  //     address: "",
  //     status: "pending",
  //   });
  // };

  // Edit user
  // const handleEditUser = () => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === selectedUser.id
  //         ? {
  //             ...user,
  //             name: formData.name,
  //             email: formData.email,
  //             phone: formData.phone,
  //             role: formData.role,
  //             address: formData.address,
  //             status: formData.status,
  //           }
  //         : user,
  //     ),
  //   );
  //   setShowEditModal(false);
  //   setSelectedUser(null);
  // };

  // Delete user
  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Open modals
  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
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
      user.status ,
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
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    return role === "seller"
      ? "bg-blue-500/20 text-blue-400"
      : "bg-green-500/20 text-green-400";
  };
const getStatusBadge = (status) => {
  if (status === "active") {
    return "bg-emerald-500/20 text-emerald-400";
  }

  if (status === "pending") {
    return "bg-yellow-500/20 text-yellow-400";
  }

  return "bg-red-500/20 text-red-400";
};
  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };
  const updateUserStatus = async (user, status) => {

  const token = localStorage.getItem("access_token");

  try {

    await fetch(
      "https://namami-infotech.com/Stepkaro/src/admin/update_user_status_admin.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_type:
            user.role === "buyer"
              ? "buyer"
              : "vendor",
          id: user.id,
          status,
        }),
      }
    );

    window.location.reload();

  } catch (error) {
    console.log(error);
  }
};

  // Stats summary
  
  const requested = users.filter((u) => u.status === "pending").length;
  const totalSellers = users.filter((u) => u.role === "seller").length;
  const totalBuyers = users.filter((u) => u.role === "buyer").length;
 const inactiveUsers =
  users.filter(
    (u) => u.status === "inactive"
  ).length;

  if (loading) {
    return <div className="text-white p-6">Loading users...</div>;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your platform users
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create User
          </button> */}

          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-white/10"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       
        {/* total pending requests */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <UsersIcon size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{requested}</p>
              <p className="text-xs text-gray-400">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <UsersIcon size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalSellers}</p>
              <p className="text-xs text-gray-400">Sellers</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <UsersIcon size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalBuyers}</p>
              <p className="text-xs text-gray-400">Buyers</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inactiveUsers}</p>
              <p className="text-xs text-gray-400">Inactive Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
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
            {filteredUsers.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-white">
            {Math.min(endIndex, filteredUsers.length)}
          </span>{" "}
          of <span className="text-white">{filteredUsers.length}</span> users
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Address
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
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={`${user.type}-${user.id}`}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">#{user.id}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-base border border-white/10">
                          {user.avatar}
                        </div>
                        <p className="text-sm font-medium text-white">
                          {user.name}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{user.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(user.role)}`}
                      >
                        {user.role === "seller" ? "Seller" : "Buyer"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400 max-w-xs truncate">
                        {user.address}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {user.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openApprovalModal(user)}
                            className="px-3 py-1 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                          >
                            Accept Request
                          </button>

                          <button
                           onClick={() =>
  updateUserStatus(user, "inactive")
}
                            className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                          >
                            Reject Request
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
      : "active"
  )
}
                            className={`relative h-6 w-12 rounded-full transition ${
                              user.status === "active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                                user.status === "active"
                                  ? "left-6"
                                  : "left-0.5"
                              }`}
                            />
                          </button>

                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(
                              user.status,
                            )}`}
                          >
                            {user.status }
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          onClick={() => openDeleteModal(user)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <UsersIcon
                      size={48}
                      className="text-gray-600 mx-auto mb-3"
                    />
                    <p className="text-gray-400">No users found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search or create a new user
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-teal-500/20 text-teal-400"
                    : "bg-slate-800 hover:bg-slate-700 text-gray-400"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
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
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">{selectedUser?.name}</span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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
      <Modal
  isOpen={showApprovalModal}
  onClose={() => setShowApprovalModal(false)}
  title={
    approvalUser?.role === "buyer"
      ? "Approve Buyer"
      : "Approve Seller"
  }
>
  <div className="space-y-4">

    {approvalUser?.role === "buyer" ? (

      <div>
        <label className="text-sm text-gray-400 block mb-1">
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
  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
  placeholder="Enter minimum wallet balance"
/>
      </div>

    ) : (

      <div>
        <label className="text-sm text-gray-400 block mb-1">
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
  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white"
  placeholder="Enter minimum cart value"
/>
      </div>

    )}

    <button
      onClick={approveUser}
      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
    >
      Approve User
    </button>

  </div>
</Modal>

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-3xl border border-white/10">
                {selectedUser.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
                <p className="text-xs text-gray-500">{selectedUser.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="text-sm font-semibold text-white">
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
                <p className="text-sm text-white">{selectedUser.createdAt}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm text-white">{selectedUser.address}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
