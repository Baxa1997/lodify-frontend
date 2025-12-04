import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";

export const useInspectionsProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {data: inspectionData} = useGetTable(
    "inspections",
    {},
    {data: JSON.stringify({companies_id, offset: (page - 1) * limit, limit})}
  );

  const headData = [
    {
      label: "Date",
      key: "insp_date",
    },
    {
      label: "Report Number",
      key: "report_number",
      sortable: true,
    },
    {
      label: "State",
      key: "report_state",
    },
    {
      label: "Flat Number",
      key: "unit_license",
    },
    {
      label: "Type",
      key: "unit_type_desc",
    },
    {
      label: "Total Violations",
      key: "total_violations",
    },
    {
      label: "OSS Violations",
      key: "oos_violations",
    },
  ];

  return {
    headData,
    bodyData: inspectionData?.response || [],
    page,
    setPage,
    limit,
    setLimit,
    count: inspectionData?.count || 0,
  };
};

