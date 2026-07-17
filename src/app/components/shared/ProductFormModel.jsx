// "use client";
// import {
//   X,
//   Image as ImageIcon,
//   Plus,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   Edit2,
//   AlertCircle,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";

// // Compact Input Field Component
// const InputField = ({
//   label,
//   required,
//   error,
//   hint,
//   className = "",
//   ...props
// }) => (
//   <div className={className}>
//     <label className="text-xs font-medium text-gray-700 block mb-0.5">
//       {label} {required && <span className="text-red-500">*</span>}
//       {hint && <span className="text-gray-400 text-[10px] ml-1">({hint})</span>}
//     </label>
//     <input
//       {...props}
//       className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//     />
//     {error && (
//       <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
//         <AlertCircle size={10} />
//         {error}
//       </p>
//     )}
//   </div>
// );

// // Compact Select Field Component
// const SelectField = ({
//   label,
//   required,
//   error,
//   options,
//   placeholder,
//   className = "",
//   ...props
// }) => (
//   <div className={className}>
//     <label className="text-xs font-medium text-gray-700 block mb-0.5">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       {...props}
//       className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//     >
//       <option value="">{placeholder || `Select ${label}`}</option>
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
//         <AlertCircle size={10} />
//         {error}
//       </p>
//     )}
//   </div>
// );

// // Compact Image Upload Component
// const ImageUpload = ({
//   label,
//   required,
//   error,
//   preview,
//   onImageChange,
//   id,
//   compact = false,
// }) => (
//   <div>
//     <label className="text-xs font-medium text-gray-700 block mb-0.5">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div
//       className={`flex items-center gap-2 p-2 border rounded-lg transition ${
//         error
//           ? "border-red-500 bg-red-50"
//           : "border-gray-300 hover:border-teal-400"
//       }`}
//     >
//       <div
//         className={`${compact ? "w-10 h-10" : "w-14 h-14"} rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0`}
//       >
//         {preview ? (
//           <img
//             src={preview}
//             alt="Preview"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <ImageIcon size={compact ? 16 : 20} className="text-gray-400" />
//         )}
//       </div>
//       <div className="flex-1">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onImageChange}
//           className="hidden"
//           id={id}
//         />
//         <label
//           htmlFor={id}
//           className={`${compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"} border rounded-lg cursor-pointer hover:bg-gray-50 transition inline-block`}
//         >
//           Choose
//         </label>
//       </div>
//     </div>
//     {error && (
//       <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-0.5">
//         <AlertCircle size={10} />
//         {error}
//       </p>
//     )}
//   </div>
// );

