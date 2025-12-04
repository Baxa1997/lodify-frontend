import React from "react";
import {Flex, Box, Text} from "@chakra-ui/react";
import {useMainInfoProps} from "../useMainInfoProps";
import {powerUnits} from "./MetricsData";

export const PowerUnitsSection = ({generalInfo, uncategorizedCount}) => {
  const {getTypeImage} = useMainInfoProps();
  return (
    <Flex borderBottom="1px solid #E9EAEB" p="16px 0">
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap="12px"
        width="100%">
        {powerUnits({generalInfo, uncategorizedCount}).map((unit, index) => (
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
    </Flex>
  );
};
