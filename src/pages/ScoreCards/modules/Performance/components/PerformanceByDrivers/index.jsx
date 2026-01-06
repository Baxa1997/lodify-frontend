import React, {useState} from "react";
import {Box, Text, Flex, Link, Button} from "@chakra-ui/react";
import {FiDownload} from "react-icons/fi";
import SearchInput from "@components/SearchInput";
import {DataTable} from "@components/DataTable";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";
import {useSelector} from "react-redux";

export const PerformanceByDrivers = ({
  driversData = [],
  limit,
  setLimit = () => {},
  page,
  setPage = () => {},
  count,
}) => {
  const client_type = useSelector((state) => state.auth.client_type);
  const [searchQuery, setSearchQuery] = useState("");
  const {brokers_id} = useSelector((state) => state.auth.user_data);

  const isBroker = Boolean(brokers_id);

  const filteredData = driversData
    .filter(
      (driver) =>
        driver?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((driver) => ({
      full_name: driver?.first_name + " " + driver?.last_name,
      onTime: driver?.on_time_percentage,
      verificationScore: driver?.verification_score,
      legal_name: driver?.legal_name,
      loads: driver?.loads,
    }));

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
      key: "full_name",
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
      key: "verificationScore",
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
            Company Name
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
      key: "legal_name",
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
            Loads
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
      key: "loads",
      thProps: {
        width: "120px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
  ]?.filter((column) => (!isBroker ? column.key !== "legal_name" : true));

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
        count={count}
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
