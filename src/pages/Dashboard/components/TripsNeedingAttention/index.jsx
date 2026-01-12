import React from "react";
import {Box, Flex} from "@chakra-ui/react";
import {TripCard} from "./TripCard";
import LoadingState from "@components/LoadingState";
import EmptyState from "@components/EmptyState";
import {RiAlertLine} from "react-icons/ri";

export const TripsNeedingAttention = ({tripsData = [], isLoading = false}) => {
  return (
    <Box p="24px" bg="#fff" gap="24px" borderRadius={"12px"} mb="32px">
      <Box mb="20px">
        <Box fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
          Trips Needing Attention
        </Box>
      </Box>

      {isLoading ? (
        <LoadingState height="150px" size="lg" />
      ) : tripsData?.length > 0 ? (
        <Flex gap="24px" flexWrap={{base: "wrap", md: "nowrap"}}>
          {tripsData?.map((trip, index) => (
            <TripCard key={index} {...trip} />
          ))}
        </Flex>
      ) : (
        <EmptyState
          icon={RiAlertLine}
          message="No Trips Needing Attention"
          description="All your trips are running smoothly. Check back later for any updates."
          height="150px"
        />
      )}
    </Box>
  );
};
