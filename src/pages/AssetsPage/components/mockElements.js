export const tableElements = [
  {
    key: "unitNumber",
    label: "Unit #",
    sortable: true,
  },

  {
    key: "type",
    label: "Type",
    sortable: true,
  },

  {
    key: "make",
    label: "Make",
    sortable: true,
  },

  {
    key: "fuel",
    label: "Fuel",
    sortable: true,
  },

  {
    key: "modelYear",
    label: "Model year",
    sortable: true,
  },

  {
    key: "licensePlate",
    label: "License plate",
    sortable: true,
  },

  {
    key: "vin",
    label: "VIN",
    sortable: true,
  },

  {
    key: "verificationStatus",
    label: "Verification status",
    sortable: true,
  },
];

export const getVerificationStatusColor = (status) => {
  if (Array.isArray(status)) {
    const statusValue = status[0]?.toLowerCase();
    switch (statusValue) {
    case "verified":
      return "green";
    case "needs attention":
    case "pending":
    case "unverified":
      return "red";
    case "in review":
    case "processing":
      return "orange";
    case "expired":
      return "red";
    case "approved":
      return "green";
    case "rejected":
    case "denied":
      return "red";
    default:
      return "gray";
    }
  }

  switch (status?.toLowerCase()) {
  case "verified":
    return "green";
  case "needs attention":
  case "pending":
  case "unverified":
    return "red";
  case "in review":
  case "processing":
    return "orange";
  case "expired":
    return "red";
  case "approved":
    return "green";
  case "rejected":
  case "denied":
    return "red";
  default:
    return "gray";
  }
};

export const validateForm = (formData, setErrors) => {
  const newErrors = {};

  if (!formData.licence_plate || !formData.licence_plate.toString().trim()) {
    newErrors.licence_plate = "License plate is required";
  }

  if (!formData.year || !formData.year.toString().trim()) {
    newErrors.year = "Year is required";
  }

  if (!formData.fuel_types_id || !formData.fuel_types_id.toString().trim()) {
    newErrors.fuel_types_id = "Fuel type is required";
  }

  if (!formData.gross_weight || !formData.gross_weight.toString().trim()) {
    newErrors.gross_weight = "Gross weight is required";
  }

  if (!formData.vin_number || !formData.vin_number.toString().trim()) {
    newErrors.vin_number = "VIN number is required";
  }

  if (!formData.vehicle_number || !formData.vehicle_number.toString().trim()) {
    newErrors.vehicle_number = "Vehicle number is required";
  }

  if (!formData.units || !formData.units.toString().trim()) {
    newErrors.units = "Units is required";
  }

  if (
    !formData.in_service_date ||
    !formData.in_service_date.toString().trim()
  ) {
    newErrors.in_service_date = "In service date is required";
  }

  if (!formData.inactivated_at || !formData.inactivated_at.toString().trim()) {
    newErrors.inactivated_at = "Inactivated date is required";
  }

  if (
    !formData.verification_status ||
    !formData.verification_status.toString().trim()
  ) {
    newErrors.verification_status = "Verification status is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const fieldTypesOptions = [
  {
    value: "Bio Diesel",
    label: "Bio Diesel",
  },
  {
    value: "RD/R99",
    label: "RD/R99",
  },
  {
    value: "LNG",
    label: "LNG",
  },
  {
    value: "CNG",
    label: "CNG",
  },
  {
    value: "Gasoline",
    label: "Gasoline",
  },
  {
    value: "Diesel",
    label: "Diesel",
  },
];
