import React, {useMemo} from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import NationalCard from "./NationalCard";
import LoadingState from "@components/LoadingState";
import EmptyState from "@components/EmptyState";
import {RiBarChartBoxLine} from "react-icons/ri";

const NationalAverage = ({nationalAverageData = {}, isLoading = false}) => {
  const nationalAverage = [
    {
      title: "Driver",
      value:
        (
          nationalAverageData?.us_driver_inspections?.out_of_service_pct *
            100 || 0
        ).toFixed(2) + "%",
      secondValue:
        (
          nationalAverageData?.us_driver_inspections?.national_average * 100 ||
          0
        ).toFixed(2) + "%",
    },

    {
      title: "Vehicle",
      value:
        (
          nationalAverageData?.us_vehicle_inspections?.national_average * 100 ||
          0
        ).toFixed(2) + "%",
      secondValue:
        (
          nationalAverageData?.us_vehicle_inspections?.out_of_service_pct *
            100 || 0
        ).toFixed(2) + "%",
    },

    {
      title: "Hazmat",
      value:
        (
          nationalAverageData?.us_hazmat_inspections?.national_average * 100 ||
          0
        ).toFixed(2) + "%",
      secondValue:
        (
          nationalAverageData?.us_hazmat_inspections?.out_of_service_pct *
            100 || 0
        ).toFixed(2) + "%",
    },
  ];

  const nationalAverageMetrics = useMemo(() => {
    return nationalAverage.map((item) => ({
      title: item.title,
      value: item.value,
      secondValue: item.secondValue,
    }));
  }, [nationalAverage]);

  const formattedDate = nationalAverageData?.date
    ? new Date(nationalAverageData.date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  const hasData =
    nationalAverageData?.us_driver_inspections ||
    nationalAverageData?.us_hazmat_inspections ||
    nationalAverageData?.us_vehicle_inspections;

  return (
    <Box bg="#fff" p="24px" borderRadius="12px" mt="32px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "center"}}
        flexDirection={{base: "column", md: "row"}}
        mb="24px"
        gap="12px">
        <Box>
          <Text fontSize="20px" fontWeight="700" color="#181D27" mb="0px">
            National Average
          </Text>
          {/* <Text fontSize="12px" fontWeight="500" color="red" mb="4px">
            as of Date {formattedDate}
          </Text> */}
        </Box>

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

      {isLoading ? (
        <LoadingState height="200px" size="lg" />
      ) : hasData ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            md: "repeat(4, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap="24px">
          {nationalAverageMetrics?.map((metric, index) => (
            <NationalCard
              key={index}
              percentage={metric.percentage}
              title={metric.title}
              value={metric.value}
              secondValue={metric.secondValue}
            />
          ))}
        </Box>
      ) : (
        <EmptyState
          icon={RiBarChartBoxLine}
          message="No National Average Data Available"
          description="National average statistics will be displayed here once available."
          height="200px"
        />
      )}
    </Box>
  );
};

export default NationalAverage;
