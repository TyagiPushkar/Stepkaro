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
  Info,
  IndianRupee,
  Hash,
  BadgePercent,
  Layers2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://namami-infotech.com/Stepkaro";

const normalizeImageUrl = (image) => {
  if (!image) return null;
  const trimmed = String(image).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/Stepkaro")) {
    return `https://namami-infotech.com${trimmed}`;
  }
  if (trimmed.startsWith("Stepkaro")) {
    return `https://namami-infotech.com/${trimmed}`;
  }
  return `${BASE_URL}/${trimmed.replace(/^\//, "")}`;
};

const formatPrice = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

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

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || STATUS_STYLES.inactive}`}
    >
      {STATUS_LABELS[status] || status || "—"}
    </span>
  );
}

function DetailCard({ icon: Icon, label, value, accent = "violet" }) {
  const accents = {
    violet: "text-violet-500 bg-violet-50 border-violet-100",
    emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100",
    amber: "text-amber-500 bg-amber-50 border-amber-100",
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

function StatCard({ label, value, sub, color }) {
  const colors = {
    emerald:
      "from-emerald-500/10 to-emerald-600/5 border-emerald-200 text-emerald-700",
    purple:
      "from-purple-500/10 to-purple-600/5 border-purple-200 text-purple-700",
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200 text-blue-700",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-200 text-amber-700",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 ${colors[color]}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="text-xl font-bold mt-1">{value}</p>
      {sub && <p className="text-[10px] mt-0.5 opacity-60">{sub}</p>}
    </div>
  );
}

function VariantsTable({ variants }) {
  return (
    <div className="rounded-2xl border border-blue-100 overflow-hidden bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers2 size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Product Variants</h3>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
          {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Image
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Size
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Color
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                MRP
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Selling
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Stock
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Packing
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Pairs/Ctn
              </th>
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {variants.map((v) => {
              const variantImg = normalizeImageUrl(v.image);
              const discount =
                v.price &&
                v.selling_price &&
                Number(v.price) > Number(v.selling_price)
                  ? Math.round(
                      ((Number(v.price) - Number(v.selling_price)) /
                        Number(v.price)) *
                        100,
                    )
                  : null;

              return (
                <tr
                  key={v.id}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="group relative w-10 h-10 rounded-lg overflow-hidden cursor-zoom-in">
                      <img
                        src={variantImg}
                        alt={v.variant_size || "Variant"}
                        className="w-full h-full object-cover"
                      />

                      <div className="hidden group-hover:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] pointer-events-none">
                        <img
                          src={variantImg}
                          alt="Variant"
                          className="w-[700px] max-h-[85vh] object-contain drop-shadow-2xl rounded-xl"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {v.variant_size || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{v.color || "—"}</td>
                  <td className="px-4 py-3 text-slate-400 line-through text-xs">
                    {formatPrice(v.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-semibold text-emerald-600">
                        {formatPrice(v.selling_price)}
                      </span>
                      {discount && (
                        <span className="block text-[10px] text-red-500 font-medium">
                          {discount}% off
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${v.stock === 0 ? "text-red-600" : "text-slate-800"}`}
                    >
                      {v.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {v.packing_type || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {v.pairs_per_ctn ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
        setProductData(null);

        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/src/product/get_admin_products_details.php?id=${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-violet-600" />
          <p className="text-sm text-slate-500 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Product Not Found
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {error || "Product details are not available."}
          </p>
          <button
            onClick={onClose}
            className="mt-5 px-5 py-2 text-sm bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const p = productData;
  const imageUrl =
    normalizeImageUrl(p.image) ||
    "https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image";

  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
  const discountPercent =
    p.price && p.selling_price && Number(p.price) > Number(p.selling_price)
      ? Math.round(
          ((Number(p.price) - Number(p.selling_price)) / Number(p.price)) * 100,
        )
      : null;

  const commissionDisplay =
    p.commission_type === "per_piece_rate"
      ? `${formatPrice(p.commission)}`
      : `${p.commission || 0}%`;

  const commissionSub =
    p.commission_type === "per_piece_rate" ? "Per piece rate" : "Percentage";

  const showVendor = variant === "admin" || variant === "seller";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
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
                {p.article_name}
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
              {/* <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt={p.article_name}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image";
                  }}
                />
              </div> */}
              <div className="group relative">
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={p.article_name}
                    className="w-full aspect-square object-cover cursor-zoom-in"
                  />
                </div>

                <div className="hidden group-hover:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] pointer-events-none">
                  <img
                    src={imageUrl}
                    alt={p.article_name}
                    className="w-[700px] max-h-[85vh] object-contain drop-shadow-2xl rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Selling Price"
                  value={formatPrice(p.selling_price)}
                  color="emerald"
                />
                <StatCard
                  label="MRP"
                  value={formatPrice(p.price)}
                  color="amber"
                />
                <StatCard
                  label="Stock"
                  value={p.stock_quantity ?? 0}
                  color="blue"
                />
                <StatCard
                  label="Commission"
                  value={commissionDisplay}
                  sub={commissionSub}
                  color="purple"
                />
              </div>

              {discountPercent && (
                <div className="rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 px-4 py-2.5 text-center">
                  <span className="text-sm font-bold text-red-600">
                    {discountPercent}% OFF
                  </span>
                  <span className="text-xs text-red-400 ml-2">
                    Save{" "}
                    {formatPrice(Number(p.price) - Number(p.selling_price))}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {p.brand_name && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full">
                    <Building2 size={12} />
                    {p.brand_name}
                  </span>
                )}
                {p.category_name && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full">
                    <Box size={12} />
                    {p.category_name}
                  </span>
                )}
                {p.gender && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full">
                    <User size={12} />
                    {p.gender}
                  </span>
                )}
              </div>
            </div>

            {/* Right — Details */}
            <div className="lg:col-span-3 space-y-2">
              {/* Description */}

              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Display Name
                </p>
                <p className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600 transition-colors uppercase">
                  {p.article_name} | {p.variant} | {p.color} | {p.packing_type}{" "}
                  | {p.category_name}
                </p>
              </div>

              {/* Vendor */}
              {showVendor && (
                <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <Store size={16} className="text-violet-600" />
                    <h3 className="text-sm font-bold text-slate-800">
                      Vendor Information
                    </h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailCard
                      icon={Building2}
                      label="Brand Name"
                      value={p.brand_name}
                      accent="violet"
                    />
                    <DetailCard
                      icon={Building2}
                      label="Business"
                      value={p.business_name}
                      accent="violet"
                    />
                    <DetailCard
                      icon={User}
                      label="Owner"
                      value={p.owner_name}
                      accent="violet"
                    />
                    <DetailCard
                      icon={Phone}
                      label="Phone"
                      value={p.phone}
                      accent="blue"
                    />
                    <DetailCard
                      icon={Mail}
                      label="Email"
                      value={p.email}
                      accent="blue"
                    />
                    {/* <div className="sm:col-span-2"> */}
                    <DetailCard
                      icon={Tag}
                      label="GST Number"
                      value={p.gst_number}
                      accent="amber"
                    />
                    {/* </div> */}
                  </div>
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
                  <DetailCard icon={Palette} label="size" value={p.variant} />
                  <DetailCard icon={Palette} label="Color" value={p.color} />
                  <DetailCard
                    icon={Package}
                    label="Packing Type"
                    value={p.packing_type}
                  />
                  <DetailCard
                    icon={Scale}
                    label="Pairs / CTN"
                    value={p.pairs_per_ctn}
                  />
                  <DetailCard
                    icon={Palette}
                    label="Category"
                    value={p.category_name}
                  />
                  <DetailCard
                    icon={Layers}
                    label="Upper Material"
                    value={p.upper_material}
                  />
                  <DetailCard
                    icon={Layers}
                    label="Sole Material"
                    value={p.material}
                  />
                  <DetailCard icon={Ship} label="Origin" value={p.origin} />
                  {!hasVariants && (p.variant || p.size) && (
                    <DetailCard
                      icon={Ruler}
                      label="Size / Variant"
                      value={p.variant || p.size}
                    />
                  )}
                  <DetailCard
                    icon={BadgePercent}
                    label="Commission Type"
                    value={
                      p.commission_type === "per_piece_rate"
                        ? "Per Piece Rate"
                        : "Percentage"
                    }
                  />
                  <DetailCard
                    icon={IndianRupee}
                    label="Commission"
                    value={commissionDisplay}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants — only when present */}
          {hasVariants && <VariantsTable variants={p.variants} />}
        </div>
      </div>
    </div>
  );
}
