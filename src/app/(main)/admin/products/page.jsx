"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

export default function ProductsPage() {
  const router = useRouter(); // Add this for navigation
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states for add/edit
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    qty: "",
    price: "",
    status: "active",
    stock: "in_stock"
  });

  // Products state
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "CHUTKI BUTTERFLY | LOOSE",
      category: "Kids Clogs",
      qty: 1,
      orders: 45,
      returns: 2,
      revenue: 12450,
      status: "active",
      stock: "in_stock",
      image: "👡",
      price: 12450,
    },
    {
      id: 2,
      name: "ZIGZAG MOUSE | 5X8 | LOOSE",
      category: "Ladies sleeper",
      qty: 5,
      orders: 128,
      returns: 5,
      revenue: 64000,
      status: "active",
      stock: "in_stock",
      image: "👠",
      price: 12800,
    },
    {
      id: 3,
      name: "ZIGZAG KNOT | 5X8 | LOOSE",
      category: "Ladies sleeper",
      qty: 4,
      orders: 98,
      returns: 3,
      revenue: 43120,
      status: "active",
      stock: "in_stock",
      image: "👡",
      price: 10780,
    },
    {
      id: 4,
      name: "Premium Leather Sandals",
      category: "Men's Footwear",
      qty: 0,
      orders: 67,
      returns: 4,
      revenue: 33500,
      status: "inactive",
      stock: "out_of_stock",
      image: "👞",
      price: 5000,
    },
    {
      id: 5,
      name: "Kids Running Shoes",
      category: "Kids Footwear",
      qty: 12,
      orders: 234,
      returns: 8,
      revenue: 117000,
      status: "active",
      stock: "in_stock",
      image: "👟",
      price: 5000,
    },
  ]);

  // Calculate counts
  const allProductsCount = products.length;
  const activeCount = products.filter(p => p.status === "active").length;
  const inactiveCount = products.filter(p => p.status === "inactive").length;
  const outOfStockCount = products.filter(p => p.stock === "out_of_stock" || p.qty === 0).length;

  const filters = [
    { label: "All Product", value: "all", count: allProductsCount, icon: Package, color: "teal" },
    { label: "Active Product", value: "active", count: activeCount, icon: CheckCircle, color: "green" },
    { label: "In-Active Product", value: "inactive", count: inactiveCount, icon: XCircle, color: "red" },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedFilter === "active") {
      filtered = filtered.filter(p => p.status === "active");
    } else if (selectedFilter === "inactive") {
      filtered = filtered.filter(p => p.status === "inactive");
    } else if (selectedFilter === "out_of_stock") {
      filtered = filtered.filter(p => p.stock === "out_of_stock" || p.qty === 0);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
      );
    }
    
    return filtered;
  }, [selectedFilter, searchQuery, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Toggle product status
  const toggleStatus = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === "active" ? "inactive" : "active" }
        : product
    ));
  };

  // Add new product
  const handleAddProduct = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = {
      id: newId,
      name: formData.name,
      category: formData.category,
      qty: parseInt(formData.qty) || 0,
      orders: 0,
      returns: 0,
      revenue: parseInt(formData.price) * (parseInt(formData.qty) || 0),
      status: formData.status,
      stock: parseInt(formData.qty) === 0 ? "out_of_stock" : "in_stock",
      image: "📦",
      price: parseInt(formData.price) || 0,
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
    setFormData({ name: "", category: "", qty: "", price: "", status: "active", stock: "in_stock" });
  };

  // Edit product
  const handleEditProduct = () => {
    setProducts(products.map(product => 
      product.id === selectedProduct.id 
        ? { 
            ...product, 
            name: formData.name,
            category: formData.category,
            qty: parseInt(formData.qty) || 0,
            price: parseInt(formData.price) || 0,
            revenue: (parseInt(formData.price) || 0) * (parseInt(formData.qty) || 0),
            status: formData.status,
            stock: parseInt(formData.qty) === 0 ? "out_of_stock" : "in_stock"
          }
        : product
    ));
    setShowEditModal(false);
    setSelectedProduct(null);
    setFormData({ name: "", category: "", qty: "", price: "", status: "active", stock: "in_stock" });
  };

  // Delete product
  const handleDeleteProduct = () => {
    setProducts(products.filter(product => product.id !== selectedProduct.id));
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  // Navigate to product detail page
  const goToProductDetail = (productId) => {
    router.push(`/products/${productId}`);
  };

  // Open edit modal (keep this for inline editing if needed)
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      qty: product.qty.toString(),
      price: product.price?.toString() || "0",
      status: product.status,
      stock: product.stock
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Product Name", "Category", "Quantity", "Orders", "Returns", "Revenue", "Status"];
    const csvData = products.map(p => [
      p.id,
      p.name,
      p.category,
      p.qty,
      p.orders,
      p.returns,
      p.revenue,
      p.status
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Bulk import handler
  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split("\n");
        const newProducts = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(",");
          if (cols.length >= 4) {
            newProducts.push({
              id: Math.max(...products.map(p => p.id), 0) + i,
              name: cols[0],
              category: cols[1],
              qty: parseInt(cols[2]) || 0,
              orders: 0,
              returns: 0,
              revenue: parseInt(cols[3]) || 0,
              status: "active",
              stock: parseInt(cols[2]) === 0 ? "out_of_stock" : "in_stock",
              image: "📦",
              price: parseInt(cols[3]) || 0,
            });
          }
        }
        setProducts([...products, ...newProducts]);
        setShowBulkImportModal(false);
      };
      reader.readAsText(file);
    }
  };

  const getStockBadge = (stock, qty) => {
    if (qty === 0 || stock === "out_of_stock") {
      return { label: "Out of Stock", color: "bg-red-500/20 text-red-400" };
    } else if (qty < 5) {
      return { label: "Low Stock", color: "bg-yellow-500/20 text-yellow-400" };
    }
    return { label: "In Stock", color: "bg-green-500/20 text-green-400" };
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your product catalog</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            New Product
          </button>
          
          <button 
            onClick={() => setShowBulkImportModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-white/10"
          >
            <Upload size={16} />
            Bulk Import
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

      {/* Filters */}
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
          Showing <span className="text-white">{filteredProducts.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="text-white">{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
          <span className="text-white">{filteredProducts.length}</span> products
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

      {/* Products Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Returns</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => {
                  const stockBadge = getStockBadge(product.stock, product.qty);
                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">{startIndex + index + 1}</span>
                       </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Make image clickable */}
                          <div 
                            onClick={() => goToProductDetail(product.id)}
                            className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-xl border border-white/10 cursor-pointer hover:scale-110 transition-transform"
                          >
                            {product.image}
                          </div>
                          <div>
                            {/* Make product name clickable */}
                            <p 
                              onClick={() => goToProductDetail(product.id)}
                              className="text-sm font-medium text-white cursor-pointer hover:text-teal-400 transition-colors"
                            >
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                          </div>
                        </div>
                       </td>
                      
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${product.qty === 0 ? "text-red-400" : "text-white"}`}>
                          {product.qty}
                        </span>
                       </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">{product.orders}</span>
                       </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">{product.returns}</span>
                       </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-teal-400">₹{product.revenue.toLocaleString()}</span>
                       </td>
                      
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${stockBadge.color}`}>
                          {stockBadge.label}
                        </span>
                       </td>
                      
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(product.id)}
                          className="relative w-10 h-5 bg-gray-700 rounded-full transition-colors"
                        >
                          <div className={`absolute w-4 h-4 bg-teal-400 rounded-full top-0.5 transition-all duration-300 ${
                            product.status === "active" ? "left-5" : "left-0.5"
                          }`} />
                        </button>
                       </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* View button - navigate to detail page */}
                          <button 
                            onClick={() => goToProductDetail(product.id)}
                            className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(product)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                       </td>
                      
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Package size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No products found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
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

      {/* Rest of your modals remain the same */}
      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter category"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Quantity</label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) => setFormData({...formData, qty: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleAddProduct}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Add Product
          </button>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Quantity</label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) => setFormData({...formData, qty: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleEditProduct}
            className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Delete Product Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Product">
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">{selectedProduct?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProduct}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={showBulkImportModal} onClose={() => setShowBulkImportModal(false)} title="Bulk Import Products">
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Upload a CSV file with columns: <span className="text-white">Product Name, Category, Quantity, Price</span>
          </p>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
            <Upload size={32} className="text-gray-500 mx-auto mb-3" />
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkImport}
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-teal-500/20 file:text-teal-400 hover:file:bg-teal-500/30"
            />
          </div>
          <a href="#" className="text-sm text-teal-400 hover:text-teal-300 block text-center">
            Download sample CSV template
          </a>
        </div>
      </Modal>
    </div>
  );
}