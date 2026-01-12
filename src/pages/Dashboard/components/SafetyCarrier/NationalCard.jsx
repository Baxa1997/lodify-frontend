import React from "react";
import {Box, Text, Flex} from "@chakra-ui/react";

const NationalCard = ({title, value, secondValue}) => {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p="10px"
      position="relative"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)">
      <Flex gap="12px">
        <Text
          maxW="170px"
          fontSize="16px"
          fontWeight="600"
          color="#181D27"
          mb="12px"
          lineHeight="1.4">
          {title}
        </Text>
      </Flex>
      <Flex flexDirection="column" gap="4px">
        <Flex gap="6px">
          <Text fontSize="16px" fontWeight="600" color="#000">
            Out of Service:
          </Text>
          <Text fontSize="16px" fontWeight="500" color="#6B7280">
            {value}
          </Text>
        </Flex>

        <Flex gap="6px">
          <Text fontSize="16px" fontWeight="600" color="#000">
            National Average:
          </Text>
          <Text fontSize="16px" fontWeight="500" color="#6B7280">
            {secondValue}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NationalCard;
