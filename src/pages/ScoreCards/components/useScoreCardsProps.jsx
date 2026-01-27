import React, {useState, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import dashboardService from "@services/dashboardService";
import {useSelector} from "react-redux";

const useScoreCardsProps = () => {
  const {companies_id} = useSelector((state) => state.auth.user_data);
  const {brokers_id} = useSelector((state) => state.auth.user_data);
  const [filterRange, setFilterRange] = useState("last_6_active_weeks");
  const isBroker = Boolean(brokers_id);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  const driverType = isBroker ? "brokers_id" : "companies_id";

  const dateRange = useMemo(() => {
    const now = new Date();
    const to = now.toISOString();

    let from;
    switch (filterRange) {
      case "last_6_active_weeks":
        const sixWeeksAgo = new Date(now);
        sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);
        sixWeeksAgo.setHours(0, 0, 0, 0);
        from = sixWeeksAgo.toISOString();
        break;
      case "last_7_days":
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        from = sevenDaysAgo.toISOString();
        break;
      case "last_30_days":
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        from = thirtyDaysAgo.toISOString();
        break;
      case "last_90_days":
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        ninetyDaysAgo.setHours(0, 0, 0, 0);
        from = ninetyDaysAgo.toISOString();
        break;
      default:
        const defaultFrom = new Date(now);
        defaultFrom.setDate(defaultFrom.getDate() - 42);
        defaultFrom.setHours(0, 0, 0, 0);
        from = defaultFrom.toISOString();
    }

    return {from, to};
  }, [filterRange]);

  const {
    data: brokerSafetyData = [],
    isLoading: isBrokerSafetyLoading,
  } = useQuery({
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

  const {
    data: driversData = {},
    isLoading: isDriversLoading,
  } = useQuery({
    queryKey: ["GET_DRIVERS_DATA", brokers_id, limit, offset, companies_id],
    queryFn: () =>
      dashboardService.getPerformanceData({
        method: "get",
        object_data: {
          [driverType]: isBroker ? brokers_id : companies_id,
          limit: limit,
          offset: offset,
        },
        table: "drivers",
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(brokers_id || companies_id),
  });

  const {
    data: performanceData = {},
    isLoading: isPerformanceLoading,
  } = useQuery({
    queryKey: [
      "PERFORMANCE_GRADE",
      brokers_id,
      filterRange,
      dateRange.from,
      dateRange.to,
    ],
    queryFn: () =>
      dashboardService.getPerformanceData({
        method: "grade",
        object_data: {
          companies_id: companies_id,
          from: dateRange.from,
          to: dateRange.to,
        },
        table: "calculate",
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  const {
    data: safetyData = [],
    isLoading: isSafetyLoading,
  } = useQuery({
    queryKey: ["GET_SAFETY_DATA", companies_id],
    queryFn: () =>
      dashboardService.getSafetyData({
        method: "list",
        object_data: {
          companies_id: companies_id,
        },
        table: "violation_percentages",
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(!brokers_id && companies_id),
  });

  return {
    brokerSafetyData,
    driversData: driversData?.response,
    count: driversData?.count,
    limit,
    setLimit,
    page,
    setPage,
    filterRange,
    setFilterRange,
    performanceData,
    dateRange,
    safetyData,
    isBrokerSafetyLoading,
    isDriversLoading,
    isPerformanceLoading,
    isSafetyLoading,
  };
};

export default useScoreCardsProps;
