import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  Flex,
  HStack,
  AccordionIcon,
  Badge,
  VStack,
} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import {MdLocationOff} from "react-icons/md";
import {HiOutlineCheckCircle} from "react-icons/hi";

export const InsightAddress = ({
  item,
  physicalAddress = false,
  mailingAddress = false,
  isAuditChange = false,
  virtualAddress = false,
}) => {
  const isVirtualPhysical =
    virtualAddress && item?.address_type === "physical_address";
  const isVirtualMailing =
    virtualAddress && item?.address_type === "mailing_address";
  const isMatchedAddress = physicalAddress || mailingAddress;

  const isChanged =
    isAuditChange &&
    item?.oldValue &&
    item?.oldValue !== "" &&
    item?.address &&
    item?.oldValue !== item?.address;
  const isMatchedAudit = isAuditChange && !isChanged;
  return (
    <Accordion key={item} allowToggle>
      <AccordionItem
        overflow="hidden"
        border="1px solid #EF6820"
        borderRadius="8px"
        bg="white">
        <AccordionButton
          p="12px"
          _hover={{bg: "#fff"}}
          _expanded={{bg: "#fff"}}
          textAlign="left">
          <Flex
            minW="300px"
            w={"100%"}
            bg="#FAFAFA"
            borderRadius="8px"
            p="12px 16px"
            gap="12px"
            justifyContent="space-between"
            alignItems="center">
            <Box flex="1" textAlign="left">
              <Text
                color="#181D27"
                fontSize="14px"
                fontWeight="500"
                textAlign="left">
                {isChanged
                  ? item?.fieldLabel === "Phone"
                    ? "Carrier's Phone Number Has Changed"
                    : item?.fieldLabel === "Email"
                    ? "Carrier's Email Has Changed"
                    : item?.fieldLabel === "Physical Address"
                    ? "Carrier's Physical Address Has Changed"
                    : item?.fieldLabel === "Mailing Address"
                    ? "Carrier's Mailing Address Has Changed"
                    : `Carrier's ${item?.fieldLabel} Has Changed`
                  : isMatchedAudit
                  ? item?.fieldLabel === "Phone"
                    ? "Carrier's phone number matches another company"
                    : item?.fieldLabel === "Email"
                    ? "Carrier's email matches another company"
                    : item?.fieldLabel === "Physical Address"
                    ? "Carrier's physical address matches another company"
                    : item?.fieldLabel === "Mailing Address"
                    ? "Carrier's mailing address matches another company"
                    : `Carrier's ${item?.fieldLabel?.toLowerCase()} matches another company`
                  : isMatchedAddress
                  ? `Carrier's ${
                      physicalAddress ? "physical" : "mailing"
                    } address matches another company`
                  : isVirtualPhysical
                  ? "Carrier's physical address is a virtual office"
                  : isVirtualMailing
                  ? "Carrier's mailing address is a virtual office"
                  : item.address}
              </Text>
              {!isAuditChange && (
                <Text
                  color="#6B7280"
                  fontSize="13px"
                  fontWeight="400"
                  textAlign="left"
                  mt="4px">
                  {isMatchedAddress
                    ? item?.legal_name
                      ? `Matched company: ${item.legal_name}`
                      : physicalAddress
                      ? item?.physical_address || "Address not available"
                      : item?.mailing_address || "Address not available"
                    : isVirtualPhysical || isVirtualMailing
                    ? item?.virtual_address ||
                      item?.address ||
                      "Address not available"
                    : physicalAddress
                    ? "Physical Address"
                    : mailingAddress
                    ? "Mailing Address"
                    : "Virtual Address"}
                </Text>
              )}
              {isChanged && (
                <Text
                  color="#6B7280"
                  fontSize="13px"
                  fontWeight="400"
                  textAlign="left"
                  mt="4px">
                  {item?.fieldLabel === "Phone"
                    ? `Current Phone: ${item?.address || "Not available"}`
                    : item?.fieldLabel === "Email"
                    ? `Current Email: ${item?.address || "Not available"}`
                    : item?.fieldLabel === "Physical Address"
                    ? `Current Physical Address: ${
                        item?.address || "Not available"
                      }`
                    : item?.fieldLabel === "Mailing Address"
                    ? `Current Mailing Address: ${item?.address || "Not available"}`
                    : `Current ${item?.fieldLabel}: ${
                        item?.address || "Not available"
                      }`}
                </Text>
              )}
              {isMatchedAudit && (
                <Text
                  color="#6B7280"
                  fontSize="13px"
                  fontWeight="400"
                  textAlign="left"
                  mt="4px">
                  {item?.address || "Value not available"}
                </Text>
              )}
            </Box>
            <HStack spacing="8px" flexShrink={0}>
              <Box>
                <AiOutlineExclamationCircle
                  width="20px"
                  height="20px"
                  fontSize="20px"
                  color="#EF6820"
                />
              </Box>
              <AccordionIcon color="#181D27" fontSize="16px" />
            </HStack>
          </Flex>
        </AccordionButton>
        <AccordionPanel>
          {isMatchedAddress && (
            <Box
              pl="10px"
              mb="16px"
              p="12px"
              bg="#EFF6FF"
              borderRadius="8px"
              border="1px solid #3B82F6">
              <Flex align="center" gap="8px" mb="8px">
                <HiOutlineCheckCircle color="#3B82F6" size="20px" />
                <Text fontSize="14px" color="#3B82F6" fontWeight="600">
                  This carrier's {physicalAddress ? "physical" : "mailing"}{" "}
                  address matches another company
                </Text>
              </Flex>
              {item?.legal_name && (
                <VStack align="start" spacing="4px" pl="28px">
                  <Text fontSize="13px" color="#1E40AF" fontWeight="600">
                    Matched Company:
                  </Text>
                  <Text fontSize="13px" color="#1E40AF" fontWeight="500">
                    {item.legal_name}
                  </Text>
                </VStack>
              )}
            </Box>
          )}
          {isMatchedAudit && (
            <Box
              pl="10px"
              mb="16px"
              p="12px"
              bg="#EFF6FF"
              borderRadius="8px"
              border="1px solid #3B82F6">
              <Flex align="center" gap="8px" mb="8px">
                <HiOutlineCheckCircle color="#3B82F6" size="20px" />
                <Text fontSize="14px" color="#3B82F6" fontWeight="600">
                  This carrier's {item?.fieldLabel?.toLowerCase()} matches
                  another company's {item?.fieldLabel?.toLowerCase()}
                </Text>
              </Flex>
            </Box>
          )}
          {isChanged && (
            <Box
              pl="10px"
              mb="16px"
              p="12px"
              bg="#FEF3C7"
              borderRadius="8px"
              border="1px solid #F59E0B">
              <Flex align="center" gap="8px">
                <AiOutlineExclamationCircle color="#F59E0B" size="20px" />
                <Text fontSize="14px" color="#F59E0B" fontWeight="600">
                  This carrier's {item?.fieldLabel?.toLowerCase()} has been
                  changed
                </Text>
              </Flex>
            </Box>
          )}
          {(isVirtualPhysical || isVirtualMailing) && (
            <Box
              pl="10px"
              mb="16px"
              p="12px"
              bg="#FEF6EE"
              borderRadius="8px"
              border="1px solid #F38744">
              <Flex align="center" gap="8px">
                <MdLocationOff color="#F38744" size="20px" />
                <Text fontSize="14px" color="#F38744" fontWeight="600">
                  This carrier's {isVirtualPhysical ? "physical" : "mailing"}{" "}
                  address is a virtual office
                </Text>
              </Flex>
            </Box>
          )}
          {isChanged ? (
            <VStack align="start" spacing="12px" pl="10px">
              <Box>
                <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                  Previous {item?.fieldLabel?.toLowerCase()}:
                </Text>
                <Text fontSize="14px" color="#000" fontWeight="400">
                  {item?.oldValue || "Not available"}
                </Text>
              </Box>
              <Box>
                <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                  Current {item?.fieldLabel?.toLowerCase()}:
                </Text>
                <Text fontSize="14px" color="#000" fontWeight="400">
                  {item?.address || "Not available"}
                </Text>
              </Box>
            </VStack>
          ) : isMatchedAudit ? (
            <Box pl="10px">
              <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                {item?.fieldLabel}:
              </Text>
              <Text fontSize="14px" color="#000" lineHeight="1.6">
                {item?.address || "Not available"}
              </Text>
            </Box>
          ) : (
            <Box pl="10px">
              <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                Address:
              </Text>
              <Text fontSize="14px" color="#000" lineHeight="1.6">
                {physicalAddress
                  ? item?.physical_address || "Not available"
                  : mailingAddress
                  ? item?.mailing_address || "Not available"
                  : item?.virtual_address || item?.address || "Not available"}
              </Text>
            </Box>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

