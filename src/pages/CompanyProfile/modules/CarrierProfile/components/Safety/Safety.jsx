import React, {useState} from "react";
import {Box, Text, Flex, HStack, VStack, Button} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import Chart from "react-google-charts";

export const Safety = ({data = {}}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const safetyCategories = [
    "Unsafe Driving",
    "Hours of Service Compliance",
    "Vehicle Maintenance",
    "Controlled Substances & Alcohol",
    "Driver Fitness",
  ];

  const chartData = [
    ["Month", "Carrier actual safety rate", "Nat'l Average"],
    ["Jan", 45, 75],
    ["Feb", 48, 75],
    ["Mar", 50, 75],
    ["Apr", 52, 75],
    ["May", 55, 75],
    ["Jun", 58, 75],
    ["Jul", 60, 75],
    ["Aug", 63, 75],
    ["Sep", 65, 75],
    ["Oct", 68, 75],
    ["Nov", 72, 75],
    ["Dec", 75, 75],
  ];

  const chartOptions = {
    chart: {
      title: "",
    },
    hAxis: {
      textStyle: {color: "#6B7280", fontSize: 11},
      gridlines: {color: "#F3F4F6"},
      baselineColor: "#E5E7EB",
    },
    vAxis: {
      textStyle: {color: "transparent"},
      gridlines: {color: "#F3F4F6"},
      baselineColor: "#E5E7EB",
      minValue: 0,
      maxValue: 100,
      format: "",
    },
    legend: {
      position: "none",
    },
    colors: ["#EF6820", "#000000"],
    lineWidth: 3,
    pointSize: 0,
    chartArea: {
      left: 50,
      top: 20,
      right: 20,
      bottom: 50,
      width: "85%",
      height: "75%",
    },
    backgroundColor: "transparent",
    series: {
      0: {lineWidth: 3, pointSize: 0},
      1: {lineWidth: 2, pointSize: 0, type: "line"},
    },
  };

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Safety</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="20px" align="stretch">
            <Box>
              <Flex gap="8px" flexWrap="wrap">
                {safetyCategories.map((category, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedTab(index)}
                    variant="ghost"
                    fontSize="14px"
                    fontWeight={selectedTab === index ? "600" : "500"}
                    color={selectedTab === index ? "#EF6820" : "#6B7280"}
                    borderBottom={
                      selectedTab === index
                        ? "2px solid #EF6820"
                        : "2px solid transparent"
                    }
                    borderRadius="0"
                    px="12px"
                    py="8px"
                    h="auto"
                    _hover={{
                      color: "#EF6820",
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}>
                    {category}
                  </Button>
                ))}
              </Flex>
            </Box>

            {selectedTab !== null && (
              <VStack spacing="20px" align="stretch" mt="20px">
                <Text fontSize="16px" fontWeight="600" color="#181D27" mb="8px">
                  {safetyCategories[selectedTab]}
                </Text>

                <Box
                  bg="white"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="24px">
                  <Box w="100%" h="300px">
                    <Chart
                      chartType="LineChart"
                      data={chartData}
                      options={chartOptions}
                      width="100%"
                      height="300px"
                    />
                  </Box>

                  {/* Legend */}
                  <HStack
                    spacing="24px"
                    mt="16px"
                    pt="16px"
                    borderTop="1px solid #E5E7EB">
                    <HStack spacing="8px" align="center">
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="50%"
                        bg="#EF6820"
                        flexShrink={0}
                      />
                      <Text fontSize="12px" color="#6B7280" fontWeight="400">
                        Carrier actual safety rate
                      </Text>
                    </HStack>
                    <HStack spacing="8px" align="center">
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="50%"
                        bg="#000000"
                        flexShrink={0}
                      />
                      <Text fontSize="12px" color="#6B7280" fontWeight="400">
                        Nat'l Average % as of DATE 08/29/2025*
                      </Text>
                    </HStack>
                  </HStack>
                </Box>
              </VStack>
            )}
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
