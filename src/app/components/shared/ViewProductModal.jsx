"use client";

import {
  X,
  Pencil,
  Package,
  Tag,
  Palette,
  Layers,
  Box,
  MapPin,
  IndianRupee,
  Hash,
  User,
  BadgePercent,
  ShoppingBag,
} from "lucide-react";

export function normalizeProduct(product) {
  if (!product) return null;

  const isActive =
    product.stock === true ||
    product.status === "active" ||
    (product.stock !== false && product.status !== "inactive");

  return {
    id: product.id,
    name: product.name || product.article_name || "—",
    article: product.article || product.article_name || "—",
    description: product.description || "",
    category: product.category || product.category_name || "—",
    brand: product.brand || product.brand_name || "—",
    size:
      product.variant ||
      product.size ||
      (product.min_size && product.max_size
        ? `${product.min_size}-${product.max_size}`
        : null) ||
      "—",
    color: product.color || "—",
    material: product.material || "—",
    packingType: product.packingType || product.packing_type || "—",
    pairsPerCTN: product.pairsPerCTN ?? product.pairs_per_ctn ?? "—",
    origin: product.origin || "—",
    gender: product.gender || "—",
    price: product.selling_price || product.price || "—",
    mrp: product.price || null,
    sellingPrice: product.selling_price || product.price || null,
    quantity: product.quantity ?? product.stock_quantity ?? "—",
    isActive,
    status: product.status || (isActive ? "active" : "inactive"),
    image: product.image,
    commission: product.commission,
    ownerName: product.owner_name || null,
    businessName: product.business_name || null,
    orders: product.orders ?? null,
  };
}

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `https://namami-infotech.com/Stepkaro/${image}`;
}