// // Compact Variant Card
// const VariantCard = ({ variant, index, onRemove, onEdit, filterOptions }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
//       <div
//         className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 transition"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-2 min-w-0 flex-1">
//           <div className="w-8 h-8 rounded-lg border flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
//             {variant.preview ? (
//               <img
//                 src={variant.preview}
//                 alt="Variant"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <ImageIcon size={12} className="text-gray-400" />
//             )}
//           </div>
//           <div className="min-w-0 flex-1">
//             <div className="flex items-center gap-1.5 flex-wrap">
//               <span className="text-xs font-medium text-gray-700 truncate">
//                 #{index + 1} {variant.variant_name || `Variant`}
//               </span>
//               <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
//                 {variant.min_size || "-"}x{variant.max_size || "-"}
//               </span>
//               {variant.color && (
//                 <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
//                   {variant.color}
//                 </span>
//               )}
//             </div>
//             <div className="text-[10px] text-gray-400">
//               Stock: {variant.stock || 0} | ₹{variant.selling_price || 0}
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit(variant);
//             }}
//             className="p-1 text-gray-400 hover:text-teal-600 transition"
//           >
//             <Edit2 size={12} />
//           </button>
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onRemove(variant.id);
//             }}
//             className="p-1 text-red-400 hover:text-red-600 transition"
//           >
//             <Trash2 size={12} />
//           </button>
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsExpanded(!isExpanded);
//             }}
//             className="p-1 text-gray-400"
//           >
//             {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//           </button>
//         </div>
//       </div>
//       {isExpanded && (
//         <div className="p-2 border-t bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-1 text-xs">
//           <div>
//             <span className="text-gray-500">MRP:</span>{" "}
//             <span className="font-medium">₹{variant.price || 0}</span>
//           </div>
//           <div>
//             <span className="text-gray-500">Selling:</span>{" "}
//             <span className="font-medium">₹{variant.selling_price || 0}</span>
//           </div>
//           <div>
//             <span className="text-gray-500">Packing:</span>{" "}
//             <span className="font-medium">{variant.packing_type || "-"}</span>
//           </div>
//           <div>
//             <span className="text-gray-500">Pairs/Ctn:</span>{" "}
//             <span className="font-medium">{variant.pairs_per_ctn || "-"}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function ProductFormModal({
//   isOpen,
//   onClose,
//   isEditing,
//   newProduct,
//   setNewProduct,
//   filterOptions,
//   onSubmit,
// }) {
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [showValidationErrors, setShowValidationErrors] = useState(false);
//   const [showVariantForm, setShowVariantForm] = useState(false);
//   const [editingVariantId, setEditingVariantId] = useState(null);
//   const [variantCounter, setVariantCounter] = useState(1);
//   const [currentVariant, setCurrentVariant] = useState({
//     id: 1,
//     variant_name: "",
//     min_size: "",
//     max_size: "",
//     price: "",
//     selling_price: "",
//     stock: "",
//     packing_type: "",
//     pairs_per_ctn: "",
//     color: "",
//     image: null,
//     preview: "",
//   });
//   const [errors, setErrors] = useState({});

//   // Initialize with one default variant when modal opens
//   useEffect(() => {
//     if (isOpen && !isEditing) {
//       if (!newProduct.variants || newProduct.variants.length === 0) {
//         setNewProduct((prev) => ({
//           ...prev,
//           variants: [{ min_size: "", max_size: "" }],
//         }));
//       }
//     }
//   }, [isOpen, isEditing]);

//   useEffect(() => {
//     if (isOpen) {
//       setShowValidationErrors(false);
//       if (newProduct.image && typeof newProduct.image === "string") {
//         setPreviewUrl(newProduct.image);
//       } else if (newProduct.image instanceof File) {
//         setPreviewUrl(URL.createObjectURL(newProduct.image));
//       } else {
//         setPreviewUrl("");
//       }
//     }
//   }, [isOpen, newProduct.image]);

//   if (!isOpen) return null;

//   const isPriceInvalid =
//     newProduct.selling_price &&
//     newProduct.price &&
//     Number(newProduct.selling_price) > Number(newProduct.price);

//   const isFieldEmpty = (value) => {
//     if (value === undefined || value === null) return true;
//     const stringValue = value.toString().trim();
//     return stringValue === "";
//   };

//   const getFieldClass = (fieldName) => {
//     const baseClass =
//       "w-full px-2.5 py-1.5 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm transition-all";
//     const isInvalid =
//       showValidationErrors && isFieldEmpty(newProduct[fieldName]);

//     return `${baseClass} ${
//       isInvalid
//         ? "border-red-500 focus:ring-red-500/20"
//         : "border-slate-200 focus:ring-teal-500"
//     }`;
//   };

//   const getVariantFieldClass = (field) => {
//     const baseClass =
//       "w-full px-2.5 py-1.5 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm transition-all";
//     const isInvalid =
//       showValidationErrors && isFieldEmpty(currentVariant[field]);

//     return `${baseClass} ${
//       isInvalid
//         ? "border-red-500 focus:ring-red-500/20"
//         : "border-slate-200 focus:ring-teal-500"
//     }`;
//   };

//   const createVariant = (id) => ({
//     id,
//     variant_name: "",
//     min_size: "",
//     max_size: "",
//     price: "",
//     selling_price: "",
//     stock: "",
//     packing_type: "",
//     pairs_per_ctn: "",
//     color: "",
//     image: null,
//     preview: "",
//   });

