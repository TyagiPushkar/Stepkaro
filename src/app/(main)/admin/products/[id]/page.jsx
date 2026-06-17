"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Star,
  DollarSign,
  TrendingUp,
  Tag,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  // console.log("Product ID from URL:", productId);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [vendorInfo, setVendorInfo] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    gst_number: "",
    email: "",
  });

  // Product Core Info State (Mapped with your API keys)
  const [productInfo, setProductInfo] = useState({
    id: "",
    article_name: "",
    description: "",
    category_name: "",
    brand_name: "",
    material: "",
    origin: "Made in India",
    pairs_per_ctn: 0,
    commission: "",
    gender: "",
    videoLink: "", // keeping placeholder if you add videos later
    rating: 4.5,
    codAllowed: true,
    display: true,
    showPrice: true,
    enquiry: false,
    returnable: true,
  });

  // Variants State (Mapped with your flat product database structure)
  const [variants, setVariants] = useState([
    {
      id: Date.now(),
      variant: "",
      color: "",
      size: "",
      stock_quantity: 0,
      price: 0,
      selling_price: 0,
    },
  ]);

 
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);

  const categories = [
    "Ladies Slippers",
    "Footwear",
    "Clothing",
    "Accessories",
    "Kids Wear",
  ];
  // const brands = ["TARZAN", "Adidas", "Nike", "Puma"];
  // Next.js client-side par safe checking ke liye localstorage pick kiya
  const token = localStorage.getItem("access_token");

  // --- 1. FETCH PRODUCT DETAILS WITH TOKEN AUTHORIZATION ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        if (!token) {
          setErrorMessage("Authentication token missing! Please login again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://namami-infotech.com/Stepkaro/src/product/get_admin_products_details.php",
          {
            params: { id: productId }, // dynamic banana ho toh dynamic ID use karein
            headers: {
              // Yahan aapka token jaa rha hai standard Bearer format mein
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (response.data && response.data.success) {
          const product = response.data.data;
          // console.log("Fetched Product Data:", product);

          setProductInfo({
            id: product.id,
            article_name: product.article_name || "",
            description: product.description || "",
            category_name: product.category_name || "",
            brand_name: product.brand_name || "",
            material: product.material || "",
            origin: product.origin || "Made in India",
            pairs_per_ctn: product.pairs_per_ctn || 0,
            commission: product.commission || "",
            gender: product.gender || "",
            videoLink: product.videoLink || "",
            rating: 4.5,
            codAllowed: product.status === "active",
            display: true,
            showPrice: true,
            enquiry: false,
            returnable: true,
          });

          setVendorInfo({
            business_name: product.business_name || "",
            owner_name: product.owner_name || "",
            phone: product.phone || "",
            gst_number: product.gst_number || "",
            email: product.email || "",
          });

          setVariants([
            {
              id: product.id || Date.now(),
              variant: product.variant || "",
              color: product.color || "",
              size: product.size || "",
              stock_quantity: product.stock_quantity || "",
              price: parseFloat(product.price) || 0,
              selling_price: parseFloat(product.selling_price) || 0,
            },
          ]);

          if (product.image) {
            const baseUrl = "https://namami-infotech.com/Stepkaro/";
            setThumbnailPreview(`${baseUrl}${product.image}`);
          }
        } else {
          setErrorMessage(
            response.data.message || "Failed to fetch product data.",
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "API connectivity issue while loading product.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  // --- 2. UPDATE PRODUCT SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");

      // Payload structuring matching with update backend requirement
      const formData = new FormData();

      formData.append("product_id", productInfo.id);
      formData.append("article_name", productInfo.article_name);
      formData.append("description", productInfo.description);
      formData.append("status", productInfo.codAllowed ? "active" : "inactive");

      formData.append("selling_price", variants[0]?.selling_price);
      formData.append("price", variants[0]?.price);
      formData.append("variant", variants[0]?.variant);
      formData.append("color", variants[0]?.color);
      formData.append("size", variants[0]?.size);
      formData.append("stock_quantity", variants[0]?.stock_quantity);

      // formData.append(
      //   "brand_id",
      //   productInfo.brand_id ? Number(productInfo.brand_id) : 0,
      // );
      // formData.append(
      //   "category_id",
      //   productInfo.category_id ? Number(productInfo.category_id) : 0,
      // );
      formData.append("material", productInfo.material);
      formData.append("origin", productInfo.origin);
    formData.append(
  "commission",
  productInfo.commission || 0
);

    

      const response = await axios.post(
        "https://namami-infotech.com/Stepkaro/src/product/admin_update_product_details.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data && response.data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setErrorMessage(
          response.data.message || "Something went wrong during update.",
        );
      }
    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response:", error.response);
      console.log("Response Data:", error.response?.data);

      setErrorMessage(
        error.response?.data?.message ||
          "Server error while updating product data.",
      );
    }
  };

  // Helper Variant state modifier functions
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        variant: "",
        color: "",
        size: "",
        stock_quantity: 0,
        price: 0,
        selling_price: 0,
      },
    ]);
  };

  const removeVariant = (id) => {
    if (variants.length > 1) setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id, field, value) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-teal-400 font-medium">
        Loading Product Data from Admin Panel...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Toast Notifiers */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle size={18} />
          Product updated successfully!
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="text-red-400" />
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Edit Product Information
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Prefilled from Admin Endpoint
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
        >
          <Save size={16} />
          Update Product
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE - Core Product Information */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Package size={18} className="text-teal-400" />
              <h2 className="font-semibold text-white">Product Core Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Article / Product Name
                </label>
                <input
                  value={productInfo.article_name}
                  onChange={(e) =>
                    setProductInfo({
                      ...productInfo,
                      article_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={productInfo.category_name}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        category_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Brand Name
                  </label>
                  <input
                    value={productInfo.brand_name}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        brand_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Material
                  </label>
                  <input
                    value={productInfo.material}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        material: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Pairs Per Carton
                  </label>
                  <input
                    type="number"
                    value={productInfo.pairs_per_ctn}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        pairs_per_ctn: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Description
                </label>
                <textarea
                  value={productInfo.description}
                  onChange={(e) =>
                    setProductInfo({
                      ...productInfo,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Shipping & Metadata */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Tag size={18} className="text-teal-400" />
              <h2 className="font-semibold text-white">
                General Information & Pricing Metrics
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Origin Country
                  </label>
                  <input
                    value={productInfo.origin}
                    onChange={(e) =>
                      setProductInfo({ ...productInfo, origin: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productInfo.commission}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        commission: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-white/10">
                  <label className="text-xs text-gray-400">Business Name</label>
                  <p className="text-white font-medium">
                    {vendorInfo.business_name || "—"}
                  </p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-white/10">
                  <label className="text-xs text-gray-400">Owner Name</label>
                  <p className="text-white font-medium">
                    {vendorInfo.owner_name || "—"}
                  </p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-white/10">
                  <label className="text-xs text-gray-400">Phone</label>
                  <p className="text-white font-medium">
                    {vendorInfo.phone || "—"}
                  </p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-white/10">
                  <label className="text-xs text-gray-400">GST Number</label>
                  <p className="text-white font-medium">
                    {vendorInfo.gst_number || "—"}
                  </p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-white/10 col-span-2">
                  <label className="text-xs text-gray-400">Email</label>
                  <p className="text-white font-medium">
                    {vendorInfo.email || "—"}
                  </p>
                </div>
              </div>

              {/* <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Video Promotional Link
                </label>
                <div className="relative">
                  <Video
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    value={productInfo.videoLink}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        videoLink: e.target.value,
                      })
                    }
                    placeholder="https://youtube.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div> */}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">
                    Active Status Display
                  </span>
                  <input
                    type="checkbox"
                    checked={productInfo.codAllowed}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        codAllowed: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label>
                {/* <label className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm text-gray-300">Returnable Item</span>
                  <input
                    type="checkbox"
                    checked={productInfo.returnable}
                    onChange={(e) =>
                      setProductInfo({
                        ...productInfo,
                        returnable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                </label> */}
              </div>
            </div>
          </div>
        </div>

        {/* VARIANTS + MEDIA SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Variants Segment */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-400" />
                <h2 className="font-semibold text-white">Stock Variants</h2>
              </div>
              {/* <button
                type="button"
                onClick={addVariant}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <Plus size={14} />
                Add Stock Info
              </button> */}
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="bg-slate-800/30 rounded-xl p-4 border border-white/5"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-teal-400">
                      Inventory Set {index + 1}
                    </span>
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
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Variant Type
                      </label>
                      <input
                        placeholder="e.g. 8x8"
                        value={variant.variant}
                        onChange={(e) =>
                          updateVariant(variant.id, "variant", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Color Shade
                      </label>
                      <input
                        placeholder="e.g. black"
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variant.id, "color", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Size Metric
                      </label>
                      <input
                        placeholder="e.g. 8"
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(variant.id, "size", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Stock Vol.
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        value={variant.stock_quantity ?? ""}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "stock_quantity",
                            Math.max(0, Number(e.target.value) || 0),
                          )
                        }
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Original Price (Strike)
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full pl-7 pr-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Selling Discount Price
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                          type="number"
                          value={variant.selling_price}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "selling_price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full pl-7 pr-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Content Segment */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <ImageIcon size={18} className="text-teal-400" />
              <h2 className="font-semibold text-white">Media Assert Preview</h2>
            </div>

            {/* Thumbnail Render block */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 block mb-2">
                Primary Image Thumbnail
              </label>
              <div className="border border-white/10 rounded-xl p-4">
  {thumbnailPreview ? (
    <img
      src={thumbnailPreview}
      alt="Product"
      className="w-40 h-40 object-cover rounded-lg"
    />
  ) : (
    <p className="text-gray-400 text-sm">
      No image available
    </p>
  )}
</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
