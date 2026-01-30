export const tableElements = [
  {
    id: 1,
    name: "Customer",
    key: "customer",
    sortKey: "customer.name",
    sortable: true,
  },
  {
    id: 2,
    name: "Reference ID ",
    key: "reference",
    sortKey: "id",
    sortable: true,
  },
  {
    id: 3,
    name: "Status",
    key: "status",
    sortKey: "status",
    sortable: false,
  },
  {
    id: 4,
    name: "Origin",
    key: "origin",
    sortKey: "origin.[0].address",
    sortable: true,
  },
  {
    id: 5,
    name: "Stop",
    key: "stop",
    sortKey: "stop.[0].address",
    sortable: true,
  },
  {
    id: 6,
    name: "Invited By",
    key: "invited_by",
    sortKey: "invited_by.legal_name",
    sortable: true,
  },
  
  {
    id: 7,
    name: "Accepted By",
    key: "accepted_by",
    sortKey: "carrier.legal_name",
    sortable: true,
  },
  
  {
    id: 8,
    name: "Trailer Unit # & ID",
    key: "trailer_unit_id",
    sortKey: "origin.[0].equipment_type.label",
    sortable: false,
  },
  {
    id: 9,
    name: "Equipment",
    key: "equipment",
    sortKey: "equipment",
    sortable: true,
  },
  {
    id: 10,
    name: "Load Type",
    key: "loadType",
    sortKey: "origin.[0].load_type.label",
    sortable: false,
  },


  {
    id: 11,
    name: "Rate",
    key: "rate",
    sortKey: "total_rates",
    sortable: true,
  },

  {
    id: 12,
    name: "Total Miles",
    key: "total_miles",
    sortKey: "total_miles",
    sortable: true,
  },


  {
    id: 13,
    name: "Tracktor Unit # & ID",
    key: "tracktor_unit_id",
    sortKey: "tractors.tractors_plate",
    sortable: false,
  },
  {
    id: 14,
    name: "Carrier",
    key: "carrier",
    sortKey: "carrier",
    sortable: false,
  },
  {
    id: 15,
    name: "Driver",
    key: "driver",
    sortKey: "drivers.first_name",
    sortable: true,
  },

  {
    id: 15,
    name: "Actions",
    key: "actions",
    sortKey: "actions",
    sortable: false,
  },
];

export default tableElements;

export function getShortFileName(url, maxBaseLength = 5) {
  let fullName;
  try {
    const u = new URL(url);
    fullName = u.pathname.split("/").pop();
  } catch {
    fullName = url.split("/").pop();
  }

  const lastDot = fullName.lastIndexOf(".");
  let base = lastDot !== -1 ? fullName.substring(0, lastDot) : fullName;
  const ext = lastDot !== -1 ? fullName.substring(lastDot) : "";

  if (base.length > maxBaseLength) {
    base = base.substring(0, maxBaseLength) + "...";
  }

  return base + ext;
}

export const tableActionsNeeded = [
  {
    id: 0,
    name: "",
    key: "checkbox",
    sortable: false,
  },
  {
    id: 1,
    name: "Customer",
    key: "shipper.name",
    sortable: true,
  },
  {
    id: 2,
    name: "Reference ID",
    key: "reference",
    sortable: true,
  },
  {
    id: 3,
    name: "Origin",
    key: "origin.address",
    sortable: true,
  },
  {
    id: 4,
    name: "Invited By",
    key: "invited_by",
    sortable: true,
  },
  {
    id: 5,
    name: "Destination",
    key: "stop.address",
    sortable: true,
  },
  {
    id: 6,
    name: "Timer",
    key: "timer",
    sortable: false,
  },
  // {
  //   id: 7,
  //   name: "Reason",
  //   key: "reason",
  //   sortable: true,
  // },

  {
    id: 8,
    name: "Total Miles",
    key: "total_miles",
    sortable: true,
  },

  {
    id: 9,
    name: "Actions",
    key: "actions",
    sortable: false,
  },
];
