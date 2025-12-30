import {useQuery} from "@tanstack/react-query";
import dashboardService from "@services/dashboardService";
import {useSelector} from "react-redux";

const useDashboardProps = () => {
  const {companies_id} = useSelector((state) => state.auth.user_data);

  const {data: tripsCountData = {}} = useQuery({
    queryKey: ["TRIPS_COUNT", companies_id],
    queryFn: () =>
      dashboardService.getTripsCount({
        method: "get",
        object_data: {
          companies_id: companies_id,
          client_type: "carrier",
        },
        table: "trip_counts",
      }),
    select: (res) => res?.data || {},
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
    tripsData,
  };
};

export default useDashboardProps;
