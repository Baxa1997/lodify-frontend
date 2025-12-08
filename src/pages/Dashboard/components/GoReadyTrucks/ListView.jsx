import React, {useState} from "react";
import {Box, Flex, Text, Badge} from "@chakra-ui/react";
import {DataTable} from "@components/DataTable";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";

export const ListView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Mock data matching the image
  const trucksData = [
    {
      truckNumber: "T-1024",
      origin: "Dallas, TX",
      destination: "Chicago, IL",
      destinationBadge: "3+",
      equipment: "Dry Van",
      make: "Volvo",
      modelYear: "2020",
      driverType: "Solo",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1025",
      origin: "Cleveland, OH",
      destination: "Dallas, TX",
      destinationBadge: "3+",
      equipment: "Stive Jobs",
      make: "Peterbilt",
      modelYear: "2020",
      driverType: "Team",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1026",
      origin: "Toledo, OH",
      destination: "San Antonio, TX",
      destinationBadge: "3+",
      equipment: "Reefer",
      make: "Kenworth",
      modelYear: "2020",
      driverType: "Solo",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1027",
      origin: "Fargo, ND",
      destination: "Austin, TX",
      equipment: "Flatbed",
      make: "Freightliner",
      modelYear: "2020",
      driverType: "Team",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1028",
      origin: "Nashville, TN",
      destination: "San Diego, CA",
      destinationBadge: "3+",
      equipment: "Tank Truck",
      make: "Mack",
      modelYear: "2020",
      driverType: "Solo",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1029",
      origin: "Phoenix, AZ",
      destination: "San Jose, CA",
      destinationBadge: "3+",
      equipment: "LTL",
      make: "Sterling",
      modelYear: "2020",
      driverType: "Team",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1030",
      origin: "Buffalo, NY",
      destination: "Phoenix, AZ",
      equipment: "Intermodal",
      make: "Ford",
      modelYear: "2020",
      driverType: "Solo",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1031",
      origin: "Miami, FL",
      destination: "Philadelphia, PA",
      destinationBadge: "3+",
      equipment: "Dump Truck",
      make: "International",
      modelYear: "2020",
      driverType: "Team",
      lastCheckin: "5:59:59",
    },
    {
      truckNumber: "T-1032",
      origin: "Las Vegas, NV",
      destination: "San Francisco, CA",
      destinationBadge: "3+",
      equipment: "Auto Transport",
      make: "Western Star",
      modelYear: "2020",
      driverType: "Solo",
      lastCheckin: "5:59:59",
    },
  ];

  const headData = [
    {
      label: "Truck Number",
      key: "truckNumber",
      thProps: {
        width: "140px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: "Origin",
      key: "origin",
      thProps: {
        width: "160px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: "Destination",
      key: "destination",
      thProps: {
        width: "180px",
      },
      render: (value, row) => (
        <Flex alignItems="center" gap="8px">
          <Text fontSize="14px" fontWeight="400" color="#374151">
            {value}
          </Text>
          {row.destinationBadge && (
            <Badge
              bg="#F3F4F6"
              color="#6B7280"
              fontSize="11px"
              fontWeight="500"
              px="6px"
              py="2px"
              borderRadius="4px">
              {row.destinationBadge}
            </Badge>
          )}
        </Flex>
      ),
    },
    {
      label: "Equipment",
      key: "equipment",
      thProps: {
        width: "140px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: "Make",
      key: "make",
      thProps: {
        width: "130px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: "Model year",
      key: "modelYear",
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
      label: "Driver Type",
      key: "driverType",
      thProps: {
        width: "130px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
    {
      label: "Last Checkin",
      key: "lastCheckin",
      thProps: {
        width: "140px",
      },
      render: (value) => (
        <Text fontSize="14px" fontWeight="400" color="#374151">
          {value}
        </Text>
      ),
    },
  ];

  // Add sort icons to headers
  const headDataWithSort = headData.map((head) => ({
    ...head,
    label: (
      <Flex alignItems="center" gap="6px" cursor="pointer">
        <Text
          fontSize="12px"
          fontWeight="600"
          color="#374151"
          textTransform="capitalize">
          {head.label}
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
  }));

  return (
    <Box>
      <DataTable
        headData={headDataWithSort}
        data={trucksData}
        pagination={true}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        count={trucksData.length}
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
