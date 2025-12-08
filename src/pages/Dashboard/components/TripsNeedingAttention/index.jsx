import React from "react";
import {Box, Flex} from "@chakra-ui/react";
import {TripCard} from "./TripCard";

export const TripsNeedingAttention = () => {
  const tripsData = [
    {
      title: "Upcoming",
      total: 50,
      gaugeValue: 10,
      gaugeLabel: "High",
      gaugeColor: "#EF4444",
    },
    {
      title: "In Transit",
      total: 31,
      gaugeValue: 2,
      gaugeLabel: "Medium",
      gaugeColor: "#F97316",
    },
    {
      title: "History",
      total: 112,
      gaugeValue: 0,
      gaugeLabel: "Good",
      gaugeColor: "#10B981",
    },
  ];

  return (
    <Box p="24px" bg="#fff" gap="24px" borderRadius={"12px"} mb="32px">
      <Box mb="20px">
        <Box fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
          Trips Needing Attention
        </Box>
      </Box>

      <Flex gap="24px" flexWrap={{base: "wrap", md: "nowrap"}}>
        {tripsData.map((trip, index) => (
          <TripCard key={index} {...trip} />
        ))}
      </Flex>
    </Box>
  );
};
