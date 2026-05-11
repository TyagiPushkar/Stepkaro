"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  PackageCheck,
  Eye,
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Move products data outside component to avoid re-creation
const productsData = [
  {
    id: 1,
    name: "Ladies Slipper 101",
    price: 199,
    stock: true,
    image: null,
    category: "Ladies Slipper",
    sales: 240,
    revenue: 47760,
    rating: 4.8,
    description: "Comfortable ladies slipper with soft sole",
  },
  {
    id: 2,
    name: "Men's Sports Shoe",
    price: 499,
    stock: true,
    image: null,
    category: "Sports Shoe",
    sales: 180,
    revenue: 89820,
    rating: 4.6,
    description: "Lightweight sports shoe for running",
  },
  {
    id: 3,
    name: "Kids Sandal",
    price: 250,
    stock: false,
    image: null,
    category: "Kids Footwear",
    sales: 98,
    revenue: 24500,
    rating: 4.5,
    description: "Cute sandals for kids",
  },
  {
    id: 4,
    name: "Black Formal Shoe",
    price: 899,
    stock: true,
    image: null,
    category: "Formal Shoe",
    sales: 67,
    revenue: 60233,
    rating: 4.7,
    description: "Premium formal shoes for office wear",
  },
  {
    id: 5,
    name: "Women Heels",
    price: 599,
    stock: true,
    image: null,
    category: "Women Footwear",
    sales: 156,
    revenue: 93444,
    rating: 4.9,
    description: "Stylish heels for party wear",
  },
  {
    id: 6,
    name: "Flip Flops",
    price: 99,
    stock: false,
    image: null,
    category: "Casual",
    sales: 420,
    revenue: 41580,
    rating: 4.3,
    description: "Comfortable flip flops for daily use",
  },
];

// Placeholder image component to avoid hydration issues
const ProductImage = ({ category }) => {
  // Get emoji based on category
  const getEmoji = () => {
    if (category.includes("Ladies")) return "👡";
    if (category.includes("Sports")) return "👟";
    if (category.includes("Kids")) return "👶";
    if (category.includes("Formal")) return "👞";
    if (category.includes("Women")) return "👠";
    return "👟";
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 text-3xl">
      {getEmoji()}
    </div>
  );
};

export default function SellerProductsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState(productsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fix hydration by ensuring component only renders on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter products by search only
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Toggle product status
  const toggleStatus = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, stock: !product.stock }
        : product
    ));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Delete product
  const handleDeleteProduct = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  // Navigate to edit page
  const handleEditProduct = (product) => {
    router.push(`/seller/products/edit/${product.id}`);
  };

  // View product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Add new product
  const handleAddProduct = () => {
    router.push("/seller/products/add");
  };

  // Export products
  const handleExportProducts = () => {
    const headers = ["ID", "Product Name", "Category", "Price", "Stock", "Sales", "Revenue", "Rating"];
    const csvData = products.map(p => [
      p.id,
      p.name,
      p.category,
      p.price,
      p.stock ? "In Stock" : "Out of Stock",
      p.sales,
      p.revenue,
      p.rating
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

  // Stats
  const totalProducts = products.length;
  const totalStock = products.filter(p => p.stock).length;
  const outOfStock = products.filter(p => !p.stock).length;
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle size={18} />
          Product updated successfully!
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
            My Products
          </h1>
          <p className="mt-1 text-sm text-violet-600">
            Manage your product catalog
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportProducts}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white">
          <p className="text-xs opacity-90">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
          <p className="text-xs opacity-90">In Stock</p>
          <p className="text-2xl font-bold">{totalStock}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
          <p className="text-xs opacity-90">Out of Stock</p>
          <p className="text-2xl font-bold">{outOfStock}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
          <p className="text-xs opacity-90">Total Sales</p>
          <p className="text-2xl font-bold">{totalSales}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
          <p className="text-xs opacity-90">Revenue</p>
          <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search products by name or category..."
            className="w-full rounded-xl border border-violet-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredProducts.length}</span> products
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-violet-200 bg-white px-2 py-1 text-sm"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            {/* Top Section */}
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                <ProductImage category={product.category} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-violet-700 transition">
                    {product.name}
                  </h2>
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="opacity-0 group-hover:opacity-100 transition p-1 text-violet-500 hover:text-violet-700"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <p className="mt-1 text-sm text-violet-500">
                  {product.category}
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      product.stock
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.sales} sold
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 flex items-center justify-between border-t border-violet-100 pt-4">
              {/* Toggle Switch */}
              <div className="flex items-center gap-2">
                <PackageCheck size={16} className="text-violet-500" />
                <span className="text-sm font-medium text-gray-700">
                  {product.stock ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => toggleStatus(product.id)}
                  className={`relative h-5 w-10 rounded-full transition ${
                    product.stock ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                      product.stock ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="rounded-lg bg-violet-100 p-2 text-violet-700 transition hover:bg-violet-200"
                  title="Edit Product"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDeleteModal(true);
                  }}
                  className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                  title="Delete Product"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp size={12} />
                <span>Revenue: ₹{product.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span>{product.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-violet-100 bg-white p-12 text-center">
          <PackageCheck size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No products found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new product</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-3 py-1.5 text-sm bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  currentPage === pageNum
                    ? "bg-violet-600 text-white"
                    : "bg-white border border-violet-200 text-violet-700 hover:bg-violet-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg px-3 py-1.5 text-sm bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Product">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertCircle size={24} className="text-red-500" />
            <p className="text-sm text-red-700">
              This action cannot be undone!
            </p>
          </div>
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold text-violet-900">{selectedProduct?.name}</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              disabled={isLoading}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Product Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Product Details">
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl">
                <ProductImage category={selectedProduct.category} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-violet-500">{selectedProduct.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-lg font-bold text-gray-900">₹{selectedProduct.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${selectedProduct.stock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {selectedProduct.stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Sales</p>
                <p className="text-md font-semibold text-gray-900">{selectedProduct.sales}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-md font-semibold text-emerald-600">₹{selectedProduct.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rating</p>
                <p className="text-md font-semibold text-gray-900">{selectedProduct.rating} ★</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-700 mt-1">{selectedProduct.description}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditProduct(selectedProduct);
                }}
                className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center justify-center gap-2"
              >
                <Pencil size={16} />
                Edit Product
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}