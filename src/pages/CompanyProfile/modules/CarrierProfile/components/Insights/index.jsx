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
  Button,
} from "@chakra-ui/react";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import {useNavigate, useSearchParams} from "react-router-dom";
import styles from "../../../../../../styles/tabs.module.scss";
import {format, parseISO, isValid} from "date-fns";
import {useInsightsProps} from "./useInsightsProps";
import {InsightAddress} from "./InsightAddress";
import {AssosiationReport} from "./AssosiationReport";
import {useMemo, useState, useEffect} from "react";
import {EquipmentMatch} from "./EquipmentMatch";

function Insights({
  vinMatchesData,
  addressMatchesBodyData,
  new_info,
  contactsMatchesData,
  pendingInsuranceData,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companiesId = searchParams.get("id");
  const [accordionIndex, setAccordionIndex] = useState([]);
  const [insightsDetailsIndex, setInsightsDetailsIndex] = useState([]);
  const {
    virtualAddressData,
    associationInsights,
    locationInsights,
    associatedCarrierData,
    selectedTab,
    setSelectedTab,
    carrierAuditData,
  } = useInsightsProps();

  const {
    company_officer_1 = [],
    company_officer_2 = [],
    email = [],
    phone = [],
  } = contactsMatchesData || {};

  console.log("phonephone", phone);

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

        return oldValue !== null && oldValue !== undefined && oldValue !== "";
      })
      .map((field) => ({
        ...field,
        oldValue: carrierAuditData[field.oldKey],
        newValue: carrierAuditData[field.key],
        addedTime: carrierAuditData?.added_time,
      }));
  }, [carrierAuditData]);

  const totalInsights = useMemo(() => {
    const hasInsuranceCancellation =
      pendingInsuranceData?.some(
        (insurance) => insurance?.cancl_effective_date
      ) || false;
    return (
      (virtualAddressData?.length || 0) +
      (vinMatchesData?.length || 0) +
      (addressMatchesBodyData?.physical_address?.length || 0) +
      (addressMatchesBodyData?.mailing_address?.length || 0) +
      (changedFields?.length || 0) +
      (company_officer_1?.length || 0) +
      (company_officer_2?.length || 0) +
      (email?.length || 0) +
      (phone?.length || 0) +
      (hasInsuranceCancellation ? 1 : 0) +
      (new_info?.broker_stat === "A" ? 1 : 0)
    );
  }, [
    virtualAddressData,
    vinMatchesData,
    addressMatchesBodyData,
    changedFields,
    company_officer_1,
    company_officer_2,
    email,
    phone,
    pendingInsuranceData,
    new_info?.broker_stat,
  ]);

  const associationCount = useMemo(() => {
    const hasInsuranceCancellation =
      pendingInsuranceData?.some(
        (insurance) => insurance?.cancl_effective_date
      ) || false;
    return (
      (vinMatchesData?.length || 0) +
      (addressMatchesBodyData?.physical_address?.length || 0) +
      (addressMatchesBodyData?.mailing_address?.length || 0) +
      (changedFields?.length || 0) +
      (company_officer_1?.length || 0) +
      (company_officer_2?.length || 0) +
      (email?.length || 0) +
      (phone?.length || 0) +
      (hasInsuranceCancellation ? 1 : 0) +
      (new_info?.broker_stat === "A" ? 1 : 0)
    );
  }, [
    vinMatchesData,
    addressMatchesBodyData,
    changedFields,
    company_officer_1,
    company_officer_2,
    email,
    phone,
    pendingInsuranceData,
    new_info?.broker_stat,
  ]);

  const matchedAddressesCount = useMemo(() => {
    return (
      (addressMatchesBodyData?.physical_address?.length || 0) +
      (addressMatchesBodyData?.mailing_address?.length || 0) +
      (company_officer_1?.length || 0) +
      (company_officer_2?.length || 0) +
      (email?.length || 0) +
      (phone?.length || 0)
    );
  }, [
    addressMatchesBodyData,
    company_officer_1,
    company_officer_2,
    email,
    phone,
  ]);

  const changedFieldsCount = useMemo(() => {
    return (
      changedFields?.filter(
        (field) =>
          field.oldValue &&
          field.oldValue !== "" &&
          field.newValue &&
          field.oldValue !== field.newValue &&
          (field.key === "email" ||
            field.key === "phone" ||
            field.key === "physical_address" ||
            field.key === "mailing_address")
      ).length || 0
    );
  }, [changedFields]);

  const locationCount = useMemo(() => {
    return (
      (virtualAddressData?.length || 0) +
      (changedFields?.filter(
        (field) =>
          (field.key === "physical_address" ||
            field.key === "mailing_address") &&
          field.oldValue &&
          field.oldValue !== "" &&
          field.newValue &&
          field.oldValue !== field.newValue
      ).length || 0)
    );
  }, [virtualAddressData, changedFields]);

  useEffect(() => {
    setAccordionIndex([]);
    setInsightsDetailsIndex([]);
  }, [companiesId]);

  return (
    <InfoAccordionItem id="insights" index={accordionIndex}>
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
                    label="Broker Authority is Active"
                    insight={{date: "Observed March, 2024"}}
                  />
                )}
                {pendingInsuranceData?.some(
                  (insurance) => insurance?.cancl_effective_date
                ) && (
                  <AssosiationReport
                    label="Insurance will be expired"
                    insight={{date: insurance?.cancl_effective_date}}
                  />
                )}
                {associationInsights
                  ?.filter((insight) => !insight.filtered)
                  .map((insight, index) => (
                    <AssosiationReport key={index} insight={insight} />
                  ))}
                {addressMatchesBodyData?.physical_address?.length > 0 && (
                  <AssosiationReport
                    label="Physical Address"
                    insight={{date: "Matched"}}
                  />
                )}
                {addressMatchesBodyData?.mailing_address?.length > 0 && (
                  <AssosiationReport
                    label="Mailing Address"
                    insight={{date: "Matched"}}
                  />
                )}
                {company_officer_1?.length > 0 && (
                  <AssosiationReport
                    label="Company Officer 1"
                    insight={{date: "Matched"}}
                  />
                )}
                {company_officer_2?.length > 0 && (
                  <AssosiationReport
                    label="Company Officer 2"
                    insight={{date: "Matched"}}
                  />
                )}
                {email?.length > 0 && (
                  <AssosiationReport
                    label="Email"
                    insight={{date: "Matched"}}
                  />
                )}
                {phone?.length > 0 && (
                  <AssosiationReport
                    label="Phone"
                    insight={{date: "Matched"}}
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
            <Accordion
              allowToggle
              index={insightsDetailsIndex}
              onChange={setInsightsDetailsIndex}
              key={`insights-details-${companiesId}`}>
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
                        textTransform="capitalize">
                        TOTAL INSIGHTS DISCOVERED: {totalInsights}{" "}
                      </Badge>
                    </HStack>
                    <Box ml="auto">
                      <AccordionIcon color="#181D27" fontSize="20px" />
                    </Box>
                  </Flex>
                </AccordionButton>
                <AccordionPanel expanded={false} pb="20px" px="20px">
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
                          {associationCount}
                        </Badge>
                      </Tab>
                      {vinMatchesData?.length > 0 && (
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
                      )}
                      {matchedAddressesCount > 0 && (
                        <Tab>
                          Matched
                          <Badge
                            ml="8px"
                            bg="#F3F4F6"
                            color="#6B7280"
                            borderRadius="full"
                            px="8px"
                            py="2px"
                            fontSize="11px"
                            fontWeight="600">
                            {matchedAddressesCount}
                          </Badge>
                        </Tab>
                      )}
                      {locationCount > 0 && (
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
                            {locationCount}
                          </Badge>
                        </Tab>
                      )}
                      {changedFieldsCount > 0 && (
                        <Tab>
                          Changed
                          <Badge
                            ml="8px"
                            bg="#F3F4F6"
                            color="#6B7280"
                            borderRadius="full"
                            px="8px"
                            py="2px"
                            fontSize="11px"
                            fontWeight="600">
                            {changedFieldsCount}
                          </Badge>
                        </Tab>
                      )}
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
                                  onNavigate={navigate}
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
                                  onNavigate={navigate}
                                />
                              )
                            )}

                            {company_officer_1?.map((item, index) => (
                              <InsightAddress
                                key={`officer-1-${index}`}
                                item={{
                                  ...item,
                                  fieldLabel: "Company Officer 1",
                                  address:
                                    item?.name ||
                                    item?.officer_name ||
                                    item?.contact ||
                                    "Not available",
                                }}
                                isOfficer={true}
                                onNavigate={navigate}
                              />
                            ))}

                            {company_officer_2?.map((item, index) => (
                              <InsightAddress
                                key={`officer-2-${index}`}
                                item={{
                                  ...item,
                                  fieldLabel: "Company Officer 2",
                                  address:
                                    item?.name ||
                                    item?.officer_name ||
                                    item?.contact ||
                                    "Not available",
                                }}
                                isOfficer={true}
                                onNavigate={navigate}
                              />
                            ))}

                            {email?.map((item, index) => (
                              <InsightAddress
                                key={`email-${index}`}
                                item={{
                                  ...item,
                                  fieldLabel: "Email",
                                  address:
                                    item?.email ||
                                    item?.contact ||
                                    "Not available",
                                }}
                                isAuditChange={true}
                                onNavigate={navigate}
                              />
                            ))}

                            {phone?.map((item, index) => (
                              <InsightAddress
                                key={`phone-${index}`}
                                item={{
                                  ...item,
                                  fieldLabel: "Phone",
                                  address:
                                    item?.phone ||
                                    item?.contact ||
                                    "Not available",
                                }}
                                isAuditChange={true}
                                onNavigate={navigate}
                              />
                            ))}

                            {changedFields?.map((field, index) => (
                              <InsightAddress
                                key={`audit-${field.key}-${index}`}
                                item={{
                                  address: field.newValue,
                                  oldValue: field.oldValue,
                                  fieldLabel: field.label,
                                  addedTime: field.addedTime,
                                }}
                                isAuditChange={true}
                              />
                            ))}
                            {/* 
                            {vinMatchesData?.map((item, index) => (
                              <InsightAddress
                                key={`vin-match-${index}`}
                                item={{
                                  ...item,
                                  fieldLabel: "VIN Match",
                                  address: item?.vin_number || "Not available",
                                  legal_name: item?.legal_name,
                                  guid: item?.guid || item?.companies_id,
                                  companies_id:
                                    item?.companies_id || item?.guid,
                                }}
                                isAuditChange={true}
                                onNavigate={navigate}
                              />
                            ))} */}
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
                            {vinMatchesData?.map((item) => (
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

                    {vinMatchesData?.length > 0 && (
                      <TabPanel>
                        <VStack spacing="12px" align="stretch" mt="20px">
                          {vinMatchesData.map((item, index) => (
                            <Box
                              key={index}
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              bg="white">
                              <VStack align="start" spacing="8px">
                                <Text
                                  fontSize="12px"
                                  fontWeight="600"
                                  color="#6B7280"
                                  textTransform="capitalize">
                                  VIN{" "}
                                  <Text as="span" fontWeight="700" color="#000">
                                    Matched
                                  </Text>
                                </Text>
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    Company:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="#181D27">
                                    {item?.legal_name || "Not available"}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    VIN Number:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="500"
                                    color="#181D27"
                                    fontFamily="monospace">
                                    {item?.vin_number || "Not available"}
                                  </Text>
                                </Box>
                                {item?.guid || item?.companies_id ? (
                                  <Button
                                    size="sm"
                                    bg="#EF6820"
                                    color="white"
                                    _hover={{bg: "#DC5A1A"}}
                                    onClick={() =>
                                      navigate(
                                        `/admin/company?id=${
                                          item?.guid || item?.companies_id
                                        }`,
                                        {
                                          replace: false,
                                        }
                                      )
                                    }
                                    mt="8px">
                                    Carrier Profile
                                  </Button>
                                ) : null}
                              </VStack>
                            </Box>
                          ))}
                        </VStack>
                      </TabPanel>
                    )}

                    {matchedAddressesCount > 0 && (
                      <TabPanel>
                        <VStack spacing="12px" align="stretch" mt="20px">
                          {addressMatchesBodyData?.physical_address?.map(
                            (item, index) => (
                              <Box
                                position="relative"
                                key={`matched-physical-${index}`}
                                border="1px solid #EF6820"
                                borderRadius="12px"
                                p="16px"
                                bg="white">
                                <VStack align="start" spacing="8px">
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    textTransform="capitalize">
                                    Physical Address{" "}
                                    <Text
                                      as="span"
                                      fontWeight="700"
                                      color="#000">
                                      Matched
                                    </Text>
                                  </Text>
                                  {item?.legal_name && (
                                    <Box>
                                      <Text
                                        fontSize="12px"
                                        fontWeight="600"
                                        color="#6B7280"
                                        mb="4px">
                                        Matched Company:
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        color="#181D27">
                                        {item.legal_name}
                                      </Text>
                                    </Box>
                                  )}
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Physical Address:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {item?.physical_address ||
                                        "Not available"}
                                    </Text>
                                  </Box>
                                  {item?.guid && (
                                    <Button
                                      position="absolute"
                                      top="16px"
                                      right="16px"
                                      size="sm"
                                      bg="#EF6820"
                                      color="white"
                                      _hover={{bg: "#DC5A1A"}}
                                      onClick={() =>
                                        navigate(
                                          `/admin/company?id=${item.guid}`,
                                          {
                                            replace: false,
                                          }
                                        )
                                      }
                                      mt="8px">
                                      Carrier Profile
                                    </Button>
                                  )}
                                </VStack>
                              </Box>
                            )
                          )}

                          {addressMatchesBodyData?.mailing_address?.map(
                            (item, index) => (
                              <Box
                                position="relative"
                                key={`matched-mailing-${index}`}
                                border="1px solid #EF6820"
                                borderRadius="12px"
                                p="16px"
                                bg="white">
                                <VStack align="start" spacing="8px">
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    textTransform="capitalize">
                                    Mailing Address{" "}
                                    <Text
                                      as="span"
                                      fontWeight="700"
                                      color="#000">
                                      Matched
                                    </Text>
                                  </Text>
                                  {item?.legal_name && (
                                    <Box>
                                      <Text
                                        fontSize="12px"
                                        fontWeight="600"
                                        color="#6B7280"
                                        mb="4px">
                                        Matched Company:
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        color="#181D27">
                                        {item.legal_name}
                                      </Text>
                                    </Box>
                                  )}
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Mailing Address:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {item?.mailing_address || "Not available"}
                                    </Text>
                                  </Box>
                                  {item?.guid && (
                                    <Button
                                      position="absolute"
                                      top="16px"
                                      right="16px"
                                      size="sm"
                                      bg="#EF6820"
                                      color="white"
                                      _hover={{bg: "#DC5A1A"}}
                                      onClick={() =>
                                        navigate(
                                          `/admin/company?id=${item.guid}`,
                                          {
                                            replace: false,
                                          }
                                        )
                                      }
                                      mt="8px">
                                      Carrier Profile
                                    </Button>
                                  )}
                                </VStack>
                              </Box>
                            )
                          )}

                          {company_officer_1?.map((item, index) => (
                            <Box
                              position="relative"
                              key={`matched-officer-1-${index}`}
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              bg="white">
                              <VStack align="start" spacing="8px">
                                <Text
                                  fontSize="12px"
                                  fontWeight="600"
                                  color="#6B7280"
                                  textTransform="capitalize">
                                  Company Officer 1{" "}
                                  <Text as="span" fontWeight="700" color="#000">
                                    Matched
                                  </Text>
                                </Text>
                                {item?.legal_name && (
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Matched Company:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="600"
                                      color="#181D27">
                                      {item.legal_name}
                                    </Text>
                                  </Box>
                                )}
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    Officer Name:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="#181D27"
                                    lineHeight="1.6">
                                    {item?.name ||
                                      item?.officer_name ||
                                      item?.contact ||
                                      "Not available"}
                                  </Text>
                                </Box>
                                {item?.guid && (
                                  <Button
                                    position="absolute"
                                    top="16px"
                                    right="16px"
                                    size="sm"
                                    bg="#EF6820"
                                    color="white"
                                    _hover={{bg: "#DC5A1A"}}
                                    onClick={() =>
                                      navigate(
                                        `/admin/company?id=${item.guid}`,
                                        {
                                          replace: false,
                                        }
                                      )
                                    }
                                    mt="8px">
                                    Carrier Profile
                                  </Button>
                                )}
                              </VStack>
                            </Box>
                          ))}

                          {company_officer_2?.map((item, index) => (
                            <Box
                              position="relative"
                              key={`matched-officer-2-${index}`}
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              bg="white">
                              <VStack align="start" spacing="8px">
                                <Text
                                  fontSize="12px"
                                  fontWeight="600"
                                  color="#6B7280"
                                  textTransform="capitalize">
                                  Company Officer 2{" "}
                                  <Text as="span" fontWeight="700" color="#000">
                                    Matched
                                  </Text>
                                </Text>
                                {item?.legal_name && (
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Matched Company:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="600"
                                      color="#181D27">
                                      {item.legal_name}
                                    </Text>
                                  </Box>
                                )}
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    Officer Name:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="#181D27"
                                    lineHeight="1.6">
                                    {item?.name ||
                                      item?.officer_name ||
                                      item?.contact ||
                                      "Not available"}
                                  </Text>
                                </Box>
                                {item?.guid && (
                                  <Button
                                    position="absolute"
                                    top="16px"
                                    right="16px"
                                    size="sm"
                                    bg="#EF6820"
                                    color="white"
                                    _hover={{bg: "#DC5A1A"}}
                                    onClick={() =>
                                      navigate(
                                        `/admin/company?id=${item.guid}`,
                                        {
                                          replace: false,
                                        }
                                      )
                                    }
                                    mt="8px">
                                    Carrier Profile
                                  </Button>
                                )}
                              </VStack>
                            </Box>
                          ))}

                          {email?.map((item, index) => (
                            <Box
                              position="relative"
                              key={`matched-email-${index}`}
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              bg="white">
                              <VStack align="start" spacing="8px">
                                <Text
                                  fontSize="12px"
                                  fontWeight="600"
                                  color="#6B7280"
                                  textTransform="capitalize">
                                  Email{" "}
                                  <Text as="span" fontWeight="700" color="#000">
                                    Matched
                                  </Text>
                                </Text>
                                {item?.legal_name && (
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Matched Company:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="600"
                                      color="#181D27">
                                      {item.legal_name}
                                    </Text>
                                  </Box>
                                )}
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    Email:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="#181D27"
                                    lineHeight="1.6">
                                    {item?.email ||
                                      item?.contact ||
                                      "Not available"}
                                  </Text>
                                </Box>
                                {item?.guid && (
                                  <Button
                                    position="absolute"
                                    top="16px"
                                    right="16px"
                                    size="sm"
                                    bg="#EF6820"
                                    color="white"
                                    _hover={{bg: "#DC5A1A"}}
                                    onClick={() =>
                                      navigate(
                                        `/admin/company?id=${item.guid}`,
                                        {
                                          replace: false,
                                        }
                                      )
                                    }
                                    mt="8px">
                                    Carrier Profile
                                  </Button>
                                )}
                              </VStack>
                            </Box>
                          ))}

                          {phone?.map((item, index) => (
                            <Box
                              position="relative"
                              key={`matched-phone-${index}`}
                              border="1px solid #EF6820"
                              borderRadius="12px"
                              p="16px"
                              bg="white">
                              <VStack align="start" spacing="8px">
                                <Text
                                  fontSize="12px"
                                  fontWeight="600"
                                  color="#6B7280"
                                  textTransform="capitalize">
                                  Phone{" "}
                                  <Text as="span" fontWeight="700" color="#000">
                                    Matched
                                  </Text>
                                </Text>
                                {item?.legal_name && (
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Matched Company:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="600"
                                      color="#181D27">
                                      {item.legal_name}
                                    </Text>
                                  </Box>
                                )}
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    Phone:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="#181D27"
                                    lineHeight="1.6">
                                    {item?.phone ||
                                      item?.contact ||
                                      "Not available"}
                                  </Text>
                                </Box>
                                {item?.guid && (
                                  <Button
                                    position="absolute"
                                    top="16px"
                                    right="16px"
                                    size="sm"
                                    bg="#EF6820"
                                    color="white"
                                    _hover={{bg: "#DC5A1A"}}
                                    onClick={() =>
                                      navigate(
                                        `/admin/company?id=${item.guid}`,
                                        {
                                          replace: false,
                                        }
                                      )
                                    }
                                    mt="8px">
                                    Carrier Profile
                                  </Button>
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </VStack>
                      </TabPanel>
                    )}

                    {locationCount > 0 && (
                      <TabPanel>
                        <VStack spacing="12px" align="stretch" mt="20px">
                          {virtualAddressData?.map((item, index) => (
                            <Box
                              key={`virtual-${item.id || index}`}
                              border="1px solid #F38744"
                              borderRadius="12px"
                              p="16px"
                              bg="white">
                              <VStack align="start" spacing="8px">
                                <Text
                                  fontSize="12px"
                                  fontWeight="600"
                                  color="#6B7280"
                                  textTransform="capitalize">
                                  {item?.address_type === "physical_address"
                                    ? "Physical Address"
                                    : item?.address_type === "mailing_address"
                                    ? "Mailing Address"
                                    : "Address"}{" "}
                                  <Text as="span" fontWeight="700" color="#000">
                                    Virtual
                                  </Text>
                                </Text>
                                <Box>
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    mb="4px">
                                    Address:
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="#181D27"
                                    lineHeight="1.6">
                                    {item?.virtual_address ||
                                      item?.address ||
                                      "Not available"}
                                  </Text>
                                </Box>
                              </VStack>
                            </Box>
                          ))}

                          {changedFields
                            ?.filter(
                              (field) =>
                                field.key === "physical_address" &&
                                field.oldValue &&
                                field.oldValue !== "" &&
                                field.newValue &&
                                field.oldValue !== field.newValue
                            )
                            .map((field, index) => (
                              <Box
                                key={`changed-physical-${index}`}
                                border="1px solid #F59E0B"
                                borderRadius="12px"
                                p="16px"
                                bg="white">
                                <VStack align="start" spacing="8px">
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    textTransform="capitalize">
                                    Physical Address{" "}
                                    <Text
                                      as="span"
                                      fontWeight="700"
                                      color="#000">
                                      Changed
                                    </Text>
                                  </Text>
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Previous Physical Address:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {field.oldValue || "Not available"}
                                    </Text>
                                  </Box>
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Current Physical Address:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {field.newValue || "Not available"}
                                    </Text>
                                  </Box>
                                  {field.addedTime && (
                                    <Box>
                                      <Text
                                        fontSize="12px"
                                        fontWeight="600"
                                        color="#6B7280"
                                        mb="4px">
                                        Changed Time:
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="400"
                                        color="#181D27"
                                        lineHeight="1.6">
                                        {(() => {
                                          try {
                                            const date =
                                              typeof field.addedTime ===
                                              "string"
                                                ? parseISO(field.addedTime)
                                                : new Date(field.addedTime);
                                            if (isValid(date)) {
                                              return format(
                                                date,
                                                "MMM dd, yyyy"
                                              );
                                            }
                                            return field.addedTime;
                                          } catch {
                                            return field.addedTime;
                                          }
                                        })()}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>
                              </Box>
                            ))}

                          {changedFields
                            ?.filter(
                              (field) =>
                                field.key === "mailing_address" &&
                                field.oldValue &&
                                field.oldValue !== "" &&
                                field.newValue &&
                                field.oldValue !== field.newValue
                            )
                            .map((field, index) => (
                              <Box
                                key={`changed-mailing-${index}`}
                                border="1px solid #F59E0B"
                                borderRadius="12px"
                                p="16px"
                                bg="white">
                                <VStack align="start" spacing="8px">
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    textTransform="capitalize">
                                    Mailing Address{" "}
                                    <Text
                                      as="span"
                                      fontWeight="700"
                                      color="#000">
                                      Changed
                                    </Text>
                                  </Text>
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Previous Mailing Address:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {field.oldValue || "Not available"}
                                    </Text>
                                  </Box>
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Current Mailing Address:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {field.newValue || "Not available"}
                                    </Text>
                                  </Box>
                                  {field.addedTime && (
                                    <Box>
                                      <Text
                                        fontSize="12px"
                                        fontWeight="600"
                                        color="#6B7280"
                                        mb="4px">
                                        Changed Time:
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="400"
                                        color="#181D27"
                                        lineHeight="1.6">
                                        {(() => {
                                          try {
                                            const date =
                                              typeof field.addedTime ===
                                              "string"
                                                ? parseISO(field.addedTime)
                                                : new Date(field.addedTime);
                                            if (isValid(date)) {
                                              return format(
                                                date,
                                                "MMM dd, yyyy"
                                              );
                                            }
                                            return field.addedTime;
                                          } catch {
                                            return field.addedTime;
                                          }
                                        })()}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>
                              </Box>
                            ))}
                        </VStack>
                      </TabPanel>
                    )}

                    {changedFieldsCount > 0 && (
                      <TabPanel>
                        <VStack spacing="12px" align="stretch" mt="20px">
                          {changedFields
                            ?.filter(
                              (field) =>
                                field.oldValue &&
                                field.oldValue !== "" &&
                                field.newValue &&
                                field.oldValue !== field.newValue &&
                                (field.key === "email" ||
                                  field.key === "phone" ||
                                  field.key === "physical_address" ||
                                  field.key === "mailing_address")
                            )
                            .map((field, index) => (
                              <Box
                                key={`changed-${field.key}-${index}`}
                                border="1px solid #F59E0B"
                                borderRadius="12px"
                                p="16px"
                                bg="white">
                                <VStack align="start" spacing="8px">
                                  <Text
                                    fontSize="12px"
                                    fontWeight="600"
                                    color="#6B7280"
                                    textTransform="capitalize">
                                    {field.label}{" "}
                                    <Text
                                      as="span"
                                      fontWeight="700"
                                      color="#000">
                                      Changed
                                    </Text>
                                  </Text>
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Previous {field.label}:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {field.oldValue || "Not available"}
                                    </Text>
                                  </Box>
                                  <Box>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="600"
                                      color="#6B7280"
                                      mb="4px">
                                      Current {field.label}:
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#181D27"
                                      lineHeight="1.6">
                                      {field.newValue || "Not available"}
                                    </Text>
                                  </Box>
                                  {field.addedTime && (
                                    <Box>
                                      <Text
                                        fontSize="12px"
                                        fontWeight="600"
                                        color="#6B7280"
                                        mb="4px">
                                        Changed Time:
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="400"
                                        color="#181D27"
                                        lineHeight="1.6">
                                        {(() => {
                                          try {
                                            const date =
                                              typeof field.addedTime ===
                                              "string"
                                                ? parseISO(field.addedTime)
                                                : new Date(field.addedTime);
                                            if (isValid(date)) {
                                              return format(
                                                date,
                                                "MMM dd, yyyy"
                                              );
                                            }
                                            return field.addedTime;
                                          } catch {
                                            return field.addedTime;
                                          }
                                        })()}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>
                              </Box>
                            ))}
                        </VStack>
                      </TabPanel>
                    )}
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
