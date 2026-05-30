"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Shield,
  Edit,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertCircle,
  Home,
  Briefcase,
  CreditCard,
  Globe,
  MapPinIcon,
  Hash,
  Banknote,
  Ticket,
  MessageCircle,
  Send,
  X,
  Plus,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Bank Details State
  const [bankDetails, setBankDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
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

  useEffect(() => {
    console.log("Vendor Token", localStorage.getItem("access_token"));
    fetchVendor();
    console.log("Bank Token", localStorage.getItem("access_token"));
    fetchBankDetails();
    console.log("Ticket Token", localStorage.getItem("access_token"));
    fetchTickets();
  }, []);
 

  const fetchVendor = async () => {
    console.log("fetchVendor called");
    try {
      console.log(localStorage.getItem("access_token"));

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setVendor(result.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        if (result.message?.includes("token") || response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
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
    console.log("fetchBankDetails called");

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/bank/get_bank_details.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      const result = await response.json();
      if (result.success) {
        setBankDetails(result.data);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  const fetchTickets = async () => {
    console.log("fetchBankDetails called");

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://namami-infotech.com/Stepkaro/src/support/get_support_tickets.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleAddBankDetails = async () => {
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
          body: JSON.stringify(bankForm),
        }
      );
      const result = await response.json();
      if (result.success) {
        setShowBankModal(false);
        fetchBankDetails();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setBankForm({ acc_holder_name: "", account_number: "", ifsc: "", bank_name: "" });
      } else {
        alert(result.message || "Failed to add bank details");
      }
    } catch (error) {
      console.error("Error adding bank details:", error);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      alert("Please fill all fields");
      return;
    }
    
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
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(result.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  
  const handleRefresh = () => {
    setLoading(true);
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
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle size={18} />
          Operation completed successfully!
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
              My Account
            </h1>
            <p className="mt-1 text-violet-600">
              Manage your profile, bank details and support tickets
            </p>
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
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">
                {vendor?.business_name?.charAt(0) || "V"}
              </span>
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
              <p className="text-gray-600 mt-1">{vendor?.owner_name}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Joined {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : "-"}
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
        <div className="flex gap-2 border-b border-violet-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${
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
                      <p className="text-xs text-gray-500 mb-1">Business Name</p>
                      <p className="text-gray-900 font-medium">{vendor?.business_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Owner Name</p>
                      <p className="text-gray-900 font-medium">{vendor?.owner_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">GST Number</p>
                      <p className="text-gray-900 font-medium font-mono">{vendor?.gst_number || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">PAN Number</p>
                      <p className="text-gray-900 font-medium font-mono">{vendor?.pan_number || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-violet-100 flex items-center gap-2">
                    <Mail size={18} className="text-violet-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email Address</p>
                      <p className="text-gray-900 font-medium break-all">{vendor?.Email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <p className="text-gray-900 font-medium">{vendor?.phone || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-violet-100 flex items-center gap-2">
                    <MapPin size={18} className="text-violet-600" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-gray-900 font-medium">{vendor?.address || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Country</p>
                      <p className="text-gray-900 font-medium">{vendor?.country || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">State</p>
                      <p className="text-gray-900 font-medium">{vendor?.state || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">City</p>
                      <p className="text-gray-900 font-medium">{vendor?.city || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pincode</p>
                      <p className="text-gray-900 font-medium">{vendor?.pincode || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details Tab */}
          {activeTab === "bank" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
                {!bankDetails && (
                  <button
                    onClick={() => setShowBankModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                  >
                    <Plus size={16} />
                    Add Bank Details
                  </button>
                )}
              </div>

              {bankDetails ? (
                <div className="bg-violet-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Holder Name</p>
                      <p className="text-gray-900 font-medium">{bankDetails.acc_holder_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Number</p>
                      <p className="text-gray-900 font-medium">****{bankDetails.account_number?.slice(-4) || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                      <p className="text-gray-900 font-medium uppercase">{bankDetails.ifsc || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                      <p className="text-gray-900 font-medium">{bankDetails.bank_name || "-"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Banknote size={48} className="mx-auto mb-3 text-gray-400" />
                  <p>No bank details added yet</p>
                  <p className="text-sm mt-1">Add your bank account details to receive payouts</p>
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === "tickets" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
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
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              ticket.status === "open" 
                                ? "bg-yellow-100 text-yellow-700" 
                                : "bg-green-100 text-green-700"
                            }`}>
                              {ticket.status === "open" ? "Open" : "Closed"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{ticket.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Ticket size={48} className="mx-auto mb-3 text-gray-400" />
                  <p>No support tickets yet</p>
                  <p className="text-sm mt-1">Create a ticket for any issues or queries</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Bank Details Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Add Bank Details</h2>
              <button onClick={() => setShowBankModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={bankForm.acc_holder_name}
                  onChange={(e) => setBankForm({...bankForm, acc_holder_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter account holder name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Account Number</label>
                <input
                  type="text"
                  value={bankForm.account_number}
                  onChange={(e) => setBankForm({...bankForm, account_number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={bankForm.ifsc}
                  onChange={(e) => setBankForm({...bankForm, ifsc: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase"
                  placeholder="Enter IFSC code"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankForm.bank_name}
                  onChange={(e) => setBankForm({...bankForm, bank_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter bank name"
                />
              </div>
              <button
                onClick={handleAddBankDetails}
                className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              >
                Add Bank Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Create Support Ticket</h2>
              <button onClick={() => setShowTicketModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Subject</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter ticket subject"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Message</label>
                <textarea
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  rows="5"
                  placeholder="Describe your issue..."
                />
              </div>
              <button
                onClick={handleCreateTicket}
                className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}