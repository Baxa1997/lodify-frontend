import React from "react";
import {Box, Text, Flex, VStack} from "@chakra-ui/react";
import {Link as RouterLink} from "react-router-dom";
import {SemiCircularGauge} from "./SemiCircularGauge";

const TRIPS_PATH = "/admin/trips";

export const TripCard = ({
  title,
  tab,
  total,
  gaugeValue,
  gaugeLabel,
  gaugeColor,
}) => {
  const to = tab ? {pathname: TRIPS_PATH, search: `?tab=${tab}`} : null;

  const content = (
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
  );

  const cardProps = {
    bg: "white",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    flex: 1,
    minW: "0",
    pb: "20px",
    pt: "14px",
    cursor: to ? "pointer" : "default",
    _hover: to
      ? {
          borderColor: "orange.400",
          boxShadow: "sm",
        }
      : undefined,
  };

  if (to) {
    return (
      <RouterLink to={to} style={{textDecoration: "none", flex: 1, minWidth: 0}}>
        <Box {...cardProps}>{content}</Box>
      </RouterLink>
    );
  }

  return <Box {...cardProps}>{content}</Box>;
};
