import {useQuery} from "@tanstack/react-query";
import dashboardService from "@services/dashboardService";
import {useSelector} from "react-redux";

const useDashboardProps = () => {
  const clientType = useSelector((state) => state.auth.clientType);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const {companies_id} = useSelector((state) => state.auth.user_data);
  const {brokers_id} = useSelector((state) => state.auth.user_data);

  const companyType = isBroker ? "brokers_id" : "companies_id";

  const {data: tripsCountData = {}} = useQuery({
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

  const {data: performanceData = {}} = useQuery({
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

  const {data: safetyData = []} = useQuery({
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

  const {data: brokerSafetyData = []} = useQuery({
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
  };
};

export default useDashboardProps;
