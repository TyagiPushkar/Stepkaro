"use client";
import { useState, useMemo } from "react";
import { 
  Search, 
  Download, 
  Eye, 
  Printer,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function OrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample orders data
  const allOrders = [
    { id: 113, customer: "Rajesh Kumar", phone: "9898967652", amount: "₹12,450", payment: "QR & Bank Transfer", date: "03 Apr 2026", time: "03:16", status: "pending" },
    { id: 112, customer: "Priya Singh", phone: "9999773251", amount: "₹5,040", payment: "QR & Bank Transfer", date: "24 Mar 2026", time: "01:58", status: "confirmed" },
    { id: 111, customer: "Amit Patel", phone: "9876543210", amount: "₹8,999", payment: "UPI", date: "20 Mar 2026", time: "14:30", status: "dispatched" },
    { id: 110, customer: "Neha Gupta", phone: "9988776655", amount: "₹15,750", payment: "Card", date: "18 Mar 2026", time: "09:45", status: "transport" },
    { id: 109, customer: "Vikram Sharma", phone: "9876541230", amount: "₹3,299", payment: "QR & Bank Transfer", date: "15 Mar 2026", time: "18:20", status: "accepted" },
    { id: 108, customer: "Sunita Verma", phone: "9765432180", amount: "₹22,500", payment: "Bank Transfer", date: "12 Mar 2026", time: "11:00", status: "confirmed" },
    { id: 107, customer: "Rahul Mehta", phone: "9654321870", amount: "₹1,299", payment: "UPI", date: "10 Mar 2026", time: "16:15", status: "rejected" },
    { id: 106, customer: "Anjali Kapoor", phone: "9543218760", amount: "₹6,750", payment: "Card", date: "08 Mar 2026", time: "13:40", status: "transport" },
    { id: 105, customer: "Manish Yadav", phone: "9432107650", amount: "₹4,200", payment: "QR & Bank Transfer", date: "05 Mar 2026", time: "10:30", status: "dispatched" },
    { id: 104, customer: "Pooja Jain", phone: "9321096540", amount: "₹9,999", payment: "UPI", date: "03 Mar 2026", time: "19:00", status: "confirmed" },
    { id: 103, customer: "Suresh Nair", phone: "9210985430", amount: "₹2,499", payment: "Card", date: "28 Feb 2026", time: "08:15", status: "accepted" },
    { id: 102, customer: "Deepa Reddy", phone: "9109874320", amount: "₹18,750", payment: "Bank Transfer", date: "25 Feb 2026", time: "21:30", status: "transport" },
    { id: 101, customer: "Arjun Singh", phone: "9098763210", amount: "₹7,500", payment: "QR & Bank Transfer", date: "22 Feb 2026", time: "12:45", status: "confirmed" },
  ];

  const filters = [
    { label: "All Orders", value: "all", count: allOrders.length, icon: Package, color: "teal" },
    { label: "Order Confirmation", value: "pending", count: allOrders.filter(o => o.status === "pending").length, icon: Clock, color: "yellow" },
    { label: "Order Accepted", value: "accepted", count: allOrders.filter(o => o.status === "accepted").length, icon: CheckCircle, color: "green" },
    { label: "Order Rejected", value: "rejected", count: allOrders.filter(o => o.status === "rejected").length, icon: XCircle, color: "red" },
    { label: "Order Dispatched", value: "dispatched", count: allOrders.filter(o => o.status === "dispatched").length, icon: Truck, color: "blue" },
    { label: "Booked For Transport", value: "transport", count: allOrders.filter(o => o.status === "transport").length, icon: Package, color: "purple" },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { label: "Confirmed", color: "bg-green-500/20 text-green-400" },
      pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
      accepted: { label: "Accepted", color: "bg-blue-500/20 text-blue-400" },
      rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400" },
      dispatched: { label: "Dispatched", color: "bg-purple-500/20 text-purple-400" },
      transport: { label: "Booked for Transport", color: "bg-indigo-500/20 text-indigo-400" },
    };
    return badges[status] || { label: "Processing", color: "bg-gray-500/20 text-gray-400" };
  };

  // Filter orders based on selected filter and search query
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;
    
    // Apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.phone.includes(query)
      );
    }
    
    return filtered;
  }, [selectedFilter, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle page change
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle filter change
  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAcceptOrder = (orderId) => {
    console.log(`Accept order ${orderId}`);
    // Add your API call here
  };

  const handleRejectOrder = (orderId) => {
    console.log(`Reject order ${orderId}`);
    // Add your API call here
  };

  const handleViewOrder = (orderId) => {
    console.log(`View order ${orderId}`);
    // Add your navigation or modal logic here
  };

  const handlePrintInvoice = (orderId) => {
    console.log(`Print invoice for order ${orderId}`);
    // Add your print logic here
  };

  const handleExportOrders = () => {
    console.log("Exporting orders...");
    // Add your export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track all customer orders</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportOrders}
            className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded-lg px-4 py-2 text-sm text-teal-400 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export Orders
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by order ID, customer name, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select className="px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
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
              <Icon size={16} />
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
          Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">
            {Math.min(endIndex, filteredOrders.length)}
          </span> of <span className="text-white">{filteredOrders.length}</span> orders
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select 
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-300"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment Mode
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">#{order.id}</span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{order.customer}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.phone}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white">{order.amount}</span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-300">{order.payment}</span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{order.date}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.time}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectOrder(order.id)}
                            className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAcceptOrder(order.id)}
                            className="px-3 py-1.5 text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg transition-colors"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleViewOrder(order.id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handlePrintInvoice(order.id)}
                          className="p-2 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
                        >
                          <Printer size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Package size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No orders found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">
                {Math.min(endIndex, filteredOrders.length)}
              </span> of <span className="text-white">{filteredOrders.length}</span> orders
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-400"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-1.5 text-gray-400">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}