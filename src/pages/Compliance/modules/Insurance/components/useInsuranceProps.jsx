import {format, isValid, parseISO} from "date-fns";

export const useInsuranceProps = () => {
  const statusConfig = {
    active: {
      bg: "#17B26A",
      color: "#fff",
      border: "#ABEFC6",
      label: "Active",
    },
    expiringSoon: {
      bg: "#F79009",
      color: "#fff",
      border: "#FEDF89",
      label: "Expiring Soon",
    },
    pendingCancellation: {
      bg: "#F79009",
      color: "#fff",
      border: "#FEDF89",
      label: "Pending Cancellation",
    },
    expired: {
      bg: "#F04438",
      color: "#fff",
      border: "#FECDCA",
      label: "Expired",
    },
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const parsedDate = typeof date === "string" ? parseISO(date) : date;
      if (isValid(parsedDate)) {
        return format(parsedDate, "MM/dd/yyyy");
      }
      return date;
    } catch {
      return date;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return {
    statusConfig,
    formatDate,
    formatCurrency,
  };
};
