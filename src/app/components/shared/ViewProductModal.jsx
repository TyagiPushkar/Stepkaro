"use client";

import {
  X,
  Package,
  Loader2,
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
  Grid,
  ChevronDown,
  ChevronUp,
  Ruler,
  Scale,
  Ship,
  Info,
  Layers2,
} from "lucide-react";
import { useState } from "react";

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
    commissionType: product.commission_type || "percentage",
    ownerName: product.owner_name || null,
    businessName: product.business_name || null,
    orders: product.orders ?? null,
    variants: product.variants || [],
  };
}

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `https://namami-infotech.com/Stepkaro/${image}`;
}

function DetailCard({ icon: Icon, label, value, accent = "violet" }) {
  const accents = {
    violet: "text-violet-500 bg-violet-50 border-violet-100",
    emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    amber: "text-amber-500 bg-amber-50 border-amber-100",
    purple: "text-purple-500 bg-purple-50 border-purple-100",
  };
  const accentClass = accents[accent] || accents.violet;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`p-1.5 rounded-lg ${accentClass}`}>
          <Icon size={13} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-800 break-words">
        {value ?? "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const STATUS_STYLES = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-slate-100 text-slate-600 border-slate-200",
    approve_request: "bg-amber-100 text-amber-700 border-amber-200",
    reject: "bg-red-100 text-red-700 border-red-200",
  };

  const STATUS_LABELS = {
    active: "Active",
    inactive: "Inactive",
    approve_request: "Pending Approval",
    reject: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        STATUS_STYLES[status] || STATUS_STYLES.inactive
      }`}
    >
      {STATUS_LABELS[status] || status || "—"}
    </span>
  );
}

function VariantsTable({ variants }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!variants?.length) {
    return (
      <div className="text-sm text-gray-400 py-2">No variants available</div>
    );
  }

  const displayVariants = isExpanded ? variants : variants.slice(0, 3);
  const hasMore = variants.length > 3;

  const formatPrice = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return "—";
    return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Grid size={16} className="text-violet-500" />
          <h5 className="font-semibold text-sm text-gray-900">
            Variants ({variants.length})
          </h5>
        </div>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show All <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-violet-100">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-violet-50/60">
            <tr>
              {[
                "Image",
                "Size",
                "Color",
                "MRP",
                "Selling",
                "Stock",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-xs font-medium uppercase text-violet-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-50">
            {displayVariants.map((variant) => {
              const discount =
                variant.price &&
                variant.selling_price &&
                Number(variant.price) > Number(variant.selling_price)
                  ? Math.round(
                      ((Number(variant.price) - Number(variant.selling_price)) /
                        Number(variant.price)) *
                        100,
                    )
                  : null;

              return (
                <tr
                  key={variant.id}
                  className="hover:bg-violet-50/50 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div className="group relative w-8 h-8 rounded border border-gray-200 overflow-hidden flex-shrink-0 cursor-zoom-in">
                      <img
                        src={getImageUrl(variant.image) || "/placeholder.png"}
                        alt={variant.variant_size || "Variant"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/40x40/f1f5f9/64748b?text=N/A";
                        }}
                      />
                      <div className="hidden group-hover:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] pointer-events-none">
                        <img
                          src={getImageUrl(variant.image)}
                          alt="Variant"
                          className="w-[700px] max-h-[85vh] object-contain drop-shadow-2xl rounded-xl"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-900">
                    {variant.variant_size || variant.size || "-"}
                  </td>
                  <td className="px-3 py-2 text-gray-900">
                    {variant.color || "-"}
                  </td>
                  <td className="px-3 py-2 text-gray-400 line-through">
                    {formatPrice(variant.price)}
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <span className="font-semibold text-emerald-600">
                        {formatPrice(variant.selling_price)}
                      </span>
                      {discount && (
                        <span className="block text-[10px] text-red-500 font-medium">
                          {discount}% off
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`font-semibold ${
                        variant.stock === 0 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {variant.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={variant.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && !isExpanded && (
        <p className="text-xs mt-2 text-gray-400">
          Showing 3 of {variants.length} variants
        </p>
      )}
    </div>
  );
}

