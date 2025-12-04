export const metrics = ({generalInfo}) => {
  return [
    {
      label: "Common",
      value: generalInfo.phone,
      status: "success",
    },
    {
      label: "Broker",
      value: generalInfo.broker_stat === "N" ? "Inactive" : "Active",
      status: generalInfo.broker_stat === "N" ? "error" : "success",
    },
    {
      label: "Safety Rating",
      value: generalInfo.safety_rating,
      status: generalInfo.safety_rating !== "None" ? "success" : "error",
    },
    {
      label: "ELD",
      value: generalInfo.broker_stat === "N" ? "Inactive" : "Active",
      status: generalInfo.broker_stat === "N" ? "error" : "success",
    },
    {
      label: "Contract",
      value: generalInfo.broker_stat === "N" ? "Inactive" : "Active",
      status: generalInfo.broker_stat === "N" ? "error" : "success",
    },
    {
      label: "Operating Status",
      value: generalInfo?.companies_id_data?.operating_status,
      status: "success",
    },
    {
      label: "Certifications",
      value: generalInfo.safety_rating,
      status: generalInfo.safety_rating !== "None" ? "success" : "error",
    },
    {
      label: "TIN",
      value: generalInfo?.companies_id_data?.operating_status,
      status: "success",
    },
  ];
};

export const powerUnits = ({generalInfo, uncategorizedCount}) => {
  return [
    {
      title: "Power Units",
      count: generalInfo?.power_units,
    },
    {
      title: "Dry Van",
      count: uncategorizedCount,
    },

    {
      title: "Uncategorized",
      count: uncategorizedCount,
    },
    {
      title: "Box Trucks",
      count: generalInfo?.equipment_id_data?.truck_units,
    },

    {
      title: "Flat Bed",
      count: generalInfo?.equipment_id_data?.truck_units,
    },

    {
      title: "Heavy Haul",
      count: generalInfo?.equipment_id_data?.truck_units,
    },

    {
      title: "Low Boy",
      count: generalInfo?.equipment_id_data?.truck_units,
    },
  ];
};

export const verifiedCarrierResources = ({generalInfo}) => {
  return [
    {
      title: "Power Units",
      count: generalInfo?.power_units,
    },
    {
      title: "Solo Drivers",
      count: generalInfo?.drivers,
    },
    {
      title: "Team Drivers",
      count: generalInfo?.drivers,
    },
    {
      title: "Trailers",
      count: generalInfo?.equipment_id_data?.owntrail,
    },
    {
      title: "Box Trucks",
      count: generalInfo?.equipment_id_data?.truck_units,
    },
  ];
};
