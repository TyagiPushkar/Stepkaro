"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Package,
  X,
  Check,
} from "lucide-react";

export default function SellerProductsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    gender: [],
    colors: [],
    materials: [],
    packingTypes: [],
  });

  const [newProduct, setNewProduct] = useState({
    article_name: "",
    description: "",
    selling_price: "",
    price: "",
    brand_name: "",
    category_name: "",
    min_size: "",
    max_size: "",
    gender: "",
    color: "",
    material: "",
    packing_type: "",
    pairs_per_ctn: "",
    origin: "Made in India",
    stock_quantity: "",
    status: "inactive", // Default inactive
  });

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
    fetchFilterOptions();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/product/get_vendor_products.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        const formattedProducts = result.data.map((p) => ({
          id: p.id,
          name: p.article_name,
          price: p.selling_price,
          stock: p.status === "active",
          quantity: p.stock_quantity,
          category: p.category_name,
          brand: p.brand_name,
          article: p.article_name,
          size: p.min_size && p.max_size ? `${p.min_size}-${p.max_size}` : p.size,
          color: p.color,
          material: p.material,
          packingType: p.packing_type,
          pairsPerCTN: p.pairs_per_ctn,
          origin: p.origin,
          image: p.image,
          gender: p.gender,
          description: p.description,
          status: p.status,
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/product/get_product_filters.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        // Remove duplicates using Set
        setFilterOptions({
          brands: [...new Set(result.data.brands || [])],
          categories: [...new Set(result.data.categories || [])],
          gender: [...new Set(result.data.gender || [])],
          colors: [...new Set(result.data.color || [])],
          materials: [...new Set(result.data.material || [])],
          packingTypes: [...new Set(result.data.packing_type || [])],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter products by search
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [searchQuery, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Toggle product status
  const toggleStatus = async (productId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/product/toggle_product_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchProducts();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Edit quantity inline
  const startEditQuantity = (product) => {
    setEditingQuantity(product.id);
    setEditValue(product.quantity.toString());
  };

  const saveQuantity = async (productId) => {
    const newQuantity = parseInt(editValue);
    if (isNaN(newQuantity) || newQuantity < 0) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/stock/update_stock.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            stock_quantity: newQuantity,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchProducts();
        setEditingQuantity(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEditingQuantity(null);
    setEditValue("");
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleAddProduct = () => {
    setNewProduct({
      article_name: "",
      description: "",
      selling_price: "",
      price: "",
      brand_name: "",
      category_name: "",
      min_size: "",
      max_size: "",
      gender: "",
      color: "",
      material: "",
      packing_type: "",
      pairs_per_ctn: "",
      origin: "Made in India",
      stock_quantity: "",
      status: "inactive",
    });
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    // Parse size range if exists
    let minSize = "";
    let maxSize = "";
    if (product.size && product.size.includes("-")) {
      const [min, max] = product.size.split("-");
      minSize = min;
      maxSize = max;
    }

    setEditProduct(product);
    setNewProduct({
      article_name: product.name || "",
      description: product.description || "",
      selling_price: product.price || "",
      price: product.price || "",
      brand_name: product.brand || "",
      category_name: product.category || "",
      min_size: minSize,
      max_size: maxSize,
      gender: product.gender || "",
      color: product.color || "",
      material: product.material || "",
      packing_type: product.packingType || "",
      pairs_per_ctn: product.pairsPerCTN || "",
      origin: product.origin || "Made in India",
      stock_quantity: product.quantity || "",
      status: product.status || "inactive",
    });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleExportProducts = () => {
    const headers = [
      "ID", "Product Name", "Category", "Brand", "Article", "Size",
      "Color", "Material", "Packing Type", "Pairs per CTN", "Origin",
      "Price", "Quantity", "Status"
    ];
    const csvData = products.map(p => [
      p.id, p.name, p.category, p.brand, p.article, p.size,
      p.color, p.material, p.packingType, p.pairsPerCTN, p.origin,
      p.price, p.quantity, p.stock ? "Active" : "Inactive"
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

  // Generate sizes between min and max
  const generateSizes = (min, max) => {
    if (!min || !max) return "";
    const sizes = [];
    for (let i = parseInt(min); i <= parseInt(max); i++) {
      sizes.push(i);
    }
    return sizes.join(",");
  };

  // Add/Edit product
  const submitProduct = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      const sizeRange = generateSizes(newProduct.min_size, newProduct.max_size);

      formData.append("article_name", newProduct.article_name);
      formData.append("description", newProduct.description);
      formData.append("selling_price", newProduct.selling_price);
      formData.append("price", newProduct.price);
      formData.append("brand_name", newProduct.brand_name);
      formData.append("category_name", newProduct.category_name);
      formData.append("size", sizeRange);
      formData.append("gender", newProduct.gender);
      formData.append("color", newProduct.color);
      formData.append("material", newProduct.material);
      formData.append("packing_type", newProduct.packing_type);
      formData.append("pairs_per_ctn", newProduct.pairs_per_ctn);
      formData.append("origin", newProduct.origin);
      formData.append("stock_quantity", newProduct.stock_quantity);
      formData.append("status", newProduct.status);

      let url = "https://namami-infotech.com/Stepkaro/src/product/vendor_add_product.php";
      if (isEditing && editProduct) {
        formData.append("product_id", editProduct.id);
        url = "https://namami-infotech.com/Stepkaro/src/product/update_product.php";
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setShowAddModal(false);
        fetchProducts();
        setNewProduct({
          article_name: "", description: "", selling_price: "", price: "",
          brand_name: "", category_name: "", min_size: "", max_size: "",
          gender: "", color: "", material: "", packing_type: "",
          pairs_per_ctn: "", origin: "Made in India", stock_quantity: "",
          status: "inactive",
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.stock === true).length;
  const inactiveProducts = products.filter(p => p.stock === false).length;

  // View Product Modal
  const ViewProductModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
              <p className="text-sm text-gray-500">ID: #{product.id}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6 pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${product.stock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {product.stock ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-gray-500">Quantity: {product.quantity}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-md font-medium text-gray-900">{product.category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Brand</p>
                  <p className="text-md font-medium text-gray-900">{product.brand}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Article</p>
                  <p className="text-md font-medium text-gray-900">{product.article}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="text-md font-medium text-gray-900">{product.size}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Color</p>
                  <p className="text-md font-medium text-gray-900">{product.color}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Material</p>
                  <p className="text-md font-medium text-gray-900">{product.material}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Packing Type</p>
                  <p className="text-md font-medium text-gray-900">{product.packingType}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Pairs per CTN</p>
                  <p className="text-md font-medium text-gray-900">{product.pairsPerCTN}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Origin</p>
                  <p className="text-md font-medium text-gray-900">{product.origin}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-lg font-bold text-teal-600">₹{product.price}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  handleEditProduct(product);
                }}
                className="flex-1 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center justify-center gap-2"
              >
                <Pencil size={16} />
                Edit Product
              </button>
              <button onClick={onClose} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <h1 className="text-3xl font-bold text-violet-900">My Products</h1>
          <p className="mt-1 text-violet-600">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportProducts} className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50">
            <Download size={16} /> Export
          </button>
          <button onClick={handleAddProduct} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white">
          <p className="text-xs opacity-90">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
          <p className="text-xs opacity-90">Active Products</p>
          <p className="text-2xl font-bold">{activeProducts}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
          <p className="text-xs opacity-90">Inactive Products</p>
          <p className="text-2xl font-bold">{inactiveProducts}</p>
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
            className="w-full rounded-xl border border-violet-200 bg-white py-3 pl-11 pr-4 text-violet-900 placeholder-violet-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-violet-600">
          Showing <span className="font-semibold text-violet-900">{filteredProducts.length}</span> products
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-violet-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-violet-200 bg-white px-2 py-1 text-sm text-violet-900"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-violet-50 border-b border-violet-100">
              <tr className="text-left text-sm text-violet-800">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-50">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-violet-50/50 transition">
                  <td className="px-6 py-4 text-sm text-violet-600">#{product.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-violet-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-teal-600">₹{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingQuantity === product.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-1 border border-violet-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                          autoFocus
                          min="0"
                        />
                        <button onClick={() => saveQuantity(product.id)} className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600" title="Save">
                          <Check size={14} />
                        </button>
                        <button onClick={cancelEdit} className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500" title="Cancel">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => startEditQuantity(product)} className="cursor-pointer group flex items-center gap-2">
                        <span className={`text-sm ${product.quantity === 0 ? "text-red-500" : "text-gray-700"}`}>
                          {product.quantity}
                        </span>
                        <Pencil size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(product.id)}
                        className={`relative h-5 w-10 rounded-full transition ${product.stock ? "bg-emerald-500" : "bg-gray-300"}`}
                      >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${product.stock ? "left-5" : "left-0.5"}`} />
                      </button>
                      <span className="text-xs text-gray-500">{product.stock ? "Active" : "Inactive"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="rounded-lg bg-violet-100 p-2 text-violet-600 transition hover:bg-violet-200"
                        title="View Product"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="rounded-lg bg-violet-100 p-2 text-violet-600 transition hover:bg-violet-200"
                        title="Edit Product"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package size={48} className="mx-auto text-violet-300 mb-3" />
            <p className="text-violet-500">No products found</p>
            <p className="text-sm text-violet-400 mt-1">Try adjusting your search or add a new product</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 border-t border-violet-100 px-6 py-4">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg px-3 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              <ChevronLeft size={16} /> Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={pageNum} onClick={() => goToPage(pageNum)} className={`px-3 py-1.5 text-sm rounded-lg transition ${currentPage === pageNum ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg px-3 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{isEditing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Article Name *"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.article_name}
                  onChange={(e) => setNewProduct({ ...newProduct, article_name: e.target.value })}
                />
                <input
                  placeholder="Selling Price *"
                  type="number"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.selling_price}
                  onChange={(e) => setNewProduct({ ...newProduct, selling_price: e.target.value })}
                />
                <input
                  placeholder="Price (MRP) *"
                  type="number"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <select
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.brand_name}
                  onChange={(e) => setNewProduct({ ...newProduct, brand_name: e.target.value })}
                >
                  <option value="">Select Brand *</option>
                  {filterOptions.brands.map((brand, idx) => (
                    <option key={`brand-${idx}-${brand}`} value={brand}>{brand}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.category_name}
                  onChange={(e) => setNewProduct({ ...newProduct, category_name: e.target.value })}
                >
                  <option value="">Select Category *</option>
                  {filterOptions.categories.map((cat, idx) => (
                    <option key={`cat-${idx}-${cat}`} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  placeholder="Stock Quantity *"
                  type="number"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Min Size *"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.min_size}
                  onChange={(e) => setNewProduct({ ...newProduct, min_size: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Size *"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.max_size}
                  onChange={(e) => setNewProduct({ ...newProduct, max_size: e.target.value })}
                />
                <select
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.gender}
                  onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                >
                  <option value="">Select Gender *</option>
                  {filterOptions.gender.map((g, idx) => (
                    <option key={`gender-${idx}-${g}`} value={g}>{g}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.color}
                  onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                >
                  <option value="">Select Color *</option>
                  {filterOptions.colors.map((color, idx) => (
                    <option key={`color-${idx}-${color}`} value={color}>{color}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.material}
                  onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                >
                  <option value="">Select Material *</option>
                  {filterOptions.materials.map((mat, idx) => (
                    <option key={`material-${idx}-${mat}`} value={mat}>{mat}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.packing_type}
                  onChange={(e) => setNewProduct({ ...newProduct, packing_type: e.target.value })}
                >
                  <option value="">Select Packing Type *</option>
                  {filterOptions.packingTypes.map((type, idx) => (
                    <option key={`packing-${idx}-${type}`} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  placeholder="Pairs Per CTN"
                  type="number"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.pairs_per_ctn}
                  onChange={(e) => setNewProduct({ ...newProduct, pairs_per_ctn: e.target.value })}
                />
                <input
                  placeholder="Origin"
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.origin}
                  onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  rows={3}
                  className="md:col-span-2 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <button onClick={submitProduct} className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-colors font-medium">
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      <ViewProductModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} product={selectedProduct} />
    </div>
  );
}