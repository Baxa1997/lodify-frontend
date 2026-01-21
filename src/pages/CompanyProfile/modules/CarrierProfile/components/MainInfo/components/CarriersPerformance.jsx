import React from "react";
import {Box, Text, Flex, HStack, Button, Tooltip, Link} from "@chakra-ui/react";

export const CarriersPerformance = ({performanceData, performanceDatas}) => {

  const defaultData = {
    overall: {
      score: performanceDatas?.overall || 0 + "%" || "0%",
      grade: performanceDatas?.grade,
      gradeColor: "#10B981",
    },
    onTime: {
      percentage: performanceDatas?.on_time || 0 + "%" || "0%",
      change: "0.0%",
      period: "1 week",
    },
    acceptance: {
      percentage: performanceDatas?.acceptance || 0 + "%" || "0%",
      change: "0.0%",
      period: "1 week",
    },
    appUsage: {
      percentage: performanceDatas?.app_usage || 0 + "%" || "0%",
      change: "0.0%",
      period: "1 week",
    },
    disruptionFree: {
      percentage: performanceDatas?.disruption_free?.disruption_percentage || 0 + "%" || "0%",
      change: "0.0%",
      period: "1 week",
    },
  };

  const data = performanceData || defaultData;

  const MetricCard = ({label, value, change, period, tooltipLabel}) => (
    <Box
      bg="white"
      borderRadius="8px"
      p="16px"
      border="1px solid #E5E7EB"
      flex="1"
      minW="0">
      <Flex alignItems="center" gap="4px" mb="8px">
        <Text fontSize="14px" fontWeight="500" color="#414651">
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
              w="14px"
              h="14px"
              cursor="pointer"
            />
          </Tooltip>
        )}
      </Flex>
      <Text fontSize="24px" fontWeight="600" color="#181D27" mb="4px">
        {value}%
      </Text>
      {change !== undefined && (
        <Text fontSize="12px" color="#6B7280" fontWeight="400">
          {change} {period}
        </Text>
      )}
    </Box>
  );

  const OverallCard = ({score, grade, gradeColor}) => (
    <Box
      bg="white"
      borderRadius="8px"
      p="16px"
      border="1px solid #E5E7EB"
      flex="1"
      minW="0">
      <Text fontSize="14px" fontWeight="500" color="#414651" mb="8px">
        Overall
      </Text>
      <Flex alignItems="center" gap="12px" mb="8px">
        <Text fontSize="24px" fontWeight="600" color="#181D27">
          {score}%
        </Text>
        <Box
          w="40px"
          h="40px"
          borderRadius="50%"
          bg={gradeColor}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Text fontSize="20px" fontWeight="700" color="white" lineHeight="1">
            {grade}
          </Text>
        </Box>
      </Flex>
      <Link
        href="#"
        fontSize="14px"
        color="#175CD3"
        fontWeight="500"
        display="flex"
        alignItems="center"
        gap="4px"
        _hover={{textDecoration: "underline", color: "#EF6820"}}>
        <Box
          as="img"
          src="/img/questionRound.svg"
          alt="info"
          w="14px"
          h="14px"
        />
        How is my grade calculated?
      </Link>
    </Box>
  );

  return (
    <Box borderTop="1px solid #E9EAEB" pt="16px">
      <Text mb="20px" fontSize="16px" color="#181D27" fontWeight={600}>
        Carrier's Performance Score on Lodify
      </Text>
      <Flex gap="16px" mb="24px" flexWrap="wrap">
        <OverallCard
          score={performanceDatas?.overall}
          grade={data.overall.grade}
          gradeColor={data.overall.gradeColor}
        />
        <MetricCard
          label="On time"
          value={performanceDatas?.on_time}
          change={data.onTime.change}
          period={data.onTime.period}
          tooltipLabel="On time delivery percentage"
        />
        <MetricCard
          label="Acceptance"
          value={performanceDatas?.acceptance}
          change={data.acceptance.change}
          period={data.acceptance.period}
          tooltipLabel="Acceptance rate"
        />
        <MetricCard
          label="App usage"
          value={performanceDatas?.app_usage}
          change={data.appUsage.change}
          period={data.appUsage.period}
          tooltipLabel="App usage percentage"
        />
        <MetricCard
          label="Disruption free"
          value={data.disruptionFree.percentage}
          change={data.disruptionFree.change}
          period={data.disruptionFree.period}
          tooltipLabel="Disruption free percentage"
        />
      </Flex>

      <Flex
        alignItems="center"
        justifyContent="space-between"
        pt="16px"
        borderTop="1px solid #E9EAEB">
        <HStack spacing="8px" alignItems="center">
          <Box
            as="img"
            src="/img/info.svg"
            alt="info"
            w="20px"
            h="20px"
            color="#6B7280"
          />
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Report Fraud
          </Text>
        </HStack>
        <HStack spacing="12px">
          <Button
            bg="#fff"
            color="#374151"
            borderRadius="8px"
            px="16px"
            py="8px"
            border="1px solid #D5D7DA"
            fontSize="14px"
            fontWeight="500"
            _hover={{bg: "#fff"}}>
            Report Fraud
          </Button>
          <Button
            bg="rgba(52, 199, 89, 0.1)"
            color="#16B364"
            border="1px solid #16B364"
            borderRadius="8px"
            px="16px"
            py="8px"
            fontSize="14px"
            fontWeight="500"
            _hover={{bg: "rgba(52, 199, 89, 1)"}}>
            Connected
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