//   // Add variant
//   const handleAddVariant = () => {
//     setShowVariantForm(true);
//     setEditingVariantId(null);
//     setCurrentVariant(createVariant(variantCounter));
//   };

//   // Save variant
//   const handleVariantSave = () => {
//     const variantErrors = {};
//     if (!currentVariant.min_size) variantErrors.min_size = "Min size required";
//     if (!currentVariant.max_size) variantErrors.max_size = "Max size required";
//     if (!currentVariant.price) variantErrors.price = "MRP required";
//     if (!currentVariant.selling_price)
//       variantErrors.selling_price = "Selling price required";
//     if (!currentVariant.stock) variantErrors.stock = "Stock required";

//     if (Object.keys(variantErrors).length > 0) {
//       setErrors(variantErrors);
//       return;
//     }

//     if (editingVariantId) {
//       // Update existing variant
//       setNewProduct((prev) => ({
//         ...prev,
//         variants: prev.variants.map((v) =>
//           v.id === editingVariantId ? { ...currentVariant } : v,
//         ),
//       }));
//       setEditingVariantId(null);
//     } else {
//       // Add new variant
//       setNewProduct((prev) => ({
//         ...prev,
//         variants: [...(prev.variants || []), { ...currentVariant }],
//       }));
//       setVariantCounter((prev) => prev + 1);
//     }

//     setCurrentVariant(createVariant(variantCounter + 1));
//     setShowVariantForm(false);
//     setErrors({});
//   };

//   // Edit variant
//   const handleEditVariant = (variant) => {
//     setCurrentVariant({ ...variant });
//     setEditingVariantId(variant.id);
//     setShowVariantForm(true);
//   };

//   // Remove variant
//   const handleRemoveVariant = (id) => {
//     setNewProduct((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((v) => v.id !== id),
//     }));
//     if (editingVariantId === id) {
//       setEditingVariantId(null);
//       setShowVariantForm(false);
//     }
//   };

//   // Cancel variant form
//   const handleCancelVariant = () => {
//     setShowVariantForm(false);
//     setEditingVariantId(null);
//     setCurrentVariant(createVariant(variantCounter));
//     setErrors({});
//   };

//   // Handle variant image change
//   const handleVariantImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setCurrentVariant((prev) => ({
//       ...prev,
//       image: file,
//       preview: URL.createObjectURL(file),
//     }));
//   };

//   // Handle variant field change
//   const handleVariantChange = (field, value) => {
//     setCurrentVariant((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const handleValidateAndSubmit = (e) => {
//     e.preventDefault();
//     setShowValidationErrors(true);

//     const requiredFields = [
//       "article_name",
//       "selling_price",
//       "price",
//       "brand_name",
//       "category_name",
//       "stock_quantity",
//       "gender",
//       "color",
//       "material",
//       "upper_material",
//       "packing_type",
//       "pairs_per_ctn",
//       "origin",
//       "description",
//     ];

//     const hasEmptyFields = requiredFields.some((field) =>
//       isFieldEmpty(newProduct[field]),
//     );

//     const hasNoImage =
//       !isEditing &&
//       (!newProduct.image ||
//         (typeof newProduct.image === "string" &&
//           newProduct.image.trim() === ""));

//     // Check variants
//     const hasEmptyVariants =
//       newProduct.variants &&
//       newProduct.variants.length > 0 &&
//       newProduct.variants.some(
//         (v) => isFieldEmpty(v.min_size) || isFieldEmpty(v.max_size),
//       );

//     if (hasEmptyFields || hasNoImage || hasEmptyVariants) {
//       alert(
//         "Validation Error: Please fill all the required fields, add a product photo, and complete all variants!",
//       );
//       return;
//     }

//     if (isPriceInvalid) {
//       alert("Validation Error: Selling Price cannot be greater than the MRP!");
//       return;
//     }

