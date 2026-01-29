export const tableElements = [
  {
    id: 1,
    name: "Customer",
    key: "customer.name",
    sortable: true,
  },
  {
    id: 2,
    name: "Trip ID",
    key: "tripId",
    sortable: true,
  },
  {
    id: 3,
    name: "Status",
    key: "status",
    sortable: false,
  },
  {
    id: 4,
    name: "Origin",
    key: "origin",
    sortable: true,
  },
  {
    id: 5,
    name: "Stop",
    key: "stop",
    sortable: true,
  },
  {
    id: 6,
    name: "Invited By",
    key: "invited_by.legal_name",
    sortable: true,
  },
  
  {
    id: 7,
    name: "Accepted By",
    key: "carrier.legal_name",
    sortable: true,
  },
  
  {
    id: 8,
    name: "Trailer Unit # & ID",
    key: "trailer_unit_id",
    sortable: true,
  },
  {
    id: 9,
    name: "Equipment",
    key: "equipment",
    sortable: true,
  },
  {
    id: 10,
    name: "Load Type",
    key: "loadType",
    sortable: true,
  },


  {
    id: 11,
    name: "Rate",
    key: "rate",
    sortable: true,
  },

  {
    id: 12,
    name: "Total Miles",
    key: "total_miles",
    sortable: true,
  },


  {
    id: 13,
    name: "Tracktor Unit # & ID",
    key: "tracktor_unit_id",
    sortable: true,
  },
  {
    id: 14,
    name: "Carrier",
    key: "carrier.legal_name",
    sortable: true,
  },
  {
    id: 15,
    name: "Driver",
    key: "driver",
    sortable: true,
  },

  {
    id: 15,
    name: "Actions",
    key: "actions",
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
    name: "Load ID",
    key: "id",
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