export default function ViewProductModal({
  isOpen,
  onClose,
  product,
  onEdit,
  showEditButton = true,
}) {
  if (!isOpen || !product) return null;

  const p = normalizeProduct(product);
  const imageUrl = getImageUrl(p.image);

  const formatPrice = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return "—";
    return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  };

  const discountPercent =
    p.mrp && p.sellingPrice && Number(p.mrp) > Number(p.sellingPrice)
      ? Math.round(
          ((Number(p.mrp) - Number(p.sellingPrice)) / Number(p.mrp)) * 100,
        )
      : null;

  const commissionDisplay =
    p.commissionType === "per_piece_rate"
      ? `${formatPrice(p.commission)}`
      : `${p.commission || 0}%`;

  const commissionSub =
    p.commissionType === "per_piece_rate" ? "Per piece rate" : "Percentage";

  const detailFields = [
    { icon: Tag, label: "Category", value: p.category, accent: "violet" },
    { icon: Package, label: "Brand", value: p.brand, accent: "violet" },
    { icon: Hash, label: "Article", value: p.article, accent: "violet" },
    { icon: Ruler, label: "Size/Variant", value: p.size, accent: "blue" },
    { icon: Palette, label: "Color", value: p.color, accent: "purple" },
    { icon: Layers, label: "Material", value: p.material, accent: "blue" },
    {
      icon: Box,
      label: "Packing Type",
      value: p.packingType,
      accent: "emerald",
    },
    {
      icon: Scale,
      label: "Pairs per CTN",
      value: p.pairsPerCTN,
      accent: "emerald",
    },
    { icon: Ship, label: "Origin", value: p.origin, accent: "amber" },
    { icon: User, label: "Gender", value: p.gender, accent: "violet" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[96vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Package size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {p.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Hash size={11} />
                Product ID {p.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={p.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          <div className="grid lg:grid-cols-5 gap-5">
            {/* Left — Image & pricing */}
            <div className="lg:col-span-2 space-y-4">
              <div className="group relative">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-full aspect-square object-cover cursor-zoom-in"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-square flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                      <Package size={48} />
                      <span className="text-sm mt-2">No image</span>
                    </div>
                  )}
                </div>

                {imageUrl && (
                  <div className="hidden group-hover:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] pointer-events-none">
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-[700px] max-h-[85vh] object-contain drop-shadow-2xl rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-emerald-700/70">
                    Selling Price
                  </p>
                  <p className="text-sm font-bold text-emerald-700">
                    {formatPrice(p.sellingPrice)}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-amber-700/70">
                    MRP
                  </p>
                  <p className="text-sm font-bold text-amber-700">
                    {formatPrice(p.mrp)}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-blue-700/70">
                    Stock
                  </p>
                  <p className="text-sm font-bold text-blue-700">
                    {p.quantity ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-purple-700/70">
                    Commission
                  </p>
                  <p className="text-sm font-bold text-purple-700">
                    {commissionDisplay}
                  </p>
                  <p className="text-[8px] opacity-60">{commissionSub}</p>
                </div>
              </div>

              {/* {discountPercent && (
                <div className="rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 px-3 py-1.5 text-center">
                  <span className="text-xs font-bold text-red-600">
                    {discountPercent}% OFF
                  </span>
                  <span className="text-[10px] text-red-400 ml-1.5">
                    Save {formatPrice(Number(p.mrp) - Number(p.sellingPrice))}
                  </span>
                </div>
              )} */}

              {/* <div className="flex flex-wrap gap-1.5">
                {p.brand && p.brand !== "—" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    <Package size={10} />
                    {p.brand}
                  </span>
                )}
                {p.category && p.category !== "—" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    <Box size={10} />
                    {p.category}
                  </span>
                )}
                {p.gender && p.gender !== "—" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    <User size={10} />
                    {p.gender}
                  </span>
                )}
              </div> */}
            </div>

            {/* Right — Details */}
            <div className="lg:col-span-3 space-y-3">
              {/* Display Name */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Display Name
                </p>
                <p className="text-sm font-medium text-gray-900 uppercase">
                  {p.name} | {p.size} | {p.color} | {p.packingType} |{" "}
                  {p.category}
                </p>
              </div>

              {/* Description */}
              {p.description && p.description !== "" && (
                <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                  <Info size={16} className="text-violet-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Specifications
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {detailFields.map((field) => (
                    <DetailCard
                      key={field.label}
                      icon={field.icon}
                      label={field.label}
                      value={field.value}
                      accent={field.accent}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          {p.variants && p.variants.length > 0 && (
            <VariantsTable variants={p.variants} />
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-slate-200 bg-white shrink-0">
          {showEditButton && onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="flex-1 py-2.5 rounded-xl font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Package size={16} />
              Edit Product
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
              showEditButton
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
