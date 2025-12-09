import React from "react";
import {Box, Text, Flex, HStack} from "@chakra-ui/react";
import {InfoIcon} from "@chakra-ui/icons";

export const UnderReviewSection = () => {
  return (
    <Box
      bg="#fff"
      border="1px solid #D5D7DA"
      borderRadius="12px"
      p="16px"
      mb="24px">
      <Flex alignItems="flex-start" gap="12px">
        <Box
          w="40px"
          h="40px"
          borderRadius="6px"
          bg="#fff"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          border="1px solid #E9EAEB"
          mt="2px">
          <InfoIcon color="#92400E" w="20px" h="20px" />
        </Box>
        <Box flex="1">
          <Text fontSize="16px" fontWeight="600" color="#414651" mb="4px">
            Under review
          </Text>
          <Text fontSize="14px" color="#535862" lineHeight="1.5">
            Your safety status is pending review. Amazon evaluates additional
            factors beyond the information displayed on this page when
            determining reinstatement.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
