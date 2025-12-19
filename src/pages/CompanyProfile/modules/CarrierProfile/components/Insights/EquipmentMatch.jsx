import React from "react";
import {
  Flex,
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";

export const EquipmentMatch = ({item, associatedCarrierData}) => {
  return (
    <Box
      key={item?.id}
      bg="white"
      border="1px solid #EF6820"
      borderRadius="8px"
      p="20px">
      <Flex justify="space-between" align="flex-start" mb="16px">
        <VStack align="flex-start" spacing="8px" flex="1">
          <Text
            fontSize="12px"
            fontWeight="600"
            color="#6B7280"
            textTransform="uppercase"
            letterSpacing="0.5px">
            Associated Carrier
          </Text>
          <HStack spacing="8px">
            <Text fontSize="16px" fontWeight="600" color="#EF6820">
              {item?.legal_name}
            </Text>
            <Badge
              bg="#DEFFEE"
              color="#16B364"
              px="8px"
              py="2px"
              borderRadius="4px"
              fontSize="11px"
              fontWeight="600">
              {associatedCarrierData?.status}
            </Badge>
          </HStack>
        </VStack>
        {item?.type?.[0] === "Tractor" ? (
          <Box
            as="img"
            src="/img/equipmentTruck.svg"
            alt="truck"
            w="50px"
            h="50px"
            color="#EF6820"
          />
        ) : (
          <Box
            as="img"
            src="/img/equipmentTrailer.svg"
            alt="trailer"
            w="50px"
            h="50px"
            color="#EF6820"
          />
        )}
      </Flex>
      <Box borderTop="1px solid #E5E7EB" pt="16px">
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#6B7280"
                fontWeight="500"
                border="none"
                width="40%">
                Make:
              </Td>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#181D27"
                fontWeight="400"
                border="none">
                {item?.make || "-"}
              </Td>
            </Tr>
            <Tr>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#6B7280"
                fontWeight="500"
                border="none">
                Model:
              </Td>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#181D27"
                fontWeight="400"
                border="none">
                {item?.vehicle_number || "-"}
              </Td>
            </Tr>
            <Tr>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#6B7280"
                fontWeight="500"
                border="none">
                Year:
              </Td>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#181D27"
                fontWeight="400"
                border="none">
                {item?.year ? item?.year : "-"}
              </Td>
            </Tr>

            <Tr>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#6B7280"
                fontWeight="500"
                border="none">
                Plate #:
              </Td>
              <Td
                px="0"
                py="6px"
                fontSize="13px"
                color="#181D27"
                fontWeight="400"
                border="none">
                {item?.licence_plate || "-"}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
