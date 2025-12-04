import {Box, Text, Badge, Link, Flex, VStack, HStack} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {useActiveAndPendingInsuranceProps} from "./useActiveAndPendingInsuranceProps";
import {format, isValid, parseISO, isAfter, isBefore} from "date-fns";

export const ActiveAndPendingInsurance = () => {
  const {pendingInsuranceData, rejectedInsuranceData, onAccordionChange} =
    useActiveAndPendingInsuranceProps();

  // Combine all insurance data
  const allInsuranceData = [
    ...(pendingInsuranceData || []),
    ...(rejectedInsuranceData || []),
  ];

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const parsedDate =
        typeof date === "string" ? parseISO(date) : new Date(date);
      if (isValid(parsedDate)) {
        return format(parsedDate, "MM/dd/yyyy");
      }
      return date;
    } catch {
      return date;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getStatus = (item) => {
    const now = new Date();
    // Try different possible field names for expiration date
    const expirationDateStr =
      item?.expiration_date ||
      item?.exp_date ||
      item?.expirationDate ||
      item?.expiration;
    const expirationDate = expirationDateStr
      ? parseISO(expirationDateStr)
      : null;
    const cancelDate = item?.cancl_effective_date
      ? parseISO(item.cancl_effective_date)
      : null;

    // Check if expired
    if (
      expirationDate &&
      isValid(expirationDate) &&
      isBefore(expirationDate, now)
    ) {
      return "expired";
    }

    // Check if pending cancellation
    if (cancelDate && isValid(cancelDate) && isAfter(cancelDate, now)) {
      return "pendingCancellation";
    }

    // Check if expiring soon (within 30 days)
    if (expirationDate && isValid(expirationDate)) {
      const daysUntilExpiration = Math.ceil(
        (expirationDate - now) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilExpiration > 0 && daysUntilExpiration <= 30) {
        return "expiringSoon";
      }
    }

    return "active";
  };

  const statusConfig = {
    active: {
      bg: "#17B26A",
      color: "#fff",
      border: "#ABEFC6",
      label: "Active",
    },
    expiringSoon: {
      bg: "#F79009",
      color: "#fff",
      border: "#FEDF89",
      label: "Expiring Soon",
    },
    pendingCancellation: {
      bg: "#F79009",
      color: "#fff",
      border: "#FEDF89",
      label: "Pending Cancelation",
    },
    expired: {
      bg: "#F04438",
      color: "#fff",
      border: "#FECDCA",
      label: "Expired",
    },
  };

  return (
    <Box>
      <InfoAccordionItem onChange={onAccordionChange}>
        <InfoAccordionButton>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            <InfoAccordionTitle>Insurance</InfoAccordionTitle>
          </Box>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
            }}
            gap="20px">
            {allInsuranceData?.map((item) => {
              const status = getStatus(item);
              const currentStatus = statusConfig[status] || statusConfig.active;
              const isGeneralLiability =
                item?.mod_col_1?.toLowerCase().includes("general liability") ||
                item?.mod_col_1?.toLowerCase().includes("liability");

              return (
                <Box
                  key={item?.guid}
                  p="24px"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  bg="white"
                  h="100%"
                  display="flex"
                  flexDirection="column">
                  {/* Header */}
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb="24px">
                    <Text fontSize="16px" fontWeight="600" color="#181D27">
                      {item?.mod_col_1 || "N/A"}
                    </Text>
                    <Badge
                      px="12px"
                      py="4px"
                      borderRadius="16px"
                      fontSize="12px"
                      fontWeight="500"
                      bg={currentStatus.bg}
                      color={currentStatus.color}
                      border={`1px solid ${currentStatus.border}`}>
                      {currentStatus.label}
                    </Badge>
                  </Flex>

                  {/* Content */}
                  <VStack spacing="20px" align="stretch" flex="1">
                    {/* Insurance name */}
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="400"
                        color="#6B7280"
                        mb="4px">
                        Insurance name
                      </Text>
                      <Text fontSize="16px" fontWeight="500" color="#181D27">
                        {item?.name_company || "N/A"}
                      </Text>
                    </Box>

                    {/* Policy number */}
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="400"
                        color="#6B7280"
                        mb="4px">
                        Policy number
                      </Text>
                      <Text fontSize="16px" fontWeight="500" color="#181D27">
                        {item?.policy_no || "N/A"}
                      </Text>
                    </Box>

                    {/* Effective date and Expiration date */}
                    <Flex gap="24px">
                      <Box flex="1">
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          color="#6B7280"
                          mb="4px">
                          Effective date
                        </Text>
                        <Text fontSize="16px" fontWeight="500" color="#181D27">
                          {formatDate(item?.effective_date)}
                        </Text>
                      </Box>
                      <Box flex="1">
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          color="#6B7280"
                          mb="4px">
                          Expiration date
                        </Text>
                        <Text fontSize="16px" fontWeight="500" color="#181D27">
                          {formatDate(
                            item?.expiration_date ||
                              item?.exp_date ||
                              item?.expirationDate ||
                              item?.expiration
                          )}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Cancellation date (for General Liability) */}
                    {isGeneralLiability && item?.cancl_effective_date && (
                      <Box>
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          color="#6B7280"
                          mb="4px">
                          Cancellation date
                        </Text>
                        <Text fontSize="16px" fontWeight="500" color="#181D27">
                          {formatDate(item?.cancl_effective_date)}
                        </Text>
                      </Box>
                    )}

                    {/* Coverage amounts */}
                    {isGeneralLiability ? (
                      <VStack spacing="12px" align="stretch">
                        <Box>
                          <Text
                            fontSize="14px"
                            fontWeight="400"
                            color="#6B7280"
                            mb="4px">
                            Each Occurrence
                          </Text>
                          <Text
                            fontSize="16px"
                            fontWeight="500"
                            color="#181D27">
                            {formatCurrency(
                              item?.underl_lim_amount
                                ? item.underl_lim_amount * 1000
                                : item?.underl_lim_amount
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontSize="14px"
                            fontWeight="400"
                            color="#6B7280"
                            mb="4px">
                            General Aggregate
                          </Text>
                          <Text
                            fontSize="16px"
                            fontWeight="500"
                            color="#181D27">
                            {formatCurrency(
                              item?.max_cov_amount
                                ? item.max_cov_amount * 1000
                                : item?.max_cov_amount
                            )}
                          </Text>
                        </Box>
                      </VStack>
                    ) : (
                      <Box>
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          color="#6B7280"
                          mb="4px">
                          Limit
                        </Text>
                        <Text fontSize="16px" fontWeight="500" color="#181D27">
                          {formatCurrency(
                            item?.max_cov_amount
                              ? item.max_cov_amount * 1000
                              : item?.min_cov_amount
                              ? item.min_cov_amount * 1000
                              : item?.max_cov_amount || item?.min_cov_amount
                          )}
                        </Text>
                      </Box>
                    )}

                    {/* View Certificate link */}
                    <Box mt="auto" pt="8px">
                      <Flex justifyContent="flex-end">
                        <Link
                          fontSize="14px"
                          fontWeight="500"
                          color="#EF6820"
                          _hover={{textDecoration: "underline"}}
                          cursor="pointer"
                          onClick={() => {
                            // Handle view certificate action
                            console.log("View certificate for:", item);
                          }}>
                          View Certificate
                        </Link>
                      </Flex>
                    </Box>
                  </VStack>
                </Box>
              );
            })}
          </Box>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
