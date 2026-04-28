"use client";
import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Wallet,
  CreditCard,
  Coins,
  TrendingUp,
  Users as UsersIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  ChevronDown,
  DollarSign
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
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plan: "Free",
    cod: 0,
    prepaid: 0,
    wallet: 0
  });

  // Users state
  const [users, setUsers] = useState([
    {
      id: 80,
      name: "Guest",
      phone: "821060978",
      email: "guest@example.com",
      plan: "Free",
      cod: 0,
      prepaid: 0,
      wallet: 0,
      avatar: "👤",
      createdAt: "2024-01-15",
      totalOrders: 5,
      totalSpent: 12450
    },
    {
      id: 90,
      name: "MANIAR FOOTWEAR",
      phone: "8686386885",
      email: "maniar@example.com",
      plan: "Premium",
      cod: 12500,
      prepaid: 5000,
      wallet: 2500,
      avatar: "👔",
      createdAt: "2024-01-10",
      totalOrders: 28,
      totalSpent: 175000
    },
    {
      id: 81,
      name: "Guest",
      phone: "9811278725",
      email: "guest2@example.com",
      plan: "Free",
      cod: 0,
      prepaid: 0,
      wallet: 0,
      avatar: "👤",
      createdAt: "2024-01-18",
      totalOrders: 2,
      totalSpent: 3299
    },
    {
      id: 442,
      name: "manav Footwear",
      phone: "8781982078",
      email: "manav@example.com",
      plan: "Business",
      cod: 45000,
      prepaid: 25000,
      wallet: 15000,
      avatar: "👨",
      createdAt: "2024-01-20",
      totalOrders: 156,
      totalSpent: 845000
    },
    {
      id: 443,
      name: "Priya Fashion",
      phone: "9876543210",
      email: "priya@example.com",
      plan: "Premium",
      cod: 32000,
      prepaid: 18000,
      wallet: 8000,
      avatar: "👩",
      createdAt: "2024-01-22",
      totalOrders: 89,
      totalSpent: 342000
    },
    {
      id: 444,
      name: "Rajesh Traders",
      phone: "8765432109",
      email: "rajesh@example.com",
      plan: "Business",
      cod: 125000,
      prepaid: 75000,
      wallet: 25000,
      avatar: "👨‍💼",
      createdAt: "2024-01-25",
      totalOrders: 234,
      totalSpent: 1250000
    },
  ]);

  // Filters
  const filters = [
    { label: "All Users", value: "all", count: users.length, color: "teal" },
    { label: "Free Plan", value: "Free", count: users.filter(u => u.plan === "Free").length, color: "gray" },
    { label: "Premium Plan", value: "Premium", count: users.filter(u => u.plan === "Premium").length, color: "blue" },
    { label: "Business Plan", value: "Business", count: users.filter(u => u.plan === "Business").length, color: "purple" },
  ];

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    if (selectedFilter !== "all") {
      filtered = filtered.filter(u => u.plan === selectedFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.phone.includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.id.toString().includes(query)
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

  // Add new user
  const handleAddUser = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please fill all required fields");
      return;
    }
    
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const newUser = {
      id: newId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase()}@example.com`,
      plan: formData.plan,
      cod: 0,
      prepaid: 0,
      wallet: 0,
      avatar: "👤",
      createdAt: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: "", phone: "", email: "", plan: "Free", cod: 0, prepaid: 0, wallet: 0 });
  };

  // Edit user
  const handleEditUser = () => {
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            plan: formData.plan
          }
        : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Delete user
  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Add wallet
  const handleAddWallet = () => {
    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, wallet: user.wallet + amount }
        : user
    ));
    setShowWalletModal(false);
    setWalletAmount("");
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
      phone: user.phone,
      email: user.email,
      plan: user.plan,
      cod: user.cod,
      prepaid: user.prepaid,
      wallet: user.wallet
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openWalletModal = (user) => {
    setSelectedUser(user);
    setShowWalletModal(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Phone", "Email", "Plan", "COD Orders", "Prepaid Orders", "Wallet Balance", "Total Orders", "Total Spent", "Joined Date"];
    const csvData = users.map(user => [
      user.id,
      user.name,
      user.phone,
      user.email,
      user.plan,
      user.cod,
      user.prepaid,
      user.wallet,
      user.totalOrders,
      user.totalSpent,
      user.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get plan badge color
  const getPlanBadge = (plan) => {
    switch(plan) {
      case "Premium":
        return "bg-blue-500/20 text-blue-400";
      case "Business":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  // Stats summary
  const totalCod = users.reduce((sum, u) => sum + u.cod, 0);
  const totalPrepaid = users.reduce((sum, u) => sum + u.prepaid, 0);
  const totalWallet = users.reduce((sum, u) => sum + u.wallet, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your platform users</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create User
          </button>
          
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
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <UsersIcon size={20} className="text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-xs text-gray-400">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CreditCard size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{totalCod.toLocaleString()}</p>
              <p className="text-xs text-gray-400">COD Orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{totalPrepaid.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Prepaid Orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Wallet size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{totalWallet.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Wallet Balance</p>
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
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isActive 
                  ? `bg-${filter.color}-500/30 text-${filter.color}-400`
                  : "bg-slate-700 text-gray-400"
              }`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white">{filteredUsers.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-white">{Math.min(endIndex, filteredUsers.length)}</span> of{" "}
          <span className="text-white">{filteredUsers.length}</span> users
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">COD</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prepaid</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Wallet</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Add Wallet</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">#{user.id}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-xl border border-white/10">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white cursor-pointer hover:text-teal-400 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPlanBadge(user.plan)}`}>
                        {user.plan}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">₹{user.cod.toLocaleString()}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">₹{user.prepaid.toLocaleString()}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-teal-400">₹{user.wallet.toLocaleString()}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openWalletModal(user)}
                        className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                      >
                        <Wallet size={12} />
                        Add Wallet
                      </button>
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
                        <button 
                          onClick={() => openDeleteModal(user)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <UsersIcon size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No users found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new user</p>
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

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New User">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Plan</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <button
            onClick={handleAddUser}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Create User
          </button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Plan</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <button
            onClick={handleEditUser}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete User">
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">{selectedUser?.name}</span>?
          {selectedUser?.wallet > 0 && (
            <span className="text-yellow-400 block mt-2">
              ⚠️ This user has ₹{selectedUser.wallet} in wallet balance. This will be lost.
            </span>
          )}
          This action cannot be undone.
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

      {/* View User Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-3xl border border-white/10">
                {selectedUser.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                <p className="text-sm text-gray-400">{selectedUser.phone}</p>
                <p className="text-xs text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="text-sm font-semibold text-white">#{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getPlanBadge(selectedUser.plan)}`}>
                  {selectedUser.plan}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">COD Orders</p>
                <p className="text-lg font-semibold text-white">₹{selectedUser.cod.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Prepaid Orders</p>
                <p className="text-lg font-semibold text-white">₹{selectedUser.prepaid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-lg font-semibold text-teal-400">₹{selectedUser.wallet.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Orders</p>
                <p className="text-lg font-semibold text-white">{selectedUser.totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-lg font-semibold text-white">₹{selectedUser.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined Date</p>
                <p className="text-sm text-white">{selectedUser.createdAt}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Wallet Modal */}
      <Modal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} title="Add Wallet Balance">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">User</label>
            <p className="text-white font-medium">{selectedUser?.name}</p>
            <p className="text-xs text-gray-500">Current Balance: ₹{selectedUser?.wallet.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Amount to Add (₹)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWalletAmount("100")}
              className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
            >
              +₹100
            </button>
            <button
              onClick={() => setWalletAmount("500")}
              className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
            >
              +₹500
            </button>
            <button
              onClick={() => setWalletAmount("1000")}
              className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
            >
              +₹1000
            </button>
          </div>
          <button
            onClick={handleAddWallet}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Add to Wallet
          </button>
        </div>
      </Modal>
    </div>
  );
}