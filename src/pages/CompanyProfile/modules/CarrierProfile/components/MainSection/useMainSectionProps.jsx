export const useMainSectionProps = () => {

  const btnStyleProps = {
    borderRadius: "8px",
    fontSize: "14px",
    padding: "8px 14px",
    height: "36px",
  };


  const headData = [
    {
      label: "Type",
      key: "type",
    },
    {
      label: "Expiration Date",
      key: "expirationDate",
    },
    {
      label: "Coverage Limit",
      key: "coverageLimit",
    },
  ];

  const bodyData = [
    {
      type: "General Liability",
      expirationDate: "07/05/2026",
      coverageLimit: "1,000,000",
    },
    {
      type: "General Liability",
      expirationDate: "07/05/2026",
      coverageLimit: "1,000,000",
    },
    {
      type: "General Liability",
      coverageLimit: "1,000,000",
      expirationDate: "07/05/2026",
    },
  ];

  const pieData = [
    ["Category", "Value"],
    ["Tracked", 80],
    ["Non-Tracked", 20],
  ];
  
  const options = {
    pieHole: 0.7,
    legend: {
      position: "center",
      alignment: "center",
      textStyle: {
        color: "#535862",
        fontSize: 14,
      },
    },
    pieSliceText: "none",
    slices: {
      0: { color: "#1570EF" },
      1: { color: "#F79009" }, 
    },
    chartArea: { width: "110%", height: "90%" },
  };

  return { headData, bodyData, pieData, options, btnStyleProps };
};
