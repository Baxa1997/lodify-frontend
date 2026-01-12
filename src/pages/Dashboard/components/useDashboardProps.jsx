import {useQuery} from "@tanstack/react-query";
import dashboardService from "@services/dashboardService";
import {useSelector} from "react-redux";
import carrierService from "@services/carrierService";

const useDashboardProps = () => {
  const clientType = useSelector((state) => state.auth.clientType);
  const {companies_id} = useSelector((state) => state.auth.user_data);
  const {brokers_id} = useSelector((state) => state.auth.user_data);

  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const companyType = isBroker ? "brokers_id" : "companies_id";

  const {data: tripsCountData = {}, isLoading: isTripsLoading} = useQuery({
    queryKey: ["TRIPS_COUNT", companies_id],
    queryFn: () =>
      dashboardService.getTripsCount({
        method: "get",
        object_data: {
          [companyType]: isBroker ? brokers_id : companies_id,
          client_type: isBroker ? "broker" : "carrier",
        },
        table: "trip_counts",
      }),
    select: (res) => res?.data || {},
  });

  const {data: performanceData = {}, isLoading: isPerformanceLoading} =
    useQuery({
      queryKey: ["PERFORMANCE_DATA", companies_id],
      queryFn: () =>
        dashboardService.getPerformanceData({
          method: "grade",
          object_data: {
            companies_id: companies_id,
          },
          table: "calculate",
        }),
      select: (res) => res?.data || {},
      enabled: Boolean(companies_id),
    });

  const {data: safetyData = [], isLoading: isSafetyLoading} = useQuery({
    queryKey: ["SAFETY_DATA", companies_id],
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

  const {data: brokerSafetyData = [], isLoading: isBrokerSafetyLoading} =
    useQuery({
      queryKey: ["BROKER_SAFETY_DATA", brokers_id],
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

  const {data: shippersScoreData = [], isLoading: isShippersLoading} = useQuery(
    {
      queryKey: ["SHIPPERS_SCORE_DATA", brokers_id],
      queryFn: () =>
        dashboardService.getBrokerSafetyData({
          method: "get",
          object_data: {
            brokers_id: brokers_id,
          },
          table: "broker_shippers",
        }),
      select: (res) => res?.data?.response || [],
      enabled: Boolean(brokers_id),
    }
  );

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

  const {data: nationalAverageData = {}, isLoading: isNationalAverageLoading} =
    useQuery({
      queryKey: ["NATIONAL_AVERAGE"],
      queryFn: () =>
        dashboardService.getNationalAverage({
          data: {
            method: "get",
            object_data: {
              companies_id: companies_id,
            },
            table: "national_average",
          },
        }),
      select: (res) => res?.data?.response?.[0] || {},
    });

  const calculateGaugeLabel = (total, lateCount) => {
    if (lateCount / total > 0.5) {
      return "High";
    } else if (lateCount / total > 0.3) {
      return "Medium";
    } else {
      return "Good";
    }
  };

  const calculateGaugeColor = (total, lateCount) => {
    if (lateCount / total > 0.5) {
      return "#EF4444";
    } else if (lateCount / total > 0.3) {
      return "#F97316";
    } else {
      return "#10B981";
    }
  };

  const tripsData = [
    {
      title: "Upcoming",
      total: tripsCountData?.upcoming?.count,
      gaugeValue: tripsCountData?.upcoming?.late_count,
      gaugeLabel: calculateGaugeLabel(
        tripsCountData?.upcoming?.count,
        tripsCountData?.upcoming?.late_count
      ),
      gaugeColor: calculateGaugeColor(
        tripsCountData?.upcoming?.count,
        tripsCountData?.upcoming?.late_count
      ),
    },
    {
      title: "In Transit",
      total: tripsCountData?.in_transit?.count,
      gaugeValue: tripsCountData?.in_transit?.late_count,
      gaugeLabel: calculateGaugeLabel(
        tripsCountData?.in_transit?.count,
        tripsCountData?.in_transit?.late_count
      ),
      gaugeColor: calculateGaugeColor(
        tripsCountData?.in_transit?.count,
        tripsCountData?.in_transit?.late_count
      ),
    },
    {
      title: "History",
      total: tripsCountData?.history?.count,
      gaugeValue: tripsCountData?.history?.late_count,
      gaugeLabel: calculateGaugeLabel(
        tripsCountData?.history?.count,
        tripsCountData?.history?.late_count
      ),
      gaugeColor: calculateGaugeColor(
        tripsCountData?.history?.count,
        tripsCountData?.history?.late_count
      ),
    },
  ];

  return {
    isBroker,
    tripsData,
    performanceData,
    safetyData,
    brokerSafetyData,
    carrierInfoData,
    nationalAverageData,
    shippersScoreData,
    isTripsLoading,
    isPerformanceLoading,
    isSafetyLoading,
    isBrokerSafetyLoading,
    isCarrierInfoLoading: isLoading,
    isNationalAverageLoading,
    isShippersLoading,
  };
};

export default useDashboardProps;
