import React from "react";
import {Box, Text, Badge, Link, HStack} from "@chakra-ui/react";
import {format, isValid, parseISO} from "date-fns";

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
  onViewCertificate,
}) => {
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
      label: "Pending Cancellation",
    },
    expired: {
      bg: "#F04438",
      color: "#fff",
      border: "#FECDCA",
      label: "Expired",
    },
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const parsedDate = typeof date === "string" ? parseISO(date) : date;
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const currentStatus = statusConfig[status] || statusConfig.active;

  return (
    <Box
      p="24px"
      border="1px solid rgb(190, 190, 191)"
      borderRadius="12px"
      bg="white"
      h="100%">
      <Box
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

      <Box display="flex" flexDirection="column" gap="20px">
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

        <HStack spacing="16px" mt="8px">
          <Link
            fontSize="14px"
            fontWeight="500"
            color="#175CD3"
            _hover={{textDecoration: "underline"}}
            onClick={onEdit}
            cursor="pointer">
            Edit Insurance
          </Link>
          <Link
            fontSize="14px"
            fontWeight="500"
            color="#175CD3"
            _hover={{textDecoration: "underline"}}
            onClick={onViewCertificate}
            cursor="pointer">
            View Certificate
          </Link>
        </HStack>
      </Box>
    </Box>
  );
};

export default InsuranceCard;
