"use client";

import { useState } from "react";
import axios from "axios";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  DocumentCheckIcon,
  MapPinIcon,
  TruckIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

export default function RegisterBuyer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    shop_name: "",
    document_number: "",
    state: "",
    district: "",
    address: "",
    delivery_location: "",
    logistic_partner_name: "",
    logistic_contact_no: "",
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  // Submit Handler using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation Check for Mandatory Fields
    if (!documentFile) {
      setMessage({
        type: "error",
        text: "Please select a document image file.",
      });
      setLoading(false);
      return;
    }

    try {
      // Create FormData Object for multipart upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("shop_name", formData.shop_name);
      data.append("document_number", formData.document_number);
      data.append("state", formData.state);
      data.append("district", formData.district);
      data.append("address", formData.address);
      data.append("delivery_location", formData.delivery_location);
      data.append("logistic_partner_name", formData.logistic_partner_name);
      data.append("logistic_contact_no", formData.logistic_contact_no);
      data.append("document_image", documentFile);

      const response = await axios.post(
        "https://namami-infotech.com/Stepkaro/src/auth/register_buyer.php",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: response.data.message });
        // Form Reset
        setFormData({
          name: "",
          phone: "",
          email: "",
          shop_name: "",
          document_number: "",
          state: "",
          district: "",
          address: "",
          delivery_location: "",
          logistic_partner_name: "",
          logistic_contact_no: "",
        });
        setDocumentFile(null);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Server Error. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
        {/* Title Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-950">
            Join as Wholesaler / Buyer
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the details below to register your business on Stepkaro
          </p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="relative">
            <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name *"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Shop / Business Name */}
          <div className="relative">
            <BuildingStorefrontIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="shop_name"
              value={formData.shop_name}
              onChange={handleChange}
              placeholder="Shop / Business Name"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Mobile Number & Email (2 Grid) */}
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
                placeholder="10-Digit Mobile No *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>

            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>
          </div>

          {/* State & District (2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="State *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>

            <div className="relative">
              <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                placeholder="District *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>
          </div>

          {/* Full Address */}
          <div className="relative">
            <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address *"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Delivery Location */}
          <div className="relative">
            <TruckIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="delivery_location"
              required
              value={formData.delivery_location}
              onChange={handleChange}
              placeholder="Preferred Delivery Location *"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Logistics Info (2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <TruckIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="logistic_partner_name"
                required
                value={formData.logistic_partner_name}
                onChange={handleChange}
                placeholder="Logistics Partner *"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>

            <div className="relative">
              <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                name="logistic_contact_no"
                value={formData.logistic_contact_no}
                onChange={handleChange}
                placeholder="Logistics Contact No."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
              />
            </div>
          </div>

          {/* Document Number */}
          <div className="relative">
            <DocumentCheckIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="document_number"
              required
              value={formData.document_number}
              onChange={handleChange}
              placeholder="GST / Aadhar / Pan No. *"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-gray-800"
            />
          </div>

          {/* Document File Upload */}
          <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Upload Document Image (GST/Aadhar/PAN) *
            </label>
            <div className="flex items-center gap-2">
              <DocumentArrowUpIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer w-full"
              />
            </div>
            {documentFile && (
              <p className="text-[11px] text-green-600 mt-1 font-medium">
                Selected: {documentFile.name}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-indigo-950 text-white font-bold text-sm tracking-wide hover:bg-indigo-900 transition-all shadow-lg shadow-indigo-950/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Submitting...</span>
            ) : (
              <span>Submit & Join Now</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
