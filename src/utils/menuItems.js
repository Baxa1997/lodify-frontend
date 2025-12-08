export const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/img/dashboard.svg",
    path: "dashboard",
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
      // {
      //   id: "load_details",
      //   label: "Load Details",
      //   path: "all-loads",
      // },
      // {
      //   id: "accept-decline",
      //   label: "Accept / Decline",
      //   path: "accept-decline",
      // },

      {
        id: "tender-invitations",
        label: "Tender Invitations",
        path: "tender-invitations",
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
    id: "brokers",
    label: "Brokers",
    icon: "/img/user.svg",
    path: "brokers",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: "/img/user.svg",
    path: "reviews",
  },

  {
    id: "compliance",
    label: "Compliance",
    icon: "/img/menuCompliance.svg",
    path: "compliance",
  },
  {
    id: "detention",
    label: "Detention",
    icon: "/img/menuClock.svg",
    path: "#",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "/img/menuIntegrations.svg",
    path: "integrations",
  },

  {
    id: "scorecards",
    label: "Score Cards",
    icon: "/img/menuScore.svg",
    path: "#",
  },

  {
    id: "discussion",
    label: "Discussion",
    icon: "/img/menuDiscussion.svg",
    path: "collabrations",
  },

  {
    id: "users",
    label: "Users",
    icon: "/img/user.svg",
    path: "/admin/users",
  },
];

export const brokerMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/img/dashboard.svg",
    path: "dashboard",
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

      {
        id: "tender-invitations",
        label: "Tender Invitations",
        path: "tender-invitations",
      },
      // {
      //   id: "accept-decline",
      //   label: "Accept / Decline",
      //   path: "accept-decline",
      // },
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
    path: "shipper",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: "/img/user.svg",
    path: "/admin/reviews",
  },

  {
    id: "compliance",
    label: "Compliance",
    icon: "/img/menuCompliance.svg",
    path: "compliance",
  },

  {
    id: "detention",
    label: "Detention",
    icon: "/img/menuClock.svg",
    path: "#",
  },

  // {
  //   id: "integrations",
  //   label: "Integrations",
  //   icon: "/img/menuIntegrations.svg",
  //   path: "integrations",
  // },

  {
    id: "scorecards",
    label: "Score Cards",
    icon: "/img/menuScore.svg",
    path: "#",
  },

  {
    id: "discussion",
    label: "Discussion",
    icon: "/img/menuDiscussion.svg",
    path: "collabrations",
  },

  {
    id: "users",
    label: "Users",
    icon: "/img/user.svg",
    path: "/admin/users",
  },
];
