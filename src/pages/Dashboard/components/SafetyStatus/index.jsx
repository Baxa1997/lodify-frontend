import React from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import {CompanyCard} from "./CompanyCard";

export const SafetyStatus = () => {
  const companiesData = [
    {
      companyName: "UPS",
      logo: null,
      completedLoads: 5210,
      grade: "A+",
      percentage: 100,
      gaugeColor: "#10B981",
      profilePictures: [],
    },
    {
      companyName: "Amazon Relay",
      logo: null,
      completedLoads: 5210,
      grade: "A",
      percentage: 95,
      gaugeColor: "#10B981",
      profilePictures: [],
    },
    {
      companyName: "JB Hunt",
      logo: null,
      completedLoads: 5210,
      grade: "B+",
      percentage: 89,
      gaugeColor: "#F97316",
      profilePictures: [],
    },
    {
      companyName: "FedEx",
      logo: null,
      completedLoads: 5210,
      grade: "B",
      percentage: 88,
      gaugeColor: "#F97316",
      profilePictures: [],
    },
    {
      companyName: "XPO Logistics",
      logo: null,
      completedLoads: 5210,
      grade: "C",
      percentage: 87,
      gaugeColor: "#F97316",
      profilePictures: [],
    },
    {
      companyName: "HDL",
      logo: null,
      completedLoads: 5210,
      grade: "D",
      percentage: 85,
      gaugeColor: "#F97316",
      profilePictures: [],
    },
  ];

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

  return (
    <Box bg="#fff" p="24px" borderRadius="12px" mt="32px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "center"}}
        flexDirection={{base: "column", md: "row"}}
        mb="24px"
        gap="12px">
        <Box>
          <Text fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
            Lodify safety status for {lastMonth} 2025
          </Text>
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Updated on {ordinalDay} {currentMonth} 2025
          </Text>
        </Box>
        <Link
          href="#"
          fontSize="14px"
          color="#EF6820"
          fontWeight="600"
          display="flex"
          alignItems="center"
          gap="4px"
          _hover={{textDecoration: "underline"}}
          whiteSpace="nowrap">
          View more
          <Text as="span" fontSize="12px">
            &gt;
          </Text>
        </Link>
      </Flex>

      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="24px">
        {companiesData.map((company, index) => (
          <CompanyCard key={index} {...company} />
        ))}
      </Box>
    </Box>
  );
};
