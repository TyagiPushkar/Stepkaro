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
} from "lucide-react";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

export default function AdminAddProductModal({ isOpen, onClose }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
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
    origin: "Made in India",
    status: "inactive",
  });

  const [variants, setVariants] = useState([{ min_size: "", max_size: "" }]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        "";
      setToken(t);
    }
  }, []);

  // Memoized fetchFilters
  const fetchFilters = useCallback(
    async (productId) => {
      if (!token) return;
      try {
        const res = await fetch(
          `${API_BASE}/product/get_product_filters_new.php?vendor_id=${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
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

  // Memoized fetchVendors
  const fetchVendors = useCallback(async () => {
    if (!isOpen || !token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/get_all_vendor.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVendors(data.data);
      }
    } catch (error) {
      console.log("Vendor fetch error:", error);
    }
  }, [isOpen, token]);

  // Fetch filters when token changes
  // useEffect(() => {
  //   fetchFilters();
  // }, [fetchFilters]);

  // Fetch vendors when modal opens
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
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
        origin: "Made in India",
        status: "inactive",
      });
      setVariants([{ min_size: "", max_size: "" }]);
      setImage(null);
      setPreview("");
      setErrors({});
      setSubmitting(false);
      setVendorSearch("");
      setIsVendorOpen(false);
      setSelectedVendor(null);
    }
  }, [isOpen]);

  const filteredVendors = useMemo(() => {
    if (!vendorSearch) return vendors;
    return vendors.filter(
      (v) =>
        v.business_name?.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        v.owner_name?.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        v.phone?.includes(vendorSearch),
    );
  }, [vendors, vendorSearch]);

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setForm({ ...form, vendor_id: vendor.id });
    setIsVendorOpen(false);
    setVendorSearch("");
    setErrors({ ...errors, vendor_id: "" });
    // Fetch filters when vendor is selected
    fetchFilters(vendor.id);
  };

  const handleVariantAdd = () => {
    setVariants([...variants, { min_size: "", max_size: "" }]);
  };

  const handleVariantRemove = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.vendor_id) newErrors.vendor_id = "Vendor is required";
    if (!form.article_name.trim())
      newErrors.article_name = "Article name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.price) newErrors.price = "MRP is required";
    if (!form.selling_price)
      newErrors.selling_price = "Selling price is required";
    if (
      form.selling_price &&
      form.price &&
      Number(form.selling_price) > Number(form.price)
    ) {
      newErrors.selling_price = "Selling price cannot exceed MRP";
    }
    if (!form.brand_name) newErrors.brand_name = "Brand is required";
    if (!form.category_name) newErrors.category_name = "Category is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.color) newErrors.color = "Color is required";
    if (!form.material) newErrors.material = "Material is required";
    if (!form.upper_material)
      newErrors.upper_material = "Upper material is required";
    if (!form.packing_type) newErrors.packing_type = "Packing type is required";
    if (!form.commission_type)
      newErrors.commission_type = "Commission type is required";
    if (!form.commission) newErrors.commission = "Commission is required";
    if (!form.pairs_per_ctn)
      newErrors.pairs_per_ctn = "Pairs per carton is required";
    if (!form.stock_quantity)
      newErrors.stock_quantity = "Stock quantity is required";
    if (!image) newErrors.image = "Product image is required";

    variants.forEach((v, i) => {
      if (!v.min_size) newErrors[`variant_${i}_min`] = "Min size required";
      if (!v.max_size) newErrors[`variant_${i}_max`] = "Max size required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("vendor_id", form.vendor_id);
      formData.append("article_name", form.article_name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("selling_price", form.selling_price);
      formData.append("brand_name", form.brand_name);
      formData.append("category_name", form.category_name);
      formData.append("gender", form.gender);
      formData.append("color", form.color);
      formData.append("material", form.material);
      formData.append("upper_material", form.upper_material);
      formData.append("packing_type", form.packing_type);
      formData.append("pairs_per_ctn", form.pairs_per_ctn);
      formData.append("stock_quantity", form.stock_quantity);
      formData.append("origin", form.origin);
      formData.append("status", form.status);
      formData.append("variants", JSON.stringify(variants));
      //setcommission value.....
      formData.append("commission_type", form.commission_type);
      formData.append("commission", form.commission);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
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
            {/* Vendor */}
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
                      {selectedVendor ? (
                        <span>{selectedVendor.business_name}</span>
                      ) : form.vendor_id ? (
                        vendors.find((v) => v.id === form.vendor_id)
                          ?.business_name || "Select vendor"
                      ) : (
                        "Select vendor..."
                      )}
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
                            <Store size={14} />
                            {v.business_name}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <User size={11} />
                              {v.owner_name || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={11} />
                              {v.phone || "N/A"}
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

              {/* Selected Vendor Details */}
              {selectedVendor && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Business:</span>
                      <span className="ml-1 font-medium text-gray-700">
                        {selectedVendor.business_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Owner:</span>
                      <span className="ml-1 font-medium text-gray-700">
                        {selectedVendor.owner_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-1 font-medium text-gray-700">
                        {selectedVendor.phone || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-1 font-medium text-gray-700">
                        {selectedVendor.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              >
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
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
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label
                    htmlFor="image-input"
                    className="px-4 py-1.5 border rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition"
                  >
                    Choose Image
                  </label>
                  {image && (
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">
                      {image.name}
                    </p>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">{errors.image}</p>
              )}
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Article Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.article_name}
                  onChange={(e) =>
                    setForm({ ...form, article_name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    errors.article_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Product name"
                />
                {errors.article_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.article_name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  MRP (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.selling_price}
                  onChange={(e) =>
                    setForm({ ...form, selling_price: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    errors.selling_price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.selling_price && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.selling_price}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) =>
                    setForm({ ...form, stock_quantity: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    errors.stock_quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Units"
                />
                {errors.stock_quantity && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.stock_quantity}
                  </p>
                )}
              </div>
            </div>

            {/* Selects Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  key: "brand_name",
                  label: "Brand",
                  options: filterOptions.brands,
                },
                {
                  key: "category_name",
                  label: "Category",
                  options: filterOptions.categories,
                },
                {
                  key: "gender",
                  label: "Gender",
                  options: filterOptions.gender,
                },
                { key: "color", label: "Color", options: filterOptions.colors },
                {
                  key: "material",
                  label: "Material",
                  options: filterOptions.materials,
                },
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
              ].map(({ key, label, options }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors[key] && (
                    <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
            {/* commison set */}
            {/* Grid Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Commission Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.commission_type}
                  onChange={(e) =>
                    setForm({ ...form, commission_type: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    errors.commission_type
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Commission Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                {errors.commission_type && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.commission_type}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Commission Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.commission}
                  onChange={(e) =>
                    setForm({ ...form, commission: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    errors.commission ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter commission value"
                />
                {errors.commission && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.commission}
                  </p>
                )}
              </div>
            </div>

            {/* Pairs per carton */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Pairs per Carton <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.pairs_per_ctn}
                onChange={(e) =>
                  setForm({ ...form, pairs_per_ctn: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                  errors.pairs_per_ctn ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter count"
              />
              {errors.pairs_per_ctn && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pairs_per_ctn}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="2"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Product description..."
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">
                  Size Variants <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleVariantAdd}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white text-xs rounded-lg transition"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gray-50 border rounded-lg p-2"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="number"
                          placeholder="Min size"
                          value={v.min_size}
                          onChange={(e) =>
                            handleVariantChange(i, "min_size", e.target.value)
                          }
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                            errors[`variant_${i}_min`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[`variant_${i}_min`] && (
                          <p className="text-xs text-red-500">
                            {errors[`variant_${i}_min`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Max size"
                          value={v.max_size}
                          onChange={(e) =>
                            handleVariantChange(i, "max_size", e.target.value)
                          }
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                            errors[`variant_${i}_max`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[`variant_${i}_max`] && (
                          <p className="text-xs text-red-500">
                            {errors[`variant_${i}_max`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVariantRemove(i)}
                      disabled={variants.length === 1}
                      className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
            </div>

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
