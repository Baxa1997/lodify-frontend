import React from "react";
import {Box, Flex, Text, Spinner} from "@chakra-ui/react";
import {AgreementCard} from "./AgreementCard";
import {useAgreementsProps} from "./useAgreementsProps";

export const Agreements = () => {
  const {agreements, isLoading} = useAgreementsProps();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px" pt="32px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="#fff"
          color="#EF6820"
          size="lg"
        />
      </Flex>
    );
  }

  return (
    <Box pt="32px">
      {agreements && agreements.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          gap="24px"
          width="100%">
          {agreements.map((agreement) => (
            <AgreementCard
              key={agreement.guid || agreement.id || agreement.companies_id}
              agreement={agreement}
            />
          ))}
        </Box>
      ) : (
        <Flex
          justify="center"
          align="center"
          minH="400px"
          color="#6B7280"
          fontSize="16px">
          No agreements found
        </Flex>
      )}
    </Box>
  );
};
