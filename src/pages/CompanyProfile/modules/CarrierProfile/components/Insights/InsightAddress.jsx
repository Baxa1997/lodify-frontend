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
  Button,
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
  isOfficer = false,
  onNavigate,
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
  const isMatchedOfficer = isOfficer && !isAuditChange;
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
                    ? "Phone Changed"
                    : item?.fieldLabel === "Email"
                    ? "Email Changed"
                    : item?.fieldLabel === "Physical Address"
                    ? "Physical Address Changed"
                    : item?.fieldLabel === "Mailing Address"
                    ? "Mailing Address Changed"
                    : item?.fieldLabel === "Company Officer 1" ||
                      item?.fieldLabel === "Company Officer 2"
                    ? `${item?.fieldLabel} Changed`
                    : `${item?.fieldLabel} Changed`
                  : isMatchedAudit
                  ? item?.fieldLabel === "Phone"
                    ? "Your phone is matched to a different company's phone"
                    : item?.fieldLabel === "Email"
                    ? "Your email is matched to a different company's email"
                    : item?.fieldLabel === "Physical Address"
                    ? "Your physical address is matched to a different company's address"
                    : item?.fieldLabel === "Mailing Address"
                    ? "Your mailing address is matched to a different company's address"
                    : item?.fieldLabel === "Company Officer 1" ||
                      item?.fieldLabel === "Company Officer 2"
                    ? `Your ${item?.fieldLabel?.toLowerCase()} is matched to a different company's ${item?.fieldLabel?.toLowerCase()}`
                    : `Your ${item?.fieldLabel?.toLowerCase()} is matched to a different company's ${item?.fieldLabel?.toLowerCase()}`
                  : isMatchedOfficer
                  ? `Your ${item?.fieldLabel?.toLowerCase()} is matched to a different company's ${item?.fieldLabel?.toLowerCase()}`
                  : isMatchedAddress
                  ? `Your ${
                      physicalAddress ? "physical" : "mailing"
                    } address is matched to a different company's address`
                  : isVirtualPhysical
                  ? "Your physical address is virtual"
                  : isVirtualMailing
                  ? "Your mailing address is virtual"
                  : item.address}
              </Text>
              {!isAuditChange && (
                <Text
                  color="#6B7280"
                  fontSize="13px"
                  fontWeight="400"
                  textAlign="left"
                  mt="4px">
                  {isMatchedOfficer
                    ? item?.legal_name
                      ? `Matched with: ${item.legal_name}`
                      : item?.address ||
                        item?.name ||
                        item?.officer_name ||
                        "Officer not available"
                    : isMatchedAddress
                    ? item?.legal_name
                      ? `Matched with: ${item.legal_name}`
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
                    ? `New Phone: ${item?.address || "Not available"}`
                    : item?.fieldLabel === "Email"
                    ? `New Email: ${item?.address || "Not available"}`
                    : item?.fieldLabel === "Physical Address"
                    ? `New Physical Address: ${
                        item?.address || "Not available"
                      }`
                    : item?.fieldLabel === "Mailing Address"
                    ? `New Mailing Address: ${item?.address || "Not available"}`
                    : `New ${item?.fieldLabel}: ${
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
          {isMatchedOfficer && (
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
                  This {item?.fieldLabel?.toLowerCase()} is matched to a
                  different company
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
                  This {physicalAddress ? "physical" : "mailing"} address is
                  matched to a different company
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
                  This {item?.fieldLabel?.toLowerCase()} is matched to a
                  different company's {item?.fieldLabel?.toLowerCase()}
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
                  This {item?.fieldLabel?.toLowerCase()} has been changed
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
                  Your {isVirtualPhysical ? "physical" : "mailing"} address is
                  virtual
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
              {item?.addedTime && (
                <Box>
                  <Text
                    fontSize="12px"
                    color="#6B7280"
                    fontWeight="600"
                    mb="4px">
                    Changed Time:
                  </Text>
                  <Text fontSize="14px" color="#000" fontWeight="400">
                    {(() => {
                      try {
                        const date =
                          typeof item.addedTime === "string"
                            ? parseISO(item.addedTime)
                            : new Date(item.addedTime);
                        if (isValid(date)) {
                          return format(date, "MMM dd, yyyy");
                        }
                        return item.addedTime;
                      } catch {
                        return item.addedTime;
                      }
                    })()}
                  </Text>
                </Box>
              )}
            </VStack>
          ) : isMatchedAudit ? (
            <Box pl="10px">
              <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                {item?.fieldLabel}:
              </Text>
              <Text fontSize="14px" color="#000" lineHeight="1.6">
                {item?.address || "Not available"}
              </Text>
              {item?.guid && onNavigate && (
                <Button
                  size="sm"
                  bg="#EF6820"
                  color="white"
                  _hover={{bg: "#DC5A1A"}}
                  onClick={() =>
                    onNavigate(`/admin/company?id=${item.guid}`, {
                      replace: false,
                    })
                  }
                  mt="12px">
                  Carrier Profile
                </Button>
              )}
            </Box>
          ) : isMatchedOfficer ? (
            <Box pl="10px">
              <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                {item?.fieldLabel}:
              </Text>
              <Text fontSize="14px" color="#000" lineHeight="1.6">
                {item?.address ||
                  item?.name ||
                  item?.officer_name ||
                  item?.contact ||
                  "Not available"}
              </Text>
              {item?.legal_name && (
                <Box mt="12px">
                  <Text
                    fontSize="12px"
                    color="#6B7280"
                    fontWeight="600"
                    mb="4px">
                    Matched Company:
                  </Text>
                  <Text fontSize="14px" color="#000" lineHeight="1.6">
                    {item.legal_name}
                  </Text>
                </Box>
              )}
              {item?.guid && onNavigate && (
                <Button
                  size="sm"
                  bg="#EF6820"
                  color="white"
                  _hover={{bg: "#DC5A1A"}}
                  onClick={() =>
                    onNavigate(`/admin/company?id=${item.guid}`, {
                      replace: false,
                    })
                  }
                  mt="12px">
                  Carrier Profile
                </Button>
              )}
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
              {(item?.guid || item?.companies_id) && onNavigate && (
                <Button
                  size="sm"
                  bg="#EF6820"
                  color="white"
                  _hover={{bg: "#DC5A1A"}}
                  onClick={() =>
                    onNavigate(
                      `/admin/company?id=${item.guid || item.companies_id}`,
                      {
                        replace: false,
                      }
                    )
                  }
                  mt="12px">
                  Carrier Profile
                </Button>
              )}
            </Box>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
