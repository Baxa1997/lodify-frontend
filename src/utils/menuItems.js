export const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/img/dashboard.svg",
    path: "#",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "/img/menuNotification.svg",
    path: "#",
  },
  {
    id: "trips",
    label: "Trips",
    icon: "/img/route.svg",
    path: "#",
    children: [
      {
        id: "all_loads",
        label: "All Loads",
        path: "trips",
      },
      {
        id: "load_details",
        label: "Load Details",
        path: "all-loads",
      },
      {
        id: "accept-decline",
        label: "Accept / Decline",
        path: "accept-decline",
      },
    ],
  },
  {
    id: "goReadyTrucks",
    label: "Go Ready™  Trucks",
    icon: "/img/menuTruck.svg",
    path: "go-ready-trucks",
  },
  {
    id: "brokers",
    label: "Brokers",
    icon: "/img/user.svg",
    path: "brokers",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: "/img/user.svg",
    path: "/admin/reviews",
  },
  {
    id: "resources",
    label: "Managing Recourses",
    icon: "/img/resources.svg",
    path: "#",
    children: [
      {
        id: "drivers",
        label: "Drivers",
        path: "drivers",
      },
      {
        id: "assets",
        label: "Assets",
        path: "assets",
      },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: "/img/menuCompliance.svg",
    path: "#",
    children: [
      {
        id: "compliance",
        label: "Compliance",
        path: "compliance",
      },
    ],
  },
  {
    id: "detention",
    label: "Detention",
    icon: "/img/menuClock.svg",
    path: "#",
    children: [
      {
        id: "detention",
        label: "Detention",
        path: "shipper",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "/img/menuIntegrations.svg",
    path: "#",
    children: [
      {
        id: "integrations",
        label: "Integrations",
        path: "integrations",
      },
    ],
  },

  {
    id: "scorecards",
    label: "CoreCards",
    icon: "/img/menuScore.svg",
    path: "scorecards",
  },

  {
    id: "discussion",
    label: "Discussion",
    icon: "/img/menuDiscussion.svg",
    path: "#",
    children: [
      {
        id: "collabrations",
        label: "Collabrations",
        path: "collabrations",
      },
      {
        id: "discussion",
        label: "Discussion",
        path: "discussion",
      },
    ],
  },
];

export const brokerMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/img/dashboard.svg",
    path: "#",
  },

  {
    id: "notifications",
    label: "Notifications",
    icon: "/img/menuNotification.svg",
    path: "#",
  },

  {
    id: "trips",
    label: "Trips",
    icon: "/img/route.svg",
    path: "#",
    children: [
      {
        id: "trips",
        label: "All Loads",
        path: "trips",
      },
      // {
      //   id: "all-loads",
      //   label: "All Loads",
      //   path: "all-loads",
      // },
    ],
  },

  {
    id: "goReadyTrucks",
    label: "Go Ready™  Trucks",
    icon: "/img/menuTruck.svg",
    path: "go-ready-trucks",
  },
  {
    id: "carriers",
    label: "Carriers",
    icon: "/img/user.svg",
    path: "carriers",
  },
  {
    id: "shippers",
    label: "Shippers",
    icon: "/img/user.svg",
    path: "#",
  },

  {
    id: "compliance",
    label: "Compliance",
    icon: "/img/menuCompliance.svg",
    path: "#",
    children: [
      {
        id: "compliance",
        label: "Compliance",
        path: "compliance",
      },
    ],
  },

  {
    id: "detention",
    label: "Detention",
    icon: "/img/menuClock.svg",
    path: "#",
    children: [
      {
        id: "detention",
        label: "Detention",
        path: "detention",
      },
    ],
  },

  {
    id: "integrations",
    label: "Integrations",
    icon: "/img/menuIntegrations.svg",
    path: "#",
    children: [
      {
        id: "integrations",
        label: "Integrations",
        path: "integrations",
      },
    ],
  },

  {
    id: "scorecards",
    label: "CoreCards",
    icon: "/img/menuScore.svg",
    path: "scorecards",
  },

  {
    id: "discussion",
    label: "Discussion",
    icon: "/img/menuDiscussion.svg",
    path: "#",
    children: [
      {
        id: "collabrations",
        label: "Collabrations",
        path: "collabrations",
      },
      {
        id: "discussion",
        label: "Discussion",
        path: "discussion",
      },
    ],
  },

  {
    id: "users",
    label: "Users",
    icon: "/img/user.svg",
    path: "/admin/users",
  },

  {
    id: "reviews",
    label: "Reviews",
    icon: "/img/user.svg",
    path: "/admin/reviews",
  },

  {
    id: "risk_assessments",
    label: "Risk Assessments",
    icon: "/img/user.svg",
    path: "/admin/risk_assessments",
  },
];
