"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Wallet,
  User,
  MapPin,
  Download,
  Store,
  Package,
  Truck,
} from "lucide-react";

const USER_API =
  "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php";
const WALLET_API =
  "https://namami-infotech.com/Stepkaro/src/wallets/get_user_wallet_history.php";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

const getBadgeClasses = (status) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "inactive") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
};

const normalizeUser = (item, type) => {
  if (type === "buyer") {
    return {
      ...item,
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: "buyer",
      type: "buyer",
      avatar: "👤",
      wallet_value: item.wallet_value || 0,
      business_name: "",
      brand_name: item.brand_name || "",
      gst_number: "",
      pan_number: "",
      city: item.city || "",
      state: item.state || "",
      country: item.country || "",
      pincode: item.pincode || "",
      address: item.address || "",
      district: item.district || "",
      delivery_location: item.delivery_location || "",
      logistic_partner_name: item.logistic_partner_name || "",
      logistic_contact_no: item.logistic_contact_no || "",
      document_number: item.document_number || "",
      document_image: item.document_image
        ? `https://namami-infotech.com/Stepkaro/${item.document_image}`
        : "",
      status: item.status || "pending",
      createdAt: item.created_at || "",
      rawData: item,
    };
  }
  return {
    ...item,
    id: item.id,
    name: item.owner_name || item.name || "",
    email: item.email,
    phone: item.phone,
    role: "seller",
    type: "vendor",
    avatar: "🏪",
    wallet_value: item.wallet_value || 0,
    business_name: item.business_name || "",
    brand_name: item.brand_name || "",
    gst_number: item.gst_number || "",
    pan_number: item.pan_number || "",
    city: item.city || "",
    state: item.state || "",
    country: item.country || "",
    pincode: item.pincode || "",
    address: item.address || "",
    status: item.status || "pending",
    createdAt: item.created_at || "",
    rawData: item,
  };
};

const normalizeWalletItem = (item) => {
  const rawType = (item.type || item.transaction_type || item.action || "")
    .toString()
    .toLowerCase();
  const type = rawType.includes("debit")
    ? "debit"
    : rawType.includes("credit")
      ? "credit"
      : rawType || "credit";
  return {
    id: item.id || item.transaction_id || "-",
    type,
    amount: Number(item.amount || item.transaction_amount || item.amount || 0),
    wallet_before: Number(item.wallet_before || item.balance_before || 0),
    wallet_after: Number(
      item.wallet_after || item.balance_after || item.current_balance || 0,
    ),
    note: item.note || item.description || item.remarks || "-",
    date: item.created_at || item.transaction_date || item.date || "-",
    raw: item,
  };
};

const isFile = (value) => value instanceof File;

