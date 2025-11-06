import React from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Icon,
  Flex,
} from "@chakra-ui/react";
import {ExternalLinkIcon, StarIcon} from "@chakra-ui/icons";
import {format} from "date-fns";

const CarrierElement = ({carrier, allCarriers = false}) => {
  const {logo, legal_name, company_name, rating, connected_date, email} =
    carrier;
  return (
    <Flex
      flexDirection="column"
      bg="white"
      borderRadius="lg"
      border="1px solid #E2E8F0"
      boxShadow="sm"
      _hover={{boxShadow: "md"}}
      transition="all 0.2s">
      <VStack
        px="20px"
        py={"20px"}
        borderBottom="1px solid #E2E8F0"
        spacing={4}
        align="stretch">
        <HStack justify="space-between" align="flex-start">
          <Box
            w="52px"
            h="52px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #E2E8F0">
            <img src="/img/carrierLogo.svg" alt="" width />
          </Box>

          <Flex h="52px" flexDirection="column" gap="0px">
            {!allCarriers && (
              <Badge
                bg="green.500"
                color="white"
                px="12px"
                py="2px"
                borderRadius="full"
                fontSize="12px"
                fontWeight="500">
                {"Access Enabled"}
              </Badge>
            )}
            <HStack alignItems="center" mt="6px" spacing={"10px"}>
              <Text fontSize="16px" fontWeight="600" color="gray.700">
                {rating ?? "5.0"}
              </Text>
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    w="20px"
                    h="20px"
                    color="gold"
                    fill="currentColor"
                  />
                ))}
              </HStack>
            </HStack>
          </Flex>
        </HStack>

        <Text fontSize="16px" fontWeight="600" color="#181D27">
          {company_name}
        </Text>

        {!allCarriers && (
          <Text fontSize="15px" fontWeight="400" color="#535862">
            Connected {format(new Date(connected_date), "MM/dd/yyyy")}
          </Text>
        )}

        <HStack spacing={2}>
          <Text fontSize="14px" color="#EF6820" fontWeight="500">
            {email}
          </Text>
          <Icon as={ExternalLinkIcon} w="12px" h="12px" color="#EF6820" />
        </HStack>
      </VStack>

      <Flex justify="flex-end" py="16px" px="24px">
        <Button
          variant="ghost"
          color="#EF6820"
          fontSize="16px"
          fontWeight="500"
          p="0"
          h="auto"
          _hover={{bg: "transparent", textDecoration: "underline"}}
          //   onClick={onView}
        >
          View
        </Button>
      </Flex>
    </Flex>
  );
};

export default CarrierElement;
