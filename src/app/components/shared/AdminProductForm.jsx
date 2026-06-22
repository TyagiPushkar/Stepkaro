"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  X,
  Package,
  Image as ImageIcon,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  Building2,
  User,
  Phone,
  Store,
  ChevronUp,
  Edit2,
} from "lucide-react";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

// Reusable Form Field Components
const InputField = ({ label, required, error, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-700 block mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, required, error, options, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-700 block mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const ImageUpload = ({
  label,
  required,
  error,
  preview,
  onImageChange,
  imageName,
  id,
}) => (
  <div>
    <label className="text-xs font-medium text-gray-700 block mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg ${error ? "border-red-500" : "border-gray-300"}`}
    >
      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={24} className="text-gray-400" />
        )}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className="px-4 py-1.5 border rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition inline-block"
        >
          Choose Image
        </label>
        {imageName && (
          <p className="text-xs text-gray-400 mt-1 truncate max-w-40">
            {imageName}
          </p>
        )}
      </div>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// Variant Card Component
const VariantCard = ({ variant, index, onRemove, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
            {variant.preview ? (
              <img
                src={variant.preview}
                alt={variant.variant_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={16} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 truncate">
                {variant.variant_name || `Variant ${index + 1}`}
              </span>
              {variant.min_size && variant.max_size && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Size: {variant.min_size}-{variant.max_size}
                </span>
              )}
              {variant.price && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  ₹{variant.price}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              {variant.stock_quantity && (
                <span>Stock: {variant.stock_quantity}</span>
              )}
              {variant.color && <span>Color: {variant.color}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(variant);
            }}
            className="p-1.5 text-gray-400 hover:text-teal-600 transition"
            title="Edit variant"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(variant.id);
            }}
            className="p-1.5 text-red-400 hover:text-red-600 transition"
          >
            <Trash2 size={14} />
          </button>
          {isExpanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <span className="ml-1 font-medium">
                {variant.variant_name || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Min Size:</span>
              <span className="ml-1 font-medium">
                {variant.min_size || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Max Size:</span>
              <span className="ml-1 font-medium">
                {variant.max_size || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">MRP:</span>
              <span className="ml-1 font-medium">₹{variant.price || "0"}</span>
            </div>
            <div>
              <span className="text-gray-500">Selling:</span>
              <span className="ml-1 font-medium">
                ₹{variant.selling_price || "0"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Stock:</span>
              <span className="ml-1 font-medium">
                {variant.stock_quantity || "0"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Packing:</span>
              <span className="ml-1 font-medium">
                {variant.packing_type || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Pairs/Ctn:</span>
              <span className="ml-1 font-medium">
                {variant.pairs_per_ctn || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Color:</span>
              <span className="ml-1 font-medium">{variant.color || "-"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminAddProductModal({ isOpen, onClose }) {
  // State
  const [token] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        ""
      );
    }
    return "";
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
  const [vendors, setVendors] = useState([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);

  // Main Product
  const [form, setForm] = useState({
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
    commission_type: "",
    commission: "",
    pairs_per_ctn: "",
    stock_quantity: "",
    min_size: "",
    max_size: "",
    origin: "Made in India",
    status: "active",
  });

  // Variants
  const [showVariants, setShowVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantCounter, setVariantCounter] = useState(1);

  // Current Variant Form
  const [currentVariant, setCurrentVariant] = useState({
    id: null,
    variant_name: "",
    min_size: "",
    max_size: "",
    price: "",
    selling_price: "",
    stock_quantity: "",
    packing_type: "",
    pairs_per_ctn: "",
    color: "",
    image: null,
    preview: "",
  });

  // Main Product Image
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Create variant with all fields
  const createVariant = (id) => ({
    id,
    variant_name: "",
    min_size: "",
    max_size: "",
    price: "",
    selling_price: "",
    stock_quantity: "",
    packing_type: "",
    pairs_per_ctn: "",
    color: "",
    image: null,
    preview: "",
  });

  // Fetch Filters
  const fetchFilters = useCallback(
    async (vendorId) => {
      if (!token) return;
      try {
        const res = await fetch(
          `${API_BASE}/product/get_product_filters_new.php?vendor_id=${vendorId}`,
          { headers: { Authorization: `Bearer ${token}` } },
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
        console.log("Filter fetch error:", error);
      }
    },
    [token],
  );

  // Fetch Vendors when modal opens
  useEffect(() => {
    const fetchVendors = async () => {
      if (!isOpen || !token) return;
      try {
        const res = await fetch(`${API_BASE}/admin/get_all_vendor.php`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) setVendors(data.data);
      } catch (error) {
        console.log("Vendor fetch error:", error);
      }
    };
    fetchVendors();
  }, [isOpen, token]);

  const resetFormState = useCallback(() => {
    setForm({
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
      commission_type: "",
      commission: "",
      pairs_per_ctn: "",
      stock_quantity: "",
      min_size: "",
      max_size: "",
      origin: "Made in India",
      status: "active",
    });
    setVariants([]);
    setVariantCounter(1);
    setShowVariants(false);
    setImage(null);
    setPreview("");
    setErrors({});
    setSubmitting(false);
    setVendorSearch("");
    setIsVendorOpen(false);
    setSelectedVendor(null);
    setEditingVariantId(null);
    setCurrentVariant(createVariant(1));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = window.setTimeout(resetFormState, 0);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, resetFormState]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    if (!vendorSearch) return vendors;
    return vendors.filter(
      (v) =>
        v.business_name?.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        v.owner_name?.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        v.phone?.includes(vendorSearch),
    );
  }, [vendors, vendorSearch]);

  // Handlers
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setForm({ ...form, vendor_id: vendor.id });
    setIsVendorOpen(false);
    setVendorSearch("");
    setErrors({ ...errors, vendor_id: "" });
    fetchFilters(vendor.id);
  };

  const handleVariantAdd = () => {
    setShowVariants(true);
    setCurrentVariant(createVariant(variantCounter));
    setEditingVariantId(null);
    setVariantCounter((prev) => prev + 1);
    // Clear any variant errors
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith("variant_")) delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleVariantSave = () => {
    // Validate current variant
    const variantErrors = {};
    if (!currentVariant.variant_name)
      variantErrors.variant_name = "Variant name required";
    if (!currentVariant.min_size) variantErrors.min_size = "Min size required";
    if (!currentVariant.max_size) variantErrors.max_size = "Max size required";
    if (!currentVariant.price) variantErrors.price = "MRP required";
    if (!currentVariant.selling_price)
      variantErrors.selling_price = "Selling price required";
    if (!currentVariant.stock_quantity)
      variantErrors.stock_quantity = "Stock required";
    if (!currentVariant.image) variantErrors.image = "Variant image required";

    if (Object.keys(variantErrors).length > 0) {
      // Set errors with variant prefix
      const newErrors = { ...errors };
      Object.entries(variantErrors).forEach(([key, value]) => {
        newErrors[`variant_${currentVariant.id}_${key}`] = value;
      });
      setErrors(newErrors);
      return;
    }

    // Save variant
    if (editingVariantId) {
      // Update existing variant
      setVariants(
        variants.map((v) =>
          v.id === editingVariantId ? { ...currentVariant } : v,
        ),
      );
      setEditingVariantId(null);
    } else {
      // Add new variant
      setVariants([...variants, { ...currentVariant }]);
    }

    // Reset current variant form
    setCurrentVariant(createVariant(variantCounter));
    setVariantCounter((prev) => prev + 1);
  };

  const handleVariantRemove = (id) => {
    if (variants.length === 1) {
      setShowVariants(false);
      setVariants([]);
      return;
    }
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleEditVariant = (variant) => {
    setCurrentVariant({ ...variant });
    setEditingVariantId(variant.id);
    setShowVariants(true);
  };

  const handleVariantChange = (field, value) => {
    setCurrentVariant({ ...currentVariant, [field]: value });
    // Clear error for this field
    const newErrors = { ...errors };
    delete newErrors[`variant_${currentVariant.id}_${field}`];
    setErrors(newErrors);
  };

  const handleVariantImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentVariant({
        ...currentVariant,
        image: file,
        preview: URL.createObjectURL(file),
      });
      // Clear image error
      const newErrors = { ...errors };
      delete newErrors[`variant_${currentVariant.id}_image`];
      setErrors(newErrors);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    const requiredFields = {
      vendor_id: "Vendor",
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
      if (!form[key]) newErrors[key] = `${label} is required`;
    });

    if (
      form.selling_price &&
      form.price &&
      Number(form.selling_price) > Number(form.price)
    ) {
      newErrors.selling_price = "Selling price cannot exceed MRP";
    }

    if (!image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Check if there are variants but none saved
    if (showVariants && variants.length === 0) {
      alert("Please add at least one variant or remove the variants section.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      // Main product data
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("image", image);

      // Variants data
      const variantsData = variants.map((v) => ({
        variant_name: v.variant_name,
        min_size: v.min_size,
        max_size: v.max_size,
        price: v.price,
        selling_price: v.selling_price,
        stock_quantity: v.stock_quantity,
        packing_type: v.packing_type || form.packing_type,
        pairs_per_ctn: v.pairs_per_ctn || form.pairs_per_ctn,
        color: v.color || form.color,
      }));
      formData.append("variants", JSON.stringify(variantsData));

      variants.forEach((v, index) => {
        if (v.image) formData.append(`variant_image_${index}`, v.image);
      });

      const res = await fetch(`${API_BASE}/product/admin_add_product.php`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Product added successfully!");
        window.dispatchEvent(new Event("productAddedSuccess"));
        onClose();
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      alert("Error adding product");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Reusable attribute fields config
  const attributeFields = [
    { key: "brand_name", label: "Brand", options: filterOptions.brands },
    {
      key: "category_name",
      label: "Category",
      options: filterOptions.categories,
    },
    { key: "gender", label: "Gender", options: filterOptions.gender },
    { key: "color", label: "Color", options: filterOptions.colors },
    { key: "material", label: "Material", options: filterOptions.materials },
    {
      key: "upper_material",
      label: "Upper Material",
      options: filterOptions.upper_materials,
    },
    {
      key: "packing_type",
      label: "Packing Type",
      options: filterOptions.packingTypes,
    },
  ];

  const getVariantError = (field) => {
    return errors[`variant_${currentVariant.id}_${field}`];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-teal-600" />
            <h2 className="text-sm font-semibold">Add New Product</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vendor Selection */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsVendorOpen(!isVendorOpen)}
                  className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between cursor-pointer bg-white text-sm ${
                    errors.vendor_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Building2 size={16} className="text-gray-400" />
                    <span
                      className={
                        form.vendor_id ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {selectedVendor?.business_name || "Select vendor..."}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition ${isVendorOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isVendorOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto p-2">
                    <div className="relative mb-2">
                      <Search
                        size={14}
                        className="absolute left-3 top-2.5 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search vendor..."
                        value={vendorSearch}
                        onChange={(e) => setVendorSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredVendors.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2">
                        No vendors found
                      </p>
                    ) : (
                      filteredVendors.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => handleVendorSelect(v)}
                          className={`px-3 py-2 rounded-lg cursor-pointer text-sm hover:bg-gray-50 transition ${
                            form.vendor_id === v.id
                              ? "bg-teal-50 text-teal-700"
                              : ""
                          }`}
                        >
                          <div className="font-medium flex items-center gap-2">
                            <Store size={14} /> {v.business_name}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <User size={11} /> {v.owner_name || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {v.phone || "N/A"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.vendor_id && (
                <p className="text-xs text-red-500 mt-1">{errors.vendor_id}</p>
              )}
            </div>

            {/* Main Product Image */}
            <ImageUpload
              label="Product Image"
              required
              error={errors.image}
              preview={preview}
              onImageChange={handleImageChange}
              imageName={image?.name}
              id="image-input"
            />

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Article Name"
                required
                value={form.article_name}
                onChange={(e) =>
                  setForm({ ...form, article_name: e.target.value })
                }
                error={errors.article_name}
                placeholder="Product name"
              />
              <InputField
                label="MRP (₹)"
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                error={errors.price}
                placeholder="0.00"
              />
              <InputField
                label="Selling Price (₹)"
                required
                type="number"
                value={form.selling_price}
                onChange={(e) =>
                  setForm({ ...form, selling_price: e.target.value })
                }
                error={errors.selling_price}
                placeholder="0.00"
              />
              <InputField
                label="Stock Quantity"
                required
                type="number"
                value={form.stock_quantity}
                onChange={(e) =>
                  setForm({ ...form, stock_quantity: e.target.value })
                }
                error={errors.stock_quantity}
                placeholder="Units"
              />
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3">
              {attributeFields.map(({ key, label, options }) => (
                <SelectField
                  key={key}
                  label={label}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  error={errors[key]}
                  options={options}
                />
              ))}
              <InputField
                label="Pairs per Carton"
                required
                type="number"
                value={form.pairs_per_ctn}
                onChange={(e) =>
                  setForm({ ...form, pairs_per_ctn: e.target.value })
                }
                error={errors.pairs_per_ctn}
                placeholder="Enter count"
              />
            </div>

            {/* Commission */}
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Commission Type"
                required
                value={form.commission_type}
                onChange={(e) =>
                  setForm({ ...form, commission_type: e.target.value })
                }
                error={errors.commission_type}
                options={["percentage", "fixed"]}
              />
              <InputField
                label="Commission Value"
                required
                type="number"
                value={form.commission}
                onChange={(e) =>
                  setForm({ ...form, commission: e.target.value })
                }
                error={errors.commission}
                placeholder="Enter commission value"
              />
            </div>

            {/* Size Range */}
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Min Size"
                required
                value={form.min_size}
                onChange={(e) => setForm({ ...form, min_size: e.target.value })}
                error={errors.min_size}
                placeholder="e.g., 6"
                type="number"
              />
              <InputField
                label="Max Size"
                required
                value={form.max_size}
                onChange={(e) => setForm({ ...form, max_size: e.target.value })}
                error={errors.max_size}
                placeholder="e.g., 12"
                type="number"
              />
            </div>

            {/* Variants Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Variants
                </h3>
                <button
                  type="button"
                  onClick={handleVariantAdd}
                  className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg transition"
                >
                  <Plus size={14} /> Add Variant
                </button>
              </div>

              {/* Show existing variants as cards */}
              {variants.length > 0 && (
                <div className="space-y-2 mb-4">
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

              {/* Variant Form - Always visible when showVariants is true */}
              {showVariants && (
                <div className="border rounded-lg p-4 bg-gray-50 mt-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      {editingVariantId ? "Edit Variant" : "Add New Variant"}
                    </h4>
                    {!editingVariantId && (
                      <button
                        type="button"
                        onClick={() => setShowVariants(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Variant Name and Size */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* <InputField
                        label="Variant Name"
                        required
                        value={currentVariant.variant_name}
                        onChange={(e) =>
                          handleVariantChange("variant_name", e.target.value)
                        }
                        error={getVariantError("variant_name")}
                        placeholder="e.g., Red-Small"
                      /> */}
                      <InputField
                        label="Min Size"
                        required
                        type="number"
                        value={currentVariant.min_size}
                        onChange={(e) =>
                          handleVariantChange("min_size", e.target.value)
                        }
                        error={getVariantError("min_size")}
                        placeholder="Min"
                      />
                      <InputField
                        label="Max Size"
                        required
                        type="number"
                        value={currentVariant.max_size}
                        onChange={(e) =>
                          handleVariantChange("max_size", e.target.value)
                        }
                        error={getVariantError("max_size")}
                        placeholder="Max"
                      />
                      <SelectField
                        label="Color"
                        value={currentVariant.color}
                        onChange={(e) =>
                          handleVariantChange("color", e.target.value)
                        }
                        options={filterOptions.colors}
                      />
                    </div>

                    {/* Variant Pricing and Stock */}
                    <div className="grid grid-cols-3 gap-3">
                      <SelectField
                        label="Category"
                        value={
                          currentVariant.category_name || form.category_name
                        }
                        onChange={(e) =>
                          handleVariantChange("category_name", e.target.value)
                        }
                        options={filterOptions.categories}
                      />
                      <InputField
                        label="MRP (₹)"
                        required
                        type="number"
                        value={currentVariant.price}
                        onChange={(e) =>
                          handleVariantChange("price", e.target.value)
                        }
                        error={getVariantError("price")}
                        placeholder="0.00"
                      />
                      <InputField
                        label="Selling Price (₹)"
                        required
                        type="number"
                        value={currentVariant.selling_price}
                        onChange={(e) =>
                          handleVariantChange("selling_price", e.target.value)
                        }
                        error={getVariantError("selling_price")}
                        placeholder="0.00"
                      />
                    </div>

                    {/* Variant Optional Fields */}
                    <div className="grid grid-cols-3 gap-3">
                      <InputField
                        label="Stock"
                        required
                        type="number"
                        value={currentVariant.stock_quantity}
                        onChange={(e) =>
                          handleVariantChange("stock_quantity", e.target.value)
                        }
                        error={getVariantError("stock")}
                        placeholder="Units"
                      />
                      <SelectField
                        label="Packing Type"
                        value={currentVariant.packing_type}
                        onChange={(e) =>
                          handleVariantChange("packing_type", e.target.value)
                        }
                        options={filterOptions.packingTypes}
                      />
                      <InputField
                        label="Pairs per Carton"
                        type="number"
                        value={currentVariant.pairs_per_ctn}
                        onChange={(e) =>
                          handleVariantChange("pairs_per_ctn", e.target.value)
                        }
                        placeholder={`Default: ${form.pairs_per_ctn || "N/A"}`}
                      />
                    </div>

                    {/* Variant Image */}
                    <ImageUpload
                      label="Variant Image"
                      required
                      error={getVariantError("image")}
                      preview={currentVariant.preview}
                      onImageChange={handleVariantImageChange}
                      imageName={currentVariant.image?.name}
                      id={`variant-image-${currentVariant.id}`}
                    />

                    {/* Save/Cancel Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleVariantSave}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition"
                      >
                        {editingVariantId ? "Update Variant" : "Add Variant"}
                      </button>
                      {editingVariantId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVariantId(null);
                            setCurrentVariant(createVariant(variantCounter));
                          }}
                          className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <SelectField
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={["active", "inactive"]}
            />

            {/* Buttons */}
            <div className="flex gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
