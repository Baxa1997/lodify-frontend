import React, {useState} from "react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {
  Flex,
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import styles from "../../../../../../styles/tabs.module.scss";
import {MdExpandMore} from "react-icons/md";

function Insights() {
  const [selectedTab, setSelectedTab] = useState(0);

  const associationInsights = [
    {
      title: "Reused Equipment Scheduled Auto",
      date: "Observed March, 2024",
    },
    {
      title: "Flagged Factor",
      date: "Observed May, 2023",
    },
  ];

  const locationInsights = [
    {
      title: "Virtual Office Address",
      date: "Observed January, 2022",
    },
  ];

  const associatedCarrierData = {
    name: "OPERATION X LLC",
    status: "Authorized Carrier",
    vehicle: {
      make: "International",
      model: "LF687",
      year: "2015",
      international: "2HSDIAPREENS22924",
      regState: "-",
      plateNumber: "-",
      class: "Class 8",
      nonies: "15V1",
    },
  };

  return (
    <InfoAccordionItem>
      <InfoAccordionButton>
        <Flex justify="space-between" align="center" width="100%">
          <HStack spacing="8px">
            <InfoAccordionTitle>Insights</InfoAccordionTitle>
            <Badge
              bg="#FEF6EE"
              color="#F38744"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="12px"
              fontWeight="600">
              3 Total insights discovered
            </Badge>
          </HStack>
        </Flex>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <VStack spacing="24px" align="stretch">
          <Box
            bg="#F9FAFB"
            borderRadius="8px"
            p="8px 12px"
            display="flex"
            alignItems="center"
            gap="12px">
            <Box
              as="img"
              src="/img/insightsIcon1.svg"
              alt="warning"
              w="20px"
              h="20px"
              flexShrink={0}
            />
            <Text fontSize="14px" color="#6B7280" fontWeight="600">
              Sharing screenshots externally may cause you to lose access to
              Highway. Please help us protect your network.
            </Text>
          </Box>

          <VStack spacing="16px" align="stretch">
            <Box>
              <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
                Association Insights
              </Text>
              <VStack
                display="flex"
                flexDir="row"
                spacing="8px"
                align="stretch">
                {associationInsights.map((insight, index) => (
                  <Flex
                    minW="300px"
                    w={"fit-content"}
                    bg="#FAFAFA"
                    borderRadius="8px"
                    p="12px 16px"
                    gap="12px"
                    justifyContent="space-between">
                    <Box>
                      <Text color="#181D27" fontSize="14px" fontWeight="500">
                        {insight.title}
                      </Text>
                      <Text color="#6B7280" fontSize="14px" fontWeight="400">
                        {insight.date}
                      </Text>
                    </Box>
                    <Box>
                      <AiOutlineExclamationCircle
                        width="20px"
                        height="20px"
                        fontSize="20px"
                        color="#EF6820"
                      />
                    </Box>
                  </Flex>
                ))}
              </VStack>
            </Box>

            <Box>
              <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
                Location Insights
              </Text>
              <VStack spacing="8px" align="stretch">
                {locationInsights.map((insight, index) => (
                  <Flex
                    minW="300px"
                    w={"fit-content"}
                    bg="#FAFAFA"
                    borderRadius="8px"
                    p="12px 16px"
                    gap="12px"
                    justifyContent="space-between">
                    <Box>
                      <Text color="#181D27" fontSize="14px" fontWeight="500">
                        {insight.title}
                      </Text>
                      <Text color="#6B7280" fontSize="14px" fontWeight="400">
                        {insight.date}
                      </Text>
                    </Box>
                    <Box>
                      <AiOutlineExclamationCircle
                        width="20px"
                        height="20px"
                        fontSize="20px"
                        color="#EF6820"
                      />
                    </Box>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </VStack>

          <Box borderTop="1px solid #E5E7EB" pt="24px" mt="24px">
            <Accordion allowToggle defaultIndex={[]}>
              <AccordionItem
                border="1px solid #E5E7EB"
                borderRadius="12px"
                bg="white">
                <AccordionButton
                  p="16px 20px"
                  _hover={{bg: "#fff"}}
                  _expanded={{bg: "#fff"}}
                  borderRadius="12px">
                  <Flex
                    flex="1"
                    align="center"
                    justify="space-between"
                    textAlign="left">
                    <HStack spacing="12px">
                      <Text fontSize="16px" fontWeight="600" color="#181D27">
                        Insights Details
                      </Text>
                      <Badge
                        bg="#FEF6EE"
                        color="#F38744"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="12px"
                        fontWeight="600"
                        textTransform="uppercase">
                        TOTAL INSIGHTS DISCOVERED: 3
                      </Badge>
                    </HStack>
                    <Box ml="auto">
                      <AccordionIcon color="#181D27" fontSize="20px" />
                    </Box>
                  </Flex>
                </AccordionButton>
                <AccordionPanel pb="20px" px="20px">
                  <Tabs
                    className={styles.tabsContainer}
                    selectedIndex={selectedTab}
                    onSelect={(index) => setSelectedTab(index)}>
                    <TabList>
                      <Tab>
                        Association
                        <Badge
                          ml="8px"
                          bg="#F3F4F6"
                          color="#6B7280"
                          borderRadius="full"
                          px="8px"
                          py="2px"
                          fontSize="11px"
                          fontWeight="600">
                          2
                        </Badge>
                      </Tab>
                      <Tab>
                        VIN Match
                        <Badge
                          ml="8px"
                          bg="#F3F4F6"
                          color="#6B7280"
                          borderRadius="full"
                          px="8px"
                          py="2px"
                          fontSize="11px"
                          fontWeight="600">
                          1
                        </Badge>
                      </Tab>
                      <Tab>
                        Location
                        <Badge
                          ml="8px"
                          bg="#F3F4F6"
                          color="#6B7280"
                          borderRadius="full"
                          px="8px"
                          py="2px"
                          fontSize="11px"
                          fontWeight="600">
                          1
                        </Badge>
                      </Tab>
                    </TabList>

                    <TabPanel>
                      <Flex
                        gap="24px"
                        mt="20px"
                        flexWrap={{base: "wrap", lg: "nowrap"}}>
                        <Box flex="1" minW={{base: "100%", lg: "400px"}}>
                          <VStack spacing="12px" align="stretch">
                            {[
                              {
                                name: "Virtual Office Address",
                                date: "Observed January, 2022",
                              },
                              {
                                name: "Virtual Office Address",
                                date: "Observed January, 2022",
                              },
                            ].map((item) => (
                              <Accordion key={item} allowToggle>
                                <AccordionItem
                                  border="1px solid #E5E7EB"
                                  borderRadius="8px"
                                  bg="white">
                                  <AccordionButton
                                    p="16px"
                                    _hover={{bg: "#fff"}}
                                    _expanded={{bg: "#fff"}}
                                    textAlign="left">
                                    <Flex
                                      minW="300px"
                                      w={"100%"}
                                      bg="#FAFAFA"
                                      borderRadius="8px"
                                      p="12px 16px"
                                      gap="12px"
                                      justifyContent="space-between"
                                      alignItems="center">
                                      <Box flex="1" textAlign="left">
                                        <Text
                                          color="#181D27"
                                          fontSize="14px"
                                          fontWeight="500"
                                          textAlign="left">
                                          {item.name}
                                        </Text>
                                        <Text
                                          color="#6B7280"
                                          fontSize="14px"
                                          fontWeight="400"
                                          textAlign="left">
                                          {item.date}
                                        </Text>
                                      </Box>
                                      <HStack spacing="8px" flexShrink={0}>
                                        <Box>
                                          <AiOutlineExclamationCircle
                                            width="20px"
                                            height="20px"
                                            fontSize="20px"
                                            color="#EF6820"
                                          />
                                        </Box>
                                        <AccordionIcon
                                          color="#181D27"
                                          fontSize="16px"
                                        />
                                      </HStack>
                                    </Flex>
                                  </AccordionButton>
                                  <AccordionPanel pb="16px" px="16px">
                                    <Text
                                      fontSize="14px"
                                      color="#6B7280"
                                      lineHeight="1.6">
                                      Another carrier has used a power unit with
                                      a VIN matching a vehicle on the scheduled
                                      auto policy of this carrier.
                                    </Text>
                                  </AccordionPanel>
                                </AccordionItem>
                              </Accordion>
                            ))}
                          </VStack>
                        </Box>

                        {/* Right Panel - Associated Carrier Details */}
                        <Box flex="1" minW={{base: "100%", lg: "400px"}}>
                          <Text
                            fontSize="14px"
                            fontWeight="600"
                            color="#181D27"
                            mb="16px">
                            Reused Equipment on a Scheduled Auto: 1
                          </Text>
                          <VStack spacing="16px" align="stretch">
                            {[1, 2].map((item) => (
                              <Box
                                key={item}
                                bg="white"
                                border="1px solid #E5E7EB"
                                borderRadius="8px"
                                p="20px">
                                <Flex
                                  justify="space-between"
                                  align="flex-start"
                                  mb="16px">
                                  <VStack
                                    align="flex-start"
                                    spacing="8px"
                                    flex="1">
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      textTransform="uppercase"
                                      letterSpacing="0.5px">
                                      Associated Carrier
                                    </Text>
                                    <HStack spacing="8px">
                                      <Text
                                        fontSize="16px"
                                        fontWeight="600"
                                        color="#EF6820">
                                        {associatedCarrierData.name}
                                      </Text>
                                      <Badge
                                        bg="#DEFFEE"
                                        color="#16B364"
                                        px="8px"
                                        py="2px"
                                        borderRadius="4px"
                                        fontSize="11px"
                                        fontWeight="600">
                                        {associatedCarrierData.status}
                                      </Badge>
                                    </HStack>
                                  </VStack>
                                  <Box
                                    as="img"
                                    src="/img/truck.svg"
                                    alt="truck"
                                    w="32px"
                                    h="32px"
                                    color="#EF6820"
                                  />
                                </Flex>
                                <Box borderTop="1px solid #E5E7EB" pt="16px">
                                  <Table variant="simple" size="sm">
                                    <Tbody>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none"
                                          width="40%">
                                          Make:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {associatedCarrierData.vehicle.make}
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          Model:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {associatedCarrierData.vehicle.model}
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          Year:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {associatedCarrierData.vehicle.year}
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          International:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {
                                            associatedCarrierData.vehicle
                                              .international
                                          }
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          Reg, State:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {
                                            associatedCarrierData.vehicle
                                              .regState
                                          }
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          Plate #:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {
                                            associatedCarrierData.vehicle
                                              .plateNumber
                                          }
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          Class:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {associatedCarrierData.vehicle.class}
                                        </Td>
                                      </Tr>
                                      <Tr>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#6B7280"
                                          fontWeight="500"
                                          border="none">
                                          Nonies:
                                        </Td>
                                        <Td
                                          px="0"
                                          py="6px"
                                          fontSize="13px"
                                          color="#181D27"
                                          fontWeight="400"
                                          border="none">
                                          {associatedCarrierData.vehicle.nonies}
                                        </Td>
                                      </Tr>
                                    </Tbody>
                                  </Table>
                                </Box>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      </Flex>
                    </TabPanel>

                    <TabPanel>
                      <Box mt="20px">
                        <Text color="#6B7280">
                          VIN Match content coming soon...
                        </Text>
                      </Box>
                    </TabPanel>

                    <TabPanel>
                      <Box mt="20px">
                        <Text color="#6B7280">
                          Location content coming soon...
                        </Text>
                      </Box>
                    </TabPanel>
                  </Tabs>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </VStack>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  );
}

export default Insights;
