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
} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";

export const InsightAddress = ({
  item,
  physicalAddress = false,
  mailingAddress = false,
  isAuditChange = false,
}) => {
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
                {isAuditChange
                  ? item?.fieldLabel === "Phone"
                    ? "Phone Changed"
                    : item?.fieldLabel === "Physical Address"
                    ? "Physical Address Changed"
                    : item?.fieldLabel === "Mailing Address"
                    ? "Mailing Address Changed"
                    : item?.fieldLabel
                  : item.address}
              </Text>
              {!isAuditChange && (
                <Text
                  color="#000"
                  fontSize="14px"
                  fontWeight="400"
                  textAlign="left">
                  {physicalAddress
                    ? "Physical Address"
                    : mailingAddress
                    ? "Mailing Address"
                    : "Virtual Address"}
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
          {isAuditChange ? (
            <Box pl="10px" lineHeight="1.6">
              <Box mb="12px">
                <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                  {item?.fieldLabel === "Phone"
                    ? "Old Phone:"
                    : item?.fieldLabel === "Physical Address"
                    ? "Old Physical Address:"
                    : item?.fieldLabel === "Mailing Address"
                    ? "Old Mailing Address:"
                    : `Old ${item?.fieldLabel}:`}
                </Text>
                <Text fontSize="14px" color="#000">
                  {item?.oldValue || "N/A"}
                </Text>
              </Box>
              <Box>
                <Text fontSize="12px" color="#6B7280" fontWeight="600" mb="4px">
                  {item?.fieldLabel === "Phone"
                    ? "New Phone:"
                    : item?.fieldLabel === "Physical Address"
                    ? "New Physical Address:"
                    : item?.fieldLabel === "Mailing Address"
                    ? "New Mailing Address:"
                    : `New ${item?.fieldLabel}:`}
                </Text>
                <Text fontSize="14px" color="#000">
                  {item?.address || "N/A"}
                </Text>
              </Box>
            </Box>
          ) : (
            <Text fontSize="14px" color="#000" pl="10px" lineHeight="1.6">
              {physicalAddress
                ? item?.physical_address
                : mailingAddress
                ? item?.mailing_address
                : item?.virtual_address}
            </Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
