import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";
import {calculateMonthsFromDate} from "@utils/calculateRegisterTime";

export const useInspectionsProps = ({new_info}) => {
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
            limit: 10,
          },
          table: "inspection_history",
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  const {
    data: inspectionsCountData,
    isLoading: isInspectionsCountLoading,
    refetch: refetchInspectionsCount,
    isFetching: isInspectionsCountFetching,
  } = useQuery({
    queryKey: ["GET_INSPECTIONS_COUNT_DATA", companies_id],
    queryFn: () =>
      carrierService.getInspectionsData({
        data: {
          method: "get",
          object_data: {
            companies_id: companies_id,
          },
          table: "inspection_stat",
        },
      }),
    select: (res) => res?.data?.response || {},
    enabled: Boolean(companies_id),
  });

  const headData = [
    {
      label: "Date",
      key: "insp_date",
      format: "date",
    },
    {
      label: "Report Number",
      key: "report_number",
      sortable: true,
    },
    {
      label: "Unit License",
      key: "unit_license",
    },
    {
      label: "Unit Make",
      key: "unit_make",
    },
    {
      label: "Total Violations",
      key: "basic_viol",
    },
    {
      label: "OSS Violations",
      key: "oos_total",
    },
  ];

  const inspectionsCardsData = [
    {
      title: "Observed vs Reported Power Units in Fleet",
      count: inspectionsCountData?.inspection_count,
      total: `/${new_info?.power_units ?? 0}`,
    },
    {
      title: "Percentile Ranking Compared to Peers",
      count: `Top ${inspectionsCountData?.top_percent?.toFixed(0) || 0}%`,
    },
    {
      title: "Length of Authority",
      count: calculateMonthsFromDate(new_info?.register_time ?? 0),
      total: "+ months",
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
    inspectionsCountData,
    refetch,
    refetchInspectionsCount,
    inspectionsCardsData,
  };
};
