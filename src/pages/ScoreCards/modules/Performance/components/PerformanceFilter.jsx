import React, {useState} from "react";
import {Flex, Text, Box, IconButton, HStack} from "@chakra-ui/react";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import Select from "@components/Select";

function PerformanceFilter() {
  const [currentWeek, setCurrentWeek] = useState(32);

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => Math.min(52, prev + 1));
  };

  return (
    <Flex
      w={"100%"}
      bg="#FAFAFA"
      p="20px"
      borderRadius="12px"
      justifyContent="space-between"
      alignItems="flex-end"
      gap="12px"
      flexWrap={{base: "wrap", md: "nowrap"}}>
      <Flex w={{base: "100%", md: "30%"}} flexDirection={"column"}>
        <Text mb="8px" h="20px" fontSize="14px" fontWeight="500" color="#181D27">
          Timeframe <span style={{color: "#1570EF"}}>*</span>
        </Text>
        <Flex alignItems="center" gap="12px">
          <Box flex="1">
            <Select
              options={[
                {label: "Last 6 active weeks", value: "last_6_active_weeks"},
                {label: "Last 7 Days", value: "last_7_days"},
                {label: "Last 30 Days", value: "last_30_days"},
                {label: "Last 90 Days", value: "last_90_days"},
              ]}
              defaultValue="last_6_active_weeks"
            />
          </Box>
          <HStack spacing="8px">
            <IconButton
              icon={<LuChevronLeft size={20} />}
              size="sm"
              variant="ghost"
              onClick={handlePreviousWeek}
              aria-label="Previous week"
              color="#6B7280"
              _hover={{bg: "#F3F4F6", color: "#181D27"}}
            />
            <Text fontSize="14px" fontWeight="600" color="#181D27" minW="60px" textAlign="center">
              Week {currentWeek}
            </Text>
            <IconButton
              icon={<LuChevronRight size={20} />}
              size="sm"
              variant="ghost"
              onClick={handleNextWeek}
              aria-label="Next week"
              color="#6B7280"
              _hover={{bg: "#F3F4F6", color: "#181D27"}}
            />
          </HStack>
        </Flex>
      </Flex>

      <Flex w={{base: "100%", md: "25%"}} flexDirection={"column"}>
        <Text mb="8px" h="20px" fontSize="14px" fontWeight="500" color="#181D27">
          Load type <span style={{color: "#1570EF"}}>*</span>
        </Text>
        <Select
          options={[
            {label: "All", value: "all"},
            {label: "Dry Van", value: "dry_van"},
            {label: "Reefer", value: "reefer"},
            {label: "Flatbed", value: "flatbed"},
          ]}
          defaultValue="all"
        />
      </Flex>

      <Flex w={{base: "100%", md: "25%"}} flexDirection={"column"}>
        <Text mb="8px" h="20px" fontSize="14px" fontWeight="500" color="#181D27">
          Domicile <span style={{color: "#1570EF"}}>*</span>
        </Text>
        <Select
          options={[
            {label: "All", value: "all"},
            {label: "US", value: "us"},
            {label: "Canada", value: "canada"},
            {label: "Mexico", value: "mexico"},
          ]}
          defaultValue="all"
        />
      </Flex>
    </Flex>
  );
}

export default PerformanceFilter;
