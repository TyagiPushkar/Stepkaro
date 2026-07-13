"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapPinned,
  Search,
  X,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

const GET_DISTRICTS_LIST_API =
  "https://namami-infotech.com/Stepkaro/src/location/get_district.php";

const GET_RESTRICTED_DISTRICTS_API =
  "https://namami-infotech.com/Stepkaro/src/vender/get_restrict_district.php";

const UPDATE_RESTRICTED_DISTRICTS_API =
  "https://namami-infotech.com/Stepkaro/src/vender/restrict_district.php";

const RestrictedDistrictsManager = ({ vendorId, vendorName, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allDistricts, setAllDistricts] = useState([]);
  const [restrictedDistricts, setRestrictedDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [toast, setToast] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all districts
  const fetchAllDistricts = async () => {
    try {
      const response = await axios.get(GET_DISTRICTS_LIST_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && Array.isArray(response.data.data)) {
        setAllDistricts(response.data.data);
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      showToast("Failed to load districts list", "error");
      return [];
    }
  };

  // Fetch restricted districts for this vendor
  const fetchRestrictedDistricts = async () => {
    if (!vendorId) return [];

    try {
      const response = await axios.get(
        `${GET_RESTRICTED_DISTRICTS_API}?id=${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success && response.data.data) {
        let restricted = [];
        const rawData = response.data.data;

        if (Array.isArray(rawData)) {
          restricted = rawData;
        } else if (rawData.restricted_district) {
          // Check if it's a string from backend and convert to array, else keep array
          if (typeof rawData.restricted_district === "string") {
            restricted = rawData.restricted_district
              .split(",")
              .map((s) => s.trim());
          } else if (Array.isArray(rawData.restricted_district)) {
            restricted = rawData.restricted_district;
          }
        }
        return restricted;
      }
      return [];
    } catch (error) {
      console.error("Error fetching restricted districts:", error);
      return [];
    }
  };

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const districts = await fetchAllDistricts();
      const restricted = await fetchRestrictedDistricts();

      setRestrictedDistricts(restricted);

      // Map restricted district names to full district objects safely
      const restrictedObjects = districts.filter((d) =>
        restricted.includes(d?.district_name),
      );
      setSelectedDistricts(restrictedObjects);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      loadData();
    }
  }, [vendorId]);

  // Get unique states for filter safely
  const uniqueStates = useMemo(() => {
    const states = new Set();
    allDistricts.forEach((d) => {
      if (d?.state_name) states.add(d.state_name);
    });
    return Array.from(states).sort();
  }, [allDistricts]);

  // Filter districts based on search and state safely
  const filteredDistricts = useMemo(() => {
    let filtered = allDistricts;

    // Filter by state
    if (selectedState !== "all") {
      filtered = filtered.filter((d) => d?.state_name === selectedState);
    }

    // Filter by search with safe optional chaining
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (d) =>
          d?.district_name?.toLowerCase().includes(query) ||
          d?.state_name?.toLowerCase().includes(query) ||
          d?.full_name?.toLowerCase().includes(query),
      );
    }

    // Fix: Using [...filtered] spread syntax to avoid direct mutation of React State
    return [...filtered].sort((a, b) => {
      const aSelected = selectedDistricts.some(
        (d) => d?.district_id === a?.district_id,
      );
      const bSelected = selectedDistricts.some(
        (d) => d?.district_id === b?.district_id,
      );
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return (a?.district_name || "").localeCompare(b?.district_name || "");
    });
  }, [allDistricts, selectedDistricts, searchQuery, selectedState]);

  // Toggle district selection safely
  const toggleDistrict = (district) => {
    if (!district) return;
    setSelectedDistricts((prev) => {
      const exists = prev.some((d) => d?.district_id === district?.district_id);
      if (exists) {
        return prev.filter((d) => d?.district_id !== district?.district_id);
      } else {
        return [...prev, district];
      }
    });
  };

  // Save restricted districts
  const saveRestrictedDistricts = async () => {
    if (!vendorId) {
      showToast("Vendor ID is required", "error");
      return;
    }

    setSaving(true);
    try {
      const districtNames = selectedDistricts
        .map((d) => d?.district_name)
        .filter(Boolean); // Filter undefined values out

      const payload = {
        vendor_id: Number(vendorId),
        restricted_district: districtNames,
      };

      const response = await axios.post(
        UPDATE_RESTRICTED_DISTRICTS_API,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.success) {
        setRestrictedDistricts(districtNames);
        showToast(
          `Restricted districts updated successfully! (${districtNames.length} districts)`,
          "success",
        );
        if (onUpdate) {
          onUpdate(districtNames);
        }
      } else {
        showToast(response.data?.message || "Failed to update", "error");
      }
    } catch (error) {
      console.error("Error saving restricted districts:", error);
      showToast("Failed to save restricted districts", "error");
    } finally {
      setSaving(false);
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedDistricts([]);
  };

  // Select all filtered districts
  const selectAllFiltered = () => {
    const newSelection = [...selectedDistricts];
    filteredDistricts.forEach((d) => {
      if (!newSelection.some((s) => s?.district_id === d?.district_id)) {
        newSelection.push(d);
      }
    });
    setSelectedDistricts(newSelection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
        <span className="ml-2 text-sm text-slate-600">
          Loading districts...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-violet-600" />
            Restricted Districts
          </h3>
          <p className="text-sm text-slate-500">
            {vendorName && `Vendor: ${vendorName} • `}
            {selectedDistricts.length} district
            {selectedDistricts.length !== 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={clearAllSelections}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Clear All
          </button>
          <button
            onClick={selectAllFiltered}
            className="px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition"
          >
            Select All Filtered
          </button>
          <button
            onClick={saveRestrictedDistricts}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search districts by name or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          >
            <option value="all">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <button
            onClick={loadData}
            className="p-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Selected Districts Summary */}
      {selectedDistricts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-violet-50 rounded-xl border border-violet-100">
          <span className="text-xs font-medium text-violet-700 mr-1.5 py-1">
            Selected:
          </span>
          {selectedDistricts.slice(0, 8).map((d) => (
            <span
              key={d?.district_id}
              className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 border border-violet-200"
            >
              {d?.district_name}
              <button
                onClick={() => toggleDistrict(d)}
                className="text-slate-400 hover:text-rose-500 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedDistricts.length > 8 && (
            <span className="text-xs text-slate-500 py-1">
              +{selectedDistricts.length - 8} more
            </span>
          )}
        </div>
      )}

      {/* Districts List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            {filteredDistricts.length} district
            {filteredDistricts.length !== 1 ? "s" : ""} found
          </span>
          <span className="text-slate-500">
            {selectedDistricts.length} selected
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredDistricts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400">
              <MapPinned className="h-8 w-8 mb-2" />
              <p className="text-sm">No districts found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-violet-600 text-sm hover:underline mt-1"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {filteredDistricts.map((district) => {
                const isSelected = selectedDistricts.some(
                  (d) => d?.district_id === district?.district_id,
                );
                return (
                  <button
                    key={district?.district_id}
                    onClick={() => toggleDistrict(district)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition text-left ${
                      isSelected
                        ? "bg-violet-50 border border-violet-200 text-violet-700"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">
                        {district?.district_name}
                      </span>
                      <span className="text-xs text-slate-400 truncate">
                        {district?.state_name}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-violet-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-500 pt-2">
        <div>
          Total districts: {allDistricts.length} | Restricted:{" "}
          {restrictedDistricts.length}
        </div>
        <div className="flex gap-3">
          <span>States: {uniqueStates.length}</span>
          <span className="text-violet-600 font-medium">
            {selectedDistricts.length} selected
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestrictedDistrictsManager;
