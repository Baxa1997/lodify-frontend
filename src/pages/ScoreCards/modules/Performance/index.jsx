import React from "react";
import {PerformanceGrade} from "./components/PerformanceGrade";
import PerformanceFilter from "./components/PerformanceFilter";
import DetailedMetricCard from "./components/DetailMetricCard";
import {Box} from "@chakra-ui/react";
import {ScoreCardsPerformance} from "./components/ScoreCardsPerformance";
import {PerformanceByDrivers} from "./components/PerformanceByDrivers";

const Performance = () => {
  return (
    <>
      <PerformanceGrade />
      <PerformanceFilter />

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap="24px">
        <DetailedMetricCard
          title="Overall"
          data={{
            percentage: 90,
            color: "#155EEF",
            details: {
              value: "100",
              label: "On time to origin 37.5% of score",
              contribution: "100",
              subtitle: "Legs with no carrier controlled delays",
              description:
                "Tracks how often loads are picked up and delivered as scheduled.",
            },
          }}
        />

        <DetailedMetricCard
          title="Acceptance"
          data={{
            percentage: 90,
            color: "#6938EF",
            details: {
              value: "100",
              label: "Rejected blocks 62.5% of score",
              contribution: "100",
              subtitle: "Accepted work",
              description:
                "Measures the percentage of loads and blocks accepted without rejection",
            },
          }}
        />

        <DetailedMetricCard
          title="App usage"
          data={{
            percentage: 90,
            color: "#DD2590",
            details: {
              value: "100",
              label: "On time to origin",
              contribution: "100",
              subtitle: "App usage",
              description:
                "Shows how consistently the Lodify app is used during trips.",
            },
          }}
        />

        <DetailedMetricCard
          title="Disruption-free"
          data={{
            percentage: 90,
            color: "#3E4784",
            details: {
              value: "100",
              label: "Loads with disruption across",
              contribution: "100",
              subtitle: "Loads with no disruption",
              description:
                "Reflects the share of loads completed without service issues.",
            },
          }}
        />
      </Box>

      <ScoreCardsPerformance />
      <PerformanceByDrivers />
    </>
  );
};

export default Performance;
