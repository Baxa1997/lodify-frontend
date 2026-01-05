import React from "react";
import {Box, Text, Flex, Progress} from "@chakra-ui/react";

const NationalCard = ({title, value}) => {
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
      <Flex>
        <Text fontSize="20px" fontWeight="600" color="#6B7280">
          {value}
        </Text>
      </Flex>
    </Box>
  );
};

export default NationalCard;
