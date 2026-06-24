"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Package,
  Save,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Store,
  User,
  Phone,
  Building2,
  X,
} from "lucide-react";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

// Compact Input Field
const InputField = ({ label, required, error, hint, className = "", ...props }) => (
  <div className={className}>
    <label className="text-xs font-medium text-gray-700 block mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
      {hint && <span className="text-gray-400 text-[10px] ml-1">({hint})</span>}
    </label>
    <input
      {...props}
      className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && (
      <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
        <AlertCircle size={10} />
        {error}
      </p>
    )}
  </div>
);

// Compact Select Field
const SelectField = ({
  label,
  required,
  error,
  options,
  placeholder,
  className = "",
  ...props
}) => (
  <div className={className}>
    <label className="text-xs font-medium text-gray-700 block mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">{placeholder || `Select ${label}`}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
        <AlertCircle size={10} />
        {error}
      </p>
    )}
  </div>
);

// Compact Image Upload
const ImageUpload = ({ label, required, error, preview, onImageChange, id, compact = false }) => (
  <div>
    <label className="text-xs font-medium text-gray-700 block mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div
      className={`flex items-center gap-2 p-2 border rounded-lg transition ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-teal-400"
      }`}
    >
      <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0`}>
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={compact ? 16 : 20} className="text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className={`${compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} border rounded-lg cursor-pointer hover:bg-gray-50 transition inline-block`}
        >
          Choose
        </label>
      </div>
    </div>
    {error && (
      <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
        <AlertCircle size={10} />
        {error}
      </p>
    )}
  </div>
);

// Compact Variant Card
const VariantCard = ({ variant, index, onRemove, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg border flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
            {variant.preview ? (
              <img src={variant.preview} alt="Variant" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={12} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-gray-700 truncate">
                #{index + 1} {variant.variant_name || `Variant`}
              </span>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {variant.min_size || "-"}x{variant.max_size || "-"}
              </span>
              {variant.color && (
                <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {variant.color}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400">
              Stock: {variant.stock || 0} | ₹{variant.selling_price || 0}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(variant);
            }}
            className="p-1 text-gray-400 hover:text-teal-600 transition"
          >
            <Edit2 size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(variant.id);
            }}
            className="p-1 text-red-400 hover:text-red-600 transition"
          >
            <Trash2 size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 text-gray-400"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-2 border-t bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-1 text-xs">
          <div><span className="text-gray-500">MRP:</span> <span className="font-medium">₹{variant.price || 0}</span></div>
          <div><span className="text-gray-500">Selling:</span> <span className="font-medium">₹{variant.selling_price || 0}</span></div>
          <div><span className="text-gray-500">Packing:</span> <span className="font-medium">{variant.packing_type || "-"}</span></div>
          <div><span className="text-gray-500">Pairs/Ctn:</span> <span className="font-medium">{variant.pairs_per_ctn || "-"}</span></div>
        </div>
      )}
    </div>
  );
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `https://namami-infotech.com/${image.startsWith("/") ? image.slice(1) : image}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [variantCounter, setVariantCounter] = useState(1);
  const [showVariantForm, setShowVariantForm] = useState(false);

  const [vendorInfo, setVendorInfo] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    gst_number: "",
    email: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    gender: [],
    colors: [],
    materials: [],
    upper_materials: [],
    packingTypes: [],
  });

  const [form, setForm] = useState({
    product_id: "",
    vendor_id: "",
    article_name: "",
    description: "",
    price: "",
    selling_price: "",
    brand_name: "",
    category_name: "",
    gender: "",
    color: "",
    material: "",
    upper_material: "",
    packing_type: "",
    commission_type: "percentage",
    commission: "",
    pairs_per_ctn: "",
    stock_quantity: "",
    min_size: "",
    max_size: "",
    origin: "Made in India",
    status: "active",
  });

  const createVariant = useCallback((id) => ({
    id,
    api_id: null,
    variant_name: "",
    min_size: "",
    max_size: "",
    price: "",
    selling_price: "",
    stock: "",
    packing_type: "",
    pairs_per_ctn: "",
    color: "",
    image: null,
    preview: "",
  }), []);

  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState(createVariant(1));
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token") || localStorage.getItem("token") || ""
    : "";

  const fetchFilters = useCallback(async (vendorId) => {
    if (!vendorId || !token) return;
    try {
      const res = await fetch(
        `${API_BASE}/product/get_product_filters_new.php?vendor_id=${vendorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) {
        setFilterOptions({
          brands: data.data.brands || [],
          categories: data.data.categories || [],
          gender: data.data.gender || [],
          colors: data.data.colors || [],
          materials: data.data.materials || [],
          upper_materials: data.data.upper_materials || [],
          packingTypes: data.data.packingTypes || [],
        });
      }
    } catch (error) {
      console.error("Filter fetch error:", error);
    }
  }, [token]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setErrorMessage("Authentication token missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        const response = await fetch(
          `${API_BASE}/product/get_admin_products_details.php?id=${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch product details");
        }

        const product = result.data;
        
        // Parse variant size if it exists
        let minSize = product.min_size || "";
        let maxSize = product.max_size || "";
        if (product.variant && product.variant.includes("x")) {
          const [min, max] = product.variant.split("x");
          minSize = min;
          maxSize = max;
        }

        setForm({
          product_id: product.id,
          vendor_id: product.vendor_id || "",
          article_name: product.article_name || "",
          description: product.description || "",
          price: product.price || "",
          selling_price: product.selling_price || "",
          brand_name: product.brand_name || "",
          category_name: product.category_name || "",
          gender: product.gender || "",
          color: product.color || "",
          material: product.material || "",
          upper_material: product.upper_material || "",
          packing_type: product.packing_type || "",
          commission_type: product.commission_type === "per_piece_rate" ? "per pairs rate" : (product.commission_type || "percentage"),
          commission: product.commission || "",
          pairs_per_ctn: product.pairs_per_ctn || "",
          stock_quantity: product.stock_quantity || "",
          min_size: minSize,
          max_size: maxSize,
          origin: product.origin || "Made in India",
          status: product.status || "active",
        });

        setVendorInfo({
          business_name: product.business_name || "",
          owner_name: product.owner_name || "",
          phone: product.phone || "",
          gst_number: product.gst_number || "",
          email: product.email || "",
        });

        setPreview(getImageUrl(product.image));

        // Map variants with proper size parsing
        const apiVariants = Array.isArray(product.variants) ? product.variants : [];
        if (apiVariants.length > 0) {
          const mapped = apiVariants.map((v, idx) => {
            let minSize = v.min_size || "";
            let maxSize = v.max_size || "";
            if (v.variant_size && v.variant_size.includes("x")) {
              const [min, max] = v.variant_size.split("x");
              minSize = min;
              maxSize = max;
            }
            return {
              id: idx + 1,
              api_id: v.id,
              variant_name: v.variant_name || "",
              min_size: minSize,
              max_size: maxSize,
              price: v.price || "",
              selling_price: v.selling_price || "",
              stock: v.stock || "",
              packing_type: v.packing_type || "",
              pairs_per_ctn: v.pairs_per_ctn || "",
              color: v.color || "",
              image: null,
              preview: getImageUrl(v.image),
            };
          });
          setVariants(mapped);
          setVariantCounter(mapped.length + 1);
        }

        setCurrentVariant(createVariant(apiVariants.length + 1));
        setShowVariantForm(false);
        fetchFilters(product.vendor_id);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token, fetchFilters, createVariant]);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const handleVariantChange = (field, value) => {
    setCurrentVariant(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [`variant_${currentVariant.id}_${field}`]: "" }));
  };

  const handleVariantImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCurrentVariant(prev => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleVariantAdd = () => {
    setShowVariantForm(true);
    setEditingVariantId(null);
    setCurrentVariant(createVariant(variantCounter));
  };

  const handleVariantSave = () => {
    const variantErrors = {};
    if (!currentVariant.min_size) variantErrors.min_size = "Min size required";
    if (!currentVariant.max_size) variantErrors.max_size = "Max size required";
    if (!currentVariant.price) variantErrors.price = "MRP required";
    if (!currentVariant.selling_price) variantErrors.selling_price = "Selling price required";
    if (!currentVariant.stock) variantErrors.stock = "Stock required";

    if (Object.keys(variantErrors).length > 0) {
      const nextErrors = { ...errors };
      Object.entries(variantErrors).forEach(([key, value]) => {
        nextErrors[`variant_${currentVariant.id}_${key}`] = value;
      });
      setErrors(nextErrors);
      return;
    }

    if (editingVariantId) {
      setVariants(prev => prev.map(v => v.id === editingVariantId ? { ...currentVariant } : v));
      setEditingVariantId(null);
    } else {
      setVariants(prev => [...prev, { ...currentVariant }]);
      setVariantCounter(prev => prev + 1);
    }

    setCurrentVariant(createVariant(variantCounter + 1));
    setShowVariantForm(false);
  };

  const handleEditVariant = (variant) => {
    setCurrentVariant({ ...variant });
    setEditingVariantId(variant.id);
    setShowVariantForm(true);
  };

  const handleVariantRemove = (id) => {
    setVariants(prev => prev.filter(v => v.id !== id));
    if (editingVariantId === id) {
      setEditingVariantId(null);
      setShowVariantForm(false);
    }
  };

  const handleCancelVariant = () => {
    setShowVariantForm(false);
    setEditingVariantId(null);
    setCurrentVariant(createVariant(variantCounter));
  };

  const getVariantError = (field) => {
    return errors[`variant_${currentVariant.id}_${field}`];
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = {
      article_name: "Article name",
      price: "MRP",
      selling_price: "Selling price",
      brand_name: "Brand",
      category_name: "Category",
      gender: "Gender",
      color: "Color",
      material: "Material",
      upper_material: "Upper material",
      packing_type: "Packing type",
      commission_type: "Commission type",
      commission: "Commission",
      pairs_per_ctn: "Pairs per carton",
      stock_quantity: "Stock quantity",
      min_size: "Min size",
      max_size: "Max size",
    };

    Object.entries(requiredFields).forEach(([key, label]) => {
      if (!form[key]) nextErrors[key] = `${label} is required`;
    });

    if (form.selling_price && form.price && Number(form.selling_price) > Number(form.price)) {
      nextErrors.selling_price = "Selling price cannot exceed MRP";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const formData = new FormData();
      formData.append("product_id", form.product_id || productId);

      Object.entries(form).forEach(([key, value]) => {
        if (key === "product_id") return;
        if (value === undefined || value === null || value === "") return;
        if (key === "commission_type" && value === "per pairs rate") {
          formData.append(key, "per_piece_rate");
          return;
        }
        formData.append(key, value);
      });

      // If variants exist, use first variant's details for main product
      if (variants.length > 0) {
        const first = variants[0];
        formData.append("variant", `${first.min_size || ""}x${first.max_size || ""}`);
        formData.append("color", first.color || form.color || "");
        formData.append("stock_quantity", first.stock || form.stock_quantity || "");
        formData.append("price", first.price || form.price || "");
        formData.append("selling_price", first.selling_price || form.selling_price || "");
      }

      variants.forEach((v, index) => {
        if (v.api_id) formData.append(`multi_variants[${index}][id]`, v.api_id);
        formData.append(`multi_variants[${index}][variant_name]`, v.variant_name || "");
        formData.append(`multi_variants[${index}][color]`, v.color || "");
        formData.append(`multi_variants[${index}][variant_size]`, `${v.min_size || ""}x${v.max_size || ""}`);
        formData.append(`multi_variants[${index}][min_size]`, v.min_size || "");
        formData.append(`multi_variants[${index}][max_size]`, v.max_size || "");
        formData.append(`multi_variants[${index}][price]`, v.price || "");
        formData.append(`multi_variants[${index}][selling_price]`, v.selling_price || "");
        formData.append(`multi_variants[${index}][stock]`, v.stock || "");
        formData.append(`multi_variants[${index}][packing_type]`, v.packing_type || form.packing_type || "");
        formData.append(`multi_variants[${index}][pairs_per_ctn]`, v.pairs_per_ctn || form.pairs_per_ctn || "");
        if (v.image instanceof File) {
          formData.append(`multi_variants[${index}][image]`, v.image);
        }
      });

      if (image) formData.append("image", image);

      const res = await fetch(`${API_BASE}/product/admin_update_product_details.php`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update product");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.message || "Error updating product");
    } finally {
      setSubmitting(false);
    }
  };

  const attributeFields = useMemo(() => [
    { key: "brand_name", label: "Brand", options: filterOptions.brands },
    { key: "category_name", label: "Category", options: filterOptions.categories },
    { key: "gender", label: "Gender", options: filterOptions.gender },
    { key: "color", label: "Color", options: filterOptions.colors },
    { key: "material", label: "Material", options: filterOptions.materials },
    { key: "upper_material", label: "Upper Material", options: filterOptions.upper_materials },
    { key: "packing_type", label: "Packing Type", options: filterOptions.packingTypes },
  ], [filterOptions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-2">
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg text-sm">
          <CheckCircle size={16} />
          Product updated successfully!
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="text-red-500" />
          {errorMessage}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header - More Compact */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-gray-50/80">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-teal-600" />
            <h2 className="text-sm font-semibold">Edit Product</h2>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save size={13} />
            {submitting ? "Updating..." : "Update"}
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Vendor & Product ID - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-2 bg-gray-50 rounded-lg border text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 mb-0.5">
                  <Store size={12} />
                  Vendor
                </div>
                <p className="font-medium text-gray-900 text-sm">{vendorInfo.business_name || "—"}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5"><User size={9} />{vendorInfo.owner_name || "N/A"}</span>
                  <span className="inline-flex items-center gap-0.5"><Phone size={9} />{vendorInfo.phone || "N/A"}</span>
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg border text-xs">
                <div className="flex items-center gap-1.5 text-gray-500 mb-0.5">
                  <Building2 size={12} />
                  Product ID
                </div>
                <p className="font-medium text-gray-900 text-sm">#{form.product_id || productId}</p>
              </div>
            </div>

            <ImageUpload
              label="Product Image"
              error={errors.image}
              preview={preview}
              onImageChange={handleImageChange}
              id="edit-image-input"
              compact={false}
            />

            {/* Main Fields - Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField
                label="Article Name"
                required
                value={form.article_name}
                onChange={(e) => handleFormChange("article_name", e.target.value)}
                error={errors.article_name}
              />
              <InputField
                label="Description"
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField
                label="Min Size"
                required
                type="number"
                value={form.min_size}
                onChange={(e) => handleFormChange("min_size", e.target.value)}
                error={errors.min_size}
              />
              <InputField
                label="Max Size"
                required
                type="number"
                value={form.max_size}
                onChange={(e) => handleFormChange("max_size", e.target.value)}
                error={errors.max_size}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <InputField
                label="MRP (₹)"
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                error={errors.price}
              />
              <InputField
                label="Selling Price (₹)"
                required
                type="number"
                step="0.01"
                value={form.selling_price}
                onChange={(e) => handleFormChange("selling_price", e.target.value)}
                error={errors.selling_price}
              />
              <InputField
                label="Stock"
                required
                type="number"
                value={form.stock_quantity}
                onChange={(e) => handleFormChange("stock_quantity", e.target.value)}
                error={errors.stock_quantity}
              />
              <InputField
                label="Pairs/Ctn"
                required
                type="number"
                value={form.pairs_per_ctn}
                onChange={(e) => handleFormChange("pairs_per_ctn", e.target.value)}
                error={errors.pairs_per_ctn}
              />
            </div>

            {/* Attributes - Compact 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {attributeFields.map(({ key, label, options }) => (
                <SelectField
                  key={key}
                  label={label}
                  required
                  value={form[key]}
                  onChange={(e) => handleFormChange(key, e.target.value)}
                  error={errors[key]}
                  options={options}
                />
              ))}
            </div>

            {/* Commission */}
            <div className="grid grid-cols-2 gap-2">
              <SelectField
                label="Commission Type"
                required
                value={form.commission_type}
                onChange={(e) => handleFormChange("commission_type", e.target.value)}
                error={errors.commission_type}
                options={["percentage", "per pairs rate"]}
              />
              <InputField
                label="Commission Value"
                required
                type="number"
                step="0.01"
                value={form.commission}
                onChange={(e) => handleFormChange("commission", e.target.value)}
                error={errors.commission}
                hint={form.commission_type === "percentage" ? "%" : "₹"}
              />
            </div>

            {/* Variants Section */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Variants ({variants.length})
                </h3>
                <button
                  type="button"
                  onClick={handleVariantAdd}
                  className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg transition"
                >
                  <Plus size={13} /> Add
                </button>
              </div>

              {/* Variants List */}
              {variants.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {variants.map((variant, index) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      index={index}
                      onRemove={handleVariantRemove}
                      onEdit={handleEditVariant}
                    />
                  ))}
                </div>
              )}

              {/* Variant Form - Compact */}
              {showVariantForm && (
                <div className="border rounded-lg p-3 bg-gray-50 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-700">
                      {editingVariantId ? "Edit Variant" : "New Variant"}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <ImageUpload
                      label="Variant Image"
                      preview={currentVariant.preview}
                      onImageChange={handleVariantImageChange}
                      id={`variant-image-${currentVariant.id}`}
                      compact={true}
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <InputField
                        label="Min Size"
                        required
                        type="number"
                        value={currentVariant.min_size}
                        onChange={(e) => handleVariantChange("min_size", e.target.value)}
                        error={getVariantError("min_size")}
                      />
                      <InputField
                        label="Max Size"
                        required
                        type="number"
                        value={currentVariant.max_size}
                        onChange={(e) => handleVariantChange("max_size", e.target.value)}
                        error={getVariantError("max_size")}
                      />
                      <SelectField
                        label="Color"
                        value={currentVariant.color}
                        onChange={(e) => handleVariantChange("color", e.target.value)}
                        options={filterOptions.colors}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <InputField
                        label="MRP (₹)"
                        required
                        type="number"
                        step="0.01"
                        value={currentVariant.price}
                        onChange={(e) => handleVariantChange("price", e.target.value)}
                        error={getVariantError("price")}
                      />
                      <InputField
                        label="Selling (₹)"
                        required
                        type="number"
                        step="0.01"
                        value={currentVariant.selling_price}
                        onChange={(e) => handleVariantChange("selling_price", e.target.value)}
                        error={getVariantError("selling_price")}
                      />
                      <InputField
                        label="Stock"
                        required
                        type="number"
                        value={currentVariant.stock}
                        onChange={(e) => handleVariantChange("stock", e.target.value)}
                        error={getVariantError("stock")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <SelectField
                        label="Packing Type"
                        value={currentVariant.packing_type}
                        onChange={(e) => handleVariantChange("packing_type", e.target.value)}
                        options={filterOptions.packingTypes}
                      />
                      <InputField
                        label="Pairs/Ctn"
                        type="number"
                        value={currentVariant.pairs_per_ctn}
                        onChange={(e) => handleVariantChange("pairs_per_ctn", e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleVariantSave}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg transition"
                      >
                        {editingVariantId ? "Update" : "Add"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelVariant}
                        className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <SelectField
              label="Status"
              value={form.status}
              onChange={(e) => handleFormChange("status", e.target.value)}
              options={["active", "inactive", "reject", "approve_request"]}
            />
          </form>
        </div>
      </div>
    </div>
  );
}