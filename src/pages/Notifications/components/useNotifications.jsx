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

  const data = [
    {
      description: "Notification 1",
      severity: "High",
      received: "2021-01-01",
      due: "2021-01-01",
      actions: "Action 1",
    },
    {
      description: "Notification 2",
      severity: "Medium",
      received: "2021-01-02",
      due: "2021-01-02",
      actions: "Action 2",
    },
    {
      description: "Notification 3",
      severity: "Low",
      received: "2021-01-03",
      due: "2021-01-03",
      actions: "Action 3",
    },
    {
      description: "Notification 4",
      severity: "Critical",
      received: "2021-01-04",
      due: "2021-01-04",
      actions: "Action 4",
    },
  ];

  return {headData, data};
};
