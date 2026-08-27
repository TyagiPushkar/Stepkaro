import React, { useState } from "react";
import {
  Upload,
  Download,
  PackagePlus,
  Boxes,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";

const BulkUploadModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'stock'
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const token = getToken();

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

    // Dynamic Endpoints for both forms
    const endpoint =
      activeTab === "products"
        ? "https://namami-infotech.com/Stepkaro/src/product/vendor_addbulk_product.php"
        : "https://namami-infotech.com/Stepkaro/src/product/vendor_updatebulk_stock.php";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
                className={`p-2.5 rounded-lg ${activeTab === "products" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}
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
                  Download structured sample Excel file
                </p>
              </div>
            </div>

            <a
              href={
                activeTab === "products"
                  ? "/samples/sample_bulk_product_upload.xlsx"
                  : "/samples/sample_bulk_stock_upload.xlsx"
              }
              download
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download size={13} /> Download
            </a>
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
