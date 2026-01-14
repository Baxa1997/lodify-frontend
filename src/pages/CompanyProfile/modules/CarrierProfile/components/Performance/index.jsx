import React, {useEffect, useRef, useState} from "react";
import {Box, Text, Flex, VStack, Link, Tooltip} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import Chart from "react-google-charts";
import DetailedMetricCard from "./DetailMetricCard";

export const Performance = ({performanceData}) => {
  const summaryData = {
    overall: {
      score: `${performanceData?.overall || 0}%`,
      grade: performanceData?.grade,
      gradeColor: "#10B981",
    },
    onTime: {
      percentage: `${performanceData?.on_time || 0}%`,
      change: "0.0%",
      period: "1 week",
    },
    acceptance: {
      percentage: `${performanceData?.acceptance || 0}%`,
      change: "0.0%",
      period: "1 week",
    },
    appUsage: {
      percentage: `${performanceData?.app_usage || 0}%`,
      change: "0.0%",
      period: "1 week",
    },
    disruptionFree: {
      percentage: `${
        performanceData?.disruption_free?.disruption_percentage || 0
      }%`,
      change: "0.0%",
      period: "1 week",
    },
  };

  const detailedData = {
    onTime: {
      percentage: performanceData?.on_time || 0,
      color: "#1570EF",
      subtitle: "Legs with no carrier controlled delays",
      description:
        "Tracks how often loads are picked up and delivered as scheduled.",
      details: [
        {
          label: "On time to pickup",
          value: performanceData?.on_time_data?.on_time_pickup || 0,
        },
        {
          label: "On time to Delivery",
          value: performanceData?.on_time_data?.on_time_delivery || 0,
        },
      ],
    },
    acceptance: {
      percentage: performanceData?.acceptance || 0,
      color: "#9333EA",
      subtitle: "Accepted work",
      description:
        "Measures the percentage of loads and blocks accepted without rejecti...",
      details: [
        {
          label: "Accepted loads",
          value: performanceData?.acceptance_data?.accepted_trips || 0,
        },
        {
          label: "Rejected loads",
          value: performanceData?.acceptance_data?.rejected_trips || 0,
        },
      ],
    },
    appUsage: {
      percentage: performanceData?.app_usage || 0,
      color: "#EC4899",
      subtitle: "App Usage",
      description:
        "Shows how consistently the Lodify app is used during trips.",
      details: [
        {
          label: "Location available",
          value: performanceData?.location_availability?.available || 0,
        },
        {
          label: "Location unavailable",
          value: performanceData?.location_availability?.not_available || 0,
        },
      ],
    },
    disruptionFree: {
      percentage: performanceData?.disruption_free || 0,
      color: "#1E40AF",
      subtitle: "Loads with no disruption",
      description:
        "Reflects the share of loads completed without service issues.",
      details: [
        {
          label: "Loads",
          value: performanceData?.disruption_free?.completed_orders_count || 0,
        },
        {
          label: "Stop time disruption",
          value: performanceData?.disruption_free?.stop_time_lt_100_count || 0,
        },
        {
          label: "Team change disruption",
          value: performanceData?.disruption_free?.team_change_100_count || 0,
        },
      ],
    },
  };

  const SummaryCard = ({
    label,
    value,
    change,
    period,
    tooltipLabel,
    overall,
  }) => {
    if (overall) {
      return (
        <Box
          bg="white"
          p="20px"
          borderRadius="12px"
          border="1px solid #E5E7EB"
          minW="0"
          h="130px">
          <Flex alignItems="center" gap="8px" mb="8px">
            <Text fontSize="14px" fontWeight="500" color="#181D27">
              {label}
            </Text>
          </Flex>
          <Flex h="32px" alignItems="center" gap="12px" mb="8px">
            <Text fontSize="24px" fontWeight="600" color="#181D27">
              {value}
            </Text>
            <Box
              w="48px"
              h="32px"
              borderRadius="6px"
              bg={"#dcfae6"}
              display="flex"
              alignItems="center"
              border="1px solid #abefc6"
              justifyContent="center">
              <Text
                fontSize="24px"
                fontWeight="700"
                color="#079455"
                lineHeight="1">
                {overall.grade}
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
            gap="6px"
            _hover={{textDecoration: "underline", color: "#EF6820"}}>
            <Box
              as="img"
              src="/img/questionRound.svg"
              alt="info"
              w="16px"
              h="16px"
            />
            How is my grade calculated?
          </Link>
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

  const CircularProgress = ({percentage, color}) => {
    const [chartKey, setChartKey] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    const remaining = 100 - percentage;
    const chartData = [
      ["Label", "Value"],
      ["Progress", percentage],
      ["Remaining", remaining],
    ];

    const options = {
      pieHole: 0.75,
      pieSliceText: "none",
      legend: "none",
      tooltip: {trigger: "none"},
      slices: {
        0: {color: color},
        1: {color: "#F3F4F6"},
      },
      chartArea: {left: 0, bottom: "30%", width: "100%", height: "100%"},
      backgroundColor: "transparent",
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        setChartKey((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);

              setTimeout(() => {
                setChartKey((prev) => prev + 1);
              }, 50);
            }
          });
        },
        {threshold: 0.1}
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    }, [isVisible]);

    useEffect(() => {
      const handleResize = () => {
        setChartKey((prev) => prev + 1);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <>
        <style>
          {`
            .performance-chart-wrapper svg,
            .performance-chart-wrapper > div,
            .performance-chart-wrapper > div > div {
              width: 160px !important;
              height: 160px !important;
              min-width: 160px !important;
              max-width: 160px !important;
              min-height: 160px !important;
              max-height: 160px !important;
            }
          `}
        </style>
        <Box
          ref={containerRef}
          position="relative"
          w="160px"
          h="160px"
          minW="160px"
          maxW="160px"
          minH="160px"
          maxH="160px"
          overflow="hidden"
          className="performance-chart-wrapper"
          style={{
            width: "160px !important",
            height: "160px !important",
            minWidth: "160px !important",
            maxWidth: "160px !important",
            minHeight: "160px !important",
            maxHeight: "160px !important",
          }}>
          <Box
            w="160px"
            h="160px"
            minW="160px"
            maxW="160px"
            minH="160px"
            maxH="160px"
            position="relative"
            style={{
              width: "160px !important",
              height: "160px !important",
              minWidth: "160px !important",
              maxWidth: "160px !important",
              minHeight: "160px !important",
              maxHeight: "160px !important",
            }}>
            <Chart
              key={chartKey}
              chartType="PieChart"
              data={chartData}
              options={options}
              width={160}
              height={160}
              style={{
                width: "160px !important",
                height: "160px !important",
              }}
            />
          </Box>
          <Box
            position="absolute"
            top="85%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            w="100%"
            pointerEvents="none">
            <Text
              fontSize="26px"
              fontWeight="600"
              color="#181D27"
              lineHeight="1.2">
              {percentage}%
            </Text>
          </Box>
        </Box>
      </>
    );
  };

  // const DetailedMetricCard = ({title, data}) => {
  //   return (
  //     <Flex
  //       bg="white"
  //       flexDirection="column"
  //       justifyContent="space-between"
  //       border="1px solid #E5E7EB"
  //       borderRadius="12px">
  //       <VStack spacing="10px" align="stretch">
  //         <Text
  //           borderBottom="1px solid #E5E7EB"
  //           fontSize="14px"
  //           fontWeight="700"
  //           color="#181D27"
  //           mb="4px"
  //           p="12px 20px">
  //           {title}
  //         </Text>
  //         <Box mb="20px" px="20px">
  //           <Text fontSize="14px" color="#181D27" fontWeight="500" mb="4px">
  //             {data.subtitle}
  //           </Text>
  //           <Text fontSize="12px" color="#6B7280" lineHeight="1.5">
  //             {data.description}
  //           </Text>
  //         </Box>

  //         <Flex px="12px" gap="24px" alignItems="flex-start">
  //           <Box position="relative">
  //             <CircularProgress
  //               percentage={data.percentage}
  //               color={data.color}
  //             />
  //           </Box>
  //           <VStack spacing="16px" align="flex-start" flex="1" pt="8px">
  //             {data.details.map((detail, index) => (
  //               <Box key={index}>
  //                 <Text
  //                   fontSize="14px"
  //                   fontWeight="600"
  //                   color="#181D27"
  //                   mb="4px">
  //                   {detail.value}
  //                   {detail.contribution && (
  //                     <Text
  //                       as="span"
  //                       fontSize="12px"
  //                       color="#6B7280"
  //                       fontWeight="400"
  //                       ml="4px">
  //                       ({detail.contribution})
  //                     </Text>
  //                   )}
  //                 </Text>
  //                 <Text fontSize="11px" color="#6B7280" fontWeight="400">
  //                   {detail.label}
  //                 </Text>
  //               </Box>
  //             ))}
  //           </VStack>
  //           <Box
  //             w="24px"
  //             h="24px"
  //             display="flex"
  //             alignItems="center"
  //             justifyContent="center"
  //             mt="8px">
  //             <svg
  //               width="24"
  //               height="24"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg">
  //               <path
  //                 d="M3 18L9 12L13 16L21 8"
  //                 stroke="#10B981"
  //                 strokeWidth="2"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //               <path
  //                 d="M21 8H15M21 8V14"
  //                 stroke="#10B981"
  //                 strokeWidth="2"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </Box>
  //         </Flex>

  //         <Flex
  //           alignItems="center"
  //           justifyContent="flex-end"
  //           p="12px 20px"
  //           borderTop="1px solid #E5E7EB">
  //           <Link
  //             href="#"
  //             fontSize="14px"
  //             color="#175CD3"
  //             fontWeight="500"
  //             _hover={{textDecoration: "underline"}}>
  //             View details
  //           </Link>
  //           <MdKeyboardArrowRight w="20px" h="20px" />
  //         </Flex>
  //       </VStack>
  //     </Flex>
  //   );
  // };

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Performance</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="32px" align="stretch">
            <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
              <SummaryCard
                label="Overall"
                value={summaryData.overall.score}
                overall={summaryData.overall}
              />
              <SummaryCard
                label="On time"
                value={summaryData.onTime.percentage}
                change={summaryData.onTime.change}
                period={summaryData.onTime.period}
                tooltipLabel="On time delivery percentage"
              />
              <SummaryCard
                label="Acceptance"
                value={summaryData.acceptance.percentage}
                change={summaryData.acceptance.change}
                period={summaryData.acceptance.period}
                tooltipLabel="Acceptance rate"
              />
              <SummaryCard
                label="App usage"
                value={summaryData.appUsage.percentage}
                change={summaryData.appUsage.change}
                period={summaryData.appUsage.period}
                tooltipLabel="App usage percentage"
              />
              <SummaryCard
                label="Disruption free"
                value={summaryData.disruptionFree.percentage}
                change={summaryData.disruptionFree.change}
                period={summaryData.disruptionFree.period}
                tooltipLabel="Disruption free percentage"
              />
            </Flex>

            <Box
              display="grid"
              gridTemplateColumns={{base: "1fr", lg: "1fr 1fr"}}
              gap="24px">
              <DetailedMetricCard title="On Time" data={detailedData.onTime} />
              <DetailedMetricCard
                title="Acceptance"
                data={detailedData.acceptance}
              />

              <DetailedMetricCard
                title="App Usage"
                data={detailedData.appUsage}
              />
              <DetailedMetricCard
                title="Disruption Free"
                data={detailedData.disruptionFree}
              />
            </Box>
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
