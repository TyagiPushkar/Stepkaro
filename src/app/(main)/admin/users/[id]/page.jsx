"use client";
import { useState, useEffect } from "react";
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
  Truck,
  Store,
  Phone,
  Mail,
  Building,
} from "lucide-react";

const USER_API =
  "https://namami-infotech.com/Stepkaro/src/home/get_vendor_and_buyer.php";
const WALLET_API =
  "https://namami-infotech.com/Stepkaro/src/wallets/get_user_wallet_history.php";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

const getStatusBadge = (status) => {
  const classes = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    inactive: "bg-red-100 text-red-700",
  };
  return classes[status] || "bg-gray-100 text-gray-600";
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `https://namami-infotech.com/Stepkaro/${path}`;
};

const isFile = (value) => value instanceof File;

export default function BuyerDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params?.id;
  //console.log("userId was:", userId);
  const token = localStorage.getItem("access_token");
  const initialTab = searchParams?.get("tab");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buyer, setBuyer] = useState(null);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState(
    ["overview", "edit", "wallets"].includes(initialTab)
      ? initialTab
      : "overview",
  );
  const [toast, setToast] = useState(null);
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

  useEffect(() => {
    if (!userId) return;

    const fetchBuyer = async () => {
      setLoading(true);
      try {
        // 1. PHP API ke mutabik sahi query params bhejein (?type=buyer&id=YOUR_ID)
        const response = await fetch(
          `${USER_API}?type=buyer&id=${encodeURIComponent(userId)}`,
        );
        const result = await response.json();

        console.log("data was:", result);

        // 2. PHP ka response 'result.data.buyers' array ke roop me aayega
        if (
          result.success &&
          result.data &&
          result.data.buyers &&
          result.data.buyers.length > 0
        ) {
          const foundBuyer = result.data.buyers[0]; // Pehla buyer uthayein

          const normalizedBuyer = {
            id: foundBuyer.id,
            buyer_id: foundBuyer.buyer_id, // PHP script SQL me 'id' return kar rahi hai
            name: foundBuyer.name || "",
            phone: foundBuyer.phone || "",
            email: foundBuyer.email || "",
            image: getImageUrl(foundBuyer.image),
            shop_name: foundBuyer.shop_name || "",
            wallet_value: foundBuyer.wallet_value || 0,
            document_number: foundBuyer.document_number || "",
            document_image: getImageUrl(foundBuyer.document_image),
            state: foundBuyer.state || "",
            district: foundBuyer.district || "",
            address: foundBuyer.address || "",
            delivery_location: foundBuyer.delivery_location || "",
            logistic_partner_name: foundBuyer.logistic_partner_name || "",
            logistic_contact_no: foundBuyer.logistic_contact_no || "",
            status: foundBuyer.status || "pending",
            created_at: foundBuyer.created_at || "",
            type: "buyer",
            // Agar PHP array me koi extra brands ya fields hain toh wo yahan add ho sakti hain
          };

          setBuyer(normalizedBuyer);
          setEditData({ ...normalizedBuyer });
        } else {
          throw new Error("Buyer not found in response");
        }
      } catch (error) {
        console.error(error);
        showToast("Unable to load buyer details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyer();
  }, [userId]);

  useEffect(() => {
    if (!buyer?.buyer_id) return;

    const fetchWalletHistory = async () => {
      setWalletLoading(true);
      try {
        console.log("buyer.buyer_id was:", buyer.buyer_id);
        const url = `${WALLET_API}?user_id=${encodeURIComponent(buyer.buyer_id)}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const history = Array.isArray(data?.data) ? data.data : [];
        console.log("history was:", history);
        const normalized = history.map((item) => ({
          id: item.id || "-",
          type: item.type?.toLowerCase().includes("debit") ? "debit" : "credit",
          amount: Number(item.amount || 0),
          wallet_before: Number(item.wallet_before || 0),
          wallet_after: Number(item.wallet_after || 0),
          note: item.description || "-",
          date: item.created_at || "-",
        }));

        setWalletHistory(normalized);

        let totalCredit = 0,
          totalDebit = 0;
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
  }, [buyer]);

  const handleUpdate = async () => {
    if (!buyer) return;
    setSaving(true);

    try {
      const endpoint =
        "https://namami-infotech.com/Stepkaro/src/buyer/update_buyer_details.php";
      const token = localStorage.getItem("access_token");
      const headers = {};

      let body;

      // Handle file upload
      if (isFile(editData.document_image)) {
        const formData = new FormData();
        const fields = {
          id: buyer.id,
          buyer_id: buyer.buyer_id,
          name: editData.name,
          phone: editData.phone,
          email: editData.email,
          shop_name: editData.shop_name,
          //  wallet_value: editData.wallet_value,
          wallet_value: buyer.wallet_value,
          document_number: editData.document_number,
          state: editData.state,
          district: editData.district,
          address: editData.address,
          delivery_location: editData.delivery_location,
          logistic_partner_name: editData.logistic_partner_name,
          logistic_contact_no: editData.logistic_contact_no,
          status: editData.status,
        };

        Object.entries(fields).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
          }
        });
        formData.append("document_image", editData.document_image);
        body = formData;
      } else {
        body = {
          id: buyer.id,
          buyer_id: buyer.buyer_id,
          name: editData.name,
          phone: editData.phone,
          email: editData.email,
          shop_name: editData.shop_name,
          wallet_value: editData.wallet_value,
          document_number: editData.document_number,
          state: editData.state,
          district: editData.district,
          address: editData.address,
          delivery_location: editData.delivery_location,
          logistic_partner_name: editData.logistic_partner_name,
          logistic_contact_no: editData.logistic_contact_no,
          status: editData.status,
        };

        Object.keys(body).forEach((key) => {
          if (
            body[key] === undefined ||
            body[key] === null ||
            body[key] === ""
          ) {
            delete body[key];
          }
        });

        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (result.success) {
        showToast(result.message || "Buyer updated successfully");

        // Update buyer state with new data
        setBuyer((prev) => ({
          ...prev,
          ...editData,
          document_image: isFile(editData.document_image)
            ? URL.createObjectURL(editData.document_image)
            : editData.document_image,
        }));
      } else {
        showToast(result.message || "Failed to update buyer", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Unable to save changes: " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prev) => ({ ...prev, document_image: file }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading buyer details...</p>
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-gray-900">Buyer not found</p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl text-white shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Details</h1>
          <p className="text-sm text-gray-500">
            View and manage buyer information
          </p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                {buyer.image ? (
                  <img
                    src={buyer.image}
                    alt={buyer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-100"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {buyer.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">{buyer.email}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-sm text-gray-500">{buyer.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  Buyer
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    buyer.status,
                  )}`}
                >
                  {buyer.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">User ID</p>
                <p className="text-sm font-semibold text-gray-900">
                  #{buyer.id}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-sm font-semibold text-purple-600">
                  {formatCurrency(buyer.wallet_value)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-semibold text-gray-900">
                  {buyer.created_at?.split(" ")[0] || "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Transactions</p>
                <p className="text-sm font-semibold text-gray-900">
                  {walletHistory.length}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-2">
            <div className="flex gap-1">
              {[
                { key: "overview", label: "Overview", icon: User },
                { key: "edit", label: "Edit", icon: CheckCircle },
                { key: "wallets", label: "Wallet History", icon: Wallet },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      activeTab === tab.key
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <User size={16} className="text-purple-600" />
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoCard label="Full Name" value={buyer.name} />
                  <InfoCard label="Email" value={buyer.email} />
                  <InfoCard label="Phone" value={buyer.phone} />
                  <InfoCard
                    label="Status"
                    value={
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          buyer.status,
                        )}`}
                      >
                        {buyer.status}
                      </span>
                    }
                  />
                </div>
              </div>

              {/* Address */}
              {(buyer.address || buyer.state || buyer.district) && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={14} className="text-purple-600" /> Address
                  </p>
                  <p className="mt-2 text-sm text-gray-900">
                    {buyer.address || "No address provided"}
                  </p>
                  {(buyer.state || buyer.district) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {[buyer.district, buyer.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Shop & Logistics */}
              <div className="grid sm:grid-cols-2 gap-4">
                {buyer.shop_name && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Store size={14} className="text-purple-600" /> Shop Name
                    </p>
                    <p className="mt-2 text-sm text-gray-900">
                      {buyer.shop_name}
                    </p>
                  </div>
                )}

                {buyer.delivery_location && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={14} className="text-purple-600" /> Delivery
                      Location
                    </p>
                    <p className="mt-2 text-sm text-gray-900">
                      {buyer.delivery_location}
                    </p>
                  </div>
                )}
              </div>

              {/* Logistics */}
              {(buyer.logistic_partner_name || buyer.logistic_contact_no) && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Truck size={14} className="text-purple-600" /> Logistics
                  </p>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {buyer.logistic_partner_name && (
                      <div>
                        <p className="text-xs text-gray-400">Partner</p>
                        <p className="text-sm text-gray-900">
                          {buyer.logistic_partner_name}
                        </p>
                      </div>
                    )}
                    {buyer.logistic_contact_no && (
                      <div>
                        <p className="text-xs text-gray-400">Contact</p>
                        <p className="text-sm text-gray-900">
                          {buyer.logistic_contact_no}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Document */}
              {(buyer.document_number || buyer.document_image) && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Download size={14} className="text-purple-600" /> Document
                  </p>
                  <div className="mt-3 space-y-3">
                    {buyer.document_number && (
                      <div>
                        <p className="text-xs text-gray-400">Document Number</p>
                        <p className="text-sm text-gray-900">
                          {buyer.document_number}
                        </p>
                      </div>
                    )}
                    {buyer.document_image && (
                      <div className="flex items-center gap-3">
                        <img
                          src={buyer.document_image || "/placeholder.png"}
                          alt="Document"
                          className="w-16 h-16 rounded-lg border object-cover"
                          onError={(e) => {
                            if (e.target.src.includes("placeholder.png"))
                              return;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                        <a
                          href={buyer.document_image}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-200 transition"
                        >
                          <Download size={16} /> View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "edit" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Buyer Information
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Update buyer details. All fields except brand are editable.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <EditField
                  label="Full Name *"
                  value={editData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
                <EditField
                  label="Email *"
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
                {/* <EditField
                  label="Phone *"
                  value={editData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                /> */}
                <EditField
                  label="Status"
                  type="select"
                  value={editData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "pending", label: "Pending" },
                  ]}
                />
                <EditField
                  label="Shop Name"
                  value={editData.shop_name}
                  onChange={(e) =>
                    handleInputChange("shop_name", e.target.value)
                  }
                />
                {/* <EditField
                  label="Wallet Value"
                  type="number"
                  value={editData.wallet_value}
                  onChange={(e) => handleInputChange("wallet_value", e.target.value)}
                /> */}
                <div className="sm:col-span-2">
                  <EditField
                    label="Address"
                    value={editData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
                <EditField
                  label="State"
                  value={editData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
                <EditField
                  label="District"
                  value={editData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                />
                <EditField
                  label="Delivery Location"
                  value={editData.delivery_location}
                  onChange={(e) =>
                    handleInputChange("delivery_location", e.target.value)
                  }
                />
                <EditField
                  label="Logistic Partner Name"
                  value={editData.logistic_partner_name}
                  onChange={(e) =>
                    handleInputChange("logistic_partner_name", e.target.value)
                  }
                />
                <EditField
                  label="Logistic Contact No"
                  value={editData.logistic_contact_no}
                  onChange={(e) =>
                    handleInputChange("logistic_contact_no", e.target.value)
                  }
                />
                <div className="sm:col-span-2">
                  <EditField
                    label="Document Number"
                    value={editData.document_number}
                    onChange={(e) =>
                      handleInputChange("document_number", e.target.value)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Document Image
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-700"
                  />
                  {isFile(editData.document_image) ? (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {editData.document_image.name}
                    </p>
                  ) : (
                    editData.document_image && (
                      <div className="mt-3">
                        <a
                          href={editData.document_image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-purple-600 hover:underline"
                        >
                          View current document
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Update Buyer
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "wallets" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wallet History
              </h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard
                  label="Total Credit"
                  value={formatCurrency(walletStats.totalCredit)}
                  color="green"
                />
                <StatCard
                  label="Total Debit"
                  value={formatCurrency(walletStats.totalDebit)}
                  color="red"
                />
                <StatCard
                  label="Transactions"
                  value={walletStats.transactionCount}
                  color="purple"
                />
              </div>

              {walletLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-purple-600" />
                </div>
              ) : walletHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Wallet size={48} className="mx-auto mb-3 text-gray-300" />
                  No wallet history found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Type</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                          <th className="px-4 py-3 text-left">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {walletHistory.map((entry) => (
                          <tr
                            key={entry.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-600">
                              {entry.date}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    entry.type === "credit"
                                      ? "bg-green-100"
                                      : "bg-red-100"
                                  }`}
                                >
                                  {entry.type === "credit" ? (
                                    <svg
                                      className="w-4 h-4 text-green-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 15l7-7 7 7"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-red-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={`text-sm font-medium ${
                                    entry.type === "credit"
                                      ? "text-green-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {entry.type === "credit"
                                    ? "Credited"
                                    : "Debited"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`font-semibold ${
                                  entry.type === "credit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {entry.type === "credit" ? "+" : "-"}
                                {formatCurrency(entry.amount)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                              {entry.note || entry.description || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User size={16} className="text-purple-600" />
              Quick Info
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <SidebarItem label="User ID" value={`#${buyer.id}`} />
              <SidebarItem label="Role" value="Buyer" />
              <SidebarItem
                label="Status"
                value={
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                      buyer.status,
                    )}`}
                  >
                    {buyer.status}
                  </span>
                }
              />
              {buyer.shop_name && (
                <SidebarItem label="Shop" value={buyer.shop_name} />
              )}
              {buyer.address && (
                <SidebarItem label="Address" value={buyer.address} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Wallet size={16} className="text-purple-600" />
              Wallet Summary
            </h3>
            <div className="mt-4">
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-xs text-purple-500">Current Balance</p>
                <p className="text-xl font-bold text-purple-700">
                  {formatCurrency(buyer.wallet_value)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                  <p className="text-xs text-green-500">Credit</p>
                  <p className="text-sm font-semibold text-green-700">
                    {formatCurrency(walletStats.totalCredit)}
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                  <p className="text-xs text-red-500">Debit</p>
                  <p className="text-sm font-semibold text-red-700">
                    {formatCurrency(walletStats.totalDebit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <div className="mt-1">
      {typeof value === "string" ? (
        <p className="text-sm text-gray-900">{value}</p>
      ) : (
        value
      )}
    </div>
  </div>
);

const EditField = ({
  label,
  type = "text",
  value,
  onChange,
  options,
  required,
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2">
      {label} {required && "*"}
    </label>
    {type === "select" ? (
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    )}
  </div>
);

const StatCard = ({ label, value, color }) => {
  const colors = {
    green: "bg-green-50 border-green-100 text-green-600",
    red: "bg-red-50 border-red-100 text-red-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };
  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <p className="text-xs">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
};

const SidebarItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <div className="mt-1 text-sm text-gray-900">{value}</div>
  </div>
);
