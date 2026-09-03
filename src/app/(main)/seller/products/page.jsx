"use client";
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
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
  Pencil,
  Check,
} from "lucide-react";
import * as XLSX from "xlsx";
import ProductFormModal from "@/app/components/shared/ProductFormModel";
import ViewProductModal from "@/app/components/shared/ViewProductModal";
import BulkUploadModal from "@/app/components/shared/BulkUploadModel";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";
const IMAGE_BASE = "https://namami-infotech.com";

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
    return `${IMAGE_BASE}/Stepkaro/${trimmed}`;
  }

  return `${IMAGE_BASE}/${trimmed}`;
};

const VariantsDetailTable = ({
  product,
  variants,
  productId,
  onToggleVariantStatus,
  togglingVariantId,
  editingVariantId,
  editVariantStock,
  setEditVariantStock,
  editVariantSellingPrice, // ADD THIS
  setEditVariantSellingPrice,
  setEditingVariantId,
  onSaveVariantStock,
  onCancelVariantEdit,
}) => {
  if (!variants?.length) {
    return <p className="text-sm text-gray-500 py-2">No variants available</p>;
  }

  return (
    <div
      data-variants-panel="true"
      className="overflow-x-auto rounded-lg border border-blue-100 bg-blue-50/40"
      onClick={(e) => e.stopPropagation()}
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
              Selling Price
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Commission Per Pair
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
              Settlement Per Pair
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
              {/* <td className="px-3 py-2 text-gray-900 uppercase">
                {product.article_name} | {variant.variant_size} |{" "}
                {variant.color} | {variant.packing_type} |{" "}
                {product.category_name}
                <span className="text-xs text-gray-500">
                  Pairs/CTN:{" "}
                  <span className="font-medium text-gray-700">
                    {product.pairs_per_ctn || "—"}
                  </span>
                </span>
              </td> */}
              <td className="px-3 py-2 text-gray-900 uppercase">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {product.article_name} | {variant.variant_size} |{" "}
                    {variant.color} | {variant.packing_type} |{" "}
                    {product.category_name}
                  </span>

                  {/* <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-gray-700 normal-case">
                    Pairs/CTN: {variant.pairs_per_ctn || "—"}
                  </span> */}
                  <span className="text-xs text-gray-500">
                    Pairs/CTN:{" "}
                    <span className="font-medium text-gray-700">
                      {variant.pairs_per_ctn || "—"}
                    </span>
                  </span>
                </div>
              </td>
              <td className="px-3 py-2 font-medium text-emerald-600">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {editingVariantId === variant.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editVariantSellingPrice}
                        onChange={(e) =>
                          setEditVariantSellingPrice(e.target.value)
                        }
                        className="w-24 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                        step="0.01"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveVariantStock(productId, variant.id);
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
                        ₹{variant.selling_price}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingVariantId(variant.id);
                          setEditVariantStock(variant.stock ?? "");
                          setEditVariantSellingPrice(
                            variant.selling_price ?? "",
                          ); // ADD THIS LINE
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
              <td className="px-3 py-2 font-medium text-emerald-600">
                <span className="text-sm font-semibold text-purple-600">
                  {product.commission_type === "percentage"
                    ? `₹${(
                      (Number(variant.selling_price) *
                        Number(product.commission)) /
                      100
                    ).toFixed(2)}`
                    : `₹${Number(product.commission || 0).toFixed(2)}`}
                </span>
              </td>
              <td className="px-4 py-3">
                {/* Settlement / Payout Amount */}
                <span className="text-sm font-semibold text-green-600">
                  {(() => {
                    const sellingPrice = Number(variant.selling_price || 0);

                    const commission =
                      product.commission_type === "percentage"
                        ? (sellingPrice * Number(product.commission || 0)) / 100
                        : Number(product.commission || 0);

                    const payout = sellingPrice - commission;

                    return `₹${payout.toFixed(2)}`;
                  })()}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-900">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {editingVariantId === variant.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editVariantStock}
                        onChange={(e) => setEditVariantStock(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-24 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveVariantStock(productId, variant.id);
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
                          setEditVariantStock(variant.stock ?? "");
                          setEditVariantSellingPrice(
                            variant.selling_price ?? "",
                          ); // ADD THIS LINE
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
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

export default function SellerProductsPage() {
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
  const [expandedVariantsProductId, setExpandedVariantsProductId] =
    useState(null);
  const [togglingVariantId, setTogglingVariantId] = useState(null);
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductStock, setEditProductStock] = useState("");
  const [editSellingPrice, setEditSellingPrice] = useState("");

  const [editingVariantId, setEditingVariantId] = useState(null);
  const [editVariantStock, setEditVariantStock] = useState("");
  const [editVariantSellingPrice, setEditVariantSellingPrice] = useState("");

  // bulk upload model
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const handleBulkModel = () => {
    setIsBulkModalOpen(true);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
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

  const variantsPanelRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchProducts = useCallback(async () => {
    const token = getToken();
    if (!token) {
      showToast("Authentication required", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/product/get_vendor_products.php`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();

      if (result.success) {
        setProducts(result.data || []);
      } else {
        showToast(result.message || "Failed to fetch products", "error");
      }
    } catch (error) {
      console.error("Products fetch error:", error);
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/product/get_product_filters_new.php`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();

      if (result.success) {
        setFilterOptions({
          brands: [...new Set(result.data.brands || [])],
          categories: [...new Set(result.data.categories || [])],
          gender: [...new Set(result.data.gender || [])],
          colors: [...new Set(result.data.colors || [])],
          materials: [...new Set(result.data.materials || [])],
          upper_materials: [...new Set(result.data.upper_materials || [])],
          packingTypes: [...new Set(result.data.packingTypes || [])],
        });
      }
    } catch (error) {
      console.error("Filter options error:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
  }, [fetchProducts, fetchFilterOptions]);

  useEffect(() => {
    if (expandedVariantsProductId === null) return;

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
      setExpandedVariantsProductId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedVariantsProductId]);

  const toggleVariantsPanel = useCallback((e, productId) => {
    e.stopPropagation();
    setExpandedVariantsProductId((prev) =>
      prev === productId ? null : productId,
    );
  }, []);

  const getVariantCount = useCallback((product) => {
    return Array.isArray(product.variants) ? product.variants.length : 0;
  }, []);

  const isOutOfStock = useCallback((product) => {
    if (product.stock === "out_of_stock") return true;
    const qty = product.stock_quantity ?? product.qty;
    return qty === 0 || qty === "0";
  }, []);

  const getStockBadge = useCallback((stock, qty) => {
    if (qty === 0 || qty === "0" || stock === "out_of_stock") {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    }
    if (qty < 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  }, []);

  const toggleStatus = useCallback(
    async (productId) => {
      const product = products.find((p) => p.id === productId);
      const token = getToken();
      if (!product || !token) return;

      const newStatus = product.status === "active" ? "inactive" : "active";

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p)),
      );

      try {
        const response = await fetch(
          `${API_BASE}/product/toggle_product_status.php`,
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

        if (!result.success) {
          throw new Error(result.message || "Toggle failed");
        }
        showToast("Product status updated");
      } catch (error) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, status: product.status } : p,
          ),
        );
        showToast(error.message || "Failed to update status", "error");
      }
    },
    [products, showToast],
  );

  const toggleVariantStatus = useCallback(
    async (productId, variantId) => {
      try {
        setTogglingVariantId(variantId);
        const token = getToken();
        const product = products.find((p) => p.id === productId);
        const variant = product?.variants?.find((v) => v.id === variantId);
        const newStatus = variant?.status === "active" ? "inactive" : "active";

        const response = await fetch(`${API_BASE}/admin/toggle_products.php`, {
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
        });

        const result = await response.json();
        if (result.success) {
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
          showToast("Variant status updated");
        } else {
          showToast(result.message || "Failed to update variant", "error");
        }
      } catch (error) {
        console.error(error);
        showToast("Failed to update variant status", "error");
      } finally {
        setTogglingVariantId(null);
      }
    },
    [products, showToast],
  );

  const startProductStockEdit = useCallback((product) => {
    setEditingProductId(product.id);
    setEditingVariantId(null);
    setEditProductStock(product.stock_quantity ?? "");
    setEditSellingPrice(product.selling_price ?? "");
  }, []);

  const cancelProductEdit = useCallback(() => {
    setEditingProductId(null);
    setEditProductStock("");
    setEditSellingPrice("");
  }, []);

  // const saveProductStock = useCallback(
  //   async (productId) => {
  //     const newQuantity = parseInt(editProductStock, 10);
  //     if (isNaN(newQuantity) || newQuantity < 0) {
  //       showToast("Please enter a valid quantity", "error");
  //       return;
  //     }

  //     const product = products.find((p) => p.id === productId);
  //     if (!product) return;

  //     setProducts((prev) =>
  //       prev.map((p) =>
  //         p.id === productId ? { ...p, stock_quantity: newQuantity } : p,
  //       ),
  //     );

  //     try {
  //       const token = getToken();
  //       const response = await fetch(`${API_BASE}/stock/update_stock.php`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           product_id: productId,
  //           stock_quantity: newQuantity,
  //           selling_price: Number(editSellingPrice),
  //         }),
  //       });
  //       const result = await response.json();

  //       if (!result.success) {
  //         throw new Error(result.message || "Failed to update stock");
  //       }
  //       showToast("Stock updated successfully");
  //       setProducts((prev) =>
  //         prev.map((p) =>
  //           p.id === productId
  //             ? {
  //                 ...p,
  //                 stock_quantity: newQuantity,
  //                 selling_price: Number(editSellingPrice),
  //               }
  //             : p,
  //         ),
  //       );
  //       cancelProductEdit();
  //     } catch (error) {
  //       setProducts((prev) =>
  //         prev.map((p) => (p.id === productId ? product : p)),
  //       );
  //       showToast(error.message || "Failed to update stock", "error");
  //     }
  //   },
  //   [editProductStock, products, showToast, cancelProductEdit],
  // );
  const saveProductStock = useCallback(
    async (productId) => {
      const newQuantity = parseInt(editProductStock, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        showToast("Please enter a valid quantity", "error");
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Store original data for rollback
      const originalProduct = { ...product };

      // Update UI optimistically
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
              ...p,
              stock_quantity: newQuantity,
              selling_price: Number(editSellingPrice) || p.selling_price,
            }
            : p,
        ),
      );

      try {
        const token = getToken();
        const payload = {
          product_id: productId,
          stock_quantity: newQuantity,
          selling_price: Number(editSellingPrice) || product.selling_price,
        };

        if (product.variants && product.variants.length > 0) {
          payload.multi_variants = product.variants.map(v => ({
            variant_id: v.id,
            stock: v.stock
          }));
        }

        const response = await fetch(`${API_BASE}/stock/update_stock.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update stock");
        }

        showToast("Stock updated successfully");
        cancelProductEdit();
      } catch (error) {
        // Rollback on error
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? originalProduct : p)),
        );
        showToast(error.message || "Failed to update stock", "error");
      }
    },
    [
      editProductStock,
      editSellingPrice,
      products,
      showToast,
      cancelProductEdit,
    ],
  );

  const cancelVariantEdit = useCallback(() => {
    setEditingVariantId(null);
    setEditVariantStock("");
    setEditVariantSellingPrice("");
  }, []);

  // const saveVariantStock = useCallback(
  //   async (productId, variantId) => {
  //     const newQuantity = parseInt(editVariantStock, 10);
  //     if (isNaN(newQuantity) || newQuantity < 0) {
  //       showToast("Please enter a valid quantity", "error");
  //       return;
  //     }

  //     const product = products.find((p) => p.id === productId);
  //     if (!product) return;

  //     setProducts((prev) =>
  //       prev.map((p) =>
  //         p.id === productId
  //           ? {
  //               ...p,
  //               variants: p.variants.map((v) =>
  //                 v.id === variantId ? { ...v, stock: newQuantity } : v,
  //               ),
  //             }
  //           : p,
  //       ),
  //     );

  //     try {
  //       const token = getToken();
  //       const response = await fetch(`${API_BASE}/stock/update_stock.php`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           product_id: productId,
  //           multi_variants: [
  //             {
  //               variant_id: variantId,
  //               stock: newQuantity,
  //               selling_price: Number(editVariantSellingPrice),
  //             },
  //           ],
  //         }),
  //       });
  //       const result = await response.json();

  //       if (!result.success) {
  //         throw new Error(result.message || "Failed to update variant stock");
  //       }
  //       showToast("Variant stock updated");
  //       variants: p.variants.map((v) =>
  //         v.id === variantId
  //           ? {
  //               ...v,
  //               stock: newQuantity,
  //               selling_price: Number(editVariantSellingPrice),
  //             }
  //           : v,
  //       );
  //       cancelVariantEdit();
  //     } catch (error) {
  //       setProducts((prev) =>
  //         prev.map((p) =>
  //           p.id === productId ? { ...p, variants: product.variants } : p,
  //         ),
  //       );
  //       showToast(error.message || "Failed to update variant stock", "error");
  //     }
  //   },
  //   [editVariantStock, products, showToast, cancelVariantEdit],
  // );
  const saveVariantStock = useCallback(
    async (productId, variantId) => {
      const newQuantity = parseInt(editVariantStock, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        showToast("Please enter a valid quantity", "error");
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Store original variant for rollback
      const originalVariant = product.variants.find((v) => v.id === variantId);
      if (!originalVariant) return;

      // Update UI optimistically
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId
                  ? {
                    ...v,
                    stock: newQuantity,
                    selling_price:
                      Number(editVariantSellingPrice) || v.selling_price, // FIX: Update selling price
                  }
                  : v,
              ),
            }
            : p,
        ),
      );

      try {
        const token = getToken();

        const payload = {
          product_id: productId,
          stock_quantity: product.stock_quantity || product.quantity || 0,
          multi_variants: product.variants.map((v) => {
            if (v.id === variantId) {
              return {
                variant_id: v.id,
                stock: newQuantity,
                selling_price: Number(editVariantSellingPrice) || originalVariant.selling_price,
              };
            }
            return {
              variant_id: v.id,
              stock: v.stock
            };
          })
        };

        const response = await fetch(`${API_BASE}/stock/update_stock.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update variant stock");
        }

        showToast("Variant stock updated successfully");
        cancelVariantEdit();
      } catch (error) {
        // Rollback on error
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                ...p,
                variants: p.variants.map((v) =>
                  v.id === variantId ? originalVariant : v,
                ),
              }
              : p,
          ),
        );
        showToast(error.message || "Failed to update variant stock", "error");
      }
    },
    [
      editVariantStock,
      editVariantSellingPrice,
      products,
      showToast,
      cancelVariantEdit,
    ],
  );

  const handleViewProduct = useCallback((product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  }, []);

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
      variants: [],
      image: null,
    });
    setEditProduct(null);
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    let extractedMin = "";
    let extractedMax = "";
    const sizeStr =
      product.variant ||
      (product.min_size && product.max_size
        ? `${product.min_size}-${product.max_size}`
        : "") ||
      product.size ||
      "";

    if (sizeStr.toLowerCase().includes("x")) {
      const parts = sizeStr.toLowerCase().split("x");
      if (parts.length === 2) {
        extractedMin = parts[0].trim();
        extractedMax = parts[1].trim();
      }
    } else if (sizeStr.includes("-")) {
      const parts = sizeStr.split("-");
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
      article_name: product.article_name || "",
      description: product.description || "",
      selling_price: product.selling_price || product.price || "",
      price: product.price || "",
      brand_name: product.brand_name || "",
      category_name: product.category_name || "",
      gender: product.gender || "",
      color: product.color || "",
      material: product.material || "",
      upper_material: product.upper_material || "",
      packing_type: product.packing_type || "",
      pairs_per_ctn: product.pairs_per_ctn || "",
      origin: product.origin || "Made in India",
      stock_quantity: product.stock_quantity || "",
      status: product.status || "inactive",
      image: product.image || "",
      min_size: extractedMin,
      max_size: extractedMax,
      variants: (product.variants || []).map((v) => {
        let minSz = "";
        let maxSz = "";
        const szStr = v.variant_size || v.size || "";
        if (szStr.toLowerCase().includes("x")) {
          const parts = szStr.toLowerCase().split("x");
          if (parts.length === 2) {
            minSz = parts[0].trim();
            maxSz = parts[1].trim();
          }
        } else if (szStr.includes("-")) {
          const parts = szStr.split("-");
          if (parts.length === 2) {
            minSz = parts[0].trim();
            maxSz = parts[1].trim();
          }
        } else {
          minSz = szStr;
          maxSz = szStr;
        }

        return {
          id: v.id,
          variant_name: v.variant_name || "",
          min_size: minSz,
          max_size: maxSz,
          price: v.price || "",
          selling_price: v.selling_price || "",
          stock: v.stock || "",
          packing_type: v.packing_type || "",
          pairs_per_ctn: v.pairs_per_ctn || "",
          color: v.color || "",
          image: v.image || null,
          preview: v.image
            ? v.image.startsWith("http")
              ? v.image
              : `https://namami-infotech.com/Stepkaro/${v.image}`
            : "",
        };
      }),
    });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      const formData = new FormData();

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

      if (newProduct.image && typeof newProduct.image !== "string") {
        formData.append("image", newProduct.image);
      }

      const multiVariants = (newProduct.variants || []).map((variant) => {
        const variantData = {
          variant_name: variant.variant_name || "",
          min_size: variant.min_size || "",
          max_size: variant.max_size || "",
          color: variant.color || "",
          price: variant.price || "",
          selling_price: variant.selling_price || "",
          stock: variant.stock || "",
          packing_type: variant.packing_type || newProduct.packing_type || "",
          pairs_per_ctn:
            variant.pairs_per_ctn || newProduct.pairs_per_ctn || "",
          status: "active",
        };
        if (isEditing && variant.id) {
          variantData.variant_id = variant.id;
        }
        return variantData;
      });

      formData.append("multi_variants", JSON.stringify(multiVariants));

      if (newProduct.variants?.length > 0) {
        newProduct.variants.forEach((v, index) => {
          formData.append(
            `multi_variants[${index}][variant_name]`,
            v.variant_name || "",
          );
          formData.append(
            `multi_variants[${index}][min_size]`,
            v.min_size || "",
          );
          formData.append(
            `multi_variants[${index}][max_size]`,
            v.max_size || "",
          );
          formData.append(`multi_variants[${index}][color]`, v.color || "");
          formData.append(`multi_variants[${index}][price]`, v.price || "");
          formData.append(
            `multi_variants[${index}][selling_price]`,
            v.selling_price || "",
          );
          formData.append(`multi_variants[${index}][stock]`, v.stock || "");
          formData.append(
            `multi_variants[${index}][packing_type]`,
            v.packing_type || newProduct.packing_type || "",
          );
          formData.append(
            `multi_variants[${index}][pairs_per_ctn]`,
            v.pairs_per_ctn || newProduct.pairs_per_ctn || "",
          );
          formData.append(`multi_variants[${index}][status]`, "active");
          if (isEditing && v.id) {
            formData.append(`multi_variants[${index}][variant_id]`, v.id);
          }
          if (v.image && typeof v.image !== "string") {
            formData.append(`multi_variants[${index}][image]`, v.image);
          }
        });
      }

      let url = `${API_BASE}/product/vendor_add_product.php`;
      if (isEditing && editProduct) {
        formData.append("product_id", editProduct.id);
        url = `${API_BASE}/product/update_product.php`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setShowAddModal(false);
        setIsEditing(false);
        setEditProduct(null);
        fetchProducts();
        showToast(
          isEditing
            ? "Product updated successfully"
            : "Product added successfully",
        );
      } else {
        showToast(result.message || "Failed to save product", "error");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      showToast("An error occurred while saving the product", "error");
    }
  };

  const counts = useMemo(() => {
    const all = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const inactive = products.filter((p) => p.status === "inactive").length;
    const approveRequest = products.filter(
      (p) => p.status === "approve_request",
    ).length;
    const outOfStock = products.filter(isOutOfStock).length;
    const rejected = products.filter((p) => p.status === "reject").length;

    return {
      all,
      active,
      inactive,
      approveRequest,
      outOfStock,
      rejected,
    };
  }, [products, isOutOfStock]);

  const filters = useMemo(
    () => [
      {
        label: "All Product",
        value: "all",
        count: counts.all,
        icon: Package,
        color: "purple",
      },
      {
        // label: "Products Listing Requested",
        label: "Pending Products",
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
    ],
    [counts],
  );

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
      default:
        break;
    }

    if (brandFilter) {
      filtered = filtered.filter((p) => p.brand_name === brandFilter);
    }

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

  const handleExportCSV = useCallback(() => {
    if (products.length === 0) {
      showToast("No products to export", "error");
      return;
    }

    const exportData =
      filteredProducts.length > 0 ? filteredProducts : products;

    const headers = [
      "ProductID",
      "Brand",
      "Category",
      "Gender",
      "Article Name",
      "size",
      "color",
      "pair Per Ctn",
      "packing_type",
      "MRP",
      "Selling Price",
      "Commission Type",
      "Commission Value",
      "Quantity",
      "Status",
      "Sole",
      "Upper",
      "Origin",
    ];

    const rows = [];

    exportData.forEach((p) => {
      rows.push([
        p.id || "",
        p.brand_name || "",
        p.category_name || "",
        p.gender || "",
        p.article_name || "",
        p.variant || "",
        p.color || "",
        p.pairs_per_ctn || "",
        p.packing_type || "",
        p.price || 0,
        p.selling_price || 0,
        p.commission_type || "",
        p.commission || "",
        p.stock_quantity || 0,
        p.status || "",
        p.material || "",
        p.upper_material || "",
        p.origin || "",
      ]);

      if (Array.isArray(p.variants) && p.variants.length > 0) {
        p.variants.forEach((v) => {
          rows.push([
            "",
            "",
            "",
            "",
            "",
            v.variant_size || v.size || "",
            v.color || "",
            v.pairs_per_ctn || "",
            v.packing_type || "",
            v.price || 0,
            v.selling_price || 0,
            p.commission_type || "",
            p.commission || "",
            v.stock || v.stock_quantity || 0,
            v.status || p.status || "",
            "",
            "",
            "",
          ]);
        });
      }
    });

    // CSV export (kept for reference)
    // const formatCSVCell = (cell) => {
    //   if (cell === null || cell === undefined) return '""';
    //   const cellString = String(cell);
    //   return `"${cellString.replace(/"/g, '""')}"`;
    // };
    //
    // const csvContent = [
    //   headers.map(formatCSVCell).join(","),
    //   ...rows.map((row) => row.map(formatCSVCell).join(",")),
    // ].join("\n");
    //
    // const blob = new Blob(["\uFEFF" + csvContent], {
    //   type: "text/csv;charset=utf-8;",
    // });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = `seller_products_${new Date().toISOString().split("T")[0]}.csv`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(
      workbook,
      `seller_products_${new Date().toISOString().split("T")[0]}.xlsx`,
    );

    showToast(`Exported ${exportData.length} products successfully`);
  }, [products, filteredProducts, showToast]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
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

  const renderStatusCell = (product) => {
    if (product.status === "reject") {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg">
          Reject
        </span>
      );
    }
    if (product.status === "approve_request") {
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-lg">
          Pending Approval
        </span>
      );
    }
    return (
      <button
        onClick={() => toggleStatus(product.id)}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${product.status === "active" ? "bg-green-500" : "bg-red-500"
          }`}
        aria-label="Toggle product status"
      >
        <div
          className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 shadow-sm ${product.status === "active" ? "left-5" : "left-0.5"
            }`}
        />
      </button>
    );
  };

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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your product catalog
          </p>
        </div>

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
            onClick={handleBulkModel}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Upload Bulk
          </button>

          <button
            onClick={handleAddProduct}
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

        <div className="flex flex-wrap items-center gap-3">
          {/* <div className="flex items-center gap-2">
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
          </div> */}

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
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
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
                  Settlement per pair
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
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
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                              <img
                                src={normalizeProductImageUrl(product.image)}
                                alt={product.article_name || "Product"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 uppercase">
                                {product.article_name} | {product.variant} |{" "}
                                {product.color} | {product.packing_type} |{" "}
                                {product.category_name}
                              </p>
                              <span className="text-xs text-gray-500">
                                Pairs/CTN:{" "}
                                <span className="font-medium text-gray-700">
                                  {product.pairs_per_ctn || "—"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {product.brand_name}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {editingProductId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editSellingPrice}
                                  onChange={(e) =>
                                    setEditSellingPrice(e.target.value)
                                  }
                                  className="w-24 px-2 py-1 border border-violet-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  min="0"
                                  autoFocus
                                />

                                <button
                                  onClick={() => saveProductStock(product.id)}
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
                                  onClick={() => startProductStockEdit(product)}
                                />
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-purple-600">
                            {product.commission_type === "percentage"
                              ? `${product.commission || 0}%`
                              : `₹${product.commission || 0}`}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-purple-600">
                            {product.commission_type === "percentage"
                              ? `₹${(
                                (Number(product.selling_price) *
                                  Number(product.commission)) /
                                100
                              ).toFixed(2)}`
                              : `₹${Number(product.commission || 0).toFixed(2)}`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {/* Settlement / Payout Amount */}
                          <span className="text-sm font-semibold text-green-600">
                            {(() => {
                              const sellingPrice = Number(
                                product.selling_price || 0,
                              );

                              const commission =
                                product.commission_type === "percentage"
                                  ? (sellingPrice *
                                    Number(product.commission || 0)) /
                                  100
                                  : Number(product.commission || 0);

                              const payout = sellingPrice - commission;

                              return `₹${payout.toFixed(2)}`;
                            })()}
                          </span>
                        </td>

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
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveProductStock(product.id)}
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
                                  className={`text-sm font-medium ${Number(product.stock_quantity) === 0
                                    ? "text-red-600"
                                    : "text-gray-900"
                                    }`}
                                >
                                  {product.stock_quantity}
                                </span>
                                <Pencil
                                  size={16}
                                  className="cursor-pointer text-gray-500 hover:text-purple-600"
                                  onClick={() => startProductStockEdit(product)}
                                />
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {renderStatusCell(product)}
                        </td>

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
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Product"
                              aria-label="Edit product"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>

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
                                editVariantStock={editVariantStock}
                                editVariantSellingPrice={
                                  editVariantSellingPrice
                                } // ADD THIS
                                setEditVariantSellingPrice={
                                  setEditVariantSellingPrice
                                } // ADD THIS
                                setEditVariantStock={setEditVariantStock}
                                setEditingVariantId={setEditingVariantId}
                                onSaveVariantStock={saveVariantStock}
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

        <div className="lg:hidden">
          {currentProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {currentProducts.map((product) => {
                const stockBadge = getStockBadge(
                  product.stock,
                  product.stock_quantity,
                );
                const variantCount = getVariantCount(product);
                const isVariantsExpanded =
                  expandedVariantsProductId === product.id;

                return (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={normalizeProductImageUrl(product.image)}
                          alt={product.article_name || "Product"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
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
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-gray-500">Status:</span>
                        {renderStatusCell(product)}
                      </div>
                    </div>

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
                          editVariantStock={editVariantStock}
                          setEditVariantStock={setEditVariantStock}
                          setEditingVariantId={setEditingVariantId}
                          onSaveVariantStock={saveVariantStock}
                          onCancelVariantEdit={cancelVariantEdit}
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
                        onClick={() => handleEditProduct(product)}
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

      <ProductFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isEditing={isEditing}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        filterOptions={filterOptions}
        onSubmit={submitProduct}
      />

      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
        variant="seller"
        onEdit={handleEditProduct}
      />
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
}
