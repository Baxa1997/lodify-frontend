import React, {useState} from "react";
import {
  Box,
  Text,
  Flex,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import {MapView} from "./MapView";
import {ListView} from "./ListView";

export const GoReadyTrucks = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box bg="#fff" p="24px" borderRadius="12px" mt="32px">
      <Flex
        justifyContent="space-between"
        alignItems={{base: "flex-start", md: "center"}}
        flexDirection={{base: "column", md: "row"}}
        mb="24px"
        gap="12px">
        <Box>
          <Text fontSize="20px" fontWeight="700" color="#181D27" mb="8px">
            Go Ready™ Trucks
          </Text>
          <Text fontSize="14px" color="#6B7280" fontWeight="400">
            Track your fleet in real time. View truck locations, driving status,
            speed, and mileage on the map.
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
          View details
          <Text as="span" fontSize="12px">
            &gt;
          </Text>
        </Link>
      </Flex>

      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList borderBottom="2px solid #E5E7EB" mb="0">
          <Tab
            _selected={{
              color: "#EF6820",
              borderBottom: "2px solid #EF6820",
              fontWeight: "600",
            }}
            color="#6B7280"
            fontSize="14px"
            fontWeight="500"
            px="0"
            mr="32px"
            pb="12px"
            borderBottom="2px solid transparent"
            mb="-2px">
            Map
          </Tab>
          <Tab
            _selected={{
              color: "#EF6820",
              borderBottom: "2px solid #EF6820",
              fontWeight: "600",
            }}
            color="#6B7280"
            fontSize="14px"
            fontWeight="500"
            px="0"
            mr="32px"
            pb="12px"
            borderBottom="2px solid transparent"
            mb="-2px">
            List
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px="0" pt="20px">
            <MapView />
          </TabPanel>
          <TabPanel px="0" pt="20px">
            <ListView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
