import React from "react";
import PerformanceFilter from "./components/PerformanceFilter";
import {ScoreCardsPerformance} from "./components/ScoreCardsPerformance";
import {PerformanceByDrivers} from "./components/PerformanceByDrivers";
import {useSelector} from "react-redux";
import {Box} from "@chakra-ui/react";
import DetailedMetricCard from "./components/DetailMetricCard";
import {PerformanceGrade} from "./components/PerformanceGrade";

const Performance = ({
  limit,
  setLimit,
  page,
  setPage,
  count,
  filterRange = "",
  driversData = [],
  performanceData = [],
  brokerSafetyData = [],
  setFilterRange = () => {},
  dateRange = {from: "", to: ""},
  isPerformanceLoading = false,
  isBrokerSafetyLoading = false,
  isDriversLoading = false,
}) => {
  const detailedData = {
    onTime: {
      percentage: performanceData?.on_time || 0,
      color: "#1570EF",
      subtitle: "Legs with no carrier controlled delays",
      description:
        "Tracks how often loads are picked up and delivered as scheduled.",
      details: [
        {
          label: "On time to pickup",
          value: performanceData?.on_time_data?.on_time_pickup || 0,
        },
        {
          label: "On time to Delivery",
          value: performanceData?.on_time_data?.on_time_delivery || 0,
        },
      ],
    },
    acceptance: {
      percentage: performanceData?.acceptance || 0,
      color: "#9333EA",
      subtitle: "Accepted work",
      description:
        "Measures the percentage of loads and blocks accepted without rejecti...",
      details: [
        {
          label: "Accepted loads",
          value: performanceData?.acceptance_data?.accepted_trips || 0,
        },
        {
          label: "Rejected loads",
          value: performanceData?.acceptance_data?.rejected_trips || 0,
        },
      ],
    },
    appUsage: {
      percentage: performanceData?.app_usage || 0,
      color: "#EC4899",
      subtitle: "App Usage",
      description:
        "Shows how consistently the Lodify app is used during trips.",
      details: [
        {
          label: "Location available",
          value: performanceData?.location_availability?.available || 0,
        },
        {
          label: "Location unavailable",
          value: performanceData?.location_availability?.not_available || 0,
        },
      ],
    },
    disruptionFree: {
      percentage: performanceData?.disruption_free || 0,
      color: "#1E40AF",
      subtitle: "Loads with no disruption",
      description:
        "Reflects the share of loads completed without service issues.",
      details: [
        {
          label: "Loads",
          value: performanceData?.disruption_free?.completed_orders_count || 0,
        },
        {
          label: "Stop time disruption",
          value: performanceData?.disruption_free?.stop_time_lt_100_count || 0,
        },
        {
          label: "Team change disruption",
          value: performanceData?.disruption_free?.team_change_100_count || 0,
        },
      ],
    },
  };
  
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = Boolean(brokersId);
  return (
    <>
      {!isBroker && (
        <PerformanceGrade
          performanceData={performanceData}
          filterRange={filterRange}
          dateRange={dateRange}
          isLoading={isPerformanceLoading}
        />
      )}
      <PerformanceFilter
        filterRange={filterRange}
        setFilterRange={setFilterRange}
      />

      {!isBroker && (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap="24px">
          <DetailedMetricCard
            title="On Time"
            data={detailedData.onTime}
            isLoading={isPerformanceLoading}
          />
          <DetailedMetricCard
            title="Acceptance"
            data={detailedData.acceptance}
            isLoading={isPerformanceLoading}
          />

          <DetailedMetricCard
            title="App Usage"
            data={detailedData.appUsage}
            isLoading={isPerformanceLoading}
          />
          <DetailedMetricCard
            title="Disruption Free"
            data={detailedData.disruptionFree}
            isLoading={isPerformanceLoading}
          />
        </Box>
      )}

      <ScoreCardsPerformance
        brokerSafetyData={brokerSafetyData}
        isLoading={isBrokerSafetyLoading}
      />
      <PerformanceByDrivers
        driversData={driversData}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        count={count}
        isLoading={isDriversLoading}
      />
    </>
  );
};

export default Performance;
