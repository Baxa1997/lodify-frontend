import React from "react";
import {Box, Text, Flex, Link, Tooltip} from "@chakra-ui/react";

export const PerformanceCard = ({
  label,
  value,
  change,
  period,
  grade,
  gradeColor,
  tooltipLabel,
  showGrade = false,
  showHelpLink = false,
  width = "170px",
}) => {
  if (showGrade) {
    return (
      <Box
        bg="white"
        p="20px"
        borderRadius="12px"
        border="1px solid #E5E7EB"
        minW="0"
        h="130px"
        w={width}>
        <Flex alignItems="center" gap="8px" mb="8px">
          <Text fontSize="14px" fontWeight="500" color="#181D27">
            {label}
          </Text>
        </Flex>
        <Flex h="32px" alignItems="center" gap="12px" mb="8px">
          <Text fontSize="24px" fontWeight="600" color="#181D27">
            {value}
          </Text>
          {grade && (
            <Box
              w="48px"
              h="32px"
              borderRadius="6px"
              bg={gradeColor || "#dcfae6"}
              display="flex"
              alignItems="center"
              border="1px solid #abefc6"
              justifyContent="center">
              <Text
                fontSize="24px"
                fontWeight="700"
                color="#079455"
                lineHeight="1">
                {grade}
              </Text>
            </Box>
          )}
        </Flex>
        {showHelpLink && (
          <Link
            href="#"
            fontSize="14px"
            color="#EF6820"
            fontWeight="500"
            display="flex"
            alignItems="center"
            gap="6px"
            _hover={{textDecoration: "underline", color: "#EF6820"}}>
            <Flex
              borderRadius="50%"
              border="1px solid #EF6820"
              p="4px"
              w="16px"
              h="16px"
              fontSize="12px"
              justifyContent="center"
              alignItems="center">
              ?
            </Flex>
            How is my grade calculated?
          </Link>
        )}
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderRadius="12px"
      p="16px"
      border="1px solid #E5E7EB"
      flex="1"
      minW="0"
      h="130px"
      w="175px">
      <Flex alignItems="center" gap="6px" mb="8px">
        <Text fontSize="12px" fontWeight="500" color="#181D27">
          {label}
        </Text>
        {tooltipLabel && (
          <Tooltip
            label={tooltipLabel}
            placement="top"
            bg="#1a365d"
            color="white"
            borderRadius="md"
            p="6px 10px"
            fontSize="12px">
            <Box
              as="img"
              src="/img/questionRound.svg"
              alt="info"
              w="16px"
              h="16px"
              cursor="pointer"
            />
          </Tooltip>
        )}
      </Flex>
      <Text fontSize="24px" fontWeight="600" color="#181D27" mb="8px">
        {value}
      </Text>
      <Text fontSize="12px" color="#6B7280" fontWeight="400">
        {change} {period}
      </Text>
    </Box>
  );
};
