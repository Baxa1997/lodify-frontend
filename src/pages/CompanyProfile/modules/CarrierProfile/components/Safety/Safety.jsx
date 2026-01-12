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
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["GET_SAFETY_DATA", companies_id, selectedCategory],
    queryFn: () =>
      carrierService.getSafetyData({
        data: {
          method: "get",
          object_data: {
            companies_id,
            dashboard_type: selectedCategory,
          },
          table: "safety",
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  /* ------------------ CONFIG ------------------ */

  const safetyCategories = [
    {label: "Unsafe Driving", value: "unsafe_driving"},
    {label: "Hours of Service Compliance", value: "hours_of_service"},
    {label: "Vehicle Maintenance", value: "vehicle_maintenance"},
    {label: "Controlled Substances & Alcohol", value: "alcohol_score"},
    {label: "Driver Fitness", value: "fitness_score"},
  ];

  const nationalAverageKeyMap = {
    unsafe_driving: "driver",
    hours_of_service: "driver",
    vehicle_maintenance: "vehicle",
    alcohol_score: "hazmat",
    fitness_score: "driver",
  };

  const nationalAverageKey =
    nationalAverageKeyMap[selectedCategory] || selectedCategory;

  /* ------------------ CHART DATA ------------------ */

  const chartData = useMemo(() => {
    const nationalAverage =
      Number(
        safetyData?.national_average?.[nationalAverageKey] ??
          safetyData?.national_average?.[`${nationalAverageKey}_score`] ??
          0
      ) || 0;

    const rows =
      safetyData?.safety_data
        ?.map((item) => {
          const score = Number(item?.score);
          if (Number.isNaN(score)) return null;

          return [
            item?.month_name || item?.month || "N/A",
            score,
            nationalAverage,
          ];
        })
        ?.filter(Boolean) || [];

    return [["Month", "Carrier actual safety rate", "Nat'l Average"], ...rows];
  }, [safetyData, nationalAverageKey]);

  /* ------------------ DATA VALIDATION ------------------ */

  const hasValidData =
    chartData.length > 1 &&
    chartData.slice(1).some((row) => typeof row[1] === "number");

  /* ------------------ AXIS LOGIC ------------------ */

  const values = chartData
    .slice(1)
    .flatMap((row) => [row[1], row[2]])
    .filter((v) => typeof v === "number" && !Number.isNaN(v));

  const maxValue = values.length ? Math.max(...values) : 0;

  const paddedMin = -5;
  const paddedMax = maxValue < 20 ? 20 : Math.min(maxValue + 2, 100);

  /* ------------------ CHART OPTIONS ------------------ */

  const chartOptions = {
    backgroundColor: "transparent",
    curveType: "function",
    focusTarget: "category",

    hAxis: {
      type: "category",
      textStyle: {color: "#000", fontSize: 11},
      gridlines: {color: "transparent"},
    },

    vAxis: {
      viewWindow: {
        min: paddedMin,
        max: paddedMax,
      },
      ticks: [
        paddedMin,
        0,
        Math.round(paddedMax / 4),
        Math.round(paddedMax / 2),
        Math.round((paddedMax * 3) / 4),
        paddedMax,
      ],
      format: "#'%'",
      textStyle: {color: "#000", fontSize: 11},
      gridlines: {color: "#F3F4F6"},
      baselineColor: "#E5E7EB",
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
      },
    },

    chartArea: {
      left: 45,
      top: 10,
      right: 20,
      bottom: 30,
    },

    legend: {position: "none"},
  };

  /* ------------------ RENDER ------------------ */

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton onClick={refetch}>
          <InfoAccordionTitle>Safety</InfoAccordionTitle>
        </InfoAccordionButton>

        <InfoAccordionPanel>
          <VStack spacing="16px" align="stretch">
            <Flex gap="8px" flexWrap="wrap">
              {safetyCategories.map((category, index) => (
                <Button
                  px="6px"
                  key={category.value}
                  onClick={() => {
                    setSelectedTab(index);
                    setSelectedCategory(category.value);
                  }}
                  variant="ghost"
                  fontSize="13px"
                  borderRadius="8px"
                  fontWeight={selectedTab === index ? "600" : "500"}
                  color={selectedTab === index ? "#EF6820" : "#6B7280"}
                  borderBottom={
                    selectedTab === index
                      ? "2px solid #EF6820"
                      : "2px solid transparent"
                  }
                  borderBottomRadius={0}>
                  {category.label}
                </Button>
              ))}
            </Flex>

            <Box
              bg="white"
              border="1px solid #E5E7EB"
              borderRadius="12px"
              p="24px">
              <Box h="300px" position="relative">
                {hasValidData ? (
                  <Chart
                    chartType="LineChart"
                    data={chartData}
                    options={chartOptions}
                    width="100%"
                    height="300px"
                  />
                ) : (
                  <Center h="300px">
                    <Text fontSize="14px" color="#6B7280">
                      Loading data...
                    </Text>
                  </Center>
                )}

                {isFetching && (
                  <Center
                    position="absolute"
                    inset="0"
                    bg="whiteAlpha.70"
                    borderRadius="12px">
                    <Spinner color="#ff5b04" />
                  </Center>
                )}
              </Box>

              <HStack
                spacing="24px"
                mt="16px"
                pt="16px"
                borderTop="1px solid #E5E7EB">
                <HStack spacing="8px">
                  <Box w="12px" h="12px" borderRadius="50%" bg="#EF6820" />
                  <Text fontSize="12px" color="#6B7280">
                    Carrier actual safety rate
                  </Text>
                </HStack>

                <HStack spacing="8px">
                  <Box w="12px" h="12px" borderRadius="50%" bg="#111827" />
                  <Text fontSize="12px" color="#6B7280">
                    Nat&apos;l Average % as of DATE 08/29/2025*
                  </Text>
                </HStack>
              </HStack>
            </Box>
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
