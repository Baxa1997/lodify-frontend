export const useHistoryProps = () => {
  const tableHeadings = [
    {label: "", key: "count"},
    {label: "Origin", key: "origin"},
    {label: "", key: "arrow"},
    {label: "Stop", key: "stop"},
    {label: "Deadhead", key: "deadhead"},
    {label: "Destination", key: "destination"},
    {label: "Rate", key: "rate"},
    {label: "Accessorials", key: "accessorials"},
    {label: "Assignees", key: "assignees"},
  ];

  const detailedStopsHeadings = [
    {label: "", key: "counts"},
    {label: "Address", key: "address"},
    {label: "", key: "count"},
    {label: "Appt time", key: "apptTime"},
    {label: "BOL#", key: "bol"},
    {label: "Phone #", key: "phone"},
    {label: "Load/Equipment", key: "loadEquipment"},
    {label: "Weight", key: "weight"},
    {label: "Qty", key: "qty"},
    {label: "Load size", key: "loadSize"},
    {label: "Special Instruction for driver", key: "specialInstruction"},
  ];

  return {
    tableHeadings,
    detailedStopsHeadings,
  };
};
