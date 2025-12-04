import React from "react";
import {Box, Flex, Text} from "@chakra-ui/react";
import {metrics} from "./MetricsData";
import {StatusIcon} from "./StatusIcon";

export const MetricsSection = ({generalInfo}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(4, 1fr)"
      gap="20px"
      bg="white"
      borderRadius="12px">
      {metrics({generalInfo}).map((metric, index) => (
        <Flex key={index} alignItems="center" gap="20px" flexGrow={1}>
          <Flex flexDir={"row"} alignItems="center" gap="6px">
            <Text h="20px" fontSize="14px" color="#535862" whiteSpace="nowrap">
              {metric.label}:
            </Text>
            <Text h="20px" fontSize="14px" fontWeight="500" color="#181D27">
              {metric.value}
            </Text>
          </Flex>
          <StatusIcon status={metric.status} />
        </Flex>
      ))}
    </Box>
  );
};
