import { useState } from "react";
import { useGetSmsResult } from "../../../../services/companyInfo.service";



export const useViolationProps = () => {

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: violationData } = useGetSmsResult({}, { basic_desc: "Unsafe Driving", offset: (page - 1) * limit, limit });

  const headData = [
    {
      label: "Violation Date",
      key: "insp_date",
    },
    {
      label: "Report Number",
      key: "report_number",
    },
    {
      label: "Type",
      key: "group_desc",
    },
    {
      label: "Description",
      key: "section_desc",
      thProps: {
        width: "480px",
      },
    },
    // {
    //   label: "OOS Violation?",
    //   key: "oos_violation",
    // },
    {
      label: "Time Weight",
      key: "time_weight",
    },
    {
      label: "Total Severity Weight",
      key: "total_severity_wght",
    },
    {
      label: "Violation Value",
      key: "viol_unit",
    },
  ];

  const bodyData = violationData?.response;
  console.log({ bodyData });

  return {
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count: violationData?.count,
  };
};
