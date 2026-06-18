"use client";
import { X, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ProductFormModal({
  isOpen,
  onClose,
  isEditing,
  newProduct,
  setNewProduct,
  filterOptions,
  onSubmit,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  // console.log("filterOptions in ProductFormModal:", filterOptions);

  // Initialize with one default variant when modal opens and no variants exist
  useEffect(() => {
    if (isOpen && !isEditing) {
      // Only add default variant if no variants exist and not editing
      if (!newProduct.variants || newProduct.variants.length === 0) {
        setNewProduct((prev) => ({
          ...prev,
          variants: [{ min_size: "", max_size: "" }],
        }));
      }
    }
  }, [isOpen, isEditing]);

  useEffect(() => {
    if (isOpen) {
      setShowValidationErrors(false);
      if (newProduct.image && typeof newProduct.image === "string") {
        setPreviewUrl(newProduct.image);
      } else if (newProduct.image instanceof File) {
        setPreviewUrl(URL.createObjectURL(newProduct.image));
      } else {
        setPreviewUrl("");
      }
    }
  }, [isOpen, newProduct.image]);

  if (!isOpen) return null;

  const isPriceInvalid =
    newProduct.selling_price &&
    newProduct.price &&
    Number(newProduct.selling_price) > Number(newProduct.price);

  const isFieldEmpty = (value) => {
    if (value === undefined || value === null) return true;
    const stringValue = value.toString().trim();
    return stringValue === "";
  };

  const getFieldClass = (fieldName) => {
    const baseClass =
      "w-full px-4 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all";
    const isInvalid =
      showValidationErrors && isFieldEmpty(newProduct[fieldName]);

    return `${baseClass} ${
      isInvalid
        ? "border-red-500 focus:ring-red-500/20 shadow-sm shadow-red-500/10"
        : "border-slate-200 focus:ring-teal-500"
    }`;
  };

  // Add variant
  const addVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), { min_size: "", max_size: "" }],
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Update variant
  const updateVariant = (index, field, value) => {
    setNewProduct((prev) => {
      const updatedVariants = [...(prev.variants || [])];
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleValidateAndSubmit = (e) => {
    e.preventDefault();
    setShowValidationErrors(true);

    const requiredFields = [
      "article_name",
      "selling_price",
      "price",
      "brand_name",
      "category_name",
      "stock_quantity",
      "gender",
      "color",
      "material",
      "upper_material",
      "packing_type",
      "pairs_per_ctn",
      "origin",
      "description",
    ];

    const hasEmptyFields = requiredFields.some((field) =>
      isFieldEmpty(newProduct[field]),
    );

    const hasNoImage =
      !isEditing &&
      (!newProduct.image ||
        (typeof newProduct.image === "string" &&
          newProduct.image.trim() === ""));

    // Check variants
    const hasEmptyVariants =
      newProduct.variants &&
      newProduct.variants.length > 0 &&
      newProduct.variants.some(
        (v) => isFieldEmpty(v.min_size) || isFieldEmpty(v.max_size),
      );

    if (hasEmptyFields || hasNoImage || hasEmptyVariants) {
      alert(
        "Validation Error: Please fill all the required fields, add a product photo, and complete all variants!",
      );
      return;
    }

    if (isPriceInvalid) {
      alert("Validation Error: Selling Price cannot be greater than the MRP!");
      return;
    }

    onSubmit(e);
  };

  // Get validation class for variant fields
  const getVariantFieldClass = (variant, field) => {
    const baseClass =
      "w-full px-3 py-2 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all";
    const isInvalid = showValidationErrors && isFieldEmpty(variant[field]);

    return `${baseClass} ${
      isInvalid
        ? "border-red-500 focus:ring-red-500/20"
        : "border-slate-200 focus:ring-teal-500"
    }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 tracking-wide">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* IMAGE SECTION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-slate-600 mb-3 font-medium">
              Product Image{" "}
              {!isEditing && <span className="text-red-500">*</span>}
              {isEditing && (
                <span className="text-slate-500 ml-1">(View only)</span>
              )}
            </p>

            <div className="flex items-center gap-4">
              {/* Preview Box */}
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x100";
                    }}
                  />
                ) : (
                  <ImageIcon className="text-slate-400" size={32} />
                )}
              </div>

              {/* Upload - Only show when NOT editing */}
              {!isEditing && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500 font-medium">
                    Upload new image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewProduct({ ...newProduct, image: file });
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-xl transition">
                      Choose File
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 truncate max-w-[180px]">
                    {newProduct.image instanceof File
                      ? newProduct.image.name
                      : "No file selected"}
                  </span>
                </div>
              )}

              {/* Show message when editing */}
              {isEditing && (
                <div className="text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                  <span>Image cannot be changed in edit mode</span>
                </div>
              )}
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className={getFieldClass("article_name")}
              placeholder="Article Name *"
              value={newProduct.article_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, article_name: e.target.value })
              }
            />

            <input
              className={getFieldClass("price")}
              placeholder="MRP *"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <div className="flex flex-col gap-1">
              <input
                className={`${getFieldClass("selling_price")} ${
                  isPriceInvalid ? "border-red-500" : ""
                }`}
                placeholder="Selling Price *"
                type="number"
                value={newProduct.selling_price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    selling_price: e.target.value,
                  })
                }
              />
              {isPriceInvalid && (
                <span className="text-red-500 text-xs pl-1 font-medium">
                  Selling price should be less than MRP *
                </span>
              )}
            </div>

            <input
              className={getFieldClass("stock_quantity")}
              placeholder="Stock Quantity *"
              type="number"
              value={newProduct.stock_quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock_quantity: e.target.value })
              }
            />

            <select
              className={getFieldClass("brand_name")}
              value={newProduct.brand_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand_name: e.target.value })
              }
            >
              <option value="">Select Brand *</option>
              {filterOptions.brands.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              className={getFieldClass("category_name")}
              value={newProduct.category_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category_name: e.target.value })
              }
            >
              <option value="">Select Category *</option>
              {filterOptions.categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className={getFieldClass("gender")}
              value={newProduct.gender}
              onChange={(e) =>
                setNewProduct({ ...newProduct, gender: e.target.value })
              }
            >
              <option value="">Gender *</option>
              {filterOptions.gender.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              className={getFieldClass("color")}
              value={newProduct.color}
              onChange={(e) =>
                setNewProduct({ ...newProduct, color: e.target.value })
              }
            >
              <option value="">Color *</option>
              {filterOptions.colors.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className={getFieldClass("material")}
              value={newProduct.material}
              onChange={(e) =>
                setNewProduct({ ...newProduct, material: e.target.value })
              }
            >
              <option value="">Material *</option>
              {filterOptions.materials.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              className={getFieldClass("upper_material")}
              value={newProduct.upper_material}
              onChange={(e) =>
                setNewProduct({ ...newProduct, upper_material: e.target.value })
              }
            >
              <option value="">Upper Material *</option>
              {filterOptions.upper_materials?.map((um, i) => (
                <option key={i} value={um}>
                  {um}
                </option>
              ))}
            </select>

            <select
              className={getFieldClass("packing_type")}
              value={newProduct.packing_type}
              onChange={(e) =>
                setNewProduct({ ...newProduct, packing_type: e.target.value })
              }
            >
              <option value="">Packing Type *</option>
              {filterOptions.packingTypes.map((pt, i) => (
                <option key={i} value={pt}>
                  {pt}
                </option>
              ))}
            </select>

            <input
              className={getFieldClass("pairs_per_ctn")}
              placeholder="Pairs Per Carton *"
              type="number"
              value={newProduct.pairs_per_ctn}
              onChange={(e) =>
                setNewProduct({ ...newProduct, pairs_per_ctn: e.target.value })
              }
            />

            <input
              className={getFieldClass("origin")}
              placeholder="Origin"
              value={newProduct.origin}
              onChange={(e) =>
                setNewProduct({ ...newProduct, origin: e.target.value })
              }
            />
          </div>

          {/* VARIANTS SECTION - Moved BEFORE Description */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Sizes <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-xl transition"
              >
                <Plus size={16} />
                Add size
              </button>
            </div>

            <div className="space-y-3">
              {(newProduct.variants || []).map((variant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      className={getVariantFieldClass(variant, "min_size")}
                      placeholder="Min Size *"
                      value={variant.min_size}
                      onChange={(e) =>
                        updateVariant(index, "min_size", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className={getVariantFieldClass(variant, "max_size")}
                      placeholder="Max Size *"
                      value={variant.max_size}
                      onChange={(e) =>
                        updateVariant(index, "max_size", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    disabled={(newProduct.variants || []).length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {(!newProduct.variants || newProduct.variants.length === 0) && (
                <div className="text-center py-6 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                  No variants added. Click "Add Variant" to add size variations.
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION - Now after Variants */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Description
            </label>
            <textarea
              className={`${getFieldClass("description")} w-full`}
              rows={3}
              placeholder="Enter product description..."
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>

          {/* FOOTER BUTTON */}
          <button
            onClick={handleValidateAndSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-white font-semibold transition"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
