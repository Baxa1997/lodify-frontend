import React from "react";
import {Box, Text, Tooltip, VStack} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";

export const VinmatchedData = ({
  matchData = {},
  title = "",
  description = "",
  iconSize = "20px",
  iconColor = "#EF6820",
  placement = "top",
}) => {
  // If matchData has percentage, matched_vin, total_vins (VIN Match format)
  if (matchData.percentage !== undefined || matchData.matched_vin !== undefined) {
    const {percentage = 0, matched_vin = 0, total_vins = 0} = matchData;
    const tooltipTitle = title || "VIN Match Details";
    const tooltipDescription = description || `VIN match was matching. Percentage is ${percentage}%`;

    return (
      <Tooltip
        hasArrow
        placement={placement}
        bg="#fff"
        color="#181D27"
        borderRadius="8px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
        p={3}
        label={
          <Box minW="180px">
            <VStack align="start" spacing={2}>
              <Text fontSize="12px" fontWeight="600" color="#181D27">
                {tooltipTitle}
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="11px" color="#6B7280" lineHeight="1.4">
                  {tooltipDescription}
                </Text>
                <Text fontSize="11px" color="#6B7280" lineHeight="1.4">
                  Matched VINs: {matched_vin} / {total_vins}
                </Text>
              </VStack>
            </VStack>
          </Box>
        }>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer">
          <AiOutlineExclamationCircle
            width={iconSize}
            height={iconSize}
            fontSize={iconSize}
            color={iconColor}
          />
        </Box>
      </Tooltip>
    );
  }

  // Generic format for other matching data types
  const tooltipTitle = title || "Match Details";
  const tooltipDescription = description || "Match information";

  return (
    <Tooltip
      hasArrow
      placement={placement}
      bg="#fff"
      color="#181D27"
      borderRadius="8px"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
      p={3}
      label={
        <Box minW="180px">
          <VStack align="start" spacing={2}>
            <Text fontSize="12px" fontWeight="600" color="#181D27">
              {tooltipTitle}
            </Text>
            <VStack align="start" spacing={1}>
              <Text fontSize="11px" color="#6B7280" lineHeight="1.4">
                {tooltipDescription}
              </Text>
              {Object.keys(matchData).length > 0 && (
                <VStack align="start" spacing={0.5} mt={1}>
                  {Object.entries(matchData)
                    .filter(([key, value]) => {
                      // Filter out changed_at if it's missing or empty
                      if (key === "changed_at" && (!value || value === "")) {
                        return false;
                      }
                      return value !== null && value !== undefined && value !== "";
                    })
                    .map(([key, value]) => (
                      <Text key={key} fontSize="11px" color="#6B7280" lineHeight="1.4">
                        {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}: {String(value)}
                      </Text>
                    ))}
                </VStack>
              )}
            </VStack>
          </VStack>
        </Box>
      }>
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer">
        <AiOutlineExclamationCircle
          width={iconSize}
          height={iconSize}
          fontSize={iconSize}
          color={iconColor}
        />
      </Box>
    </Tooltip>
  );
};
