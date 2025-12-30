import React, {useMemo} from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import {PerformanceCard} from "./PerformanceCard";

export const PerformanceGrade = ({
  performanceData = {},
  filterRange = "last_6_active_weeks",
  dateRange = {from: "", to: ""},
}) => {
  const getFilterLabel = (range) => {
    switch (range) {
      case "last_6_active_weeks":
        return "Last 6 active weeks";
      case "last_7_days":
        return "Last 7 Days";
      case "last_30_days":
        return "Last 30 Days";
      case "last_90_days":
        return "Last 90 Days";
      default:
        return "Last 6 active weeks";
    }
  };

  const formattedDateRange = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return "";
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    };

    const fromDate = formatDate(dateRange.from);
    const toDate = formatDate(dateRange.to);
    return `${fromDate} - ${toDate}`;
  }, [dateRange]);

  const filterLabel = getFilterLabel(filterRange);
  const performanceDataValue = {
    overall: {
      label: "Overall",
      value: performanceData?.overall + "%",
      grade: performanceData?.grade || "",
      gradeColor: "#dcfae6",
      showHelpLink: true,
    },
    onTime: {
      label: "On time",
      value: performanceData?.on_time + "%",
      change: performanceData?.on_time || 0,
      period: "1 week",
      tooltipLabel: "On time delivery percentage",
    },
    acceptance: {
      label: "Acceptance",
      value: performanceData?.acceptance + "%",
      change: performanceData?.acceptance || 0,
      period: "1 week",
      tooltipLabel: "Acceptance rate",
    },
    appUsage: {
      label: "App usage",
      value: performanceData?.app_usage + "%",
      change: performanceData?.app_usage || 0,
      period: "1 week",
      tooltipLabel: "App usage percentage",
    },
    // disruptionFree: {
    //   label: "Disruption free",
    //   value: "100.0%",
    //   change: "0.0%",
    //   period: "1 week",
    //   tooltipLabel: "Disruption free percentage",
    // },
  };

  return (
    <Box bg="#fff" p="24px 0" borderRadius="12px">
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
          {formattedDateRange && (
            <Text fontSize="14px" color="#6B7280" fontWeight="400">
              Showing date for {filterLabel.toLowerCase()} view:{" "}
              {formattedDateRange}
            </Text>
          )}
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

      <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
        <PerformanceCard
          width="300px"
          {...performanceDataValue.overall}
          showGrade={true}
        />
        <PerformanceCard {...performanceDataValue.onTime} />
        <PerformanceCard {...performanceDataValue.acceptance} />
        <PerformanceCard {...performanceDataValue.appUsage} />
        {/* <PerformanceCard {...performanceData.disruptionFree} /> */}
      </Flex>
    </Box>
  );
};
