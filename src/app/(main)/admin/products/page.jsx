"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  X,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import api from "@/app/utils/api";
import ViewProductModal from "@/app/components/shared/ViewProductModal";

const normalizeProductImageUrl = (image) => {
  if (!image) return "/placeholder.png";
  const trimmed = String(image).trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/Stepkaro")) {
    return `https://namami-infotech.com${trimmed}`;
  }

  if (trimmed.startsWith("Stepkaro")) {
    return `https://namami-infotech.com/${trimmed}`;
  }

  if (trimmed.startsWith("uploads/")) {
    return `https://namami-infotech.com/${trimmed}`;
  }

  return `https://namami-infotech.com/${trimmed}`;
};

export default function ProductsPage() {
  const router = useRouter();
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [commission, setCommission] = useState("");

  // Form states for add/edit
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    qty: "",
    price: "",
    status: "active",
    stock: "in_stock",
  });
  const token = localStorage.getItem("access_token");

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "https://namami-infotech.com/Stepkaro/src/product/get_all_products.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProducts(response.data.data);
        console.log("Products fetched successfully:", response.data.data);
      } catch (error) {
        console.error("Products fetch karne mein dikkat aayi:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [token]);

  // Handle approval action
  const handleApprovalAction = async (
    productId,
    action,
    commissionValue = null,
  ) => {
    try {
      const response = await api.post(
        "https://namami-infotech.com/Stepkaro/src/admin/approve_products.php",
        {
          product_id: productId,
          action,
          commission: parseFloat(commissionValue),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  status: action,
                  commission: commissionValue,
                }
              : product,
          ),
        );

        setShowCommissionModal(false);

        alert("Product updated successfully");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    }
  };

  // Calculate counts
  const allProductsCount = products.length;
  const activeCount = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;
  const productsListingRequestedCount = products.filter(
    (p) => p.status === "approve_request",
  ).length;
  const outOfStockCount = products.filter(
    (p) => p.stock === "out_of_stock" || p.qty === 0,
  ).length;

  const filters = [
    {
      label: "All Product",
      value: "all",
      count: allProductsCount,
      icon: Package,
      color: "teal",
    },
    {
      label: "Products Listing Requested",
      value: "approve_request",
      count: productsListingRequestedCount,
      icon: AlertCircle,
      color: "yellow",
    },
    {
      label: "Active Product",
      value: "active",
      count: activeCount,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "In-Active Product",
      value: "inactive",
      count: inactiveCount,
      icon: XCircle,
      color: "red",
    },
  ];
  const handleCommissionChange = (e) => {
    const val = e.target.value;

    if (/^\d*\.?\d*$/.test(val)) {
      setCommission(val);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedFilter === "active") {
      filtered = filtered.filter((p) => p.status === "active");
    } else if (selectedFilter === "inactive") {
      filtered = filtered.filter((p) => p.status === "inactive");
    } else if (selectedFilter === "approve_request") {
      filtered = filtered.filter((p) => p.status === "approve_request");
    } else if (selectedFilter === "out_of_stock") {
      filtered = filtered.filter(
        (p) => p.stock === "out_of_stock" || p.qty === 0,
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.article_name?.toLowerCase().includes(query) ||
          p.category_name?.toLowerCase().includes(query) ||
          p.id?.toString().includes(query),
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
  const toggleStatus = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newStatus = product.status === "active" ? "inactive" : "active";

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p)),
    );

    try {
      const response = await api.post(
        "https://namami-infotech.com/Stepkaro/src/admin/toggle_products.php",
        {
          product_id: productId,
          action: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Toggle failed");
      }
    } catch (error) {
      console.error("Toggle Error:", error);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, status: product.status } : p,
        ),
      );
      alert(error.message || "Failed to update status");
    }
  };

  // Add new product
  const handleAddProduct = async () => {
    try {
      const response = await api.post(
        "https://namami-infotech.com/Stepkaro/src/product/add_product.php",
        {
          name: formData.name,
          category: formData.category,
          qty: parseInt(formData.qty) || 0,
          price: parseInt(formData.price) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        const getResponse = await api.get(
          "https://namami-infotech.com/Stepkaro/src/product/get_all_products.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProducts(getResponse.data.data);
        setShowAddModal(false);
        setFormData({
          name: "",
          category: "",
          qty: "",
          price: "",
          status: "active",
          stock: "in_stock",
        });
        alert("Product added successfully!");
      } else {
        alert(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  // Edit product
  const handleEditProduct = async () => {
    try {
      const response = await api.post(
        "https://namami-infotech.com/Stepkaro/src/product/edit_product.php",
        {
          product_id: selectedProduct.id,
          name: formData.name,
          category: formData.category,
          qty: parseInt(formData.qty) || 0,
          price: parseInt(formData.price) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        const getResponse = await api.get(
          "https://namami-infotech.com/Stepkaro/src/product/get_all_products.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProducts(getResponse.data.data);
        setShowEditModal(false);
        setSelectedProduct(null);
        setFormData({
          name: "",
          category: "",
          qty: "",
          price: "",
          status: "active",
          stock: "in_stock",
        });
        alert("Product updated successfully!");
      } else {
        alert(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error editing product:", error);
      alert("Failed to update product");
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      const response = await api.post(
        "https://namami-infotech.com/Stepkaro/src/product/delete_product.php",
        {
          product_id: selectedProduct.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        setProducts(
          products.filter((product) => product.id !== selectedProduct.id),
        );
        setShowDeleteModal(false);
        setSelectedProduct(null);
        alert("Product deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // Navigate to product detail page
  const goToProductDetail = (productId) => {
    console.log("Navigating to product detail for ID:", productId);
    router.push(`/admin/products/${productId}`);
  };

  // Open edit modal
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.article_name || "",
      category: product.category_name || "",
      qty: product.stock_quantity?.toString() || "0",
      price: product.price?.toString() || "0",
      status: product.status,
      stock: product.stock,
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Product Name",
      "Category",
      "Quantity",
      "Orders",
      "Returns",
      "Revenue",
      "Status",
    ];
    const csvData = products.map((p) => [
      p.id,
      p.article_name,
      p.category_name,
      p.stock_quantity,
      p.orders || 0,
      p.returns || 0,
      p.revenue || 0,
      p.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
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
      reader.onload = async (event) => {
        const text = event.target.result;
        const rows = text.split("\n");
        const productsToImport = [];

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(",");
          if (cols.length >= 4) {
            productsToImport.push({
              name: cols[0],
              category: cols[1],
              qty: parseInt(cols[2]) || 0,
              price: parseInt(cols[3]) || 0,
            });
          }
        }

        try {
          const response = await api.post(
            "https://namami-infotech.com/Stepkaro/src/product/bulk_import.php",
            {
              products: productsToImport,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.data.status === "success") {
            const getResponse = await api.get(
              "https://namami-infotech.com/Stepkaro/src/product/get_all_products.php",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            setProducts(getResponse.data.data);
            setShowBulkImportModal(false);
            alert("Products imported successfully!");
          } else {
            alert(response.data.message || "Failed to import products");
          }
        } catch (error) {
          console.error("Error importing products:", error);
          alert("Failed to import products");
        }
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
          <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-slate-800 z-10">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your product catalog
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64 min-w-[180px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

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

      {/* Filters - Scrollable on mobile */}
      <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? `bg-${filter.color}-500/20 text-${filter.color}-400 border border-${filter.color}-500/30`
                  : "bg-slate-800/50 text-gray-400 hover:text-white border border-white/10 hover:border-teal-500/30"
              }`}
            >
              <Icon size={16} />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-sm text-gray-400">
          Showing{" "}
          <span className="text-white">
            {filteredProducts.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-white">
            {Math.min(endIndex, filteredProducts.length)}
          </span>{" "}
          of <span className="text-white">{filteredProducts.length}</span>{" "}
          products
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

      {/* Products Table - Mobile Card View */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="11" className="px-4 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading products...</p>
                  </td>
                </tr>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product, index) => {
                  const stockBadge = getStockBadge(
                    product.stock,
                    product.stock_quantity,
                  );
                  const isListingRequested =
                    product.status === "approve_request";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-300">
                          {startIndex + index + 1}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => goToProductDetail(product.id)}
                            className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-xl border border-white/10 cursor-pointer hover:scale-110 transition-transform overflow-hidden flex-shrink-0"
                          >
                            <img
                              src={normalizeProductImageUrl(product.image)}
                              alt={product.article_name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p
                              onClick={() => goToProductDetail(product.id)}
                              className="text-sm font-medium text-white cursor-pointer hover:text-teal-400 transition-colors"
                            >
                              {product.article_name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {product.category_name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-medium ${product.stock_quantity === 0 ? "text-red-400" : "text-white"}`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm text-white">
                          {product.owner_name}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.price || 0}
                          </span>
                          <span className="text-sm font-semibold text-green-400">
                            ₹{product.selling_price || 0}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm text-white">
                          {product.orders || 0}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm text-white">
                          {product.brand_name}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-teal-400">
                          {product.commission ? `${product.commission}%` : "0%"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${stockBadge.color}`}
                        >
                          {stockBadge.label}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {product.status === "reject" ? (
                          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg">
                            Reject
                          </span>
                        ) : isListingRequested ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setSelectedProductId(product.id);
                                setCommission("");
                                setShowCommissionModal(true);
                              }}
                              className="px-3 py-1 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              title="Approve Product"
                            >
                              <ThumbsUp size={14} />
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                handleApprovalAction(product.id, "reject")
                              }
                              className="px-3 py-1 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reject Product"
                            >
                              <ThumbsDown size={14} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleStatus(product.id)}
                            className="relative w-10 h-5 bg-gray-700 rounded-full transition-colors cursor-pointer flex-shrink-0"
                          >
                            <div
                              className={`absolute w-4 h-4 bg-teal-400 rounded-full top-0.5 transition-all duration-300 ${
                                product.status === "active"
                                  ? "left-5"
                                  : "left-0.5"
                              }`}
                            />
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
                            title="View Product"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => goToProductDetail(product.id)}
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
                  <td colSpan="11" className="px-4 py-12 text-center">
                    <Package size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No products found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search or filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading products...</p>
            </div>
          ) : currentProducts.length > 0 ? (
            <div className="divide-y divide-white/5">
              {currentProducts.map((product, index) => {
                const stockBadge = getStockBadge(
                  product.stock,
                  product.stock_quantity,
                );
                const isListingRequested = product.status === "approve_request";

                return (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        onClick={() => goToProductDetail(product.id)}
                        className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-white/10 cursor-pointer hover:scale-110 transition-transform overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={normalizeProductImageUrl(product.image)}
                          alt={product.article_name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          onClick={() => goToProductDetail(product.id)}
                          className="text-sm font-medium text-white cursor-pointer hover:text-teal-400 transition-colors truncate"
                        >
                          {product.article_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.category_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.price || 0}
                          </span>
                          <span className="text-sm font-semibold text-green-400">
                            ₹{product.selling_price || 0}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${stockBadge.color} flex-shrink-0`}
                      >
                        {stockBadge.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Qty:</span>
                        <span className="text-white ml-1">
                          {product.stock_quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Owner:</span>
                        <span className="text-white ml-1 truncate">
                          {product.owner_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Orders:</span>
                        <span className="text-white ml-1">
                          {product.orders || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Brand:</span>
                        <span className="text-white ml-1 truncate">
                          {product.brand_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Commission:</span>
                        <span className="text-teal-400 ml-1 font-semibold">
                          {product.commission ? `${product.commission}%` : "0%"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        {product.status === "reject" ? (
                          <span className="text-red-400 ml-1">Reject</span>
                        ) : isListingRequested ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <button
                              onClick={() => {
                                setSelectedProductId(product.id);
                                setCommission("");
                                setShowCommissionModal(true);
                              }}
                              className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded flex items-center gap-1"
                            >
                              <ThumbsUp size={12} /> Approve
                            </button>
                            <button
                              onClick={() =>
                                handleApprovalAction(product.id, "reject")
                              }
                              className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1"
                            >
                              <ThumbsDown size={12} /> Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleStatus(product.id)}
                            className="relative w-10 h-5 bg-gray-700 rounded-full transition-colors cursor-pointer ml-1"
                          >
                            <div
                              className={`absolute w-4 h-4 bg-teal-400 rounded-full top-0.5 transition-all duration-300 ${
                                product.status === "active"
                                  ? "left-5"
                                  : "left-0.5"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => goToProductDetail(product.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="px-4 py-4 border-t border-white/10 flex flex-wrap justify-center gap-2">
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

      {/* Commission Modal */}
      <Modal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        title="Approve Product"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Commission (%)
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={commission}
              onChange={handleCommissionChange}
              autoFocus
              placeholder="Enter commission percentage"
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => {
              if (!commission) {
                alert("Please enter commission");
                return;
              }

              handleApprovalAction(selectedProductId, "active", commission);
            }}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Approve Product
          </button>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter category"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Quantity</label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter price"
            />
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
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Quantity</label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Product"
      >
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">
            {selectedProduct?.article_name}
          </span>
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
            onClick={handleDeleteProduct}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>

      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
        variant="admin"
        onEdit={(product) => goToProductDetail(product.id)}
      />

      {/* Bulk Import Modal */}
      <Modal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        title="Bulk Import Products"
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Upload a CSV file with columns:{" "}
            <span className="text-white">
              Product Name, Category, Quantity, Price
            </span>
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
          <a
            href="#"
            className="text-sm text-teal-400 hover:text-teal-300 block text-center"
          >
            Download sample CSV template
          </a>
        </div>
      </Modal>
    </div>
  );
}