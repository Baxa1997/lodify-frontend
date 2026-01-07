import React, {useMemo} from "react";
import {Box, Text, Flex, VStack} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import {format} from "date-fns";
import {useSelector} from "react-redux";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import carrierService from "@services/carrierService";
import {InsightAddress} from "./InsightAddress";

const ContractStep = ({control, subView = 1, isEditable = false}) => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const carrierSetup = searchParams.get("carrier_setup");
  const isCarrierSetup = carrierSetup === "true";

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

  const {data: contactMatchesData} = useQuery({
    queryKey: ["GET_CONTACTS_MATCHES", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "contact",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  const {company_officer_1 = [], company_officer_2 = []} =
    contactMatchesData || {};

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

  const brokerCompanyName = useSelector(
    (state) =>
      state.auth.user_data?.company_name ||
      state.auth.user_data?.legal_name ||
      "the broker"
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
        return oldValue !== null && oldValue !== undefined && oldValue !== "";
      })
      .map((field) => ({
        ...field,
        oldValue: carrierAuditData[field.oldKey],
        newValue: carrierAuditData[field.key],
      }));
  }, [carrierAuditData]);

  const totalInsightsCount = useMemo(() => {
    return (
      (virtualAddressData?.length || 0) +
      (addressMatchesBodyData?.physical_address?.length || 0) +
      (addressMatchesBodyData?.mailing_address?.length || 0) +
      (company_officer_1?.length || 0) +
      (company_officer_2?.length || 0) +
      (changedFields?.length || 0)
    );
  }, [
    virtualAddressData,
    addressMatchesBodyData,
    company_officer_1,
    company_officer_2,
    changedFields,
  ]);

  const carrierName =
    carrierInfoData?.legal_name ||
    carrierInfoData?.company_name ||
    "the carrier";

  if (subView === 2) {
    return (
      <Box className={styles.stepContentContract}>
        <Text fontSize="20px" fontWeight="bold" color="#1e293b" mb="8px">
          Failed Assesment
        </Text>
        <Text fontSize="14px" color="#414651" mb="18px">
          {isCarrierSetup
            ? `${carrierName} is setting up its information and needs to address the following requirements.`
            : `We cannot connect ${carrierName} to ${brokerCompanyName} due to unmet requirements.`}
        </Text>

        <Box border="1px solid #E2E8F0" borderRadius="8px" p="12px" bg="white">
          <Flex alignItems="flex-start" gap="12px">
            <img src="/img/inspectionsIcon.svg" alt="" />
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="4px">
                Important
              </Text>
              <Text fontSize="14px" color="#414651">
                {isCarrierSetup
                  ? `${carrierName} does not meet ${totalInsightsCount} requirement${
                      totalInsightsCount !== 1 ? "s" : ""
                    } that need to be addressed.`
                  : `${carrierName} does not meet ${totalInsightsCount} of ${brokerCompanyName}'s requirements.`}
              </Text>
            </Box>
          </Flex>
        </Box>

        <VStack spacing="12px" align="stretch" mt="24px">
          {virtualAddressData?.map((item) => (
            <InsightAddress key={item.id} item={item} virtualAddress={true} />
          ))}

          {addressMatchesBodyData?.physical_address?.map((item) => (
            <InsightAddress key={item.id} item={item} physicalAddress={true} />
          ))}

          {addressMatchesBodyData?.mailing_address?.map((item) => (
            <InsightAddress key={item.id} item={item} mailingAddress={true} />
          ))}

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
            />
          ))}

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
