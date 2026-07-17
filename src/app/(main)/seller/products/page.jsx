"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ProductFormModal from "@/app/components/shared/ProductFormModel";
import ViewProductModal from "@/app/components/shared/ViewProductModal";

// Utility function for image URL
const normalizeProductImageUrl = (image) => {
  if (!image) return "/placeholder.png";
  const trimmed = String(image).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/Stepkaro") || trimmed.startsWith("Stepkaro")) {
    return `https://namami-infotech.com${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `https://namami-infotech.com/Stepkaro/${trimmed}`;
  }
  return `https://namami-infotech.com/${trimmed}`;
};

// Variants Detail Table Component
const VariantsDetailTable = ({
  variants,
  productId,
  onToggleVariantStatus,
  togglingVariantId,
}) => {
  if (!variants?.length) {
    return <p className="text-sm text-gray-500 py-2">No variants available</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-blue-100 bg-blue-50/40">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="bg-blue-100/60">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Image
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Size
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Color
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              MRP
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Selling
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Stock
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Packing
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Pairs/Ctn
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100 bg-white">
          {variants.map((variant) => (
            <tr key={variant.id} className="hover:bg-blue-50/50">
              <td className="px-3 py-2">
                <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden">
                  <img
                    src={normalizeProductImageUrl(variant.image)}
                    alt={variant.variant_size || "Variant"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </td>
              <td className="px-3 py-2 text-gray-900">
                {variant.variant_size || variant.size || "-"}
              </td>
              <td className="px-3 py-2 text-gray-900">
                {variant.color || "-"}
              </td>
              <td className="px-3 py-2 text-gray-500 line-through">
                ₹{variant.price || 0}
              </td>
              <td className="px-3 py-2 font-medium text-emerald-600">
                ₹{variant.selling_price || 0}
              </td>
              <td className="px-3 py-2 text-gray-900">{variant.stock ?? 0}</td>
              <td className="px-3 py-2 text-gray-900">
                {variant.packing_type || "-"}
              </td>
              <td className="px-3 py-2 text-gray-900">
                {variant.pairs_per_ctn ?? "-"}
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  disabled={togglingVariantId === variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVariantStatus(productId, variant.id);
                  }}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 disabled:opacity-60 ${
                    variant.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                  aria-label={`Toggle variant status`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${
                      variant.status === "active" ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function SellerProductsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // New states for filters and variants
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [togglingVariantId, setTogglingVariantId] = useState(null);
  const variantsPanelRef = useRef(null);

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    gender: [],
    colors: [],
    materials: [],
    upper_materials: [],
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
    variants: [],
    gender: "",
    color: "",
    material: "",
    upper_material: "",
    packing_type: "",
    pairs_per_ctn: "",
    origin: "Made in India",
    stock_quantity: "",
    status: "approve_request",
  });

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
    fetchFilterOptions();
  }, []);

  // Click outside handler for variants panel
  useEffect(() => {
    if (expandedProductId === null) return;

    const handleClickOutside = (e) => {
      if (
        e.target.closest("[data-variants-toggle]") ||
        e.target.closest("button") ||
        e.target.tagName === "INPUT"
      ) {
        return;
      }
      if (
        variantsPanelRef.current &&
        variantsPanelRef.current.contains(e.target)
      ) {
        return;
      }
      setExpandedProductId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedProductId]);

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
        },
      );
      const result = await response.json();

      if (result.success) {
        const formattedProducts = result.data.map((p) => ({
          id: p.id,
          name: p.article_name,
          selling_price: p.selling_price,
          price: p.price,
          stock: p.status === "active",
          quantity: p.stock_quantity,
          category: p.category_name,
          brand: p.brand_name,
          article: p.article_name,
          size:
            p.variant && p.variant.trim() !== ""
              ? p.variant
              : p.min_size && p.max_size
                ? `${p.min_size}-${p.max_size}`
                : p.size || "—",
          min_size: p.min_size,
          max_size: p.max_size,
          color: p.color,
          material: p.material,
          packingType: p.packing_type,
          pairsPerCTN: p.pairs_per_ctn,
          origin: p.origin,
          image: p.image,
          gender: p.gender,
          description: p.description,
          status: p.status,
          commission: p.commission || "0",
          variants: p.variants || [],
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
        },
      );
      const result = await response.json();

      if (result.success) {
        setFilterOptions({
          brands: [...new Set(result.data.brands || [])],
          categories: [...new Set(result.data.categories || [])],
          gender: [...new Set(result.data.gender || [])],
          colors: [...new Set(result.data.color || [])],
          materials: [...new Set(result.data.material || [])],
          upper_materials: [...new Set(result.data.upper_material || [])],
          packingTypes: [...new Set(result.data.packing_type || [])],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const inactiveProducts = products.filter(
    (p) => p.status === "inactive",
  ).length;
  const outOfStockProducts = products.filter(
    (p) => Number(p.quantity || 0) === 0,
  ).length;

  // Filters configuration
  const filters = useMemo(
    () => [
      { label: "All Products", value: "all", count: totalProducts },
      { label: "Active", value: "active", count: activeProducts },
      { label: "Inactive", value: "inactive", count: inactiveProducts },
      {
        label: "Out of Stock",
        value: "out_of_stock",
        count: outOfStockProducts,
      },
    ],
    [totalProducts, activeProducts, inactiveProducts, outOfStockProducts],
  );

  // Filter products by search and filter
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by status
    if (selectedFilter === "active") {
      filtered = filtered.filter((p) => p.status === "active");
    } else if (selectedFilter === "inactive") {
      filtered = filtered.filter((p) => p.status === "inactive");
    } else if (selectedFilter === "out_of_stock") {
      filtered = filtered.filter((p) => Number(p.quantity || 0) === 0);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query),
      );
    }
    return filtered;
  }, [selectedFilter, searchQuery, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    setCurrentPage(1);
  };

  // Toggle product status
  const toggleStatus = async (productId) => {
    try {
      const token = localStorage.getItem("access_token");
      const product = products.find((p) => p.id === productId);
      const newStatus = product?.status === "active" ? "inactive" : "active";

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/product/toggle_product_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        },
      );
      const result = await response.json();
      if (result.success) {
        // Update local state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, status: newStatus } : p,
          ),
        );
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle variant status
  const toggleVariantStatus = async (productId, variantId) => {
    try {
      setTogglingVariantId(variantId);
      const token = localStorage.getItem("access_token");

      // Find current variant status
      const product = products.find((p) => p.id === productId);
      const variant = product?.variants?.find((v) => v.id === variantId);
      const newStatus = variant?.status === "active" ? "inactive" : "active";

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/admin/toggle_products.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            variant_id: variantId,
            type: "variant",
            action: newStatus,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Update local state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  variants: p.variants.map((v) =>
                    v.id === variantId ? { ...v, status: newStatus } : v,
                  ),
                }
              : p,
          ),
        );
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTogglingVariantId(null);
    }
  };

  // Toggle variants panel
  const toggleVariantsPanel = (e, productId) => {
    e.stopPropagation();
    setExpandedProductId((prev) => (prev === productId ? null : productId));
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
        },
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
      upper_material: "",
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
    let extractedMin = "";
    let extractedMax = "";

    if (product.size && product.size.toLowerCase().includes("x")) {
      const parts = product.size.toLowerCase().split("x");
      if (parts.length === 2) {
        extractedMin = parts[0].trim();
        extractedMax = parts[1].trim();
      }
    } else if (product.size && product.size.includes("-")) {
      const parts = product.size.split("-");
      if (parts.length === 2) {
        extractedMin = parts[0].trim();
        extractedMax = parts[1].trim();
      }
    } else {
      extractedMin = product.min_size || "";
      extractedMax = product.max_size || "";
    }

    setEditProduct(product);
    setNewProduct({
      article_name: product.name || "",
      description: product.description || "",
      selling_price: product.price || "",
      price: product.price || "",
      brand_name: product.brand || "",
      category_name: product.category || "",
      gender: product.gender || "",
      color: product.color || "",
      material: product.material || "",
      upper_material: product.upper_material || "",
      packing_type: product.packingType || "",
      pairs_per_ctn: product.pairsPerCTN || "",
      origin: product.origin || "Made in India",
      stock_quantity: product.quantity || "",
      status: product.status || "inactive",
      image: product.image || "",
      min_size: extractedMin,
      max_size: extractedMax,
    });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleExportProducts = () => {
    const headers = [
      "ID",
      "Product Name",
      "Category",
      "Brand",
      "Article",
      "Size",
      "Color",
      "Material",
      "Packing Type",
      "Pairs per CTN",
      "Origin",
      "Price",
      "Quantity",
      "Status",
    ];
    const csvData = products.map((p) => [
      p.id,
      p.name,
      p.category,
      p.brand,
      p.article,
      p.size,
      p.color,
      p.material,
      p.packingType,
      p.pairsPerCTN,
      p.origin,
      p.price,
      p.quantity,
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
 // Add/Edit product
const submitProduct = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    // Prepare base product data
    formData.append("article_name", newProduct.article_name);
    formData.append("description", newProduct.description);
    formData.append("selling_price", newProduct.selling_price);
    formData.append("price", newProduct.price);
    formData.append("brand_name", newProduct.brand_name);
    formData.append("category_name", newProduct.category_name);
    formData.append("gender", newProduct.gender);
    formData.append("color", newProduct.color);
    formData.append("material", newProduct.material);
    formData.append("upper_material", newProduct.upper_material);
    formData.append("packing_type", newProduct.packing_type);
    formData.append("pairs_per_ctn", newProduct.pairs_per_ctn);
    formData.append("origin", newProduct.origin);
    formData.append("stock_quantity", newProduct.stock_quantity);
    formData.append("min_size", newProduct.min_size);
    formData.append("max_size", newProduct.max_size);

    // Add main image if present
    if (newProduct.image && typeof newProduct.image !== "string") {
      formData.append("image", newProduct.image);
    }

    // Prepare variants data for API
    // The API expects 'multi_variants' array with variant data
    const multiVariants = newProduct.variants.map((variant) => {
      const variantData = {
        variant_name: variant.variant_name,
        image: variant.image,
        min_size: variant.min_size,
        max_size: variant.max_size,
        color: variant.color,
        price: variant.price,
        selling_price: variant.selling_price,
        stock: variant.stock,
        packing_type: variant.packing_type,
        pairs_per_ctn: variant.pairs_per_ctn,
        status: "active",
      };

      // If editing, include variant_id
      if (isEditing && variant.id) {
        variantData.variant_id = variant.id;
      }

      return variantData;
    });

    // Add multi_variants as JSON string
    formData.append("multi_variants", JSON.stringify(multiVariants));

    // Determine URL based on edit mode
    // let url = "https://namami-infotech.com/Stepkaro/src/product/vendor_add_product.php";
    // if (isEditing && editProduct) {
    //   formData.append("product_id", editProduct.id);
    //   url = "https://namami-infotech.com/Stepkaro/src/product/update_product.php";
    // }

   console.log("========== FormData ==========");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log("==============================");

    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: formData,
    // });

    // const result = await response.json();
    
    // if (result.success) {
    //   setShowAddModal(false);
    //   // Reset form
    //   setNewProduct({
    //     article_name: "",
    //     description: "",
    //     selling_price: "",
    //     price: "",
    //     brand_name: "",
    //     category_name: "",
    //     min_size: "",
    //     max_size: "",
    //     variants: [],
    //     gender: "",
    //     color: "",
    //     material: "",
    //     upper_material: "",
    //     packing_type: "",
    //     pairs_per_ctn: "",
    //     origin: "Made in India",
    //     stock_quantity: "",
    //     status: "inactive",
    //     image: null,
    //   });
    //   setPreviewUrl("");
    //   // Refresh product list
    //   fetchProducts();
    //   setShowSuccess(true);
    //   setTimeout(() => setShowSuccess(false), 2000);
    // } else {
    //   alert(result.message || "Failed to save product");
    // }
  } catch (error) {
    console.error("Error submitting product:", error);
    alert("An error occurred while saving the product. Please try again.");
  }
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
          <button
            onClick={handleExportProducts}
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white shadow-lg">
          <p className="text-xs opacity-90">Out of Stock</p>
          <p className="text-2xl font-bold">{outOfStockProducts}</p>
        </div>
      </div>

      {/* Filters Tabs */}
      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-white text-violet-700 border border-violet-200 hover:bg-violet-50"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-violet-100 text-violet-700"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
          />
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
          Showing{" "}
          <span className="font-semibold text-violet-900">
            {filteredProducts.length}
          </span>{" "}
          products
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
                <th className="px-6 py-4 font-semibold">Variants</th>
                <th className="px-6 py-4 font-semibold">Commission</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-50">
              {currentProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-violet-50/50 transition">
                    <td className="px-6 py-4 text-sm text-violet-600">
                      #{product.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={normalizeProductImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-violet-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.variants?.length > 0 ? (
                        <button
                          type="button"
                          data-variants-toggle
                          onClick={(e) => toggleVariantsPanel(e, product.id)}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          {product.variants.length}{" "}
                          {product.variants.length === 1
                            ? "Variant"
                            : "Variants"}
                          {expandedProductId === product.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No Variants
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                        {product.commission}%
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-teal-600">
                        ₹{product.price}
                      </span>
                    </td> */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.price || 0}
                        </span>
                        <span className="text-sm font-semibold text-emerald-600">
                          ₹{product.selling_price || 0}
                        </span>
                      </div>
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
                          <button
                            onClick={() => saveQuantity(product.id)}
                            className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditQuantity(product)}
                          className="cursor-pointer group flex items-center gap-2"
                        >
                          <span
                            className={`text-sm ${product.quantity === 0 ? "text-red-500" : "text-gray-700"}`}
                          >
                            {product.quantity}
                          </span>
                          <Pencil
                            size={14}
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(product.id)}
                          className={`relative h-5 w-10 rounded-full transition ${product.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${product.status === "active" ? "left-5" : "left-0.5"}`}
                          />
                        </button>
                        <span className="text-xs text-gray-500">
                          {product.status === "active" ? "Active" : "Inactive"}
                        </span>
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

                  {/* Variants Sub-table */}
                  {expandedProductId === product.id && (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-6 py-4 bg-gray-50/50 border-l-4 border-blue-500"
                      >
                        <div ref={variantsPanelRef} className="animate-fadeIn">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            <h5 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                              Available SKUs / Options Inventory
                            </h5>
                            <span className="text-xs text-gray-400 ml-2">
                              ({product.variants?.length || 0} variants)
                            </span>
                          </div>
                          <VariantsDetailTable
                            variants={product.variants || []}
                            productId={product.id}
                            onToggleVariantStatus={toggleVariantStatus}
                            togglingVariantId={togglingVariantId}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package size={48} className="mx-auto text-violet-300 mb-3" />
            <p className="text-violet-500">No products found</p>
            <p className="text-sm text-violet-400 mt-1">
              Try adjusting your search or add a new product
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 border-t border-violet-100 px-6 py-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${currentPage === pageNum ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isEditing={isEditing}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        filterOptions={filterOptions}
        onSubmit={submitProduct}
      />

      {/* View Product Modal */}
      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
        variant="seller"
        onEdit={handleEditProduct}
      />
    </div>
  );
}
