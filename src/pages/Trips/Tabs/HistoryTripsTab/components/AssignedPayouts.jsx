import React from "react";
import { Box, Text, VStack, HStack, Button, Link, Flex } from "@chakra-ui/react";

function AssignedPayouts({ tripDetails = {} }) {
  return (
    <Box
      minH="400px"
      w="67%"
      borderRadius="12px"
      overflow="hidden"
      border="1px solid #E9EAEB"
      bg="white"
      shadow="sm">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={4}
        borderBottom="1px solid #E9EAEB">
        <Text
          fontSize="20px"
          fontWeight="600"
          color="gray.800">
          Assigned Payouts
        </Text>

        <HStack spacing={4}>
          <Flex gap="12px">
            <Button
              px="0"
              h="20px"
              fontSize="14px"
              color="blue.600"
              fontWeight="500"
              bg="transparent"
              border="none"
              _hover={{ bg: "transparent" }}>
              View all
            </Button>
            <Button
              p="0"
              minW="20px"
              w="20px"
              h="20px"
              bg="transparent"
              border="none"
              _hover={{ bg: "transparent" }}>
              <img
                src="/img/threeDots.svg"
                alt="" />
            </Button>
          </Flex>
        </HStack>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={4}
        borderBottom="1px solid #E9EAEB">
        <VStack
          align="start"
          spacing={1}>
          <Text
            fontSize="16px"
            fontWeight="700"
            color="gray.800">
            DRIVER PAY {tripDetails?.drivers?.first_name}{" "}
            {tripDetails?.drivers?.last_name}
          </Text>
          <Text
            fontSize="14px"
            color="gray.600">
            1354: STRAIGHT CARGO LLC
          </Text>
        </VStack>

        <HStack spacing={3}>
          <Button
            size="sm"
            bg="#fff"
            color="blue.600"
            border="1px solid"
            borderColor="#84CAFF"
            borderRadius="8px"
            fontSize="14px"
            fontWeight="600"
            p="10px 16px">
            Preview & Dispatch
          </Button>

          <Button
            p="0"
            minW="20px"
            w="20px"
            h="20px"
            bg="transparent"
            border="none"
            _hover={{ bg: "transparent" }}>
            <img
              src="/img/threeDots.svg"
              alt="" />
          </Button>
        </HStack>
      </Box>

      <Box p={4}>
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr"
          gap={6}
          alignItems="start">
          <Box>
            <Text
              fontSize="14px"
              fontWeight="700"
              color="gray.800"
              mb={3}>
              Rate (Quote)
            </Text>
            <VStack
              align="stretch"
              spacing={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={2}>
                <Text
                  fontSize="14px"
                  color="gray.700">
                  Hauling Rate
                </Text>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color="gray.800">
                  {`$${tripDetails?.hauling_rate || "0.00"}`}
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={2}
                px={3}
                bg="gray.50"
                borderRadius="6px">
                <Text
                  fontSize="14px"
                  color="gray.700">
                  Total Quote
                </Text>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color="gray.800">
                  {`$${tripDetails?.total_quote || "0.00"}`}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box>
            <Text
              fontSize="14px"
              fontWeight="700"
              color="gray.800"
              mb={3}>
              Contract
            </Text>
            <VStack
              align="stretch"
              spacing={2}>
              <Box py={2}>
                <Text
                  fontSize="14px"
                  color="gray.700">
                  Owner Operator {tripDetails?.owner_operator || ""}
                </Text>
              </Box>
              <Box py={2}>
                <Text
                  fontSize="14px"
                  color="gray.700">
                  Percentage {tripDetails?.percentage || ""}%
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box>
            <Text
              fontSize="14px"
              fontWeight="700"
              color="gray.800"
              mb={3}>
              Estimated Payout
            </Text>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minH="60px">
              <Text
                fontSize="24px"
                fontWeight="700"
                color="gray.800">
                ${tripDetails?.hauling_rate * 0.35 || "0.00"}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AssignedPayouts;
