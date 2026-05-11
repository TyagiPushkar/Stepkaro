"use client";
import { useState } from "react";
import { 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  X,
  Image as ImageIcon,
  Video,
  Star,
  Eye,
  EyeOff,
  DollarSign,
  TrendingUp,
  Tag,
  Package,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ProductDetailPage() {
  const [variants, setVariants] = useState([
    {
      id: 1,
      name: "18X29",
      color: "MIX",
      size: "18X29",
      qty: 1,
      price: 44,
      strike: 54,
    },
  ]);

  const [productInfo, setProductInfo] = useState({
    name: "",
    category: "",
    subCategory: "",
    collection: "",
    description: "",
    videoLink: "",
    rating: 4.5,
    codAllowed: true,
    display: true,
    showPrice: true,
    enquiry: false,
    returnable: true,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ["Footwear", "Clothing", "Accessories", "Kids Wear"];
  const subCategories = ["Ladies sleeper", "Kids Clogs", "Men's Footwear", "Running Shoes"];
  const collections = ["Summer Collection", "Winter Collection", "Festival Collection", "Premium Collection"];

  // Add new variant
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        name: "",
        color: "",
        size: "",
        qty: 0,
        price: 0,
        strike: 0,
      },
    ]);
  };

  // Remove variant
  const removeVariant = (id) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  // Update variant
  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images upload
  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove additional image
  const removeImage = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      productInfo,
      variants,
      thumbnail,
      additionalImages,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle size={18} />
          Product updated successfully!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product Information</h1>
          <p className="text-gray-400 text-sm mt-1">Update your product details and variants</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Save size={16} />
          Update Product
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE - Product Information */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Package size={18} className="text-teal-400" />
              <h2 className="font-semibold text-white">Product Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                <input
                  value={productInfo.name}
                  onChange={(e) => setProductInfo({...productInfo, name: e.target.value})}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Category</label>
                  <select 
                    value={productInfo.category}
                    onChange={(e) => setProductInfo({...productInfo, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">Sub Category</label>
                  <select 
                    value={productInfo.subCategory}
                    onChange={(e) => setProductInfo({...productInfo, subCategory: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Collection</label>
                <select 
                  value={productInfo.collection}
                  onChange={(e) => setProductInfo({...productInfo, collection: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Collection</option>
                  {collections.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Description</label>
                <textarea
                  value={productInfo.description}
                  onChange={(e) => setProductInfo({...productInfo, description: e.target.value})}
                  placeholder="Product description"
                  rows="4"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - General Information */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Tag size={18} className="text-teal-400" />
              <h2 className="font-semibold text-white">General Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Video Link</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    value={productInfo.videoLink}
                    onChange={(e) => setProductInfo({...productInfo, videoLink: e.target.value})}
                    placeholder="https://youtube.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    value={productInfo.rating}
                    onChange={(e) => setProductInfo({...productInfo, rating: parseFloat(e.target.value)})}
                    className="w-24 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-400 text-sm">/ 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">COD Allowed</span>
                  <input
                    type="checkbox"
                    checked={productInfo.codAllowed}
                    onChange={(e) => setProductInfo({...productInfo, codAllowed: e.target.checked})}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">Display</span>
                  <input
                    type="checkbox"
                    checked={productInfo.display}
                    onChange={(e) => setProductInfo({...productInfo, display: e.target.checked})}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">Show Price</span>
                  <input
                    type="checkbox"
                    checked={productInfo.showPrice}
                    onChange={(e) => setProductInfo({...productInfo, showPrice: e.target.checked})}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">Enquiry Required</span>
                  <input
                    type="checkbox"
                    checked={productInfo.enquiry}
                    onChange={(e) => setProductInfo({...productInfo, enquiry: e.target.checked})}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">Returnable</span>
                  <input
                    type="checkbox"
                    checked={productInfo.returnable}
                    onChange={(e) => setProductInfo({...productInfo, returnable: e.target.checked})}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* VARIANTS + MEDIA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Variants Section */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-400" />
                <h2 className="font-semibold text-white">Product Variants</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <Plus size={14} />
                Add More
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-teal-400">Variant {index + 1}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Variant Name"
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                      className="px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      placeholder="Color Code"
                      value={variant.color}
                      onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                      className="px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      placeholder="Size"
                      value={variant.size}
                      onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                      className="px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={variant.qty}
                      onChange={(e) => updateVariant(variant.id, "qty", parseInt(e.target.value))}
                      className="px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, "price", parseInt(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        placeholder="Strike Price"
                        value={variant.strike}
                        onChange={(e) => updateVariant(variant.id, "strike", parseInt(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <ImageIcon size={18} className="text-teal-400" />
              <h2 className="font-semibold text-white">Product Media</h2>
            </div>

            {/* Thumbnail */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 block mb-2">Thumbnail Image</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-teal-500/50 transition-colors">
                {thumbnail ? (
                  <div className="relative inline-block">
                    <img src={thumbnail} alt="Thumbnail" className="w-32 h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setThumbnail(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload size={32} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Click to upload thumbnail</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Additional Images</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-4 hover:border-teal-500/50 transition-colors">
                <div className="flex flex-wrap gap-3 mb-3">
                  {additionalImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="cursor-pointer block text-center">
                  <Upload size={24} className="text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Upload multiple images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAdditionalImages}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}