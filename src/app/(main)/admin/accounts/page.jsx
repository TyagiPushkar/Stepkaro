"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Wallet,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function AccountsPage() {
  const [token, setToken] = useState("");
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedFilter, setSelectedFilter] = useState("all");

  // ================= TOKEN SAFE LOAD =================
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token") || "");
    }
  }, []);

  // ================= API =================
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://namami-infotech.com/Stepkaro/src/super_admin/accounts.php",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load accounts");
      }

      setAccounts(data.data || {});
    } catch (err) {
      setError(err.message || "Something went wrong");
      setAccounts({});
    } finally {
      setLoading(false);
    }
  };

  // fetch only when token exists
  useEffect(() => {
    if (token) fetchAccounts();
  }, [token]);

  // ================= SAFE DATA =================
  const payments = accounts?.payments ?? [];
  const vendorPayments = accounts?.vendorPayments ?? [];

  // ================= FILTER + SEARCH (OPTIMIZED) =================
  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) => {
        if (selectedFilter === "all") return true;
        return p.status === selectedFilter;
      })
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          (p.user_name || "").toLowerCase().includes(q) ||
          (p.vendor_name || "").toLowerCase().includes(q) ||
          String(p.amount || "").includes(q)
        );
      });
  }, [payments, selectedFilter, searchQuery]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const currentPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ================= EXPORT =================
  const exportCSV = () => {
    const rows = [
      ["User", "Vendor", "Amount", "Status"],
      ...payments.map((p) => [
        p.user_name || "",
        p.vendor_name || "",
        p.amount || 0,
        p.status || "",
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accounts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ================= UI =================
  return (
    <div className="space-y-6 text-white">
      {/* ERROR */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Accounts</h1>
          <p className="text-gray-400 text-sm">Payment & Revenue Dashboard</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAccounts}
            className="px-3 py-2 bg-slate-800 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-800 rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && <div className="text-gray-400 text-sm">Loading data...</div>}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 rounded-lg">
          <TrendingUp />
          <p>₹{accounts?.totalRevenue || 0}</p>
          <span>Total Revenue</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg">
          <Wallet />
          <p>₹{accounts?.userPayments || 0}</p>
          <span>User Payments</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg">
          <Clock />
          <p>₹{accounts?.pendingPayments || 0}</p>
          <span>Pending</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg">
          <AlertCircle />
          <p>₹{accounts?.vendorPending || 0}</p>
          <span>Vendor Pending</span>
        </div>
      </div>

      {/* SEARCH */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="p-2 bg-slate-800 rounded-lg w-full"
      />

      {/* TABLE */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th>User</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length ? (
              currentPayments.map((p, i) => (
                <tr key={i} className="border-t border-slate-700">
                  <td className="p-2">{p.user_name || "-"}</td>
                  <td>{p.vendor_name || "-"}</td>
                  <td>₹{p.amount || 0}</td>
                  <td>{p.status || "pending"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-5 text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VENDOR PAYOUT */}
      <div className="bg-slate-900 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Vendor Payouts</h2>

        {vendorPayments.length ? (
          vendorPayments.map((v, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-slate-700"
            >
              <span>{v.vendor_name}</span>
              <span>₹{v.pending_amount}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No vendor payouts</p>
        )}
      </div>
    </div>
  );
}
