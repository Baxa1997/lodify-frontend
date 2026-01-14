const useDetentionProps = () => {
  const tableElementsRequests = [
    {
      label: "Trip ID",
      key: "trip_id",
      sortable: true,
    },
    {
      label: "Customer",
      key: "customer",
      sortable: true,
    },
    {
      label: "Origin",
      key: "origin",
      sortable: true,
    },
    {
      label: "Destination",
      key: "destination",
      sortable: true,
    },
    {
      label: "Rate",
      key: "rate",
      sortable: true,
    },
    {
      label: "Load type",
      key: "load_type",
      sortable: true,
    },
    {
      label: "Represantative",
      key: "represantative",
      sortable: true,
    },
    {
      label: "Total Waited Time",
      key: "total_waited_time",
      sortable: true,
    },
    {
      label: "Requested Rate",
      key: "requested_rate",
      sortable: true,
    },
    {
      label: "Action",
      key: "action",
      sortable: false,
    },
  ];

  const getLoadTypeColor = (loadType) => {
    switch (loadType) {
      case "Dry":
        return "#FF5B04";
      case "Refrigerated":
        return "#003B63";
      case "Temperature Controlled":
        return "#00707A";
      case "Other":
        return "#6B7280";
      case "Preloaded":
        return "#00707A";
      case "Drop":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  return {tableElementsRequests, getLoadTypeColor};
};

export default useDetentionProps;
