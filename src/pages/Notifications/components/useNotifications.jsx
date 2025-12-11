export const useNotifications = () => {
  const headData = [
    {
      label: "Description",
      key: "description",
    },
    {
      label: "Severity",
      key: "severity",
    },
    {
      label: "Received",
      key: "received",
    },
    {
      label: "Due",
      key: "due",
    },
    {
      label: "Actions",
      key: "actions",
    },
  ];

  return {headData};
};