function DetailItem({ icon: Icon, label, value, theme }) {
  const isAdmin = theme === "admin";
  return (
    <div
      className={`rounded-xl p-3.5 transition-colors ${
        isAdmin
          ? "bg-slate-800/60 border border-white/5 hover:border-teal-500/20"
          : "bg-violet-50/80 border border-violet-100 hover:border-violet-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon
          size={13}
          className={isAdmin ? "text-teal-400" : "text-violet-500"}
        />
        <p
          className={`text-xs font-medium uppercase tracking-wide ${
            isAdmin ? "text-gray-500" : "text-violet-500"
          }`}
        >
          {label}
        </p>
      </div>
      <p
        className={`text-sm font-semibold break-words ${
          isAdmin ? "text-white" : "text-gray-900"
        }`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function ViewProductModal({
  isOpen,
  onClose,
  product,
  variant = "seller",
  onEdit,
  showEditButton = true,
}) {
  if (!isOpen || !product) return null;

  const p = normalizeProduct(product);
  const isAdmin = variant === "admin";
  const imageUrl = getImageUrl(p.image);

  const statusLabel =
    p.status === "approve_request"
      ? "Pending Approval"
      : p.status === "reject"
        ? "Rejected"
        : p.isActive
          ? "Active"
          : "Inactive";

  const statusColor =
    p.status === "approve_request"
      ? isAdmin
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        : "bg-amber-100 text-amber-700 border-amber-200"
      : p.status === "reject"
        ? isAdmin
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : "bg-red-100 text-red-700 border-red-200"
        : p.isActive
          ? isAdmin
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            : "bg-emerald-100 text-emerald-700 border-emerald-200"
          : isAdmin
            ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
            : "bg-red-100 text-red-700 border-red-200";

  const detailFields = [
    { icon: Tag, label: "Category", value: p.category },
    { icon: Package, label: "Brand", value: p.brand },
    { icon: Hash, label: "Article", value: p.article },
    { icon: Layers, label: "Size/Variant", value: p.size },
    { icon: Palette, label: "Color", value: p.color },
    { icon: Box, label: "Material", value: p.material },
    { icon: Package, label: "Packing Type", value: p.packingType },
    { icon: Box, label: "Pairs per CTN", value: p.pairsPerCTN },
    { icon: MapPin, label: "Origin", value: p.origin },
    { icon: User, label: "Gender", value: p.gender },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col ${
          isAdmin
            ? "bg-slate-900 border border-white/10"
            : "bg-white border border-violet-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isAdmin ? "border-white/10 bg-slate-900/95" : "border-violet-100 bg-white"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-2 rounded-xl ${
                isAdmin ? "bg-teal-500/20" : "bg-violet-100"
              }`}
            >
              <Package
                size={20}
                className={isAdmin ? "text-teal-400" : "text-violet-600"}
              />
            </div>
            <div className="min-w-0">
              <h2
                className={`text-lg font-bold truncate ${
                  isAdmin ? "text-white" : "text-gray-900"
                }`}
              >
                Product Details
              </h2>
              <p className={`text-xs ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>
                ID #{p.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isAdmin
                ? "text-gray-400 hover:text-white hover:bg-white/10"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Image panel */}
            <div
              className={`lg:col-span-2 p-6 flex flex-col items-center justify-center ${
                isAdmin
                  ? "bg-gradient-to-br from-slate-800 to-slate-900 border-b lg:border-b-0 lg:border-r border-white/10"
                  : "bg-gradient-to-br from-violet-50 to-purple-50 border-b lg:border-b-0 lg:border-r border-violet-100"
              }`}
            >
              <div
                className={`relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden shadow-lg ${
                  isAdmin ? "ring-1 ring-white/10" : "ring-1 ring-violet-200"
                }`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/400x400/f1f5f9/64748b?text=No+Image";
                    }}
                  />
                ) : (
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
                      isAdmin ? "bg-slate-800 text-gray-500" : "bg-violet-100 text-violet-400"
                    }`}
                  >
                    <Package size={48} />
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>

              {/* Price card */}
              <div
                className={`mt-5 w-full max-w-[280px] rounded-xl p-4 ${
                  isAdmin
                    ? "bg-slate-800/80 border border-white/10"
                    : "bg-white border border-violet-100 shadow-sm"
                }`}
              >
                {p.mrp && p.sellingPrice && p.mrp !== p.sellingPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-sm line-through ${
                        isAdmin ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      ₹{p.mrp}
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        isAdmin ? "text-emerald-400" : "text-teal-600"
                      }`}
                    >
                      ₹{p.sellingPrice}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <IndianRupee
                      size={18}
                      className={isAdmin ? "text-teal-400" : "text-teal-600"}
                    />
                    <span
                      className={`text-2xl font-bold ${
                        isAdmin ? "text-teal-400" : "text-teal-600"
                      }`}
                    >
                      {p.price}
                    </span>
                  </div>
                )}
                <p className={`text-xs mt-1 ${isAdmin ? "text-gray-500" : "text-gray-500"}`}>
                  Stock:{" "}
                  <span
                    className={
                      p.quantity === 0
                        ? "text-red-400 font-semibold"
                        : isAdmin
                          ? "text-white font-semibold"
                          : "text-gray-900 font-semibold"
                    }
                  >
                    {p.quantity} units
                  </span>
                </p>
              </div>
            </div>

            {/* Details panel */}
            <div className="lg:col-span-3 p-6">
              <div className="mb-5">
                <h3
                  className={`text-xl font-bold leading-snug ${
                    isAdmin ? "text-white" : "text-gray-900"
                  }`}
                >
                  {p.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusColor}`}
                  >
                    {statusLabel}
                  </span>
                  {p.commission != null && p.commission !== "" && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                        isAdmin
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-purple-100 text-purple-700 border-purple-200"
                      }`}
                    >
                      <BadgePercent size={12} />
                      {p.commission}% commission
                    </span>
                  )}
                  {p.orders != null && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                        isAdmin
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      <ShoppingBag size={12} />
                      {p.orders} orders
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor info (admin) */}
              {(p.ownerName || p.businessName) && (
                <div
                  className={`mb-5 rounded-xl p-4 ${
                    isAdmin
                      ? "bg-slate-800/60 border border-white/5"
                      : "bg-violet-50 border border-violet-100"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide mb-2 ${
                      isAdmin ? "text-gray-500" : "text-violet-500"
                    }`}
                  >
                    Vendor
                  </p>
                  <p className={`text-sm font-semibold ${isAdmin ? "text-white" : "text-gray-900"}`}>
                    {p.businessName || p.ownerName}
                  </p>
                  {p.businessName && p.ownerName && (
                    <p className={`text-xs mt-0.5 ${isAdmin ? "text-gray-400" : "text-gray-500"}`}>
                      {p.ownerName}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              {p.description && (
                <div
                  className={`mb-5 rounded-xl p-4 ${
                    isAdmin
                      ? "bg-slate-800/40 border border-white/5"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide mb-1.5 ${
                      isAdmin ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Description
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${
                      isAdmin ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {p.description}
                  </p>
                </div>
              )}

              {/* Detail grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {detailFields.map((field) => (
                  <DetailItem
                    key={field.label}
                    icon={field.icon}
                    label={field.label}
                    value={field.value}
                    theme={variant}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className={`flex gap-3 px-6 py-4 border-t shrink-0 ${
            isAdmin ? "border-white/10 bg-slate-900/95" : "border-violet-100 bg-white"
          }`}
        >
          {showEditButton && onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className={`flex-1 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                isAdmin
                  ? "bg-teal-500 hover:bg-teal-600 text-white"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
              }`}
            >
              <Pencil size={16} />
              Edit Product
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
              isAdmin
                ? "bg-slate-800 hover:bg-slate-700 text-gray-300 border border-white/10"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
