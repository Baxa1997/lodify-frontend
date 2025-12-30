import React from "react";
import {Box, Text, Flex, Link, VStack, Button} from "@chakra-ui/react";
import {SemiCircularGauge} from "./SemiCircularGauge";

export const TripCard = ({
  title,
  total,
  gaugeValue,
  gaugeLabel,
  gaugeColor,
}) => {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      flex="1"
      minW="0"
      pb="20px"
      pt="14px">
      <VStack spacing="16px" align="stretch">
        <Flex
          borderBottom="1px solid #E5E7EB"
          px="20px"
          pb="14px"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="16px" fontWeight="600" color="#181D27">
            {title}
          </Text>

          {/* <Button
            color="#EF6820"
            border="none"
            variant="outline"
            size="sm"
            colorScheme="primary">
            View
          </Button> */}
        </Flex>

        <Box textAlign="center">
          <Text fontSize="32px" fontWeight="700" color="#181D27" mb="4px">
            {total}
          </Text>
        </Box>

        <Flex justifyContent="center" alignItems="flex-end" h="80px">
          <SemiCircularGauge
            value={gaugeValue}
            maxValue={total}
            color={gaugeColor}
            label={gaugeLabel}
          />
        </Flex>
      </VStack>
    </Box>
  );
};
