import React, { useState } from "react";
import {
  Upload,
  PackagePlus,
  Boxes,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  RefreshCw,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

const API_BASE = "https://namami-infotech.com/Stepkaro/src";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

// ─── Static product template rows ────────────────────────────────────────────
const PRODUCT_TEMPLATE_ROWS = [
  {
    "PRODUCT ID": "",
    BRAND: "VIMPIX",
    CATEGORY: "KIDS CLOGS",
    GENDER: "KIDS",
    ARTICLE: "MANGO",
    SIZE: "11X1",
    COLOR: "BLACK",
    "pairs_per_ctn": 120,
    "packing type": "LOOSE",
    MRP: 499,
    "SELLING PRICE": 95,
    STOCK: 5,
    STATUS: "ACTIVE",
    SOLE: "EVA",
    UPPER: "EVA",
    ORIGIN: "MADE IN INDIA",
  },
  {
    "PRODUCT ID": "",
    BRAND: "",
    CATEGORY: "",
    GENDER: "",
    ARTICLE: "",
    SIZE: "2X5",
    COLOR: "RED",
    "pairs_per_ctn": 96,
    "packing type": "LOOSE",
    MRP: 599,
    "SELLING PRICE": 105,
    STOCK: 5,
    STATUS: "",
    SOLE: "",
    UPPER: "",
    ORIGIN: "",
  },
  {
    "PRODUCT ID": "",
    BRAND: "VIMPIX",
    CATEGORY: "GENTS CLOGS",
    GENDER: "GENTS",
    ARTICLE: "FOOTBALL",
    SIZE: "6X9",
    COLOR: "BLUE",
    "pairs_per_ctn": 72,
    "packing type": "LOOSE",
    MRP: 299,
    "SELLING PRICE": 100,
    STOCK: 3,
    STATUS: "INACTIVE",
    SOLE: "EVA",
    UPPER: "EVA",
    ORIGIN: "MADE IN CHINA",
  },
  {
    "PRODUCT ID": "",
    BRAND: "",
    CATEGORY: "",
    GENDER: "",
    ARTICLE: "",
    SIZE: "7X10",
    COLOR: "GREEN",
    "pairs_per_ctn": 60,
    "packing type": "LOOSE",
    MRP: 399,
    "SELLING PRICE": 110,
    STOCK: 2,
    STATUS: "",
    SOLE: "",
    UPPER: "",
    ORIGIN: "",
  },
];

// ─── Static stock template rows ───────────────────────────────────────────────
const STOCK_TEMPLATE_ROWS = [
  {
    "PRODUCT ID": 1,
    BRAND: "VIMPIX",
    CATEGORY: "KIDS CLOGS",
    GENDER: "KIDS",
    ARTICLE: "MANGO",
    SIZE: "11X1",
    COLOR: "BLACK",
    "pairs_per_ctn": 120,
    "packing type": "LOOSE",
    MRP: 499,
    "SELLING PRICE": 95,
    STOCK: 5,
    // "NEW STOCK": 50,
    STATUS: "ACTIVE",
    SOLE: "EVA",
    UPPER: "EVA",
    ORIGIN: "MADE IN INDIA",
  },
  {
    "PRODUCT ID": "",
    BRAND: "",
    CATEGORY: "",
    GENDER: "",
    ARTICLE: "",
    SIZE: "2X5",
    COLOR: "RED",
    "pairs_per_ctn": 96,
    "packing type": "LOOSE",
    MRP: 599,
    "SELLING PRICE": 105,
    STOCK: 5,
    // "NEW STOCK": 30,
    STATUS: "",
    SOLE: "",
    UPPER: "",
    ORIGIN: "",
  },
  {
    "PRODUCT ID": 2,
    BRAND: "VIMPIX",
    CATEGORY: "GENTS CLOGS",
    GENDER: "GENTS",
    ARTICLE: "FOOTBALL",
    SIZE: "6X9",
    COLOR: "BLUE",
    "pairs_per_ctn": 72,
    "packing type": "LOOSE",
    MRP: 299,
    "SELLING PRICE": 100,
    STOCK: 3,
    // "NEW STOCK": 20,
    STATUS: "INACTIVE",
    SOLE: "EVA",
    UPPER: "EVA",
    ORIGIN: "MADE IN CHINA",
  },
  {
    "PRODUCT ID": "",
    BRAND: "",
    CATEGORY: "",
    GENDER: "",
    ARTICLE: "",
    SIZE: "7X10",
    COLOR: "GREEN",
    "pairs_per_ctn": 60,
    "packing type": "LOOSE",
    MRP: 399,
    "SELLING PRICE": 110,
    STOCK: 2,
   // "NEW STOCK": 15,
    STATUS: "",
    SOLE: "",
    UPPER: "",
    ORIGIN: "",
  },
];

// ─── Fetch live filters and build Filters sheet data ─────────────────────────
async function fetchFilterSheetRows() {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/product/get_product_filters_new.php`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) return null;

    const d = json.data || {};
    const columns = {
      BRANDS: d.brands || [],
      CATEGORIES: d.categories || [],
      GENDER: d.gender || [],
      COLORS: d.colors || [],
      "SOLE MATERIALS": d.materials || [],
      "UPPER MATERIALS": d.upper_materials || [],
      "PACKING TYPE": d.packingTypes || [],
    };

    const maxLen = Math.max(...Object.values(columns).map((v) => v.length));
    const rows = [];

    // Header row
    const headerRow = {};
    Object.keys(columns).forEach((k) => (headerRow[k] = k));
    rows.push(headerRow);

    // Data rows
    for (let i = 0; i < maxLen; i++) {
      const row = {};
      Object.entries(columns).forEach(([k, vals]) => {
        row[k] = vals[i] !== undefined ? vals[i] : "";
      });
      rows.push(row);
    }

    return rows;
  } catch (e) {
    console.error("Failed to fetch filters:", e);
    return null;
  }
}

// ─── Download handler ─────────────────────────────────────────────────────────
async function downloadSample(type, setDownloading) {
  setDownloading(true);
  try {
    const wb = XLSX.utils.book_new();

    if (type === "products") {
      // Sheet 1: Product template
      const wsProduct = XLSX.utils.json_to_sheet(PRODUCT_TEMPLATE_ROWS);
      XLSX.utils.book_append_sheet(wb, wsProduct, "Product_Bulk_Upload");

      // Sheet 2: Live Filters from API
      const filterRows = await fetchFilterSheetRows();
      if (filterRows) {
        const wsFilters = XLSX.utils.json_to_sheet(filterRows, {
          skipHeader: true,
        });
        XLSX.utils.book_append_sheet(wb, wsFilters, "Refrence_sheet");
      }

      XLSX.writeFile(wb, "sample_bulk_product_upload.xlsx");
    } else {
      // Stock template — no filters needed
      const wsStock = XLSX.utils.json_to_sheet(STOCK_TEMPLATE_ROWS);
      XLSX.utils.book_append_sheet(wb, wsStock, "Stock_Bulk_Upload");
      XLSX.writeFile(wb, "sample_bulk_stock_upload.xlsx");
    }
  } catch (e) {
    console.error("Download failed:", e);
  } finally {
    setDownloading(false);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const BulkUploadModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'stock'
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setResult(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const endpoint =
      activeTab === "products"
        ? `${API_BASE}/product/vendor_addbulk_product.php`
        : `${API_BASE}/product/vendor_updatebulk_stock.php`;

    try {
      const token = getToken();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        message: "Server Error: Unable to complete request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 transition-all">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Bulk Inventory Upload
            </h3>
            <p className="text-xs text-slate-500">Upload CSV or Excel files</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switching Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => handleTabChange("products")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "products"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
            }`}
          >
            <PackagePlus size={16} /> Add Bulk Products
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("stock")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "stock"
                ? "bg-white text-teal-600 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
            }`}
          >
            <Boxes size={16} /> Update Bulk Stock
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Sample Download Box */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  activeTab === "products"
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-teal-50 text-teal-600"
                }`}
              >
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {activeTab === "products"
                    ? "Product Import Template"
                    : "Stock Update Template"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {activeTab === "products"
                    ? "Includes live Filters sheet from server"
                    : "Download structured sample Excel file"}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <button
              type="button"
              disabled={downloading}
              onClick={() => downloadSample(activeTab, setDownloading)}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                activeTab === "products"
                  ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  : "text-teal-600 bg-teal-50 hover:bg-teal-100"
              }`}
            >
              {downloading ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}
              {downloading ? "Fetching..." : "Download Template"}
            </button>
          </div>

          {/* Form Upload */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 text-center transition-all bg-slate-50/30 group">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-slate-100 text-slate-500 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mb-2">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {selectedFile
                    ? selectedFile.name
                    : "Click or drag CSV/Excel file to upload"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports .xlsx, .xls, .csv
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !selectedFile}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-sm ${
                  activeTab === "products"
                    ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
                    : "bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300"
                }`}
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                {loading
                  ? "Processing..."
                  : `Submit ${activeTab === "products" ? "Products" : "Stock"}`}
              </button>
            </div>
          </form>

          {/* Response Message View */}
          {result && (
            <div
              className={`p-4 rounded-xl text-xs border transition-all ${
                result.success
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                  : "bg-rose-50/80 border-rose-200 text-rose-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {result.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600" />
                )}
                {result.message}
              </div>

              {result.failed && result.failed.length > 0 && (
                <div className="mt-2 pt-2 border-t border-rose-200/60">
                  <p className="font-medium text-[11px] mb-1">
                    Skipped / Failed Rows:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] max-h-28 overflow-y-auto pr-1">
                    {result.failed.map((err, idx) => (
                      <li key={idx} className="text-rose-700">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
