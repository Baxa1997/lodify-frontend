import React from "react";
import {Box, Flex, Text, Button, HStack} from "@chakra-ui/react";

const BottomNavigation = ({onBack, onNoEdit, onYesContinue}) => {
  return (
    <Box
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      bg="white"
      borderTop="1px solid #E2E8F0"
      px="24px"
      py="20px"
      zIndex="1000"
      boxShadow="0 -2px 8px rgba(0, 0, 0, 0.05)">
      <Flex justifyContent="space-between" alignItems="center" w="100%">
        <Flex
          alignItems="center"
          gap="8px"
          cursor="pointer"
          onClick={onBack}
          _hover={{opacity: 0.8}}>
          <img src="/img/backArrow.svg" alt="back" width="16px" height="16px" />
          <Text fontSize="16px" fontWeight="500" color="#6B7280">
            Back
          </Text>
        </Flex>

        <Text
          fontSize="16px"
          fontWeight="500"
          color="#181D27"
          flex="1"
          textAlign="center">
          Is this information correct?
        </Text>

        <HStack spacing="12px">
          <Button
            variant="outline"
            onClick={onNoEdit}
            borderColor="#E2E8F0"
            bg="white"
            color="#181D27"
            fontWeight="500"
            borderRadius="8px"
            px="24px"
            py="10px"
            _hover={{bg: "#F9FAFB", borderColor: "#D1D5DB"}}>
            No, Edit
          </Button>
          <Button
            bg="#EF6820"
            color="white"
            onClick={onYesContinue}
            fontWeight="500"
            borderRadius="8px"
            px="24px"
            py="10px"
            _hover={{bg: "#CE6C38"}}>
            Yes, continue
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default BottomNavigation;
