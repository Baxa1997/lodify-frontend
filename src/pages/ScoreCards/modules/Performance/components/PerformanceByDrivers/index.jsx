import React, {useState} from "react";
import {Box, Text, Flex, Link, Button} from "@chakra-ui/react";
import {FiDownload} from "react-icons/fi";
import SearchInput from "@components/SearchInput";
import {DataTable} from "@components/DataTable";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";

export const PerformanceByDrivers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const driversData = [
    {
      driver: "Furkat Yuldashev",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 1,
      distance: "1,896.55 ml",
    },
    {
      driver: "Oybek E Karimov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 11,
      distance: "1,140.24 ml",
    },
    {
      driver: "Nodir Shavkatov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 2,
      distance: "852.01 ml",
    },
    {
      driver: "Anaskhon Pulatov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 2,
      distance: "523.13 ml",
    },
    {
      driver: "Aziz Mukhammadiev",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 3,
      distance: "1,776.55 ml",
    },
    {
      driver: "Alibek Zaripov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 2,
      distance: "588.45 ml",
    },
    {
      driver: "Bunyod Homidov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 1,
      distance: "219.05 ml",
    },
    {
      driver: "Muhammed Girgin",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 1,
      distance: "2,579.52 ml",
    },
    {
      driver: "Bekzod Umarov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 23,
      distance: "12,165.52 ml",
    },
    {
      driver: "Isomiddin Gofurov",
      onTime: "100.00%",
      appStepsCompletion: "100.00%",
      legs: 16,
      distance: "8,193.84 ml",
    },
  ];

  const filteredData = driversData.filter((driver) =>
    driver.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headData = [
    {
      label: (
        <Flex alignItems="center" gap="6px" cursor="pointer">
          <Text
            fontSize="12px"
            fontWeight="600"
            color="#374151"
            textTransform="capitalize">
            Driver
          </Text>
          <Box display="flex" flexDirection="column" gap="0" lineHeight="1">
            <LuChevronUp
              size={12}
              color="#9CA3AF"
              style={{marginBottom: "-2px"}}
            />
            <LuChevronDown size={12} color="#9CA3AF" />
          </Box>
        </Flex>
      ),
      key: "driver",
      thProps: {
        width: "200px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: (
        <Flex alignItems="center" gap="6px" cursor="pointer">
          <Text
            fontSize="12px"
            fontWeight="600"
            color="#374151"
            textTransform="capitalize">
            On time
          </Text>
          <Box display="flex" flexDirection="column" gap="0" lineHeight="1">
            <LuChevronUp
              size={12}
              color="#9CA3AF"
              style={{marginBottom: "-2px"}}
            />
            <LuChevronDown size={12} color="#9CA3AF" />
          </Box>
        </Flex>
      ),
      key: "onTime",
      thProps: {
        width: "150px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: (
        <Flex alignItems="center" gap="6px" cursor="pointer">
          <Text
            fontSize="12px"
            fontWeight="600"
            color="#374151"
            textTransform="capitalize">
            App steps completion
          </Text>
          <Box display="flex" flexDirection="column" gap="0" lineHeight="1">
            <LuChevronUp
              size={12}
              color="#9CA3AF"
              style={{marginBottom: "-2px"}}
            />
            <LuChevronDown size={12} color="#9CA3AF" />
          </Box>
        </Flex>
      ),
      key: "appStepsCompletion",
      thProps: {
        width: "200px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: (
        <Flex alignItems="center" gap="6px" cursor="pointer">
          <Text
            fontSize="12px"
            fontWeight="600"
            color="#374151"
            textTransform="capitalize">
            Legs
          </Text>
          <Box display="flex" flexDirection="column" gap="0" lineHeight="1">
            <LuChevronUp
              size={12}
              color="#9CA3AF"
              style={{marginBottom: "-2px"}}
            />
            <LuChevronDown size={12} color="#9CA3AF" />
          </Box>
        </Flex>
      ),
      key: "legs",
      thProps: {
        width: "120px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: (
        <Flex alignItems="center" gap="6px" cursor="pointer">
          <Text
            fontSize="12px"
            fontWeight="600"
            color="#374151"
            textTransform="capitalize">
            Distance
          </Text>
          <Box display="flex" flexDirection="column" gap="0" lineHeight="1">
            <LuChevronUp
              size={12}
              color="#9CA3AF"
              style={{marginBottom: "-2px"}}
            />
            <LuChevronDown size={12} color="#9CA3AF" />
          </Box>
        </Flex>
      ),
      key: "distance",
      thProps: {
        width: "150px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
  ];

  return (
    <Box bg="#fff" borderRadius="12px" mt="32px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "center"}}
        flexDirection={{base: "column", md: "row"}}
        mb="20px"
        gap="12px">
        <Box>
          <Text fontSize="20px" fontWeight="700" color="#181D27" mb="4px">
            Performance by drivers
          </Text>
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Showing date for last 6 active weeks view: May 18, 2025 - Jun 28,
            2025
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
          _hover={{textDecoration: "underline", color: "#EF6820"}}
          whiteSpace="nowrap">
          <Flex
            borderRadius="50%"
            border="1px solid #EF6820"
            p="4px"
            w="16px"
            h="16px"
            fontSize="12px"
            justifyContent="center"
            alignItems="center">
            ?
          </Flex>
          What are active weeks?
        </Link>
      </Flex>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
        gap="16px"
        flexDirection={{base: "column", md: "row"}}>
        <Box flex="1" maxW={{base: "100%", md: "400px"}}>
          <SearchInput
            bg="#fff"
            color="#000"
            placeholder="Search for name"
            onSearch={setSearchQuery}
          />
        </Box>
        <Button
          leftIcon={<FiDownload />}
          bg="#EF6820"
          color="white"
          _hover={{bg: "#d45a1a"}}
          fontSize="14px"
          fontWeight="600"
          px="20px"
          h="40px">
          Export
        </Button>
      </Flex>

      <DataTable
        headData={headData}
        data={filteredData}
        pagination={true}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        count={filteredData.length}
        border="1px solid #E5E7EB"
        borderRadius="12px"
        overflow="hidden"
        tableProps={{
          variant: "simple",
          size: "md",
        }}
      />
    </Box>
  );
};
