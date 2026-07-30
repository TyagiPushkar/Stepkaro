// utils/helpers.js
import { CheckCircle2, Clock3, Truck, XCircle } from "lucide-react";

export const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `https://namami-infotech.com/Stepkaro/${image}`;
};

export const formatCurrency = (amount) => {
  return `RS.${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

export const statusConfig = {
  NEW: {
    label: "New",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock3,
    nextAction: "accept",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: CheckCircle2,
    nextAction: "dispatch",
  },
  DISPATCHED_TO_WR: {
    label: "Dispatched to warehouse",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
    nextAction: "Dilivered",
  },
  RECEIVED_IN_WR: {
    label: "Received in Warehouse",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
    nextAction: null,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    nextAction: null,
  },
};

// Helper to get badge object for a status string
export const getStatusBadge = (status) => {
  const key = status?.toUpperCase() || "NEW";
  return statusConfig[key] || statusConfig.NEW;
};
