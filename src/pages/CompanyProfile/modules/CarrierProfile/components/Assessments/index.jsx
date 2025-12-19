import React, {useMemo} from "react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {Flex, Box, Text, Badge, HStack} from "@chakra-ui/react";
import Chart from "react-google-charts";
import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";
import {FcCancel} from "react-icons/fc";

function Assessments() {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const {data: baseAssessmentData} = useQuery({
    queryKey: ["GET_ASSESSMENT_DATA", companies_id],
    queryFn: () =>
      carrierService.assessmentData({
        data: {
          method: "base",
          object_data: {
            companies_id: companies_id,
          },
          table: "risk_assessment",
        },
      }),
    select: (res) => res?.data?.response || {},
    enabled: Boolean(companies_id),
  });

  const {data: carrierAssessmentData} = useQuery({
    queryKey: ["GET_CARRIER_ASSESSMENT_DATA", companies_id],
    queryFn: () =>
      carrierService.assessmentData({
        data: {
          method: "get",
          object_data: {
            companies_id: companies_id,
          },
          table: "load_limit",
        },
      }),
    select: (res) => res?.data?.response || {},
    enabled: Boolean(companies_id),
  });

  const monthMap = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
  };

  const loadLimitData = useMemo(() => {
    if (
      !carrierAssessmentData ||
      Object.keys(carrierAssessmentData).length === 0
    ) {
      return [
        ["Month", "Load Limit"],
        ["Jan", 0],
        ["Feb", 0],
        ["Mar", 0],
        ["Apr", 0],
        ["May", 0],
        ["Jun", 0],
        ["Jul", 0],
        ["Aug", 0],
        ["Sep", 0],
        ["Oct", 0],
        ["Nov", 0],
        ["Dec", 0],
      ];
    }

    const chartData = [["Month", "Load Limit"]];
    const monthOrder = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    monthOrder.forEach((month) => {
      const monthData = carrierAssessmentData[month];
      const score = monthData?.score || 0;
      chartData.push([monthMap[month], score]);
    });

    return chartData;
  }, [carrierAssessmentData]);

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
    areaOpacity: 0.1,
    lineWidth: 3,
    pointSize: 0,
    chartArea: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 20,
      width: "110%",
      height: "75%",
      backgroundColor: "#fff",
    },
    backgroundColor: "#fff",
  };

  const assessmentItems = [
    {
      label: "Base Risk Assessment",
      value: baseAssessmentData?.base_risk_assessment === "PASS",
    },
    {label: "High Value", value: baseAssessmentData?.high_value === "PASS"},
    {
      label: "Temperature Controlled",
      value: baseAssessmentData?.temperature_controlled === "PASS",
    },
  ];

  return (
    <InfoAccordionItem id="assessments">
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
                bg={
                  assessmentItems?.every((item) => item.value)
                    ? "#17B26A"
                    : "#D92D20"
                }
                color="white"
                px="12px"
                py="4px"
                borderRadius="12px"
                fontSize="12px"
                fontWeight="600">
                {assessmentItems?.every((item) => item.value) ? "Pass" : "Fail"}
              </Badge>
            </Flex>
            <Flex direction="column" gap="8px">
              {assessmentItems.map((item, index) => (
                <HStack
                  key={index}
                  spacing="6px"
                  p="2px 10px"
                  bg="#fff"
                  borderRadius="16px"
                  border="1px solid #079455"
                  borderColor={item.value ? "#079455" : "#D92D20"}
                  w="fit-content">
                  {item?.value ? (
                    <Box
                      as="img"
                      src="/img/check-circle.svg"
                      alt="check"
                      w="16px"
                      h="16px"
                      flexShrink={0}
                    />
                  ) : (
                    <FcCancel />
                  )}
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    whiteSpace="nowrap">
                    {item.label}
                  </Text>
                </HStack>
              ))}
            </Flex>
          </Box>

          <Box
            flex="1"
            bg="white"
            borderRadius="12px"
            border="1px solid #E5E7EB"
            p="20px"
            minW={{base: "100%", md: "400px"}}>
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
