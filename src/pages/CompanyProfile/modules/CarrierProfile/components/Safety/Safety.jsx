import React, {useMemo, useState} from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import Chart from "react-google-charts";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

export const Safety = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("unsafe_driving");

  const {
    data: safetyData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["GET_SAFETY_DATA", companies_id, selectedCategory],
    queryFn: () =>
      carrierService?.getSafetyData({
        data: {
          method: "get",
          object_data: {
            companies_id: companies_id,
            dashboard_type: selectedCategory,
          },
          table: "safety",
        },
      }),
    select: (res) => res?.data || [],
    enabled: Boolean(companies_id),
  });

  const nationalAverageKeyMap = {
    unsafe_driving: "driver",
    hours_of_service: "driver",
    vehicle_maintenance: "vehicle",
    alcohol_score: "hazmat",
    fitness_score: "driver",
  };

  const nationalAverageKey =
    nationalAverageKeyMap[selectedCategory] || selectedCategory;

  const safetyCategories = [
    {label: "Unsafe Driving", value: "unsafe_driving"},
    {label: "Hours of Service Compliance", value: "hours_of_service"},
    {label: "Vehicle Maintenance", value: "vehicle_maintenance"},
    {label: "Controlled Substances & Alcohol", value: "alcohol_score"},
    {label: "Driver Fitness", value: "fitness_score"},
  ];

  const chartData = useMemo(() => {
    const nationalAverageValue =
      safetyData?.national_average?.[nationalAverageKey] ??
      safetyData?.national_average?.[`${nationalAverageKey}_score`] ??
      safetyData?.national_average?.[selectedCategory] ??
      safetyData?.national_average?.[`${selectedCategory}_score`] ??
      0;

    const rows =
      safetyData?.safety_data?.map((item) => {
        const score = item?.["score"] ?? item?.[`score`] ?? 0;

        return [
          item?.month_name || item?.month || "",
          Number(score),
          Number(nationalAverageValue),
        ];
      }) || [];

    return [["Month", "Carrier actual safety rate", "Nat'l Average"], ...rows];
  }, [safetyData, selectedCategory, nationalAverageKey]);

  const values = chartData
    .slice(1)
    .flatMap((row) => [row[1], row[2]])
    .filter((v) => typeof v === "number");

  const maxValue = Math.max(...values);

  const paddedMax = Math.min(maxValue * 2.35, 100);
  const paddedMin = -5;

  const chartOptions = {
    backgroundColor: "transparent",
    curveType: "function",
    focusTarget: "category",

    vAxis: {
      minValue: 0,
      viewWindow: {
        min: paddedMin,
        max: paddedMax,
      },
      textStyle: {color: "#000", fontSize: 11},
      gridlines: {color: "#F3F4F6", count: 4},
      baselineColor: "#E5E7EB",
      format: "#'%'",
    },

    hAxis: {
      textStyle: {color: "#000", fontSize: 11},
      gridlines: {color: "transparent"},
    },

    series: {
      0: {
        color: "#EF6820",
        lineWidth: 3,
        areaOpacity: 0.12,
      },
      1: {
        color: "#111827",
        lineWidth: 2,
        areaOpacity: 0,
        background: "red",
      },
    },

    chartArea: {
      left: 40,
      top: 20,
      right: 20,
      bottom: 30,
      height: "70%",
    },

    legend: {
      position: "none",
    },
  };

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton onClick={refetch}>
          <InfoAccordionTitle>Safety</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="20px" align="stretch">
            <Box>
              <Flex gap="8px" flexWrap="wrap">
                {safetyCategories.map((category, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setSelectedTab(index);
                      setSelectedCategory(category?.value);
                    }}
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
                    {category?.label}
                  </Button>
                ))}
              </Flex>
            </Box>

            {selectedTab !== null && (
              <VStack spacing="20px" align="stretch" mt="20px">
                <Text fontSize="16px" fontWeight="600" color="#181D27" mb="8px">
                  {safetyCategories[selectedTab]?.label}
                </Text>

                <Box
                  bg="white"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="24px">
                  <Box w="100%" h="300px" position="relative">
                    <Chart
                      chartType="LineChart"
                      data={chartData}
                      options={chartOptions}
                      width="100%"
                      height="300px"
                      loader={
                        <Center h="300px">
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="#f3f4f6"
                            color="#EF6820"
                            size="lg"
                          />
                        </Center>
                      }
                    />
                    {isLoading && (
                      <Center
                        position="absolute"
                        inset="0"
                        bg="whiteAlpha.70"
                        borderRadius="12px">
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="#f3f4f6"
                          color="#EF6820"
                          size="lg"
                        />
                      </Center>
                    )}
                  </Box>

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
