"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Loader2,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import api from "@/app/utils/api";

const API_URL =
  "https://namami-infotech.com/Stepkaro/src/admin/get_wallet_history.php";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

const normalizeHistoryItem = (item) => {
  const rawType = (item.type || item.transaction_type || item.action || "")
    .toString()
    .toLowerCase();
  const type = rawType.includes("debit")
    ? "debit"
    : rawType.includes("credit")
      ? "credit"
      : rawType;

  const userId =
    item.user_id ||
    item.buyer_id ||
    item.seller_id ||
    item.id ||
    item.customer_id ||
    item.vendor_id ||
    "unknown";
  const userName =
    item.user_name ||
    item.name ||
    item.buyer_name ||
    item.seller_name ||
    item.customer_name ||
    item.vendor_name ||
    "Unknown User";

  const amount = Number(
    item.amount ||
      item.transaction_amount ||
      item.credit_amount ||
      item.debit_amount ||
      0,
  );
  const walletBefore = Number(
    item.wallet_before || item.balance_before || item.previous_balance || 0,
  );
  const walletAfter = Number(
    item.wallet_after || item.balance_after || item.current_balance || 0,
  );
  const note =
    item.note || item.description || item.remarks || item.comment || "-";
  const date =
    item.transaction_date ||
    item.created_at ||
    item.date ||
    item.updated_at ||
    "-";

  return {
    ...item,
    user_id: userId,
    user_name: userName,
    type: type || "credit",
    amount,
    wallet_before: walletBefore,
    wallet_after: walletAfter,
    note,
    date,
  };
};

export default function WalletsPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [toast, setToast] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : "";

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchWalletHistory = useCallback(
    async (userId = "") => {
      try {
        setLoading(true);
        setError(null);
        const query = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
        const response = await api.get(`${API_URL}${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response?.data?.data || response?.data || [];
        const normalized = Array.isArray(data)
          ? data.map(normalizeHistoryItem)
          : [];

        setHistory(normalized);
        if (!Array.isArray(data)) {
          setError("Wallet history returned unexpected data format.");
        }
      } catch (fetchError) {
        console.error("Wallet history fetch failed:", fetchError);
        setError("Unable to load wallet history. Please try again.");
        showToast("Failed to fetch wallet history", "error");
      } finally {
        setLoading(false);
      }
    },
    [token, showToast],
  );

  useEffect(() => {
    fetchWalletHistory();
  }, [fetchWalletHistory]);

  const users = useMemo(() => {
    const map = new Map();
    history.forEach((entry) => {
      const id = String(entry.user_id || "unknown");
      if (!map.has(id)) {
        map.set(id, { id, name: entry.user_name });
      }
    });
    return Array.from(map.values());
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const matchesType = filterType === "all" || entry.type === filterType;
      const matchesUser =
        !selectedUserId || String(entry.user_id) === String(selectedUserId);
      const text =
        `${entry.user_name} ${entry.note} ${entry.date}`.toLowerCase();
      const matchesSearch =
        !searchQuery || text.includes(searchQuery.toLowerCase());
      return matchesType && matchesUser && matchesSearch;
    });
  }, [history, filterType, selectedUserId, searchQuery]);

  const stats = useMemo(() => {
    const totals = filteredHistory.reduce(
      (acc, entry) => {
        acc.count += 1;
        if (entry.type === "credit") acc.credit += entry.amount;
        if (entry.type === "debit") acc.debit += entry.amount;
        return acc;
      },
      { count: 0, credit: 0, debit: 0 },
    );
    return {
      totalEntries: totals.count,
      totalCredit: totals.credit,
      totalDebit: totals.debit,
      netBalance: totals.credit - totals.debit,
      userCount: users.length,
    };
  }, [filteredHistory, users.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / itemsPerPage),
  );
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleClearFilters = () => {
    setSelectedUserId("");
    setFilterType("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet History</h1>
          <p className="text-gray-500 mt-1">
            Admin view of wallet transactions for users and wallet balances.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => fetchWalletHistory(selectedUserId)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Total Entries
          </p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {stats.totalEntries}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Distinct Users
          </p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {stats.userCount}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Total Credit
          </p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {formatCurrency(stats.totalCredit)}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Total Debit
          </p>
          <p className="mt-3 text-3xl font-semibold text-red-600">
            {formatCurrency(stats.totalDebit)}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by user, note, or date..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-[0.15em] text-gray-500">
              <tr>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">User</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Before</th>
                <th className="px-4 py-4">After</th>
                <th className="px-4 py-4">Note</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-20 text-center text-gray-500"
                  >
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Loading wallet history...
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-20 text-center text-gray-500"
                  >
                    No wallet history found. Please adjust the filters or
                    refresh the data.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((entry, index) => (
                  <tr
                    key={`${entry.user_id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {entry.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {entry.user_name}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${entry.type === "credit" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {entry.type === "credit" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-4 text-sm font-semibold ${entry.type === "credit" ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatCurrency(entry.wallet_before)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatCurrency(entry.wallet_after)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                      {entry.note}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(entry)}
                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-700"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {filteredHistory.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of{" "}
            {filteredHistory.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-xl px-3 py-2 text-sm ${currentPage === page ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Wallet Transaction Details"
      >
        {selectedItem ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  User
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {selectedItem.user_name}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Date
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  {selectedItem.date}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Type
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {selectedItem.type}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Amount
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {formatCurrency(selectedItem.amount)}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Net Change
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {selectedItem.type === "credit" ? "+" : "-"}
                  {formatCurrency(selectedItem.amount)}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Balance Before
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  {formatCurrency(selectedItem.wallet_before)}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Balance After
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  {formatCurrency(selectedItem.wallet_after)}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Note
              </p>
              <p className="mt-2 text-sm text-gray-700">{selectedItem.note}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Transaction ID
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {selectedItem.transaction_id || selectedItem.id || "-"}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Reference
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {selectedItem.reference || selectedItem.order_id || "-"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No transaction selected.</p>
        )}
      </Modal>
    </div>
  );
}
