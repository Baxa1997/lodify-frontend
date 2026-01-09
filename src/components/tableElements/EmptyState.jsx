import React from "react";
import {Box, Text, VStack, Icon} from "@chakra-ui/react";
import {FiInbox} from "react-icons/fi";

export const EmptyState = ({
  icon = FiInbox,
  title = "No data found",
  description = "There are no items to display at the moment.",
  minHeight = "400px",
}) => {
  return (
    <Box
      bg="#fff"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH={minHeight}
      w="100%"
      py={12}>
      <VStack spacing={4} align="center" maxW="500px" w="100%">
        <Box
          bg="#F9FAFB"
          borderRadius="full"
          p={6}
          border="2px solid"
          borderColor="#E5E7EB"
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Icon as={icon} boxSize={12} color="#9CA3AF" />
        </Box>
        <VStack spacing={2} align="center" w="100%">
          <Text
            fontSize="18px"
            fontWeight="600"
            color="#181D27"
            textAlign="center"
            w="100%">
            {title}
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="#6B7280"
            textAlign="center"
            w="100%"
            px={4}>
            {description}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};
