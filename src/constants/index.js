export const PAGINATION_OPTIONS = [10, 25, 50, 100];

export const API_ENDPOINTS = {
  USERS: "/api/users",
  AUTH: "/api/auth",
  DASHBOARD: "/api/dashboard",
};

export const ROUTES = {
  LOGIN: "/login",
  ROLE_SELECTION: "/role-selection",
  REGISTER: "/register",
  PHONE_VERIFICATION: "/phone-verification",
  DASHBOARD: "/admin/dashboard",
  USERS: "/admin/users",
  DRIVERS: "/admin/drivers",
  ASSETS: "/admin/assets",
};

export const USER_STATUS = {
  ACTIVE: "Active",
  INVITE_EXPIRED: "Invite Expired",
  PENDING: "Pending",
  INACTIVE: "Inactive",
};

export const USER_ROLES = {
  PRIMARY_ADMIN: "Primary Admin",
  ADMIN: "Admin",
  DISPATCHER: "Dispatcher",
  DRIVER: "Driver",
};

export const TABLE_COLUMNS = {
  FULL_NAME: "Full Name",
  EMAIL_ADDRESS: "Email Address",
  PHONE_NUMBER: "Phone Number",
  ROLES: "Roles",
  DOMICILES: "Domiciles",
  STATUS: "Status",
};
