import React, {useMemo} from "react";
import {Box, Text, Flex, VStack, HStack, Badge} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import {format} from "date-fns";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import carrierService from "@services/carrierService";
import {AssosiationReport} from "./AssosiationReport";

const ContractStep = ({control, subView = 1}) => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const {data: virtualAddressData} = useQuery({
    queryKey: ["VIRTUAL_ADDRESS_DATA", companies_id],
    queryFn: () =>
      carrierService.getVirtualAddress({
        data: {
          method: "virtual",
          object_data: {
            companies_id: companies_id,
          },
          table: "addresses",
        },
      }),
    select: (res) => res?.data?.virtual_addresses ?? [],
    enabled: Boolean(companies_id),
  });

  const {data: equipmentData} = useQuery({
    queryKey: ["EQUIPMENT_DATA", companies_id],
    queryFn: () =>
      carrierService.getEquipmentData({
        data: {
          method: "vin",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data?.response ?? [],
    enabled: Boolean(companies_id),
  });

  const {data: carrierAuditData} = useQuery({
    queryKey: ["AUDIT_DATA", companies_id],
    queryFn: () =>
      carrierService.getCarrierAudit({
        companies_id: companies_id,
      }),
    select: (res) => res?.data?.response?.[0] ?? {},
    enabled: Boolean(companies_id),
  });

  const {data: vinMatchesData} = useQuery({
    queryKey: ["VIN_MATCHES_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "vin",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(companies_id),
  });

  const {data: addressMatchesBodyData} = useQuery({
    queryKey: ["ADDRESS_MATCHES_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "addresses",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  const {data: carrierInfoData} = useQuery({
    queryKey: ["CARRIER_INFO_DATA", companies_id],
    queryFn: () => carrierService.getCarrierSetupData(companies_id),
    enabled: Boolean(companies_id),
    select: (res) => res.data?.response || {},
  });

  const associationInsights = useMemo(() => {
    return [
      {
        title: "Reused Equipment Scheduled Auto",
        date: "Observed March, 2024",
        filtered: equipmentData?.length > 0 ? false : true,
      },
      {
        title: "Flagged Factor",
        date: "Observed May, 2023",
        filtered: true,
      },
    ];
  }, [equipmentData]);

  const locationInsights = useMemo(() => {
    return virtualAddressData?.length > 0
      ? virtualAddressData.map((item) => ({
          title: "Virtual Office Address",
          date: format(new Date(), "MMM dd, yyyy"),
        }))
      : [];
  }, [virtualAddressData]);

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
      }));
  }, [carrierAuditData]);
  if (subView === 2) {
    return (
      <Box className={styles.stepContentContract}>
        <Text fontSize="20px" fontWeight="bold" color="#1e293b" mb="8px">
          Failed Assesment
        </Text>
        <Text fontSize="14px" color="#414651" mb="18px">
          We cannot connect EAGLE EYE TRUCKING LLC to R & R Express, Inc. due to
          unmet requirements.
        </Text>

        <Box
          border="1px solid #E2E8F0"
          borderRadius="8px"
          p="12px"
          bg="white"
          mb="24px">
          <Flex alignItems="flex-start" gap="12px">
            <img src="/img/inspectionsIcon.svg" alt="" />
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="4px">
                Important
              </Text>
              <Text fontSize="14px" color="#414651">
                EAGLE EYE TRUCKING LLC does not meet 3 of R & R Express,
                Inc.&apos;s requirements.
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* <Box p="12px" border="1px solid #E2E8F0" borderRadius="8px" bg="white">
          <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="6px">
            Temperature Controlled
          </Text>

          <Text fontSize="14px" fontWeight="500" color="#414651">
            Failed Rules
          </Text>
          <Text fontSize="12px" color="#414651">
            These rules are enforced automatically and cannot be modified by
            Lodify
          </Text>
          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Carrier has refrigeration breakdown coverage
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>

          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Certain data properties require broker approval
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>
        </Box>

        <Box
          mt="20px"
          p="12px"
          border="1px solid #E2E8F0"
          borderRadius="8px"
          bg="white">
          <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="6px">
            Interstate
          </Text>

          <Text fontSize="14px" fontWeight="500" color="#414651">
            Failed Rules
          </Text>
          <Text fontSize="12px" color="#414651">
            These rules are enforced automatically and cannot be modified by
            Lodify
          </Text>
          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Carrier has refrigeration breakdown coverage
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>
        </Box> */}

        {/* <Box
          mt="20px"
          p="12px"
          border="1px solid #E2E8F0"
          borderRadius="8px"
          bg="white">
          <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="6px">
            Interstate - California
          </Text>

          <Text fontSize="14px" fontWeight="500" color="#414651">
            Failed Rules
          </Text>
          <Text fontSize="12px" color="#414651">
            These rules are enforced automatically and cannot be modified by
            Lodify
          </Text>
          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Carrier has refrigeration breakdown coverage
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>
        </Box> */}

        <VStack spacing="24px" align="stretch">
          <Box>
            <VStack
              display="flex"
              flexDir="row"
              flexWrap="wrap"
              gap="8px"
              align="stretch">
              {carrierInfoData?.broker_stat === "A" && (
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
              {vinMatchesData?.length > 0 && (
                <AssosiationReport
                  label="VIN Match"
                  insight={{date: "Observed March, 2024"}}
                />
              )}
              {equipmentData?.length > 0 && (
                <AssosiationReport
                  label="Reused Equipment Scheduled Auto"
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

          {locationInsights?.length > 0 && (
            <Box>
              <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
                Location Insights
              </Text>
              <VStack spacing="8px" align="stretch">
                {locationInsights.map((insight, index) => (
                  <Flex
                    key={index}
                    w="100%"
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
          )}
        </VStack>
      </Box>
    );
  }

  return (
    <Box className={styles.stepContentContract}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Contract
      </Text>
      <Text fontSize="16px" color="#414651" mb="24px">
        Review your tax identification number and federal tax classification for
        your W-9
      </Text>

      <Box>
        <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="16px">
          W9 Information
        </Text>

        <Box display="flex" flexDirection="column" gap="16px">
          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              TIN
            </Text>
            <HFTextField
              placeholder="Enter TIN"
              borderColor="#d5d7da"
              control={control}
              name="tin"
            />
          </Box>

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Federal Tax Classification
            </Text>
            <HFTextField
              placeholder="Enter Federal Tax Classification"
              borderColor="#d5d7da"
              control={control}
              name="federal_tax_classification"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContractStep;
