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
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
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

  // Product Core Info State
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
    videoLink: "",
    rating: 4.5,
    codAllowed: true,
    display: true,
    showPrice: true,
    enquiry: false,
    returnable: true,
  });

  // Variants State
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const categories = [
    "Ladies Slippers",
    "Footwear",
    "Clothing",
    "Accessories",
    "Kids Wear",
  ];

  const token = localStorage.getItem("access_token");

  // --- 1. FETCH PRODUCT DETAILS ---
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
            params: { id: productId },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data && response.data.success) {
          const product = response.data.data;

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
            response.data.message || "Failed to fetch product data."
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "API connectivity issue while loading product."
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
      formData.append("material", productInfo.material);
      formData.append("origin", productInfo.origin);
      formData.append("commission", productInfo.commission || 0);
      if (selectedImage) {
  formData.append("image", selectedImage);
}

      const response = await axios.post(
        "https://namami-infotech.com/Stepkaro/src/product/admin_update_product_details.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setErrorMessage(
          response.data.message || "Something went wrong during update."
        );
      }
    } catch (error) {
      console.log("Full Error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Server error while updating product data."
      );
    }
  };

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
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notifiers */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle size={18} />
          Product updated successfully!
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Product Information
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage product details and inventory
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white px-6 py-2 rounded-xl text-sm flex items-center gap-2 transition-all"
        >
          <Save size={16} />
          Update Product
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE - Core Product Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <Package size={18} className="text-purple-600" />
              <h2 className="font-semibold text-gray-900">
                Product Core Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
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
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
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
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Shipping & Metadata */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <Tag size={18} className="text-orange-500" />
              <h2 className="font-semibold text-gray-900">
                General Information & Pricing Metrics
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Origin Country
                  </label>
                  <input
                    value={productInfo.origin}
                    onChange={(e) =>
                      setProductInfo({ ...productInfo, origin: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-xs text-gray-500">Business Name</label>
                  <p className="text-gray-900 font-medium">
                    {vendorInfo.business_name || "—"}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-xs text-gray-500">Owner Name</label>
                  <p className="text-gray-900 font-medium">
                    {vendorInfo.owner_name || "—"}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">
                    {vendorInfo.phone || "—"}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-xs text-gray-500">GST Number</label>
                  <p className="text-gray-900 font-medium">
                    {vendorInfo.gst_number || "—"}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 col-span-2">
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-gray-900 font-medium">
                    {vendorInfo.email || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                  <span className="text-sm text-gray-700">
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
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* VARIANTS + MEDIA SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Variants Segment */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" />
                <h2 className="font-semibold text-gray-900">Stock Variants</h2>
              </div>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-purple-600 font-medium">
                      Inventory Set {index + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Variant Type
                      </label>
                      <input
                        placeholder="e.g. 8x8"
                        value={variant.variant}
                        onChange={(e) =>
                          updateVariant(variant.id, "variant", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Color Shade
                      </label>
                      <input
                        placeholder="e.g. black"
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variant.id, "color", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Size Metric
                      </label>
                      <input
                        placeholder="e.g. 8"
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(variant.id, "size", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
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
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Original Price (Strike)
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Selling Discount Price
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={variant.selling_price}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "selling_price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Content Segment */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <ImageIcon size={18} className="text-orange-500" />
              <h2 className="font-semibold text-gray-900">
                Media Asset Preview
              </h2>
            </div>

            {/* Thumbnail Render block */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Primary Image Thumbnail
              </label>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
  {thumbnailPreview ? (
    <img
      src={thumbnailPreview}
      alt="Product"
      className="w-40 h-40 object-cover rounded-lg border border-gray-200"
    />
  ) : (
    <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
      <ImageIcon size={32} className="text-gray-400" />
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    className="mt-4 block w-full text-sm"
    onChange={(e) => {
      const file = e.target.files[0];

      if (!file) return;

      setSelectedImage(file);

      setThumbnailPreview(URL.createObjectURL(file));
    }}
  />
</div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">Product ID</p>
                  <p className="text-sm font-medium text-gray-900">
                    #{productInfo.id}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      productInfo.codAllowed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {productInfo.codAllowed ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}