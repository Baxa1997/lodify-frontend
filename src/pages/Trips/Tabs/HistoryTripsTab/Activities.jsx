import React from "react";
import {
  Box,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
  Link,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import AssignedPayouts from "./AssignedPayouts";

function Activities({ tripDetails = {} }) {
  return (
    <Flex
      gap="20px"
      mt="20px"
      w="100%">
      <Box
        w="33%"
        border="1px solid #E9EAEB"
        borderRadius="12px"
        bg="white"
        overflow="hidden">
        <Flex
          justify="space-between"
          align="center"
          borderBottom="1px solid #E9EAEB"
          p={4}>
          <Text
            fontWeight="600"
            color="#181D27"
            fontSize="20px">
            Activities
          </Text>
          <Flex gap="12px">
            <Button
              px="0"
              h="20px"
              fontSize="14px"
              color="blue.600"
              fontWeight="500"
              bg="transparent"
              border="none"
              _hover={{ bg: "transparent" }}>
              View all
            </Button>
            <Button
              p="0"
              minW="20px"
              w="20px"
              h="20px"
              bg="transparent"
              border="none"
              _hover={{ bg: "transparent" }}>
              <img
                src="/img/threeDots.svg"
                alt="" />
            </Button>
          </Flex>
        </Flex>

        <Tabs
          position="relative"
          variant="unstyled">
          <TabList
            px="16px"
            pt="12px">
            <Tab
              fontSize="14px"
              fontWeight="500"
              color="gray.600"
              _selected={{ color: "blue.600" }}>
              Trip Activities
            </Tab>
            <Tab
              fontSize="14px"
              fontWeight="500"
              color="gray.600"
              _selected={{ color: "blue.600" }}>
              Driver Activities
            </Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.600"
            borderRadius="1px"
          />

          <TabPanels
            px="16px"
            py="16px">
            <TabPanel>
              <SimpleGrid
                columns={2}
                spacingY="12px">
                <Text
                  fontSize="14px"
                  color="gray.700">
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    mb="12px">
                    Current status
                  </Text>
                </Text>
                <Text
                  fontSize="14px"
                  color="gray.700">
                  Accessorials
                </Text>

                <Text
                  fontSize="14px"
                  color="gray.700"></Text>
                <Flex
                  flexDirection="column"
                  gap="4px">
                  {" "}
                  <Text>Booked by</Text>
                  <Text
                    color="#181D27"
                    fontSize="14px"
                    fontWeight="500">
                    {tripDetails?.booked_by?.full_name || ""}
                  </Text>
                </Flex>

                <Text
                  fontSize="14px"
                  color="gray.700"></Text>
                <Flex
                  flexDirection="column"
                  gap="4px">
                  {" "}
                  <Text>Creation type</Text>
                  <Text
                    color="#181D27"
                    fontSize="14px"
                    fontWeight="500">
                    {tripDetails?.creation_type?.[0]}
                  </Text>
                </Flex>

                <Text
                  fontSize="14px"
                  color="gray.700"></Text>
                <Flex
                  flexDirection="column"
                  gap="4px">
                  {" "}
                  <Text>Customer</Text>
                  <Text
                    color="#181D27"
                    fontSize="14px"
                    fontWeight="500">
                    {tripDetails?.booked_from?.legal_name || ""}
                  </Text>
                </Flex>
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Text
                fontSize="14px"
                color="gray.600">
                No driver activities yet.
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <AssignedPayouts tripDetails={tripDetails} />
    </Flex>
  );
}

export default Activities;
