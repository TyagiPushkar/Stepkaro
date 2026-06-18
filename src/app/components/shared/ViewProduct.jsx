"use client";
import {
  X,
  Package,
  Loader2,
  Store,
  User,
  Phone,
  Mail,
  Building2,
  Tag,
  Ruler,
  Palette,
  Layers,
  Box,
  Ship,
  Scale,
  Info as InfoIcon,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://namami-infotech.com/Stepkaro";

export default function ViewProduct({
  isOpen,
  onClose,
  productId,
  variant = "seller",
}) {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/src/product/get_admin_products_details.php?id=${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          setProductData(response.data.data);
        } else {
          setError(response.data.message || "Failed to load product");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId]);

  if (!isOpen) return null;

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-12 w-12 text-violet-600" />
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !productData) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-[450px] text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            {error || "Product details are not available."}
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const p = productData;

  // Image URL
  const imageUrl = p.image
    ? p.image.startsWith("http")
      ? p.image
      : `${BASE_URL}/${p.image}`
    : "https://placehold.co/600x600?text=No+Image";

  // Helper component for info items
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-violet-200 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-violet-500" />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {value || "—"}
      </p>
    </div>
  );

  // Status Badge
  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: "bg-emerald-100 text-emerald-700", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-700", label: "Inactive" },
      approve_request: {
        color: "bg-amber-100 text-amber-700",
        label: "Pending Approval",
      },
      reject: { color: "bg-red-100 text-red-700", label: "Rejected" },
    };
    return statusMap[status] || statusMap.inactive;
  };

  const statusBadge = getStatusBadge(p.status);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Product Details
              </h2>
              <p className="text-xs text-slate-500">ID: #{p.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[80vh] p-6">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* LEFT COLUMN - Image & Quick Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative group">
                <img
                  src={imageUrl}
                  alt={p.article_name}
                  className="w-full aspect-square object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x600?text=No+Image";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-xs text-emerald-600 font-medium">
                    Selling Price
                  </p>
                  <p className="text-xl font-bold text-emerald-700">
                    ₹{p.selling_price}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                  <p className="text-xs text-purple-600 font-medium">
                    Commission
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {p.commission}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium">Stock</p>
                  <p className="text-xl font-bold text-blue-700">
                    {p.stock_quantity}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200">
                  <p className="text-xs text-amber-600 font-medium">MRP</p>
                  <p className="text-xl font-bold text-amber-700">₹{p.price}</p>
                </div>
              </div>

              {/* Discount Badge */}
              {p.price && p.selling_price && p.price > p.selling_price && (
                <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl p-3 border border-red-200 text-center">
                  <p className="text-sm font-medium text-red-600">
                    🎉{" "}
                    {Math.round(((p.price - p.selling_price) / p.price) * 100)}%
                    OFF
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Details */}
            <div className="lg:col-span-3 space-y-4">
              {/* Product Name */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {p.article_name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500">{p.brand_name}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-sm text-slate-500">
                    {p.category_name}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {p.description || "No description available"}
                </p>
              </div>

              {/* Vendor Information - Collapsible style */}
              {(variant === "admin" || variant === "seller") && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Store size={18} className="text-violet-600" />
                      <h3 className="font-semibold text-slate-800">
                        Vendor Information
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Business
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {p.business_name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Owner
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {p.owner_name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {p.phone || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {p.email || "—"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 font-medium">GST</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {p.gst_number || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Specifications */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <InfoIcon size={18} className="text-violet-600" />
                  Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <InfoItem
                    icon={Building2}
                    label="Brand"
                    value={p.brand_name}
                  />
                  <InfoItem
                    icon={Box}
                    label="Category"
                    value={p.category_name}
                  />
                  <InfoItem icon={User} label="Gender" value={p.gender} />
                  <InfoItem icon={Palette} label="Color" value={p.color} />
                  <InfoItem icon={Layers} label="Material" value={p.material} />
                  <InfoItem
                    icon={Layers}
                    label="Upper"
                    value={p.upper_material}
                  />
                  <InfoItem
                    icon={Package}
                    label="Packing"
                    value={p.packing_type}
                  />
                  <InfoItem
                    icon={Scale}
                    label="Pairs/CTN"
                    value={p.pairs_per_ctn}
                  />
                  <InfoItem icon={Ship} label="Origin" value={p.origin} />
                  <InfoItem
                    icon={Ruler}
                    label="Variant"
                    value={p.variant || "—"}
                  />
                </div>
              </div>

              {/* Variants Section */}
              {p.variants && p.variants.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Size Variants
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {p.variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        {v.min_size} - {v.max_size}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
