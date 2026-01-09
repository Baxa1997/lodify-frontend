import React, {useMemo} from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import SafetyMetricCard from "./SafetyMetricCard";

const emptyData = [
  {
    title: "Driver Fitness",
    value: "",
    hasData: false,
    progressValue: 0,
    progressColor: "#6B7280",
    icon: "/img/nodata.svg",
    statusText: "",
  },
  {
    title: "Hazardous Materials Compliance",
    value: "",
    hasData: false,
    progressValue: 0,
    progressColor: "#6B7280",
    icon: "/img/nodata.svg",
    statusText: "",
  },
  {
    title: "Hours-of-Service Compliance",
    value: "",
    hasData: false,
    progressValue: 0,
    progressColor: "#6B7280",
    icon: "/img/nodata.svg",
    statusText: "",
  },
  {
    title: "Unsafe Driving",
    value: "",
    hasData: false,
    progressValue: 0,
    progressColor: "#6B7280",
    icon: "/img/nodata.svg",
    statusText: "",
  },
  {
    title: "Vehicle Maintenance",
    value: "",
    hasData: false,
    progressValue: 0,
    progressColor: "#6B7280",
    icon: "/img/nodata.svg",
    statusText: "",
  },
];

const SafetyCarrier = ({carrierInfoData = {}, safetyData = []}) => {
  const progressColor = (percentage) => {
    if (percentage > 50) return "#EF4444";
    if (percentage > 30) return "#F97316";
    if (percentage > 10) return "#10B981";
    return "#6B7280";
  };

  const progressIcon = (percentage) => {
    if (percentage > 50) return "/img/unsafeDriving.svg";
    if (percentage > 30) return "/img/hos.svg";
    if (percentage > 10) return "/img/vehicleMaint.svg";
    return "/img/nodata.svg";
  };

  const progressStatus = (percentage) => {
    if (percentage > 50) return "Unsafe Driving";
    if (percentage > 30) return "Hours-of-Service Compliance";
    if (percentage > 10) return "Vehicle Maintenance";
    return "";
  };

  const safetyMetrics = useMemo(() => {
    if (safetyData?.length) {
      return safetyData.map((item) => ({
        title: item.basic_desc,
        value: item.percentage + "%",
        hasData: true,
        progressValue: item.percentage,
        progressColor: progressColor(item.percentage),
        icon: progressIcon(item.percentage),
        statusText: progressStatus(item.percentage),
      }));
    }
    return emptyData;
  }, [safetyData]);

  const highRiskMetrics = useMemo(() => {
    return safetyData.filter((item) => item.percentage > 70);
  }, [safetyData]);

  const hasHighRiskMetrics = highRiskMetrics.length > 0;
  const highRiskCount = highRiskMetrics.length;
  const highRiskTitles = highRiskMetrics.map((item) => item.basic_desc);

  return (
    <Box bg="#fff" p="24px" borderRadius="12px" mt="32px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "center"}}
        flexDirection={{base: "column", md: "row"}}
        mb="24px"
        gap="12px">
        <Text fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
          {carrierInfoData?.legal_name || ""}
        </Text>
        <Link
          href="#"
          fontSize="14px"
          color="#EF6820"
          fontWeight="600"
          display="flex"
          alignItems="center"
          gap="6px"
          _hover={{textDecoration: "underline"}}
          whiteSpace="nowrap">
          <Flex
            borderRadius="50%"
            border="1px solid #EF6820"
            p="4px"
            w="16px"
            h="16px"
            fontSize="12px"
            justifyContent="center"
            alignItems="center"
            color="#EF6820">
            ?
          </Flex>
          View FAQs
        </Link>
      </Flex>
      {hasHighRiskMetrics && (
        <Box
          w="100%"
          bg="#FFFAEB"
          border="1px solid #FEDF89"
          borderRadius="8px"
          p="12px 16px"
          mb="24px">
          <Flex alignItems="flex-start" gap="8px">
            <Box>
              <Text fontSize="14px" fontWeight="600" color="#B54708" mb="4px">
                ⚠️ Warning: {highRiskCount}{" "}
                {highRiskCount === 1 ? "metric" : "metrics"}{" "}
                {highRiskCount === 1 ? "is" : "are"} higher than 70% {}
              </Text>
              {highRiskTitles.map((title, index) => (
                <Text key={index} fontSize="13px" color="#92400E" mb="2px">
                  • {title}
                </Text>
              ))}
            </Box>
          </Flex>
        </Box>
      )}
      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="24px">
        {safetyMetrics.map((metric, index) => (
          <SafetyMetricCard key={index} {...metric} />
        ))}
      </Box>
    </Box>
  );
};

export default SafetyCarrier;
