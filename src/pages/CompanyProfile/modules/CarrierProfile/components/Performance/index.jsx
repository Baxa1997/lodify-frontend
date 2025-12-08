import React from "react";
import {Box, Text, Flex, VStack, Link, Tooltip} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import Chart from "react-google-charts";
import {MdKeyboardArrowRight} from "react-icons/md";

export const Performance = () => {
  const summaryData = {
    overall: {
      score: "99%",
      grade: "A",
      gradeColor: "#10B981",
    },
    onTime: {
      percentage: "100.0%",
      change: "0.0%",
      period: "1 week",
    },
    acceptance: {
      percentage: "100.0%",
      change: "0.0%",
      period: "1 week",
    },
    appUsage: {
      percentage: "99.8%",
      change: "0.0%",
      period: "1 week",
    },
    disruptionFree: {
      percentage: "100.0%",
      change: "0.0%",
      period: "1 week",
    },
  };

  const detailedData = {
    onTime: {
      percentage: 100,
      color: "#1570EF",
      subtitle: "Legs with no carrier controlled delays",
      description:
        "Tracks how often loads are picked up and delivered as scheduled.",
      details: [
        {
          label: "On time to origin",
          value: "100.0%",
          contribution: "37.5% of score",
        },
        {
          label: "On time to destination",
          value: "100.0%",
          contribution: "62.5% of score",
        },
      ],
    },
    acceptance: {
      percentage: 100,
      color: "#9333EA",
      subtitle: "Accepted work",
      description:
        "Measures the percentage of loads and blocks accepted without rejecti...",
      details: [
        {label: "Rejected blocks", value: "0"},
        {label: "Rejected loads", value: "0", contribution: "62.5% of score"},
      ],
    },
    appUsage: {
      percentage: 99.8,
      color: "#EC4899",
      subtitle: "App Usage",
      description:
        "Shows how consistently the Lodify app is used during trips.",
      details: [
        {
          label: "On time to origin",
          value: "100.0%",
          contribution: "37.5% of score",
        },
        {
          label: "Location availability",
          value: "99.8%",
          contribution: "62.5% of score",
        },
      ],
    },
    disruptionFree: {
      percentage: 100,
      color: "#1E40AF",
      subtitle: "Loads with no disruption",
      description:
        "Reflects the share of loads completed without service issues.",
      details: [
        {label: "Loads with disruption across", value: "0"},
        {label: "Completed loads", value: "119"},
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
            _hover={{textDecoration: "underline"}}>
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
      chartArea: {left: 0, top: 0, width: "100%", height: "100%"},
      backgroundColor: "transparent",
    };

    return (
      <Box
        position="relative"
        w="144px"
        h="144px"
        minW="144px"
        maxW="144px"
        minH="144px"
        maxH="144px"
        flexShrink={0}
        overflow="hidden">
        <Box
          w="144px"
          h="144px"
          minW="144px"
          maxW="144px"
          minH="144px"
          maxH="144px"
          position="relative">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width={144}
            height={144}
            style={{width: "144px", height: "144px"}}
          />
        </Box>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          w="100%"
          pointerEvents="none">
          <Text
            fontSize="28px"
            fontWeight="600"
            color="#181D27"
            lineHeight="1.2">
            {percentage}%
          </Text>
        </Box>
      </Box>
    );
  };

  const DetailedMetricCard = ({title, data}) => {
    return (
      <Flex
        bg="white"
        flexDirection="column"
        justifyContent="space-between"
        border="1px solid #E5E7EB"
        borderRadius="12px">
        <VStack spacing="10px" align="stretch">
          <Text
            borderBottom="1px solid #E5E7EB"
            fontSize="14px"
            fontWeight="700"
            color="#181D27"
            mb="4px"
            p="12px 20px">
            {title}
          </Text>
          <Box mb="20px" px="20px">
            <Text fontSize="14px" color="#181D27" fontWeight="500" mb="4px">
              {data.subtitle}
            </Text>
            <Text fontSize="12px" color="#6B7280" lineHeight="1.5">
              {data.description}
            </Text>
          </Box>

          <Flex px="12px" gap="24px" alignItems="flex-start">
            <Box position="relative" flexShrink={0}>
              <CircularProgress
                percentage={data.percentage}
                color={data.color}
              />
            </Box>
            <VStack spacing="16px" align="flex-start" flex="1" pt="8px">
              {data.details.map((detail, index) => (
                <Box key={index}>
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="#181D27"
                    mb="4px">
                    {detail.value}
                    {detail.contribution && (
                      <Text
                        as="span"
                        fontSize="12px"
                        color="#6B7280"
                        fontWeight="400"
                        ml="4px">
                        ({detail.contribution})
                      </Text>
                    )}
                  </Text>
                  <Text fontSize="13px" color="#6B7280" fontWeight="400">
                    {detail.label}
                  </Text>
                </Box>
              ))}
            </VStack>
            <Box
              w="24px"
              h="24px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt="8px">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 18L9 12L13 16L21 8"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8H15M21 8V14"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Flex>

          <Flex
            alignItems="center"
            justifyContent="flex-end"
            p="12px 20px"
            borderTop="1px solid #E5E7EB">
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View details
            </Link>
            <MdKeyboardArrowRight w="20px" h="20px" />
          </Flex>
        </VStack>
      </Flex>
    );
  };

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
              <DetailedMetricCard
                title="App usage"
                data={detailedData.appUsage}
              />
              <DetailedMetricCard
                title="Disruption-free"
                data={detailedData.disruptionFree}
              />

              <DetailedMetricCard
                title="App usage"
                data={detailedData.appUsage}
              />
              <DetailedMetricCard
                title="Disruption-free"
                data={detailedData.disruptionFree}
              />
            </Box>
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
