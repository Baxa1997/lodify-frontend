import { Box, Text } from "@chakra-ui/react";
import { InfoAccordionItem, InfoAccordionButton, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";
import { DataTable } from "@components/DataTable";
import { useActiveAndPendingInsuranceProps } from "./useActiveAndPendingInsuranceProps";
import { StatusBadge } from "@components/StatusBadge";

export const ActiveAndPendingInsurance = () => {

  const { pendingInsuranceData, rejectedInsuranceData, onAccordionChange } = useActiveAndPendingInsuranceProps();

  return <Box>
    <InfoAccordionItem
      onChange={onAccordionChange}
    >
      <InfoAccordionButton>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <InfoAccordionTitle>
            Insurance
          </InfoAccordionTitle>
        </Box>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap="20px"
        >
          {
            pendingInsuranceData?.map(item => (<InsuranceCard
              key={item?.guid}
              title={item?.mod_col_1}
              companyName={item?.name_company}
              status="active"
              policyNumber={item?.policy_no}
              effectiveDate={item?.effective_date}
              cancelEffectiveDate={item?.cancl_effective_date}
              coverageTo={item?.max_cov_amount}
              coverageFrom={item?.underl_lim_amount}
              postedDate={item?.trans_date}
            />))
          }
          {
            rejectedInsuranceData?.map(item => (<InsuranceCard
              key={item?.guid}
              title={item?.mod_col_1}
              companyName={item?.name_company}
              status="rejected"
              policyNumber={item?.policy_no}
              rejectedDate={item?.rej_date}
              recvDate={item?.recv_date}
              rejectionReasons={item?.rej_reasons}
              coverageTo={item?.min_cov_amount}
              coverageFrom={item?.mod_col_3}
            />))
          }
        </Box>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  </Box>;
};

const InsuranceCard = (
  {
    title,
    status,
    policyNumber,
    effectiveDate,
    cancelEffectiveDate,
    coverageTo,
    coverageFrom,
    postedDate,
    companyName,
    rejectedDate,
    recvDate,
    rejectionReasons,
  },
) => {
  return <Box
    padding="20px"
    border="1px solid"
    borderColor="gray.border-main"
    borderRadius="12px"
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb="24px"
    >
      <Text
        fontSize="16px"
        fontWeight="600"
        color="primary.500"
      >{title}</Text>
      <StatusBadge status={status}>{status || "Active"}</StatusBadge>
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      gap="24px"
    >
      <Box>
        <Text
          color="tertiary.600"
          fontWeight="400"
          fontSize="14px"
          mb="4px"
        >Insurance name</Text>
        <Text
          fontWeight="500"
          fontSize="16px"
          color="primary.500"
        >{companyName}</Text>
      </Box>
      <Box>
        <Text
          color="tertiary.600"
          fontWeight="400"
          fontSize="14px"
          mb="4px"
        >Policy number</Text>
        <Text
          fontWeight="500"
          fontSize="16px"
          color="primary.500"
        >{policyNumber}</Text>
      </Box>
      <Box
        display="flex"
        gap="24px"
      >
        <Box>
          <Text
            color="tertiary.600"
            fontWeight="400"
            fontSize="14px"
            mb="4px"
          >
            {
              status === "rejected" ? "Rejection date" : "Effective date"
            }
          </Text>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="primary.500"
          >{ status === "rejected" ? rejectedDate : effectiveDate}</Text>
        </Box>
        <Box>
          <Text
            color="tertiary.600"
            fontWeight="400"
            fontSize="14px"
            mb="4px"
          >
            {
              status === "rejected" ? "Received date" : "Posted date"
            }
          </Text>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="primary.500"
          >
            {
              status === "rejected" ? recvDate : postedDate
            }
          </Text>
        </Box>
      </Box>
      {
        status !== "rejected" && <Box>
          <Text
            color="tertiary.600"
            fontWeight="400"
            fontSize="14px"
            mb="4px"
          >Cancellation date</Text>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="primary.500"
          >{cancelEffectiveDate}</Text>
        </Box>
      }
      <Box
        display="flex"
        gap="24px"
      >
        <Box>
          <Text
            color="tertiary.600"
            fontWeight="400"
            fontSize="14px"
            mb="4px"
          >Coverage From</Text>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="primary.500"
          >${(coverageFrom || 0) * 1000}</Text>
        </Box>
        <Box>
          <Text
            color="tertiary.600"
            fontWeight="400"
            fontSize="14px"
            mb="4px"
          >Coverage To</Text>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="primary.500"
          >${(coverageTo || 0) * 1000}</Text>
        </Box>
      </Box>
    </Box>
  </Box>;
};
