const useDetentionProps = () => {
  const tableElementsRequests = [
    {
      label: "Trip ID",
      key: "trip_id",
      sortKey: "id",
      sortable: true,
    },
    {
      label: "Customer",
      key: "customer",
      sortKey: "customer.name",
      sortable: true,
    },
    {
      label: "Origin",
      key: "origin",
      sortKey: "origin.[0].address",
      sortable: true,
    },
    {
      label: "Destination",
      key: "destination",
      sortKey: "destination.[0].address",
      sortable: true,
    },
    {
      label: "Rate",
      key: "rate",
      sortKey: "total_rates",
      sortable: true,
    },
    {
      label: "Load type",
      key: "load_type",
      sortKey: "origin.[0].load_type.label",
      sortable: true,
    },
    {
      label: "Represantative",
      key: "represantative",
      sortKey: "represantative.legal_name",
      sortable: true,
    },
    {
      label: "Total Waited Time",
      key: "total_waited_time",
      sortKey: "total_waited_time",
      sortable: false,
    },
    {
      label: "Requested Rate",
      key: "requested_rate",
      sortKey: "requested_rate",
      sortable: true,
    },
    {
      label: "Action",
      key: "action",
      sortKey: "action",
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
