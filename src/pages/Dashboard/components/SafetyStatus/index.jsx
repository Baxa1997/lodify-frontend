import React, {useMemo} from "react";
import {Box, Text, Flex, Link} from "@chakra-ui/react";
import {CompanyCard} from "./CompanyCard";
import {IoIosArrowForward} from "react-icons/io";
import LoadingState from "@components/LoadingState";
import EmptyState from "@components/EmptyState";
import {RiShieldCheckLine} from "react-icons/ri";

export const SafetyStatus = ({brokerSafetyData = [], isLoading = false}) => {
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
        companyName: item.legal_name || "Unknown Company",
        logo: null,
        completedLoads: item?.total_orders ?? 0,
        grade: item.grade || "N/A",
        percentage: item?.on_time_percentage ?? 0,
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

  const lastMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastMonth = monthNames[lastMonthDate.getMonth()];
  const lastMonthYear = lastMonthDate.getFullYear();

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
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
          <Text fontSize="18px" fontWeight="400" color="#181D27" mb="4px">
            Monthly{" "}
            <span style={{color: "#000", fontWeight: "700"}}>Carriers</span>{" "}
            Safety Status
          </Text>
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Updated on {ordinalDay} {currentMonth} {currentYear}
          </Text>
        </Box>
  
      </Flex>

      {isLoading ? (
        <LoadingState height="300px" size="lg" />
      ) : companiesData?.length > 0 ? (
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
