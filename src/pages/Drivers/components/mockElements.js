export const getLoadEligibilityColor = (eligibility) => {
  if (Array.isArray(eligibility)) {
    const status = eligibility[0]?.toLowerCase();
    switch (status) {
    case "eligible":
      return "green";
    case "pending":
      return "orange";
    case "not eligible":
    case "not-eligible":
      return "red";
    case "approved":
      return "green";
    case "rejected":
    case "denied":
      return "red";
    case "under review":
    case "processing":
      return "orange";
    default:
      return "gray";
    }
  }

  switch (eligibility?.toLowerCase()) {
  case "eligible":
    return "green";
  case "pending":
    return "orange";
  case "not eligible":
  case "not-eligible":
    return "red";
  case "approved":
    return "green";
  case "rejected":
  case "denied":
    return "red";
  case "under review":
  case "processing":
    return "orange";
  default:
    return "gray";
  }
};
