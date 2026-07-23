"use client";
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Check,
} from "lucide-react";
import api from "@/app/utils/api";
import ViewProduct from "@/app/components/shared/ViewProduct";
import AdminAddProductModal from "@/app/components/shared/AdminProductForm";

// Constants
const API_BASE = "https://namami-infotech.com/Stepkaro/src";
const IMAGE_BASE = "https://namami-infotech.com";

// Utility Functions
const normalizeProductImageUrl = (image) => {
  if (!image) return "/placeholder.png";
  const trimmed = String(image).trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/Stepkaro") || trimmed.startsWith("Stepkaro")) {
    return `${IMAGE_BASE}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  }

  if (trimmed.startsWith("uploads/")) {
    return `${IMAGE_BASE}/${trimmed}`;
  }

  return `${IMAGE_BASE}/${trimmed}`;
};

// Components
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
            aria-label="Close modal"
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
  product,
  variants,
  productId,
  onToggleVariantStatus,
  togglingVariantId,
  editingVariantId,
  setEditingVariantId,
  editVariantSellingPrice,
  setEditVariantSellingPrice,
  editVariantStock,
  setEditVariantStock,
  onSaveVariantEdit,
  onCancelVariantEdit,
}) => {
  if (!variants?.length) {
    return <p className="text-sm text-gray-500 py-2">No variants available</p>;
  }

  return (
    <div
      data-variants-panel="true"
      className="overflow-x-auto rounded-lg border border-blue-100 bg-blue-50/40"
      onClick={(e) => e.stopPropagation()} // Panel level propagation stop
    >
      <table className="w-full min-w-[700px] text-sm">
        <thead className="bg-blue-100/60">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Image
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Display Name
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              SELLING PRICE
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              commission Per pair
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Stock
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
              <td className="px-3 py-2 text-gray-900 uppercase">
                {product.article_name} | {variant.variant_size} |{" "}
                {variant.color} | {variant.packing_type} |{" "}
                {product.category_name}
              </td>

              {/* SELLING PRICE */}
              <td className="px-3 py-2 font-medium text-emerald-600">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {editingVariantId === variant.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editVariantSellingPrice}
                        onChange={(e) => setEditVariantSellingPrice(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-24 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveVariantEdit(productId, variant.id);
                        }}
                        className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                        title="Save"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelVariantEdit();
                        }}
                        className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{variant.selling_price || 0}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingVariantId(variant.id);
                          setEditVariantSellingPrice(variant.selling_price || "");
                          setEditVariantStock(variant.stock || "");
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>

              {/* COMMISSION PER PAIR */}
              <td className="px-3 py-2 font-medium text-emerald-600">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-purple-600">
                    {product.commission_type === "percentage"
                      ? `₹${(
                        (Number(variant.selling_price) *
                          Number(product.commission)) /
                        100
                      ).toFixed(2)}`
                      : `₹${Number(product.commission || 0).toFixed(2)}`}
                  </span>
                </div>
              </td>

              {/* STOCK */}
              <td className="px-3 py-2 text-gray-900">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {editingVariantId === variant.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editVariantStock}
                        onChange={(e) => setEditVariantStock(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-24 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveVariantEdit(productId, variant.id);
                        }}
                        className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                        title="Save"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelVariantEdit();
                        }}
                        className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-gray-900">
                        {variant.stock ?? 0}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingVariantId(variant.id);
                          setEditVariantSellingPrice(variant.selling_price || "");
                          setEditVariantStock(variant.stock || "");
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>

              {/* STATUS TOGGLE */}
              <td className="px-3 py-2">
                <button
                  type="button"
                  data-variants-toggle="true"
                  disabled={togglingVariantId === variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVariantStatus(productId, variant.id);
                  }}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 disabled:opacity-60 ${variant.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  aria-label="Toggle variant status"
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${variant.status === "active" ? "left-5" : "left-0.5"
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

  // State
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
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

  //brand filter
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // editable
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductSellingPrice, setEditProductSellingPrice] = useState("");
  const [editProductStock, setEditProductStock] = useState("");
  const [editProductCommission, setEditProductCommission] = useState("");

  // Editable states for variant
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [editVariantSellingPrice, setEditVariantSellingPrice] = useState("");
  const [editVariantStock, setEditVariantStock] = useState("");

  // best selling products
  const [showBestProductsModal, setShowBestProductsModal] = useState(false);
  const [bestProductSearch, setBestProductSearch] = useState("");
  const [selectedBestProducts, setSelectedBestProducts] = useState([]);

  const variantsPanelRef = useRef(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Toast handler
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(
          `${API_BASE}/product/get_all_products.php`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data?.success) {
          setProducts(response.data.data || []);
          console.log(response.data.data);
        } else {
          showToast(
            response.data?.message || "Failed to fetch products",
            "error",
          );
        }
      } catch (error) {
        console.error("Products fetch error:", error);
        showToast("Failed to fetch products", "error");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [token, showToast]);

  // Click outside handler for variants panel
  useEffect(() => {
    if (expandedVariantsProductId === null) return;

    const handleClickOutside = (e) => {
      // Don't close if clicking on toggle buttons or inputs
      if (
        e.target.closest("[data-variants-toggle]") ||
        e.target.closest("button") ||
        e.target.tagName === "INPUT"
      ) {
        return;
      }

      // Don't close if clicking inside variants panel
      if (
        variantsPanelRef.current &&
        variantsPanelRef.current.contains(e.target)
      ) {
        return;
      }

      setExpandedVariantsProductId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedVariantsProductId]);

  useEffect(() => {
    const selected = products
      .filter((p) => p.is_top_pick === "1")
      .map((p) => p.id);

    setSelectedBestProducts(selected);
  }, [products]);

  // extra started

  const filteredBestProducts = useMemo(() => {
    const search = bestProductSearch.toLowerCase();

    return products.filter(
      (p) =>
        p.article_name?.toLowerCase().includes(search) ||
        p.brand_name?.toLowerCase().includes(search) ||
        p.category_name?.toLowerCase().includes(search) ||
        p.id?.toString().includes(search),
    );
  }, [products, bestProductSearch]);

  const toggleBestProduct = (productId) => {
    setSelectedBestProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      if (prev.length >= 50) {
        showToast("Maximum 50 products allowed", "error");
        return prev;
      }

      return [...prev, productId];
    });
  };
  const saveBestProducts = async () => {
    console.log("that products was selected", selectedBestProducts);
    try {
      const response = await api.post(
        `${API_BASE}/admin/update_top_pick.php`,
        {
          product_ids: selectedBestProducts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setProducts((prev) =>
          prev.map((product) => ({
            ...product,
            is_top_pick: selectedBestProducts.includes(product.id) ? "1" : "0",
          })),
        );

        showToast("Best 50 products updated");
        setShowBestProductsModal(false);
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      showToast("Failed to update products", "error");
    }
  };

  // Toggle variants panel
  const toggleVariantsPanel = useCallback((e, productId) => {
    e.stopPropagation();
    setExpandedVariantsProductId((prev) =>
      prev === productId ? null : productId,
    );
  }, []);

  // Get variant count
  const getVariantCount = useCallback((product) => {
    return Array.isArray(product.variants) ? product.variants.length : 0;
  }, []);

  // Check if product is out of stock
  const isOutOfStock = useCallback((product) => {
    if (product.stock === "out_of_stock") return true;
    const qty = product.stock_quantity ?? product.qty;
    return qty === 0 || qty === "0";
  }, []);

  // Handle approval action
  const handleApprovalAction = useCallback(
    async (productId, action, commissionValue = null) => {
      if (!token) {
        showToast("Authentication required", "error");
        return;
      }

      try {
        const payload = {
          product_id: productId,
          action,
          commission_type: commissionType || "percentage",
        };

        if (commissionValue !== null) {
          payload.commission = parseFloat(commissionValue);
        }

        const response = await api.post(
          `${API_BASE}/admin/approve_products.php`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data?.success) {
          setProducts((prev) =>
            prev.map((product) =>
              product.id === productId
                ? {
                  ...product,
                  status: action,
                  commission: commissionValue || product.commission,
                  commission_type: commissionType || product.commission_type,
                }
                : product,
            ),
          );

          setShowCommissionModal(false);
          showToast(
            `Product ${action === "active" ? "approved" : "rejected"} successfully`,
          );
        } else {
          showToast(
            response.data?.message || "Failed to update product",
            "error",
          );
        }
      } catch (error) {
        console.error("Approval error:", error);
        showToast("Failed to update product", "error");
      }
    },
    [token, commissionType, showToast],
  );

  // Toggle product status
  const toggleStatus = useCallback(
    async (productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product || !token) return;

      const newStatus = product.status === "active" ? "inactive" : "active";

      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p)),
      );

      try {
        const response = await api.post(
          `${API_BASE}/admin/toggle_products.php`,
          {
            product_id: productId,
            type: "product",
            action: newStatus,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
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
        // Revert on error
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, status: product.status } : p,
          ),
        );
        showToast(error.message || "Failed to update status", "error");
      }
    },
    [products, token, showToast],
  );

  // Toggle variant status
  const toggleVariantStatus = useCallback(
    async (productId, variantId) => {
      const product = products.find((p) => p.id === productId);
      const variant = product?.variants?.find((v) => v.id === variantId);
      if (!variant || !token) return;

      const newStatus = variant.status === "active" ? "inactive" : "active";

      // Optimistic update
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
          `${API_BASE}/admin/toggle_products.php`,
          {
            variant_id: variantId,
            type: "variant",
            action: newStatus,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
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
        // Revert on error
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
    },
    [products, token, showToast],
  );

  // Navigate to product detail
  const goToProductDetail = useCallback(
    (productId) => {
      router.push(`/admin/products/${productId}`);
    },
    [router],
  );

  // Handle view product
  const handleViewProduct = useCallback((product) => {
    setSelectedProduct(product.id);
    setShowViewModal(true);
  }, []);

  // Handle commission change
  const handleCommissionChange = useCallback((e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setCommission(val);
    }
  }, []);

  // ========== MAIN PRODUCT EDIT HANDLERS ==========
  const startProductEdit = useCallback((product) => {
    setEditingProductId(product.id);
    setEditingVariantId(null); // Close any variant edit
    setEditProductSellingPrice(product.selling_price || "");
    setEditProductStock(product.stock_quantity || "");
    setEditProductCommission(product.commission || "");
  }, []);

  const cancelProductEdit = useCallback(() => {
    setEditingProductId(null);
    setEditProductSellingPrice("");
    setEditProductStock("");
    setEditProductCommission("");
  }, []);

  const saveProductEdit = useCallback(
    async (productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Prepare data - only send fields that have changed
      const updatedData = {
        product_id: productId,
      };

      if (
        editProductSellingPrice !== "" &&
        editProductSellingPrice !== product.selling_price?.toString()
      ) {
        updatedData.selling_price = editProductSellingPrice;
      }
      if (
        editProductStock !== "" &&
        editProductStock !== product.stock_quantity?.toString()
      ) {
        updatedData.stock_quantity = editProductStock;
      }
      if (
        editProductCommission !== "" &&
        editProductCommission !== product.commission?.toString()
      ) {
        updatedData.commission = editProductCommission;
      }

      // If nothing changed, just cancel
      if (Object.keys(updatedData).length === 1) {
        cancelProductEdit();
        return;
      }

      // Optimistic update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
              ...p,
              selling_price: updatedData.selling_price || p.selling_price,
              stock_quantity: updatedData.stock_quantity || p.stock_quantity,
              commission: updatedData.commission || p.commission,
            }
            : p,
        ),
      );

      try {
        const formData = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
          }
        });

        const response = await api.post(
          `${API_BASE}/product/admin_update_product_details.php`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Update failed");
        }

        showToast("Product updated successfully");
        cancelProductEdit();
      } catch (error) {
        console.error("Update error:", error);
        // Revert on error
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? product : p)),
        );
        showToast(error.message || "Failed to update product", "error");
      }
    },
    [
      products,
      editProductSellingPrice,
      editProductStock,
      editProductCommission,
      token,
      showToast,
      cancelProductEdit,
    ],
  );

  // ========== VARIANT EDIT HANDLERS ==========
  // const startVariantEdit = useCallback((variant) => {
  //   setEditingVariantId(variant.id);
  //   setEditingProductId(null); // Close any product edit
  //   setEditVariantSellingPrice(variant.selling_price || "");
  //   setEditVariantStock(variant.stock || "");
  // }, []);

  const cancelVariantEdit = useCallback(() => {
    setEditingVariantId(null);
    setEditVariantSellingPrice("");
    setEditVariantStock("");
  }, []);

  const saveVariantEdit = useCallback(
    async (productId, variantId) => {
      const product = products.find((p) => p.id === productId);
      const variant = product?.variants?.find((v) => v.id === variantId);
      if (!variant) return;

      // Check if values actually changed
      const priceChanged =
        editVariantSellingPrice !== "" &&
        editVariantSellingPrice !== variant.selling_price?.toString();
      const stockChanged =
        editVariantStock !== "" &&
        editVariantStock !== variant.stock?.toString();

      if (!priceChanged && !stockChanged) {
        cancelVariantEdit();
        return;
      }

      // Prepare updated single variant payload according to PHP API schema
      const updatedVariant = {
        id: variantId,
        variant_size: variant.variant_size || "",
        color: variant.color || "",
        selling_price: priceChanged ? editVariantSellingPrice : variant.selling_price,
        stock: stockChanged ? editVariantStock : variant.stock,
        status: variant.status || "active",
        packing_type: variant.packing_type || "",
        pairs_per_ctn: variant.pairs_per_ctn || 0,
      };

      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId
                  ? {
                    ...v,
                    selling_price: updatedVariant.selling_price,
                    stock: updatedVariant.stock,
                  }
                  : v,
              ),
            }
            : p,
        ),
      );

      try {
        const formData = new FormData();
        formData.append("product_id", productId);

        // PHP API requires multi_variants array/keys
        formData.append("multi_variants[0][id]", updatedVariant.id);
        formData.append("multi_variants[0][variant_size]", updatedVariant.variant_size);
        formData.append("multi_variants[0][color]", updatedVariant.color);
        formData.append("multi_variants[0][selling_price]", updatedVariant.selling_price);
        formData.append("multi_variants[0][stock]", updatedVariant.stock);
        formData.append("multi_variants[0][status]", updatedVariant.status);
        formData.append("multi_variants[0][packing_type]", updatedVariant.packing_type);
        formData.append("multi_variants[0][pairs_per_ctn]", updatedVariant.pairs_per_ctn);

        const response = await api.post(
          `${API_BASE}/product/admin_update_product_details.php`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Update failed");
        }

        showToast("Variant updated successfully");
        cancelVariantEdit();
      } catch (error) {
        console.error("Update error:", error);
        // Revert state on error
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, variants: product.variants } : p,
          ),
        );
        showToast(error.message || "Failed to update variant", "error");
      }
    },
    [
      products,
      editVariantSellingPrice,
      editVariantStock,
      token,
      showToast,
      cancelVariantEdit,
    ],
  );

  // Get stock badge
  const getStockBadge = useCallback((stock, qty) => {
    if (qty === 0 || qty === "0" || stock === "out_of_stock") {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    } else if (qty < 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  }, []);

  // Calculate counts
  const counts = useMemo(() => {
    const all = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const inactive = products.filter((p) => p.status === "inactive").length;
    const approveRequest = products.filter(
      (p) => p.status === "approve_request",
    ).length;
    const outOfStock = products.filter(isOutOfStock).length;
    const rejected = products.filter((p) => p.status === "reject").length;
    const best_selected = products.filter((p) => p.is_top_pick === "1").length;

    return {
      all,
      active,
      inactive,
      approveRequest,
      outOfStock,
      rejected,
      best_selected,
    };
  }, [products, isOutOfStock]);

  // Filters configuration
  const filters = useMemo(() => [
    {
      label: "All Product",
      value: "all",
      count: counts.all,
      icon: Package,
      color: "purple",
    },
    {
      label: "Products Listing Requested",
      value: "approve_request",
      count: counts.approveRequest,
      icon: AlertCircle,
      color: "yellow",
    },
    {
      label: "Active Product",
      value: "active",
      count: counts.active,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "In-Active Product",
      value: "inactive",
      count: counts.inactive,
      icon: XCircle,
      color: "red",
    },
    {
      label: "Out of Stock Product",
      value: "out_of_stock",
      count: counts.outOfStock,
      icon: AlertCircle,
      color: "red",
    },
    {
      label: "Rejected Product",
      value: "reject",
      count: counts.rejected,
      icon: XCircle,
      color: "red",
    },
    {
      label: "Best 50 product",
      value: "best_selected",
      count: counts.best_selected,
      icon: CheckCircle,
      color: "green",
    },
  ]);

  // Filter and search products

  // Add these memos for unique brands and categories
  const uniqueBrands = useMemo(() => {
    const brands = new Set();
    products.forEach((p) => {
      if (p.brand_name) brands.add(p.brand_name);
    });
    return Array.from(brands).sort();
  }, [products]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    products.forEach((p) => {
      if (p.category_name) categories.add(p.category_name);
    });
    return Array.from(categories).sort();
  }, [products]);

  // Update the filteredProducts useMemo to include brand and category filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    switch (selectedFilter) {
      case "active":
        filtered = filtered.filter((p) => p.status === "active");
        break;
      case "inactive":
        filtered = filtered.filter((p) => p.status === "inactive");
        break;
      case "approve_request":
        filtered = filtered.filter((p) => p.status === "approve_request");
        break;
      case "out_of_stock":
        filtered = filtered.filter(isOutOfStock);
        break;
      case "reject":
        filtered = filtered.filter((p) => p.status === "reject");
        break;
      case "best_selected":
        filtered = filtered.filter((p) => p.is_top_pick === "1");
        break;
      default:
        break;
    }

    // Apply brand filter
    if (brandFilter) {
      filtered = filtered.filter((p) => p.brand_name === brandFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category_name === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.article_name?.toLowerCase().includes(query) ||
          p.category_name?.toLowerCase().includes(query) ||
          p.id?.toString().includes(query) ||
          p.brand_name?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [
    selectedFilter,
    searchQuery,
    products,
    isOutOfStock,
    brandFilter,
    categoryFilter,
  ]);

  // Export to CSV - Defined AFTER filteredProducts
  const handleExportCSV = useCallback(() => {
    if (products.length === 0) {
      showToast("No products to export", "error");
      return;
    }

    // Use filteredProducts if available, otherwise use all products
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
    const link = document.createElement("a");
    link.href = url;
    link.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${exportData.length} products successfully`);
  }, [products, filteredProducts, showToast]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const handleFilterChange = useCallback((filterValue) => {
    setSelectedFilter(filterValue);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
              aria-label="Search products"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Add Product
          </button>

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
                onClick={handleExportCSV}
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
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 whitespace-nowrap border ${isActive
                ? colorMap[filter.color] ||
                "bg-purple-600 text-white border-purple-600"
                : inactiveColorMap[filter.color] ||
                "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
            >
              <Icon size={16} />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-gray-900">
            {filteredProducts.length > 0 ? startIndex + 1 : 0}
          </span>
          {" to "}
          <span className="text-gray-900">
            {Math.min(endIndex, filteredProducts.length)}
          </span>
          {" of "}
          <span className="text-gray-900">{filteredProducts.length}</span>{" "}
          products
        </p>
        <button
          onClick={() => setShowBestProductsModal(true)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Add 50 Products
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Brand:</span>
            <select
              value={brandFilter}
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 min-w-[130px]"
              aria-label="Filter by brand"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 min-w-[130px]"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            aria-label="Items per page"
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
                  Display Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission per pair
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th> */}
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
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <p
                                onClick={() => goToProductDetail(product.id)}
                                className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600 transition-colors uppercase"
                              >
                                {product.article_name} | {product.variant} |{" "}
                                {product.color} | {product.packing_type} |{" "}
                                {product.category_name}
                              </p>
                              {/* <p className="text-xs text-gray-500 mt-0.5">
                                {product.category_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {product.packing_type}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {product.color}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {product.variant}
                              </p> */}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {product.brand_name}
                          </span>
                        </td>

                        {/* <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {product.owner_name}
                          </span>
                        </td> */}

                        {/* <td className="px-4 py-3"> */}
                        {/* <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.price || 0}
                            </span>
                            <span className="text-sm font-semibold text-emerald-600">
                              ₹{product.selling_price || 0}
                            </span>
                          </div> */}
                        {/* <td className="px-4 py-3"> */}

                        {/* </td> */}
                        {/* </td> */}
                        {/* Price / Selling Price with Edit */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {editingProductId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editProductSellingPrice}
                                  onChange={(e) =>
                                    setEditProductSellingPrice(e.target.value)
                                  }
                                  className="w-20 px-2 py-1 border border-violet-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  autoFocus
                                  min="0"
                                />
                                <button
                                  onClick={() => saveProductEdit(product.id)}
                                  className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                                  title="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={cancelProductEdit}
                                  className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="text-sm font-semibold text-emerald-600">
                                  ₹{product.selling_price || 0}
                                </span>
                                <Pencil
                                  size={16}
                                  className="cursor-pointer text-gray-500 hover:text-purple-600"
                                  onClick={() => startProductEdit(product)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                        {/* commission type */}
                        {/* Commission per pair - Editable */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {editingProductId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editProductCommission}
                                  onChange={(e) => setEditProductCommission(e.target.value)}
                                  className="w-20 px-2 py-1 border border-violet-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  autoFocus
                                  min="0"
                                  step="0.01"
                                />
                                <button
                                  onClick={() => saveProductEdit(product.id)}
                                  className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                                  title="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={cancelProductEdit}
                                  className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="text-sm font-semibold text-purple-600">
                                  {product.commission_type === "percentage"
                                    ? `${product.commission || 0}%`
                                    : `₹${product.commission || 0}`}
                                </span>
                                <Pencil
                                  size={16}
                                  className="cursor-pointer text-gray-500 hover:text-purple-600"
                                  onClick={() => startProductEdit(product)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                        {/* comission per pair */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-purple-600">
                              {product.commission_type === "percentage"
                                ? `₹${(
                                  (Number(product.selling_price) *
                                    Number(product.commission)) /
                                  100
                                ).toFixed(2)}`
                                : `₹${Number(product.commission || 0).toFixed(2)}`}
                            </span>

                            {/* {product.commission_type === "percentage" && (
                                    <span className="text-xs text-gray-500">
                                      {product.commission}% of Selling Price
                                    </span>
                                  )}

                                  {product.commission_type === "per_piece_rate" && (
                                    <span className="text-xs text-gray-500">
                                      Per piece rate
                                    </span>
                                  )} */}
                          </div>
                        </td>
                        {/* vraints of that */}
                        <td className="px-4 py-3">
                          {variantCount > 0 ? (
                            <button
                              type="button"
                              data-variants-toggle
                              onClick={(e) =>
                                toggleVariantsPanel(e, product.id)
                              }
                              className={`text-sm font-semibold cursor-pointer hover:underline ${isVariantsExpanded
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

                        {/*  <td className="px-4 py-3"> */}
                        {/* <span
                            className={`text-sm font-medium ${product.stock_quantity === 0 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {product.stock_quantity}
                          </span> */}

                        {/* </td> */}

                        {/* Stock with Edit */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {editingProductId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editProductStock}
                                  onChange={(e) =>
                                    setEditProductStock(e.target.value)
                                  }
                                  className="w-20 px-2 py-1 border border-violet-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  min="0"
                                />
                                <button
                                  onClick={() => saveProductEdit(product.id)}
                                  className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                                  title="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={cancelProductEdit}
                                  className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span
                                  className={`text-sm font-medium ${product.stock_quantity === 0 ? "text-red-600" : "text-gray-900"}`}
                                >
                                  {product.stock_quantity}
                                </span>
                                <Pencil
                                  size={16}
                                  className="cursor-pointer text-gray-500 hover:text-purple-600"
                                  onClick={() => startProductEdit(product)}
                                />
                              </>
                            )}
                          </div>
                        </td>

                        {/* status */}

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
                                  setCommissionType("");
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
                              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${product.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                                }`}
                              aria-label={`Toggle product status`}
                            >
                              <div
                                className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${product.status === "active"
                                  ? "left-5"
                                  : "left-0.5"
                                  }`}
                              />
                            </button>
                          )}
                        </td>

                        {/* acition on it */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Product"
                              aria-label="View product"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => goToProductDetail(product.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Product"
                              aria-label="Edit product"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Variants Sub-table */}
                      {isVariantsExpanded && (
                        <tr>
                          <td
                            colSpan={10}
                            className="p-4 bg-gray-50/50 border-l-4 border-blue-500 pl-12"
                          >
                            <div
                              ref={variantsPanelRef}
                              className="animate-fadeIn"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                <h5 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                                  Available SKUs / Options Inventory
                                </h5>
                              </div>
                              <VariantsDetailTable
                                product={product}
                                variants={product.variants}
                                productId={product.id}
                                onToggleVariantStatus={toggleVariantStatus}
                                togglingVariantId={togglingVariantId}
                                editingVariantId={editingVariantId}
                                setEditingVariantId={setEditingVariantId}
                                editVariantSellingPrice={editVariantSellingPrice}
                                setEditVariantSellingPrice={setEditVariantSellingPrice}
                                editVariantStock={editVariantStock}
                                setEditVariantStock={setEditVariantStock}
                                onSaveVariantEdit={saveVariantEdit}
                                onCancelVariantEdit={cancelVariantEdit}
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
                  <td colSpan="10" className="px-4 py-12 text-center">
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
              {currentProducts.map((product) => {
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
                          loading="lazy"
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
                            className={`ml-1 text-sm font-semibold cursor-pointer hover:underline ${isVariantsExpanded
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
                                setCommissionType("");
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
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ml-1 ${product.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                              }`}
                            aria-label={`Toggle product status`}
                          >
                            <div
                              className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${product.status === "active"
                                ? "left-5"
                                : "left-0.5"
                                }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile Variants Panel */}
                    {isVariantsExpanded && (
                      <div
                        ref={variantsPanelRef}
                        className="mt-3 p-4 bg-gray-50/50 border-l-4 border-blue-500 animate-fadeIn"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          <h5 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                            Available SKUs / Options Inventory
                          </h5>
                        </div>
                        <VariantsDetailTable
                          product={product}
                          variants={product.variants}
                          productId={product.id}
                          onToggleVariantStatus={toggleVariantStatus}
                          togglingVariantId={togglingVariantId}
                          editingVariantId={editingVariantId}
                          setEditingVariantId={setEditingVariantId}
                        // sellingPrice={sellingPrice}
                        // setSellingPrice={setSellingPrice}
                        // stockQuantity={stockQuantity}
                        // setStockQuantity={setStockQuantity}
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        aria-label="View product"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => goToProductDetail(product.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit size={16} />
                      </button>
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

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return page;
            }).map((page) => (
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

            {totalPages > 7 && currentPage < totalPages - 3 && (
              <>
                <span className="px-2 py-1.5 text-sm text-gray-400">...</span>
                <button
                  onClick={() => goToPage(totalPages)}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}

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
              Commission Value
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={commission}
              onChange={handleCommissionChange}
              autoFocus
              placeholder="Enter commission value"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              if (!commission) {
                alert("Please enter commission value");
                return;
              }
              if (!commissionType) {
                alert("Please select commission type");
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

      {/* set best products  */}
      <Modal
        isOpen={showBestProductsModal}
        onClose={() => setShowBestProductsModal(false)}
        title={`Best 50 Products (${selectedBestProducts.length}/50)`}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={bestProductSearch}
            onChange={(e) => setBestProductSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border rounded-lg px-3 py-2"
          />

          <div className="max-h-[400px] overflow-y-auto border rounded-lg">
            {filteredBestProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={normalizeProductImageUrl(product.image)}
                    alt={product.article_name}
                    className="w-12 h-12 rounded object-cover border"
                  />

                  <div>
                    <p className="font-medium text-sm">
                      {product.article_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {product.category_name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {product.brand_name}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={selectedBestProducts.includes(product.id)}
                  onChange={() => toggleBestProduct(product.id)}
                  className="w-5 h-5"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowBestProductsModal(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={saveBestProducts}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Save Products
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <AdminAddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* View Product Modal */}
      <ViewProduct
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        productId={selectedProduct}
        variant="admin"
      />
    </div>
  );
}
