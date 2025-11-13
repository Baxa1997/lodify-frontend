import React from "react";
import {Box, Text, Grid} from "@chakra-ui/react";
import InsuranceCard from "./components/InsuranceCard";

const Insurance = () => {
  const insurancePolicies = [
    {
      id: 1,
      title: "General Liability",
      status: "active",
      insuranceName: "The Burlington Insurance Company",
      policyNumber: "277B513423",
      effectiveDate: "2025-04-01",
      expirationDate: "2026-04-01",
      cancellationDate: "2025-10-01",
      eachOccurrence: 1000000,
      generalAggregate: 2000000,
      limit: null,
    },
    {
      id: 2,
      title: "Auto",
      status: "expiringSoon",
      insuranceName: "National Specialty Insurance Company",
      policyNumber: "CAR3400000403",
      effectiveDate: "2025-04-01",
      expirationDate: "2026-04-01",
      cancellationDate: null,
      eachOccurrence: null,
      generalAggregate: null,
      limit: 1000000,
    },
    {
      id: 3,
      title: "Cargo",
      status: "pendingCancellation",
      insuranceName: "Rli Insurance Company",
      policyNumber: "277B513423",
      effectiveDate: "2025-04-01",
      expirationDate: "2026-04-01",
      cancellationDate: null,
      eachOccurrence: null,
      generalAggregate: null,
      limit: 1000000,
    },
    {
      id: 4,
      title: "Trailer Interchange",
      status: "expired",
      insuranceName: "National Speciality Insurance Company",
      policyNumber: "277B513423",
      effectiveDate: "2025-04-01",
      expirationDate: "2026-04-01",
      cancellationDate: null,
      eachOccurrence: null,
      generalAggregate: null,
      limit: 1000000,
    },
  ];

  const handleEdit = (policy) => {
    console.log("Edit insurance:", policy);
  };

  const handleViewCertificate = (policy) => {
    console.log("View certificate:", policy);
  };

  return (
    <Box
      p="20px"
      pb="0"
      mb="80px"
      border="2px solid #D5D7DA"
      outline="6px solid #f3f4f5"
      borderRadius="12px">
      <Box maxW="100%" mx="auto">
        <Text fontSize="24px" fontWeight="600" color="#181D27" mb="8px">
          Insurance
        </Text>
        <Text fontSize="16px" color="#6B7280" mb="32px">
          Please confirm all your policies below.
        </Text>

        <Grid
          templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}}
          gap="24px"
          mb="32px"
          overflowY="auto">
          {insurancePolicies.map((policy) => (
            <InsuranceCard
              key={policy.id}
              title={policy.title}
              status={policy.status}
              insuranceName={policy.insuranceName}
              policyNumber={policy.policyNumber}
              effectiveDate={policy.effectiveDate}
              expirationDate={policy.expirationDate}
              cancellationDate={policy.cancellationDate}
              eachOccurrence={policy.eachOccurrence}
              generalAggregate={policy.generalAggregate}
              limit={policy.limit}
              onEdit={() => handleEdit(policy)}
              onViewCertificate={() => handleViewCertificate(policy)}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Insurance;
