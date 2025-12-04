import React from "react";
import {Box, Flex, Text} from "@chakra-ui/react";
import {useMainInfoProps} from "../useMainInfoProps";
import {verifiedCarrierResources} from "./MetricsData";

export const VerifiedCarrierResourcesSection = ({generalInfo}) => {
  const {getTypeImage} = useMainInfoProps();
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
      gap="12px"
      width="100%">
      {verifiedCarrierResources({generalInfo}).map((unit, index) => (
        <Flex
          key={index}
          bg="#EAF9F4"
          borderRadius="8px"
          border="1px solid #E9EAEB"
          justifyContent="space-between"
          p="14px 14px 14px 16px">
          <Box>
            <Text color="#535862" fontSize="16px">
              {unit.title}
            </Text>
            <Text color="#181D27" fontSize="22px" fontWeight="500">
              {unit.count}
            </Text>
          </Box>
          <Box>{getTypeImage(unit.title)}</Box>
        </Flex>
      ))}
    </Box>
  );
};
