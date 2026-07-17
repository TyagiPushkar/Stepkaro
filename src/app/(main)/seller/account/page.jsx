"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Edit,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Banknote,
  X,
  Plus,
  Save,
  Phone,
  Image as ImageIcon,
  Ticket,
  Send,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Bank Details State
  const [bankDetails, setBankDetails] = useState(null);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankEditMode, setBankEditMode] = useState(false);
  const [bankToast, setBankToast] = useState(null);
  const [bankForm, setBankForm] = useState({
    acc_holder_name: "",
    account_number: "",
    ifsc: "",
    bank_name: "",
  });

  // Tickets State
  const [tickets, setTickets] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
  });
  const [ticketSaving, setTicketSaving] = useState(false);

  const showBankToast = (message, type = "success") => {
    setBankToast({ message, type });
    setTimeout(() => setBankToast(null), 3000);
  };

  // Image URL handler
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("uploads/")) {
      return `https://namami-infotech.com/Stepkaro/${imagePath}`;
    }
    return `https://namami-infotech.com/Stepkaro/${imagePath}`;
  };

  useEffect(() => {
    fetchVendor();
    fetchBankDetails();
    fetchTickets();
  }, []);

  const fetchVendor = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Login required");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/vender/get_vender.php",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.success) {
        setVendor(result.data);
      } else {
        if (result.message?.includes("token") || response.status === 401) {
          localStorage.removeItem("access_token");
          setError("Session expired. Please login again.");
        } else {
          setError(result.message || "Failed to fetch profile");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/bank/get_bank_details.php",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      if (result.success && result.data) {
        setBankDetails(result.data);
      } else {
        setBankDetails(null);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/support/get_support_tickets.php",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setTickets(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const openBankEdit = () => {
    if (bankDetails) {
      setBankForm({
        acc_holder_name: bankDetails.acc_holder_name || "",
        account_number: bankDetails.account_number || "",
        ifsc: bankDetails.ifsc || "",
        bank_name: bankDetails.bank_name || "",
      });
    } else {
      setBankForm({ acc_holder_name: "", account_number: "", ifsc: "", bank_name: "" });
    }
    setBankEditMode(true);
  };

  const handleSaveBankDetails = async () => {
    if (
      !bankForm.acc_holder_name.trim() ||
      !bankForm.account_number.trim() ||
      !bankForm.ifsc.trim() ||
      !bankForm.bank_name.trim()
    ) {
      showBankToast("Please fill all bank detail fields.", "error");
      return;
    }

    setBankSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/bank/add_update_bank_details.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            acc_holder_name: bankForm.acc_holder_name.trim(),
            account_number: bankForm.account_number.trim(),
            ifsc: bankForm.ifsc.trim().toUpperCase(),
            bank_name: bankForm.bank_name.trim(),
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setBankEditMode(false);
        fetchBankDetails();
        showBankToast(
          bankDetails ? "Bank details updated successfully!" : "Bank details added successfully!"
        );
      } else {
        showBankToast(result.message || "Failed to save bank details.", "error");
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      showBankToast("Something went wrong. Please try again.", "error");
    } finally {
      setBankSaving(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      showBankToast("Please fill all fields", "error");
      return;
    }

    setTicketSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/support/create_support_ticket.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketForm),
        }
      );
      const result = await response.json();
      if (result.success) {
        setShowTicketModal(false);
        fetchTickets();
        setTicketForm({ subject: "", message: "" });
        showBankToast("Ticket created successfully!");
      } else {
        showBankToast(result.message || "Failed to create ticket", "error");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      showBankToast("Something went wrong", "error");
    } finally {
      setTicketSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  const handleRefresh = () => {
    fetchVendor();
    fetchBankDetails();
    fetchTickets();
  };

  const tabs = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "bank", label: "Bank Details", icon: Banknote },
    { id: "tickets", label: "Support Tickets", icon: Ticket },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Toast */}
      {bankToast && (
        <div
          className={`fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg flex items-center gap-2 ${
            bankToast.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {bankToast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          {bankToast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
              My Account
            </h1>
            <p className="mt-1 text-violet-600">Manage your profile, bank details and support tickets</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-violet-100 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Brand Image / Avatar */}
            <div className="relative shrink-0">
              {vendor?.brand_image ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-violet-200 shadow-lg bg-white">
                  <img
                    src={getImageUrl(vendor.brand_image) || "https://placehold.co/128x128/f3f4f6/9ca3af?text=Brand"}
                    alt={vendor.brand_name || "Brand"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 items-center justify-center hidden"
                    style={{ display: "none" }}
                  >
                    <span className="text-4xl font-bold text-white">
                      {vendor?.business_name?.charAt(0) || "V"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {vendor?.business_name?.charAt(0) || "V"}
                  </span>
                </div>
              )}
              {vendor?.brand_name && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  {vendor.brand_name}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vendor?.business_name || "Vendor"}
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium capitalize flex items-center gap-1">
                  <CheckCircle size={12} />
                  {vendor?.status || "Active"}
                </span>
              </div>
              <p className="text-gray-500 mt-1 text-sm">{vendor?.owner_name}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                {vendor?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone size={13} />
                    {vendor.phone}
                  </div>
                )}
                {vendor?.Email && (
                  <div className="flex items-center gap-1">
                    <Mail size={13} />
                    {vendor.Email}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Joined{" "}
                  {vendor?.created_at
                    ? new Date(vendor.created_at).toLocaleDateString()
                    : "-"}
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={14} />
                  Verified Vendor
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-violet-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all rounded-t-lg whitespace-nowrap ${
                  isActive
                    ? "bg-white text-violet-700 border-t border-l border-r border-violet-200"
                    : "text-gray-500 hover:text-violet-600"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-violet-100 rounded-2xl p-6 shadow-lg">
          {/* Business Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-violet-100 flex items-center gap-2">
                    <Briefcase size={18} className="text-violet-600" />
                    Business Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Business Name</p>
                      <p className="text-gray-900 font-medium">{vendor?.business_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Brand Name</p>
                      <p className="text-gray-900 font-medium">{vendor?.brand_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Owner Name</p>
                      <p className="text-gray-900 font-medium">{vendor?.owner_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">GST Number</p>
                      <p className="text-gray-900 font-medium font-mono">{vendor?.gst_number || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">PAN Number</p>
                      <p className="text-gray-900 font-medium font-mono">{vendor?.pan_number || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Due Days</p>
                      <p className="text-gray-900 font-medium">{vendor?.due_days ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Minimum Order Value</p>
                      <p className="text-gray-900 font-medium">
                        {vendor?.minimum_order_value
                          ? `₹${Number(vendor.minimum_order_value).toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* GST and TMC Images */}
                  {(vendor?.gst_image || vendor?.tmc_image) && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-violet-100 flex items-center gap-2">
                        <ImageIcon size={18} className="text-violet-600" />
                        GST and TMC Images
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {vendor?.gst_image && (
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">GST Image</p>
                            <img 
                              src={getImageUrl(vendor.gst_image)} 
                              alt="GST" 
                              className="w-32 h-32 rounded-xl overflow-hidden border border-violet-100 shadow-sm bg-white object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/128x128/f3f4f6/9ca3af?text=GST";
                              }}
                            />
                          </div>
                        )}
                        {vendor?.tmc_image && (
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">TMC Image</p>
                            <img 
                              src={getImageUrl(vendor.tmc_image)} 
                              alt="TMC" 
                              className="w-32 h-32 rounded-xl overflow-hidden border border-violet-100 shadow-sm bg-white object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/128x128/f3f4f6/9ca3af?text=TMC";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact & Address */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-violet-100 flex items-center gap-2">
                      <Mail size={18} className="text-violet-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                        <p className="text-gray-900 font-medium break-all">{vendor?.Email || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Phone Number</p>
                        <p className="text-gray-900 font-medium">{vendor?.phone || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-violet-100 flex items-center gap-2">
                      <MapPin size={18} className="text-violet-600" />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Address</p>
                        <p className="text-gray-900 font-medium">{vendor?.address || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Country</p>
                        <p className="text-gray-900 font-medium">{vendor?.country || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">State</p>
                        <p className="text-gray-900 font-medium">{vendor?.state || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">City</p>
                        <p className="text-gray-900 font-medium">{vendor?.city || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Pincode</p>
                        <p className="text-gray-900 font-medium">{vendor?.pincode || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Brand Image Preview */}
                  {vendor?.brand_image && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-violet-100 flex items-center gap-2">
                        <ImageIcon size={18} className="text-violet-600" />
                        Brand Image
                      </h3>
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-violet-100 shadow-sm bg-white">
                        <img
                          src={getImageUrl(vendor.brand_image)}
                          alt={vendor.brand_name || "Brand"}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/128x128/f3f4f6/9ca3af?text=Brand";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bank Details Tab */}
          {activeTab === "bank" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {bankDetails ? "Your saved bank account for payouts" : "No bank details added yet"}
                  </p>
                </div>
                {!bankEditMode && (
                  <button
                    onClick={openBankEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition text-sm font-medium shadow-sm"
                  >
                    {bankDetails ? (
                      <><Edit size={15} /> Edit Details</>
                    ) : (
                      <><Plus size={15} /> Add Bank Details</>
                    )}
                  </button>
                )}
              </div>

              {/* View Mode */}
              {!bankEditMode && bankDetails && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Account Holder</p>
                      <p className="text-gray-900 font-semibold text-base">{bankDetails.acc_holder_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Account Number</p>
                      <p className="text-gray-900 font-semibold font-mono text-base">
                        {"•".repeat(Math.max(0, (bankDetails.account_number?.length || 4) - 4))}
                        {bankDetails.account_number?.slice(-4) || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">IFSC Code</p>
                      <p className="text-gray-900 font-semibold uppercase font-mono text-base">{bankDetails.ifsc || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bank Name</p>
                      <p className="text-gray-900 font-semibold text-base">{bankDetails.bank_name || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!bankEditMode && !bankDetails && (
                <div className="text-center py-14 text-gray-400 border border-dashed border-violet-200 rounded-2xl">
                  <Banknote size={48} className="mx-auto mb-3 text-violet-200" />
                  <p className="font-medium text-gray-500">No Bank Details Added</p>
                  <p className="text-sm mt-1">Add your bank account to receive order payouts</p>
                </div>
              )}

              {/* Edit / Add Form */}
              {bankEditMode && (
                <div className="bg-violet-50/60 border border-violet-100 rounded-2xl p-6 space-y-5">
                  <h4 className="text-sm font-bold text-violet-700 uppercase tracking-wider">
                    {bankDetails ? "Update Bank Details" : "Add New Bank Details"}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={bankForm.acc_holder_name}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, acc_holder_name: e.target.value })
                        }
                        placeholder="e.g. Pradeep Kumar"
                        className="w-full px-4 py-2.5 border border-violet-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankForm.account_number}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, account_number: e.target.value })
                        }
                        placeholder="Enter full account number"
                        className="w-full px-4 py-2.5 border border-violet-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={bankForm.ifsc}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-4 py-2.5 border border-violet-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wide">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankForm.bank_name}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, bank_name: e.target.value })
                        }
                        placeholder="e.g. HDFC Bank"
                        className="w-full px-4 py-2.5 border border-violet-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveBankDetails}
                      disabled={bankSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition text-sm font-semibold disabled:opacity-60 shadow-sm"
                    >
                      {bankSaving ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={15} />
                      )}
                      {bankSaving ? "Saving..." : bankDetails ? "Update Bank Details" : "Save Bank Details"}
                    </button>
                    <button
                      onClick={() => setBankEditMode(false)}
                      disabled={bankSaving}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                      <X size={15} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === "tickets" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {tickets.length > 0 ? `${tickets.length} tickets found` : "No tickets yet"}
                  </p>
                </div>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition text-sm font-medium shadow-sm"
                >
                  <Plus size={16} />
                  Create Ticket
                </button>
              </div>

              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-violet-100 rounded-xl p-4 hover:bg-violet-50/50 transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              ticket.status === "open" || ticket.status === "Open"
                                ? "bg-yellow-100 text-yellow-700"
                                : ticket.status === "closed" || ticket.status === "Closed"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {ticket.status || "Open"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{ticket.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 text-gray-400 border border-dashed border-violet-200 rounded-2xl">
                  <Ticket size={48} className="mx-auto mb-3 text-violet-200" />
                  <p className="font-medium text-gray-500">No Support Tickets</p>
                  <p className="text-sm mt-1">Create a ticket for any issues or queries</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Create Support Ticket</h2>
              <button 
                onClick={() => setShowTicketModal(false)} 
                className="p-1 text-gray-400 hover:text-gray-600"
                disabled={ticketSaving}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Subject</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm bg-white"
                  placeholder="Enter ticket subject"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Message</label>
                <textarea
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm bg-white resize-none"
                  rows="5"
                  placeholder="Describe your issue in detail..."
                />
              </div>
              <button
                onClick={handleCreateTicket}
                disabled={ticketSaving}
                className="w-full py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-60 shadow-sm"
              >
                {ticketSaving ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {ticketSaving ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}