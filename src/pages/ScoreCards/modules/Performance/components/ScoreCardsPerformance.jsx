import React, {useMemo} from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import {ScoreCardCompanyCard} from "./ScoreCardCompanyCard";
import {IoIosArrowForward} from "react-icons/io";
import LoadingState from "@components/LoadingState";
import EmptyState from "@components/EmptyState";
import {RiShieldCheckLine} from "react-icons/ri";

export const ScoreCardsPerformance = ({
  brokerSafetyData = [],
  isLoading = false,
}) => {
  const getGaugeColor = (grade) => {
    switch (grade) {
      case ("A+", "A"):
        return "#079455";
      case ("B+", "B"):
        return "#F79009";
      case ("C+", "C"):
        return "#DC6803";
      case ("D+", "D"):
        return "#DC6803";
      case "F":
        return "red";
      default:
        return "#10B981";
    }
  };

  const companiesData = useMemo(() => {
    return brokerSafetyData.map((item) => {
      return {
        companyName: item.legal_name,
        logo: null,
        completedLoads: item.total_orders,
        grade: item.grade,
        percentage: item.on_time_percentage,
        gaugeColor: getGaugeColor(item.grade),
        profilePictures: [],
      };
    });
  }, [brokerSafetyData]);

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
    <Box bg="#fff" borderRadius="12px" mt="32px">
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
      </Flex>

      {isLoading ? (
        <LoadingState height="300px" size="lg" />
      ) : companiesData.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap="24px">
          {companiesData.map((company, index) => (
            <ScoreCardCompanyCard key={index} {...company} />
          ))}
        </Box>
      ) : (
        <EmptyState
          icon={RiShieldCheckLine}
          message="No Carrier Data Available"
          description="Carrier safety information will appear here once you have active carriers."
          height="300px"
        />
      )}
    </Box>
  );
};
