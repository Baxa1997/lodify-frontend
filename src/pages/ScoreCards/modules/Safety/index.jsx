import React from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import {SafetyPercentileCard} from "./components/SafetyPercentileCard";
import {UnderReviewSection} from "./components/UnderReviewSection";

const Safety = () => {
  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const lastMonth = monthNames[6];
  const currentMonth = monthNames[7];
  const day = currentDate.getDate();
  const ordinalDay = getOrdinal(day);

  const percentileData = [
    {
      title: "Unsafe driving percentile",
      value: 49,
      hasData: true,
    },
    {
      title: "HOS compliance Percentile",
      value: 49,
      hasData: true,
    },
    {
      title: "Vehicle Maintenance Percentile",
      value: 66,
      hasData: true,
    },
    {
      title: "Unsafe driving percentile",
      value: null,
      hasData: false,
    },
    {
      title: "Unsafe driving percentile",
      value: null,
      hasData: false,
    },
    {
      title: "Unsafe driving percentile",
      value: null,
      hasData: false,
    },
  ];

  return (
    <Box bg="#fff" mt="24px" borderRadius="12px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "center"}}
        flexDirection={{base: "column", md: "row"}}
        mb="24px"
        gap="12px">
        <Box>
          <Text fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
            Relay safety status for {lastMonth} 2025
          </Text>
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Updated on {ordinalDay} {currentMonth} 2025
          </Text>
        </Box>
        <Link
          href="#"
          fontSize="14px"
          color="#EF6820"
          fontWeight="500"
          display="flex"
          alignItems="center"
          gap="6px"
          _hover={{textDecoration: "underline"}}
          whiteSpace="nowrap">
          <Box
            as="img"
            src="/img/questionRound.svg"
            alt="info"
            w="16px"
            h="16px"
          />
          View FAQs
        </Link>
      </Flex>

      <UnderReviewSection />

      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="24px">
        {percentileData.map((item, index) => (
          <SafetyPercentileCard key={index} {...item} />
        ))}
      </Box>
    </Box>
  );
};

export default Safety;
