const useDetentionProps = () => {
  const tableElementsRequests = [
    {
      label: "Trip ID",
      key: "trip_id",
    },
    {
      label: "Customer",
      key: "customer",
    },
    {
      label: "Origin",
      key: "origin",
    },
    {
      label: "Destination",
      key: "destination",
    },
    {
      label: "Rate",
      key: "rate",
    },
    {
      label: "Load Type",
      key: "load_type",
    },

    {
      label: "Represantative",
      key: "represantative",
    },

    {
      label: "Total Waited Time",
      key: "total_waited_time",
    },

    {
      label: "Requested Rate",
      key: "requested_rate",
    },
  ];

  return {tableElementsRequests};
};

export default useDetentionProps;
