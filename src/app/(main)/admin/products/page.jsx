"use client";
import { useState, useMemo, useEffect, useRef, Fragment } from "react";
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
  Loader2,
} from "lucide-react";
import api from "@/app/utils/api";
import ViewProduct from "@/app/components/shared/ViewProduct";
import AdminAddProductModal from "@/app/components/shared/AdminProductForm";

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

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
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
                  />
                </div>
              </td>
              <td className="px-3 py-2 text-gray-900">
                {variant.variant_size || "-"}
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

export default function ProductsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);

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
  const [commissionType, setCommissionType] = useState("");
  const [expandedVariantsProductId, setExpandedVariantsProductId] =
    useState(null);
  const [togglingVariantId, setTogglingVariantId] = useState(null);
  const variantsPanelRef = useRef(null);

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  useEffect(() => {
    if (expandedVariantsProductId === null) return;

    const handleClickOutside = (e) => {
      if (
        variantsPanelRef.current &&
        !variantsPanelRef.current.contains(e.target) &&
        !e.target.closest("[data-variants-toggle]")
      ) {
        setExpandedVariantsProductId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedVariantsProductId]);

  const toggleVariantsPanel = (e, productId) => {
    e.stopPropagation();
    setExpandedVariantsProductId((prev) =>
      prev === productId ? null : productId,
    );
  };

  const getVariantCount = (product) =>
    Array.isArray(product.variants) ? product.variants.length : 0;

  const isOutOfStock = (product) => {
    if (product.stock === "out_of_stock") return true;
    const qty = product.stock_quantity ?? product.qty;
    return qty === 0 || qty === "0";
  };

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
          commission_type: commissionType || "percentage",
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
                  commission_type: commissionType || "percentage",
                }
              : product,
          ),
        );

        setShowCommissionModal(false);
        showToast("Product updated successfully");
      } else {
        showToast(response.data.message || "Failed to update product", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to update product", "error");
    }
  };

  // Calculate counts
  const allProductsCount = products.length;
  const activeCount = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;
  const productsListingRequestedCount = products.filter(
    (p) => p.status === "approve_request",
  ).length;
  const outOfStockCount = products.filter(isOutOfStock).length;
  const rejectedCount = products.filter((p) => p.status === "reject").length;

  const filters = [
    {
      label: "All Product",
      value: "all",
      count: allProductsCount,
      icon: Package,
      color: "purple",
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
    {
      label: "Out of Stock Product",
      value: "out_of_stock",
      count: outOfStockCount,
      icon: AlertCircle,
      color: "red",
    },
    {
      label: "Rejected Product",
      value: "reject",
      count: rejectedCount,
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
      filtered = filtered.filter(isOutOfStock);
    } else if (selectedFilter === "reject") {
      filtered = filtered.filter((p) => p.status === "reject");
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
          type: "product",
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
      showToast(
        `Product ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Toggle Error:", error);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, status: product.status } : p,
        ),
      );
      showToast(error.message || "Failed to update status", "error");
    }
  };

  const toggleVariantStatus = async (productId, variantId) => {
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants?.find((v) => v.id === variantId);
    if (!variant) return;

    const newStatus = variant.status === "active" ? "inactive" : "active";

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

    setTogglingVariantId(variantId);

    try {
      const response = await api.post(
        "https://namami-infotech.com/Stepkaro/src/admin/toggle_products.php",
        {
          variant_id: variantId,
          type: "variant",
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

      showToast(
        `Variant ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Variant Toggle Error:", error);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                variants: p.variants.map((v) =>
                  v.id === variantId ? { ...v, status: variant.status } : v,
                ),
              }
            : p,
        ),
      );
      showToast(error.message || "Failed to update variant status", "error");
    } finally {
      setTogglingVariantId(null);
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
        showToast("Product added successfully!");
      } else {
        showToast(response.data.message || "Failed to add product", "error");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showToast("Failed to add product", "error");
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
        showToast("Product updated successfully!");
      } else {
        showToast(response.data.message || "Failed to update product", "error");
      }
    } catch (error) {
      console.error("Error editing product:", error);
      showToast("Failed to update product", "error");
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
        showToast("Product deleted successfully!");
      } else {
        showToast(response.data.message || "Failed to delete product", "error");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Failed to delete product", "error");
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
    setSelectedProduct(product.id);
    setShowViewModal(true);
  };

  // ========== ENHANCED EXPORT TO CSV ==========
  const handleExportCSV = () => {
    if (products.length === 0) {
      showToast("No products to export", "error");
      return;
    }

    const exportData =
      filteredProducts.length > 0 ? filteredProducts : products;

    const headers = [
      "ID",
      "Product Name",
      "Category",
      "Brand",
      "Owner Name",
      "Business Name",
      "Quantity",
      "Price (Original)",
      "Selling Price",
      "Commission (%)",
      "Orders",
      "Returns",
      "Revenue",
      "Status",
      "Stock Status",
      "Variant",
      "Color",
      "Size",
      "Material",
      "Gender",
      "Origin",
      "Created At",
    ];

    const rows = exportData.map((p) => [
      p.id || "",
      p.article_name || "",
      p.category_name || "",
      p.brand_name || "",
      p.owner_name || "",
      p.business_name || "",
      p.stock_quantity || 0,
      p.price || 0,
      p.selling_price || 0,
      p.commission || "0",
      p.orders || 0,
      p.returns || 0,
      p.revenue || 0,
      p.status || "",
      p.stock || "in_stock",
      p.variant || "",
      p.color || "",
      p.size || "",
      p.material || "",
      p.gender || "",
      p.origin || "",
      p.created_at || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${exportData.length} products successfully`);
  };

  // ========== EXPORT FILTERED PRODUCTS ==========
  const handleExportFilteredCSV = () => {
    if (filteredProducts.length === 0) {
      showToast("No products matching filter to export", "error");
      return;
    }

    const headers = [
      "ID",
      "Product Name",
      "Category",
      "Brand",
      "Owner Name",
      "Business Name",
      "Quantity",
      "Price (Original)",
      "Selling Price",
      "Commission (%)",
      "Orders",
      "Returns",
      "Revenue",
      "Status",
      "Stock Status",
      "Variant",
      "Color",
      "Size",
      "Material",
      "Gender",
      "Origin",
      "Created At",
    ];

    const rows = filteredProducts.map((p) => [
      p.id || "",
      p.article_name || "",
      p.category_name || "",
      p.brand_name || "",
      p.owner_name || "",
      p.business_name || "",
      p.stock_quantity || 0,
      p.price || 0,
      p.selling_price || 0,
      p.commission || "0",
      p.orders || 0,
      p.returns || 0,
      p.revenue || 0,
      p.status || "",
      p.stock || "in_stock",
      p.variant || "",
      p.color || "",
      p.size || "",
      p.material || "",
      p.gender || "",
      p.origin || "",
      p.created_at || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_filtered_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(
      `Exported ${filteredProducts.length} filtered products successfully`,
    );
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
            showToast("Products imported successfully!");
          } else {
            showToast(
              response.data.message || "Failed to import products",
              "error",
            );
          }
        } catch (error) {
          console.error("Error importing products:", error);
          showToast("Failed to import products", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const getStockBadge = (stock, qty) => {
    if (qty === 0 || qty === "0" || stock === "out_of_stock") {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    } else if (qty < 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your product catalog
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:w-64 min-w-[180px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Add Product
          </button>

          {/* <button
            onClick={() => setShowBulkImportModal(true)}
            className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-gray-200 hover:border-purple-300"
          >
            <Upload size={16} />
            Bulk Import
          </button> */}

          <button
            onClick={handleExportCSV}
            className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-purple-200"
          >
            <Download size={16} />
            Export All
          </button>

          {filteredProducts.length < products.length &&
            filteredProducts.length > 0 && (
              <button
                onClick={handleExportFilteredCSV}
                className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors border border-gray-200 hover:border-purple-300"
              >
                <Download size={16} />
                Export Filtered ({filteredProducts.length})
              </button>
            )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 pb-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.value;
          const colorMap = {
            purple: "bg-purple-600 text-white border-purple-600",
            yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
            green: "bg-green-100 text-green-700 border-green-200",
            red: "bg-red-100 text-red-700 border-red-200",
          };
          const inactiveColorMap = {
            purple:
              "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600",
            yellow:
              "bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:text-yellow-600",
            green:
              "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600",
            red: "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600",
          };
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 whitespace-nowrap border ${
                isActive
                  ? colorMap[filter.color] ||
                    "bg-purple-600 text-white border-purple-600"
                  : inactiveColorMap[filter.color] ||
                    "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
              }`}
            >
              <Icon size={16} />
              {filter.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-gray-900">
            {filteredProducts.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-gray-900">
            {Math.min(endIndex, filteredProducts.length)}
          </span>{" "}
          of <span className="text-gray-900">{filteredProducts.length}</span>{" "}
          products
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
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ProductS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th> */}

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => {
                  const stockBadge = getStockBadge(
                    product.stock,
                    product.stock_quantity,
                  );
                  const isListingRequested =
                    product.status === "approve_request";
                  const variantCount = getVariantCount(product);
                  const isVariantsExpanded =
                    expandedVariantsProductId === product.id;

                  return (
                    <Fragment key={product.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500">
                            {startIndex + index + 1}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => goToProductDetail(product.id)}
                              className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200 cursor-pointer hover:scale-110 transition-transform overflow-hidden flex-shrink-0"
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
                                className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                              >
                                {product.article_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {product.category_name}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {product.brand_name}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-medium ${product.stock_quantity === 0 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {product.stock_quantity}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {product.owner_name}
                          </span>
                        </td>

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

                        {/* <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">
                          {product.orders || 0}
                        </span>
                      </td> */}

                        {/* <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-purple-600">
                          {product.commission ? `${product.commission}%` : "0%"}
                        </span>
                      </td> */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-purple-600">
                              {product.commission_type === "percentage"
                                ? `${product.commission || 0}%`
                                : `₹${product.commission || 0}`}
                            </span>

                            {product.commission_type === "per_piece_rate" && (
                              <span className="text-xs text-gray-500">
                                Per piece rate
                              </span>
                            )}
                          </div>
                        </td>

                        {/* <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${stockBadge.color}`}
                        >
                          {stockBadge.label}
                        </span>
                      </td> */}
                        <td className="px-4 py-3">
                          {variantCount > 0 ? (
                            <button
                              type="button"
                              data-variants-toggle
                              onClick={(e) =>
                                toggleVariantsPanel(e, product.id)
                              }
                              className={`text-sm font-semibold cursor-pointer hover:underline ${
                                isVariantsExpanded
                                  ? "text-blue-800"
                                  : "text-blue-600"
                              }`}
                            >
                              {variantCount}{" "}
                              {variantCount === 1 ? "Variant" : "Variants"}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No Variants
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {product.status === "reject" ? (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg">
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
                                className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                title="Approve Product"
                              >
                                <ThumbsUp size={14} />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleApprovalAction(product.id, "reject")
                                }
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                title="Reject Product"
                              >
                                <ThumbsDown size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleStatus(product.id)}
                              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                                product.status === "active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              <div
                                className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${
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
                              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Product"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => goToProductDetail(product.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </button>
                            {/* <button
                            onClick={() => openDeleteModal(product)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button> */}
                          </div>
                        </td>
                      </tr>
                      {isVariantsExpanded && variantCount > 0 && (
                        <tr>
                          <td colSpan={10} className="px-4 py-3 bg-gray-50">
                            <div ref={variantsPanelRef}>
                              <p className="text-xs font-medium text-blue-700 mb-2">
                                Variants for {product.article_name}
                              </p>
                              <VariantsDetailTable
                                variants={product.variants}
                                productId={product.id}
                                onToggleVariantStatus={toggleVariantStatus}
                                togglingVariantId={togglingVariantId}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="px-4 py-12 text-center">
                    <Package size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products found</p>
                    <p className="text-sm text-gray-400 mt-1">
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
          {currentProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {currentProducts.map((product, index) => {
                const stockBadge = getStockBadge(
                  product.stock,
                  product.stock_quantity,
                );
                const isListingRequested = product.status === "approve_request";
                const variantCount = getVariantCount(product);
                const isVariantsExpanded =
                  expandedVariantsProductId === product.id;

                return (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        onClick={() => goToProductDetail(product.id)}
                        className="w-14 h-14 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200 cursor-pointer hover:scale-110 transition-transform overflow-hidden flex-shrink-0"
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
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600 transition-colors truncate"
                        >
                          {product.article_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.category_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.price || 0}
                          </span>
                          <span className="text-sm font-semibold text-emerald-600">
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
                        <span className="text-gray-500">Qty:</span>
                        <span className="text-gray-900 ml-1">
                          {product.stock_quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Owner:</span>
                        <span className="text-gray-900 ml-1 truncate">
                          {product.owner_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="text-gray-900 ml-1">
                          {product.orders || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Brand:</span>
                        <span className="text-gray-900 ml-1 truncate">
                          {product.brand_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Commission:</span>
                        <span className="text-purple-600 ml-1 font-semibold">
                          {product.commission_type === "percentage"
                            ? `${product.commission || 0}%`
                            : `₹${product.commission || 0}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Variants:</span>
                        {variantCount > 0 ? (
                          <button
                            type="button"
                            data-variants-toggle
                            onClick={(e) => toggleVariantsPanel(e, product.id)}
                            className={`ml-1 text-sm font-semibold cursor-pointer hover:underline ${
                              isVariantsExpanded
                                ? "text-blue-800"
                                : "text-blue-600"
                            }`}
                          >
                            {variantCount}
                          </button>
                        ) : (
                          <span className="text-gray-400 ml-1">None</span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        {product.status === "reject" ? (
                          <span className="text-red-600 ml-1">Reject</span>
                        ) : isListingRequested ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <button
                              onClick={() => {
                                setSelectedProductId(product.id);
                                setCommission("");
                                setShowCommissionModal(true);
                              }}
                              className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded flex items-center gap-1"
                            >
                              <ThumbsUp size={12} /> Approve
                            </button>
                            <button
                              onClick={() =>
                                handleApprovalAction(product.id, "reject")
                              }
                              className="px-2 py-0.5 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded flex items-center gap-1"
                            >
                              <ThumbsDown size={12} /> Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleStatus(product.id)}
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ml-1 ${
                              product.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            <div
                              className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${
                                product.status === "active"
                                  ? "left-5"
                                  : "left-0.5"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {isVariantsExpanded && variantCount > 0 && (
                      <div
                        ref={variantsPanelRef}
                        className="pt-2 border-t border-gray-100"
                      >
                        <p className="text-xs font-medium text-blue-700 mb-2">
                          Variants for {product.article_name}
                        </p>
                        <VariantsDetailTable
                          variants={product.variants}
                          productId={product.id}
                          onToggleVariantStatus={toggleVariantStatus}
                          togglingVariantId={togglingVariantId}
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => goToProductDetail(product.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      {/* <button
                        onClick={() => openDeleteModal(product)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-200 flex flex-wrap justify-center gap-2">
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
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  currentPage === page
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

      {/* Commission Modal */}
      <Modal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        title="Approve Product"
      >
        <div className="space-y-4">
          {/* NEW DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Type
            </label>

            <select
              value={commissionType}
              onChange={(e) => setCommissionType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="percentage">Percentage (%)</option>
              <option value="per_piece_rate">Per Piece Rate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission (% / Rate)
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={commission}
              onChange={handleCommissionChange}
              autoFocus
              placeholder="Enter commission"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              if (!commission) {
                alert("Please enter commission");
                return;
              }
              if (!commissionType) {
                alert("Please enter commission type");
                return;
              }
              handleApprovalAction(selectedProductId, "active", commission);
            }}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all"
          >
            Approve Product
          </button>
        </div>
      </Modal>

      {/* add products */}
      <AdminAddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Product Name
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
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleEditProduct}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white rounded-lg transition-all"
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
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-gray-900 font-semibold">
            {selectedProduct?.article_name}
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
          {/* <button
            onClick={handleDeleteProduct}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete
          </button> */}
        </div>
      </Modal>

      <ViewProduct
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        productId={selectedProduct}
        variant="admin"
      />

      {/* Bulk Import Modal */}
      <Modal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        title="Bulk Import Products"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Upload a CSV file with columns:{" "}
            <span className="text-gray-900 font-medium">
              Product Name, Category, Quantity, Price
            </span>
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
            <Upload size={32} className="text-gray-400 mx-auto mb-3" />
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkImport}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
          </div>
          <a
            href="#"
            className="text-sm text-purple-600 hover:text-purple-700 block text-center"
          >
            Download sample CSV template
          </a>
        </div>
      </Modal>
    </div>
  );
}
