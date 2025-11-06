export const tableElements = [
  {
    id: 1,
    name: "Customer",
    key: "customer",
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
    name: "Origin",
    key: "origin",
    sortable: true,
  },
  {
    id: 4,
    name: "Stop",
    key: "stop",
    sortable: true,
  },
  {
    id: 5,
    name: "Tracktor Unit # & ID",
    key: "tracktor_unit_id",
    sortable: true,
  },
  {
    id: 6,
    name: "Trailer Unit # & ID",
    key: "trailer_unit_id",
    sortable: true,
  },
  {
    id: 7,
    name: "Equipment",
    key: "equipment",
    sortable: true,
  },
  {
    id: 8,
    name: "Load Type",
    key: "loadType",
    sortable: true,
  },
  {
    id: 9,
    name: "Status",
    key: "status",
    sortable: false,
  },
  {
    id: 10,
    name: "Driver",
    key: "actions",
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
    id: 1,
    name: "Customer",
    key: "customer",
    sortable: true,
  },
  {
    id: 2,
    name: "Load ID",
    key: "loadId",
    sortable: true,
  },
  {
    id: 3,
    name: "Origin",
    key: "origin_address",
    sortable: true,
  },
  {
    id: 4,
    name: "Destination",
    key: "destination",
    sortable: true,
  },
  {
    id: 5,
    name: "Timer",
    key: "timer",
    sortable: true,
  },
  {
    id: 6,
    name: "Reason",
    key: "reason",
    sortable: true,
  },

  {
    id: 7,
    name: "Actions",
    key: "actions",
    sortable: true,
  },
];