export default function UserDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params?.id;
  const initialTab = searchParams?.get("tab");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(
    ["overview", "edit", "wallets"].includes(initialTab) ? initialTab : "overview",
  );

  const [toast, setToast] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [walletHistory, setWalletHistory] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletStats, setWalletStats] = useState({
    totalCredit: 0,
    totalDebit: 0,
    transactionCount: 0,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getAuthHeaders = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        // const response = await fetch(USER_API, {
        //   headers: {
        //     ...getAuthHeaders(),
        //   },
        // });
        const response = await fetch(USER_API);
        const data = await response.json();
        const buyers = Array.isArray(data?.data?.buyers)
          ? data.data.buyers
          : [];
        const vendors = Array.isArray(data?.data?.vendors)
          ? data.data.vendors
          : [];
        const foundBuyer = buyers.find(
          (item) => String(item.id) === String(userId),
        );
        const foundVendor = vendors.find(
          (item) => String(item.id) === String(userId),
        );
        let fetchedUser = null;
        if (foundBuyer) fetchedUser = normalizeUser(foundBuyer, "buyer");
        if (foundVendor) fetchedUser = normalizeUser(foundVendor, "vendor");
        if (!fetchedUser) {
          showToast("User not found.", "error");
          setUser(null);
          return;
        }
        setUser(fetchedUser);
        setEditData({
          name: fetchedUser.name || "",
          email: fetchedUser.email || "",
          phone: fetchedUser.phone || "",
          status: fetchedUser.status || "pending",
          wallet_value: fetchedUser.wallet_value || "",
          address: fetchedUser.address || "",
          state: fetchedUser.state || "",
          district: fetchedUser.district || "",
          delivery_location: fetchedUser.delivery_location || "",
          logistic_partner_name: fetchedUser.logistic_partner_name || "",
          logistic_contact_no: fetchedUser.logistic_contact_no || "",
          document_number: fetchedUser.document_number || "",
          document_image: fetchedUser.document_image || "",
          business_name: fetchedUser.business_name || "",
          brand_name: fetchedUser.brand_name || "",
          gst_number: fetchedUser.gst_number || "",
          pan_number: fetchedUser.pan_number || "",
          city: fetchedUser.city || "",
          country: fetchedUser.country || "",
          pincode: fetchedUser.pincode || "",
        });
      } catch (error) {
        console.error(error);
        showToast("Unable to load user details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchWalletHistory = async () => {
      setWalletLoading(true);
      try {
        console.log("user id ", user.buyer_id);
        const url = `${WALLET_API}?user_id=${encodeURIComponent(user.buyer_id)}`;
        console.log(url);

        const res = await fetch(url, {
          headers: {
            ...getAuthHeaders(),
          },
        });
        const data = await res.json();
        console.log("wallet history data ", data);
        const history = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        const normalized = history.map(normalizeWalletItem);
        setWalletHistory(normalized);
        
        // Calculate stats
        let totalCredit = 0;
        let totalDebit = 0;
        normalized.forEach((item) => {
          if (item.type === "credit") totalCredit += item.amount;
          else if (item.type === "debit") totalDebit += item.amount;
        });
        setWalletStats({
          totalCredit,
          totalDebit,
          transactionCount: normalized.length,
        });
      } catch (error) {
        console.error(error);
        setWalletHistory([]);
      } finally {
        setWalletLoading(false);
      }
    };
    fetchWalletHistory();
  }, [user]);

  const handleEditSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      let endpoint = "";
      let body;
      let headers = {};

      if (user.type === "buyer") {
        endpoint =
          "https://namami-infotech.com/Stepkaro/src/buyer/edit_buyer.php";
      } else {
        endpoint =
          "https://namami-infotech.com/Stepkaro/src/vender/edit_vendor.php";
      }

      if (isFile(editData.document_image)) {
        body = new FormData();
        body.append("id", String(user.id));
        body.append("name", editData.name || "");
        body.append("email", editData.email || "");
        body.append("phone", editData.phone || "");
        body.append("status", editData.status || "");
        body.append("address", editData.address || "");
        body.append("state", editData.state || "");
        body.append("district", editData.district || "");
        body.append("delivery_location", editData.delivery_location || "");
        body.append(
          "logistic_partner_name",
          editData.logistic_partner_name || "",
        );
        body.append("logistic_contact_no", editData.logistic_contact_no || "");
        body.append("document_number", editData.document_number || "");
        body.append("document_image", editData.document_image);
        if (editData.wallet_value !== "" && editData.wallet_value !== null) {
          body.append("wallet_value", String(editData.wallet_value));
        }
        if (user.type === "buyer") {
          body.append("buyer_id", String(user.id));
        }
        if (user.type !== "buyer") {
          body.append("business_name", editData.business_name || "");
          body.append("gst_number", editData.gst_number || "");
          body.append("pan_number", editData.pan_number || "");
          body.append("city", editData.city || "");
          body.append("country", editData.country || "");
          body.append("pincode", editData.pincode || "");
        }
      } else {
        body = {
          id: Number(user.id),
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
          status: editData.status,
          address: editData.address,
          state: editData.state,
          district: editData.district,
          delivery_location: editData.delivery_location,
          logistic_partner_name: editData.logistic_partner_name,
          logistic_contact_no: editData.logistic_contact_no,
          document_number: editData.document_number,
          document_image: editData.document_image,
        };
        if (editData.wallet_value !== "" && editData.wallet_value !== null) {
          body.wallet_value = Number(editData.wallet_value);
        }
        if (user.type === "buyer") {
          body.buyer_id = user.id;
        }
        if (user.type !== "buyer") {
          body.business_name = editData.business_name;
          body.gst_number = editData.gst_number;
          body.pan_number = editData.pan_number;
          body.city = editData.city;
          body.country = editData.country;
          body.pincode = editData.pincode;
        }
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: isFile(editData.document_image) ? body : JSON.stringify(body),
      });
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        console.error("parse error", text);
        throw new Error("Invalid server response");
      }
      if (result.success) {
        showToast(result.message || "User updated successfully");
        const rawDocumentImage =
          result.data?.document_image ||
          (isFile(editData.document_image)
            ? user.document_image
            : editData.document_image);
        const documentImageUrl = rawDocumentImage
          ? String(rawDocumentImage).startsWith("http")
            ? String(rawDocumentImage)
            : `https://namami-infotech.com/Stepkaro/${String(rawDocumentImage)}`
          : "";
        setUser({
          ...user,
          ...editData,
          wallet_value: editData.wallet_value,
          document_image: documentImageUrl,
        });
        if (isFile(editData.document_image)) {
          setEditData((prev) => ({
            ...prev,
            document_image: documentImageUrl,
          }));
        }
      } else {
        showToast(result.message || "Failed to update user", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Unable to save user details", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-violet-600" />
          <p className="text-sm text-slate-600">Loading user profile…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-gray-900">User not found</p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 rounded-xl px-4 py-3 text-white shadow-lg ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage buyer or seller details and wallet history
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center gap-2 rounded-xl text-sm font-medium text-violet-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          {/* User Profile Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-100 to-orange-100 text-3xl">
                  {user.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-sm text-gray-500">{user.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${
                  user.role === "seller" 
                    ? "bg-blue-50 text-blue-700" 
                    : "bg-green-50 text-green-700"
                }`}>
                  {user.role === "seller" ? "Seller" : "Buyer"}
                </span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(user.status)}`}
                >
                  {user.status || "Unknown"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">User ID</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">#{user.id}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="mt-1 text-lg font-semibold text-purple-600">
                  {formatCurrency(user.wallet_value)}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {user.createdAt?.split(" ")[0] || "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Transactions</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {walletHistory.length}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="flex flex-wrap gap-2">
              {[
                { key: "overview", label: "Overview", icon: User },
                { key: "edit", label: "Edit", icon: CheckCircle },
                { key: "wallets", label: "Wallet History", icon: Wallet },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.key
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User size={16} className="text-purple-600" />
                  Contact Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{user.name || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{user.email || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{user.phone || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(user.status)}`}>
                      {user.status || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(user.address || user.city || user.state) && (
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={14} className="text-purple-600" /> Address
                  </p>
                  <p className="mt-2 text-sm text-gray-900">
                    {user.address || "No address provided."}
                  </p>
                  {(user.city || user.state || user.country || user.pincode) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {[user.city, user.state, user.country, user.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Buyer Specific Details */}
              {user.role === "buyer" && (
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Package size={14} className="text-purple-600" /> Buyer Details
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {user.district && (
                      <div>
                        <p className="text-xs text-gray-400">District</p>
                        <p className="mt-1 text-sm text-gray-900">{user.district}</p>
                      </div>
                    )}
                    {user.delivery_location && (
                      <div>
                        <p className="text-xs text-gray-400">Delivery Location</p>
                        <p className="mt-1 text-sm text-gray-900">{user.delivery_location}</p>
                      </div>
                    )}
                    {user.document_number && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">Document Number</p>
                        <p className="mt-1 text-sm text-gray-900">{user.document_number}</p>
                      </div>
                    )}
                    {user.document_image && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400 mb-2">Document</p>
                        <div className="flex items-center gap-3">
                          <img
                            src={user.document_image}
                            alt="Document"
                            className="w-20 h-20 rounded-xl border object-cover"
                            onError={(e) => e.target.src = "/placeholder.png"}
                          />
                          <a
                            href={user.document_image}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 transition"
                          >
                            <Download size={16} /> View Document
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  {(user.logistic_partner_name || user.logistic_contact_no) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Truck size={14} className="text-purple-600" /> Logistics
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {user.logistic_partner_name && (
                          <div>
                            <p className="text-xs text-gray-400">Partner</p>
                            <p className="text-sm text-gray-900">{user.logistic_partner_name}</p>
                          </div>
                        )}
                        {user.logistic_contact_no && (
                          <div>
                            <p className="text-xs text-gray-400">Contact</p>
                            <p className="text-sm text-gray-900">{user.logistic_contact_no}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Seller Specific Details */}
              {user.role === "seller" && (
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Store size={14} className="text-purple-600" /> Seller Details
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {user.business_name && (
                      <>
                        <div>
                          <p className="text-xs text-gray-400">Business Name</p>
                          <p className="mt-1 text-sm text-gray-900">{user.business_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Brand</p>
                          <p className="mt-1 text-sm text-gray-900">{user.brand_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">GST Number</p>
                          <p className="mt-1 text-sm font-mono text-gray-900">{user.gst_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">PAN Number</p>
                          <p className="mt-1 text-sm font-mono text-gray-900">{user.pan_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">City</p>
                          <p className="mt-1 text-sm text-gray-900">{user.city}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Country</p>
                          <p className="mt-1 text-sm text-gray-900">{user.country}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Pincode</p>
                          <p className="mt-1 text-sm text-gray-900">{user.pincode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">State</p>
                          <p className="mt-1 text-sm text-gray-900">{user.state}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "edit" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name *</label>
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Wallet Value</label>
                  <input
                    type="number"
                    value={editData.wallet_value}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        wallet_value: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <input
                    value={editData.address}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    value={editData.state}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">District</label>
                  <input
                    value={editData.district}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Delivery Location</label>
                  <input
                    value={editData.delivery_location}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        delivery_location: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Logistics Contact</label>
                  <input
                    value={editData.logistic_contact_no}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        logistic_contact_no: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Document Number</label>
                  <input
                    value={editData.document_number}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        document_number: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Document Image URL</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        document_image:
                          e.target.files[0] || prev.document_image,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white hover:file:bg-purple-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  {isFile(editData.document_image) ? (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected file: {editData.document_image.name}
                    </p>
                  ) : editData.document_image ? (
                    <div className="mt-3 flex flex-col gap-2">
                      <a
                        href={editData.document_image}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-purple-700 hover:underline"
                      >
                        View current document
                      </a>
                    </div>
                  ) : null}
                </div>
                {user.type === "vendor" && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Business Name</label>
                      <input
                        value={editData.business_name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            business_name: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Brand Name</label>
                      <input
                        value={editData.brand_name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            brand_name: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">GST Number</label>
                      <input
                        value={editData.gst_number}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            gst_number: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">PAN Number</label>
                      <input
                        value={editData.pan_number}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            pan_number: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <input
                        value={editData.city}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Country</label>
                      <input
                        value={editData.country}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pincode</label>
                      <input
                        value={editData.pincode}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            pincode: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Update User
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "wallets" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet History</h3>
              <p className="text-sm text-gray-500 mb-4">
                Transaction history for this user
              </p>

              {/* Wallet Stats */}
              <div className="grid gap-3 sm:grid-cols-3 mb-6">
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-600">Total Credit</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-700">
                    {formatCurrency(walletStats.totalCredit)}
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                  <p className="text-xs text-red-600">Total Debit</p>
                  <p className="mt-1 text-lg font-semibold text-red-700">
                    {formatCurrency(walletStats.totalDebit)}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4 border border-purple-100">
                  <p className="text-xs text-purple-600">Transactions</p>
                  <p className="mt-1 text-lg font-semibold text-purple-700">
                    {walletStats.transactionCount}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                {walletLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin text-purple-600" />
                  </div>
                ) : walletHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Wallet size={48} className="mx-auto mb-3 text-gray-300" />
                    No wallet history found for this user yet.
                  </div>
                ) : (
                  <table className="min-w-full text-left text-sm text-gray-600">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Before</th>
                        <th className="px-4 py-3">After</th>
                        <th className="px-4 py-3">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {walletHistory.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm">{entry.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              entry.type === "credit" 
                                ? "bg-emerald-100 text-emerald-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(entry.amount)}
                          </td>
                          <td className="px-4 py-3">{formatCurrency(entry.wallet_before)}</td>
                          <td className="px-4 py-3">{formatCurrency(entry.wallet_after)}</td>
                          <td className="px-4 py-3 max-w-xs truncate">{entry.note}</td>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orderHistory.map((order, index) => (
                          <tr key={`${order.order_id || order.id || index}`}>
                            <td className="px-4 py-3">
                              {order.order_id || order.id || "—"}
                            </td>
                            <td className="px-4 py-3">{order.status || "—"}</td>
                            <td className="px-4 py-3">
                              {order.buyer_name ||
                                order.customer_name ||
                                order.user_name ||
                                "—"}
                            </td>
                            <td className="px-4 py-3">
                              {order.seller_name || order.vendor_name || "—"}
                            </td>
                            <td className="px-4 py-3">
                              {order.total_amount
                                ? formatCurrency(order.total_amount)
                                : order.amount
                                  ? formatCurrency(order.amount)
                                  : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {order.created_at || order.order_date || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-purple-600" />
              Quick Profile
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="mt-1 font-semibold text-gray-900">#{user.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(user.status)}`}>
                  {user.status || "Unknown"}
                </span>
              </div>
              {user.address && (
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="mt-1 text-gray-900">{user.address}</p>
                </div>
              )}
              {user.delivery_location && (
                <div>
                  <p className="text-xs text-gray-500">Delivery Location</p>
                  <p className="mt-1 text-gray-900">{user.delivery_location}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Wallet size={16} className="text-purple-600" />
              Wallet Summary
            </h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                <p className="text-xs text-purple-500">Current Balance</p>
                <p className="mt-1 text-xl font-bold text-purple-700">
                  {formatCurrency(user.wallet_value)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-100 text-center">
                  <p className="text-xs text-emerald-500">Credit</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    {formatCurrency(walletStats.totalCredit)}
                  </p>
                </div>
                <div className="rounded-2xl bg-red-50 p-3 border border-red-100 text-center">
                  <p className="text-xs text-red-500">Debit</p>
                  <p className="mt-1 text-sm font-semibold text-red-700">
                    {formatCurrency(walletStats.totalDebit)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {user.logistic_partner_name && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Truck size={16} className="text-purple-600" />
                Logistics
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Partner</p>
                  <p className="mt-1 text-gray-900">{user.logistic_partner_name}</p>
                </div>
                {user.logistic_contact_no && (
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="mt-1 text-gray-900">{user.logistic_contact_no}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
