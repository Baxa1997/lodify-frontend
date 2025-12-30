import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import dashboardService from "@services/dashboardService";
import {useSelector} from "react-redux";

const useScoreCardsProps = () => {
  const clientType = useSelector((state) => state.auth.clientType);
  const {companies_id} = useSelector((state) => state.auth.user_data);
  const {brokers_id} = useSelector((state) => state.auth.user_data);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  const {data: brokerSafetyData = []} = useQuery({
    queryKey: ["GET_BROKER_SAFETY_DATA", brokers_id],
    queryFn: () =>
      dashboardService.getBrokerSafetyData({
        method: "get",
        object_data: {
          brokers_id: brokers_id,
        },
        table: "broker_carriers",
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(brokers_id),
  });

  const {data: driversData = {}} = useQuery({
    queryKey: ["GET_DRIVERS_DATA", brokers_id, limit, offset],
    queryFn: () =>
      dashboardService.getPerformanceData({
        method: "get",
        object_data: {
          brokers_id: brokers_id,
          limit: limit,
          offset: offset,
        },
        table: "drivers",
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(brokers_id),
  });

  return {
    brokerSafetyData,
    driversData: driversData?.response,
    count: driversData?.count,
    limit,
    setLimit,
    page,
    setPage,
  };
};

export default useScoreCardsProps;
