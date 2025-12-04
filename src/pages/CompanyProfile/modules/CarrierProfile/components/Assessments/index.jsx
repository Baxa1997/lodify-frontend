import React from "react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {Flex, Box, Text, Badge, HStack} from "@chakra-ui/react";
import Chart from "react-google-charts";

function Assessments() {
  const loadLimitData = [
    ["Month", "Load Limit"],
    ["Jan", 20],
    ["Feb", 25],
    ["Mar", 30],
    ["Apr", 35],
    ["May", 40],
    ["Jun", 45],
    ["Jul", 50],
    ["Aug", 55],
    ["Sep", 60],
    ["Oct", 65],
    ["Nov", 70],
    ["Dec", 75],
  ];

  const loadLimitOptions = {
    chart: {
      title: "",
    },
    hAxis: {
      textStyle: {color: "#6B7280", fontSize: 11},
      gridlines: {color: "transparent"},
      baselineColor: "#E5E7EB",
      format: "MMM",
    },
    vAxis: {
      textStyle: {color: "transparent"},
      gridlines: {color: "#F3F4F6", count: 5},
      baselineColor: "#E5E7EB",
      minValue: 0,
      format: "",
    },
    legend: {position: "none"},
    colors: ["#EF6820"],
    areaOpacity: 0.2,
    lineWidth: 3,
    pointSize: 0,
    chartArea: {
      left: 50,
      top: 10,
      right: 20,
      bottom: 50,
      width: "85%",
      height: "75%",
    },
    backgroundColor: "transparent",
  };

  const assessmentItems = [
    "Base Risk Assessment",
    "High Value",
    "Temperature Controlled",
  ];

  return (
    <InfoAccordionItem>
      <InfoAccordionButton>
        <Flex justify="space-between" align="center" width="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap="4px">
            <InfoAccordionTitle>Assessment</InfoAccordionTitle>
          </Box>
        </Flex>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
          <Box
            flex="1"
            bg="white"
            borderRadius="12px"
            border="1px solid #E5E7EB"
            p="20px"
            position="relative"
            minW={{base: "100%", md: "300px"}}>
            <Flex justify="space-between" align="flex-start" mb="16px">
              <Text fontSize="16px" fontWeight="600" color="#181D27">
                Assessment
              </Text>
              <Badge
                bg="#10B981"
                color="white"
                px="12px"
                py="4px"
                borderRadius="6px"
                fontSize="12px"
                fontWeight="600">
                Pass
              </Badge>
            </Flex>
            <Flex direction="column" gap="8px">
              {assessmentItems.map((item, index) => (
                <HStack
                  key={index}
                  spacing="8px"
                  p="8px 12px"
                  bg="#F9FAFB"
                  borderRadius="8px"
                  border="1px solid #E5E7EB">
                  <Box
                    as="img"
                    src="/img/check-circle.svg"
                    alt="check"
                    w="16px"
                    h="16px"
                    flexShrink={0}
                  />
                  <Text fontSize="14px" fontWeight="500" color="#181D27">
                    {item}
                  </Text>
                </HStack>
              ))}
            </Flex>
          </Box>

          {/* Right Card: Load Limit */}
          <Box
            flex="1"
            bg="white"
            borderRadius="12px"
            border="1px solid #E5E7EB"
            p="20px"
            minW={{base: "100%", md: "300px"}}>
            <Text fontSize="16px" fontWeight="600" color="#181D27" mb="16px">
              Load Limit
            </Text>
            <Box w="100%" h="200px">
              <Chart
                chartType="AreaChart"
                data={loadLimitData}
                options={loadLimitOptions}
                width="100%"
                height="200px"
              />
            </Box>
          </Box>
        </Flex>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  );
}

export default Assessments;
