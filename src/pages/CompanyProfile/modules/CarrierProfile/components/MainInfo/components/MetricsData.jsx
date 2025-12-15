export const metrics = ({generalInfo, new_info}) => {
  return [
    {
      label: "Common",
      value: new_info?.phone,
      status: "success",
    },
    {
      label: "Broker",
      value: new_info?.broker === "N" ? "Inactive" : "Active",
      status: new_info?.broker === "N" ? "error" : "success",
    },
    {
      label: "Safety Rating",
      value: new_info?.safety_rating,
      status: new_info?.safety_rating !== "None" ? "success" : "error",
    },
    {
      label: "ELD",
      value: getIntegrationName(new_info?.integrations),
      status: new_info?.integrations?.length > 0 ? "success" : "error",
    },
    {
      label: "Contract",
      value: "4 months",
      // value: generalInfo.broker_stat === "N" ? "Inactive" : "Active",
      status: generalInfo.broker_stat === "N" ? "error" : "success",
    },
    {
      label: "Operating Status",
      value: new_info?.operating_status,
      status: "success",
    },
    {
      label: "Certifications",
      value: new_info?.certifications,
      status: new_info?.safety_rating !== "None" ? "success" : "error",
    },
    {
      label: "TIN",
      value: new_info?.tin,
      status: "success",
    },
  ];
};

export const powerUnits = ({new_info, uncategorizedCount}) => {
  return [
    {
      title: "Power Units",
      count: new_info?.power_units,
    },
    {
      title: "Dry Van",
      count: new_info?.dry_van,
    },

    {
      title: "Uncategorized",
      count: new_info?.uncategorized,
    },
    {
      title: "Box Trucks",
      count: new_info?.truck_units,
    },

    {
      title: "Flat Bed",
      count: new_info?.flat_bed,
    },

    {
      title: "Heavy Haul",
      count: new_info?.heavy_haul,
    },

    {
      title: "Low Boy",
      count: new_info?.low_boy,
    },

    {
      title: "Drivers",
      count: new_info?.total_drivers,
    },
  ];
};

export const verifiedCarrierResources = ({generalInfo}) => {
  return [
    {
      title: "Power Units",
      count: generalInfo?.power_units,
    },
    // {
    //   title: "Solo Drivers",
    //   count: generalInfo?.drivers,
    // },
    {
      title: "Drivers",
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

export const getIntegrationName = (integrations) => {
  return (
    integrations?.map((integration) => integration.type?.[0])?.join(", ") ||
    "N/A"
  );
};
