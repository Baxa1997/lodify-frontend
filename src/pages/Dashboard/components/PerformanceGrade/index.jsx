import React from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import {PerformanceCard} from "./PerformanceCard";
import LoadingState from "@components/LoadingState";
import EmptyState from "@components/EmptyState";
import {RiLineChartLine} from "react-icons/ri";

export const PerformanceGrade = ({performanceData = {}, isLoading = false}) => {
  console.log("performanceDataperformanceData", performanceData);
  const performanceDataObj = {
    overall: {
      label: "Overall",
      value: `${performanceData?.overall || 0}%`,
      grade: performanceData?.grade || "",
      gradeColor: "#dcfae6",
      showHelpLink: true,
    },
    onTime: {
      label: "On time",
      value: `${performanceData?.on_time || 0}%`,
      change: "0.0%",
      period: "1 week",
      tooltipLabel: "On time delivery percentage",
    },
    acceptance: {
      label: "Acceptance",
      value: `${performanceData?.acceptance || 0}%`,
      change: "0.0%",
      period: "1 week",
      tooltipLabel: "Acceptance rate",
    },
    appUsage: {
      label: "App usage",
      value: `${performanceData?.app_usage || 0}%`,
      change: "0.0%",
      period: "1 week",
      tooltipLabel: "App usage percentage",
    },
    disruptionFree: {
      label: "Disruption free",
      value: `${performanceData?.disruption_free?.disruption_percentage || 0}%`,
      change: "0.0%",
      period: "1 week",
      tooltipLabel: "Disruption free percentage",
    },
  };

  const hasData =
    performanceData?.overall ||
    performanceData?.on_time ||
    performanceData?.acceptance ||
    performanceData?.app_usage;

  return (
    <Box bg="#fff" p="24px" borderRadius="12px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "flex-start"}}
        flexDirection={{base: "column", md: "row"}}
        mb="20px"
        gap="12px">
        <Box>
          <Text fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
            Performance grade for week 32
          </Text>
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Showing date for last 6 active weeks view: May 18, 2025 - Jun 28,
            2025
          </Text>
        </Box>
        <Link
          href="#"
          fontSize="14px"
          color="#EF6820"
          fontWeight="500"
          display="flex"
          alignItems="center"
          gap="6px"
          _hover={{textDecoration: "underline", color: "#EF6820"}}
          whiteSpace="nowrap">
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
          What are active weeks?
        </Link>
      </Flex>

      {isLoading ? (
        <LoadingState height="200px" size="lg" />
      ) : hasData ? (
        <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
          <PerformanceCard
            width="300px"
            {...performanceDataObj.overall}
            showGrade={true}
          />
          <PerformanceCard {...performanceDataObj.onTime} />
          <PerformanceCard {...performanceDataObj.acceptance} />
          <PerformanceCard {...performanceDataObj.appUsage} />
          <PerformanceCard {...performanceDataObj.disruptionFree} />
        </Flex>
      ) : (
        <EmptyState
          icon={RiLineChartLine}
          message="No Performance Data Available"
          description="Start completing trips to see your performance metrics here."
          height="200px"
        />
      )}
    </Box>
  );
};
