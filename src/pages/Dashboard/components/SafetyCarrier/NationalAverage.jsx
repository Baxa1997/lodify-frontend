import React, {useMemo} from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import NationalCard from "./NationalCard";
import {format} from "date-fns";

const NationalAverage = ({nationalAverageData = {}}) => {
  console.log("nationalAverageData", nationalAverageData);
  const nationalAverage = [
    {
      title: "Driver",
      value: (nationalAverageData?.driver || 0) + "%",
    },

    {
      title: "Vehicle",
      value: (nationalAverageData?.vehicle || 0) + "%",
    },

    {
      title: "Hazmat",
      value: (nationalAverageData?.hazmat || 0) + "%",
    },
  ];

  const nationalAverageMetrics = useMemo(() => {
    return nationalAverage.map((item) => ({
      title: item.title,
      value: item.value,
    }));
  }, [nationalAverage]);

  const formattedDate = new Date(nationalAverageData?.date).toLocaleDateString(
    "en-US",
    {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }
  );

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
          <Text fontSize="12px" fontWeight="500" color="red" mb="4px">
            as of Date {formattedDate}
          </Text>
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
          />
        ))}
      </Box>
    </Box>
  );
};

export default NationalAverage;
