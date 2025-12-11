import React, {useState} from "react";
import {Box, Text, Badge, Link, HStack, Flex} from "@chakra-ui/react";
import ComplianceDetailModal from "./ComplianceDetailModal";
import {useInsuranceProps} from "./useInsuranceProps";

const InsuranceCard = ({
  title,
  status = "active",
  insuranceName,
  policyNumber,
  effectiveDate,
  expirationDate,
  cancellationDate,
  eachOccurrence,
  generalAggregate,
  limit,
  onEdit,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {statusConfig, formatDate, formatCurrency} = useInsuranceProps();
  const currentStatus = statusConfig[status] || statusConfig.active;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const insuranceData = {
    title,
    status,
    insuranceName,
    policyNumber,
    effectiveDate,
    expirationDate,
    cancellationDate,
    eachOccurrence,
    generalAggregate,
    limit,
    ...restProps,
  };

  return (
    <Box
      pt="24px"
      border="1px solid rgb(190, 190, 191)"
      borderRadius="12px"
      bg="white"
      h="100%"
      display="flex"
      flexDirection="column">
      <Box
        px="20px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="24px">
        <Text fontSize="16px" fontWeight="600" color="#181D27">
          {title}
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
      </Box>

      <Box
        mb="10px"
        px="20px"
        display="flex"
        flexDirection="column"
        gap="20px"
        justifyContent="space-between">
        <Flex flexDirection="column" gap="20px">
          <Box>
            <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
              Insurance name
            </Text>
            <Text fontSize="16px" fontWeight="500" color="#181D27">
              {insuranceName || "N/A"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
              Policy number
            </Text>
            <Text fontSize="16px" fontWeight="500" color="#181D27">
              {policyNumber || "N/A"}
            </Text>
          </Box>
          <Box display="flex" gap="24px">
            <Box flex="1">
              <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
                Effective date
              </Text>
              <Text fontSize="16px" fontWeight="500" color="#181D27">
                {formatDate(effectiveDate)}
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
                Expiration date
              </Text>
              <Text fontSize="16px" fontWeight="500" color="#181D27">
                {formatDate(expirationDate)}
              </Text>
            </Box>
          </Box>
          {cancellationDate && (
            <Box>
              <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
                Cancellation date
              </Text>
              <Text fontSize="16px" fontWeight="500" color="#181D27">
                {formatDate(cancellationDate)}
              </Text>
            </Box>
          )}
          {eachOccurrence && generalAggregate ? (
            <Box display="flex" flexDirection="column" gap="12px">
              <Box>
                <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
                  Each Occurrence
                </Text>
                <Text fontSize="16px" fontWeight="500" color="#181D27">
                  {formatCurrency(eachOccurrence)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
                  General Aggregate
                </Text>
                <Text fontSize="16px" fontWeight="500" color="#181D27">
                  {formatCurrency(generalAggregate)}
                </Text>
              </Box>
            </Box>
          ) : (
            limit && (
              <Box>
                <Text fontSize="14px" fontWeight="400" color="#6B7280" mb="4px">
                  Limit
                </Text>
                <Text fontSize="16px" fontWeight="500" color="#181D27">
                  {formatCurrency(limit)}
                </Text>
              </Box>
            )
          )}
        </Flex>
      </Box>

      <HStack
        borderTop="1px solid #E2E8F0"
        px="20px"
        py="16px"
        spacing="16px"
        display="flex"
        justifyContent="space-between"
        mt="auto">
        <Link
          fontSize="14px"
          fontWeight="600"
          color="#535862"
          _hover={{color: "#535862", textDecoration: "none"}}
          onClick={onEdit}
          cursor="pointer">
          Edit Insurance
        </Link>
        <Link
          onClick={handleOpen}
          fontSize="14px"
          fontWeight="600"
          color="#175CD3"
          _hover={{color: "#175CD3", textDecoration: "none"}}
          cursor="pointer">
          View Certificate
        </Link>
      </HStack>

      <ComplianceDetailModal
        isOpen={isOpen}
        onClose={handleClose}
        insuranceData={insuranceData}
      />
    </Box>
  );
};

export default InsuranceCard;
