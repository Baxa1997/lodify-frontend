import {useSearchParams} from "react-router-dom";
import carrierService from "@services/carrierService";
import {useQuery} from "@tanstack/react-query";

export const useCarrierProfileProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const {
    data: carrierInfoData = {},
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["CARRIER_INFO", companies_id],
    queryFn: () =>
      carrierService.getCarrierInfo({
        data: {
          method: "get",
          object_data: {
            companies_id: companies_id,
          },
          table: "carrier_info",
        },
      }),
    select: (data) => data?.data?.response || {},
    enabled: Boolean(companies_id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const {data: performanceDatas} = useQuery({
    queryKey: ["GET_PERFORMANCE_DATA", companies_id],
    queryFn: () =>
      carrierService.getPerformanceData({
        data: {
          method: "grade",
          object_data: {
            companies_id: companies_id,
          },
          table: "calculate",
        },
      }),
    select: (res) => res?.data,
    enabled: Boolean(companies_id),
  });

  const generalInfo = {
    new_info: carrierInfoData,
    performance: performanceDatas,
  };

  return {
    generalInfo,
    isLoading,
    isFetching,
  };
};
