import React from "react";
import {PerformanceGrade} from "../Performance/components/PerformanceGrade";
import PerformanceFilter from "../Performance/components/PerformanceFilter";
import DetailedMetricCard from "../Performance/components/DetailMetricCard";
import {Box} from "@chakra-ui/react";

const CompanyExecution = () => {
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
          title="On time"
          data={{
            percentage: 100,
            color: "#1570EF",
            details: [
              {
                value: "100.0%",
                label: "On time to origin",
                contribution: "37.5% of score",
              },
              {
                value: "100.0%",
                label: "On time to destination",
                contribution: "62.5% of score",
              },
            ],
            subtitle: "Legs with no carrier controlled delays",
            description:
              "Tracks how often loads are picked up and delivered as scheduled.",
          }}
        />

        <DetailedMetricCard
          title="Acceptance"
          data={{
            percentage: 100,
            color: "#9333EA",
            details: [
              {
                value: "0",
                label: "Rejected blocks",
                contribution: null,
              },
              {
                value: "0",
                label: "Rejected loads",
                contribution: "62.5% of score",
              },
            ],
            subtitle: "Accepted work",
            description:
              "Measures the percentage of loads and blocks accepted without rejection",
          }}
        />

        <DetailedMetricCard
          title="App usage"
          data={{
            percentage: 99.8,
            color: "#EC4899",
            details: [
              {
                value: "100.0%",
                label: "On time to origin",
                contribution: "37.5% of score",
              },
              {
                value: "99.8%",
                label: "Location availability",
                contribution: "62.5% of score",
              },
            ],
            subtitle: "App Usage",
            description:
              "Shows how consistently the Lodify app is used during trips.",
          }}
        />

        <DetailedMetricCard
          title="Disruption-free"
          data={{
            percentage: 100,
            color: "#1E40AF",
            details: [
              {
                value: "0",
                label: "Loads with disruption across",
                contribution: null,
              },
              {
                value: "119",
                label: "Completed loads",
                contribution: null,
              },
            ],
            subtitle: "Loads with no disruption",
            description:
              "Reflects the share of loads completed without service issues.",
          }}
        />
      </Box>
    </>
  );
};

export default CompanyExecution;
