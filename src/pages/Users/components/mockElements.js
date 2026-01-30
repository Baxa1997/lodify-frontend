import {USER_STATUS} from "../../../constants";

export const tableHeading = [
  {
    label: "First Name",
    key: "first_name",
    sortable: true,
  },
  {
    label: "Last Name",
    key: "last_name",
    sortable: true,
  },
  {
    label: "Email Address",
    key: "email",
    sortable: true,
  },
  {
    label: "Phone Number",
    key: "phone",
    sortable: true,
  },
  {
    label: "Roles",
    key: "role_id",
    sortable: true,
  },
  // {
  //   label: "Domiciles",
  //   key: "domiciles",
  //   sortable: true,
  // },
  {
    label: "Status",
    key: "status",
    sortable: true,
  },
];

export const getStatusColor = (status) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return "green";
    case USER_STATUS.INVITE_EXPIRED:
      return "orange";
    case USER_STATUS.PENDING:
      return "yellow";
    case USER_STATUS.INACTIVE:
      return "red";
    default:
      return "gray";
  }
};
