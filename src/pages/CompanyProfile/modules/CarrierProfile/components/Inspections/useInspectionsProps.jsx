import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";

export const useInspectionsProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: inspectionsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["GET_INSPECTIONS_DATA", companies_id, page],
    queryFn: () =>
      carrierService.getInspectionsData({
        data: {
          method: "list",
          object_data: {
            companies_id: companies_id,
            page: page,
            limit: limit,
          },
          table: "inspection_history",
        },
      }),
    select: (res) => res?.data || {},
    enabled: false,
  });

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
    inspectionsData,
    page,
    setPage,
    limit,
    setLimit,
    count: 0,
    isLoading,
    isFetching,
    refetch,
  };
};