//     onSubmit(e);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-slate-900 tracking-wide">
//             {isEditing ? "Edit Product" : "Add New Product"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* IMAGE SECTION */}
//           <ImageUpload
//             label="Product Image"
//             required={!isEditing}
//             error={
//               showValidationErrors && !isEditing && !previewUrl
//                 ? "Image is required"
//                 : ""
//             }
//             preview={previewUrl}
//             onImageChange={(e) => {
//               const file = e.target.files[0];
//               if (file) {
//                 setNewProduct({ ...newProduct, image: file });
//                 setPreviewUrl(URL.createObjectURL(file));
//               }
//             }}
//             id="product-image-input"
//             compact={false}
//           />

//           {/* MAIN FIELDS - Compact Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <InputField
//               label="Article Name"
//               required
//               value={newProduct.article_name}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, article_name: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.article_name)
//                   ? "Required"
//                   : ""
//               }
//             />
//             <InputField
//               label="Description"
//               value={newProduct.description}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, description: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.description)
//                   ? "Required"
//                   : ""
//               }
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <InputField
//               label="MRP (₹)"
//               required
//               type="number"
//               step="0.01"
//               value={newProduct.price}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, price: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.price)
//                   ? "Required"
//                   : ""
//               }
//             />
//             <div className="flex flex-col gap-1">
//               <InputField
//                 label="Selling Price (₹)"
//                 required
//                 type="number"
//                 step="0.01"
//                 value={newProduct.selling_price}
//                 onChange={(e) =>
//                   setNewProduct({
//                     ...newProduct,
//                     selling_price: e.target.value,
//                   })
//                 }
//                 error={
//                   showValidationErrors && isFieldEmpty(newProduct.selling_price)
//                     ? "Required"
//                     : isPriceInvalid
//                       ? "Cannot exceed MRP"
//                       : ""
//                 }
//                 className={isPriceInvalid ? "border-red-500" : ""}
//               />
//             </div>
//           </div>

//           {/* size of first variant */}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <InputField
//               label="Min Size"
//               required
//               type="number"
//               value={newProduct.min_size}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, min_size: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.min_size)
//                   ? "Required"
//                   : ""
//               }
//             />
//             <InputField
//               label="Max Size"
//               required
//               type="number"
//               value={newProduct.max_size}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, max_size: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.max_size)
//                   ? "Required"
//                   : ""
//               }
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <InputField
//               label="Stock Quantity"
//               required
//               type="number"
//               value={newProduct.stock_quantity}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, stock_quantity: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.stock_quantity)
//                   ? "Required"
//                   : ""
//               }
//             />
//             <InputField
//               label="Pairs per Carton"
//               required
//               type="number"
//               value={newProduct.pairs_per_ctn}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, pairs_per_ctn: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.pairs_per_ctn)
//                   ? "Required"
//                   : ""
//               }
//             />
//           </div>

//           {/* ATTRIBUTES - 4 columns */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             <SelectField
//               label="Brand"
//               required
//               value={newProduct.brand_name}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, brand_name: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.brand_name)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.brands || []}
//             />
//             <SelectField
//               label="Category"
//               required
//               value={newProduct.category_name}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, category_name: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.category_name)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.categories || []}
//             />
//             <SelectField
//               label="Gender"
//               required
//               value={newProduct.gender}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, gender: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.gender)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.gender || []}
//             />
//             <SelectField
//               label="Color"
//               required
//               value={newProduct.color}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, color: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.color)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.colors || []}
//             />
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//             <SelectField
//               label="Material"
//               required
//               value={newProduct.material}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, material: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.material)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.materials || []}
//             />
//             <SelectField
//               label="Upper Material"
//               required
//               value={newProduct.upper_material}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, upper_material: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.upper_material)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.upper_materials || []}
//             />
//             <SelectField
//               label="Packing Type"
//               required
//               value={newProduct.packing_type}
//               onChange={(e) =>
//                 setNewProduct({ ...newProduct, packing_type: e.target.value })
//               }
//               error={
//                 showValidationErrors && isFieldEmpty(newProduct.packing_type)
//                   ? "Required"
//                   : ""
//               }
//               options={filterOptions.packingTypes || []}
//             />
//           </div>

