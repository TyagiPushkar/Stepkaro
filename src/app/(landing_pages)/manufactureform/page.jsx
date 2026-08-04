"use client";

import { useState } from "react";
import axios from "axios";
import {
  UserIcon,
  BuildingOffice2Icon,
  TagIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  MapPinIcon,
  GlobeAsiaAustraliaIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

export default function RegisterManufacturer() {
  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    brand_name: "",
    email: "",
    phone: "",
    gst_number: "",
    pan_number: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const [files, setFiles] = useState({
    brand_image: null,
    gst_image: null,
    tmc_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image File Changes
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  // Submit Handler using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Client-side file presence validation as required by PHP API
    if (!files.brand_image) {
      setMessage({ type: "error", text: "Brand Image is required." });
      setLoading(false);
      return;
    }
    if (!files.gst_image) {
      setMessage({ type: "error", text: "GST Document Image is required." });
      setLoading(false);
      return;
    }
    if (!files.tmc_image) {
      setMessage({ type: "error", text: "TMC Document Image is required." });
      setLoading(false);
      return;
    }

    try {
      // Build Multipart FormData
      const data = new FormData();
      data.append("business_name", formData.business_name);
      data.append("owner_name", formData.owner_name);
      data.append("brand_name", formData.brand_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("gst_number", formData.gst_number);
      data.append("pan_number", formData.pan_number);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("country", formData.country);
      data.append("pincode", formData.pincode);

      // Append 3 file fields required by PHP script
      data.append("brand_image", files.brand_image);
      data.append("gst_image", files.gst_image);
      data.append("tmc_image", files.tmc_image);

      const response = await axios.post(
        "https://namami-infotech.com/Stepkaro/src/vender/add_vendor.php",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Vendor and Brand details registered successfully!",
        });
        // Reset Form
        setFormData({
          business_name: "",
          owner_name: "",
          brand_name: "",
          email: "",
          phone: "",
          gst_number: "",
          pan_number: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          pincode: "",
        });
        setFiles({ brand_image: null, gst_image: null, tmc_image: null });
      } else {
        setMessage({
          type: "error",
          text:
            response.data.message ||
            "Registration failed. Please check details.",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while registering. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
        {/* Card Header matching image style */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-950">
            Join as Manufacturer
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Register your factory & brand on Stepkaro to sell Pan-India
          </p>
        </div>

        {/* Status Alert */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs font-medium text-center ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Business Name */}
          <div className="relative">
            <BuildingOffice2Icon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="business_name"
              required
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Business / Factory Name *"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Owner Name & Brand Name (2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="owner_name"
                required
                value={formData.owner_name}
                onChange={handleChange}
                placeholder="Owner Full Name *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>

            <div className="relative">
              <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="brand_name"
                required
                value={formData.brand_name}
                onChange={handleChange}
                placeholder="Brand Name *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>
          </div>

          {/* Phone Number & Email (2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                name="phone"
                required
                pattern="[0-9]{10}"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>

            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>
          </div>

          {/* GST Number & PAN Number (2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <DocumentCheckIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="GST Number"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>

            <div className="relative">
              <CreditCardIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
                placeholder="PAN Number"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>
          </div>

          {/* Address */}
          <div className="relative">
            <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Factory Address"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* City, State & Pincode (3 Grid) */}
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Image File Upload Section */}
          <div className="space-y-2 pt-2">
            {/* Brand Image Upload */}
            <div className="p-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Upload Brand Logo / Image *
              </label>
              <div className="flex items-center gap-2">
                <DocumentArrowUpIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <input
                  type="file"
                  name="brand_image"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={handleFileChange}
                  className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer w-full"
                />
              </div>
              {files.brand_image && (
                <p className="text-[10px] text-green-600 mt-1 font-medium truncate">
                  Selected: {files.brand_image.name}
                </p>
              )}
            </div>

            {/* GST Image Upload */}
            <div className="p-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Upload GST Certificate Image *
              </label>
              <div className="flex items-center gap-2">
                <DocumentArrowUpIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <input
                  type="file"
                  name="gst_image"
                  required
                  onChange={handleFileChange}
                  className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer w-full"
                />
              </div>
              {files.gst_image && (
                <p className="text-[10px] text-green-600 mt-1 font-medium truncate">
                  Selected: {files.gst_image.name}
                </p>
              )}
            </div>

            {/* TMC Image Upload */}
            <div className="p-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Upload TMC (Trademark Certificate) Image *
              </label>
              <div className="flex items-center gap-2">
                <DocumentArrowUpIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <input
                  type="file"
                  name="tmc_image"
                  required
                  onChange={handleFileChange}
                  className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer w-full"
                />
              </div>
              {files.tmc_image && (
                <p className="text-[10px] text-green-600 mt-1 font-medium truncate">
                  Selected: {files.tmc_image.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button matching visual style */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-indigo-950 text-white font-bold text-sm tracking-wide hover:bg-indigo-900 transition-all shadow-lg shadow-indigo-950/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Submitting Details...</span>
            ) : (
              <span>Submit & Join Now</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
