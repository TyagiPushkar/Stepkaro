"use client";
// import React from "react";
import { X, Image as ImageIcon } from "lucide-react";
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
  
//  useEffect(() => {
//     if (isOpen) {
//        setShowValidationErrors(false); 
//       if (newProduct.image && typeof newProduct.image === "string") {
//         setPreviewUrl(newProduct.image);
//       } else if (newProduct.image instanceof File) {
//         setPreviewUrl(URL.createObjectURL(newProduct.image));
//       } else {
//         setPreviewUrl("");
//       }
//     }
//   }, [isOpen, newProduct.image]);

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
 
  // Real-time boolean check to see if the error text should be displayed
    const isPriceInvalid = 
    newProduct.selling_price && 
    newProduct.price && 
    Number(newProduct.selling_price) > Number(newProduct.price);

     // Helper utility function to determine if a specific field is currently empty/invalid
        const isFieldEmpty = (value) => {
            if (value === undefined || value === null) return true;
            // if (typeof value === "string") return value.trim() === "";
            const stringValue = value.toString().trim();
            return stringValue === "";
            // return false;
        };
        
            const handleValidateAndSubmit = (e) => {
            e.preventDefault();
            setShowValidationErrors(true);
            
          // List of all mandatory field keys that must be filled out
    const requiredFields = [
      "article_name",
      "selling_price",
      "price",
      "brand_name",
      "category_name",
      "stock_quantity",
      "min_size",
      "max_size",
      "gender",
      "color",
      "material",
      "packing_type",
      "pairs_per_ctn",
      "origin",
      "description"
    ];
    
    // Check if any text or numeric field is empty
    const hasEmptyFields = requiredFields.some((field) => isFieldEmpty(newProduct[field]));

    // Check if the image asset is completely missing
    // const hasNoImage = isFieldEmpty(newProduct.image);

    //   const hasNoImage = !newProduct.image;
    const hasNoImage = !newProduct.image || (typeof newProduct.image === "string" && newProduct.image.trim() === "");

    if (hasEmptyFields || hasNoImage) {
      alert("Validation Error: Please fill all the required fields and attach a product photo!");
      return;
    }

    if (isPriceInvalid) {
      alert("Validation Error: Selling Price cannot be greater than the MRP!");
      return;
    }

    
    onSubmit(e);
  };

   // Reusable utility pattern to apply red highlight ring logic consistently to any form field element
  const getFieldClass = (fieldName) => {
    const baseClass = "w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 text-sm transition-all";
    const isInvalid = showValidationErrors && isFieldEmpty(newProduct[fieldName]);
    
    return `${baseClass} ${
      isInvalid 
        ? "border-red-500 focus:ring-red-500/20 shadow-sm shadow-red-500/10" 
        : "border-white/10 focus:ring-teal-500"
    }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* upload photo */}

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 pl-1">
               {isEditing ? "Product Photo" : "Upload Product Photo"}{!isEditing && <span className="text-red-500">*</span>}
              </label>
              
              <div className={`flex flex-col sm:flex-row gap-4 items-center bg-slate-900/60 p-3 border rounded-xl transition-all ${
                !isEditing && showValidationErrors && !newProduct.image
                  ? "border-red-500 shadow-sm shadow-red-500/10"
                  : "border-white/10"
              
              }`}>
                
                {/* Left Side: Interactive Live Image Preview Box */}
                <div className="w-20 h-20 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-white/10 overflow-hidden relative shrink-0">
                  {previewUrl ? (
                    <img 
                    //   src={previewUrl} 
                     src=
                     { newProduct.image instanceof File
                        ? previewUrl
                        :typeof newProduct.image === "string" && newProduct.image.trim() !== ""
                         ?(newProduct.image.startsWith("http")  ? newProduct.image : `https://namami-infotech.com/Stepkaro/${newProduct.image}`)
                        // : `https://namami-infotech.com/Stepkaro/${newProduct.image}` 
                        : "https://placehold.co/80x80?text=No+Photo"
                      }
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/80x80?text=No+Photo";
                      }} 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <ImageIcon size={24} />
                      <span className="text-xs font-medium">photo</span>
                    </div>
                  )}
                </div>

                {/* Right Side: File Input Target Selector Section */}
                {!isEditing ? (
                <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-auto pr-1">
                  {/* <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 transition-all w-[140px]"> */}
                    <div className={`relative flex items-center bg-slate-900 border rounded-xl overflow-hidden focus-within:ring-2 transition-all w-[140px] ${
                    showValidationErrors && !newProduct.image
                      ? "border-red-500 focus-within:ring-red-500/20"
                      : "border-white/10 focus-within:ring-teal-500"
                  }`}>
                    <input
                      type="file"
                      id="product-photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewProduct({ ...newProduct, image: file });
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {/* Replicating the styled "Choose File" container from image_959f55.png */}
                    <div className="flex items-center w-full px-2 py-1.5 justify start">
                      <span className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors z-20 pointer-events-none">
                        Choose File
                      </span>
                    </div>
                  </div>
                  
                  {/* Bottom Area: Dynamic File Selector Name Label Indicator */}
                  <p className="text-xs text-gray-400 pl-1 truncate max-w-md">
                    {newProduct.image instanceof File 
                     
                     ? `${newProduct.image.name}` 
                        : "No file chosen"}
                     
                    {/* //   ? `Selected file: ${newProduct.image.name}` 
                    //   : isEditing && previewUrl 
                    //     ? "Current active product image loaded" 
                    //     : "No file chosen"} */}
                  </p>
                </div>
                ) :(
                   
                    <div className="ml-auto pr-2">
                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-400 font-medium select-none">
                      Photo Cannot Be Changed
                    </span>
                  </div>
                )}
                    

              </div>
            </div>

            <input
              placeholder="Article Name *"
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              className={getFieldClass("article_name")}
              value={newProduct.article_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, article_name: e.target.value })
              }
            />
            {/* <input
              placeholder="Selling Price *"
              type="number"
              className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={newProduct.selling_price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, selling_price: e.target.value })
              }
            /> */}
            <input
              placeholder="Price (MRP) *"
              type="number"
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
             className={getFieldClass("price")}
            value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            {/* <input
              placeholder="Selling Price *"
              type="number"
              className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={newProduct.selling_price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, selling_price: e.target.value })
              }
            /> */}
             <div className="flex flex-col gap-1">
              <input
                placeholder="Selling Price *"
                type="number"
                 min="1"
                className={`px-4 py-2.5 bg-slate-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                //   isPriceInvalid 
                  (showValidationErrors && isFieldEmpty(newProduct.selling_price)) || isPriceInvalid
                    ? "border-red-500/50 focus:ring-red-500/20" 
                    : "border-white/10 focus:ring-teal-500"
                }`}
                value={newProduct.selling_price}
                onChange={(e) =>{
                  
                   const value = e.target.value;
                  
                  // If they backspace completely, let them type. Otherwise, block anything below 1
                  if (value !== "" && Number(value) < 1) {
                    setNewProduct({ ...newProduct, selling_price: "1" });
                  } else {
                    setNewProduct({ ...newProduct, selling_price: value });
                  }
                }
                }
              />
              {isPriceInvalid && (
                <span className="text-red-500 text-xs pl-1 font-medium animate-fadeIn">
                  Selling price should be less than MRP *
                </span>
              )}
            </div>

            <select
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              className={getFieldClass("brand_name")}
              value={newProduct.brand_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand_name: e.target.value })
              }
            >
              <option value="">Select Brand *</option>
              {filterOptions.brands.map((brand, idx) => (
                <option key={`brand-${idx}-${brand}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <select
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              className={getFieldClass("category_name")}
              value={newProduct.category_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category_name: e.target.value })
              }
            >
              <option value="">Select Category *</option>
              {filterOptions.categories.map((cat, idx) => (
                <option key={`cat-${idx}-${cat}`} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              placeholder="Stock Quantity *"
              type="number"
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
               className={getFieldClass("stock_quantity")}
              value={newProduct.stock_quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock_quantity: e.target.value })
              }
            />
            {/* <input
              type="number"
              placeholder="Min Size *"
              className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={newProduct.min_size}
              onChange={(e) =>
                setNewProduct({ ...newProduct, min_size: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Size *"
              className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={newProduct.max_size}
              onChange={(e) =>
                setNewProduct({ ...newProduct, max_size: e.target.value })
              }
            /> */}
            <select
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
             className={getFieldClass("gender")} 
            value={newProduct.gender}
              onChange={(e) =>
                setNewProduct({ ...newProduct, gender: e.target.value })
              }
            >
              <option value="">Select Gender *</option>
              {filterOptions.gender.map((g, idx) => (
                <option key={`gender-${idx}-${g}`} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
             className={getFieldClass("color")} 
            value={newProduct.color}
              onChange={(e) =>
                setNewProduct({ ...newProduct, color: e.target.value })
              }
            >
              <option value="">Select Color *</option>
              {filterOptions.colors.map((color, idx) => (
                <option key={`color-${idx}-${color}`} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <select
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            className={getFieldClass("material")}  
            value={newProduct.material}
              onChange={(e) =>
                setNewProduct({ ...newProduct, material: e.target.value })
              }
            >
              <option value="">Select Material *</option>
              {filterOptions.materials.map((mat, idx) => (
                <option key={`material-${idx}-${mat}`} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
            <select
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            className={getFieldClass("packing_type")} 
            value={newProduct.packing_type}
              onChange={(e) =>
                setNewProduct({ ...newProduct, packing_type: e.target.value })
              }
            >
              <option value="">Select Packing Type *</option>
              {filterOptions.packingTypes.map((type, idx) => (
                <option key={`packing-${idx}-${type}`} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              placeholder="Pairs"
              type="number"
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
             className={getFieldClass("pairs_per_ctn")} 
            value={newProduct.pairs_per_ctn}
              onChange={(e) =>
                setNewProduct({ ...newProduct, pairs_per_ctn: e.target.value })
              }
            />
            <input
              placeholder="Origin"
              className={getFieldClass("origin")}
              //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={newProduct.origin}
              onChange={(e) =>
                setNewProduct({ ...newProduct, origin: e.target.value })
              }
            />

             <input
              type="number"
              placeholder="Min Size *"
              className={getFieldClass("min_size")}
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={newProduct.min_size}
              onChange={(e) =>
                setNewProduct({ ...newProduct, min_size: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Size *"
            //   className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
             className={getFieldClass("max_size")} 
              value={newProduct.max_size}
              onChange={(e) =>
                setNewProduct({ ...newProduct, max_size: e.target.value })
              }
            />
              {/* <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 pl-1">
                Upload Product Photo
              </label>
              <div className="relative flex items-center justify-between px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Binds image state directly into your existing form state object if required by backend,
                      // or makes it instantly retrievable on target file capture
                      setNewProduct({ ...newProduct, image: file });
                    }
                  }}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:cursor-pointer"
                />
              </div>
            </div> */}

            {/* upload pciture section */}

            <textarea
              placeholder="Description"
              rows={3}
            //   className="md:col-span-2 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              className={getFieldClass("description")}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>


          {/* <button
            onClick={onSubmit}
            className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-colors font-medium"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button> */}
           {/* <button
            onClick={(e) => {
              const sellingPrice = Number(newProduct.selling_price);
              const mrp = Number(newProduct.price);

              // Throw a browser warning and stop submission if selling price exceeds MRP
              if (sellingPrice > mrp) {
                e.preventDefault(); 
                alert("Validation Error: Selling Price cannot be greater than the MRP!");
                return;
              }

              // Fire original submission function if numbers match up properly
              onSubmit(e);
            }}
            className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-colors font-medium"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button> */}
         <button
            onClick={handleValidateAndSubmit}
            className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-colors font-medium"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>


        </div>
      </div>
    </div>
  );
}