//           <InputField
//             label="Origin"
//             value={newProduct.origin}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, origin: e.target.value })
//             }
//             error={
//               showValidationErrors && isFieldEmpty(newProduct.origin)
//                 ? "Required"
//                 : ""
//             }
//           />

//           {/* VARIANTS SECTION */}
//           <div className="border-t border-slate-200 pt-4">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-sm font-semibold text-slate-900">
//                 Variants ({newProduct.variants?.length || 0})
//               </h3>
//               <button
//                 type="button"
//                 onClick={handleAddVariant}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg transition"
//               >
//                 <Plus size={14} />
//                 Add Variant
//               </button>
//             </div>

//             {/* Variants List */}
//             {newProduct.variants && newProduct.variants.length > 0 && (
//               <div className="space-y-1.5 mb-3">
//                 {newProduct.variants.map((variant, index) => (
//                   <VariantCard
//                     key={variant.id || index}
//                     variant={variant}
//                     index={index}
//                     onRemove={handleRemoveVariant}
//                     onEdit={handleEditVariant}
//                     filterOptions={filterOptions}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Variant Form */}
//             {showVariantForm && (
//               <div className="border rounded-lg p-3 bg-gray-50 mt-2">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-xs font-medium text-gray-700">
//                     {editingVariantId ? "Edit Variant" : "New Variant"}
//                   </h4>
//                 </div>
//                 <div className="space-y-2">
//                   <ImageUpload
//                     label="Variant Image"
//                     preview={currentVariant.preview}
//                     onImageChange={handleVariantImageChange}
//                     id={`variant-image-${currentVariant.id}`}
//                     compact={true}
//                   />

//                   <div className="grid grid-cols-3 gap-2">
//                     <InputField
//                       label="Min Size"
//                       required
//                       type="number"
//                       value={currentVariant.min_size}
//                       onChange={(e) =>
//                         handleVariantChange("min_size", e.target.value)
//                       }
//                       error={errors.min_size}
//                     />
//                     <InputField
//                       label="Max Size"
//                       required
//                       type="number"
//                       value={currentVariant.max_size}
//                       onChange={(e) =>
//                         handleVariantChange("max_size", e.target.value)
//                       }
//                       error={errors.max_size}
//                     />
//                     <SelectField
//                       label="Color"
//                       value={currentVariant.color}
//                       onChange={(e) =>
//                         handleVariantChange("color", e.target.value)
//                       }
//                       options={filterOptions.colors || []}
//                     />
//                   </div>

//                   <div className="grid grid-cols-3 gap-2">
//                     <InputField
//                       label="MRP (₹)"
//                       required
//                       type="number"
//                       step="0.01"
//                       value={currentVariant.price}
//                       onChange={(e) =>
//                         handleVariantChange("price", e.target.value)
//                       }
//                       error={errors.price}
//                     />
//                     <InputField
//                       label="Selling (₹)"
//                       required
//                       type="number"
//                       step="0.01"
//                       value={currentVariant.selling_price}
//                       onChange={(e) =>
//                         handleVariantChange("selling_price", e.target.value)
//                       }
//                       error={errors.selling_price}
//                     />
//                     <InputField
//                       label="Stock"
//                       required
//                       type="number"
//                       value={currentVariant.stock}
//                       onChange={(e) =>
//                         handleVariantChange("stock", e.target.value)
//                       }
//                       error={errors.stock}
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <SelectField
//                       label="Packing Type"
//                       value={currentVariant.packing_type}
//                       onChange={(e) =>
//                         handleVariantChange("packing_type", e.target.value)
//                       }
//                       options={filterOptions.packingTypes || []}
//                     />
//                     <InputField
//                       label="Pairs/Ctn"
//                       type="number"
//                       value={currentVariant.pairs_per_ctn}
//                       onChange={(e) =>
//                         handleVariantChange("pairs_per_ctn", e.target.value)
//                       }
//                     />
//                   </div>

