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
} from "@chakra-ui/react";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import styles from "../../../../../../styles/tabs.module.scss";
import {format} from "date-fns";
import {useInsightsProps} from "./useInsightsProps";
import {InsightAddress} from "./InsightAddress";
import {AssosiationReport} from "./AssosiationReport";
import {useMemo} from "react";
import {EquipmentMatch} from "./EquipmentMatch";

function Insights({vinMatchesData, addressMatchesBodyData, new_info}) {
  const {
    virtualAddressData,
    equipmentData,
    associationInsights,
    locationInsights,
    associatedCarrierData,
    selectedTab,
    setSelectedTab,
    carrierAuditData,
  } = useInsightsProps();

  console.log("new_infonew_info", new_info);

  const matchedAddressesData = addressMatchesBodyData?.physical_address?.concat(
    addressMatchesBodyData?.mailing_address
  );

  const changedFields = useMemo(() => {
    if (!carrierAuditData) return [];

    const fields = [
      {key: "email", label: "Email", oldKey: "old_email"},
      {
        key: "mailing_address",
        label: "Mailing Address",
        oldKey: "old_mailing_address",
      },
      {
        key: "physical_address",
        label: "Physical Address",
        oldKey: "old_physical_address",
      },
      {key: "phone", label: "Phone", oldKey: "old_phone"},
      {
        key: "company_officer_1",
        label: "Company Officer 1",
        oldKey: "old_company_officer_1",
      },
      {
        key: "company_officer_2",
        label: "Company Officer 2",
        oldKey: "old_company_officer_2",
      },
    ];

    return fields
      .filter((field) => {
        const oldValue = carrierAuditData[field.oldKey];
        const newValue = carrierAuditData[field.key];

        return oldValue !== null && oldValue !== undefined && oldValue !== "";
      })
      .map((field) => ({
        ...field,
        oldValue: carrierAuditData[field.oldKey],
        newValue: carrierAuditData[field.key],
      }));
  }, [carrierAuditData]);

  const totalInsights = useMemo(() => {
    return (
      (virtualAddressData?.length || 0) +
      (equipmentData?.length || 0) +
      (addressMatchesBodyData?.physical_address?.length || 0) +
      (addressMatchesBodyData?.mailing_address?.length || 0) +
      (changedFields?.length || 0) +
      (new_info?.broker_stat === "A" ? 1 : 0)
    );
  }, [
    virtualAddressData,
    equipmentData,
    matchedAddressesData,
    addressMatchesBodyData,
    changedFields,
  ]);

  return (
    <InfoAccordionItem id="insights">
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
              {totalInsights} Total insights discovered
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
                flexWrap="wrap"
                gap="8px"
                align="stretch">
                {new_info?.broker_stat === "A" && (
                  <AssosiationReport
                    label="Broker is Active"
                    insight={{date: "Observed March, 2024"}}
                  />
                )}
                {associationInsights
                  ?.filter((insight) => !insight.filtered)
                  .map((insight, index) => (
                    <AssosiationReport key={index} insight={insight} />
                  ))}
                {addressMatchesBodyData?.physical_address?.length && (
                  <AssosiationReport
                    label="Physical Address"
                    insight={{date: "Observed March, 2024"}}
                  />
                )}

                {addressMatchesBodyData?.mailing_address?.length && (
                  <AssosiationReport
                    label="Mailing Address"
                    insight={{date: "Observed March, 2024"}}
                  />
                )}

                {vinMatchesData?.length > 0 && (
                  <AssosiationReport
                    label="VIN Match"
                    insight={{date: "Observed March, 2024"}}
                  />
                )}

                {changedFields?.map((field, index) => (
                  <AssosiationReport
                    key={`changed-${field.key}-${index}`}
                    label={field.label}
                    insight={{date: "Changed"}}
                  />
                ))}
              </VStack>
            </Box>
            {virtualAddressData?.length > 0 && (
              <Box>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color="#181D27"
                  mb="12px">
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
                          {format(new Date(), "MMM dd, yyyy")}
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
            )}
          </VStack>

          <Box>
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
                        TOTAL INSIGHTS DISCOVERED: {totalInsights}{" "}
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
                          {totalInsights}
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
                          {vinMatchesData?.length}
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
                          {matchedAddressesData?.length || 0}
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
                            {virtualAddressData?.map((item) => (
                              <InsightAddress
                                key={item.id}
                                item={item}
                                virtualAddress={true}
                              />
                            ))}

                            {addressMatchesBodyData?.physical_address?.map(
                              (item) => (
                                <InsightAddress
                                  key={item.id}
                                  item={item}
                                  allowToggle={true}
                                  physicalAddress={true}
                                />
                              )
                            )}

                            {addressMatchesBodyData?.mailing_address?.map(
                              (item) => (
                                <InsightAddress
                                  key={item.id}
                                  item={item}
                                  allowToggle={true}
                                  mailingAddress={true}
                                />
                              )
                            )}

                            {changedFields?.map((field, index) => (
                              <InsightAddress
                                key={`audit-${field.key}-${index}`}
                                item={{
                                  address: field.newValue,
                                  oldValue: field.oldValue,
                                  fieldLabel: field.label,
                                }}
                                isAuditChange={true}
                              />
                            ))}
                          </VStack>
                        </Box>

                        <Box flex="1" minW={{base: "100%", lg: "400px"}}>
                          <Text
                            fontSize="14px"
                            fontWeight="600"
                            color="#181D27"
                            mb="16px">
                            Reused Equipment on a Scheduled Auto: 1
                          </Text>
                          <VStack spacing="16px" align="stretch">
                            {equipmentData?.map((item) => (
                              <EquipmentMatch
                                key={item?.id}
                                item={item}
                                associatedCarrierData={associatedCarrierData}
                              />
                            ))}
                          </VStack>
                        </Box>
                      </Flex>
                    </TabPanel>

                    <TabPanel>
                      <Box mt="20px">
                        {vinMatchesData &&
                          vinMatchesData.map((item) => (
                            <Flex
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              gap="12px"
                              alignItems="center">
                              <Text
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27">
                                {item?.legal_name}
                              </Text>
                              -
                              <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="#181D27">
                                {item?.vin_number}
                              </Text>
                            </Flex>
                          ))}
                      </Box>
                    </TabPanel>

                    <TabPanel>
                      <Box mt="20px">
                        {addressMatchesBodyData?.physical_address?.map(
                          (item) => (
                            <Flex
                              mt="10px"
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              gap="12px"
                              alignItems="center">
                              <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="#181D27">
                                Matched Physical Address:
                              </Text>
                              -
                              <Text
                                fontSize="14px"
                                fontWeight="400"
                                color="#181D27">
                                {item?.physical_address}
                              </Text>
                            </Flex>
                          )
                        )}

                        {addressMatchesBodyData?.mailing_address?.map(
                          (item) => (
                            <Flex
                              mt="10px"
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              gap="12px"
                              alignItems="center">
                              <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="#181D27">
                                Matched Mailing Address:
                              </Text>
                              -
                              <Text
                                fontSize="14px"
                                fontWeight="400"
                                color="#181D27">
                                {item?.mailing_address}
                              </Text>
                            </Flex>
                          )
                        )}
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