//                   <div className="flex gap-2 pt-1">
//                     <button
//                       type="button"
//                       onClick={handleVariantSave}
//                       className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg transition"
//                     >
//                       {editingVariantId ? "Update" : "Add"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancelVariant}
//                       className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-100 transition"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* FOOTER BUTTON */}
//           <button
//             onClick={handleValidateAndSubmit}
//             className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-white font-semibold text-sm transition"
//           >
//             {isEditing ? "Update Product" : "Add Product"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import {
  X,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit2,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Compact Input Field Component
const InputField = ({
  label,
  required,
  error,
  hint,
  className = "",
  ...props
}) => (
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

// Compact Select Field Component
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

// Compact Image Upload Component
const ImageUpload = ({
  label,
  required,
  error,
  preview,
  onImageChange,
  id,
  compact = false,
}) => (
  <div>
    <label className="text-xs font-medium text-gray-700 block mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div
      className={`flex items-center gap-2 p-2 border rounded-lg transition ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-300 hover:border-teal-400"
      }`}
    >
      <div
        className={`${compact ? "w-10 h-10" : "w-14 h-14"} rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
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
          className={`${compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"} border rounded-lg cursor-pointer hover:bg-gray-50 transition inline-block`}
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
const VariantCard = ({ variant, index, onRemove, onEdit, filterOptions }) => {
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
              <img
                src={variant.preview}
                alt="Variant"
                className="w-full h-full object-cover"
              />
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
          <div>
            <span className="text-gray-500">MRP:</span>{" "}
            <span className="font-medium">₹{variant.price || 0}</span>
          </div>
          <div>
            <span className="text-gray-500">Selling:</span>{" "}
            <span className="font-medium">₹{variant.selling_price || 0}</span>
          </div>
          <div>
            <span className="text-gray-500">Packing:</span>{" "}
            <span className="font-medium">{variant.packing_type || "-"}</span>
          </div>
          <div>
            <span className="text-gray-500">Pairs/Ctn:</span>{" "}
            <span className="font-medium">{variant.pairs_per_ctn || "-"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductFormModal({
  isOpen,
  onClose,
  isEditing,
  newProduct,
  setNewProduct,
  filterOptions,
  onSubmit,
  editProduct,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [variantCounter, setVariantCounter] = useState(1);
  const [currentVariant, setCurrentVariant] = useState({
    id: 1,
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
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with one default variant when modal opens
  useEffect(() => {
    if (isOpen && !isEditing) {
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
      "w-full px-2.5 py-1.5 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm transition-all";
    const isInvalid =
      showValidationErrors && isFieldEmpty(newProduct[fieldName]);

    return `${baseClass} ${
      isInvalid
        ? "border-red-500 focus:ring-red-500/20"
        : "border-slate-200 focus:ring-teal-500"
    }`;
  };

  const getVariantFieldClass = (field) => {
    const baseClass =
      "w-full px-2.5 py-1.5 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm transition-all";
    const isInvalid =
      showValidationErrors && isFieldEmpty(currentVariant[field]);

    return `${baseClass} ${
      isInvalid
        ? "border-red-500 focus:ring-red-500/20"
        : "border-slate-200 focus:ring-teal-500"
    }`;
  };

  const createVariant = (id) => ({
    id,
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
  });

  // Add variant
  const handleAddVariant = () => {
    setShowVariantForm(true);
    setEditingVariantId(null);
    setCurrentVariant(createVariant(variantCounter));
  };

  // Save variant
  const handleVariantSave = () => {
    const variantErrors = {};
    if (!currentVariant.min_size) variantErrors.min_size = "Min size required";
    if (!currentVariant.max_size) variantErrors.max_size = "Max size required";
    if (!currentVariant.price) variantErrors.price = "MRP required";
    if (!currentVariant.selling_price)
      variantErrors.selling_price = "Selling price required";
    if (!currentVariant.stock) variantErrors.stock = "Stock required";

    if (Object.keys(variantErrors).length > 0) {
      setErrors(variantErrors);
      return;
    }

    if (editingVariantId) {
      // Update existing variant
      setNewProduct((prev) => ({
        ...prev,
        variants: prev.variants.map((v) =>
          v.id === editingVariantId ? { ...currentVariant } : v,
        ),
      }));
      setEditingVariantId(null);
    } else {
      // Add new variant
      setNewProduct((prev) => ({
        ...prev,
        variants: [...(prev.variants || []), { ...currentVariant }],
      }));
      setVariantCounter((prev) => prev + 1);
    }

    setCurrentVariant(createVariant(variantCounter + 1));
    setShowVariantForm(false);
    setErrors({});
  };

  // Edit variant
  const handleEditVariant = (variant) => {
    setCurrentVariant({ ...variant });
    setEditingVariantId(variant.id);
    setShowVariantForm(true);
  };

  // Remove variant
  const handleRemoveVariant = (id) => {
    setNewProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== id),
    }));
    if (editingVariantId === id) {
      editingVariantId(null);
      setShowVariantForm(false);
    }
  };

  // Cancel variant form
  const handleCancelVariant = () => {
    setShowVariantForm(false);
    setEditingVariantId(null);
    setCurrentVariant(createVariant(variantCounter));
    setErrors({});
  };

  // Handle variant image change
  const handleVariantImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCurrentVariant((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  // Handle variant field change
  const handleVariantChange = (field, value) => {
    setCurrentVariant((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleValidateAndSubmit = async (e) => {
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
      // "description",
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

    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
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

        <form onSubmit={handleValidateAndSubmit} encType="multipart/form-data">
          <div className="p-6 space-y-4">
            {/* IMAGE SECTION */}
            <ImageUpload
              label="Product Image"
              required={!isEditing}
              error={
                showValidationErrors && !isEditing && !previewUrl
                  ? "Image is required"
                  : ""
              }
              preview={previewUrl}
              onImageChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewProduct({ ...newProduct, image: file });
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              id="product-image-input"
              compact={false}
            />

            {/* MAIN FIELDS - Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField
                label="Article Name"
                required
                value={newProduct.article_name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, article_name: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.article_name)
                    ? "Required"
                    : ""
                }
              />
              {/* <InputField
                label="Description"
                required
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.description)
                    ? "Required"
                    : ""
                }
              /> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField
                label="MRP (₹)"
                required
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.price)
                    ? "Required"
                    : ""
                }
              />
              <div className="flex flex-col gap-1">
                <InputField
                  label="Selling Price (₹)"
                  required
                  type="number"
                  step="0.01"
                  value={newProduct.selling_price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      selling_price: e.target.value,
                    })
                  }
                  error={
                    showValidationErrors && isFieldEmpty(newProduct.selling_price)
                      ? "Required"
                      : isPriceInvalid
                        ? "Cannot exceed MRP"
                        : ""
                  }
                  className={isPriceInvalid ? "border-red-500" : ""}
                />
              </div>
            </div>

            {/* size of first variant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField
                label="Min Size"
                required
                type="number"
                value={newProduct.min_size}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, min_size: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.min_size)
                    ? "Required"
                    : ""
                }
              />
              <InputField
                label="Max Size"
                required
                type="number"
                value={newProduct.max_size}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, max_size: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.max_size)
                    ? "Required"
                    : ""
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField
                label="Stock Quantity"
                required
                type="number"
                value={newProduct.stock_quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock_quantity: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.stock_quantity)
                    ? "Required"
                    : ""
                }
              />
              <InputField
                label="Pairs per Carton"
                required
                type="number"
                value={newProduct.pairs_per_ctn}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, pairs_per_ctn: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.pairs_per_ctn)
                    ? "Required"
                    : ""
                }
              />
            </div>

            {/* ATTRIBUTES - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <SelectField
                label="Brand"
                required
                value={newProduct.brand_name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand_name: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.brand_name)
                    ? "Required"
                    : ""
                }
                options={filterOptions.brands || []}
              />
              <SelectField
                label="Category"
                required
                value={newProduct.category_name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category_name: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.category_name)
                    ? "Required"
                    : ""
                }
                options={filterOptions.categories || []}
              />
              <SelectField
                label="Gender"
                required
                value={newProduct.gender}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, gender: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.gender)
                    ? "Required"
                    : ""
                }
                options={filterOptions.gender || []}
              />
              <SelectField
                label="Color"
                required
                value={newProduct.color}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, color: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.color)
                    ? "Required"
                    : ""
                }
                options={filterOptions.colors || []}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <SelectField
                label="Material"
                required
                value={newProduct.material}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, material: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.material)
                    ? "Required"
                    : ""
                }
                options={filterOptions.materials || []}
              />
              <SelectField
                label="Upper Material"
                required
                value={newProduct.upper_material}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, upper_material: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.upper_material)
                    ? "Required"
                    : ""
                }
                options={filterOptions.upper_materials || []}
              />
              <SelectField
                label="Packing Type"
                required
                value={newProduct.packing_type}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, packing_type: e.target.value })
                }
                error={
                  showValidationErrors && isFieldEmpty(newProduct.packing_type)
                    ? "Required"
                    : ""
                }
                options={filterOptions.packingTypes || []}
              />
            </div>

            <InputField
              label="Origin"
              required
              value={newProduct.origin}
              onChange={(e) =>
                setNewProduct({ ...newProduct, origin: e.target.value })
              }
              error={
                showValidationErrors && isFieldEmpty(newProduct.origin)
                  ? "Required"
                  : ""
              }
            />

            {/* VARIANTS SECTION */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Variants ({newProduct.variants?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded-lg transition"
                >
                  <Plus size={14} />
                  Add Variant
                </button>
              </div>

              {/* Variants List */}
              {newProduct.variants && newProduct.variants.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {newProduct.variants.map((variant, index) => (
                    <VariantCard
                      key={variant.id || index}
                      variant={variant}
                      index={index}
                      onRemove={handleRemoveVariant}
                      onEdit={handleEditVariant}
                      filterOptions={filterOptions}
                    />
                  ))}
                </div>
              )}

              {/* Variant Form */}
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
                        onChange={(e) =>
                          handleVariantChange("min_size", e.target.value)
                        }
                        error={errors.min_size}
                      />
                      <InputField
                        label="Max Size"
                        required
                        type="number"
                        value={currentVariant.max_size}
                        onChange={(e) =>
                          handleVariantChange("max_size", e.target.value)
                        }
                        error={errors.max_size}
                      />
                      <SelectField
                        label="Color"
                        value={currentVariant.color}
                        onChange={(e) =>
                          handleVariantChange("color", e.target.value)
                        }
                        options={filterOptions.colors || []}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <InputField
                        label="MRP (₹)"
                        required
                        type="number"
                        step="0.01"
                        value={currentVariant.price}
                        onChange={(e) =>
                          handleVariantChange("price", e.target.value)
                        }
                        error={errors.price}
                      />
                      <InputField
                        label="Selling (₹)"
                        required
                        type="number"
                        step="0.01"
                        value={currentVariant.selling_price}
                        onChange={(e) =>
                          handleVariantChange("selling_price", e.target.value)
                        }
                        error={errors.selling_price}
                      />
                      <InputField
                        label="Stock"
                        required
                        type="number"
                        value={currentVariant.stock}
                        onChange={(e) =>
                          handleVariantChange("stock", e.target.value)
                        }
                        error={errors.stock}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <SelectField
                        label="Packing Type"
                        value={currentVariant.packing_type}
                        onChange={(e) =>
                          handleVariantChange("packing_type", e.target.value)
                        }
                        options={filterOptions.packingTypes || []}
                      />
                      <InputField
                        label="Pairs/Ctn"
                        type="number"
                        value={currentVariant.pairs_per_ctn}
                        onChange={(e) =>
                          handleVariantChange("pairs_per_ctn", e.target.value)
                        }
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

            {/* FOOTER BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-white font-semibold text-sm transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}